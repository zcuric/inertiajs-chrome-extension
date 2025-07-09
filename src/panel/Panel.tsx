import React, { useState, useEffect } from 'react';
import JsonView from '@microlink/react-json-view';

interface InertiaPage {
    component: string;
    props: Record<string, any>;
    url: string;
    version: string | null;
}

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
    const tabId = chrome.devtools.inspectedWindow.tabId;

    useEffect(() => {
        const detectedKey = `inertia-detected-${tabId}`;
        const pageKey = `inertia-page-${tabId}`;

        const getInitialData = () => {
            chrome.storage.local.get([detectedKey, pageKey], (result) => {
                if (result[detectedKey]?.detected) {
                    setIsInertiaDetected(true);
                }
                if (result[pageKey]?.page) {
                    setCurrentPage(result[pageKey].page);
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
        };

        chrome.storage.onChanged.addListener(handleStorageChange);

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, [tabId]);

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
        <div className="flex h-full bg-white">
            {/* Sidebar - Request History */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-semibold text-gray-800">Request History</h3>
                    <p className="text-sm text-gray-600">{requests.length} requests</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                                selectedRequest?.id === request.id ? 'bg-blue-50 border-blue-200' : ''
                            }`}
                            onClick={() => setSelectedRequest(request)}
                        >
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-sm text-gray-600">
                                    {request.method}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {new Date(request.timestamp).toLocaleTimeString()}
                                </span>
                            </div>
                            <div className="text-sm font-medium text-gray-800 mt-1">
                                {request.component}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                                {request.url}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Tab Navigation */}
                <div className="border-b border-gray-200 bg-gray-50">
                    <nav className="flex space-x-8 px-4">
                        <button className="py-2 px-1 border-b-2 border-blue-500 text-blue-600 font-medium text-sm">
                            Current Page
                        </button>
                        <button className="py-2 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium text-sm">
                            Request Details
                        </button>
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4">
                    {currentPage ? (
                        <div>
                            {/* Page Info */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Page</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-600">Component:</span>
                                        <span className="ml-2 font-mono text-gray-800">{currentPage.component}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">URL:</span>
                                        <span className="ml-2 text-gray-800">{currentPage.url}</span>
                                    </div>
                                    {currentPage.version && (
                                        <div>
                                            <span className="font-medium text-gray-600">Version:</span>
                                            <span className="ml-2 font-mono text-gray-800">{currentPage.version}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Props Inspector */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Page Props</h3>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <JsonView
                                        src={currentPage.props}
                                        theme="rjv-default"
                                        iconStyle="triangle"
                                        indentWidth={2}
                                        collapsed={1}
                                        displayDataTypes={true}
                                        displayObjectSize={true}
                                        enableClipboard={true}
                                        style={{
                                            padding: '12px',
                                            fontSize: '13px',
                                            lineHeight: '1.4'
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-lg">No page data available</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Panel;
