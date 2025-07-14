import { useEffect, useState } from "react";
import { JSON_VIEW_DEFAULTS, STORAGE_KEYS } from "../constants";
import type { JsonViewSettings, PanelSettings } from "../Settings";

const defaultJsonViewSettings: JsonViewSettings = {
	objectSortKeys: false,
	indentWidth: 2,
	displayObjectSize: true,
	displayDataTypes: true,
	enableClipboard: true,
	collapsed: false,
	highlightUpdates: true,
	shortenTextAfterLength: 0,
	theme: "vscodeTheme",
	fontSize: 14,
	quotesOnKeys: true,
};

const defaultSettings: PanelSettings = {
	appTheme: "system",
	jsonView: defaultJsonViewSettings,
};

export const useSettings = (tabId: number) => {
	const [settings, setSettings] = useState<PanelSettings>(defaultSettings);

	// Load settings from Chrome storage on mount
	useEffect(() => {
		const settingsKey = `${STORAGE_KEYS.SETTINGS_PREFIX}${tabId}`;
		chrome.storage.local.get(settingsKey, (result) => {
			if (result[settingsKey]?.settings) {
				setSettings({ ...defaultSettings, ...result[settingsKey].settings });
			}
		});
	}, [tabId]);

	// Save settings to Chrome storage
	const handleSettingsChange = (newSettings: PanelSettings) => {
		setSettings(newSettings);
		const settingsKey = `${STORAGE_KEYS.SETTINGS_PREFIX}${tabId}`;
		chrome.storage.local.set({ [settingsKey]: { settings: newSettings } });
	};

	// Helper functions for specific setting changes
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
			jsonView: {
				...settings.jsonView,
				indentWidth: Math.max(
					JSON_VIEW_DEFAULTS.MIN_INDENT,
					settings.jsonView.indentWidth + amount,
				),
			},
		});
	};

	const handleFontSizeChange = (amount: number) => {
		handleSettingsChange({
			...settings,
			jsonView: {
				...settings.jsonView,
				fontSize: Math.max(
					JSON_VIEW_DEFAULTS.MIN_FONT_SIZE,
					settings.jsonView.fontSize + amount,
				),
			},
		});
	};

	return {
		settings,
		handleSettingsChange,
		handleToggleCollapse,
		handleIndentChange,
		handleFontSizeChange,
	};
};
