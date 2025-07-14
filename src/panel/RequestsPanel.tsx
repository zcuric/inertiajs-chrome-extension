import React, { useRef, useState, useEffect, useMemo } from 'react';
import JsonView from '@uiw/react-json-view';
import Toolbar from './Toolbar';
import { themes } from './themes';
import type { InertiaRequest, PanelSettings } from './types';

interface RequestsPanelProps {
    requests: InertiaRequest[];
    selectedRequest: InertiaRequest | null;
    onRequestSelect: (request: InertiaRequest) => void;
    onClear: () => void;
    onToggleCollapse: () => void;
    onIndentChange: (amount: number) => void;
    onFontSizeChange: (amount: number) => void;
    settings: PanelSettings;
    effectiveTheme: 'light' | 'dark';
}

// Utility function to filter JSON data based on search term
const filterJsonData = (data: any, searchTerm: string): any => {
    if (!searchTerm || !searchTerm.trim()) return data;

    const search = searchTerm.toLowerCase().trim();

    // Check if this is a nested property search (contains dots)
    if (search.includes('.')) {
        return filterByPath(data, search);
    }

    // Original filtering logic for simple searches
    const filterValue = (value: any, key?: string): any => {
        // Check if key matches search term
        const keyMatches = key && key.toLowerCase().includes(search);

        if (value === null || value === undefined) {
            return keyMatches ? value : undefined;
        }

        if (typeof value === 'string') {
            return (keyMatches || value.toLowerCase().includes(search)) ? value : undefined;
        }

        if (typeof value === 'number' || typeof value === 'boolean') {
            return (keyMatches || value.toString().toLowerCase().includes(search)) ? value : undefined;
        }

        if (Array.isArray(value)) {
            const filteredArray = value
                .map((item, index) => filterValue(item, index.toString()))
                .filter(item => item !== undefined);

            return (keyMatches || filteredArray.length > 0) ? filteredArray : undefined;
        }

        if (typeof value === 'object') {
            // If the key matches, return the entire object without filtering its children
            if (keyMatches) {
                return value;
            }

            const filteredObject: any = {};
            let hasMatches = false;

            for (const [objKey, objValue] of Object.entries(value)) {
                const filteredValue = filterValue(objValue, objKey);
                if (filteredValue !== undefined) {
                    filteredObject[objKey] = filteredValue;
                    hasMatches = true;
                }
            }

            return hasMatches ? filteredObject : undefined;
        }

        return keyMatches ? value : undefined;
    };

    if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
        const filtered: any = {};
        for (const [key, value] of Object.entries(data)) {
            const filteredValue = filterValue(value, key);
            if (filteredValue !== undefined) {
                filtered[key] = filteredValue;
            }
        }
        return filtered;
    }

    return filterValue(data);
};

// Helper function to filter by nested path (e.g., "auth.user.firstName")
const filterByPath = (data: any, path: string): any => {
    if (!data || typeof data !== 'object') return {};

    const pathParts = path.split('.').map(part => part.trim()).filter(part => part.length > 0);

    if (pathParts.length === 0) return data;

    const result: any = {};

    // Check if the path exists in the data
    let current = data;
    const validPath: string[] = [];

    for (const part of pathParts) {
        if (current && typeof current === 'object' && part in current) {
            validPath.push(part);
            current = current[part];
        } else {
            // Path doesn't exist, try partial matching
            break;
        }
    }

    if (validPath.length === 0) {
        // No valid path found, fallback to searching for any part of the path
        return filterByPathParts(data, pathParts);
    }

    // Build the result object with only the path that leads to the target
    let resultRef = result;
    let dataRef = data;

    for (let i = 0; i < validPath.length; i++) {
        const part = validPath[i];

        if (i === validPath.length - 1) {
            // Last part - include the final value
            resultRef[part] = dataRef[part];
        } else {
            // Intermediate part - create the structure
            resultRef[part] = {};
            resultRef = resultRef[part];
            dataRef = dataRef[part];
        }
    }

    return result;
};

// Helper function to search for path parts when exact path doesn't exist
const filterByPathParts = (data: any, pathParts: string[]): any => {
    if (!data || typeof data !== 'object') return {};

    const result: any = {};

    for (const [key, value] of Object.entries(data)) {
        const keyLower = key.toLowerCase();

        // Check if this key matches any part of the path
        const matchingPart = pathParts.find(part => keyLower.includes(part.toLowerCase()) || part.toLowerCase().includes(keyLower));

        if (matchingPart) {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // If it's an object, recursively search within it for remaining parts
                const remainingParts = pathParts.filter(part => part !== matchingPart);
                if (remainingParts.length > 0) {
                    const nestedResult = filterByPathParts(value, remainingParts);
                    if (Object.keys(nestedResult).length > 0) {
                        result[key] = nestedResult;
                    } else {
                        result[key] = value; // Include the whole object if no deeper matches
                    }
                } else {
                    result[key] = value;
                }
            } else {
                result[key] = value;
            }
        } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            // Even if key doesn't match, search within the object
            const nestedResult = filterByPathParts(value, pathParts);
            if (Object.keys(nestedResult).length > 0) {
                result[key] = nestedResult;
            }
        }
    }

    return result;
};

