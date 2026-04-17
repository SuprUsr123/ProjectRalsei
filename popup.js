let currentImageData = null;
let currentImageWidth = 0;
let currentImageHeight = 0;
let currentFileSize = 0;

// Load rendering preference from storage
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['renderingMode'], (result) => {
        const mode = result.renderingMode || 'crisp-edges';
        document.querySelector(`input[name="rendering"][value="${mode}"]`).checked = true;
    });

    // Handle custom grid size toggle
    document.getElementById('grid-size').addEventListener('change', (e) => {
        const customInput = document.getElementById('custom-grid-size');
        if (e.target.value === 'custom') {
            customInput.style.display = 'block';
            customInput.focus();
        } else {
            customInput.style.display = 'none';
        }
    });

    // Validate custom grid size input
    document.getElementById('custom-grid-size').addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        if (val < 8) e.target.value = 8;
        if (val > 512) e.target.value = 512;
    });
});

// Save rendering preference when changed
document.querySelectorAll('input[name="rendering"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        chrome.storage.sync.set({ renderingMode: e.target.value });
    });
});

document.getElementById('image-input').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    currentFileSize = file.size;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            currentImageData = img;
            currentImageWidth = img.naturalWidth;
            currentImageHeight = img.naturalHeight;
            
            showPreview(img);
            displayImageInfo();
            adaptGridSize(img.naturalWidth, img.naturalHeight);
            updateStatus(`Image loaded`, 'success');
            document.getElementById('send-btn').disabled = false;
            document.getElementById('preview-btn').disabled = false;
        };
        img.onerror = () => {
            updateStatus('Failed to load image', 'error');
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function showPreview(img) {
    const container = document.getElementById('preview-container');
    const preview = document.getElementById('preview-image');
    preview.src = img.src;
    container.style.display = 'block';
}

/**
 * Display image metadata
 */
function displayImageInfo() {
    const infoContainer = document.getElementById('image-info');
    const dimensionsEl = document.getElementById('image-dimensions');
    const sizeEl = document.getElementById('image-size');

    // Format file size
    const sizeInKB = (currentFileSize / 1024).toFixed(1);
    const sizeText = sizeInKB > 1024 
        ? `${(sizeInKB / 1024).toFixed(1)} MB`
        : `${sizeInKB} KB`;

    dimensionsEl.textContent = `${currentImageWidth} × ${currentImageHeight} pixels`;
    sizeEl.textContent = `${sizeText}`;
    infoContainer.style.display = 'flex';
}

/**
 * Analyze image dimensions and recommend best grid size
 * Also auto-select the recommended size
 */
function adaptGridSize(width, height) {
    const avgSize = (width + height) / 2;
    let recommended = '32';
    let reason = '';

    // For square or near-square images, use size-based recommendations
    const aspectRatio = width / height;
    const isSquare = aspectRatio > 0.75 && aspectRatio < 1.33;

    if (isSquare) {
        if (avgSize <= 64) {
            recommended = '16';
            reason = 'Small image - 16x16 recommended';
        } else if (avgSize <= 256) {
            recommended = '32';
            reason = 'Medium image - 32x32 recommended';
        } else {
            recommended = '64';
            reason = 'Large image - 64x64 recommended';
        }
    } else {
        // For non-square images, use aspect ratio
        if (aspectRatio > 2 || aspectRatio < 0.5) {
            recommended = '16';
            reason = 'Wide/tall image - 16x16 for speed';
        } else {
            recommended = '32';
            reason = 'Default - 32x32';
        }
    }

    // Auto-select the recommended grid size
    document.getElementById('grid-size').value = recommended;

    // Show recommendation
    const recommendation = document.getElementById('grid-recommendation');
    recommendation.textContent = reason;
    recommendation.style.display = 'block';
}

document.getElementById('brightness').addEventListener('input', (e) => {
    document.getElementById('brightness-value').textContent = e.target.value;
});

document.getElementById('contrast').addEventListener('input', (e) => {
    document.getElementById('contrast-value').textContent = e.target.value;
});

document.getElementById('smoothing').addEventListener('input', (e) => {
    const smoothingLabels = ['Off (Crisp)', 'Low', 'Medium', 'High'];
    document.getElementById('smoothing-value').textContent = smoothingLabels[parseInt(e.target.value)];
});

document.getElementById('preview-btn').addEventListener('click', async () => {
    if (!currentImageData) {
        updateStatus('Please upload an image first', 'error');
        return;
    }

    const gridSize = getGridSize();
    const brightness = parseFloat(document.getElementById('brightness').value);
    const contrast = parseFloat(document.getElementById('contrast').value);
    const smoothing = parseInt(document.getElementById('smoothing').value);
    const preserveAspect = document.getElementById('preserve-aspect-ratio').checked;
    const centerImage = document.getElementById('center-image').checked;

    updateStatus('Generating preview...', 'info');

    try {
        const pixelGrid = await imageToPixelGrid(currentImageData, gridSize, brightness, contrast, smoothing, preserveAspect, centerImage);
        displayPixelPreview(pixelGrid, gridSize, smoothing);
        updateStatus('Preview generated!', 'success');
    } catch (error) {
        console.error('Error:', error);
        updateStatus('Error: ' + error.message, 'error');
    }
});

/**
 * Get grid size - handles both preset and custom values
 */
function getGridSize() {
    const gridSelect = document.getElementById('grid-size');
    if (gridSelect.value === 'custom') {
        const customSize = parseInt(document.getElementById('custom-grid-size').value);
        if (isNaN(customSize) || customSize < 8 || customSize > 512) {
            throw new Error('Custom grid size must be between 8 and 512');
        }
        return customSize;
    }
    return parseInt(gridSelect.value);
}

/**
 * Display the processed pixel grid as a preview
 */
function displayPixelPreview(pixelGrid, gridSize, smoothing = 0) {
    const canvas = document.getElementById('preview-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size to actual pixels (each pixel will be scaled up)
    const pixelSize = 8; // Size of each pixel in the preview (in display pixels)
    canvas.width = gridSize * pixelSize;
    canvas.height = gridSize * pixelSize;
    
    // Draw pixels scaled up
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const value = pixelGrid[row][col];
            
            // Convert to RGB (0-1 value to 0-255)
            // Invert because pixel app uses 1=black, 0=white
            const inverted = 1 - value;
            const brightness = Math.round(inverted * 255);
            
            // Draw a scaled pixel
            ctx.fillStyle = `rgb(${brightness}, ${brightness}, ${brightness})`;
            ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
        }
    }
    
    canvas.style.display = 'block';
    
    // Apply image-rendering based on selected rendering mode
    const renderingMode = document.querySelector('input[name="rendering"]:checked').value;
    canvas.style.imageRendering = renderingMode;
    
    // Scroll to preview
    canvas.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('send-btn').addEventListener('click', async () => {
    if (!currentImageData) {
        updateStatus('Please upload an image first', 'error');
        return;
    }

    const gridSize = getGridSize();
    const brightness = parseFloat(document.getElementById('brightness').value);
    const contrast = parseFloat(document.getElementById('contrast').value);
    const smoothing = parseInt(document.getElementById('smoothing').value);
    const preserveAspect = document.getElementById('preserve-aspect-ratio').checked;
    const centerImage = document.getElementById('center-image').checked;
    const drawingName = document.getElementById('drawing-name').value.trim() || 
                       `Art ${new Date().toLocaleString()}`;
    const autoSaveThumbnail = document.getElementById('auto-save-thumbnail').checked;

    updateStatus('Processing image...', 'info');

    try {
        // Convert image to pixel grid
        const pixelGrid = await imageToPixelGrid(currentImageData, gridSize, brightness, contrast, smoothing, preserveAspect, centerImage);
        
        // Get the active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tab.url.includes('pixel')) {
            updateStatus('Please open the Pixel app first', 'error');
            return;
        }

        // Generate thumbnail if requested
        let thumbnailData = null;
        if (autoSaveThumbnail && currentImageData.src) {
            // Create a small thumbnail canvas (max 128x128) for storage
            const thumbnailSize = 128;
            const thumbCanvas = document.createElement('canvas');
            const thumbCtx = thumbCanvas.getContext('2d');
            
            // Calculate dimensions maintaining aspect ratio
            const img = currentImageData;
            const scale = Math.min(
                thumbnailSize / img.naturalWidth,
                thumbnailSize / img.naturalHeight
            );
            const width = img.naturalWidth * scale;
            const height = img.naturalHeight * scale;
            
            // Center the image in the canvas
            thumbCanvas.width = thumbnailSize;
            thumbCanvas.height = thumbnailSize;
            thumbCtx.fillStyle = 'white';
            thumbCtx.fillRect(0, 0, thumbnailSize, thumbnailSize);
            thumbCtx.drawImage(
                img,
                (thumbnailSize - width) / 2,
                (thumbnailSize - height) / 2,
                width,
                height
            );
            
            // Convert to data URL for transmission
            thumbnailData = {
                type: 'canvas',
                dataUrl: thumbCanvas.toDataURL('image/png'),
                width: thumbnailSize,
                height: thumbnailSize
            };
        }

        // Send data to content script
        await chrome.tabs.sendMessage(tab.id, {
            type: 'DRAW_PIXEL_GRID',
            gridSize: gridSize,
            pixelGrid: pixelGrid,
            drawingName: drawingName,
            thumbnail: thumbnailData,
            preserveAspect: preserveAspect
        });

        updateStatus('Drawing sent! Check the Pixel app.', 'success');
    } catch (error) {
        console.error('Error:', error);
        updateStatus('Error: ' + error.message, 'error');
    }
});

