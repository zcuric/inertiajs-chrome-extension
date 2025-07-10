import React from 'react';

interface ToolbarProps {
    onSearch: (searchTerm: string) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    onToggleCollapse: () => void;
    onIndentIncrease: () => void;
    onIndentDecrease: () => void;
    onFontSizeIncrease: () => void;
    onFontSizeDecrease: () => void;
    isCollapsed: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
    onSearch,
    onKeyDown,
    onToggleCollapse,
    onIndentIncrease,
    onIndentDecrease,
    onFontSizeIncrease,
    onFontSizeDecrease,
    isCollapsed,
}) => {
    return (
        <div className="p-2 border-b dark:border-github-dark-border bg-slate-100 dark:bg-github-dark-bg-secondary flex items-center justify-between">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => onSearch(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="px-2 py-1 text-sm w-40 bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-text rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
            </div>
            <div className="flex items-center space-x-4">
                <button
                    onClick={onToggleCollapse}
                    className="px-2 py-1 text-xs rounded bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-button-text"
                >
                    {isCollapsed ? 'Expand All' : 'Collapse All'}
                </button>
                <div className="flex items-center space-x-1">
                    <span className="text-xs font-medium dark:text-github-dark-text-secondary">Indent</span>
                    <button onClick={onIndentDecrease} className="px-2 py-0.5 text-sm rounded bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-button-text">-</button>
                    <button onClick={onIndentIncrease} className="px-2 py-0.5 text-sm rounded bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-button-text">+</button>
                </div>
                 <div className="flex items-center space-x-1">
                    <span className="text-xs font-medium dark:text-github-dark-text-secondary">Font Size</span>
                    <button onClick={onFontSizeDecrease} className="px-2 py-0.5 text-sm rounded bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-button-text">-</button>
                    <button onClick={onFontSizeIncrease} className="px-2 py-0.5 text-sm rounded bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-button-text">+</button>
                </div>
            </div>
        </div>
    );
};

export default Toolbar;
