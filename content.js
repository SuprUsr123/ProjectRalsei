/**
 * Content script that runs on every page
 * Injects automation functions directly into the page context
 */

// Get rendering preference and inject into page
chrome.storage.sync.get(['renderingMode'], (result) => {
    const renderingMode = result.renderingMode || 'crisp-edges';
    
    // Inject the automation script into the page
    const script = document.createElement('script');
    script.textContent = `window.__pixelRendringMode = '${renderingMode}';`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
});

// Inject the automation script into the page
const script = document.createElement('script');
script.src = chrome.runtime.getURL('injector.js');
script.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(script);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'DRAW_PIXEL_GRID') {
        const { gridSize, pixelGrid } = request;
        
        // Get rendering preference from storage
        chrome.storage.sync.get(['renderingMode'], (result) => {
            const renderingMode = result.renderingMode || 'crisp-edges';
            
            // Call the injected function with rendering mode
            window.dispatchEvent(new CustomEvent('PIXEL_AUTO_DRAW', {
                detail: {
                    gridSize,
                    pixelGrid,
                    renderingMode
                }
            }));
        });
        
        sendResponse({ success: true });
    }
});
