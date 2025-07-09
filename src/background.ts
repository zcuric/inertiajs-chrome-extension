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
});
