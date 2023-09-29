chrome.runtime.onInstalled.addListener((object) => {
  //  
});

chrome.tabs.onUpdated.addListener(function (tabId, info) {
  if (info.status === 'loading') {
    chrome.tabs.sendMessage(tabId, { request: "load-icons" });
  }
});