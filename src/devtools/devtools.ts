// Create the Inertia.js DevTools panel
chrome.devtools.panels.create(
	"Inertia.js",
	"icons/32.png",
	"panel/index.html",
	(panel) => {
		// Show the panel when an Inertia.js app is detected
		panel.onShown.addListener((window) => {});

		panel.onHidden.addListener(() => {});
	},
);
