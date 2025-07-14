const SOURCE = "inertia-devtools-internal";
let isInitialVisit = true;

const send = (message) => {
	window.postMessage({ source: SOURCE, message }, "*");
};

const detectFramework = () => {
	// Vue
	if (window.__VUE__) {
		return { name: "Vue", version: window.__VUE__.version };
	}
	const vueApp = document.querySelector("[data-v-app]");
	if (vueApp?.__vue_app__) {
		return { name: "Vue", version: vueApp.__vue_app__.version };
	}

	// React
	if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
		let version = null;
		try {
			const renderers = window.__REACT_DEVTOOLS_GLOBAL_HOOK__.renderers;
			const renderer = renderers.get(Array.from(renderers.keys())[0]);
			version = renderer?.version;
		} catch (e) {
			console.error(e);
		}
		return { name: "React", version };
	}

	const rootEl = document.querySelector("#root, #app, [data-page]");
	if (
		rootEl &&
		Object.keys(rootEl).some((key) => key.startsWith("__reactFiber"))
	) {
		return { name: "React" };
	}

	// Svelte
	if (document.querySelector("[class*='svelte-']")) {
		return { name: "Svelte" };
	}

	return null;
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
	const { visit } = event.detail;

	requests[id] = {
		id,
		timestamp: new Date().getTime(),
		method: visit.method.toUpperCase(),
		url: visit.url.href,
		component: null,
		props: null,
		data: visit.data,
		headers: visit.headers,
		responseTime: null,
		status: "pending",
		visitType: isInitialVisit ? "initial" : "navigate",
		isRedirect: false,
		isPartial: !!visit.only?.length,
		only: visit.only,
	};
	isInitialVisit = false;
	event.detail.visit.id = id;
	send({
		type: "INERTIA_DETECTED",
		payload: { detected: true, framework: detectFramework() },
	});
});

document.addEventListener("inertia:success", (event) => {
	// Find the oldest request that hasn't been completed with props.
	const request = Object.values(requests)
		.filter((r) => r.component === null)
		.sort((a, b) => a.timestamp - b.timestamp)[0];

	if (request) {
		if (request.url !== event.detail.page.url) {
			request.isRedirect = true;
		}
		request.component = event.detail.page.component;
		request.props = event.detail.page.props;
		request.url = event.detail.page.url; // Update URL in case of redirect
		request.status = "success";
	}
});

document.addEventListener("inertia:error", (event) => {
	const request = Object.values(requests)
		.filter((r) => r.status === "pending")
		.sort((a, b) => a.timestamp - b.timestamp)[0];

	if (request) {
		request.status = "error";
		request.errors = event.detail.errors;

		const lastSuccess = Object.values(requests)
			.filter((r) => r.status === "success" || r.component)
			.sort((a, b) => b.timestamp - a.timestamp)[0];

		if (lastSuccess) {
			request.component = lastSuccess.component;
		}
	}
});

document.addEventListener("inertia:finish", (event) => {
	const request = requests[event.detail.visit.id];
	if (request) {
		request.responseTime = new Date().getTime() - request.timestamp;

		// Only send if the request has been processed (success or error)
		if (request.status !== "pending") {
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
