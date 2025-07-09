const SOURCE = "inertia-devtools-internal";

if (chrome.runtime?.id) {
	try {
		const script = document.createElement("script");
		script.src = chrome.runtime.getURL("injected.js");
		(document.head || document.documentElement).appendChild(script);
		script.onload = () => script.remove();

		window.addEventListener("message", (event) => {
			if (
				event.source === window &&
				event.data.source === SOURCE &&
				chrome.runtime?.id
			) {
				chrome.runtime.sendMessage(event.data.message);
			}
		});
	} catch (e) {
		// The extension context can become invalid if the extension is reloaded.
		// We don't need to do anything here, the new content script will be injected
		// on page reload.
	}
}
