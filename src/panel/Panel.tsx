import React, { useState, useEffect } from 'react';
import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';
import { darkTheme } from '@uiw/react-json-view/dark';
import { nordTheme } from '@uiw/react-json-view/nord';
import { githubLightTheme } from '@uiw/react-json-view/githubLight';
import { githubDarkTheme } from '@uiw/react-json-view/githubDark';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { gruvboxTheme } from '@uiw/react-json-view/gruvbox';
import { monokaiTheme } from '@uiw/react-json-view/monokai';
import { basicTheme } from '@uiw/react-json-view/basic';
import Settings from './Settings';
import type { PanelSettings, JsonViewSettings } from './Settings';

const themes = {
    lightTheme,
    darkTheme,
    nordTheme,
    githubLightTheme,
    githubDarkTheme,
    vscodeTheme,
    gruvboxTheme,
    monokaiTheme,
    basicTheme
};

interface InertiaPage {
    component: string;
    props: Record<string, any>;
    url: string;
    version: string | null;
}

const defaultJsonViewSettings: JsonViewSettings = {
    objectSortKeys: false,
    indentWidth: 2,
    displayObjectSize: true,
    displayDataTypes: true,
    enableClipboard: true,
    collapsed: 1,
    highlightUpdates: true,
    shortenTextAfterLength: 30,
    theme: 'vscodeTheme',
    fontSize: 14,
    quotesOnKeys: true,
    iconStyle: 'triangle',
};

const defaultSettings: PanelSettings = {
    appTheme: 'system',
    showRequestHistory: true,
    jsonView: defaultJsonViewSettings,
};

interface InertiaRequest {
    id: string;
    timestamp: number;
    method: string;
    url: string;
    component: string;
    props: Record<string, any>;
    headers: Record<string, string>;
    responseTime?: number;
}

