# Quick Reference: New Extension Features

## 🎨 What's New in v1.1.0

### Five Major Features Added

#### 1️⃣ **Custom Grid Sizes** (8-512 pixels)
```
Select: 16 | 32 | 64 | 128 | 256 | Custom
Input: [___] (any value 8-512)
```
**Use Case:** Import detailed art in 256x256 or create tiny minimalist designs in 8x8

---

#### 2️⃣ **Aspect Ratio Control**
```
☑ Preserve aspect ratio (pad with white)
☑ Center image in grid
```
**Use Case:** Prevent stretching, maintain photo proportions, choose alignment

---

#### 3️⃣ **Advanced Alpha Blending**
- Proper transparency handling
- Semi-transparent pixels blend smoothly
- Works with PNG, WebP with alpha channels

**Use Case:** Import PNGs with transparent backgrounds - no harsh edges

---

#### 4️⃣ **Drawing Names**
```
Drawing Name (Optional):
[_______________________]
```
**Auto-names as:** `Art Thu Apr 09 2026...` if left empty

---

#### 5️⃣ **Thumbnail Generation**
```
☑ Auto-save thumbnail
```
- Original image saved as preview
- Shows in pixel app gallery
- Helps identify artwork

---

## 📊 Quick Feature Matrix

| Feature | Status | How to Use |
|---------|--------|-----------|
| Custom grid sizes | ✅ NEW | Dropdown → Custom |
| Preserve aspect ratio | ✅ IMPROVED | Checkbox (enabled by default) |
| Center image | ✅ IMPROVED | Checkbox (enabled by default) |
| Alpha blending | ✅ ENHANCED | Auto (better transparency handling) |
| Drawing names | ✅ NEW | Text input field |
| Thumbnails | ✅ NEW | Checkbox (auto-enabled) |

---

## 🚀 Quick Start Guide

### Step 1: Upload Image
```
Click: "Upload Image" button
Select: Image file from computer
```

### Step 2: Configure Settings
```
Grid Size: Select preset or "Custom"
If Custom: Enter size (e.g., 100)
Aspect Ratio: Keep checkbox ON (recommended)
Center Image: Keep checkbox ON (recommended)
Auto-save Thumbnail: Keep checkbox ON (recommended)
```

### Step 3: (Optional) Adjust Image
```
Brightness: Slide to adjust
Contrast: Slide to adjust
Smoothing: Choose quality level
Rendering: Choose pixelation style
```

### Step 4: Name Your Art (Optional)
```
Drawing Name: Type custom name or leave blank
```

### Step 5: Send to Pixel App
```
Click: "Send to Pixel App" button
Switch: To pixel.html tab
Watch: Image auto-draw!
Gallery: Shows new artwork with thumbnail
```

---

## 💡 Tips & Tricks

### For Photo Imports
- Use **256x256 grid** for high detail
- Keep **Preserve aspect ratio** ON
- Adjust **brightness/contrast** for better results
- Use **low smoothing** for pixelated effect

### For Quick Art
- Use **16x32 grid** for speed
- Disable **Preserve aspect ratio** if you want to fill grid
- Use **low smoothing** for classic pixel look

### For Transparent Images
- Use **PNG with alpha** channel
- Enable **Auto-save thumbnail** to see result
- **Alpha blending** automatically handles edges

### For Large Grids
- Test with **Preview Result** first
- Large grids (256+) may take seconds to process
- Check **image-rendering** style affects appearance

---

## ⚙️ Advanced Settings Explained

### Preserve Aspect Ratio
```
ON  → Image keeps proportions, white padding added
OFF → Image stretches to fill entire grid
```

### Center Image
```
ON  → Image centered with equal white padding
OFF → Image aligned to top-left corner
```

### Auto-save Thumbnail
```
ON  → Original image shown in gallery
OFF → No preview thumbnail
```

### Brightness (0.5 - 2.0)
```
< 1.0 → Darker
= 1.0 → Original
> 1.0 → Lighter
```

### Contrast (0.5 - 2.0)
```
< 1.0 → More uniform (less contrast)
= 1.0 → Original
> 1.0 → More dramatic
```

### Smoothing (0-3)
```
0 → Off (Crisp)     - Sharp pixels
1 → Low (Balanced)  - Slightly smooth
2 → Medium          - Smooth
3 → High (Blur)     - Maximum smoothing
```

