// Storage Keys
export const STORAGE_KEYS = {
	SETTINGS_PREFIX: "inertia-settings-",
	DETECTED_PREFIX: "inertia-detected-",
	PAGE_PREFIX: "inertia-page-",
	REQUESTS_PREFIX: "inertia-requests-",
} as const;

// Time Values
export const TIMEOUTS = {
	LOADING_TIMEOUT: 2000,
} as const;

// JSON View Default Values
export const JSON_VIEW_DEFAULTS = {
	PADDING: "12px",
	LINE_HEIGHT: "1.4",
	MIN_FONT_SIZE: 8,
	MIN_INDENT: 0,
} as const;

// Request Status
export const REQUEST_STATUS = {
	SUCCESS: "success",
	ERROR: "error",
	PENDING: "pending",
} as const;

// Visit Types
export const VISIT_TYPES = {
	INITIAL: "initial",
} as const;

// HTTP Methods
export const HTTP_METHODS = {
	GET: "GET",
	POST: "POST",
	PUT: "PUT",
	PATCH: "PATCH",
	DELETE: "DELETE",
	FORM_METHODS: ["POST", "PUT", "PATCH"],
} as const;

// Theme Types
export const THEME_TYPES = {
	LIGHT: "light",
	DARK: "dark",
	SYSTEM: "system",
} as const;

// Page View Types
export const PAGE_VIEWS = {
	PROPS: "props",
	SHARED: "shared",
	DEFERRED: "deferred",
} as const;

// Tab Names
export const TAB_NAMES = {
	PAGE: "page",
	REQUESTS: "requests",
	FORMS: "forms",
	ROUTES: "routes",
	SETTINGS: "settings",
} as const;

// Chrome Extension Message Types
export const MESSAGE_TYPES = {
	CLEAR_INERTIA_REQUESTS: "CLEAR_INERTIA_REQUESTS",
} as const;

// Layout Fractions
export const LAYOUT = {
	SIDEBAR_WIDTH: "w-1/3",
	CONTENT_WIDTH: "w-2/3",
	GRID_COLS_2: "grid-cols-2",
} as const;

// Common CSS Classes
export const CSS_CLASSES = {
	// Status Colors
	STATUS_SUCCESS: "border-green-500",
	STATUS_ERROR: "border-red-500",
	STATUS_SELECTED: "border-sky-500",
	STATUS_TRANSPARENT: "border-transparent",

	// Text Colors for Status
	TEXT_SUCCESS: "text-green-600",
	TEXT_ERROR: "text-red-600",
	TEXT_DEFAULT: "text-slate-600",

	// Badge Colors
	BADGE_REDIRECT:
		"text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900 px-1.5 py-0.5 rounded-full",
	BADGE_INITIAL:
		"text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 rounded-full",
	BADGE_PARTIAL:
		"text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900 px-1.5 py-0.5 rounded-full",

	// HTTP Method Colors
	METHOD_GET: "bg-green-100 text-green-800",
	METHOD_POST: "bg-blue-100 text-blue-800",
	METHOD_PUT_PATCH: "bg-yellow-100 text-yellow-800",
	METHOD_DELETE: "bg-red-100 text-red-800",
	METHOD_DEFAULT: "bg-gray-100 text-gray-800",

	// Tab Styles
	TAB_ACTIVE: "border-sky-600 text-sky-600",
	TAB_INACTIVE:
		"border-transparent text-slate-500 hover:text-slate-700 dark:text-github-dark-text-secondary dark:hover:text-github-dark-text",

	// Page View Tab Styles
	PAGE_TAB_ACTIVE: "border-sky-500 text-sky-600",
	PAGE_TAB_INACTIVE: "border-transparent text-slate-500 hover:text-slate-600",

	// Button Styles
	BUTTON_PRIMARY: "bg-sky-700 text-gray-100",
	BUTTON_SECONDARY:
		"bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-button-text",
	BUTTON_CLEAR: "px-2 py-1 text-xs rounded bg-red-700 text-gray-100",
	BUTTON_SETTINGS:
		"p-2 rounded-full text-slate-500 dark:text-github-dark-text-secondary hover:bg-slate-200 dark:hover:bg-github-dark-button-hover-bg",

	// Layout
	CENTER_CONTAINER: "flex items-center justify-center h-full",
	LOADING_BG_LIGHT: "bg-gray-50",
	LOADING_BG_DARK: "dark bg-github-dark-bg",

	// Search Input
	SEARCH_INPUT:
		"px-2 py-1 text-sm w-40 bg-slate-200 dark:bg-github-dark-button-bg dark:text-github-dark-text rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500",

	// Common Containers
	SECTION_CONTAINER:
		"p-4 bg-slate-50 dark:bg-github-dark-bg-secondary rounded-lg",
	BORDER_CONTAINER:
		"border dark:border-github-dark-border rounded-lg overflow-hidden",
} as const;

// Messages
export const MESSAGES = {
	LOADING_TITLE: "Looking for Inertia.js...",
	LOADING_SUBTITLE: "Waiting for the page to finish loading.",
	NOT_DETECTED_TITLE: "No Inertia.js app detected",
	NOT_DETECTED_SUBTITLE:
		"Visit a page with an Inertia.js application to start debugging",
	NO_SELECTION: "Select a request from the timeline to view details.",
	NO_FORM_SELECTION: "Select a submission from the timeline to view details.",
	NO_ROUTES: "No routes data available (Ziggy package not detected).",
	INVALID_URL: "Invalid URL",
	NO_PARAMS: "None",
} as const;

// Emojis
export const EMOJIS = {
	LOADING: "⏳",
	SEARCH: "🔍",
	SETTINGS: "⚙️",
} as const;