const Panel: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<InertiaPage | null>(null);
    const [requests, setRequests] = useState<InertiaRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<InertiaRequest | null>(null);
    const [isInertiaDetected, setIsInertiaDetected] = useState(false);
    const [sortOrder, setSortOrder] = useState('desc');
    const [activeTab, setActiveTab] = useState('currentPage');
    const [settings, setSettings] = useState<PanelSettings>(defaultSettings);
    const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
    const [highlightSearch, setHighlightSearch] = useState<string>('');
    const tabId = chrome.devtools.inspectedWindow.tabId;

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
            chrome.storage.local.get([detectedKey, pageKey, requestsKey], (result) => {
                if (result[detectedKey]?.detected) {
                    setIsInertiaDetected(true);
                }
                if (result[pageKey]?.page) {
                    setCurrentPage(result[pageKey].page);
                }
                if (result[requestsKey]?.requests) {
                    setRequests(result[requestsKey].requests);
                }
            });
        };

        getInitialData();

        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange; }, areaName: string) => {
            if (areaName !== "local") return;

            if (changes[detectedKey]) {
                setIsInertiaDetected(changes[detectedKey].newValue?.detected);
            }
            if (changes[pageKey]) {
                setCurrentPage(changes[pageKey].newValue?.page);
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

    const jsonViewProps = {
        ...settings.jsonView,
        style: {
            ...themes[settings.jsonView.theme as keyof typeof themes],
            fontSize: `${settings.jsonView.fontSize}px`,
            padding: '12px',
            lineHeight: '1.4',
        },
        highlightSearch: highlightSearch,
    };

    if (!isInertiaDetected) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center p-8">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        No Inertia.js app detected
                    </h2>
                    <p className="text-gray-500">
                        Visit a page with an Inertia.js application to start debugging
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex h-full bg-white ${effectiveTheme === 'dark' ? 'dark bg-github-dark-bg text-github-dark-text' : ''}`}>
            {settings.showRequestHistory && (
                <div className="w-1/3 border-r dark:border-github-dark-border flex flex-col bg-white dark:bg-github-dark-bg-secondary">
                    <div className="p-4 border-b dark:border-github-dark-border bg-slate-50 dark:bg-github-dark-bg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold dark:text-github-dark-text">Request History</h3>
                                <p className="text-sm text-slate-600 dark:text-github-dark-text-secondary">{requests.length} requests</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => setSortOrder('desc')} className={`px-2 py-1 text-xs rounded ${sortOrder === 'desc' ? 'bg-sky-700 text-gray-100' : 'bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-button-text'}`}>Newest</button>
                                <button onClick={() => setSortOrder('asc')} className={`px-2 py-1 text-xs rounded ${sortOrder === 'asc' ? 'bg-sky-700 text-gray-100' : 'bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-button-text'}`}>Oldest</button>
                                <button onClick={handleClear} className="px-2 py-1 text-xs rounded bg-red-700 text-gray-100">Clear</button>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {requests
                            .slice()
                            .sort((a, b) => {
                                if (sortOrder === 'asc') {
                                    return a.timestamp - b.timestamp;
                                }
                                return b.timestamp - a.timestamp;
                            })
                            .map((request) => (
                                <div
                                    key={request.id}
                                    className={`p-3 border-b dark:border-github-dark-border cursor-pointer dark:hover:bg-slate-700 border-l-2 ${
                                        selectedRequest?.id === request.id ? 'border-blue-500' : 'border-transparent'
                                    }`}
                                    onClick={() => setSelectedRequest(request)}
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
                                        {request.component}
                                    </div>
                                    <div className="text-xs dark:text-github-dark-text-secondary truncate">
                                        {request.url}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            )}
            <div className="flex-1 flex flex-col bg-white dark:bg-github-dark-bg">
                <div className="border-b dark:border-github-dark-border bg-slate-50 dark:bg-github-dark-bg-secondary">
                    <nav className="flex items-center space-x-8 px-4">
                        <button
                            onClick={() => setActiveTab('currentPage')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'currentPage'
                                    ? 'border-sky-600 text-sky-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-github-dark-text-secondary dark:hover:text-github-dark-text'
                            }`}
                        >
                            Current page
                        </button>
                        <button
                            onClick={() => setActiveTab('requestDetails')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'requestDetails'
                                    ? 'border-sky-600 text-sky-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-github-dark-text-secondary dark:hover:text-github-dark-text'
                            }`}
                        >
                            Request details
                        </button>
                        <div className="flex-1" />
                        {['currentPage', 'requestDetails'].includes(activeTab) && (
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={highlightSearch}
                                    onChange={(e) => setHighlightSearch(e.target.value)}
                                    className="px-2 py-1 text-sm bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-text rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                        )}
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

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4">
                    {activeTab === 'currentPage' && currentPage && (
                        <div>
                            {/* Page Info */}
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
                                </div>
                            </div>

                            {/* Props Inspector */}
                            <div>
                                <h3 className="text-lg font-semibold dark:text-github-dark-text mb-3">Page Props</h3>
                                <div className="border dark:border-github-dark-border rounded-lg overflow-hidden">
                                    <JsonView
                                        value={currentPage.props || {}}
                                        {...jsonViewProps}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'currentPage' && !currentPage && (
                        <div className="text-center py-12">
                            <div className="text-slate-400 dark:text-github-dark-text-secondary text-lg">No page data available</div>
                        </div>
                    )}
                    {activeTab === 'requestDetails' && (
                        <div>
                            {selectedRequest ? (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold dark:text-github-dark-text mb-3">Request Details</h3>
                                        <div className="p-4 bg-slate-50 dark:bg-github-dark-bg-secondary rounded-lg">
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="font-medium dark:text-github-dark-text-secondary">Method:</span>
                                                    <span className="ml-2 font-mono dark:text-github-dark-text">{selectedRequest.method}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium dark:text-github-dark-text-secondary">URL:</span>
                                                    <span className="ml-2 dark:text-github-dark-text">{selectedRequest.url}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium dark:text-github-dark-text-secondary">Component:</span>
                                                    <span className="ml-2 font-mono dark:text-github-dark-text">{selectedRequest.component}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium dark:text-github-dark-text-secondary">Response time:</span>
                                                    <span className="ml-2 dark:text-github-dark-text">{selectedRequest.responseTime}ms</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold dark:text-github-dark-text mb-3">Headers</h3>
                                        <div className="border dark:border-github-dark-border rounded-lg overflow-hidden">
                                            <JsonView
                                                value={selectedRequest.headers || {}}
                                                displayDataTypes={false}
                                                enableClipboard={true}
                                                style={{ padding: '12px', fontSize: '13px' }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold dark:text-github-dark-text mb-3">Props</h3>
                                        <div className="border dark:border-github-dark-border rounded-lg overflow-hidden">
                                            <JsonView
                                                value={selectedRequest.props || {}}
                                                {...jsonViewProps}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-slate-400 dark:text-github-dark-text-secondary text-lg">Select a request from the history to see details.</div>
                                </div>
                            )}
                        </div>
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
