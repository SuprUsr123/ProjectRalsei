# Pixel Art Auto-Draw Extension - New Features Update

## Overview
The Chrome extension has been significantly enhanced with features inspired by the `reKindle Auto-pixel` userscript. These new capabilities provide users with more flexibility and control over image import and pixel art creation.

---

## New Features Added

### 1. **Custom Grid Size Support**
**What's New:** Users can now specify arbitrary grid sizes beyond the preset options.

**How It Works:**
- Grid size dropdown now includes options for 16, 32, 64, 128, 256, or **Custom**
- Selecting "Custom" reveals a text input field
- Valid range: 8 to 512 pixels
- Input is validated in real-time

**Use Cases:**
- Import large high-detail images (256x256 grid)
- Create smaller minimalist art (8-16 grid)
- Maintain specific aspect ratios with custom sizing

**Example:**
```javascript
// User selects 256x256 grid
// Or enters custom value like 100 for a 100x100 pixel grid
```

---

### 2. **Enhanced Aspect Ratio Handling**
**What's New:** Smart aspect ratio preservation with white padding options.

**Features:**
- ✅ **Preserve Aspect Ratio** (checkbox, enabled by default)
  - Automatically pads image with white to maintain proportions
  - No distortion or stretching
  - Ideal for realistic previews

- ✅ **Center Image in Grid** (checkbox, enabled by default)
  - Centers the scaled image in the pixel grid
  - Creates balanced white padding on all sides
  - Optional - can be disabled to align to top-left

**Technical Implementation:**
```javascript
// When aspect ratio is preserved:
// 1. Calculate how to fit image in grid
// 2. Center it if option enabled
// 3. Fill remaining space with white (value: 0)

// When stretching:
// 1. Fill entire grid
// 2. No padding needed
```

**Visual Example:**
```
Original Image: 1920x1080 (16:9 ratio)
Grid Size: 32x32

Result with Aspect Ratio Preserved & Centered:
[white] [white] [white] [white] [white] [white]
[white] [  scaled  image   ] [white]
[white] [  scaled  image   ] [white]
[white] [white] [white] [white] [white] [white]
```

---

### 3. **Advanced Alpha Blending**
**What's New:** Proper handling of transparent pixels in PNG and WebP images.

**How It Works:**
- Detects alpha channel (transparency) for each pixel
- Blends transparent pixels with white background
- Formula: `result = (pixelColor × alpha) + (white × (1 - alpha))`

**Benefits:**
- Transparent images render correctly
- Semi-transparent pixels blend naturally
- No harsh edges or transparency artifacts

**Example:**
```javascript
// PNG with transparency
// Semi-transparent red (50% alpha) over white background
// Result: Light pink tone in pixel grid
```

---

### 4. **Drawing Name / Title**
**What's New:** Auto-name artwork with user input option.

**Features:**
- Optional text field for custom drawing name
- Auto-generated name if left empty: `Art [timestamp]`
- Max length: 50 characters
- Name is saved to drawing manifest

**Technical Flow:**
1. User enters name (or leaves blank)
2. Name is passed to extension
3. Extension creates new drawing with name
4. Manifest is updated with title
5. Name appears in pixel app gallery

---

### 5. **Automatic Thumbnail Generation**
**What's New:** Save original image as thumbnail preview.

**Features:**
- ✅ **Auto-save Thumbnail** (checkbox, enabled by default)
- Original image is captured as thumbnail
- Displayed in pixel app gallery
- Helps users remember which art is which
- Uses base64 data URL for storage

**Flow:**
```javascript
// When auto-save thumbnail is enabled:
1. Capture currentImageData.src (base64 image)
2. Pass to extension as thumbnail metadata
3. Store in drawing manifest
4. Display in gallery preview
```

---

## Technical Implementation Details

### Modified Files

#### 1. **popup.html**
**Changes:**
- Added custom grid size input field (hidden by default)
- Added advanced options checkboxes:
  - Preserve aspect ratio
  - Center image
  - Auto-save thumbnail
- Added drawing name input field

#### 2. **popup.js**
**New Functions:**
- `getGridSize()` - Handles both preset and custom grid sizes
- Enhanced `imageToPixelGrid()` parameters:
  - `preserveAspect` (boolean) - Enable aspect ratio padding
  - `centerImage` (boolean) - Center image in grid

**Changes:**
- Event listeners for custom grid size toggle
- Input validation for custom size (8-512 range)
- Enhanced preview and send button handlers
- Metadata collection and passing

#### 3. **content.js**
**Changes:**
- Updated message listener to extract metadata
- Passes `drawingName`, `thumbnail`, and `preserveAspect` to injector
- Maintains backward compatibility