const RequestsPanel: React.FC<RequestsPanelProps> = ({
    requests,
    selectedRequest,
    onRequestSelect,
    onClear,
    onToggleCollapse,
    onIndentChange,
    onFontSizeChange,
    settings,
    effectiveTheme,
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Clear search when changing selected request
    useEffect(() => {
        setSearchTerm('');
    }, [selectedRequest]);

    const handleSearch = (search: string) => {
        setSearchTerm(search);
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            // Focus remains on search input - the filtered results will update automatically
        }
    };

    // Memoized filtered data for the selected request props
    const filteredPropsData = useMemo(() => {
        if (!selectedRequest) return {};
        return filterJsonData(selectedRequest.props || {}, searchTerm);
    }, [selectedRequest, searchTerm]);

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
            <div className="w-1/3 border-r dark:border-gray-700">
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold dark:text-white">Requests Timeline</h3>
                    <button
                        onClick={onClear}
                        className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-800 dark:text-red-200 rounded"
                    >
                        Clear
                    </button>
                </div>
                <div className="overflow-y-auto h-full">
                    {requests.map((request, index) => (
                        <div
                            key={request.timestamp}
                            onClick={() => onRequestSelect(request)}
                            className={`p-3 border-b dark:border-gray-700 cursor-pointer transition-colors ${
                                selectedRequest === request
                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                    : 'hover:bg-slate-50 dark:hover:bg-gray-800'
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded ${request.method === 'GET' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : request.method === 'POST' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : request.method === 'PUT' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : request.method === 'PATCH' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                        {request.method}
                                    </span>
                                    {request.status === 'error' && <span className="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 px-1.5 py-0.5 rounded-full">ERROR</span>}
                                    {request.isPartial && <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900 px-1.5 py-0.5 rounded-full">PARTIAL</span>}
                                </div>
                                <span className="text-xs dark:text-gray-400">
                                    {new Date(request.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="text-sm font-medium dark:text-white mt-1">
                                {request.component || 'Unknown'}
                            </div>
                            <div className="text-xs dark:text-gray-400 truncate">
                                {request.url}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-2/3 flex-1 flex flex-col min-w-0">
                {selectedRequest ? (
                    <div className="flex-1 overflow-y-auto overflow-x-auto p-4 space-y-6">
                        <h3 className="text-lg font-semibold dark:text-white mb-3">Request Details</h3>
                        <div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="font-medium dark:text-gray-400">Status:</span>
                                    <span className={`ml-2 font-mono ${selectedRequest.status === 'success' ? 'text-green-600' : selectedRequest.status === 'error' ? 'text-red-600' : 'text-slate-600'}`}>{selectedRequest.status}</span>
                                </div>
                                <div>
                                    <span className="font-medium dark:text-gray-400">Method:</span>
                                    <span className="ml-2 font-mono dark:text-white truncate">{selectedRequest.method}</span>
                                </div>
                                <div>
                                    <span className="font-medium dark:text-gray-400">URL:</span>
                                    <span className="ml-2 dark:text-white truncate break-all">{selectedRequest.url}</span>
                                </div>
                                <div>
                                    <span className="font-medium dark:text-gray-400">Component:</span>
                                    <span className="ml-2 font-mono dark:text-white truncate break-all">{selectedRequest.component}</span>
                                </div>
                                <div>
                                    <span className="font-medium dark:text-gray-400">Response time:</span>
                                    <span className="ml-2 dark:text-white">{selectedRequest.responseTime}ms</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <span className="font-medium dark:text-gray-400">Props:</span>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {Object.keys(selectedRequest.props || {}).map((prop) => (
                                        <span key={prop} className="px-2 py-1 text-xs font-mono bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">{prop}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                                                    <h3 className="text-lg font-semibold dark:text-white mb-3">URL Analysis</h3>
                        <div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-lg text-sm space-y-2">
                            <div>
                                <span className="font-medium dark:text-gray-400">Full URL:</span>
                                <span className="ml-2 font-mono dark:text-white break-all truncate">{selectedRequest.url}</span>
                            </div>

                            <div>
                                <span className="font-medium dark:text-gray-400">Query Parameters:</span>
                                    <div className="mt-1 pl-4">
                                        {(() => {
                                            try {
                                                const url = new URL(selectedRequest.url);
                                                const params = Array.from(url.searchParams.entries());
                                                if (params.length === 0) return <span className="text-slate-500 dark:text-gray-400 ml-2">None</span>;

                                                return (
                                                    <table className="min-w-full">
                                                        <tbody>
                                                            {params.map(([key, value]) => (
                                                                <tr key={key}>
                                                                                                            <td className="pr-4 font-mono dark:text-gray-400">{key}</td>
                                        <td className="dark:text-white">{value}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                );
                                            } catch (e) {
                                                return <span className="text-slate-500 dark:text-gray-400 ml-2">Invalid URL</span>
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
                            <h3 className="text-lg font-semibold dark:text-white mb-3">Props</h3>
                            <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
                                <Toolbar
                                    onSearch={handleSearch}
                                    onKeyDown={handleSearchKeyDown}
                                    onToggleCollapse={onToggleCollapse}
                                    onIndentIncrease={() => onIndentChange(1)}
                                    onIndentDecrease={() => onIndentChange(-1)}
                                    onFontSizeIncrease={() => onFontSizeChange(1)}
                                    onFontSizeDecrease={() => onFontSizeChange(-1)}
                                    isCollapsed={settings.jsonView.collapsed !== false}
                                />
                                <div className="json-search-container">
                                    <JsonView
                                        value={filteredPropsData}
                                        {...jsonViewProps}
                                    >
                                        {!quotesOnKeys && <JsonView.Quote render={() => <span />} />}
                                    </JsonView>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500 dark:text-gray-400">
                        Select a request from the timeline to view details.
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestsPanel;
