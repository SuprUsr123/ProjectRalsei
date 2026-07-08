chrome.action.onClicked.addListener((tab) => {
    chrome.windows.create({
        url: chrome.runtime.getURL(`popup.html?sourceTabId=${tab.id}`),
        type: 'popup',
        width: 520,
        height: 760
    });
});
