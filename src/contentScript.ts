const sendDetectionMessage = () => {
	chrome.runtime.sendMessage({
		type: "INERTIA_DETECTED",
		payload: {
			detected: true,
		},
	});
};

const detectInertia = () => {
	const inertiaRoot = document.querySelector("[data-page]");
	if (inertiaRoot) {
		sendDetectionMessage();
		return true;
	}
	return false;
};

if (!detectInertia()) {
	let attempts = 0;
	const interval = setInterval(() => {
		attempts++;
		if (detectInertia() || attempts > 10) {
			clearInterval(interval);
		}
	}, 500);
}

document.addEventListener("inertia:navigate", sendDetectionMessage);
document.addEventListener("inertia:start", sendDetectionMessage);
