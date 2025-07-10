import React, { useState, useEffect, useRef } from 'react';
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
import Toolbar from './Toolbar';

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
    collapsed: false,
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
    status: 'success' | 'error' | 'pending';
    errors?: Record<string, string>;
    visitType: 'initial' | 'navigate';
    isRedirect: boolean;
}

const Panel: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<InertiaPage | null>(null);
    const [requests, setRequests] = useState<InertiaRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<InertiaRequest | null>(null);
    const [isInertiaDetected, setIsInertiaDetected] = useState(false);
    const [activeTab, setActiveTab] = useState('component');
    const [activeComponentTab, setActiveComponentTab] = useState('props');
    const [settings, setSettings] = useState<PanelSettings>(defaultSettings);
    const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');
    const [highlightSearch, setHighlightSearch] = useState('');
    const tabId = chrome.devtools.inspectedWindow.tabId;
    const jsonViewRef = useRef<HTMLDivElement>(null);
    const jsonViewRef2 = useRef<HTMLDivElement>(null);
    const [matchingPaths, setMatchingPaths] = useState<string[][]>([]);
    const [searchResultIndex, setSearchResultIndex] = useState(0);
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
        const unhighlight = (element: HTMLElement) => {
            const marks = element.querySelectorAll('mark');
            marks.forEach(mark => {
                const parent = mark.parentNode;
                if (parent) {
                    parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
                    parent.normalize();
                }
            });
        };

        const highlight = (element: HTMLElement, searchTerm: string) => {
            if (!searchTerm) return;
            const regex = new RegExp(searchTerm, 'gi');
            const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
            let node: Node | null;
            const nodesToReplace: { parent: Node, oldNode: Node, newNode: Node }[] = [];

            while (node = walker.nextNode()) {
                const currentNode = node;
                if (currentNode.parentElement?.tagName === 'MARK') continue;
                if (regex.test(currentNode.textContent || '')) {
                    const parent = currentNode.parentNode;
                    if (!parent) continue;

                    const fragment = document.createDocumentFragment();
                    let lastIndex = 0;
                    (currentNode.textContent || '').replace(regex, (match, offset) => {
                        fragment.appendChild(document.createTextNode((currentNode.textContent || '').slice(lastIndex, offset)));
                        const mark = document.createElement('mark');
                        mark.textContent = match;
                        fragment.appendChild(mark);
                        lastIndex = offset + match.length;
                        return match;
                    });
                    fragment.appendChild(document.createTextNode((currentNode.textContent || '').slice(lastIndex)));
                    nodesToReplace.push({ parent, oldNode: currentNode, newNode: fragment });
                }
            }
            nodesToReplace.forEach(({ parent, oldNode, newNode }) => {
                parent.replaceChild(newNode, oldNode);
            });
        };

        const ref = activeTab === 'component' ? jsonViewRef : jsonViewRef2;
        const container = ref.current;

        if (!container) return;

        unhighlight(container);

        if (highlightSearch) {
            highlight(container, highlightSearch);
            const highlightedNodes = container.querySelectorAll('mark');
            if (highlightedNodes.length > 0) {
                const activeNode = highlightedNodes[searchResultIndex % highlightedNodes.length];
                activeNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
                activeNode.classList.add('active-highlight');
            }
        }
    }, [highlightSearch, activeTab, currentPage, selectedRequest, searchResultIndex, activeComponentTab]);

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

    useEffect(() => {
        if (!highlightSearch) {
            setMatchingPaths([]);
            setSearchResultIndex(0);
            return;
        }

        const data = activeTab === 'currentPage' ? currentPage?.props : selectedRequest?.props;

        if (!data) {
            setMatchingPaths([]);
            setSearchResultIndex(0);
            return;
        }

        const findPaths = (value: any, currentPath: string[] = []): string[][] => {
            let paths: string[][] = [];

            if (typeof value === 'object' && value !== null) {
                for (const key in value) {
                    if (Object.prototype.hasOwnProperty.call(value, key)) {
                        const newPath = [...currentPath, key];
                        if (String(key).toLowerCase().includes(highlightSearch.toLowerCase())) {
                            paths.push(newPath);
                        }
                        paths = paths.concat(findPaths(value[key], newPath));
                    }
                }
            } else if (value !== null && value !== undefined) {
                if (String(value).toLowerCase().includes(highlightSearch.toLowerCase())) {
                    paths.push(currentPath);
                }
            }

            return paths;
        };

        setMatchingPaths(findPaths(data));
        setSearchResultIndex(0);
    }, [highlightSearch, currentPage, selectedRequest, activeTab]);

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
        if (e.key === 'Enter') {
            e.preventDefault();
            const ref = activeTab === 'currentPage' ? jsonViewRef : jsonViewRef2;
            const container = ref.current;
            if (!container) return;

            const highlightedNodes = container.querySelectorAll('mark');
            if (highlightedNodes.length === 0) return;

            if (e.shiftKey) {
                setSearchResultIndex((prevIndex) => (prevIndex - 1 + highlightedNodes.length) % highlightedNodes.length);
            } else {
                setSearchResultIndex((prevIndex) => (prevIndex + 1) % highlightedNodes.length);
            }
        }
    };

    const jsonViewProps = {
        ...settings.jsonView,
        style: {
            ...themes[settings.jsonView.theme as keyof typeof themes],
            fontSize: `${settings.jsonView.fontSize}px`,
            padding: '12px',
            lineHeight: '1.4',
        },
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
            <div className="flex-1 flex flex-col bg-white dark:bg-github-dark-bg">
                <div className="border-b dark:border-github-dark-border bg-slate-50 dark:bg-github-dark-bg-secondary">
                    <nav className="flex items-center space-x-8 px-4">
                        <button
                            onClick={() => setActiveTab('component')}
                            className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'component'
                                    ? 'border-sky-600 text-sky-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-github-dark-text-secondary dark:hover:text-github-dark-text'
                            }`}
                        >
                            Component
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
                    {activeTab === 'component' && (
                        currentPage ? (
                            <div>
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
                                <div className="border-t dark:border-github-dark-border mt-4">
                                    <nav className="flex items-center space-x-4 px-2 -mb-px">
                                        <button
                                            onClick={() => setActiveComponentTab('props')}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeComponentTab === 'props' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-600'}`}
                                        >
                                            Props
                                        </button>
                                        <button
                                            onClick={() => setActiveComponentTab('shared')}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeComponentTab === 'shared' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-600'}`}
                                        >
                                            Shared
                                        </button>
                                        <button
                                            onClick={() => setActiveComponentTab('diff')}
                                            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeComponentTab === 'diff' ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-600'}`}
                                        >
                                            Diff
                                        </button>
                                    </nav>
                                </div>
                                <div className="mt-4">
                                    <div className="border dark:border-github-dark-border rounded-lg overflow-hidden">
                                        <Toolbar
                                            onSearch={setHighlightSearch}
                                            onKeyDown={handleSearchKeyDown}
                                            onToggleCollapse={handleToggleCollapse}
                                            onIndentIncrease={() => handleIndentChange(1)}
                                            onIndentDecrease={() => handleIndentChange(-1)}
                                            onFontSizeIncrease={() => handleFontSizeChange(1)}
                                            onFontSizeDecrease={() => handleFontSizeChange(-1)}
                                            isCollapsed={settings.jsonView.collapsed !== false}
                                        />
                                        {activeComponentTab === 'props' &&
                                            <JsonView ref={jsonViewRef} value={currentPage.props || {}} {...jsonViewProps} />
                                        }
                                        {activeComponentTab === 'shared' &&
                                            <JsonView ref={jsonViewRef} value={getSharedData()} {...jsonViewProps} />
                                        }
                                        {activeComponentTab === 'diff' &&
                                            <JsonView ref={jsonViewRef} oldValue={previousPage?.props || {}} value={currentPage.props || {}} {...jsonViewProps as any} />
                                        }
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-slate-400 dark:text-github-dark-text-secondary text-lg">No page data available</div>
                            </div>
                        )
                    )}
                    {activeTab === 'requests' && (
                        <div className="flex h-full">
                            <div className="w-1/3 border-r dark:border-github-dark-border flex flex-col">
                                <div className="p-4 border-b dark:border-github-dark-border bg-slate-50 dark:bg-github-dark-bg flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold dark:text-github-dark-text">Requests</h3>
                                        <p className="text-sm text-slate-600 dark:text-github-dark-text-secondary">{requests.length} requests</p>
                                    </div>
                                    <button onClick={handleClear} className="px-2 py-1 text-xs rounded bg-red-700 text-gray-100">Clear</button>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {requests.map((request) => (
                                        <div
                                            key={request.id}
                                            className={`p-3 border-b dark:border-github-dark-border cursor-pointer dark:hover:bg-slate-700 border-l-4 ${
                                                selectedRequest?.id === request.id ? 'border-sky-500' :
                                                request.status === 'success' ? 'border-green-500' :
                                                request.status === 'error' ? 'border-red-500' :
                                                'border-transparent'
                                            }`}
                                            onClick={() => setSelectedRequest(request)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-mono text-sm dark:text-github-dark-text-secondary">
                                                        {request.method}
                                                    </span>
                                                    {request.isRedirect && <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900 px-1.5 py-0.5 rounded-full">REDIRECT</span>}
                                                    {request.visitType === 'initial' && <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded-full">INITIAL</span>}
                                                </div>
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
                            <div className="w-2/3 flex-1 flex flex-col">
                                {selectedRequest ? (
                                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                         <div>
                                            <h3 className="text-lg font-semibold dark:text-github-dark-text mb-3">Request Details</h3>
                                            <div className="p-4 bg-slate-50 dark:bg-github-dark-bg-secondary rounded-lg">
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="font-medium dark:text-github-dark-text-secondary">Status:</span>
                                                        <span className={`ml-2 font-mono ${selectedRequest.status === 'success' ? 'text-green-600' : selectedRequest.status === 'error' ? 'text-red-600' : 'text-slate-600'}`}>{selectedRequest.status}</span>
                                                    </div>
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
                                            <h3 className="text-lg font-semibold dark:text-github-dark-text mb-3">URL Analysis</h3>
                                            <div className="p-4 bg-slate-50 dark:bg-github-dark-bg-secondary rounded-lg text-sm space-y-2">
                                                <div>
                                                    <span className="font-medium dark:text-github-dark-text-secondary">Full URL:</span>
                                                    <span className="ml-2 font-mono dark:text-github-dark-text break-all">{selectedRequest.url}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium dark:text-github-dark-text-secondary">Query Parameters:</span>
                                                    <div className="mt-1 pl-4">
                                                        {((): JSX.Element => {
                                                            try {
                                                                const params = Array.from(new URL(selectedRequest.url, window.location.origin).searchParams.entries());
                                                                if (params.length === 0) return <span className="text-slate-500 dark:text-github-dark-text-secondary ml-2">None</span>;
                                                                return (
                                                                    <table className="w-full text-left">
                                                                        <tbody>
                                                                        {params.map(([key, value]) => (
                                                                            <tr key={key}>
                                                                                <td className="pr-4 font-mono dark:text-github-dark-text-secondary">{key}</td>
                                                                                <td className="font-mono dark:text-github-dark-text">{value}</td>
                                                                            </tr>
                                                                        ))}
                                                                        </tbody>
                                                                    </table>
                                                                )
                                                            } catch (e) {
                                                                return <span className="text-slate-500 dark:text-github-dark-text-secondary ml-2">Invalid URL</span>
                                                            }
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {selectedRequest.errors && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-red-600 mb-3">Errors</h3>
                                                <div className="border border-red-300 dark:border-red-700 rounded-lg overflow-hidden">
                                                    <JsonView
                                                        value={selectedRequest.errors}
                                                        displayDataTypes={false}
                                                        enableClipboard={true}
                                                        style={{ padding: '12px' }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-lg font-semibold dark:text-github-dark-text mb-3">Props</h3>
                                            <div className="border dark:border-github-dark-border rounded-lg overflow-hidden">
                                                 <Toolbar
                                                    onSearch={setHighlightSearch}
                                                    onKeyDown={handleSearchKeyDown}
                                                    onToggleCollapse={handleToggleCollapse}
                                                    onIndentIncrease={() => handleIndentChange(1)}
                                                    onIndentDecrease={() => handleIndentChange(-1)}
                                                    onFontSizeIncrease={() => handleFontSizeChange(1)}
                                                    onFontSizeDecrease={() => handleFontSizeChange(-1)}
                                                    isCollapsed={settings.jsonView.collapsed !== false}
                                                />
                                                <JsonView
                                                    value={selectedRequest.props || {}}
                                                    ref={jsonViewRef2}
                                                    {...jsonViewProps}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-github-dark-text-secondary">
                                        Select a request from the timeline to view details.
                                    </div>
                                )}
                            </div>
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
