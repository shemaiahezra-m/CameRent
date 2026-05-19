# 📸 Guide: How to Replace Images in home.html

## 🎯 Quick Summary

I've replaced all the image URLs with placeholders. Bukas, follow these steps to replace them with your own images!

---

## 📋 Images to Replace (Total: 11 images)

### 1. **We are the solution** section (1 image)
- **Location:** Line ~236
- **Placeholder:** `YOUR_IMAGE_URL_HERE`
- **Size needed:** 500x500 pixels (square)
- **Description:** Professional camera equipment photo

### 2. **Card Carousel** section (6 images)
- **Location:** Lines ~89-139
- **Placeholders:**
  1. `YOUR_CONCERT_IMAGE_URL_HERE` - Concert/Events (300x400)
  2. `YOUR_VLOG_IMAGE_URL_HERE` - Vlogs/Content (300x400)
  3. `YOUR_SHOOT_IMAGE_URL_HERE` - Photoshoot/Studio (300x400)
  4. `YOUR_TRAVEL_IMAGE_URL_HERE` - Travel/Country (300x400)
  5. `YOUR_MOUNTAIN_IMAGE_URL_HERE` - Mountain/Nature (300x400)
  6. `YOUR_OCEAN_IMAGE_URL_HERE` - Ocean/Beach (300x400)

### 3. **Camera Collections** section (4 images - NEW!)
- **Location:** Lines ~324-358
- **Placeholders:**
  1. `YOUR_SMARTPHONE_IMAGE_URL_HERE` - Smartphones (square, ~200x200)
  2. `YOUR_MIRRORLESS_IMAGE_URL_HERE` - Mirrorless cameras (square, ~200x200)
  3. `YOUR_ACTIONCAM_IMAGE_URL_HERE` - Action cameras/GoPro (square, ~200x200)
  4. `YOUR_DRONE_IMAGE_URL_HERE` - Drones (square, ~200x200)

---

## 🔧 How to Get Image URLs

### Option 1: Unsplash (Recommended - Free high-quality photos)

1. **Go to:** https://unsplash.com
2. **Search for:** camera, concert, travel, etc.
3. **Find a photo you like**
4. **Right-click on the photo** → "Copy Image Address"
5. **Paste the URL** in your code

**Example Unsplash URL format:**
```
https://images.unsplash.com/photo-1234567890?w=500&h=500&fit=crop
```

**Tips:**
- Add `?w=500&h=500&fit=crop` at the end to resize
- For carousel: use `?w=300&h=400&fit=crop`
- For We are the solution: use `?w=500&h=500&fit=crop`

---

### Option 2: Your Own Photos (Upload to Imgur)

1. **Go to:** https://imgur.com
2. **Click "New Post"**
3. **Upload your image**
4. **After upload, right-click the image** → "Copy Image Address"
5. **Use that URL**

---

### Option 3: Google Images (Not recommended for production)

1. **Search on Google Images**
2. **Click on image**
3. **Right-click** → "Copy Image Address"
4. **Use the direct image URL**

⚠️ **Warning:** Make sure you have permission to use the image!

---

## 📝 Step-by-Step: How to Replace

### Example: Replacing the Concert Image

**BEFORE (Current placeholder):**
```html
<img src="YOUR_CONCERT_IMAGE_URL_HERE" alt="Concert">
```

**AFTER (With your image URL):**
```html
<img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300&h=400&fit=crop" alt="Concert">
```

