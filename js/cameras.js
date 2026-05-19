// ==============================================
// CAMERAS PAGE FUNCTIONALITY
// ==============================================

// Save date selection to localStorage
function saveDateSelection() {
    const pickupInput = document.querySelector('input[name="pickup-date"], #pickupDate, [data-type="pickup"]');
    const returnInput = document.querySelector('input[name="return-date"], #returnDate, [data-type="return"]');
    
    // Try to get dates from calendar or inputs
    let pickupDate = pickupInput?.value || localStorage.getItem('selectedPickupDate');
    let returnDate = returnInput?.value || localStorage.getItem('selectedReturnDate');
    
    // If no dates, set default dates (today and 7 days from now)
    if (!pickupDate) {
        const today = new Date();
        pickupDate = today.toISOString().split('T')[0];
    }
    
    if (!returnDate) {
        const returnD = new Date();
        returnD.setDate(returnD.getDate() + 7);
        returnDate = returnD.toISOString().split('T')[0];
    }
    
    localStorage.setItem('selectedPickupDate', pickupDate);
    localStorage.setItem('selectedReturnDate', returnDate);
    
    console.log('Dates saved:', { pickupDate, returnDate });
}

// Cart Management
const CartManager = {
    items: JSON.parse(localStorage.getItem('cartItems') || '[]'),
    
    addItem(item) {
        // Check if item already exists
        const existingItem = this.items.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            this.items.push({
                ...item,
                quantity: 1,
                addedAt: new Date().toISOString()
            });
        }
        
        // Save cart and date selection BEFORE redirecting
        this.saveCart();
        this.updateCartCount();
        saveDateSelection();
        
        // Show notification
        this.showNotification(`${item.name} added to cart!`);
        
        // Comprehensive debugging
        console.log('===== CAMERAS PAGE - ADD TO CART DEBUG =====');
        console.log('Item added:', item);
        console.log('Cart now contains:', this.items.length, 'items');
        console.log('Full cart:', JSON.stringify(this.items, null, 2));
        
        // Small delay to ensure localStorage is written
        setTimeout(() => {
            // Verify cart was saved
            const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
            console.log('✅ Verified: localStorage has', savedCart.length, 'items');
            console.log('Saved cart:', JSON.stringify(savedCart, null, 2));
            
            // Redirect to cart page
            console.log('Redirecting to cart.html...');
            window.location.href = 'cart.html';
        }, 100);
        
        // decrement stock for this item if available
        try {
            const card = document.querySelector(`.camera-card[data-id="${item.id}"]`);
            if (card && card._stock && typeof card._stock.dec === 'function') {
                // decrement by 1 (safe inside card API)
                card._stock.dec(1);
            }
        } catch (e) { /* ignore */ }
    },
    
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartCount();
    },
    
    updateQuantity(itemId, quantity) {
        const item = this.items.find(cartItem => cartItem.id === itemId);
        if (item) {
            item.quantity = quantity;
            if (quantity <= 0) {
                this.removeItem(itemId);
            } else {
                this.saveCart();
                this.updateCartCount();
            }
        }
    },
    
    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
    },
    
    saveCart() {
        localStorage.setItem('cartItems', JSON.stringify(this.items));
    },
    
    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = this.items.reduce((total, item) => total + (item.quantity || 1), 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    },
    
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
};

// Compare functionality
const CompareManager = {
    items: JSON.parse(localStorage.getItem('compareItems') || '[]'),
    maxItems: 3,
    
    addItem(item) {
        // Check if item already exists
        if (this.items.find(compareItem => compareItem.id === item.id)) {
            this.showNotification(`${item.name} is already in compare list!`, 'warning');
            return;
        }
        
        // Check max items
        if (this.items.length >= this.maxItems) {
            this.showNotification(`You can only compare up to ${this.maxItems} items!`, 'warning');
            return;
        }
        
        this.items.push(item);
        this.saveCompare();
        this.updateCompareCount();
        this.showNotification(`${item.name} added to compare!`);
    },
    
    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCompare();
        this.updateCompareCount();
    },
    
    clearCompare() {
        this.items = [];
        this.saveCompare();
        this.updateCompareCount();
    },
    
    saveCompare() {
        localStorage.setItem('compareItems', JSON.stringify(this.items));
    },
    
    updateCompareCount() {
        const compareCount = document.getElementById('compareCount');
        if (compareCount) {
            compareCount.textContent = this.items.length;
        }
    },
    
    showNotification(message, type = 'success') {
        const bgColor = type === 'warning' ? '#f59e0b' : '#10b981';
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'compare-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
};

