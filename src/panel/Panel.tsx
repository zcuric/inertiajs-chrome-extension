import React, { useState, useEffect, useRef } from 'react';
import Settings from './Settings';
import type { PanelSettings, JsonViewSettings } from './Settings';
import RequestsPanel from './RequestsPanel';
import PagePanel from './PagePanel';
import FormsPanel from './FormsPanel';
import RoutesPanel from './RoutesPanel';
import type { InertiaPage, InertiaRequest } from './types';





const defaultJsonViewSettings: JsonViewSettings = {
    objectSortKeys: false,
    indentWidth: 2,
    displayObjectSize: true,
    displayDataTypes: true,
    enableClipboard: true,
    collapsed: false,
    highlightUpdates: true,
    shortenTextAfterLength: 0,
    theme: 'vscodeTheme',
    fontSize: 14,
    quotesOnKeys: true,
};

const defaultSettings: PanelSettings = {
    appTheme: 'system',
    jsonView: defaultJsonViewSettings,
};



const Panel: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<InertiaPage | null>(null);
    const [requests, setRequests] = useState<InertiaRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<InertiaRequest | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInertiaDetected, setIsInertiaDetected] = useState(false);
    const [framework, setFramework] = useState<{ name: string, version?: string } | null>(null);
    const [activeTab, setActiveTab] = useState('page');
    const [activePageView, setActivePageView] = useState('props');
    const [settings, setSettings] = useState<PanelSettings>(defaultSettings);
    const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
    const [highlightSearch, setHighlightSearch] = useState('');
    const tabId = chrome.devtools.inspectedWindow.tabId;
    const [previousPage, setPreviousPage] = useState<InertiaPage | null>(null);

    const handleClear = () => {
        setRequests([]);
        setSelectedRequest(null);
        chrome.runtime.sendMessage({
            type: 'CLEAR_INERTIA_REQUESTS',
            tabId: tabId,
        });
    };

    useEffect(() => {
        const settingsKey = `inertia-settings-${tabId}`;
        chrome.storage.local.get(settingsKey, (result) => {
            if (result[settingsKey]?.settings) {
                setSettings({ ...defaultSettings, ...result[settingsKey].settings });
            }
        });
    }, [tabId]);

    const handleSettingsChange = (newSettings: PanelSettings) => {
        setSettings(newSettings);
        const settingsKey = `inertia-settings-${tabId}`;
        chrome.storage.local.set({ [settingsKey]: { settings: newSettings } });
    };

    useEffect(() => {
        if (settings.appTheme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            setEffectiveTheme(mediaQuery.matches ? 'dark' : 'light');

            const handler = (e: MediaQueryListEvent) => {
                setEffectiveTheme(e.matches ? 'dark' : 'light');
            };

            mediaQuery.addEventListener('change', handler);

            return () => mediaQuery.removeEventListener('change', handler);
        } else {
            setEffectiveTheme(settings.appTheme);
        }
    }, [settings.appTheme]);



    useEffect(() => {
        const detectedKey = `inertia-detected-${tabId}`;
        const pageKey = `inertia-page-${tabId}`;
        const requestsKey = `inertia-requests-${tabId}`;

        const getInitialData = () => {
            // Set a timeout to prevent indefinite loading state
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 2000);

            chrome.storage.local.get([detectedKey, pageKey, requestsKey], (result) => {
                clearTimeout(timer);
                if (result[detectedKey]?.detected) {
                    setIsInertiaDetected(true);
                    setFramework(result[detectedKey]?.framework);
                }
                if (result[pageKey]?.page) {
                    setCurrentPage(result[pageKey].page);
                }
                if (result[requestsKey]?.requests) {
                    setRequests(result[requestsKey].requests);
                }
                setIsLoading(false);
            });
        };

        getInitialData();

        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange; }, areaName: string) => {
            if (areaName !== "local") return;

            if (changes[detectedKey]) {
                setIsInertiaDetected(changes[detectedKey].newValue?.detected);
                setFramework(changes[detectedKey].newValue?.framework);
            }
            if (changes[pageKey]) {
                setCurrentPage(prev => {
                    setPreviousPage(prev);
                    return changes[pageKey].newValue?.page;
                });
            }
            if (changes[requestsKey]) {
                setRequests(changes[requestsKey].newValue?.requests || []);
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, [tabId]);



    const handleToggleCollapse = () => {
        const currentCollapsed = settings.jsonView.collapsed;
        const newCollapsed = currentCollapsed === false ? 1 : false;
        handleSettingsChange({
            ...settings,
            jsonView: { ...settings.jsonView, collapsed: newCollapsed },
        });
    };

    const handleIndentChange = (amount: number) => {
        handleSettingsChange({
            ...settings,
            jsonView: { ...settings.jsonView, indentWidth: Math.max(0, settings.jsonView.indentWidth + amount) },
        });
    };

    const handleFontSizeChange = (amount: number) => {
        handleSettingsChange({
            ...settings,
            jsonView: { ...settings.jsonView, fontSize: Math.max(8, settings.jsonView.fontSize + amount) },
        });
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Search functionality is now handled by individual panel components
    };



    if (isLoading) {
        return (
            <div className={`flex items-center justify-center h-full ${effectiveTheme === 'dark' ? 'dark bg-github-dark-bg' : 'bg-gray-50'}`}>
                <div className="text-center p-8">
                    <div className="text-4xl mb-4 animate-pulse">⏳</div>
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-github-dark-text mb-2">
                        Looking for Inertia.js...
                    </h2>
                    <p className="text-gray-500 dark:text-github-dark-text-secondary">
                        Waiting for the page to finish loading.
                    </p>
                </div>
            </div>
        );
    }

    if (!isInertiaDetected) {
        return (
            <div className={`flex items-center justify-center h-full ${effectiveTheme === 'dark' ? 'dark bg-github-dark-bg' : 'bg-gray-50'}`}>
                <div className="text-center p-8">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-xl font-semibold text-gray-700 dark:text-github-dark-text mb-2">
                        No Inertia.js app detected
                    </h2>
                    <p className="text-gray-500 dark:text-github-dark-text-secondary">
                        Visit a page with an Inertia.js application to start debugging
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
                            onClick={() => setActiveTab('page')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'page'
                                    ? 'border-sky-600 text-sky-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-github-dark-text-secondary dark:hover:text-github-dark-text'
                            }`}
                        >
                            Page
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'requests'
                                    ? 'border-sky-600 text-sky-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-github-dark-text-secondary dark:hover:text-github-dark-text'
                            }`}
                        >
                            Requests
                        </button>
                        <button
                            onClick={() => setActiveTab('forms')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'forms'
                                    ? 'border-sky-600 text-sky-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-github-dark-text-secondary dark:hover:text-github-dark-text'
                            }`}
                        >
                            Forms
                        </button>
                        {currentPage?.props?.ziggy && (
                            <button
                                onClick={() => setActiveTab('routes')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'routes'
                                        ? 'border-sky-600 text-sky-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-github-dark-text-secondary dark:hover:text-github-dark-text'
                                }`}
                            >
                                Routes
                            </button>
                        )}
                        <div className="flex-1" />
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`p-2 rounded-full text-slate-500 dark:text-github-dark-text-secondary hover:bg-slate-200 dark:hover:bg-github-dark-button-hover-bg ${
                                activeTab === 'settings' ? 'bg-slate-200 dark:bg-github-dark-button-hover-bg' : ''
                            }`}
                        >
                            ⚙️
                        </button>
                    </nav>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {activeTab === 'requests' && (
                        <RequestsPanel
                            requests={requests}
                            selectedRequest={selectedRequest}
                            onRequestSelect={setSelectedRequest}
                            onClear={handleClear}
                            highlightSearch={highlightSearch}
                            onSearchKeyDown={handleSearchKeyDown}
                            onToggleCollapse={handleToggleCollapse}
                            onIndentChange={handleIndentChange}
                            onFontSizeChange={handleFontSizeChange}
                            settings={settings}
                            effectiveTheme={effectiveTheme}
                            onHighlightSearch={setHighlightSearch}
                        />
                    )}
                    {activeTab === 'page' && currentPage && (
                        <PagePanel
                            currentPage={currentPage}
                            previousPage={previousPage}
                            framework={framework}
                            activePageView={activePageView}
                            setActivePageView={setActivePageView}
                            highlightSearch={highlightSearch}
                            onSearchKeyDown={handleSearchKeyDown}
                            onToggleCollapse={handleToggleCollapse}
                            onIndentChange={handleIndentChange}
                            onFontSizeChange={handleFontSizeChange}
                            settings={settings}
                            onHighlightSearch={setHighlightSearch}
                        />
                    )}
                    {activeTab === 'forms' && (
                        <FormsPanel
                            requests={requests}
                            selectedRequest={selectedRequest}
                            onRequestSelect={setSelectedRequest}
                            onClear={handleClear}
                            highlightSearch={highlightSearch}
                            onSearchKeyDown={handleSearchKeyDown}
                            onToggleCollapse={handleToggleCollapse}
                            onIndentChange={handleIndentChange}
                            onFontSizeChange={handleFontSizeChange}
                            settings={settings}
                            onHighlightSearch={setHighlightSearch}
                        />
                    )}
                    {activeTab === 'routes' && currentPage?.props?.ziggy && (
                        <RoutesPanel currentPage={currentPage} />
                    )}
                    {activeTab === 'settings' && (
                        <Settings settings={settings} onSettingsChange={handleSettingsChange} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Panel;
