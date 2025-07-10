// uncomment if you want options.html to be opened after extension is installed
/*
chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.tabs.create({
      url: 'options.html',
    });
  }
});
*/

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "CLEAR_INERTIA_REQUESTS") {
		const tabId = message.tabId;
		if (tabId) {
			const key = `inertia-requests-${tabId}`;
			chrome.storage.local.set({ [key]: { requests: [] } });
		}
		return;
	}

	const tabId = sender.tab?.id;
	if (!tabId) return;

	if (message.type === "INERTIA_DETECTED") {
		chrome.storage.local.set({
			[`inertia-detected-${tabId}`]: message.payload,
		});
	}

	if (message.type === "INERTIA_PAGE_UPDATE") {
		chrome.storage.local.set({ [`inertia-page-${tabId}`]: message.payload });
	}

	if (message.type === "INERTIA_REQUEST") {
		const key = `inertia-requests-${tabId}`;
		chrome.storage.local.get(key, (result) => {
			const existingRequests = result[key]?.requests || [];
			const newRequests = [message.payload.request, ...existingRequests];

			if (newRequests.length > 10) {
				newRequests.length = 10;
			}

			chrome.storage.local.set({ [key]: { requests: newRequests } });
		});
	}
});
