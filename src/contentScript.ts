const SOURCE = "inertia-devtools-internal";

if (chrome.runtime?.id) {
	const script = document.createElement("script");
	script.src = chrome.runtime.getURL("injected.js");
	(document.head || document.documentElement).appendChild(script);
	script.onload = () => script.remove();

	window.addEventListener("message", (event) => {
		if (event.source === window && event.data.source === SOURCE) {
			chrome.runtime.sendMessage(event.data.message);
		}
	});
}
