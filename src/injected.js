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

const requests = {};

document.addEventListener("inertia:start", (event) => {
	const id = new Date().getTime().toString() + Math.random().toString(36);
	requests[id] = {
		id,
		timestamp: new Date().getTime(),
		method: event.detail.visit.method.toUpperCase(),
		url: event.detail.visit.url.href,
		component: null,
		props: null,
		headers: event.detail.visit.headers,
		responseTime: null,
	};
	event.detail.visit.id = id;
	send({ type: "INERTIA_DETECTED", payload: { detected: true } });
});

document.addEventListener("inertia:success", (event) => {
	// Find the oldest request that hasn't been completed with props.
	const request = Object.values(requests)
		.filter((r) => r.component === null)
		.sort((a, b) => a.timestamp - b.timestamp)[0];

	if (request) {
		request.component = event.detail.page.component;
		request.props = event.detail.page.props;
		request.url = event.detail.page.url; // Update URL in case of redirect
	}
});

document.addEventListener("inertia:finish", (event) => {
	const request = requests[event.detail.visit.id];
	if (request) {
		request.responseTime = new Date().getTime() - request.timestamp;

		// Only send if success has also fired and populated the component
		if (request.component) {
			send({
				type: "INERTIA_REQUEST",
				payload: { request },
			});
		}
		delete requests[event.detail.visit.id];
	}
});

document.addEventListener("inertia:navigate", (event) => {
	sendPage(event.detail.page);
});

// Initial detection
if (document.querySelector("[data-page]")) {
	try {
		const page = JSON.parse(
			document.querySelector("[data-page]").getAttribute("data-page"),
		);
		sendPage(page);
	} catch (e) {
		console.error("Inertia DevTools: Could not parse page data", e);
	}
}
