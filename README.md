# Pixel Art Auto-Draw Chrome Extension

A Chrome extension that automatically converts images into pixel art guides for the ReKindle Pixel app. **Zero modifications to pixel.html required** - uses direct injection.

## Features

- 📸 **Image Upload** - Upload any image (JPG, PNG, GIF, etc.)
- 🎨 **Auto-Draw** - Converts the image to a pixel grid and automatically draws it
- 🔄 **Smart Grid Adaptation** - Automatically detects image size and suggests optimal grid size
- ⚙️ **Grid Sizes** - Choose between 16x16, 32x32, or 64x64 pixel grids
- 🌞 **Image Adjustments** - Control brightness and contrast before drawing
- 📊 **Image Info** - Shows dimensions and file size at a glance
- 🎯 **Live Preview** - See how your image will be processed
- 🔧 **Zero-Modification** - Works with production pixel.html, no changes needed

## How to Use

### Installation

1. Clone or download this extension to your machine
2. Open `chrome://extensions/` in your browser
3. Enable "Developer mode" (top right)
4. Click "Load unpacked" and select the `pixel-drawer-extension` folder
5. The extension icon will appear in your Chrome toolbar

### Drawing with the Extension

1. Open the **Pixel app** (pixel.html) in your browser
2. Click the extension icon in your Chrome toolbar
3. Click "Upload Image" and select an image file
4. **Automatic magic happens:**
   - Image dimensions and file size are displayed
   - Grid size is auto-selected based on image analysis
   - Recommendation shows why that size was chosen
5. *(Optional)* Adjust brightness and contrast sliders if needed
6. Click "Send to Pixel App"
7. The Pixel app will automatically create a new drawing and fill it with your image!

## Smart Grid Adaptation

The extension analyzes your uploaded image and automatically recommends the best grid size:

- **Small images** (≤64px) → 16×16 grid
- **Medium images** (≤256px) → 32×32 grid  
- **Large images** (>256px) → 64×64 grid
- **Wide/Tall images** → Optimizes based on aspect ratio
- **Square images** → Uses size-based recommendations

The grid size is **auto-selected**, but you can manually override it if needed.

## Intelligent Grayscale Conversion

The extension uses **smooth grayscale** (not binary black/white) with intelligent color-specific adjustments:

### How It Works

1. **High-Quality Resizing** - Images are scaled using smooth interpolation to the selected grid size
2. **Smart Grayscale Conversion** - RGB colors are converted to smooth grayscale with multiple shades
3. **Color-Specific Tweaks**:
   - **Red tones** - Slightly brightened for better visibility
   - **Green tones** - Uses standard perceptual formula (naturally bright)
   - **Blue tones** - Slightly darkened to compensate (naturally darker)
   - **Gray tones** - Simple averaging for accurate representation
4. **Brightness & Contrast** - Fine-tune the overall tone and definition
5. **Live Preview** - See the smooth grayscale result before drawing

### Why This Approach

- **Smooth shading** - Creates natural gradients instead of harsh black/white
- **Color awareness** - Different colors map to grayscale differently for better representation
- **Detail preservation** - Multiple gray levels maintain texture and depth
- **Accurate rendering** - Your pixel art looks like the original image

### Tips for Best Results

- **Upload any color image** - The converter handles all colors intelligently
- **Adjust Contrast** - Increase to make details stand out more
- **Adjust Brightness** - Tweak to get the tone you want
- **Grid Size**: Smaller grids (16×16) for simplicity, larger (64×64) for detail
- **Preview First**: Click "Preview Result" to see smooth grayscale before drawing

## How It Works

### Architecture

The extension uses **content script injection** to avoid any modifications to the original `pixel.html`:

1. **Content Script** (`content.js`) - Runs on every page, handles extension messaging
2. **Injector Script** (`injector.js`) - Injected into the page context at document start
3. **Page Context** - The injector runs in the same context as pixel.html, with full access to its globals

### Image Processing Pipeline

1. **Image Resize** - Your image is resized to match the grid dimensions
2. **Grayscale Conversion** - RGB pixels are converted to grayscale values (0-1)
3. **Brightness/Contrast** - Adjustments are applied to enhance the image
4. **Pixel Grid** - Each pixel becomes a shade value in the grid
5. **Auto-Draw** - The extension sends the grid via `CustomEvent`, the injector executes the drawing

### Technical Details

- The extension uses `imageToPixelGrid()` to convert images to pixel data
- Grayscale conversion uses standard luminosity formula: `(R×0.299 + G×0.587 + B×0.114) / 255`
- Brightness and contrast are applied using linear adjustments
- The injector creates a script tag with the drawing code, which executes in the page's global context
- This allows direct access to `grid`, `createNew()`, `drawPixel()`, etc. without modifying pixel.html

## Files

- `manifest.json` - Extension configuration (Manifest v3)
- `popup.html` - Extension popup UI
- `popup.css` - Styling with System 7 aesthetics
- `popup.js` - Image processing and extension logic
- `content.js` - Content script that runs on all pages
- `injector.js` - Script injected into page context (does the actual drawing)
- `README.md` - This file

## Tips

- **Best Results** - Works best with images that have good contrast
- **Brightness** - Increase brightness (>1) to fill lighter areas
- **Grid Size** - Larger grids (64x64) capture more detail
- **Contrast** - Increase contrast to make details pop
- **No pixel.html Changes** - Injection is completely transparent to the production site

## Troubleshooting

**"Please open the Pixel app first"**
- Make sure pixel.html is open in the current Chrome tab
- The detector checks for canvas elements and global variables

**Nothing happens after clicking "Send to Pixel App"**
- Check the browser console (F12) for errors
- Make sure the pixel.html page is fully loaded
- Try refreshing pixel.html and trying again

**Image doesn't look right**
- Adjust the brightness and contrast sliders
- Try a smaller grid size for cleaner results
- Use images with good contrast and clear shapes

## Browser Compatibility

- Chrome/Chromium: ✅ Full support
- Edge: ✅ Full support (Chromium-based)
- Other browsers: ❌ Not supported (Chrome extension format)

## Production Ready

✅ No modifications to pixel.html required
✅ Uses standard Chrome extension APIs
✅ Manifest v3 compliant
✅ Safe injection pattern
✅ Zero side effects

## License

Created for ReKindle. Part of the pixel art automation suite.
