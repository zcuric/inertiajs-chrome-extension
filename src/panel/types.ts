export interface InertiaPage {
	component: string;
	props: Record<string, any>;
	url: string;
	version: string | null;
}

export interface InertiaRequest {
	id: string;
	timestamp: number;
	method: string;
	url: string;
	component: string;
	props: Record<string, any>;
	headers: Record<string, string>;
	responseTime?: number;
	status: "success" | "error" | "pending";
	errors?: Record<string, string>;
	visitType: "initial" | "navigate";
	isRedirect: boolean;
	data?: Record<string, any>;
	isPartial?: boolean;
	only?: string[];
}

export interface JsonViewSettings {
	objectSortKeys: boolean;
	indentWidth: number;
	displayObjectSize: boolean;
	displayDataTypes: boolean;
	enableClipboard: boolean;
	collapsed: boolean | number;
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
