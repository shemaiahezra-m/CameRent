// Resources Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize category filtering
    initCategoryFilters();
    
    // Initialize newsletter form
    initNewsletterForm();
    
    // Add smooth animations
    addScrollAnimations();
    
    // Initialize article modal
    initArticleModal();
    
    // Initialize color planning tool
    initColorTool();
});

// Planning & Color Reference Tool
function initColorTool() {
    const canvas = document.getElementById('colorCanvas');
    if (!canvas) return; // not on page

    const ctx = canvas.getContext('2d');
    const pickerDot = document.getElementById('pickerDot');
    const hueRange = document.getElementById('hueRange');
    const hexInput = document.getElementById('hexCode');
    const copyBtn = document.getElementById('copyHex');
    const rRange = document.getElementById('rRange');
    const gRange = document.getElementById('gRange');
    const bRange = document.getElementById('bRange');
    const rInput = document.getElementById('rInput');
    const gInput = document.getElementById('gInput');
    const bInput = document.getElementById('bInput');
    const currentSwatch = document.getElementById('currentColor');
    const saveBtn = document.getElementById('saveColor');
    const savedPalette = document.getElementById('savedPalette');
    const paletteCount = document.getElementById('paletteCount');

    const storageKey = 'cr_saved_palette_v1';

    // helpers
    function rgbToHex(r,g,b){
        return '#'+[r,g,b].map(x=>{
            const s = Number(x).toString(16);
            return s.length===1? '0'+s : s;
        }).join('');
    }
    function hexToRgb(hex){
        const h = hex.replace('#','');
        return [parseInt(h.substring(0,2),16), parseInt(h.substring(2,4),16), parseInt(h.substring(4,6),16)];
    }
    function rgbToHsv(r,g,b){
        r/=255; g/=255; b/=255;
        const max = Math.max(r,g,b), min = Math.min(r,g,b);
        const d = max-min; let h=0, s = max===0?0:d/max, v = max;
        if (d!==0){
            switch(max){
                case r: h = (g - b)/d + (g < b ? 6 : 0); break;
                case g: h = (b - r)/d + 2; break;
                case b: h = (r - g)/d + 4; break;
            }
            h = Math.round(h * 60);
        }
        return [h, s, v];
    }
    function hsvToRgb(h,s,v){
        const C = v * s;
        const X = C * (1 - Math.abs((h/60)%2 - 1));
        const m = v - C;
        let r1,g1,b1;
        if (h >=0 && h < 60){ r1=C; g1=X; b1=0; }
        else if (h < 120){ r1=X; g1=C; b1=0; }
        else if (h < 180){ r1=0; g1=C; b1=X; }
        else if (h < 240){ r1=0; g1=X; b1=C; }
        else if (h < 300){ r1=X; g1=0; b1=C; }
        else { r1=C; g1=0; b1=X; }
        return [Math.round((r1+m)*255), Math.round((g1+m)*255), Math.round((b1+m)*255)];
    }

    // canvas drawing: saturation (x) and value (y) for current hue
    function drawColorSquare(hue){
        const w = canvas.width;
        const h = canvas.height;
        // fill with hue
        ctx.fillStyle = `hsl(${hue},100%,50%)`;
        ctx.fillRect(0,0,w,h);
        // white -> hue (left->right)
        const whiteGrad = ctx.createLinearGradient(0,0,w,0);
        whiteGrad.addColorStop(0,'#fff');
        whiteGrad.addColorStop(1,'rgba(255,255,255,0)');
        ctx.fillStyle = whiteGrad;
        ctx.fillRect(0,0,w,h);
        // black gradient top->bottom
        const blackGrad = ctx.createLinearGradient(0,0,0,h);
        blackGrad.addColorStop(0,'rgba(0,0,0,0)');
        blackGrad.addColorStop(1,'#000');
        ctx.fillStyle = blackGrad;
        ctx.fillRect(0,0,w,h);
    }

    // pointer handling
    let isPointerDown = false;
    let hsv = { h: 0, s: 1, v: 0.8 };

    function updateUIFromHSV(){
        const [r,g,b] = hsvToRgb(hsv.h, hsv.s, hsv.v);
        const hex = rgbToHex(r,g,b);
        hexInput.value = hex;
        currentSwatch.style.background = hex;
        rRange.value = r; gRange.value = g; bRange.value = b;
        rInput.value = r; gInput.value = g; bInput.value = b;
        // position picker dot
        const rect = canvas.getBoundingClientRect();
        const x = Math.round(hsv.s * rect.width);
        const y = Math.round((1 - hsv.v) * rect.height);
        pickerDot.style.left = `${x}px`;
        pickerDot.style.top = `${y}px`;
    }

    function setHSVFromCanvasPos(clientX, clientY){
        const rect = canvas.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
        hsv.s = x / rect.width;
        hsv.v = 1 - (y / rect.height);
        updateUIFromHSV();
    }

    // events
    canvas.addEventListener('pointerdown', (e)=>{ isPointerDown=true; canvas.setPointerCapture(e.pointerId); setHSVFromCanvasPos(e.clientX,e.clientY); });
    canvas.addEventListener('pointermove', (e)=>{ if(isPointerDown) setHSVFromCanvasPos(e.clientX,e.clientY); });
    window.addEventListener('pointerup', ()=>{ isPointerDown=false; });

    hueRange.addEventListener('input', ()=>{ hsv.h = parseInt(hueRange.value,10); drawColorSquare(hsv.h); updateUIFromHSV(); });

    // RGB sliders / inputs -> update HSV accordingly
    function updateFromRGBInputs(){
        const r = parseInt(rRange.value,10); const g = parseInt(gRange.value,10); const b = parseInt(bRange.value,10);
        const [h,s,v] = rgbToHsv(r,g,b);
        hsv.h = h; hsv.s = s; hsv.v = v;
        hueRange.value = Math.round(hsv.h);
        drawColorSquare(hsv.h);
        updateUIFromHSV();
    }
    [rRange,gRange,bRange].forEach(el => el && el.addEventListener('input', updateFromRGBInputs));
    [rInput,gInput,bInput].forEach((inp,idx)=>{
        if(!inp) return;
        inp.addEventListener('change', ()=>{
            const v = Math.max(0, Math.min(255, parseInt(inp.value||0,10)));
            if(idx===0) rRange.value = v;
            if(idx===1) gRange.value = v;
            if(idx===2) bRange.value = v;
            updateFromRGBInputs();
        });
    });

    if (copyBtn) copyBtn.addEventListener('click', ()=>{ navigator.clipboard.writeText(hexInput.value).then(()=>showNotification('Hex copied','success')).catch(()=>showNotification('Copy failed','error')); });

    // palette storage
    function loadPalette(){ try{ return JSON.parse(localStorage.getItem(storageKey) || '[]'); }catch(e){ return []; } }
    function savePalette(arr){ localStorage.setItem(storageKey, JSON.stringify(arr)); }
    function renderSaved(){ savedPalette.innerHTML=''; const arr = loadPalette(); paletteCount.textContent = arr.length ? `(${arr.length})` : '';
        arr.forEach(hex => {
            const sw = document.createElement('div'); sw.className='swatch'; sw.style.background = hex;
            const lbl = document.createElement('div'); lbl.className='label'; lbl.textContent = hex;
            sw.appendChild(lbl);
            sw.title = hex;
            sw.addEventListener('click', ()=>{ const [r,g,b] = hexToRgb(hex); rRange.value=r; gRange.value=g; bRange.value=b; updateFromRGBInputs(); });
            savedPalette.appendChild(sw);
        });
    }

    if (saveBtn) saveBtn.addEventListener('click', ()=>{
        const arr = loadPalette(); const hex = hexInput.value; if(!hex) return; if(!arr.includes(hex)) arr.unshift(hex); savePalette(arr.slice(0,12)); renderSaved(); showNotification('Saved to palette','success');
    });

    // Export palette functionality
    const exportBtn = document.getElementById('exportPaletteBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const palette = loadPalette();
            if (palette.length === 0) {
                showNotification('No colors to export', 'error');
                return;
            }
            
            // Create text content with palette info
            let textContent = 'CameRent Color Palette\n';
            textContent += '='.repeat(50) + '\n\n';
            textContent += `Created: ${new Date().toLocaleDateString()}\n`;
            textContent += `Total Colors: ${palette.length}\n\n`;
            textContent += 'Color Codes:\n';
            textContent += '-'.repeat(50) + '\n';
            
            palette.forEach((hex, index) => {
                const [r, g, b] = hexToRgb(hex);
                textContent += `${index + 1}. ${hex.toUpperCase()}\n`;
                textContent += `   RGB: rgb(${r}, ${g}, ${b})\n\n`;
            });
            
            // Create downloadable file
            const blob = new Blob([textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `camerent-palette-${Date.now()}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('Palette exported successfully!', 'success');
        });
        
        // Add hover effect
        exportBtn.addEventListener('mouseenter', () => {
            exportBtn.style.transform = 'translateY(-2px)';
        });
        exportBtn.addEventListener('mouseleave', () => {
            exportBtn.style.transform = 'translateY(0)';
        });
    }
    
    // Clear palette functionality
    const clearBtn = document.getElementById('clearPaletteBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const palette = loadPalette();
            if (palette.length === 0) {
                showNotification('Palette is already empty', 'error');
                return;
            }
            
            if (confirm(`Are you sure you want to clear all ${palette.length} saved colors?`)) {
                savePalette([]);
                renderSaved();
                showNotification('Palette cleared', 'success');
            }
        });
        
        // Add hover effect
        clearBtn.addEventListener('mouseenter', () => {
            clearBtn.style.transform = 'translateY(-2px)';
        });
        clearBtn.addEventListener('mouseleave', () => {
            clearBtn.style.transform = 'translateY(0)';
        });
    }

    // init
    hsv.h = parseInt(hueRange.value||0,10); drawColorSquare(hsv.h); updateUIFromHSV(); renderSaved();

    // If the CSS-driven toggle opens the tool, redraw and reposition UI
    const toggle = document.getElementById('colorToolToggle');
    if (toggle) {
        toggle.addEventListener('change', () => {
            if (toggle.checked) {
                // slight delay to allow layout/painting
                setTimeout(() => { try { drawColorSquare(hsv.h); updateUIFromHSV(); } catch (e) {} }, 60);
                // lock background scrolling while modal is open
                try { document.body.style.overflow = 'hidden'; } catch (e) {}
            } else {
                try { document.body.style.overflow = ''; } catch (e) {}
            }
        });
    }

    // Close modal on Escape or clicking the overlay (minimal JS to improve UX)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const t = document.getElementById('colorToolToggle');
            if (t && t.checked) t.checked = false;
        }
    });
    const modalEl = document.getElementById('colorToolModal');
    if (modalEl) {
        modalEl.addEventListener('click', (ev) => {
            // if clicked on the backdrop (not the dialog), close
            if (ev.target === modalEl) {
                const t = document.getElementById('colorToolToggle');
                if (t) t.checked = false;
            }
        });
    }
}

// Category Filtering
function initCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryDropdown = document.getElementById('category-select');
    const blogCards = document.querySelectorAll('.blog-card');
    const filtersContainer = document.querySelector('.category-filters');
    
    // Function to filter cards
    function filterCards(category) {
        blogCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Handle button clicks
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update data-active attribute for sliding indicator
            if (filtersContainer) {
                filtersContainer.setAttribute('data-active', category);
            }
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Sync dropdown
            if (categoryDropdown) {
                categoryDropdown.value = category;
            }
            
            // Filter cards
            filterCards(category);
        });
    });
    
    // Handle dropdown change
    if (categoryDropdown) {
        categoryDropdown.addEventListener('change', function() {
            const category = this.value;
            
            // Update data-active attribute for sliding indicator
            if (filtersContainer) {
                filtersContainer.setAttribute('data-active', category);
            }
            
            // Update active button
            categoryButtons.forEach(btn => {
                if (btn.getAttribute('data-category') === category) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
            // Filter cards
            filterCards(category);
        });
    }
}

// Newsletter Form
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // Show success message
            showNotification('Success! You\'ve subscribed to our newsletter.', 'success');
            
            // Clear input
            emailInput.value = '';
        });
    }
}

// Show Notification
function showNotification(message, type = 'success') {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        fontSize: '14px',
        fontWeight: '500',
        animation: 'slideInRight 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .blog-card {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
`;
document.head.appendChild(style);

// Scroll Animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe blog cards
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Article Modal
function initArticleModal() {
    const modal = document.getElementById('articleModal');
    const closeBtn = document.getElementById('articleClose');
    
    if (!modal || !closeBtn) {
        console.error('Modal elements not found');
        return;
    }
    
    // Close modal
    closeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        closeArticleModal();
    });
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeArticleModal();
        }
    });
    
    // Close with ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeArticleModal();
        }
    });
}



