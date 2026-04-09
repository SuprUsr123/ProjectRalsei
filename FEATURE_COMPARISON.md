# Feature Comparison: Userscript vs Updated Extension

## Side-by-Side Feature Comparison

### Grid Size Support

| Feature | Userscript | Original Extension | Updated Extension |
|---------|------------|-------------------|-------------------|
| Preset sizes | Limited (hardcoded 256) | 16, 32, 64 only | 16, 32, 64, 128, 256 |
| Custom grid sizes | ✅ Yes (any size) | ❌ No | ✅ Yes (8-512 range) |
| Size validation | Basic | Limited | Strict (8-512 pixels) |
| UI for input | Hardcoded in code | Dropdown only | Dropdown + custom input |

---

### Image Aspect Ratio

| Feature | Userscript | Original Extension | Updated Extension |
|---------|------------|-------------------|-------------------|
| Aspect preservation | ✅ Yes | ✅ Yes | ✅ Yes (toggleable) |
| White padding | ✅ Yes | ✅ Yes | ✅ Yes (with option) |
| Center image | ✅ Yes | ✅ Yes (always) | ✅ Yes (toggleable) |
| Stretch mode | ❌ No | ❌ No | ✅ Yes (disable AR) |

---

### Alpha Blending / Transparency

| Feature | Userscript | Original Extension | Updated Extension |
|---------|------------|-------------------|-------------------|
| Alpha channel handling | ✅ Yes (proper blending) | ⚠️ Threshold only | ✅ Yes (proper blending) |
| Semi-transparent pixels | ✅ Yes | ❌ No (binary) | ✅ Yes (gradual) |
| Alpha formula | `(color × α) + (bg × 1-α)` | Threshold check | `(color × α) + (bg × 1-α)` |
| PNG transparency | ✅ Correct | ❌ Limited | ✅ Correct |
| WebP transparency | ✅ Correct | ❌ Limited | ✅ Correct |

---

### Drawing Metadata

| Feature | Userscript | Original Extension | Updated Extension |
|---------|------------|-------------------|-------------------|
| Drawing name | ✅ Prompt dialog | ❌ No | ✅ Text input field |
| Auto-name | ✅ Yes (timestamp) | ❌ No | ✅ Yes (timestamp) |
| Thumbnail | ✅ Image preview | ❌ No | ✅ Auto-save option |
| Manifest integration | ✅ Direct | ❌ No | ✅ Yes, with metadata |

---

### Color Processing

| Feature | Userscript | Original Extension | Updated Extension |
|---------|------------|-------------------|-------------------|
| Grayscale conversion | Standard luminance | Color-specific tweaks | Color-specific tweaks |
| Red channel boost | ❌ No | ✅ Yes | ✅ Yes |
| Blue channel adjust | ❌ No | ✅ Yes | ✅ Yes |
| Brightness control | ❌ No | ✅ Yes | ✅ Yes |
| Contrast control | ❌ No | ✅ Yes | ✅ Yes |
| Image smoothing | ❌ No | ✅ Yes (4 levels) | ✅ Yes (4 levels) |

---

### User Interface

| Feature | Userscript | Original Extension | Updated Extension |
|---------|------------|-------------------|-------------------|
| Popup UI | ❌ None | ✅ Full popup | ✅ Full popup (enhanced) |
| File picker | ✅ Native dialog | ✅ File input | ✅ File input (same) |
| Preview capability | ⚠️ Limited | ✅ Canvas preview | ✅ Canvas preview (same) |
| Rendering options | ❌ No | ✅ 3 modes | ✅ 3 modes (same) |
| Advanced options | ❌ No | ❌ No | ✅ Checkboxes for control |
| Settings persistence | ❌ No | ✅ Chrome sync | ✅ Chrome sync (same) |

---

### Accessibility & Ease of Use

| Feature | Userscript | Original Extension | Updated Extension |
|---------|------------|-------------------|-------------------|
| Installation complexity | Medium (requires userscript manager) | Easy (Chrome web store) | Easy (Chrome web store) |
| Configuration | Requires code editing | GUI dropdowns | GUI dropdowns + inputs |
| Learning curve | Steep (for developers) | Low | Low |
| Help documentation | Minimal | Good | Excellent (NEW_FEATURES.md) |
| Error messages | Console only | User-friendly popups | User-friendly popups (same) |

---

## Feature-by-Feature Breakdown

### 1. Custom Grid Sizes
**Userscript Approach:**
```javascript
gridSize = 256  // Hardcoded, no UI to change
```