#### 4. **injector.js**
**Changes:**
- Updated `automateDrawing()` to accept metadata object
- Manifest integration for drawing names and thumbnails
- Direct manifest update after drawing completes
- Thumbnail storage in gallery preview

#### 5. **popup.css**
**New Styles:**
- `.checkbox-label` - Styled checkbox controls
- `input[type="number"]` and `input[type="text"]` - Custom input styling
- Focus states and hover effects
- System 7 aesthetic consistency

---

## Image Processing Pipeline

### Complete Flow:
```
1. User uploads image
   ↓
2. Image loaded and displayed as preview
   ↓
3. User configures:
   - Grid size (preset or custom)
   - Brightness/Contrast/Smoothing
   - Aspect ratio preservation
   - Image centering
   - Drawing name
   ↓
4. Generate pixel grid:
   - Create canvas at grid size
   - Fill with white background
   - Calculate image dimensions (preserve aspect if enabled)
   - Draw image with optional smoothing
   - Extract pixel data
   ↓
5. Process pixel data:
   - Convert RGB to grayscale with color-specific tweaks
   - Apply alpha blending to transparent pixels
   - Apply brightness and contrast adjustments
   - Invert for pixel app (1.0 = black, 0.0 = white)
   ↓
6. Send to pixel app with metadata:
   - Grid size
   - Pixel data array
   - Drawing name
   - Thumbnail image
   ↓
7. Pixel app receives and:
   - Creates new drawing
   - Populates pixels
   - Saves metadata
   - Triggers auto-save
   - Returns to gallery
```

---

## Alpha Blending Implementation

```javascript
// Detailed alpha blending calculation:
const aRaw = data[idx + 3];  // 0-255 range
const a = aRaw / 255;        // Convert to 0-1 range
const pixelGray = convertToGrayscale(r, g, b);  // 0-1
const whiteBackground = 1.0;  // White in 0-1 range

// Blend formula:
const blended = (pixelGray * a) + (whiteBackground * (1 - a));

// Example:
// Transparent red (RGB: 255,0,0, A: 128/255 ≈ 0.5)
// Grayscale: 0.299
// Result: (0.299 × 0.5) + (1.0 × 0.5) = 0.6495
// = Light gray tone (semi-transparent red on white)
```

---

## Backward Compatibility

✅ **Fully Compatible**
- Old extension code still works
- Missing metadata fields handled gracefully
- Renders without drawing names if not provided
- Works with existing pixel.html

---

## User Experience Improvements

### Before:
- Only 16x16, 32x32, 64x64 grids
- Aspect ratio always preserved (no option to disable)
- Transparent images handled by threshold
- Generic auto-naming

### After:
- Custom grid sizes (8-512 pixels)
- Toggle aspect ratio preservation
- Smart alpha blending for transparency
- User-defined drawing names
- Thumbnail preview generation
- More granular control over image centering

---

## Browser Storage

### Data Saved:
1. **Rendering Preference** - `chrome.storage.sync.renderingMode`
2. **Drawing Data** - Passed directly to pixel app (stored in localStorage/cloud)
3. **Thumbnails** - Base64 encoded in drawing manifest

---

## Future Enhancement Possibilities

1. **Batch Import** - Upload multiple images at once
2. **Image Filters** - Sepia, threshold, posterize effects
3. **Preset Aspect Ratios** - 1:1, 16:9, 4:3, etc.
4. **Animation** - Step-by-step drawing animation
5. **Undo/Redo** - Support in pixel app integration
6. **Drawing Styles** - Different dithering patterns

---

## Version Information

- **Extension Version**: 1.1.0 (Updated)
- **Manifest Version**: 3
- **Compatibility**: Chrome/Chromium-based browsers
- **Pixel App**: pixel.html (pixel app >= 2.206)

---

## Testing Checklist

- [ ] Custom grid sizes work (test 16, 64, 100, 256)
- [ ] Aspect ratio toggling preserves/stretches correctly
- [ ] Image centering aligns properly
- [ ] Transparent PNGs render with proper blending
- [ ] Drawing names save to manifest
- [ ] Thumbnails display in gallery
- [ ] Auto-save function triggered
- [ ] Rendering modes apply correctly
- [ ] All previous features still work

---

## Notes for Users

**Quick Start:**
1. Open extension popup
2. Upload image
3. Select custom grid size if desired (or use preset)
4. Toggle aspect ratio/centering as needed
5. Enter optional drawing name
6. Click "Send to Pixel App"
7. Pixel app automatically creates and populates drawing

**Tips:**
- For detailed art, use larger grid sizes (256x256)
- For pixelated look, use smaller grids (16x32)
- Always enable "Preserve aspect ratio" for photos
- High contrast images render better with adjusted brightness/contrast
- Thumbnails help organize multiple artworks in gallery

