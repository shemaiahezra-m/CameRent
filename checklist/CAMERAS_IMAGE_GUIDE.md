# 📸 Guide: How to Add Images to cameras.html

## 🎯 Quick Summary

The cameras.html page has many camera cards. Each card currently has an empty `<div class="camera-image"></div>`. You need to add `<img>` tags inside these divs.

---

## 🔧 Easy Method: Find and Replace All at Once

### Step 1: Prepare Your Image URLs
First, collect all your camera images from Google/Unsplash for each model.

### Step 2: Use Find and Replace in VS Code

1. **Open cameras.html** in VS Code
2. **Press Ctrl+H** (or Cmd+H on Mac) to open Find and Replace
3. **Copy this pattern into "Find":**
```
<div class="camera-image"></div>
```

4. **Copy this into "Replace":**
```html
<div class="camera-image">
                        <!-- TODO: Add camera image URL -->
                        <img src="YOUR_CAMERA_IMAGE_URL_HERE" alt="Camera" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
```

5. **Click "Replace All"** - This will add img tags to ALL camera cards!

---

## 📱 Camera List & Image Search Terms

### SMARTPHONES (16 phones):
1. **iPhone 16 Pro Max** - Search: "iPhone 16 Pro Max product photo"
2. **iPhone 16 Pro** - Search: "iPhone 16 Pro titanium"
3. **iPhone 15 Pro Max** - Search: "iPhone 15 Pro Max"
4. **iPhone 15 Pro** - Search: "iPhone 15 Pro"
5. **iPhone 14 Pro Max** - Search: "iPhone 14 Pro Max deep purple"
6. **iPhone 14 Pro** - Search: "iPhone 14 Pro"
7. **iPhone 13 Pro Max** - Search: "iPhone 13 Pro Max sierra blue"
8. **iPhone 13 Pro** - Search: "iPhone 13 Pro"
9. **iPhone 16 Plus** - Search: "iPhone 16 Plus pink"
10. **iPhone 15** - Search: "iPhone 15 pink"
11. **iPhone 13** - Search: "iPhone 13 starlight"
12. **Samsung S24 Ultra** - Search: "Samsung Galaxy S24 Ultra titanium"
13. **Samsung S23 Ultra** - Search: "Samsung Galaxy S23 Ultra"
14. **Samsung S22 Ultra** - Search: "Samsung Galaxy S22 Ultra"
15. **Samsung Z Flip 5** - Search: "Samsung Galaxy Z Flip 5"
16. **Samsung Z Fold 5** - Search: "Samsung Galaxy Z Fold 5"

### COMPACT CAMERAS (5 cameras):
17. **Canon G7X Mark III** - Search: "Canon PowerShot G7X Mark III"
18. **Canon G7X Mark II** - Search: "Canon G7X Mark II"
19. **Sony ZV-1** - Search: "Sony ZV-1 vlog camera"
20. **Sony ZV-1 II** - Search: "Sony ZV-1 II"
21. **Sony RX100 VII** - Search: "Sony RX100 VII"

### MIRRORLESS & DSLR (10+ cameras):
22. **Sony A7 III** - Search: "Sony Alpha A7 III"
23. **Sony A7C** - Search: "Sony A7C compact"
24. **Sony A6400** - Search: "Sony Alpha A6400"
25. **Canon EOS R5** - Search: "Canon EOS R5"
26. **Canon EOS R6** - Search: "Canon EOS R6"
27. **Canon EOS R50** - Search: "Canon EOS R50"
28. **Canon EOS M50 Mark II** - Search: "Canon M50 Mark II"
29. **Fujifilm X-T5** - Search: "Fujifilm X-T5"
30. **Fujifilm X-S10** - Search: "Fujifilm X-S10"
31. **Nikon Z6 II** - Search: "Nikon Z6 II"

### ACTION CAMERAS (5 cameras):
32. **GoPro Hero 12** - Search: "GoPro Hero 12 Black"
33. **GoPro Hero 11** - Search: "GoPro Hero 11 Black"
34. **GoPro Hero 10** - Search: "GoPro Hero 10 Black"
35. **DJI Osmo Action 4** - Search: "DJI Osmo Action 4"
36. **Insta360 X3** - Search: "Insta360 X3 360 camera"

### DRONES (5 drones):
37. **DJI Mini 3 Pro** - Search: "DJI Mini 3 Pro drone"
38. **DJI Air 3** - Search: "DJI Air 3 drone"
39. **DJI Mavic 3** - Search: "DJI Mavic 3 drone"
40. **DJI Avata 2** - Search: "DJI Avata 2 FPV drone"
41. **DJI Osmo Pocket 3** - Search: "DJI Osmo Pocket 3 gimbal"

### INSTANT/FILM CAMERAS (3 cameras):
42. **Fujifilm Instax Mini 12** - Search: "Fujifilm Instax Mini 12"
43. **Fujifilm Instax Mini Evo** - Search: "Fujifilm Instax Mini Evo"
44. **Polaroid Now+** - Search: "Polaroid Now Plus camera"

### OTHER (4 items):
45. **Canon Selphy CP1500** - Search: "Canon Selphy CP1500 printer"
46. **Zhiyun Smooth 5S** - Search: "Zhiyun Smooth 5S gimbal"
47. **DJI RS 3 Mini** - Search: "DJI RS 3 Mini gimbal"
48. **Zhiyun Weebill 3S** - Search: "Zhiyun Weebill 3S gimbal"