**Updated Extension:**
```javascript
// User selects from dropdown:
// 16x16, 32x32, 64x64, 128x128, 256x256, or Custom
// Custom input validates: 8 ≤ size ≤ 512
```

**Winner:** ✅ Updated Extension (more flexible, validated)

---

### 2. Aspect Ratio & Padding
**Userscript:**
```javascript
// Always pads to square, always centered
if (tmpImgElement.naturalWidth > tmpImgElement.naturalHeight) 
    cHeight = Math.floor(...)
else 
    cWidth = Math.floor(...)
```

**Updated Extension:**
```javascript
// User can toggle:
// - preserveAspect: true/false
// - centerImage: true/false
// Combines for 4 layout options
```

**Winner:** ✅ Updated Extension (user control)

---

### 3. Alpha Blending
**Userscript:**
```javascript
const a = aRaw / 255;
const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
const grayscale = 1 - ((luminance * a) + (1.0 * (1 - a)));
```

**Original Extension:**
```javascript
if (a < 128) {
    gridRow.push(0);  // Binary: transparent = white
    continue;
}
```

**Updated Extension:**
```javascript
const a = aRaw / 255;
const gray = (gray * a) + (1.0 * (1 - a));  // Proper blending
```

**Winner:** ✅ Tie between Userscript & Updated Extension

---

### 4. Drawing Names
**Userscript:**
```javascript
const titleVal = prompt('Enter picture name');
manifest.unshift({
    id: id,
    title: titleVal,  // User input
    ...
})
```

**Updated Extension:**
```javascript
const drawingName = document.getElementById('drawing-name').value.trim() || 
                   `Art ${new Date().toLocaleString()}`;
// Passed to pixel app and saved to manifest
```

**Winner:** ✅ Updated Extension (better UX, optional vs required)

---

### 5. Thumbnail Generation
**Userscript:**
```javascript
item.thumbnail = imgUrl;  // Saves original image
```

**Updated Extension:**
```javascript
let thumbnailUrl = null;
if (autoSaveThumbnail && currentImageData.src) {
    thumbnailUrl = currentImageData.src;
}
// Passed as metadata, saved by pixel app
```

**Winner:** ✅ Tie (same functionality, different implementation)

---

## Integration Architecture

### Userscript Approach
```
pixel.html (running)
    ↓
Userscript injected (runs directly in page context)
    ↓
Direct access to global variables (grid, manifest, etc.)
    ↓
createNew() → drawPixel() → saveDrawingData()
```

### Chrome Extension Approach (Updated)
```
popup.html (user input)
    ↓ (chrome.tabs.sendMessage)
content.js (content script)
    ↓ (CustomEvent)
injector.js (page context injection)
    ↓ (executes code in page context)
pixel.html (running)
    ↓ (accesses globals)
createNew() → drawPixel() → saveDrawingData()
```

**Benefit of Extension:** Better security, persistent storage, better UX

---

## Performance Comparison

| Aspect | Userscript | Extension |
|--------|------------|-----------|
| Loading time | Instant (already on page) | Instant (popup) |
| Processing speed | Fast (direct access) | Fast (same algorithm) |
| Memory usage | Low | Low (popup only when open) |
| Drawing animation | Can be instant | Can be instant |

---

## Code Quality & Maintenance

| Aspect | Userscript | Extension |
|--------|-----------|-----------|
| Modularity | Monolithic script | Separated concerns |
| Error handling | Console logs only | User-friendly messages |
| Validation | Minimal | Comprehensive |
| Documentation | Minimal | Comprehensive |
| Testing | Manual | Can be automated |
| Distribution | Manual (.user.js) | Chrome Web Store |

---

## Recommended Use Cases

### Use Userscript When:
- ❌ Only on the pixel.html page
- ❌ Quick, no-UI needed workflow
- ❌ Hardcoding grid size is acceptable
- ❌ Browser doesn't support extensions

### Use Updated Extension When:
- ✅ Want GUI controls
- ✅ Need custom grid sizes frequently
- ✅ Want thumbnail previews
- ✅ Want to name drawings in UI
- ✅ Want proper alpha blending
- ✅ Want persistent settings
- ✅ Want better error handling

---

## Summary

| Category | Winner |
|----------|--------|
| Flexibility | Extension |
| User Experience | Extension |
| Documentation | Extension |
| Ease of Installation | Extension |
| Direct Page Access | Userscript |
| Customization | Extension |
| **Overall** | **✅ Extension** |

The **updated Chrome extension** now incorporates all the practical features from the userscript while providing:
- Better UI/UX
- More granular control
- Proper error handling
- Comprehensive documentation
- Future-proof architecture

