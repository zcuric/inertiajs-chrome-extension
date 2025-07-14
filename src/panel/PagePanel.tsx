import React, { useRef } from 'react';
import JsonView from '@uiw/react-json-view';
import Toolbar from './Toolbar';
import { themes } from './themes';
import type { InertiaPage, PanelSettings } from './types';

interface PagePanelProps {
    currentPage: InertiaPage;
    previousPage: InertiaPage | null;
    framework: { name: string, version?: string } | null;
    activePageView: string;
    setActivePageView: (view: string) => void;
    highlightSearch: string;
    onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onToggleCollapse: () => void;
    onIndentChange: (amount: number) => void;
    onFontSizeChange: (amount: number) => void;
    settings: PanelSettings;
    onHighlightSearch: (search: string) => void;
}

const PagePanel: React.FC<PagePanelProps> = ({
    currentPage,
    previousPage,
    framework,
    activePageView,
    setActivePageView,
    highlightSearch,
    onSearchKeyDown,
    onToggleCollapse,
    onIndentChange,
    onFontSizeChange,
    settings,
    onHighlightSearch
}) => {
    const pageContainerRef = useRef<HTMLDivElement>(null);

    const getDeferredData = () => {
        if (!currentPage) return {};

        const deferredKeys = Object.keys(currentPage.props).filter(key => {
            if (previousPage) {
                // A prop is likely deferred if it was null/undefined on the previous page and now has a value
                return (previousPage.props[key] === null || typeof previousPage.props[key] === 'undefined') && currentPage.props[key] !== null && typeof currentPage.props[key] !== 'undefined';
            }
            // Fallback for initial load: find props that are objects with no keys, a common pattern for deferred placeholders.
            return typeof currentPage.props[key] === 'object' && currentPage.props[key] !== null && Object.keys(currentPage.props[key]).length === 0;
        });

        return deferredKeys.reduce((acc, key) => {
            acc[key] = currentPage.props[key];
            return acc;
        }, {} as Record<string, any>);
    };

    const getSharedData = () => {
        if (!currentPage || !previousPage) return {};

        const currentKeys = Object.keys(currentPage.props);
        const prevKeys = Object.keys(previousPage.props);
        const sharedKeys = currentKeys.filter(key => prevKeys.includes(key) && JSON.stringify(currentPage.props[key]) === JSON.stringify(previousPage.props[key]));

        return sharedKeys.reduce((acc, key) => {
            acc[key] = currentPage.props[key];
            return acc;
        }, {} as Record<string, any>);
    };

    const { quotesOnKeys, ...restJsonViewSettings } = settings.jsonView;

    const jsonViewProps = {
        ...restJsonViewSettings,
        style: {
            ...themes[settings.jsonView.theme as keyof typeof themes],
            fontSize: `${settings.jsonView.fontSize}px`,
            padding: '12px',
            lineHeight: '1.4',
        },
    };

    return (
        <div ref={pageContainerRef}>
            <div className="mb-6 p-4 bg-slate-50 dark:bg-github-dark-bg-secondary rounded-lg">
                <h3 className="text-lg font-semibold dark:text-github-dark-text mb-2">Current Page</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="font-medium dark:text-github-dark-text-secondary">Component:</span>
                        <span className="ml-2 font-mono dark:text-github-dark-text">{currentPage.component}</span>
                    </div>
                    <div>
                        <span className="font-medium dark:text-github-dark-text-secondary">URL:</span>
                        <span className="ml-2 dark:text-github-dark-text">{currentPage.url}</span>
                    </div>
                    {currentPage.version && (
                        <div>
                            <span className="font-medium dark:text-github-dark-text-secondary">Version:</span>
                            <span className="ml-2 font-mono dark:text-github-dark-text">{currentPage.version}</span>
                        </div>
                    )}
                    {framework && (
                        <div>
                            <span className="font-medium dark:text-github-dark-text-secondary">Framework:</span>
                            <span className="ml-2 font-mono dark:text-github-dark-text">{framework.name} {framework.version}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="border-t dark:border-github-dark-border mt-4">
                <nav className="flex items-center space-x-4 px-2 -mb-px">
                    <button
                        onClick={() => setActivePageView('props')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activePageView === 'props' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-600'}`}
                    >
                        Props
                    </button>
                    <button
                        onClick={() => setActivePageView('shared')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activePageView === 'shared' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-600'}`}
                    >
                        Shared
                    </button>
                    <button
                        onClick={() => setActivePageView('deferred')}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activePageView === 'deferred' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-600'}`}
                    >
                        Deferred
                    </button>
                </nav>
            </div>
            <div className="mt-4">
                <div className="border dark:border-github-dark-border rounded-lg overflow-hidden">
                    <Toolbar
                        onSearch={onHighlightSearch}
                        onKeyDown={onSearchKeyDown}
                        onToggleCollapse={onToggleCollapse}
                        onIndentIncrease={() => onIndentChange(1)}
                        onIndentDecrease={() => onIndentChange(-1)}
                        onFontSizeIncrease={() => onFontSizeChange(1)}
                        onFontSizeDecrease={() => onFontSizeChange(-1)}
                        isCollapsed={settings.jsonView.collapsed !== false}
                    />
                    {activePageView === 'props' &&
                        <JsonView value={currentPage.props || {}} {...jsonViewProps}>
                            {!quotesOnKeys && <JsonView.Quote render={() => <span />} />}
                        </JsonView>
                    }
                    {activePageView === 'shared' &&
                        <JsonView value={getSharedData()} {...jsonViewProps}>
                            {!quotesOnKeys && <JsonView.Quote render={() => <span />} />}
                        </JsonView>
                    }
                    {activePageView === 'deferred' &&
                        <JsonView value={getDeferredData()} {...jsonViewProps}>
                            {!quotesOnKeys && <JsonView.Quote render={() => <span />} />}
                        </JsonView>
                    }
                </div>
            </div>
        </div>
    );
};

export default PagePanel;