// Initialize cameras page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only run if we're on the cameras page
    if (!document.querySelector('.cameras-grid')) {
        return;
    }

    // Check for category parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');

    // Category filtering (multi-select toggle behavior)
    const categoryPills = document.querySelectorAll('.pill');
    const cameraCards = document.querySelectorAll('.camera-card');

    // Active categories set (start with 'all')
    let activeCategories = new Set(['all']);

    function updatePillUI() {
        categoryPills.forEach(p => {
            const cat = p.getAttribute('data-category');
            if (activeCategories.has('all')) {
                if (cat === 'all') p.classList.add('active'); else p.classList.remove('active');
            } else {
                if (activeCategories.has(cat)) p.classList.add('active'); else p.classList.remove('active');
            }
        });
    }

    function applyFilters() {
        // If 'all' is active or nothing selected, show all
        if (activeCategories.has('all') || activeCategories.size === 0) {
            cameraCards.forEach(card => {
                card.classList.remove('hidden');
                card.classList.add('visible');
            });
            // ensure 'all' is the single active state
            activeCategories = new Set(['all']);
            updatePillUI();
            return;
        }

        cameraCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (activeCategories.has(cardCategory)) {
                card.classList.remove('hidden');
                card.classList.add('visible');
            } else {
                card.classList.remove('visible');
                card.classList.add('hidden');
            }
        });
    }

    // Initialize from URL param if present
    if (categoryFromUrl) {
        activeCategories = new Set([categoryFromUrl]);
        updatePillUI();
        applyFilters();
    } else {
        updatePillUI();
    }

    categoryPills.forEach(pill => {
        pill.addEventListener('click', function(e) {
            e.preventDefault();
            const cat = this.getAttribute('data-category');

            if (cat === 'all') {
                activeCategories = new Set(['all']);
            } else {
                // toggle specific category
                if (activeCategories.has('all')) activeCategories.delete('all');

                if (activeCategories.has(cat)) {
                    activeCategories.delete(cat);
                } else {
                    activeCategories.add(cat);
                }

                // if none left, fallback to 'all'
                if (activeCategories.size === 0) activeCategories.add('all');
            }

            updatePillUI();
            applyFilters();
        });
    });

    // Sorting functionality
    const sortBtn = document.getElementById('sort-select');
    const sortDropdown = document.getElementById('sort-dropdown');
    const camerasGrid = document.querySelector('.cameras-grid');

    // Toggle dropdown on button click
    if (sortBtn && sortDropdown) {
        sortBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            sortDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.sort-filter-container')) {
                sortDropdown.classList.remove('active');
            }
        });
    }

    if (sortDropdown && camerasGrid) {
        sortDropdown.addEventListener('change', function() {
            const sortValue = this.value;
            sortDropdown.classList.remove('active');
            const visibleCards = Array.from(cameraCards).filter(card => 
                !card.classList.contains('hidden')
            );

            // Sort the cards
            visibleCards.sort((a, b) => {
                switch(sortValue) {
                    case 'name-asc':
                        const nameA = a.querySelector('h3').textContent.trim();
                        const nameB = b.querySelector('h3').textContent.trim();
                        return nameA.localeCompare(nameB);
                    
                    case 'name-desc':
                        const nameDescA = a.querySelector('h3').textContent.trim();
                        const nameDescB = b.querySelector('h3').textContent.trim();
                        return nameDescB.localeCompare(nameDescA);
                    
                    case 'price-asc':
                        const priceA = parseInt(a.querySelector('.add-to-cart-btn').dataset.price);
                        const priceB = parseInt(b.querySelector('.add-to-cart-btn').dataset.price);
                        return priceA - priceB;
                    
                    case 'price-desc':
                        const priceDescA = parseInt(a.querySelector('.add-to-cart-btn').dataset.price);
                        const priceDescB = parseInt(b.querySelector('.add-to-cart-btn').dataset.price);
                        return priceDescB - priceDescA;
                    
                    default:
                        return 0;
                }
            });

            // Reorder the DOM elements
            visibleCards.forEach(card => {
                camerasGrid.appendChild(card);
            });
        });
    }

    // Product card click - go to product detail page
    cameraCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking on buttons
            if (e.target.closest('.add-to-cart-btn') || 
                e.target.closest('.compare-btn') ||
                e.target.closest('button')) {
                return;
            }
            
            // Get product ID and data from card
            const productId = this.dataset.id || this.querySelector('.add-to-cart-btn')?.dataset.id;
            const button = this.querySelector('.add-to-cart-btn');
            
            if (productId && button) {
                // Save selected dates to localStorage before navigating
                saveDateSelection();
                
                // Get product image
                const imgElement = this.querySelector('.camera-image img');
                const productImage = imgElement ? imgElement.src : '';
                
                // Save product data to localStorage
                const productData = {
                    id: button.dataset.id,
                    name: button.dataset.name,
                    category: button.dataset.category,
                    basePrice: parseInt(button.dataset.price),
                    price4Plus: button.dataset.price4plus ? parseInt(button.dataset.price4plus) : null,
                    price11Plus: button.dataset.price11plus ? parseInt(button.dataset.price11plus) : null,
                    priceMax: button.dataset.priceMax ? parseInt(button.dataset.priceMax) : null,
                    image: productImage
                };
                
                localStorage.setItem('selectedProduct', JSON.stringify(productData));
                
                // Navigate to product detail page
                window.location.href = `product-detail.html?id=${productId}`;
            }
        });
        
        // Add pointer cursor to indicate clickable
        card.style.cursor = 'pointer';
    });
    
    // Add to cart functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart-btn')) {
            e.preventDefault();
            e.stopPropagation(); // Prevent card click

            const button = e.target.closest('.add-to-cart-btn');
            // respect disabled stock state
            if (button.disabled || button.getAttribute('aria-disabled') === 'true') {
                CartManager.showNotification('Sorry — this item is out of stock', 'warning');
                return;
            }

            // Check if user is logged in before allowing add to cart
            if (typeof isUserLoggedIn === 'function') {
                isUserLoggedIn().then(loggedIn => {
                    if (!loggedIn) {
                        // User is not logged in - show login prompt
                        if (typeof showLoginPrompt === 'function') {
                            showLoginPrompt('Please log in to add items to your cart');
                        } else {
                            alert('Please log in to add items to cart');
                            window.location.href = 'login.html';
                        }
                        return;
                    }

                    // User is logged in - proceed with adding to cart
                    proceedWithAddToCart(button);
                });
            } else {
                // Fallback if auth.js not loaded - proceed with adding to cart
                proceedWithAddToCart(button);
            }
        }
        
        // Add to compare functionality
        if (e.target.closest('.compare-btn') && !e.target.closest('#compareBtn')) {
            e.preventDefault();
            e.stopPropagation(); // Prevent card click
            
            const button = e.target.closest('.compare-btn');
            const item = {
                id: button.dataset.id,
                name: button.dataset.name,
                category: button.dataset.category,
                price: button.dataset.price
            };
            
            CompareManager.addItem(item);
        }
    });

    // Helper function to handle the actual add to cart logic
    function proceedWithAddToCart(button) {
        // Check if dates are selected
        const pickupDate = localStorage.getItem('selectedPickupDate');
        const returnDate = localStorage.getItem('selectedReturnDate');
        
        if (!pickupDate || !returnDate) {
            // Show error notification
            const notification = document.createElement('div');
            notification.className = 'date-notification';
            notification.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <span>Please select pickup and return dates first!</span>
            `;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ef4444;
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                z-index: 10000;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
                display: flex;
                align-items: center;
                gap: 10px;
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            // Highlight date inputs
            const dateInputs = document.querySelectorAll('.date-input');
            dateInputs.forEach(input => {
                input.style.border = '2px solid #ef4444';
                input.style.animation = 'shake 0.5s';
            });
            
            // Remove notification after 3 seconds
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
                
                // Remove highlight
                dateInputs.forEach(input => {
                    input.style.border = '';
                    input.style.animation = '';
                });
            }, 3000);
            
            return;
        }

        // Get the card element to retrieve the image
        const card = button.closest('.camera-card');
        const imgElement = card ? card.querySelector('.camera-image img') : null;
        const productImage = imgElement ? imgElement.src : '';

        const item = {
            id: button.dataset.id,
            name: button.dataset.name,
            category: button.dataset.category,
            price: button.dataset.price,
            image: productImage
        };

        CartManager.addItem(item);
    }

    // Initialize counts
    CartManager.updateCartCount();
    CompareManager.updateCompareCount();
    // Initialize stock displays
    initStockDisplays();
    
    // Initialize date pickers/calendars
    initializeDatePickers();
});

// Initialize Date Pickers
function initializeDatePickers() {
    let selectedPickupDate = null;
    let selectedReturnDate = null;
    let currentPickupMonth = new Date();
    let currentReturnMonth = new Date();
    
    const pickupInput = document.getElementById('pickup-input');
    const returnInput = document.getElementById('return-input');
    const pickupCalendar = document.getElementById('pickup-calendar');
    const returnCalendar = document.getElementById('return-calendar');
    const pickupDisplay = document.getElementById('pickup-display');
    const returnDisplay = document.getElementById('return-display');
    
    if (!pickupInput || !returnInput) {
        console.log('Date picker elements not found');
        return;
    }
    
    // Toggle calendar visibility
    pickupInput.addEventListener('click', function(e) {
        e.stopPropagation();
        pickupCalendar.classList.toggle('show');
        returnCalendar.classList.remove('show');
    });
    
    returnInput.addEventListener('click', function(e) {
        e.stopPropagation();
        returnCalendar.classList.toggle('show');
        pickupCalendar.classList.remove('show');
    });
    
    // Close calendars when clicking outside
    document.addEventListener('click', function(e) {
        if (!pickupCalendar.contains(e.target) && !pickupInput.contains(e.target)) {
            pickupCalendar.classList.remove('show');
        }
        if (!returnCalendar.contains(e.target) && !returnInput.contains(e.target)) {
            returnCalendar.classList.remove('show');
        }
    });
    
    // Pickup calendar navigation
    document.getElementById('pickup-prev').addEventListener('click', function(e) {
        e.stopPropagation();
        currentPickupMonth.setMonth(currentPickupMonth.getMonth() - 1);
        renderPickupCalendar();
    });
    
    document.getElementById('pickup-next').addEventListener('click', function(e) {
        e.stopPropagation();
        currentPickupMonth.setMonth(currentPickupMonth.getMonth() + 1);
        renderPickupCalendar();
    });
    
    // Return calendar navigation
    document.getElementById('return-prev').addEventListener('click', function(e) {
        e.stopPropagation();
        currentReturnMonth.setMonth(currentReturnMonth.getMonth() - 1);
        renderReturnCalendar();
    });
    
    document.getElementById('return-next').addEventListener('click', function(e) {
        e.stopPropagation();
        currentReturnMonth.setMonth(currentReturnMonth.getMonth() + 1);
        renderReturnCalendar();
    });
    
    // Render pickup calendar
    function renderPickupCalendar() {
        const year = currentPickupMonth.getFullYear();
        const month = currentPickupMonth.getMonth();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Update month/year display
        const monthYear = currentPickupMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        document.getElementById('pickup-month-year').textContent = monthYear;
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Render dates
        const datesContainer = document.getElementById('pickup-dates');
        datesContainer.innerHTML = '';
        
        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-date empty';
            datesContainer.appendChild(emptyCell);
        }
        
        // Date cells
        for (let day = 1; day <= daysInMonth; day++) {
            const dateCell = document.createElement('div');
            dateCell.className = 'calendar-date';
            dateCell.textContent = day;
            
            const cellDate = new Date(year, month, day);
            cellDate.setHours(0, 0, 0, 0);
            
            // Disable past dates
            if (cellDate < today) {
                dateCell.classList.add('disabled');
            } else {
                // Check if selected
                if (selectedPickupDate && cellDate.getTime() === selectedPickupDate.getTime()) {
                    dateCell.classList.add('selected');
                }
                
                dateCell.addEventListener('click', function(e) {
                    e.stopPropagation();
                    selectedPickupDate = cellDate;
                    selectedReturnDate = null; // Reset return date when pickup changes
                    pickupDisplay.textContent = formatDate(cellDate);
                    returnDisplay.textContent = 'Select Date'; // Reset display
                    pickupCalendar.classList.remove('show');
                    renderPickupCalendar();
                    renderReturnCalendar(); // Re-render return calendar with new min date
                    calculateRentalDays();
                });
            }
            
            datesContainer.appendChild(dateCell);
        }
    }
    
    // Render return calendar
    function renderReturnCalendar() {
        const year = currentReturnMonth.getFullYear();
        const month = currentReturnMonth.getMonth();
        const minDate = selectedPickupDate ? new Date(selectedPickupDate.getTime() + 24 * 60 * 60 * 1000) : new Date();
        minDate.setHours(0, 0, 0, 0);
        
        // Update month/year display
        const monthYear = currentReturnMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        document.getElementById('return-month-year').textContent = monthYear;
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Render dates
        const datesContainer = document.getElementById('return-dates');
        datesContainer.innerHTML = '';
        
        // Empty cells before first day
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-date empty';
            datesContainer.appendChild(emptyCell);
        }
        
        // Date cells
        for (let day = 1; day <= daysInMonth; day++) {
            const dateCell = document.createElement('div');
            dateCell.className = 'calendar-date';
            dateCell.textContent = day;
            
            const cellDate = new Date(year, month, day);
            cellDate.setHours(0, 0, 0, 0);
            
            // Disable dates before min date
            if (cellDate < minDate) {
                dateCell.classList.add('disabled');
            } else {
                // Check if selected
                if (selectedReturnDate && cellDate.getTime() === selectedReturnDate.getTime()) {
                    dateCell.classList.add('selected');
                }
                
                dateCell.addEventListener('click', function(e) {
                    e.stopPropagation();
                    selectedReturnDate = cellDate;
                    returnDisplay.textContent = formatDate(cellDate);
                    returnCalendar.classList.remove('show');
                    renderReturnCalendar();
                    calculateRentalDays();
                });
            }
            
            datesContainer.appendChild(dateCell);
        }
    }
    
    // Calculate rental days
    function calculateRentalDays() {
        const rentalPeriodDiv = document.getElementById('rental-period');
        const rentalDaysSpan = document.getElementById('rental-days');
        
        if (selectedPickupDate && selectedReturnDate && rentalPeriodDiv && rentalDaysSpan) {
            const timeDiff = selectedReturnDate.getTime() - selectedPickupDate.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            const rentalDays = Math.max(daysDiff, 1);
            
            rentalDaysSpan.textContent = rentalDays;
            rentalPeriodDiv.style.display = 'block';
            
            // Update all product prices based on rental duration
            updateAllProductPrices(rentalDays);
        } else if (rentalPeriodDiv) {
            rentalPeriodDiv.style.display = 'none';
        }
    }
    
    // Update all product prices based on rental duration
    function updateAllProductPrices(days) {
        const cameraCards = document.querySelectorAll('.camera-card');
        
        cameraCards.forEach(card => {
            const button = card.querySelector('.add-to-cart-btn');
            const priceSpan = card.querySelector('.price');
            
            if (!button || !priceSpan) return;
            
            const basePrice = parseInt(button.dataset.price);
            const price4Plus = button.dataset.price4plus ? parseInt(button.dataset.price4plus) : null;
            const price11Plus = button.dataset.price11plus ? parseInt(button.dataset.price11plus) : null;
            const priceMax = button.dataset.priceMax ? parseInt(button.dataset.priceMax) : null;
            
            let displayPrice = basePrice;
            
            // Determine which price tier to use
            if (price11Plus && days >= 11) {
                displayPrice = price11Plus;
            } else if (price4Plus && days >= 4) {
                displayPrice = price4Plus;
            }
            
            // Update the displayed price - ALWAYS SHOW ONLY BASE PRICE
            if (priceMax) {
                // Range pricing for drones - show range
                priceSpan.textContent = `₱${basePrice.toLocaleString()}–${priceMax.toLocaleString()}/day`;
            } else {
                // All other products - show only base price
                priceSpan.textContent = `₱${displayPrice.toLocaleString()}/day`;
            }
        });
    }
    
    // Format date helper
    function formatDate(date) {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }
    
    // Initial render
    renderPickupCalendar();
    renderReturnCalendar();
    
    console.log('Date pickers initialized');
}

// Stock management (minimal, client-side)
function initStockDisplays(){
    const cameraCards = document.querySelectorAll('.camera-card');
    if (!cameraCards.length) return;

    // default stock map (id: count) - synced with admin dashboard inventory
    const defaultStock = {
        'iphone-16-pro-max': 5,
        'iphone-14-pro': 8,
        'iphone-13-pro-max': 12,
        'samsung-s23-ultra': 6,
        'samsung-z-flip-5': 4,
        'canon-g7x-mark-iii': 15,
        'sony-zv-1': 10,
        'fujifilm-x100vi': 7,
        'canon-eos-m50-mark-ii': 9,
        'sony-a7iii': 11,
        'fujifilm-xt30-ii': 8,
        'nikon-z50': 6,
        'gopro-hero-13': 20,
        'dji-osmo-pocket-3': 14,
        'insta360-x5': 12,
        'dji-mini-4-pro': 5,
        'fujifilm-instax-sq1': 25,
        'rayban-meta': 10
    };

    // load persisted stocks from localStorage if present
    const storageKey = 'cameraStocks_v1';
    let stocks = {};
    try { stocks = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch(e){ stocks = {}; }

    cameraCards.forEach(card => {
        const id = card.dataset.id;
        if (!id) return;

        // determine current stock: persisted -> data-stock attr -> default map -> fallback 0
        let count = typeof stocks[id] === 'number' ? stocks[id] : (card.dataset.stock ? parseInt(card.dataset.stock,10) : (defaultStock[id] != null ? defaultStock[id] : 0));

        // create stock element
        let info = card.querySelector('.camera-info');
        if (!info) return;

        let stockEl = info.querySelector('.stock-count');
        if (!stockEl) {
            const stockWrap = document.createElement('div');
            stockWrap.className = 'stock-wrap';
            stockEl = document.createElement('span');
            stockEl.className = 'stock-count';
            stockWrap.appendChild(stockEl);
            // insert before price area if exists, else append
            const priceArea = info.querySelector('.camera-price');
            if (priceArea) info.insertBefore(stockWrap, priceArea);
            else info.appendChild(stockWrap);
        }

        function render(){
            stockEl.textContent = count > 0 ? `${count} in stock` : 'Out of stock';
            stockEl.classList.toggle('out', count <= 0);
            // disable add-to-cart if out
            const btn = card.querySelector('.add-to-cart-btn');
            if (btn) btn.disabled = count <= 0;
            if (btn) btn.setAttribute('aria-disabled', String(count <= 0));
        }

        // expose small API on card element
        card._stock = {
            get() { return count; },
            dec(n=1){ count = Math.max(0, count - n); stocks[id]=count; localStorage.setItem(storageKey, JSON.stringify(stocks)); render(); }
        };

        render();
    });

    // stock is decremented centrally inside CartManager.addItem()
}

// Save date selection to localStorage
function saveDateSelection() {
    const pickupDisplay = document.getElementById('pickup-display');
    const returnDisplay = document.getElementById('return-display');
    
    if (pickupDisplay && pickupDisplay.textContent !== 'Select Date') {
        const pickupDate = pickupDisplay.textContent;
        localStorage.setItem('selectedPickupDate', new Date(pickupDate).toISOString());
    }
    
    if (returnDisplay && returnDisplay.textContent !== 'Select Date') {
        const returnDate = returnDisplay.textContent;
        localStorage.setItem('selectedReturnDate', new Date(returnDate).toISOString());
    }
}

// ==============================================
// COMPARE FUNCTIONALITY FOR CAMERA CARDS
// ==============================================

// Initialize compare buttons on camera cards
function initCompareButtons() {
    // First, add compare buttons to ALL camera cards that don't have them yet
    const cameraCards = document.querySelectorAll('.camera-card');
    
    cameraCards.forEach(card => {
        // Check if compare button already exists
        if (card.querySelector('.add-to-compare-btn')) return;
        
        const cameraId = card.dataset.id;
        if (!cameraId) return;
        
        // Create compare button
        const compareBtn = document.createElement('button');
        compareBtn.className = 'add-to-compare-btn';
        compareBtn.dataset.cameraId = cameraId;
        compareBtn.title = 'Add to Compare';
        compareBtn.innerHTML = '<i class="fas fa-balance-scale"></i>';
        
        // Check if already in compare list
        if (typeof isInCompareList === 'function' && isInCompareList(cameraId)) {
            compareBtn.classList.add('active');
            compareBtn.innerHTML = '<i class="fas fa-check"></i>';
        }
        
        // Insert at the beginning of the card
        card.insertBefore(compareBtn, card.firstChild);
    });
    
    // Now add event listeners to all compare buttons
    const compareButtons = document.querySelectorAll('.add-to-compare-btn');
    
    compareButtons.forEach(button => {
        const cameraId = button.dataset.cameraId;
        
        // Check if already in compare list
        if (typeof isInCompareList === 'function' && isInCompareList(cameraId)) {
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-check"></i>';
        }
        
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            if (typeof addToCompare === 'function') {
                const added = addToCompare(cameraId);
                
                if (added) {
                    button.classList.add('active');
                    button.innerHTML = '<i class="fas fa-check"></i>';
                } else {
                    // If not added (already in list), it was removed
                    button.classList.remove('active');
                    button.innerHTML = '<i class="fas fa-balance-scale"></i>';
                }
            }
        });
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCompareButtons);
} else {
    initCompareButtons();
}