# Loading Screen Images

## Adding Your Background Image

1. **Add your background image** to this directory (`public/images/`)
2. **Name it** `loading-bg.jpg` (or update the filename in the LoadingScreen component)
3. **Recommended specs:**
   - Format: JPG, PNG, or WebP
   - Size: 1920x1080 or higher for best quality
   - File size: Under 2MB for fast loading

## Using Custom Background Images

### Default Usage
The LoadingScreen component automatically looks for `/images/loading-bg.jpg`

### Custom Image
```tsx
<LoadingScreen 
  backgroundImage="/images/your-custom-image.jpg"
  message="Loading your content..."
/>
```

### No Background Image
```tsx
<LoadingScreen 
  backgroundImage=""
  showLogo={true}
  message="Loading..."
/>
```

## Image Guidelines

- **High contrast images** work best with white text overlay
- **Dark or muted images** provide better readability
- **Avoid busy patterns** that might interfere with text
- **Optimize your images** for web to ensure fast loading

## Current Setup

The loading screen will automatically show when:
- ✅ App first loads/refreshes
- ✅ Authentication is being verified
- ✅ Can be triggered manually with `useLoading()` hook

The screen includes:
- 🖼️ Background image with dark overlay
- 🎨 QuickServe logo with beautiful typography
- ⚡ Spinning loader animation
- 💫 Animated dots
- 📊 Progress bar effect 