// Handle all read more buttons
document.addEventListener('click', function(e) {
    const readMoreBtn = e.target.closest('.read-more-btn');
    const readMoreLink = e.target.closest('.read-more-link');
    
    if (readMoreBtn) {
        e.preventDefault();
        // Check if it's the featured article button
        if (readMoreBtn.closest('.featured-card')) {
            openArticleModal();
        } else {
            showNotification('More articles coming soon!', 'success');
        }
    } else if (readMoreLink) {
        e.preventDefault();
        showNotification('More articles coming soon!', 'success');
    }
});

function openArticleModal() {
    const modal = document.getElementById('articleModal');
    const audio = document.getElementById('articleAudio');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Auto-play lofi music when article opens
    if (audio) {
        audio.volume = 0.4; // Set volume to 40%
        audio.play().catch(err => console.log('Audio autoplay prevented:', err));
    }
}

function closeArticleModal() {
    const modal = document.getElementById('articleModal');
    const audio = document.getElementById('articleAudio');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Stop music when article closes
    if (audio) {
        audio.pause();
        audio.currentTime = 0; // Reset to beginning
    }
}

// Share functionality
document.addEventListener('click', function(e) {
    const shareBtn = e.target.closest('.share-btn');
    if (shareBtn) {
        const url = window.location.href;
        const title = 'Creating Insta-Worthy Photos: What You Need to Know';
        
        if (shareBtn.classList.contains('facebook')) {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        } else if (shareBtn.classList.contains('twitter')) {
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        } else if (shareBtn.classList.contains('linkedin')) {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        } else if (shareBtn.classList.contains('copy')) {
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Link copied to clipboard!', 'success');
            });
        }
    }
});

// Search functionality (optional - you can add a search bar later)
function searchBlogs(searchTerm) {
    const blogCards = document.querySelectorAll('.blog-card');
    const searchLower = searchTerm.toLowerCase();
    
    blogCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchLower) || description.includes(searchLower)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
