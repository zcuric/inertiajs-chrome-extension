import type React from "react";
import { useState } from "react";
import {
	CSS_CLASSES,
	EMOJIS,
	MESSAGES,
	PAGE_VIEWS,
	TAB_NAMES,
} from "./constants";
import FormsPanel from "./FormsPanel";
import { useInertiaData, useSettings, useTheme } from "./hooks";
import PagePanel from "./PagePanel";
import RequestsPanel from "./RequestsPanel";
import RoutesPanel from "./RoutesPanel";
import Settings from "./Settings";

type TabName = (typeof TAB_NAMES)[keyof typeof TAB_NAMES];
type PageView = (typeof PAGE_VIEWS)[keyof typeof PAGE_VIEWS];

const Panel: React.FC = () => {
	const [activeTab, setActiveTab] = useState<TabName>(TAB_NAMES.PAGE);
	const [activePageView, setActivePageView] = useState<PageView>(
		PAGE_VIEWS.PROPS,
	);
	const tabId = chrome.devtools.inspectedWindow.tabId;

	// Use custom hooks for state management
	const {
		settings,
		handleSettingsChange,
		handleToggleCollapse,
		handleIndentChange,
		handleFontSizeChange,
	} = useSettings(tabId);

	const effectiveTheme = useTheme(settings);

	const {
		currentPage,
		requests,
		selectedRequest,
		isLoading,
		isInertiaDetected,
		framework,
		previousPage,
		setSelectedRequest,
		handleClear,
	} = useInertiaData(tabId);

	// Handle settings toggle functionality
	const handleSettingsToggle = () => {
		if (activeTab === TAB_NAMES.SETTINGS) {
			// If already on settings, go back to PAGE tab
			setActiveTab(TAB_NAMES.PAGE);
		} else {
			// If not on settings, switch to settings
			setActiveTab(TAB_NAMES.SETTINGS);
		}
	};

	if (isLoading) {
		return (
			<div
				className={`${CSS_CLASSES.CENTER_CONTAINER} ${effectiveTheme === "dark" ? "dark bg-gray-900" : "bg-gray-50"}`}
			>
				<div className="text-center p-8">
					<div className="text-4xl mb-4 animate-pulse">{EMOJIS.LOADING}</div>
					<h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">
						{MESSAGES.LOADING_TITLE}
					</h2>
					<p className="text-gray-500 dark:text-gray-400">
						{MESSAGES.LOADING_SUBTITLE}
					</p>
				</div>
			</div>
		);
	}

	if (!isInertiaDetected) {
		return (
			<div
				className={`${CSS_CLASSES.CENTER_CONTAINER} ${effectiveTheme === "dark" ? "dark bg-gray-900" : "bg-gray-50"}`}
			>
				<div className="text-center p-8">
					<div className="text-6xl mb-4">{EMOJIS.SEARCH}</div>
					<h2 className="text-xl font-semibold text-gray-700 dark:text-white mb-2">
						{MESSAGES.NOT_DETECTED_TITLE}
					</h2>
					<p className="text-gray-500 dark:text-gray-400">
						{MESSAGES.NOT_DETECTED_SUBTITLE}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`flex h-full ${effectiveTheme === "dark" ? "dark bg-gray-900 text-white" : "bg-white"}`}
		>
			<div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
				<div className="border-b dark:border-gray-700 bg-slate-50 dark:bg-gray-900">
					<nav className="flex items-center space-x-8 px-4">
						<button
							type="button"
							onClick={() => setActiveTab(TAB_NAMES.PAGE)}
							className={`py-2 px-1 font-medium text-sm transition-colors ${
								activeTab === TAB_NAMES.PAGE
									? CSS_CLASSES.TAB_ACTIVE
									: CSS_CLASSES.TAB_INACTIVE
							}`}
						>
							Page
						</button>
						<button
							type="button"
							onClick={() => setActiveTab(TAB_NAMES.REQUESTS)}
							className={`py-2 px-1 font-medium text-sm transition-colors ${
								activeTab === TAB_NAMES.REQUESTS
									? CSS_CLASSES.TAB_ACTIVE
									: CSS_CLASSES.TAB_INACTIVE
							}`}
						>
							Requests
						</button>
						<button
							type="button"
							onClick={() => setActiveTab(TAB_NAMES.FORMS)}
							className={`py-2 px-1 font-medium text-sm transition-colors ${
								activeTab === TAB_NAMES.FORMS
									? CSS_CLASSES.TAB_ACTIVE
									: CSS_CLASSES.TAB_INACTIVE
							}`}
						>
							Forms
						</button>
						{currentPage?.props?.ziggy && (
							<button
								type="button"
								onClick={() => setActiveTab(TAB_NAMES.ROUTES)}
								className={`py-2 px-1 font-medium text-sm transition-colors ${
									activeTab === TAB_NAMES.ROUTES
										? CSS_CLASSES.TAB_ACTIVE
										: CSS_CLASSES.TAB_INACTIVE
								}`}
							>
								Routes
							</button>
						)}
						<div className="flex-1" />
						{/* Inertia.js Documentation Links */}
						<a
							href="https://inertiajs.com/"
							target="_blank"
							rel="noopener noreferrer"
							className="text-xs text-sky-600 hover:underline mr-2"
						>
							Inertia.js Documentation
						</a>
						<button
							type="button"
							onClick={handleSettingsToggle}
							className={`${CSS_CLASSES.BUTTON_SETTINGS} ${
								activeTab === TAB_NAMES.SETTINGS
									? "bg-slate-200 dark:bg-gray-700"
									: ""
							}`}
							aria-label="Settings"
						>
							<svg
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="text-slate-500 dark:text-gray-400"
								aria-hidden="true"
							>
								<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
							</svg>
						</button>
					</nav>
				</div>
				<div className="flex-1 overflow-y-auto p-4">
					{activeTab === TAB_NAMES.REQUESTS && (
						<RequestsPanel
							requests={requests}
							selectedRequest={selectedRequest}
							onRequestSelect={setSelectedRequest}
							onClear={handleClear}
							onToggleCollapse={handleToggleCollapse}
							onIndentChange={handleIndentChange}
							onFontSizeChange={handleFontSizeChange}
							settings={settings}
							effectiveTheme={effectiveTheme}
						/>
					)}
					{activeTab === TAB_NAMES.PAGE && currentPage && (
						<PagePanel
							currentPage={currentPage}
							previousPage={previousPage}
							framework={framework}
							activePageView={activePageView}
							setActivePageView={setActivePageView}
							onToggleCollapse={handleToggleCollapse}
							onIndentChange={handleIndentChange}
							onFontSizeChange={handleFontSizeChange}
							settings={settings}
						/>
					)}
					{activeTab === TAB_NAMES.FORMS && (
						<FormsPanel
							requests={requests}
							selectedRequest={selectedRequest}
							onRequestSelect={setSelectedRequest}
							onClear={handleClear}
							onToggleCollapse={handleToggleCollapse}
							onIndentChange={handleIndentChange}
							onFontSizeChange={handleFontSizeChange}
							settings={settings}
						/>
					)}
					{activeTab === TAB_NAMES.ROUTES && currentPage?.props?.ziggy && (
						<RoutesPanel currentPage={currentPage} />
					)}
					{activeTab === TAB_NAMES.SETTINGS && (
						<Settings
							settings={settings}
							onSettingsChange={handleSettingsChange}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Panel;
