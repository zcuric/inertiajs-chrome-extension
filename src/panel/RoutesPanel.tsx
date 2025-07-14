import React, { useState } from 'react';
import type { InertiaPage } from './types';

interface RoutesPanelProps {
    currentPage: InertiaPage;
}

const RoutesPanel: React.FC<RoutesPanelProps> = ({ currentPage }) => {
    const [routesSearch, setRoutesSearch] = useState('');

    if (!currentPage?.props?.ziggy) {
        return (
            <div className="flex items-center justify-center h-full text-slate-500 dark:text-github-dark-text-secondary">
                No routes data available (Ziggy package not detected).
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b dark:border-github-dark-border">
                <input
                    type="text"
                    placeholder="Search routes..."
                    value={routesSearch}
                    onChange={(e) => setRoutesSearch(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-100 dark:bg-github-dark-button-bg dark:text-github-dark-text rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
            </div>
            <div className="flex-1 overflow-y-auto">
                {Object.entries(currentPage.props.ziggy.routes)
                    .filter(([name, route]: [string, any]) => {
                        if (!routesSearch) return true;
                        const searchTerm = routesSearch.toLowerCase();
                        return (
                            name.toLowerCase().includes(searchTerm) ||
                            route.uri.toLowerCase().includes(searchTerm)
                        );
                    })
                    .map(([name, route]: [string, any]) => (
                        <div key={name} className="p-4 border-b dark:border-github-dark-border">
                            <div className="font-semibold text-lg dark:text-github-dark-text mb-3">{name}</div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="font-medium text-slate-500 dark:text-github-dark-text-secondary">URI:</div>
                                    <div className="font-mono text-slate-800 dark:text-github-dark-text">{route.uri}</div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="font-medium text-slate-500 dark:text-github-dark-text-secondary">Methods:</div>
                                    <div className="flex gap-1">
                                        {route.methods.map((method: string) => (
                                            <span key={method} className={`px-1 text-xs font-semibold rounded-sm ${
                                                method === 'GET' ? 'bg-green-100 text-green-800' :
                                                method === 'POST' ? 'bg-blue-100 text-blue-800' :
                                                method === 'PUT' || method === 'PATCH' ? 'bg-yellow-100 text-yellow-800' :
                                                method === 'DELETE' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {method}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="font-medium text-slate-500 dark:text-github-dark-text-secondary">Middleware:</div>
                                  <div className="font-mono text-slate-800 dark:text-github-dark-text">
                                      {route.middleware && route.middleware.length > 0 ? route.middleware.join(', ') : 'none'}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="font-medium text-slate-500 dark:text-github-dark-text-secondary">Bindings:</div>
                                  <div className="font-mono text-slate-800 dark:text-github-dark-text">
                                      {route.bindings && Object.keys(route.bindings).length > 0 ? JSON.stringify(route.bindings) : 'none'}
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="font-medium text-slate-500 dark:text-github-dark-text-secondary">Wheres:</div>
                                  <div className="font-mono text-slate-800 dark:text-github-dark-text">
                                      {route.wheres && Object.keys(route.wheres).length > 0 ? JSON.stringify(route.wheres) : 'none'}
                                  </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default RoutesPanel;
