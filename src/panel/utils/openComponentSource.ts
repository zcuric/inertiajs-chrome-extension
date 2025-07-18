// Utility to open a component source file in DevTools Sources tab using heuristics
// Supports common Inertia/Laravel/React/Vue conventions

// Heuristic patterns for common Inertia/Laravel/React/Vue setups
const COMPONENT_PATH_PATTERNS = [
	// Laravel Inertia (PascalCase)
	"/resources/js/Pages/{name}.vue",
	"/resources/js/Pages/{name}.jsx",
	"/resources/js/Pages/{name}.tsx",
	"/resources/js/Pages/{name}.ts",
	"/resources/js/Pages/{name}.js",
	// Laravel Inertia (lowercase folder)
	"/resources/js/pages/{name}.vue",
	"/resources/js/pages/{name}.jsx",
	"/resources/js/pages/{name}.tsx",
	"/resources/js/pages/{name}.ts",
	"/resources/js/pages/{name}.js",
	// React/Vite
	"/src/pages/{name}.tsx",
	"/src/pages/{name}.jsx",
	"/src/pages/{name}.ts",
	"/src/pages/{name}.js",
	// Vue
	"/src/pages/{name}.vue",
	// Fallback
	"/{name}.js",
	"/{name}.jsx",
	"/{name}.tsx",
	"/{name}.vue",
];

// Try to guess possible file names (PascalCase, kebab-case, etc)
function getPossibleComponentNames(name: string) {
	const kebab = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
	return [name, kebab, name.toLowerCase()];
}

// Try to open the source file in DevTools Sources tab
export function openComponentSource(componentName: string) {
	if (!window.chrome?.devtools?.panels?.openResource) {
		alert("DevTools API not available. Try in DevTools context.");
		return;
	}

	// Try all patterns and name variants
	const names = getPossibleComponentNames(componentName);
	const tried: string[] = [];
	let found = false;

	// Use inspectedWindow.getResources to get all loaded scripts
	window.chrome.devtools.inspectedWindow.getResources((resources: any[]) => {
		for (const pattern of COMPONENT_PATH_PATTERNS) {
			for (const name of names) {
				const path = pattern.replace("{name}", name);
				tried.push(path);
				// Try to find a resource that ends with this path
				const match = resources.find((r) => r.url && r.url.endsWith(path));
				if (match) {
					window.chrome.devtools.panels.openResource(match.url, 1, () => {});
					found = true;
					return;
				}
			}
		}
		if (!found) {
			alert(
				`Could not find the source file for this component.\nTried:\n` +
					tried.join("\n") +
					"\n\nMake sure source maps are enabled and the file is loaded in the page.",
			);
		}
	});
}
