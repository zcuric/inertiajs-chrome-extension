
import JsonView from "@uiw/react-json-view";
import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CSS_CLASSES, JSON_VIEW_DEFAULTS, PAGE_VIEWS } from "./constants";
import Toolbar from "./Toolbar";
import { themes } from "./themes";
import type { InertiaPage, PanelSettings } from "./types";


import { openComponentSource } from "./utils/openComponentSource";

type PageView = (typeof PAGE_VIEWS)[keyof typeof PAGE_VIEWS];

interface PagePanelProps {
	currentPage: InertiaPage;
	previousPage: InertiaPage | null;
	framework: { name: string; version?: string } | null;
	activePageView: PageView;
	setActivePageView: (view: PageView) => void;
	onToggleCollapse: () => void;
	onIndentChange: (amount: number) => void;
	onFontSizeChange: (amount: number) => void;
	settings: PanelSettings;
}

// Utility function to filter JSON data based on search term
const filterJsonData = (data: any, searchTerm: string): any => {
	if (!searchTerm || !searchTerm.trim()) return data;

	const search = searchTerm.toLowerCase().trim();

	// Check if this is a nested property search (contains dots)
	if (search.includes(".")) {
		return filterByPath(data, search);
	}

	// Original filtering logic for simple searches
	const filterValue = (value: any, key?: string): any => {
		// Check if key matches search term
		const keyMatches = key && key.toLowerCase().includes(search);

		if (value === null || value === undefined) {
			return keyMatches ? value : undefined;
		}

		if (typeof value === "string") {
			return keyMatches || value.toLowerCase().includes(search)
				? value
				: undefined;
		}

		if (typeof value === "number" || typeof value === "boolean") {
			return keyMatches || value.toString().toLowerCase().includes(search)
				? value
				: undefined;
		}

		if (Array.isArray(value)) {
			const filteredArray = value
				.map((item, index) => filterValue(item, index.toString()))
				.filter((item) => item !== undefined);

			return keyMatches || filteredArray.length > 0 ? filteredArray : undefined;
		}

		if (typeof value === "object") {
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

	if (typeof data === "object" && data !== null && !Array.isArray(data)) {
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
	if (!data || typeof data !== "object") return {};

	const pathParts = path
		.split(".")
		.map((part) => part.trim())
		.filter((part) => part.length > 0);

	if (pathParts.length === 0) return data;

	const result: any = {};

	// Check if the path exists in the data
	let current = data;
	const validPath: string[] = [];

	for (const part of pathParts) {
		if (current && typeof current === "object" && part in current) {
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
	if (!data || typeof data !== "object") return {};

	const result: any = {};

	for (const [key, value] of Object.entries(data)) {
		const keyLower = key.toLowerCase();

		// Check if this key matches any part of the path
		const matchingPart = pathParts.find(
			(part) =>
				keyLower.includes(part.toLowerCase()) ||
				part.toLowerCase().includes(keyLower),
		);

		if (matchingPart) {
			if (
				typeof value === "object" &&
				value !== null &&
				!Array.isArray(value)
			) {
				// If it's an object, recursively search within it for remaining parts
				const remainingParts = pathParts.filter(
					(part) => part !== matchingPart,
				);
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
		} else if (
			typeof value === "object" &&
			value !== null &&
			!Array.isArray(value)
		) {
			// Even if key doesn't match, search within the object
			const nestedResult = filterByPathParts(value, pathParts);
			if (Object.keys(nestedResult).length > 0) {
				result[key] = nestedResult;
			}
		}
	}

	return result;
};

// Helper function to detect if a prop is likely deferred based on Inertia.js patterns
const isLikelyDeferredProp = (value: any, key: string): boolean => {
	// Common patterns for deferred props:
	// 1. Props that are explicitly null (common initial state)
	// 2. Empty objects (common placeholder pattern)
	// 3. Props with specific deferred-related naming patterns
	if (value === null) return true;

	// Check for empty objects (common deferred placeholder)
	if (typeof value === "object" && value !== null && !Array.isArray(value)) {
		if (Object.keys(value).length === 0) return true;
	}

	// Check for common deferred prop naming patterns
	const deferredPatterns = ["lazy", "deferred", "async", "paginated"];
	const keyLower = key.toLowerCase();
	if (deferredPatterns.some((pattern) => keyLower.includes(pattern))) {
		return true;
	}

	return false;
};

// Moved outside component to avoid re-creation and dependency issues
const createGetDeferredData = (
	currentPage: InertiaPage | null,
	previousPage: InertiaPage | null,
) => {
	if (!currentPage) return {};

	const deferredKeys = Object.keys(currentPage.props).filter((key) => {
		const currentValue = currentPage.props[key];

		if (previousPage) {
			const previousValue = previousPage.props[key];

			// Enhanced logic: A prop is deferred if:
			// 1. It transitioned from null/undefined to having a value (original logic)
			// 2. It was previously an empty object and now has content
			// 3. It matches common deferred patterns
			if (
				(previousValue === null || typeof previousValue === "undefined") &&
				currentValue !== null &&
				typeof currentValue !== "undefined"
			) {
				return true;
			}

			// Check for empty object to populated object transition
			if (
				typeof previousValue === "object" &&
				previousValue !== null &&
				!Array.isArray(previousValue) &&
				Object.keys(previousValue).length === 0 &&
				typeof currentValue === "object" &&
				currentValue !== null &&
				!Array.isArray(currentValue) &&
				Object.keys(currentValue).length > 0
			) {
				return true;
			}
		}

		// For initial load or when no previous page, use enhanced pattern detection
		return isLikelyDeferredProp(currentValue, key);
	});

	return deferredKeys.reduce(
		(acc, key) => {
			acc[key] = currentPage.props[key];
			return acc;
		},
		{} as Record<string, any>,
	);
};

// Moved outside component to avoid re-creation and dependency issues
const createGetSharedData = (
	currentPage: InertiaPage | null,
	previousPage: InertiaPage | null,
) => {
	if (!currentPage || !previousPage) return {};

	const currentKeys = Object.keys(currentPage.props);
	const prevKeys = Object.keys(previousPage.props);
	const sharedKeys = currentKeys.filter(
		(key) =>
			prevKeys.includes(key) &&
			JSON.stringify(currentPage.props[key]) ===
				JSON.stringify(previousPage.props[key]),
	);

	return sharedKeys.reduce(
		(acc, key) => {
			acc[key] = currentPage.props[key];
			return acc;
		},
		{} as Record<string, any>,
	);
};

const PagePanel: React.FC<PagePanelProps> = ({
	currentPage,
	previousPage,
	framework,
	activePageView,
	setActivePageView,
	onToggleCollapse,
	onIndentChange,
	onFontSizeChange,
	settings,
}) => {
	const [searchTerm, setSearchTerm] = useState("");

	const handleSearch = (search: string) => {
		setSearchTerm(search);
	};

	const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && searchTerm.trim()) {
			// Focus remains on search input - the filtered results will update automatically
		}
	};

	// Use useCallback to memoize the data getter functions
	const getDeferredData = useCallback(() => {
		return createGetDeferredData(currentPage, previousPage);
	}, [currentPage, previousPage]);

	const getSharedData = useCallback(() => {
		return createGetSharedData(currentPage, previousPage);
	}, [currentPage, previousPage]);

	// Memoized filtered data for each view
	const filteredPropsData = useMemo(() => {
		return filterJsonData(currentPage.props || {}, searchTerm);
	}, [currentPage.props, searchTerm]);

	const filteredSharedData = useMemo(() => {
		return filterJsonData(getSharedData(), searchTerm);
	}, [getSharedData, searchTerm]);

	const filteredDeferredData = useMemo(() => {
		return filterJsonData(getDeferredData(), searchTerm);
	}, [getDeferredData, searchTerm]);

	const { quotesOnKeys, ...restJsonViewSettings } = settings.jsonView;

	const jsonViewProps = {
		...restJsonViewSettings,
		style: {
			...themes[settings.jsonView.theme as keyof typeof themes],
			fontSize: `${settings.jsonView.fontSize}px`,
			padding: JSON_VIEW_DEFAULTS.PADDING,
			lineHeight: JSON_VIEW_DEFAULTS.LINE_HEIGHT,
		},
	};

	return (
		<div className="flex h-full">
			{/* Left Section - JSON View (60%) */}
			<div className="w-3/5 flex flex-col pr-4">
				{/* View Type Buttons */}
				<div className="mb-4 flex gap-2">
					<button
						type="button"
						onClick={() => setActivePageView(PAGE_VIEWS.PROPS)}
						className={`px-3 py-2 text-sm rounded-md font-medium transition-colors ${
							activePageView === PAGE_VIEWS.PROPS
								? "bg-sky-600 text-white"
								: "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600"
						}`}
					>
						Props
					</button>
					<button
						type="button"
						onClick={() => setActivePageView(PAGE_VIEWS.SHARED)}
						className={`px-3 py-2 text-sm rounded-md font-medium transition-colors ${
							activePageView === PAGE_VIEWS.SHARED
								? "bg-sky-600 text-white"
								: "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600"
						}`}
					>
						Shared
					</button>
					<button
						type="button"
						onClick={() => setActivePageView(PAGE_VIEWS.DEFERRED)}
						className={`px-3 py-2 text-sm rounded-md font-medium transition-colors ${
							activePageView === PAGE_VIEWS.DEFERRED
								? "bg-sky-600 text-white"
								: "bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-gray-600"
						}`}
					>
						Deferred
					</button>
				</div>

				{/* JSON View Container */}
				<div className="flex-1">
					<div className={CSS_CLASSES.BORDER_CONTAINER}>
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
							{activePageView === PAGE_VIEWS.PROPS && (
								<JsonView value={filteredPropsData} {...jsonViewProps}>
									{!quotesOnKeys && <JsonView.Quote render={() => <span />} />}
								</JsonView>
							)}
							{activePageView === PAGE_VIEWS.SHARED && (
								<JsonView value={filteredSharedData} {...jsonViewProps}>
									{!quotesOnKeys && <JsonView.Quote render={() => <span />} />}
								</JsonView>
							)}
							{activePageView === PAGE_VIEWS.DEFERRED && (
								<JsonView value={filteredDeferredData} {...jsonViewProps}>
									{!quotesOnKeys && <JsonView.Quote render={() => <span />} />}
								</JsonView>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Right Section - Component Information (40%) */}
			<div className="w-2/5 border-l dark:border-gray-700 pl-4">
				<h3 className="text-lg font-semibold dark:text-white mb-4">
					Current Page
				</h3>
				<div className="space-y-4">
				<div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
					<div className="grid grid-cols-1 gap-4 text-sm">
						<div className="flex items-center gap-2">
							<span className="font-medium dark:text-gray-400">
								Component:
							</span>
							<span className="ml-2 font-mono dark:text-white">
								{currentPage.component}
							</span>
							<button
								type="button"
								className="ml-2 px-2 py-1 text-xs rounded bg-sky-500 text-white hover:bg-sky-600 transition-colors"
								title="Open source in DevTools Sources tab"
								onClick={() => openComponentSource(currentPage.component)}
							>
								Open Source
							</button>
						</div>
							<div>
								<span className="font-medium dark:text-gray-400">URL:</span>
								<span className="ml-2 dark:text-white break-all">
									{currentPage.url}
								</span>
							</div>
							{currentPage.version && (
								<div>
									<span className="font-medium dark:text-gray-400">
										Version:
									</span>
									<span className="ml-2 font-mono dark:text-white">
										{currentPage.version}
									</span>
								</div>
							)}
							{framework && (
								<div>
									<span className="font-medium dark:text-gray-400">
										Framework:
									</span>
									<span className="ml-2 font-mono dark:text-white">
										{framework.name} {framework.version}
									</span>
								</div>
							)}
						</div>
					</div>

					{/* URL Analysis Section */}
					<div>
						<h4 className="text-lg font-semibold dark:text-white mb-3">
							URL Analysis
						</h4>
						<div className="p-4 bg-slate-50 dark:bg-gray-800 rounded-lg text-sm space-y-3">
							<div>
								<span className="font-medium dark:text-gray-400">
									Full URL:
								</span>
								<span className="ml-2 font-mono dark:text-white break-all">
									{currentPage.url}
								</span>
							</div>
							<div>
								<span className="font-medium dark:text-gray-400">
									Query Parameters:
								</span>
								<div className="mt-2 pl-4">
									{(() => {
										try {
											// Handle both relative and absolute URLs
											let urlToAnalyze: string;
											if (currentPage.url.startsWith('http')) {
												// Already a full URL
												urlToAnalyze = currentPage.url;
											} else {
												// Relative URL - construct a full URL for parsing
												urlToAnalyze = `https://example.com${currentPage.url}`;
											}

											const url = new URL(urlToAnalyze);
											const params = Array.from(url.searchParams.entries());

											if (params.length === 0) {
												return (
													<span className="text-slate-500 dark:text-gray-400">
														None
													</span>
												);
											}

											return (
												<div className="space-y-1">
													{params.map(([key, value]) => (
														<div key={key} className="flex items-start gap-2">
															<span className="font-mono text-xs dark:text-gray-400 min-w-0 flex-shrink-0">
																{key}:
															</span>
															<span className="dark:text-white text-xs break-all">
																{value}
															</span>
														</div>
													))}
												</div>
											);
										} catch (e: unknown) {
											// Fallback: try to parse query string manually
											const queryIndex = currentPage.url.indexOf('?');
											if (queryIndex === -1) {
												return (
													<span className="text-slate-500 dark:text-gray-400">
														None
													</span>
												);
											}

											const queryString = currentPage.url.substring(queryIndex + 1);
											const params = new URLSearchParams(queryString);
											const paramEntries = Array.from(params.entries());

											if (paramEntries.length === 0) {
												return (
													<span className="text-slate-500 dark:text-gray-400">
														None
													</span>
												);
											}

											return (
												<div className="space-y-1">
													{paramEntries.map(([key, value]) => (
														<div key={key} className="flex items-start gap-2">
															<span className="font-mono text-xs dark:text-gray-400 min-w-0 flex-shrink-0">
																{key}:
															</span>
															<span className="dark:text-white text-xs break-all">
																{value}
															</span>
														</div>
													))}
												</div>
											);
										}
									})()}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PagePanel;