### Steps:
1. **Find your image online** (Unsplash, Imgur, etc.)
2. **Copy the image URL** (right-click → Copy Image Address)
3. **Open home.html** in VS Code
4. **Find the placeholder** (use Ctrl+F to search for `YOUR_CONCERT_IMAGE_URL_HERE`)
5. **Replace the placeholder** with your URL
6. **Keep everything else the same** (don't delete `alt`, `style`, etc.)
7. **Save the file** (Ctrl+S)
8. **Refresh your browser** to see the new image

---

## 🔍 Finding Each Placeholder in VS Code

Use **Ctrl+F** (or Cmd+F on Mac) and search for:

**We are the solution:**
1. `YOUR_IMAGE_URL_HERE` - Main equipment image

**Card Carousel:**
2. `YOUR_CONCERT_IMAGE_URL_HERE` - Concert card
3. `YOUR_VLOG_IMAGE_URL_HERE` - Vlog card
4. `YOUR_SHOOT_IMAGE_URL_HERE` - Shoot card
5. `YOUR_TRAVEL_IMAGE_URL_HERE` - Travel card
6. `YOUR_MOUNTAIN_IMAGE_URL_HERE` - Mountain card
7. `YOUR_OCEAN_IMAGE_URL_HERE` - Ocean card

**Camera Collections:**
8. `YOUR_SMARTPHONE_IMAGE_URL_HERE` - Smartphones
9. `YOUR_MIRRORLESS_IMAGE_URL_HERE` - Mirrorless cameras
10. `YOUR_ACTIONCAM_IMAGE_URL_HERE` - Action cameras
11. `YOUR_DRONE_IMAGE_URL_HERE` - Drones

---

## ✅ Complete Example: We are the solution image

### Current code (with placeholder):
```html
<figure id="featured-equipment" style="margin: 0; text-align: center;">
    <!-- TODO: Replace with your own image URL below -->
    <img src="YOUR_IMAGE_URL_HERE" 
         alt="Professional Camera Equipment" 
         style="border-radius: 12px; box-shadow: 0 8px 24px rgba(118, 75, 162, 0.3); object-fit: cover;" 
         width="500" 
         height="500">
    <figcaption class="equipment-caption">
        Professional camera gear available for rent
    </figcaption>
</figure>
```

### After replacing (with real URL):
```html
<figure id="featured-equipment" style="margin: 0; text-align: center;">
    <!-- TODO: Replace with your own image URL below -->
    <img src="https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=500&h=500&fit=crop" 
         alt="Professional Camera Equipment" 
         style="border-radius: 12px; box-shadow: 0 8px 24px rgba(118, 75, 162, 0.3); object-fit: cover;" 
         width="500" 
         height="500">
    <figcaption class="equipment-caption">
## 📐 Recommended Image Sizes

| Section | Placeholder | Recommended Size | Aspect Ratio |
|---------|-------------|------------------|--------------|
| We are the solution | `YOUR_IMAGE_URL_HERE` | 500x500px | Square (1:1) |
| Concert card | `YOUR_CONCERT_IMAGE_URL_HERE` | 300x400px | Portrait (3:4) |
| Vlog card | `YOUR_VLOG_IMAGE_URL_HERE` | 300x400px | Portrait (3:4) |
| Shoot card | `YOUR_SHOOT_IMAGE_URL_HERE` | 300x400px | Portrait (3:4) |
| Travel card | `YOUR_TRAVEL_IMAGE_URL_HERE` | 300x400px | Portrait (3:4) |
| Mountain card | `YOUR_MOUNTAIN_IMAGE_URL_HERE` | 300x400px | Portrait (3:4) |
| Ocean card | `YOUR_OCEAN_IMAGE_URL_HERE` | 300x400px | Portrait (3:4) |
| Smartphone | `YOUR_SMARTPHONE_IMAGE_URL_HERE` | 200x200px | Square (1:1) |
| Mirrorless | `YOUR_MIRRORLESS_IMAGE_URL_HERE` | 200x200px | Square (1:1) |
| Action Cam | `YOUR_ACTIONCAM_IMAGE_URL_HERE` | 200x200px | Square (1:1) |
| Drone | `YOUR_DRONE_IMAGE_URL_HERE` | 200x200px | Square (1:1) |
| Section | Placeholder | Recommended Size | Aspect Ratio |
|---------|-------------|------------------|--------------|
| We are the solution | `YOUR_IMAGE_URL_HERE` | 500x500px | Square (1:1) |
| Concert card | `YOUR_CONCERT_IMAGE_URL_HERE` | 300x400px | Portrait (3:4) |
| Vlog card | `YOUR_VLOG_IMAGE_URL_HERE` | 300x400px | Portrait (3:4) |
| Shoot card | `YOUR_SHOOT_IMAGE_URL_HERE` | 300x400px | Portrait (3:4) |
| Travel card | `YOUR_TRAVEL_IMAGE_URL_HERE` | 300x400px | Portrait (3:4) |
| Mountain card | `YOUR_MOUNTAIN_IMAGE_URL_HERE` | 300x400px | Portrait (3:4) |
| Ocean card | `YOUR_OCEAN_IMAGE_URL_HERE` | 300x400px | Portrait (3:4) |

---

## 🎨 Image Suggestions (What to search for)

### We are the solution:
- "professional camera equipment"
- "camera gear on table"
- "photography equipment"
- "DSLR camera closeup"

### Card Carousel:
1. **Concert:** "concert crowd", "live music event", "stage lights"
2. **Vlog:** "vlogger filming", "content creator", "camera selfie"
3. **Shoot:** "photography studio", "camera photoshoot", "portrait session"
4. **Travel:** "travel photography", "tourist destination", "backpacker"
5. **Mountain:** "mountain landscape", "hiking photography", "nature scenery"
6. **Ocean:** "beach sunset", "ocean waves", "coastal scenery"

### Camera Collections:
1. **Smartphone:** "iPhone camera", "smartphone photography", "mobile phone camera"
2. **Mirrorless:** "Sony mirrorless camera", "Canon mirrorless", "mirrorless camera"
3. **Action Cam:** "GoPro camera", "action camera", "adventure camera"
4. **Drone:** "DJI drone", "camera drone", "aerial drone photography"

---

## ⚠️ Important Reminders

1. **Don't delete the other attributes!** Only replace the URL in `src="..."`
2. **Keep the `alt` text** - it's for accessibility
3. **Keep the `style` attribute** - it controls the rounded corners and shadows
4. **Keep `width` and `height`** - they're required for Lesson 5
5. **Save your file** after each change (Ctrl+S)
6. **Refresh your browser** (Ctrl+R or Cmd+R) to see changes

---

## 🐛 Troubleshooting

### Image not showing?
- ✅ Check if URL is correct (must start with `http://` or `https://`)
- ✅ Check if URL ends with image extension (.jpg, .png, etc.) or is from Unsplash/Imgur
- ✅ Check for typos in the URL
- ✅ Make sure you saved the file (Ctrl+S)
## 🎯 Quick Checklist

Before submitting, make sure:
- [ ] All 11 image placeholders are replaced
- [ ] All images are loading correctly
- [ ] Images are appropriate sizes (500x500 or 300x400 or 200x200)
- [ ] No broken image icons (🖼️❌)
- [ ] Camera collection images show actual equipment
- [ ] File is saved
- [ ] Browser is refreshedtioned in this guide
- ✅ Look for HTML comments `<!-- TODO: Replace with... -->`

---

## 🎯 Quick Checklist

Before submitting, make sure:
- [ ] All 7 image placeholders are replaced
- [ ] All images are loading correctly
- [ ] Images are appropriate sizes
- [ ] No broken image icons (🖼️❌)
- [ ] File is saved
- [ ] Browser is refreshed

---

## 💡 Pro Tips

1. **Use consistent image style** - Same color tone, similar lighting
2. **Optimize image sizes** - Don't use huge 5MB images, resize them first
3. **Test on mobile** - Make sure images look good on small screens
4. **Copyright-free sources:**
   - Unsplash.com (free high-quality)
   - Pexels.com (free stock photos)
   - Pixabay.com (free images)

---

Good luck sa pagpalit ng images bukas! If may tanong ka, just ask! 🚀
