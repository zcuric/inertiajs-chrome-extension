import React, { useRef } from 'react';
import JsonView from '@uiw/react-json-view';
import Toolbar from './Toolbar';
import { themes } from './themes';
import type { InertiaRequest, PanelSettings } from './types';

interface FormsPanelProps {
    requests: InertiaRequest[];
    selectedRequest: InertiaRequest | null;
    onRequestSelect: (request: InertiaRequest) => void;
    onClear: () => void;
    highlightSearch: string;
    onSearchKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onToggleCollapse: () => void;
    onIndentChange: (amount: number) => void;
    onFontSizeChange: (amount: number) => void;
    settings: PanelSettings;
    onHighlightSearch: (search: string) => void;
}

const FormsPanel: React.FC<FormsPanelProps> = ({
    requests,
    selectedRequest,
    onRequestSelect,
    onClear,
    highlightSearch,
    onSearchKeyDown,
    onToggleCollapse,
    onIndentChange,
    onFontSizeChange,
    settings,
    onHighlightSearch
}) => {
    const formsContainerRef = useRef<HTMLDivElement>(null);

    const formRequests = requests.filter(r => ['POST', 'PUT', 'PATCH'].includes(r.method));

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
        <div className="flex h-full">
            <div className="w-1/3 border-r dark:border-github-dark-border flex flex-col">
                <div className="p-4 border-b dark:border-github-dark-border bg-slate-50 dark:bg-github-dark-bg flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold dark:text-github-dark-text">Form Submissions</h3>
                        <p className="text-sm text-slate-600 dark:text-github-dark-text-secondary">{formRequests.length} submissions</p>
                    </div>
                    <button onClick={onClear} className="px-2 py-1 text-xs rounded bg-red-700 text-gray-100">Clear</button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {formRequests.map((request) => (
                        <div
                            key={request.id}
                            className={`p-3 border-b dark:border-github-dark-border cursor-pointer dark:hover:bg-slate-700 border-l-4 ${
                                selectedRequest?.id === request.id ? 'border-sky-500' :
                                request.status === 'success' ? 'border-green-500' :
                                request.status === 'error' ? 'border-red-500' :
                                'border-transparent'
                            }`}
                            onClick={() => onRequestSelect(request)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-sm dark:text-github-dark-text-secondary">
                                    {request.method}
                                </span>
                                <span className="text-xs dark:text-github-dark-text-secondary">
                                    {new Date(request.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="text-sm font-medium dark:text-github-dark-text mt-1">
                                {request.component || 'Unknown'}
                            </div>
                            <div className="text-xs dark:text-github-dark-text-secondary truncate">
                                {request.url}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-2/3 flex-1 flex flex-col" ref={formsContainerRef}>
                {selectedRequest ? (
                    (() => {
                        const validationErrors = selectedRequest.errors || selectedRequest.props?.errors;
                        return (
                            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                {selectedRequest.data && (
                                    <div>
                                        <h3 className="text-lg font-semibold dark:text-github-dark-text mb-3">Form Data</h3>
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
                                            <JsonView value={selectedRequest.data} {...jsonViewProps}>
                                                {!quotesOnKeys && <JsonView.Quote render={() => <span />} />}
                                            </JsonView>
                                        </div>
                                    </div>
                                )}
                                {validationErrors && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-red-600 mb-3">Validation Errors</h3>
                                        <div className="border border-red-300 dark:border-red-700 rounded-lg overflow-hidden">
                                            <JsonView
                                                value={validationErrors}
                                                {...jsonViewProps}
                                                displayDataTypes={false}
                                                enableClipboard={true}
                                            >
                                                {!quotesOnKeys && <JsonView.Quote render={() => <span />} />}
                                            </JsonView>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })()
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-github-dark-text-secondary">
                        Select a submission from the timeline to view details.
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormsPanel;
