import JsonView from "@uiw/react-json-view";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CSS_CLASSES, JSON_VIEW_DEFAULTS, PAGE_VIEWS } from "./constants";
import Toolbar from "./Toolbar";
import { themes } from "./themes";
import type { InertiaPage, PanelSettings } from "./types";

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

	// Clear search when changing page views
	useEffect(() => {
		setSearchTerm("");
	}, [activePageView]);

	const handleSearch = (search: string) => {
		setSearchTerm(search);
	};

	const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && searchTerm.trim()) {
			// Focus remains on search input - the filtered results will update automatically
		}
	};

	const getDeferredData = () => {
		if (!currentPage) return {};

		const deferredKeys = Object.keys(currentPage.props).filter((key) => {
			if (previousPage) {
				// A prop is likely deferred if it was null/undefined on the previous page and now has a value
				return (
					(previousPage.props[key] === null ||
						typeof previousPage.props[key] === "undefined") &&
					currentPage.props[key] !== null &&
					typeof currentPage.props[key] !== "undefined"
				);
			}
			// Fallback for initial load: find props that are objects with no keys, a common pattern for deferred placeholders.
			return (
				typeof currentPage.props[key] === "object" &&
				currentPage.props[key] !== null &&
				Object.keys(currentPage.props[key]).length === 0
			);
		});

		return deferredKeys.reduce(
			(acc, key) => {
				acc[key] = currentPage.props[key];
				return acc;
			},
			{} as Record<string, any>,
		);
	};

	const getSharedData = () => {
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

	// Memoized filtered data for each view
	const filteredPropsData = useMemo(() => {
		return filterJsonData(currentPage.props || {}, searchTerm);
	}, [currentPage.props, searchTerm]);

	const filteredSharedData = useMemo(() => {
		return filterJsonData(getSharedData(), searchTerm);
	}, [currentPage, previousPage, searchTerm]);

	const filteredDeferredData = useMemo(() => {
		return filterJsonData(getDeferredData(), searchTerm);
	}, [currentPage, previousPage, searchTerm]);

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
		<div>
			<div className="mb-6 p-4 bg-slate-50 dark:bg-gray-800 rounded-lg">
				<h3 className="text-lg font-semibold dark:text-white mb-2">
					Current Page
				</h3>
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<span className="font-medium dark:text-gray-400">Component:</span>
						<span className="ml-2 font-mono dark:text-white">
							{currentPage.component}
						</span>
					</div>
					<div>
						<span className="font-medium dark:text-gray-400">URL:</span>
						<span className="ml-2 dark:text-white">{currentPage.url}</span>
					</div>
					{currentPage.version && (
						<div>
							<span className="font-medium dark:text-gray-400">Version:</span>
							<span className="ml-2 font-mono dark:text-white">
								{currentPage.version}
							</span>
						</div>
					)}
					{framework && (
						<div>
							<span className="font-medium dark:text-gray-400">Framework:</span>
							<span className="ml-2 font-mono dark:text-white">
								{framework.name} {framework.version}
							</span>
						</div>
					)}
				</div>
			</div>

			<div className="border-b dark:border-gray-700 mb-4">
				<nav className="flex space-x-8">
					<button
						onClick={() => setActivePageView(PAGE_VIEWS.PROPS)}
						className={`py-2 px-1 font-medium text-sm transition-colors ${
							activePageView === PAGE_VIEWS.PROPS
								? CSS_CLASSES.PAGE_TAB_ACTIVE
								: CSS_CLASSES.PAGE_TAB_INACTIVE
						}`}
					>
						Props
					</button>
					<button
						onClick={() => setActivePageView(PAGE_VIEWS.SHARED)}
						className={`py-2 px-1 font-medium text-sm transition-colors ${
							activePageView === PAGE_VIEWS.SHARED
								? CSS_CLASSES.PAGE_TAB_ACTIVE
								: CSS_CLASSES.PAGE_TAB_INACTIVE
						}`}
					>
						Shared
					</button>
					<button
						onClick={() => setActivePageView(PAGE_VIEWS.DEFERRED)}
						className={`py-2 px-1 font-medium text-sm transition-colors ${
							activePageView === PAGE_VIEWS.DEFERRED
								? CSS_CLASSES.PAGE_TAB_ACTIVE
								: CSS_CLASSES.PAGE_TAB_INACTIVE
						}`}
					>
						Deferred
					</button>
				</nav>
			</div>

			<div className="mt-4">
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
	);
};

export default PagePanel;
