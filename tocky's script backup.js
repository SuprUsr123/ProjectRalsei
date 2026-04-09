// ==UserScript==
// @name        reKindle Auto-pixel
// @description Draw any picture in the Pixel app
// @match       *://rekindle.ink/pixel*
// ==/UserScript==

async function importImage() {
    gridSize = 256 //64
    let cWidth = gridSize
    let cHeight = gridSize
    
    const file = await new Promise((resolve) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        
        fileInput.onchange = (e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) resolve(selectedFile);
        };
        
        fileInput.click();
    });

    // 2. Wrap the FileReader in a Promise
    const imgUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });

    // 3. Wait for the image element to actually load the data
    const tmpImgElement = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(new Error("Image failed to load"));
        img.src = imgUrl;
    });
    if (tmpImgElement.naturalWidth > tmpImgElement.naturalHeight) cHeight = Math.floor(tmpImgElement.naturalHeight/tmpImgElement.naturalWidth*cWidth)
    else cWidth = Math.floor(tmpImgElement.naturalWidth/tmpImgElement.naturalHeight*cHeight)
    console.log(`Importing a ${cWidth}x${cHeight} image`)
    
    const tmpCanvasElement = document.createElement('canvas');
    tmpCanvasElement.width = cWidth //tmpImgElement.width;
    tmpCanvasElement.height = cHeight //tmpImgElement.height;
    const tmpCanvasContext = tmpCanvasElement.getContext('2d');
    tmpCanvasContext.drawImage(tmpImgElement, 0, 0, cWidth, cHeight);
    
    const rgbImageData = tmpCanvasContext.getImageData(0, 0, cWidth, cHeight).data;

    const imageData = new Array(cHeight).fill(null).map(() => new Array(cWidth).fill(0))
    for (let i = 0; i < rgbImageData.length; i += 4) {
        const [r, g, b, aRaw] = [rgbImageData[i], rgbImageData[i+1], rgbImageData[i+2], rgbImageData[i+3]];
    
        const pIdx = (i / 4) | 0;
        const row = (pIdx / cWidth) | 0;
        const col = pIdx % cWidth;

        // Convert raw alpha (0-255) to 0-1 range
        const a = aRaw / 255;
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // Alpha blending: (Color * Alpha) + (Background * (1 - Alpha))
        // We assume a white background (1.0)
        const grayscale = 1 - ((luminance * a) + (1.0 * (1 - a)));

        if (imageData[row]) {
            imageData[row][col] = grayscale;
        }
    }
    if (tmpImgElement.naturalWidth > tmpImgElement.naturalHeight) {
        for (let i = cHeight; i < cWidth; i++) {
            imageData[i] = new Array(cWidth).fill(0)
        }
    }
    else {
        for (let i = 0; i < cHeight; i++) {
            imageData[i].push(...new Array(cHeight - cWidth).fill(0))
        }
    }
    
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    const titleVal = prompt('Enter picture name');
    manifest.unshift({
        id: id,
        title: titleVal,
        created: Date.now(),
        modified: Date.now(),
        size: gridSize,
        thumbnail: null
    })
    
    saveDrawingData(id, imageData);
    const item = manifest.find(m => m.id === id);
    if (item) {
        item.modified = Date.now();
        item.thumbnail = imgUrl;
        saveManifest()
    }
    
    renderGallery()
}

(function() {
    'use strict';
    
    console.log('Starting Autopixel execution')
    
    const importButton = document.createElement('div')
    importButton.classList.add('close-box')
    importButton.style = 'left:auto; right:250px; width:auto; padding:0 8px; font-weight:normal;'
    importButton.innerText = 'Import Image'
    importButton.onclick = importImage
    console.log('Created the import button')
    
    const titleBar = document.querySelector('.title-bar')
    titleBar.appendChild(importButton)
    console.log('Added the import button into the title bar')
})();