import React, { useState } from 'react';
import Settings from './Settings';
import RequestsPanel from './RequestsPanel';
import PagePanel from './PagePanel';
import FormsPanel from './FormsPanel';
import RoutesPanel from './RoutesPanel';
import { useSettings, useTheme, useInertiaData } from './hooks';
import { TAB_NAMES, PAGE_VIEWS, CSS_CLASSES, MESSAGES, EMOJIS } from './constants';

type TabName = typeof TAB_NAMES[keyof typeof TAB_NAMES];
type PageView = typeof PAGE_VIEWS[keyof typeof PAGE_VIEWS];

const Panel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabName>(TAB_NAMES.PAGE);
    const [activePageView, setActivePageView] = useState<PageView>(PAGE_VIEWS.PROPS);
    const tabId = chrome.devtools.inspectedWindow.tabId;

    // Use custom hooks for state management
    const {
        settings,
        handleSettingsChange,
        handleToggleCollapse,
        handleIndentChange,
        handleFontSizeChange,
    } = useSettings(tabId);

    const effectiveTheme = useTheme(settings);

    const {
        currentPage,
        requests,
        selectedRequest,
        isLoading,
        isInertiaDetected,
        framework,
        previousPage,
        setSelectedRequest,
        handleClear,
    } = useInertiaData(tabId);

    if (isLoading) {
        return (
            <div className={`${CSS_CLASSES.CENTER_CONTAINER} ${effectiveTheme === 'dark' ? CSS_CLASSES.LOADING_BG_DARK : CSS_CLASSES.LOADING_BG_LIGHT}`}>
                <div className="text-center p-8">
                    <div className="text-4xl mb-4 animate-pulse">{EMOJIS.LOADING}</div>
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-github-dark-text mb-2">
                        {MESSAGES.LOADING_TITLE}
                    </h2>
                    <p className="text-gray-500 dark:text-github-dark-text-secondary">
                        {MESSAGES.LOADING_SUBTITLE}
                    </p>
                </div>
            </div>
        );
    }

    if (!isInertiaDetected) {
        return (
            <div className={`${CSS_CLASSES.CENTER_CONTAINER} ${effectiveTheme === 'dark' ? CSS_CLASSES.LOADING_BG_DARK : CSS_CLASSES.LOADING_BG_LIGHT}`}>
                <div className="text-center p-8">
                    <div className="text-6xl mb-4">{EMOJIS.SEARCH}</div>
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-github-dark-text mb-2">
                        {MESSAGES.NOT_DETECTED_TITLE}
                    </h2>
                    <p className="text-gray-500 dark:text-github-dark-text-secondary">
                        {MESSAGES.NOT_DETECTED_SUBTITLE}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex h-full bg-white ${effectiveTheme === 'dark' ? 'dark bg-github-dark-bg text-github-dark-text' : ''}`}>
            <div className="flex-1 flex flex-col bg-white dark:bg-github-dark-bg">
                <div className="border-b dark:border-github-dark-border bg-slate-50 dark:bg-github-dark-bg">
                    <nav className="flex items-center space-x-8 px-4">
                        <button
                            onClick={() => setActiveTab(TAB_NAMES.PAGE)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === TAB_NAMES.PAGE
                                    ? CSS_CLASSES.TAB_ACTIVE
                                    : CSS_CLASSES.TAB_INACTIVE
                            }`}
                        >
                            Page
                        </button>
                        <button
                            onClick={() => setActiveTab(TAB_NAMES.REQUESTS)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === TAB_NAMES.REQUESTS
                                    ? CSS_CLASSES.TAB_ACTIVE
                                    : CSS_CLASSES.TAB_INACTIVE
                            }`}
                        >
                            Requests
                        </button>
                        <button
                            onClick={() => setActiveTab(TAB_NAMES.FORMS)}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === TAB_NAMES.FORMS
                                    ? CSS_CLASSES.TAB_ACTIVE
                                    : CSS_CLASSES.TAB_INACTIVE
                            }`}
                        >
                            Forms
                        </button>
                        {currentPage?.props?.ziggy && (
                            <button
                                onClick={() => setActiveTab(TAB_NAMES.ROUTES)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === TAB_NAMES.ROUTES
                                        ? CSS_CLASSES.TAB_ACTIVE
                                        : CSS_CLASSES.TAB_INACTIVE
                                }`}
                            >
                                Routes
                            </button>
                        )}
                        <div className="flex-1" />
                        <button
                            onClick={() => setActiveTab(TAB_NAMES.SETTINGS)}
                            className={`${CSS_CLASSES.BUTTON_SETTINGS} ${
                                activeTab === TAB_NAMES.SETTINGS ? 'bg-slate-200 dark:bg-github-dark-button-hover-bg' : ''
                            }`}
                        >
                            {EMOJIS.SETTINGS}
                        </button>
                    </nav>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {activeTab === TAB_NAMES.REQUESTS && (
                        <RequestsPanel
                            requests={requests}
                            selectedRequest={selectedRequest}
                            onRequestSelect={setSelectedRequest}
                            onClear={handleClear}
                            onToggleCollapse={handleToggleCollapse}
                            onIndentChange={handleIndentChange}
                            onFontSizeChange={handleFontSizeChange}
                            settings={settings}
                            effectiveTheme={effectiveTheme}
                        />
                    )}
                    {activeTab === TAB_NAMES.PAGE && currentPage && (
                        <PagePanel
                            currentPage={currentPage}
                            previousPage={previousPage}
                            framework={framework}
                            activePageView={activePageView}
                            setActivePageView={setActivePageView}
                            onToggleCollapse={handleToggleCollapse}
                            onIndentChange={handleIndentChange}
                            onFontSizeChange={handleFontSizeChange}
                            settings={settings}
                        />
                    )}
                    {activeTab === TAB_NAMES.FORMS && (
                        <FormsPanel
                            requests={requests}
                            selectedRequest={selectedRequest}
                            onRequestSelect={setSelectedRequest}
                            onClear={handleClear}
                            onToggleCollapse={handleToggleCollapse}
                            onIndentChange={handleIndentChange}
                            onFontSizeChange={handleFontSizeChange}
                            settings={settings}
                        />
                    )}
                    {activeTab === TAB_NAMES.ROUTES && currentPage?.props?.ziggy && (
                        <RoutesPanel currentPage={currentPage} />
                    )}
                    {activeTab === TAB_NAMES.SETTINGS && (
                        <Settings settings={settings} onSettingsChange={handleSettingsChange} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Panel;