function updateStatus(message, type = 'info') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = 'status show ' + type;
    
    if (type === 'success') {
        setTimeout(() => {
            status.classList.remove('show');
        }, 3000);
    }
}

/**
 * Convert an image to a grayscale pixel grid with color-specific tweaks
 * Maintains aspect ratio with white padding or stretches based on user preference
 * @param {Image} img - The image element
 * @param {number} gridSize - Size of the grid (16, 32, 64, 128, 256, or custom)
 * @param {number} brightness - Brightness adjustment
 * @param {number} contrast - Contrast adjustment
 * @param {number} smoothing - Smoothing level (0=off/crisp, 1=low, 2=medium, 3=high)
 * @param {boolean} preserveAspect - Whether to preserve aspect ratio with white padding
 * @param {boolean} centerImage - Whether to center the image in the grid
 * @returns {Promise<number[][]>} - 2D array of grayscale values (0-1)
 */
async function imageToPixelGrid(img, gridSize, brightness, contrast, smoothing = 0, preserveAspect = true, centerImage = true) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Set canvas to grid size
    canvas.width = gridSize;
    canvas.height = gridSize;

    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, gridSize, gridSize);

    let drawWidth, drawHeight, offsetX, offsetY;
    
    if (preserveAspect) {
        // Calculate dimensions to maintain aspect ratio (scale down to fit)
        const imgAspect = img.naturalWidth / img.naturalHeight;
        
        if (imgAspect > 1) {
            // Image is wider - fit to width
            drawWidth = gridSize;
            drawHeight = gridSize / imgAspect;
        } else {
            // Image is taller - fit to height
            drawWidth = gridSize * imgAspect;
            drawHeight = gridSize;
        }

        // Center the image if requested
        if (centerImage) {
            offsetX = (gridSize - drawWidth) / 2;
            offsetY = (gridSize - drawHeight) / 2;
        } else {
            offsetX = 0;
            offsetY = 0;
        }
    } else {
        // Stretch to fill the entire grid
        drawWidth = gridSize;
        drawHeight = gridSize;
        offsetX = 0;
        offsetY = 0;
    }

    // Draw image with optional smoothing
    const smoothingQualityMap = ['low', 'medium', 'medium', 'high'];
    ctx.imageSmoothingEnabled = smoothing > 0;
    if (smoothing > 0) {
        ctx.imageSmoothingQuality = smoothingQualityMap[smoothing];
    }
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    
    const imageData = ctx.getImageData(0, 0, gridSize, gridSize);
    const data = imageData.data;

    // Convert to grayscale with color-specific adjustments and alpha blending
    const grid = [];
    for (let row = 0; row < gridSize; row++) {
        const gridRow = [];
        for (let col = 0; col < gridSize; col++) {
            const idx = (row * gridSize + col) * 4;
            
            // Get RGBA values (0-255)
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            const aRaw = data[idx + 3];

            // Convert alpha (0-255) to 0-1 range
            const a = aRaw / 255;
            
            // Get luminance/grayscale
            let gray = convertToGrayscale(r, g, b);

            // Alpha blending: blend with white background (1.0)
            // Result: (grayscale * alpha) + (1.0 * (1 - alpha))
            gray = (gray * a) + (1.0 * (1 - a));

            // Apply brightness
            gray = gray * brightness;
            
            // Apply contrast
            gray = ((gray - 0.5) * contrast) + 0.5;

            // Clamp to 0-1
            gray = Math.max(0, Math.min(1, gray));

            // INVERT for pixel app convention: 1.0 = black, 0.0 = white
            gray = 1 - gray;

            gridRow.push(gray);
        }
        grid.push(gridRow);
    }

    return grid;
}

