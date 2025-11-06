# Assets Folder

This folder contains app assets for SELLERY.

## Required Files

Create these image files before building the app:

1. **icon.png** (1024x1024)
   - Main app icon
   - Used for iOS and Android

2. **splash.png** (1284x2778)
   - Splash screen
   - Background: #E8F5E9 (light green)
   - Feature a 🌱 or SELLERY logo

3. **adaptive-icon.png** (1024x1024)
   - Android adaptive icon
   - Same as icon.png works fine

4. **favicon.png** (48x48)
   - Web favicon
   - Can be a smaller version of icon.png

## Quick Solution

For development, you can use simple colored squares:

```bash
# Install ImageMagick (optional)
brew install imagemagick  # macOS
apt install imagemagick   # Linux

# Generate placeholder icons (green background with emoji)
convert -size 1024x1024 xc:'#4CAF50' -pointsize 400 -gravity center \
  -annotate +0+0 '🌱' icon.png

convert -size 1284x2778 xc:'#E8F5E9' -pointsize 600 -gravity center \
  -annotate +0+0 '🌱' splash.png

cp icon.png adaptive-icon.png
convert icon.png -resize 48x48 favicon.png
```

Or use online tools:
- https://www.canva.com/ (for custom designs)
- https://www.figma.com/ (for professional icons)
