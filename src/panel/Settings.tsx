import React from 'react';

export interface JsonViewSettings {
    objectSortKeys: boolean;
    indentWidth: number;
    displayObjectSize: boolean;
    displayDataTypes: boolean;
    enableClipboard: boolean;
    collapsed: number;
    highlightUpdates: boolean;
    shortenTextAfterLength: number;
    theme: string;
    fontSize: number;
}

export interface PanelSettings {
    appTheme: 'light' | 'dark' | 'system';
    showRequestHistory: boolean;
    jsonView: JsonViewSettings;
}

const themeOptions = [
    'lightTheme',
    'darkTheme',
    'nordTheme',
    'githubLightTheme',
    'githubDarkTheme',
    'vscodeTheme',
    'gruvboxTheme',
    'monokaiTheme',
    'basicTheme'
];

interface SettingsProps {
    settings: PanelSettings;
    onSettingsChange: (newSettings: PanelSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange }) => {
    const setAppTheme = (theme: 'light' | 'dark' | 'system') => {
        onSettingsChange({
            ...settings,
            appTheme: theme,
        });
    };

    const handleJsonViewChange = (key: keyof JsonViewSettings, value: any) => {
        onSettingsChange({
            ...settings,
            jsonView: {
                ...settings.jsonView,
                [key]: value,
            },
        });
    };

    return (
        <div className="p-4 space-y-6">
            <div>
                <h3 className="text-lg font-semibold dark:text-github-dark-text mb-3">Appearance</h3>
                <div className="p-4 bg-slate-50 dark:bg-github-dark-bg-secondary rounded-lg space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <div>
                            <span className="font-medium dark:text-github-dark-text-secondary">Theme</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setAppTheme('light')}
                                className={`px-3 py-1 text-xs rounded ${settings.appTheme === 'light' ? 'bg-sky-700 text-gray-100' : 'bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-button-text'}`}
                            >
                                Light
                            </button>
                            <button
                                onClick={() => setAppTheme('dark')}
                                className={`px-3 py-1 text-xs rounded ${settings.appTheme === 'dark' ? 'bg-sky-700 text-gray-100' : 'bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-button-text'}`}
                            >
                                Dark
                            </button>
                            <button
                                onClick={() => setAppTheme('system')}
                                className={`px-3 py-1 text-xs rounded ${settings.appTheme === 'system' ? 'bg-sky-700 text-gray-100' : 'bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-button-text'}`}
                            >
                                System
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="font-medium dark:text-github-dark-text-secondary">Show Request History</label>
                        <input
                            type="checkbox"
                            checked={settings.showRequestHistory}
                            onChange={(e) => onSettingsChange({ ...settings, showRequestHistory: e.target.checked })}
                        />
                    </div>
                </div>
            </div>
            <div>
                <h3 className="text-lg font-semibold dark:text-github-dark-text mb-3">JSON Viewer</h3>
                <div className="p-4 bg-slate-50 dark:bg-github-dark-bg-secondary rounded-lg space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <label className="font-medium dark:text-github-dark-text-secondary">Theme</label>
                        <select
                            value={settings.jsonView.theme}
                            onChange={(e) => handleJsonViewChange('theme', e.target.value)}
                            className="px-2 py-1 text-xs rounded bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-button-text"
                        >
                            {themeOptions.map(theme => <option key={theme} value={theme}>{theme}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="font-medium dark:text-github-dark-text-secondary">Font Size</label>
                        <input
                            type="number"
                            value={settings.jsonView.fontSize}
                            onChange={(e) => handleJsonViewChange('fontSize', parseInt(e.target.value, 10))}
                            className="w-20 px-2 py-1 text-xs rounded bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-button-text"
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="font-medium dark:text-github-dark-text-secondary">Indent Width</label>
                        <input
                            type="number"
                            value={settings.jsonView.indentWidth}
                            onChange={(e) => handleJsonViewChange('indentWidth', parseInt(e.target.value, 10))}
                            className="w-20 px-2 py-1 text-xs rounded bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-button-text"
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="font-medium dark:text-github-dark-text-secondary">Collapsed Depth</label>
                        <input
                            type="number"
                            value={settings.jsonView.collapsed}
                            onChange={(e) => handleJsonViewChange('collapsed', parseInt(e.target.value, 10))}
                            className="w-20 px-2 py-1 text-xs rounded bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-button-text"
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="font-medium dark:text-github-dark-text-secondary">Display Object Size</label>
                        <input
                            type="checkbox"
                            checked={settings.jsonView.displayObjectSize}
                            onChange={(e) => handleJsonViewChange('displayObjectSize', e.target.checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="font-medium dark:text-github-dark-text-secondary">Display Data Types</label>
                        <input
                            type="checkbox"
                            checked={settings.jsonView.displayDataTypes}
                            onChange={(e) => handleJsonViewChange('displayDataTypes', e.target.checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="font-medium dark:text-github-dark-text-secondary">Enable Clipboard</label>
                        <input
                            type="checkbox"
                            checked={settings.jsonView.enableClipboard}
                            onChange={(e) => handleJsonViewChange('enableClipboard', e.target.checked)}
                        />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <label className="font-medium dark:text-github-dark-text-secondary">Sort Object Keys</label>
                        <input
                            type="checkbox"
                            checked={settings.jsonView.objectSortKeys}
                            onChange={(e) => handleJsonViewChange('objectSortKeys', e.target.checked)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