**Total: ~48 camera products!**

---

## 🚀 Step-by-Step Process (After Replace All)

### Method A: Replace One by One (Recommended)

1. **After doing "Replace All"**, all camera-image divs now have img tags
2. **Press Ctrl+F** and search for: `YOUR_CAMERA_IMAGE_URL_HERE`
3. **For each result:**
   - Look at the camera name in the `<h3>` tag below
   - Search Google/Unsplash for that camera
   - Copy the image URL
   - Replace `YOUR_CAMERA_IMAGE_URL_HERE` with your URL
4. **Press F3** to jump to next placeholder
5. **Repeat** until all 48 cameras have images

### Method B: Batch Replace by Category

Replace all smartphones first, then all compact cameras, etc.

**Example for iPhone 16 Pro Max:**
1. Search for: `data-id="iphone-16-pro-max"`
2. Find the img tag in that card
3. Replace the placeholder URL with your iPhone 16 Pro Max image URL

---

## 💡 Getting Image URLs

### Option 1: Official Product Photos (Best Quality)

**For Apple iPhones:**
- Go to: https://www.apple.com/ph/iphone/
- Find the model
- Right-click product image → "Copy Image Address"

**For Samsung:**
- Go to: https://www.samsung.com/ph/smartphones/
- Find the model
- Right-click → "Copy Image Address"

**For Cameras (Sony, Canon, etc.):**
- Go to official brand websites
- Find product page
- Copy image URL

### Option 2: Unsplash (Free Stock Photos)

1. **Go to:** https://unsplash.com
2. **Search:** "iPhone 16 Pro Max" or camera name
3. **Right-click image** → "Copy Image Address"
4. **Add size parameter:** `?w=400&h=400&fit=crop` to the end

**Example:**
```
https://images.unsplash.com/photo-1234567890?w=400&h=400&fit=crop
```

### Option 3: Google Images

1. **Search on Google Images**
2. **Click image to enlarge**
3. **Right-click** → "Copy Image Address"
4. **Make sure it's a direct image URL** (ends with .jpg, .png, etc.)

⚠️ **Note:** Use high-quality, product-style photos with white/clean backgrounds for best results!

---

## 📐 Recommended Image Specs

- **Size:** 400x400px (square) or larger
- **Format:** JPG or PNG
- **Style:** Product photo with clean background
- **Aspect ratio:** Square (1:1) works best for cards

---

## ✅ Example: Before and After

### BEFORE (After Replace All):
```html
<div class="camera-card" data-category="smartphone" data-id="iphone-16-pro-max">
    <div class="camera-image">
        <!-- TODO: Add camera image URL -->
        <img src="YOUR_CAMERA_IMAGE_URL_HERE" alt="Camera" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
    <div class="camera-info">
        <p class="camera-category">Smartphone</p>
        <h3>iPhone 16 Pro Max (256GB)</h3>
        ...
    </div>
</div>
```

### AFTER (With real image):
```html
<div class="camera-card" data-category="smartphone" data-id="iphone-16-pro-max">
    <div class="camera-image">
        <!-- TODO: Add camera image URL -->
        <img src="https://images.unsplash.com/photo-1234567890?w=400&h=400&fit=crop" alt="Camera" style="width: 100%; height: 100%; object-fit: cover;">
    </div>
    <div class="camera-info">
        <p class="camera-category">Smartphone</p>
        <h3>iPhone 16 Pro Max (256GB)</h3>
        ...
    </div>
</div>
```

---

## 🐛 Troubleshooting

### All camera cards show the same placeholder?
✅ You did "Replace All" correctly! Now replace each `YOUR_CAMERA_IMAGE_URL_HERE` with actual URLs one by one.

### Image not showing?
✅ Check if URL is correct (starts with http:// or https://)  
✅ Make sure it's a direct image link  
✅ Try opening the URL in your browser first  
✅ Save file and hard refresh (Ctrl+Shift+R)

### Too many images to replace!
✅ Do it by category (all iPhones first, then Samsungs, etc.)  
✅ Take breaks - you don't have to do all 48 at once!  
✅ Prioritize popular cameras (iPhone 16, S24 Ultra, GoPro 12, etc.)

---

## 🎯 Priority List (If You're Short on Time)

If you can't do all 48, start with these most popular ones:

**Top 10 Priority:**
1. iPhone 16 Pro Max
2. iPhone 16 Pro
3. Samsung S24 Ultra
4. Canon G7X Mark III
5. Sony A7 III
6. GoPro Hero 12
7. DJI Mini 3 Pro
8. Sony ZV-1
9. DJI Osmo Pocket 3
10. Fujifilm Instax Mini 12

---

## 📝 Quick Checklist

- [ ] Did "Replace All" to add img tags to all cards
- [ ] Started replacing placeholder URLs with real images
- [ ] Checked that images load correctly
- [ ] Tested on different screen sizes
- [ ] Saved file after each batch of changes
- [ ] Refreshed browser to see updates

---

## 💪 Pro Tips

1. **Use consistent image style** - All product photos should have similar backgrounds
2. **Copy URLs to a notepad** - Organize URLs by category before pasting
3. **Work in batches** - Do all iPhones, then all Samsungs, etc.
4. **Test frequently** - Save and refresh browser every 5-10 images
5. **Use high-res images** - They'll look better on retina displays

---

Good luck! Ang dami pero kaya mo yan! One category at a time lang! 💪🚀
