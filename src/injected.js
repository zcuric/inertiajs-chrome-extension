const SOURCE = "inertia-devtools-internal";

const send = (message) => {
	window.postMessage({ source: SOURCE, message }, "*");
};

const sendPage = (page) => {
	send({
		type: "INERTIA_PAGE_UPDATE",
		payload: { page },
	});
};

document.addEventListener("inertia:navigate", (event) => {
	sendPage(event.detail.page);
});

document.addEventListener("inertia:start", (event) => {
	send({ type: "INERTIA_DETECTED", payload: { detected: true } });
});

// Initial detection
if (document.querySelector("[data-page]")) {
	send({ type: "INERTIA_DETECTED", payload: { detected: true } });
	try {
		const page = JSON.parse(
			document.querySelector("[data-page]").getAttribute("data-page"),
		);
		sendPage(page);
	} catch (e) {
		console.error("Inertia DevTools: Could not parse page data", e);
	}
}