/**
 * Convert RGB to grayscale with color-specific adjustments
 * Handles reds, greens, blues, yellows, etc. differently for better results
 */
function convertToGrayscale(r, g, b) {
    // Normalize to 0-1
    r = r / 255;
    g = g / 255;
    b = b / 255;

    // Detect dominant color and apply specific tweaks
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const isGray = (max - min) < 0.1; // Nearly grayscale

    let gray;

    if (isGray) {
        // Already grayscale, use simple average
        gray = (r + g + b) / 3;
    } else {
        // Check which color is dominant
        if (r > g && r > b) {
            // Red dominant - boost red channel slightly
            gray = 0.299 * r + 0.587 * g + 0.114 * b;
            gray = Math.pow(gray, 0.95); // Brighten reds slightly
        } else if (g > r && g > b) {
            // Green dominant - use standard formula (green is already bright)
            gray = 0.299 * r + 0.587 * g + 0.114 * b;
        } else if (b > r && b > g) {
            // Blue dominant - darken blues slightly (they're naturally darker)
            gray = 0.299 * r + 0.587 * g + 0.114 * b;
            gray = Math.pow(gray, 1.1); // Darken blues slightly
        } else {
            // Mixed color - use perceptual formula
            gray = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        }
    }

    return Math.max(0, Math.min(1, gray));
}
