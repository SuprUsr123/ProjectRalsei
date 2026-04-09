/**
 * Injector script - runs in the page context (not sandbox)
 * This provides the automation functions that interact directly with pixel.html
 */

(function() {
    'use strict';

    // Inject CSS patch to fix crunchy image rendering in KindleChat and Pixel
    function injectImageRenderingPatch(renderingMode = 'crisp-edges') {
        const renderingModes = {
            'crisp-edges': `
                image-rendering: crisp-edges;
                image-rendering: -webkit-crisp-edges;
                image-rendering: -moz-crisp-edges;
                -ms-interpolation-mode: nearest-neighbor;
            `,
            'pixelated': `
                image-rendering: pixelated;
                image-rendering: -webkit-optimize-contrast;
                image-rendering: -moz-crisp-edges;
            `,
            'auto': `
                image-rendering: auto;
                image-rendering: -webkit-optimize-contrast;
            `
        };

        const renderingCSS = renderingModes[renderingMode] || renderingModes['crisp-edges'];

        const style = document.createElement('style');
        style.textContent = `
            /* Image Rendering Patch - Fix crunchy images in KindleChat and Pixel */
            .msg-bubble img,
            .gallery-preview img,
            #pixel-canvas {
                ${renderingCSS}
            }
        `;
        document.documentElement.appendChild(style);
    }

    // Run patch immediately (will use default, then update when content script sends mode)
    function applyRenderingPatch() {
        // Get rendering mode from window (set by content script), or use default
        const renderingMode = window.__pixelRendringMode || 'crisp-edges';
        injectImageRenderingPatch(renderingMode);
    }

    if (document.documentElement) {
        applyRenderingPatch();
    } else {
        document.addEventListener('DOMContentLoaded', applyRenderingPatch);
    }

    // Listen for rendering mode changes from content script
    window.addEventListener('PIXEL_RENDERING_MODE_CHANGE', (event) => {
        const { renderingMode } = event.detail;
        injectImageRenderingPatch(renderingMode);
    });

    // Store the injection function globally for updates
    window.__injectImageRenderingPatch = injectImageRenderingPatch;

    // Global state for automation
    let automationActive = false;
    let pixelAppGlobals = null;

    /**
     * Try to locate Pixel app globals
     * Works by checking for common patterns in the page
     */
    function getPixelAppGlobals() {
        // If we already found them, return cached
        if (pixelAppGlobals) return pixelAppGlobals;

        // Look for canvas elements that suggest this is the Pixel app
        const canvases = document.querySelectorAll('canvas');
        if (canvases.length === 0) return null;

        // Check if the common Pixel app state exists in window
        // Look for grid, canvas, ctx globals
        if (typeof grid === 'undefined' && typeof ctx === 'undefined') {
            return null;
        }

        // If we get here, we're in the Pixel app context
        pixelAppGlobals = {
            hasPixelApp: true
        };

        return pixelAppGlobals;
    }

    /**
     * Automate pixel drawing directly using eval (careful, but necessary for page context access)
     * This draws pixels by accessing the page's own globals
     */
    function automateDrawing(gridSize, pixelGrid, metadata = {}) {
        // Check if we're on the Pixel app page
        if (!getPixelAppGlobals()) {
            console.warn('Pixel app not detected on this page');
            return false;
        }

        try {
            // Extract metadata
            const drawingName = metadata.drawingName || `Drawing ${new Date().toLocaleTimeString()}`;
            const thumbnail = metadata.thumbnail || null;
            
            // Execute in page context to access the global variables
            const code = `
                (function() {
                    const newGridSize = ${gridSize};
                    const pixelGrid = ${JSON.stringify(pixelGrid)};
                    const drawingName = ${JSON.stringify(drawingName)};
                    const thumbnail = ${JSON.stringify(thumbnail)};

                    // Create a new drawing with the specified grid size
                    if (typeof createNew === 'function') {
                        createNew(newGridSize);
                        
                        setTimeout(() => {
                            // Draw each pixel based on the grayscale value
                            for (let row = 0; row < newGridSize; row++) {
                                for (let col = 0; col < newGridSize; col++) {
                                    const grayValue = pixelGrid[row][col];
                                    const shade = grayValue;
                                    
                                    // Only draw if not white
                                    if (shade > 0.05) {
                                        grid[row][col] = shade;
                                        drawPixel(row, col, shade);
                                    }
                                }
                            }
                            if (typeof redrawAllPixels === 'function') {
                                redrawAllPixels();
                            }
                            
                            // Update drawing metadata if manifest exists
                            if (currentDrawingId && manifest) {
                                const item = manifest.find(m => m.id === currentDrawingId);
                                if (item) {
                                    item.title = drawingName;
                                    if (thumbnail) {
                                        item.thumbnail = thumbnail;
                                    }
                                    item.modified = Date.now();
                                    if (typeof saveManifest === 'function') {
                                        saveManifest();
                                    }
                                }
                            }
                            
                            if (typeof triggerAutoSave === 'function') {
                                triggerAutoSave();
                            }
                            if (typeof showGallery === 'function') {
                                showGallery();
                            }
                        }, 100);
                    } else {
                        console.warn('Pixel app functions not available');
                    }
                })();
            `;

            // Create and execute script
            const script = document.createElement('script');
            script.textContent = code;
            document.documentElement.appendChild(script);
            script.remove();

            return true;
        } catch (error) {
            console.error('Error automating drawing:', error);
            return false;
        }
    }

    /**
     * Animated version - draws pixels one by one
     */
    function automateDrawingAnimated(gridSize, pixelGrid, speed = 50) {
        if (!getPixelAppGlobals()) {
            console.warn('Pixel app not detected on this page');
            return false;
        }

        try {
            const code = `
                (function() {
                    const newGridSize = ${gridSize};
                    const pixelGrid = ${JSON.stringify(pixelGrid)};
                    const speed = ${speed};

                    if (typeof createNew === 'function') {
                        createNew(newGridSize);

                        setTimeout(() => {
                            let pixelIndex = 0;
                            const allPixels = [];

                            // Flatten the grid
                            for (let row = 0; row < newGridSize; row++) {
                                for (let col = 0; col < newGridSize; col++) {
                                    const grayValue = pixelGrid[row][col];
                                    if (grayValue > 0.05) {
                                        allPixels.push({ row, col, shade: grayValue });
                                    }
                                }
                            }

                            // Animate drawing
                            const animationInterval = setInterval(() => {
                                if (pixelIndex >= allPixels.length) {
                                    clearInterval(animationInterval);
                                    if (typeof redrawAllPixels === 'function') {
                                        redrawAllPixels();
                                    }
                                    if (typeof triggerAutoSave === 'function') {
                                        triggerAutoSave();
                                    }
                                    if (typeof showGallery === 'function') {
                                        showGallery();
                                    }
                                    return;
                                }

                                const { row, col, shade } = allPixels[pixelIndex];
                                grid[row][col] = shade;
                                drawPixel(row, col, shade);
                                pixelIndex++;
                            }, speed);
                        }, 100);
                    }
                })();
            `;

            const script = document.createElement('script');
            script.textContent = code;
            document.documentElement.appendChild(script);
            script.remove();

            return true;
        } catch (error) {
            console.error('Error automating animated drawing:', error);
            return false;
        }
    }

    // Expose globally for extension communication
    window.__pixelAutoDrawInjected = true;

    // Listen for custom events from content script
    window.addEventListener('PIXEL_AUTO_DRAW', (event) => {
        const { gridSize, pixelGrid, renderingMode, metadata } = event.detail;
        
        // Apply rendering mode if provided
        if (renderingMode) {
            injectImageRenderingPatch(renderingMode);
        }
        
        automateDrawing(gridSize, pixelGrid, metadata);
    });

    // Also expose as global functions in case direct access is needed
    window.__automatePixelDrawing = automateDrawing;
    window.__automatePixelDrawingAnimated = automateDrawingAnimated;
    window.__pixelAppDetected = getPixelAppGlobals;

})();
