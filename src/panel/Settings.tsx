import type React from "react";

export interface JsonViewSettings {
	objectSortKeys: boolean;
	indentWidth: number;
	displayObjectSize: boolean;
	displayDataTypes: boolean;
	enableClipboard: boolean;
	collapsed: number | boolean;
	highlightUpdates: boolean;
	shortenTextAfterLength: number;
	theme: string;
	fontSize: number;
	quotesOnKeys: boolean;
}

export interface PanelSettings {
	appTheme: "light" | "dark" | "system";
	jsonView: JsonViewSettings;
}

const themeOptions = {
	lightTheme: "Light",
	darkTheme: "Dark",
	nordTheme: "Nord",
	githubLightTheme: "Github Light",
	githubDarkTheme: "Github Dark",
	vscodeTheme: "VSCode",
	gruvboxTheme: "Gruvbox",
	monokaiTheme: "Monokai",
	basicTheme: "Basic",
};

interface SettingsProps {
	settings: PanelSettings;
	onSettingsChange: (newSettings: PanelSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSettingsChange }) => {
	const setAppTheme = (theme: "light" | "dark" | "system") => {
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
				<h3 className="text-lg font-semibold dark:text-white mb-3">
					Appearance
				</h3>
				<div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-lg space-y-4">
					<div className="flex items-center justify-between text-sm">
						<div>
							<span className="font-medium dark:text-gray-400">Theme</span>
						</div>
						<div className="flex items-center space-x-2">
							<button
								onClick={() => setAppTheme("light")}
								className={`px-3 py-1 text-xs rounded ${settings.appTheme === "light" ? "bg-sky-700 text-gray-100" : "bg-slate-200 dark:bg-gray-800 dark:text-white"}`}
							>
								Light
							</button>
							<button
								onClick={() => setAppTheme("dark")}
								className={`px-3 py-1 text-xs rounded ${settings.appTheme === "dark" ? "bg-sky-700 text-gray-100" : "bg-slate-200 dark:bg-gray-800 dark:text-white"}`}
							>
								Dark
							</button>
							<button
								onClick={() => setAppTheme("system")}
								className={`px-3 py-1 text-xs rounded ${settings.appTheme === "system" ? "bg-sky-700 text-gray-100" : "bg-slate-200 dark:bg-gray-700 dark:text-white"}`}
							>
								System
							</button>
						</div>
					</div>
				</div>
			</div>
			<div>
				<h3 className="text-lg font-semibold dark:text-white mb-3">
					JSON Viewer
				</h3>
				<div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-lg grid grid-cols-2 gap-4">
					<div className="text-sm">
						<label className="font-medium dark:text-gray-400">Theme</label>
						<select
							value={settings.jsonView.theme}
							onChange={(e) => handleJsonViewChange("theme", e.target.value)}
							className="w-full mt-1 px-2 py-1 text-xs rounded bg-slate-200 dark:bg-gray-700 dark:text-white"
						>
							{Object.entries(themeOptions).map(([value, label]) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</select>
					</div>
					<div className="text-sm">
						<label className="font-medium dark:text-gray-400">Font Size</label>
						<input
							type="number"
							value={settings.jsonView.fontSize}
							onChange={(e) =>
								handleJsonViewChange("fontSize", parseInt(e.target.value, 10))
							}
							className="w-full mt-1 px-2 py-1 text-xs rounded bg-slate-200 dark:bg-gray-700 dark:text-white"
						/>
					</div>
					<div className="text-sm">
						<label className="font-medium dark:text-gray-400">
							Indent Width
						</label>
						<input
							type="number"
							value={settings.jsonView.indentWidth}
							onChange={(e) =>
								handleJsonViewChange(
									"indentWidth",
									parseInt(e.target.value, 10),
								)
							}
							className="w-full mt-1 px-2 py-1 text-xs rounded bg-slate-200 dark:bg-gray-700 dark:text-white"
						/>
					</div>
					<div className="text-sm">
						<label className="font-medium dark:text-gray-400">Collapsed</label>
						<input
							type="number"
							value={
								typeof settings.jsonView.collapsed === "number"
									? settings.jsonView.collapsed
									: 1
							}
							onChange={(e) =>
								handleJsonViewChange("collapsed", parseInt(e.target.value, 10))
							}
							className="w-full mt-1 px-2 py-1 text-xs rounded bg-slate-200 dark:bg-gray-700 dark:text-white"
						/>
					</div>
					<div className="col-span-2 grid grid-cols-2 gap-4">
						<div className="flex items-center justify-between text-sm">
							<label className="font-medium dark:text-gray-400">
								Display Object Size
							</label>
							<input
								type="checkbox"
								checked={settings.jsonView.displayObjectSize}
								onChange={(e) =>
									handleJsonViewChange("displayObjectSize", e.target.checked)
								}
							/>
						</div>
						<div className="flex items-center justify-between text-sm">
							<label className="font-medium dark:text-gray-400">
								Display Data Types
							</label>
							<input
								type="checkbox"
								checked={settings.jsonView.displayDataTypes}
								onChange={(e) =>
									handleJsonViewChange("displayDataTypes", e.target.checked)
								}
							/>
						</div>
						<div className="flex items-center justify-between text-sm">
							<label className="font-medium dark:text-gray-400">
								Enable Clipboard
							</label>
							<input
								type="checkbox"
								checked={settings.jsonView.enableClipboard}
								onChange={(e) =>
									handleJsonViewChange("enableClipboard", e.target.checked)
								}
							/>
						</div>
						<div className="flex items-center justify-between text-sm">
							<label className="font-medium dark:text-gray-400">
								Sort Object Keys
							</label>
							<input
								type="checkbox"
								checked={settings.jsonView.objectSortKeys}
								onChange={(e) =>
									handleJsonViewChange("objectSortKeys", e.target.checked)
								}
							/>
						</div>
						<div className="flex items-center justify-between text-sm">
							<label className="font-medium dark:text-gray-400">
								Quotes on Keys
							</label>
							<input
								type="checkbox"
								checked={settings.jsonView.quotesOnKeys}
								onChange={(e) =>
									handleJsonViewChange("quotesOnKeys", e.target.checked)
								}
							/>
						</div>
						<div className="flex items-center justify-between text-sm">
							<label className="font-medium dark:text-gray-400">
								Highlight Updates
							</label>
							<input
								type="checkbox"
								checked={settings.jsonView.highlightUpdates}
								onChange={(e) =>
									handleJsonViewChange("highlightUpdates", e.target.checked)
								}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Settings;
