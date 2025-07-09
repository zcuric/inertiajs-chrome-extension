// Create the Inertia.js DevTools panel
console.log("DevTools script loading...");

chrome.devtools.panels.create(
	"Inertia.js",
	"icons/32.png",
	"panel/index.html",
	(panel) => {
		console.log("Inertia.js DevTools panel created successfully");
		console.log("Panel object:", panel);

		// Show the panel when an Inertia.js app is detected
		panel.onShown.addListener((window) => {
			console.log("Inertia.js DevTools panel shown", window);
		});

		panel.onHidden.addListener(() => {
			console.log("Inertia.js DevTools panel hidden");
		});
	},
);

console.log("DevTools script executed");
