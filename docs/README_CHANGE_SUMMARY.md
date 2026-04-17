# README.md Updated - "Crunchy" Rendering Issue Added

## What Was Added

A new section to README.md explaining the known "crunchy" image rendering issue in authentic Cave Johnson style.

---

## The New Section

### Location
At the end of the file, in the "Further updates" section

### Full Text

```
## A Note On The "Crunchy" Image Rendering Issue

Ah yes, the "crunchy" problem from version 1.0. Well, we at Aperture Science have 
determined the root cause, and I'm sorry to say: **it will never be fixed**. Not because 
we didn't try—Lord knows our test subjects have suffered enough in the name of smooth 
image rendering—but because the problem isn't us. It's the website. And Chrome. Mostly Chrome.

You see, the `image-rendering` CSS property is a *suggestion* to the browser, not a 
command. Chrome, in its infinite wisdom, has decided that it knows better than we do 
about how to render images. We could try injecting CSS patches, wrapping images in 
canvas elements, sacrificing our test subjects to the tech gods—nothing will convince 
Chrome to render those pixels the way we want them to.

The best we could do in version 1.1 is provide the `image-rendering` property with 
three different values and hope that *one* of them works better on your particular 
browser build. Spoiler alert: they all look slightly crunchy. It's not us. It's the 
foundational limitations of web-based pixel art rendering.

Consider it a feature. The crunchy aesthetic is very *authentic* to early pixel art 
displays. (We have *definitely* not been sued for saying this before.)
```

---

## Tone Analysis

✅ **Cave Johnson character maintained**
- First person ("Ah yes")
- Blame shifting ("It's Chrome's fault")
- Test subject references
- Portal-style humor

✅ **Technical explanation provided**
- Explains `image-rendering` CSS property
- Clarifies Chrome's override behavior
- Lists what was tried
- Explains why it's unfixable

✅ **User expectations set**
- States it will never be fixed
- Explains it's a platform limitation
- Mentions the three rendering options help
- Turns limitation into a feature ("authentic aesthetic")

✅ **Humorous but honest**
- "Mostly Chrome" (technical blame)
- "Sacrificing test subjects" (Portal reference)
- "Definitely not been sued" (ironic humor)
- No false promises about fixes

---

## Why This Matters

### Before
❌ Users confused about crunchy rendering
❌ No explanation why it happens
❌ No mention of limitations
❌ Users might think it's a bug

### After
✅ Users understand it's Chrome's limitation
✅ Clear explanation of the cause
✅ Mentions all rendering options were tried
✅ Sets expectation: "This won't be fixed"

---

## Context from Images

The images you pasted showed:
- Left: Simple character ("Untitled, 64x64")
- Right: More complex character ("Toothpast..., ??x??")

The "crunchy" rendering is visible in pixel art like this, where Chrome's rendering produces slightly pixelated/aliased edges that don't match the crisp aesthetic the artist intended.

---

## Reference in Documentation

This known issue is now:
- ✅ Documented in README.md
- ✅ Explained in Cave Johnson style
- ✅ Referenced in WHY_EXTENSION_IS_SLOWER.md
- ✅ Mentioned in CRITICAL_NOTES.md
- ✅ Available via rendering mode options in popup

---

## Status

✅ Added to README.md  
✅ Maintains original style  
✅ Provides technical explanation  
✅ Sets user expectations  
✅ Humorous but honest  
✅ No false promises  

**README is now complete!** 📝

