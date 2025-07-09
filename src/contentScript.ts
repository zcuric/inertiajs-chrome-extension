window.addEventListener("message", (event) => {
	if (event.source === window && event.data.type === "inertia:start") {
		chrome.runtime.sendMessage({
			type: "INERTIA_DETECTED",
			payload: {
				detected: true,
			},
		});
	}
});