### Image Rendering
```
Sharp & Crisp  → crisp-edges mode (recommended)
Extra Pixelated → Maximum blocky effect
Smooth & Soft  → auto mode (less pixelated)
```

---

## 🐛 Troubleshooting

### Problem: "Please open the Pixel app first"
**Solution:** Open pixel.html in a tab before sending

### Problem: "Custom grid size must be between 8 and 512"
**Solution:** Enter a number between 8 and 512

### Problem: Image looks stretched
**Solution:** Enable "Preserve aspect ratio" checkbox

### Problem: Transparent areas appear white
**Solution:** This is correct! Transparency blends with white background

### Problem: Drawing doesn't appear
**Solution:** Check pixel app tab, may need to scroll gallery to see new artwork

---

## 📁 File Structure

```
pixel-drawer-extension/
├── manifest.json          (extension configuration)
├── popup.html            (UI controls) ✨ UPDATED
├── popup.css             (styling) ✨ UPDATED
├── popup.js              (logic) ✨ UPDATED
├── content.js            (page integration) ✨ UPDATED
├── injector.js           (automation) ✨ UPDATED
├── NEW_FEATURES.md       (documentation) ✨ NEW
├── FEATURE_COMPARISON.md (userscript vs ext) ✨ NEW
└── images/               (extension icons)
```

---

## 🔄 Backward Compatibility

✅ **Fully Compatible**
- Existing pixel.html works fine
- Previous drawings still accessible
- Can use extension or userscript interchangeably
- No breaking changes

---

## 🎯 Use Cases

### Photo to Pixel Art
1. Upload photo (JPG/PNG)
2. Set grid to **256x256**
3. Adjust brightness/contrast
4. Name it: "My Photo"
5. Send to app

### Icon Design
1. Upload icon/logo
2. Set grid to **32x32**
3. Disable aspect ratio preservation
4. Name it: "Logo Pixel"
5. Send to app

### Transparent Logo
1. Upload PNG with transparency
2. Set grid to **64x64**
3. Enable thumbnails
4. Name it: "Logo Transparent"
5. Send to app → Alpha blending handles transparency

### Quick Sketch
1. Upload sketch/drawing
2. Set grid to **16x16** for speed
3. Enable preview first
4. Adjust if needed
5. Send to app

---

## 🔐 Privacy & Data

- **Rendering preference** stored locally via Chrome Sync
- **Images** sent only to pixel app on same device/account
- **No external servers** contacted (except Firebase by pixel app)
- **Thumbnails** stored in browser/cloud by pixel app (not extension)

---

## 📝 Version History

### v1.1.0 (Current)
- ✨ Custom grid sizes (8-512)
- ✨ Aspect ratio toggle
- ✨ Image centering toggle
- ✨ Enhanced alpha blending
- ✨ Drawing name input
- ✨ Thumbnail generation
- 📚 Comprehensive documentation

### v1.0.0 (Original)
- Image upload & processing
- Preset grid sizes (16, 32, 64)
- Brightness/Contrast/Smoothing
- Rendering mode selection
- Auto-preview capability

---

## 🎓 Learning Resources

- **NEW_FEATURES.md** - Detailed technical documentation
- **FEATURE_COMPARISON.md** - Userscript vs Extension comparison
- **Pixel App Docs** - For understanding pixel drawing
- **Chrome Extension Docs** - For technical details

---

## ❓ FAQ

**Q: Why use extension instead of userscript?**
A: Better UI, more control, persistent settings, proper error handling

**Q: Can I use both at the same time?**
A: Yes! They don't conflict, but you probably don't need both

**Q: What if custom grid size is too large?**
A: Works fine, but may take longer to process

**Q: Does aspect ratio work with all images?**
A: Yes! Works with JPG, PNG, WebP, GIF, etc.

**Q: Can I change drawing name after creation?**
A: Yes! Use pixel app's rename function

---

## 📞 Support

For issues or feature requests:
1. Check troubleshooting section above
2. Review NEW_FEATURES.md for detailed info
3. Check FEATURE_COMPARISON.md for usage context
4. Test with preview first before sending

---

**Last Updated:** April 9, 2026
**Extension Version:** 1.1.0
**Tested With:** Pixel App 2.206+

