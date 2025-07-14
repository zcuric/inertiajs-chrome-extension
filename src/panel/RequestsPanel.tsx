import React, { useRef } from 'react';
import JsonView from '@uiw/react-json-view';
import Toolbar from './Toolbar';
import { themes } from './themes';
import type { InertiaRequest, PanelSettings } from './types';

interface RequestsPanelProps {
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
    effectiveTheme: 'light' | 'dark';
    onHighlightSearch: (search: string) => void;
}

const RequestsPanel: React.FC<RequestsPanelProps> = ({
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
    effectiveTheme,
    onHighlightSearch
}) => {
    const requestsContainerRef = useRef<HTMLDivElement>(null);

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
                        <h3 className="font-semibold dark:text-github-dark-text">Requests</h3>
                        <p className="text-sm text-slate-600 dark:text-github-dark-text-secondary">{requests.length} requests</p>
                    </div>
                    <button onClick={onClear} className="px-2 py-1 text-xs rounded bg-red-700 text-gray-100">Clear</button>
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
                            onClick={() => onRequestSelect(request)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="font-mono text-sm dark:text-github-dark-text-secondary">
                                        {request.method}
                                    </span>
                                    {request.isRedirect && <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900 px-1.5 py-0.5 rounded-full">REDIRECT</span>}
                                    {request.visitType === 'initial' && <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded-full">INITIAL</span>}
                                    {request.isPartial && <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900 px-1.5 py-0.5 rounded-full">PARTIAL</span>}
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
            <div className="w-2/3 flex-1 flex flex-col min-w-0" ref={requestsContainerRef}>
                {selectedRequest ? (
                    <div className="flex-1 overflow-y-auto overflow-x-auto p-4 space-y-6">
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
                                        <span className="ml-2 font-mono dark:text-github-dark-text truncate">{selectedRequest.method}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium dark:text-github-dark-text-secondary">URL:</span>
                                        <span className="ml-2 dark:text-github-dark-text truncate break-all">{selectedRequest.url}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium dark:text-github-dark-text-secondary">Component:</span>
                                        <span className="ml-2 font-mono dark:text-github-dark-text truncate break-all">{selectedRequest.component}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium dark:text-github-dark-text-secondary">Response time:</span>
                                        <span className="ml-2 dark:text-github-dark-text">{selectedRequest.responseTime}ms</span>
                                    </div>
                                </div>
                                {selectedRequest.isPartial && selectedRequest.only && (
                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                        <span className="font-medium dark:text-github-dark-text-secondary">Partially Loaded Props:</span>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {selectedRequest.only.map((prop: string) => (
                                                <span key={prop} className="px-2 py-1 text-xs font-mono bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">{prop}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold dark:text-github-dark-text mb-3">URL Analysis</h3>
                            <div className="p-4 bg-slate-50 dark:bg-github-dark-bg-secondary rounded-lg text-sm space-y-2">
                                <div>
                                    <span className="font-medium dark:text-github-dark-text-secondary">Full URL:</span>
                                    <span className="ml-2 font-mono dark:text-github-dark-text break-all truncate">{selectedRequest.url}</span>
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
                                        {...jsonViewProps}
                                        displayDataTypes={false}
                                        enableClipboard={true}
                                    >
                                        {!quotesOnKeys && <JsonView.Quote render={() => <span />} />}
                                    </JsonView>
                                </div>
                            </div>
                        )}
                        <div>
                            <h3 className="text-lg font-semibold dark:text-github-dark-text mb-3">Props</h3>
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
                                <JsonView
                                    value={selectedRequest.props || {}}
                                    {...jsonViewProps}
                                >
                                    {!quotesOnKeys && <JsonView.Quote render={() => <span />} />}
                                </JsonView>
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
    );
};

export default RequestsPanel;
