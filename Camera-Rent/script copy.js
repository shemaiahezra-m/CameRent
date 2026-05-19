// Global State Management
class AppState {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.compareItems = JSON.parse(localStorage.getItem('compareItems')) || [];
        this.currentPage = 'home';
        this.rentalDates = JSON.parse(sessionStorage.getItem('rentalDates')) || {};
        this.products = this.initializeProducts();
        this.listeners = [];
    }

    // Subscribe to state changes
    subscribe(callback) {
        this.listeners.push(callback);
    }

    // Notify all subscribers
    notify() {
        this.listeners.forEach(callback => callback());
    }

    // Cart Management
    addToCart(item) {
        const existingItem = this.cart.find(
            cartItem => 
                cartItem.id === item.id && 
                cartItem.pickupDate === item.pickupDate && 
                cartItem.returnDate === item.returnDate
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...item, quantity: 1 });
        }

        this.saveCart();
        this.notify();
    }

    removeFromCart(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
        this.notify();
    }

    updateQuantity(id, quantity) {
        if (quantity <= 0) {
            this.removeFromCart(id);
            return;
        }

        const item = this.cart.find(item => item.id === id);
        if (item) {
            item.quantity = quantity;
            this.saveCart();
            this.notify();
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.notify();
    }

    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    // Compare Management
    addToCompare(item) {
        if (this.compareItems.length >= 3) {
            this.showAlert('You can only compare up to 3 items', 'error');
            return;
        }

        if (!this.compareItems.find(compareItem => compareItem.id === item.id)) {
            this.compareItems.push(item);
            this.saveCompare();
            this.notify();
        }
    }

    removeFromCompare(id) {
        this.compareItems = this.compareItems.filter(item => item.id !== id);
        this.saveCompare();
        this.notify();
    }

    clearCompare() {
        this.compareItems = [];
        this.saveCompare();
        this.notify();
    }

    saveCompare() {
        localStorage.setItem('compareItems', JSON.stringify(this.compareItems));
    }

    // Navigation
    navigate(page) {
        this.currentPage = page;
        this.showPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showPage(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        
        // Show target page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === page) {
                link.classList.add('active');
            }
        });
    }

    // Products Data
    initializeProducts() {
        return {
            brands: [
                { name: 'Canon', logo: 'https://images.unsplash.com/photo-1606800052052-6d60a5e43071?w=200&h=80&fit=crop' },
                { name: 'Fujifilm', logo: 'https://images.unsplash.com/photo-1606800052052-6d60a5e43071?w=200&h=80&fit=crop' },
                { name: 'Nikon', logo: 'https://images.unsplash.com/photo-1606800052052-6d60a5e43071?w=200&h=80&fit=crop' },
                { name: 'Olympus', logo: 'https://images.unsplash.com/photo-1606800052052-6d60a5e43071?w=200&h=80&fit=crop' },
                { name: 'Sony', logo: 'https://images.unsplash.com/photo-1606800052052-6d60a5e43071?w=200&h=80&fit=crop' },
            ],
            promo: [
                {
                    id: 1,
                    name: 'Canon EOS M50',
                    price: 500,
                    oldPrice: 650,
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
                    badge: 'SALE',
                    category: 'camera'
                },
                {
                    id: 2,
                    name: 'Professional Tripod',
                    price: 150,
                    oldPrice: 200,
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1606800052052-6d60a5e43071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
                    badge: 'SALE',
                    category: 'accessories'
                },
                {
                    id: 3,
                    name: 'Nikon D5600',
                    price: 600,
                    oldPrice: 750,
                    rating: 4,
                    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
                    badge: 'SALE',
                    category: 'camera'
                },
                {
                    id: 4,
                    name: 'LED Light Panel',
                    price: 200,
                    oldPrice: 280,
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
                    badge: 'SALE',
                    category: 'accessories'
                },
            ],
            all: [
                {
                    id: 1,
                    name: 'Canon EOS M50',
                    price: 500,
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
                    category: 'camera'
                },
                {
                    id: 2,
                    name: 'Fujifilm X-T4',
                    price: 750,
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1606462154663-ae78348be813?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
                    category: 'camera'
                },
                {
                    id: 3,
                    name: 'Fujifilm 23mm',
                    price: 350,
                    rating: 4,
                    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
                    category: 'lens'
                },
                {
                    id: 4,
                    name: 'Mirrorless Kit',
                    price: 850,
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
                    category: 'camera'
                },
                {
                    id: 5,
                    name: 'Nikon D3500',
                    price: 450,
                    rating: 4,
                    image: 'https://images.unsplash.com/photo-1606800052052-6d60a5e43071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
                    category: 'camera'
                },
                {
                    id: 6,
                    name: 'Sony A7 III',
                    price: 900,
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
                    category: 'camera'
                },
                {
                    id: 7,
                    name: 'Professional Tripod',
                    price: 150,
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1606800052052-6d60a5e43071?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
                    category: 'accessories'
                },
                {
                    id: 8,
                    name: 'LED Light Panel',
                    price: 200,
                    rating: 5,
                    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300',
                    category: 'accessories'
                }
            ]
        };
    }

    // Utility Methods
    showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        
        document.body.insertBefore(alertDiv, document.body.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
}

// Initialize App State
const appState = new AppState();

// DOM Manipulation Utilities
class DOMUtils {
    static createElement(tag, className, innerHTML) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }

    static generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fas fa-star star ${i <= rating ? '' : 'empty'}"></i>`;
        }
        return stars;
    }

    static formatPrice(price) {
        return `$${price}/day`;
    }
}

// Product Card Component
class ProductCard {
    static create(product, showOldPrice = false) {
        const card = DOMUtils.createElement('div', 'product-card');
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" class="product-img">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">${DOMUtils.formatPrice(product.price)}</span>
                    ${showOldPrice && product.oldPrice ? `<span class="old-price">${DOMUtils.formatPrice(product.oldPrice)}</span>` : ''}
                </div>
                <div class="product-rating">
                    ${DOMUtils.generateStars(product.rating)}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="compare-btn-product" data-id="${product.id}">
                        <i class="fas fa-balance-scale"></i>
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        const addToCartBtn = card.querySelector('.add-to-cart-btn');
        const compareBtn = card.querySelector('.compare-btn-product');

        addToCartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            ProductCard.handleAddToCart(product);
        });

        compareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            ProductCard.handleAddToCompare(product);
        });

        card.addEventListener('click', () => {
            ProductCard.showModal(product);
        });

        return card;
    }

    static handleAddToCart(product) {
        const rentalDates = appState.rentalDates;
        if (!rentalDates.pickupDate || !rentalDates.returnDate) {
            appState.showAlert('Please select rental dates first', 'error');
            appState.navigate('home');
            return;
        }

        const cartItem = {
            ...product,
            pickupDate: rentalDates.pickupDate,
            returnDate: rentalDates.returnDate
        };

        appState.addToCart(cartItem);
        appState.showAlert(`${product.name} added to cart!`, 'success');
    }

    static handleAddToCompare(product) {
        appState.addToCompare(product);
        appState.showAlert(`${product.name} added to compare!`, 'success');
    }

    static showModal(product) {
        const modal = document.getElementById('productModal');
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = `
            <div class="modal-product">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 1rem;">
                <h2 style="margin-bottom: 1rem;">${product.name}</h2>
                <div class="product-rating" style="margin-bottom: 1rem;">
                    ${DOMUtils.generateStars(product.rating)}
                </div>
                <div class="product-price" style="margin-bottom: 1rem;">
                    <span class="current-price" style="font-size: 1.5rem;">${DOMUtils.formatPrice(product.price)}</span>
                    ${product.oldPrice ? `<span class="old-price" style="margin-left: 1rem;">${DOMUtils.formatPrice(product.oldPrice)}</span>` : ''}
                </div>
                <p style="margin-bottom: 2rem; color: #666;">Professional ${product.category} equipment available for rental. Perfect for photography enthusiasts and professionals.</p>
                <div style="display: flex; gap: 1rem;">
                    <button class="add-to-cart-btn" style="flex: 1;" onclick="ProductCard.handleAddToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="compare-btn-product" onclick="ProductCard.handleAddToCompare(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                        <i class="fas fa-balance-scale"></i> Compare
                    </button>
                </div>
            </div>
        `;

        modal.classList.add('open');
    }
}

// Page Renderers
class PageRenderer {
    static renderHome() {
        // Render brands
        const brandsGrid = document.getElementById('brandsGrid');
        brandsGrid.innerHTML = '';
        
        appState.products.brands.forEach(brand => {
            const brandItem = DOMUtils.createElement('div', 'brand-item');
            brandItem.innerHTML = `
                <img src="${brand.logo}" alt="${brand.name}" class="brand-logo">
                <h3>${brand.name}</h3>
            `;
            brandsGrid.appendChild(brandItem);
        });

        // Render promo products
        const promoGrid = document.getElementById('promoProductsGrid');
        promoGrid.innerHTML = '';
        
        appState.products.promo.forEach(product => {
            const card = ProductCard.create(product, true);
            promoGrid.appendChild(card);
        });

        // Render all products (limited)
        const allGrid = document.getElementById('allProductsGrid');
        allGrid.innerHTML = '';
        
        appState.products.all.slice(0, 6).forEach(product => {
            const card = ProductCard.create(product);
            allGrid.appendChild(card);
        });
    }

    static renderCameras() {
        const camerasGrid = document.getElementById('camerasGrid');
        const categoryFilter = document.getElementById('categoryFilter');
        const sortFilter = document.getElementById('sortFilter');

        const renderProducts = () => {
            let products = [...appState.products.all];

            // Filter by category
            if (categoryFilter.value) {
                products = products.filter(p => p.category === categoryFilter.value);
            }

            // Sort products
            switch (sortFilter.value) {
                case 'price-low':
                    products.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    products.sort((a, b) => b.price - a.price);
                    break;
                case 'name':
                default:
                    products.sort((a, b) => a.name.localeCompare(b.name));
                    break;
            }

            camerasGrid.innerHTML = '';
            products.forEach(product => {
                const card = ProductCard.create(product);
                camerasGrid.appendChild(card);
            });
        };

        categoryFilter.addEventListener('change', renderProducts);
        sortFilter.addEventListener('change', renderProducts);

        renderProducts();
    }

    static renderCart() {
        const cartContent = document.getElementById('cartContent');
        
        if (appState.cart.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some items to get started</p>
                    <button class="rent-now-btn" onclick="appState.navigate('cameras')">
                        Browse Cameras
                    </button>
                </div>
            `;
            return;
        }

        const cartItemsHtml = appState.cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${DOMUtils.formatPrice(item.price)}</div>
                    <div style="font-size: 0.9rem; color: #666;">
                        ${item.pickupDate} to ${item.returnDate}
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="appState.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" 
                               onchange="appState.updateQuantity(${item.id}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="appState.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="appState.removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        cartContent.innerHTML = `
            <div class="cart-items">
                ${cartItemsHtml}
            </div>
            <div class="cart-total">
                <div class="total-price">Total: $${appState.getTotalPrice()}/day</div>
                <button class="checkout-btn" onclick="appState.navigate('checkout')">
                    Proceed to Checkout
                </button>
            </div>
        `;
    }

    static renderCompare() {
        const compareContent = document.getElementById('compareContent');
        
        if (appState.compareItems.length === 0) {
            compareContent.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-balance-scale"></i>
                    <h3>No items to compare</h3>
                    <p>Add items to compare their features</p>
                    <button class="rent-now-btn" onclick="appState.navigate('cameras')">
                        Browse Cameras
                    </button>
                </div>
            `;
            return;
        }

        const compareTable = appState.compareItems.map(item => `
            <div class="compare-item" style="text-align: center; padding: 1rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
                <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 0.5rem; margin-bottom: 1rem;">
                <h3>${item.name}</h3>
                <div class="product-rating" style="margin: 0.5rem 0;">
                    ${DOMUtils.generateStars(item.rating)}
                </div>
                <div class="current-price" style="margin: 0.5rem 0;">${DOMUtils.formatPrice(item.price)}</div>
                <button class="remove-btn" onclick="appState.removeFromCompare(${item.id})" style="margin-top: 1rem;">
                    Remove
                </button>
            </div>
        `).join('');

        compareContent.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; margin: 2rem 0;">
                ${compareTable}
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <button class="submit-btn" onclick="appState.clearCompare()">
                    Clear All
                </button>
            </div>
        `;
    }

    static renderFAQ() {
        const faqContent = document.getElementById('faqContent');
        
        const faqs = [
            {
                question: "How long can I rent equipment?",
                answer: "You can rent equipment for as little as one day or as long as several weeks. Pricing is calculated per day."
            },
            {
                question: "What if equipment gets damaged?",
                answer: "We offer insurance coverage for accidental damage. Please review our terms and conditions for full details."
            },
            {
                question: "Do you deliver equipment?",
                answer: "Yes, we offer delivery and pickup services within the city. Additional charges may apply based on location."
            },
            {
                question: "Can I extend my rental period?",
                answer: "Yes, you can extend your rental period subject to availability. Please contact us before your return date."
            }
        ];

        const faqItems = faqs.map((faq, index) => `
            <div class="faq-item">
                <button class="faq-question" onclick="toggleFAQ(${index})">
                    ${faq.question}
                    <i class="fas fa-chevron-down faq-icon"></i>
                </button>
                <div class="faq-answer" id="faq-answer-${index}">
                    ${faq.answer}
                </div>
            </div>
        `).join('');

        faqContent.innerHTML = faqItems;
    }
}

// Event Handlers
function toggleFAQ(index) {
    const faqItem = document.querySelector(`.faq-item:nth-child(${index + 1})`);
    const isOpen = faqItem.classList.contains('open');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('open');
    });
    
    // Open clicked item if it wasn't already open
    if (!isOpen) {
        faqItem.classList.add('open');
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const pickupDateInput = document.getElementById('pickupDate');
    const returnDateInput = document.getElementById('returnDate');
    
    if (pickupDateInput && returnDateInput) {
        pickupDateInput.min = today;
        returnDateInput.min = today;
        
        // Set pickup date change handler
        pickupDateInput.addEventListener('change', function() {
            returnDateInput.min = this.value;
            if (returnDateInput.value && returnDateInput.value < this.value) {
                returnDateInput.value = this.value;
            }
        });
    }

    // Navigation Event Listeners
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            appState.navigate(page);
            
            // Render page-specific content
            switch(page) {
                case 'home':
                    PageRenderer.renderHome();
                    break;
                case 'cameras':
                    PageRenderer.renderCameras();
                    break;
                case 'cart':
                    PageRenderer.renderCart();
                    break;
                case 'compare':
                    PageRenderer.renderCompare();
                    break;
                case 'faq':
                    PageRenderer.renderFAQ();
                    break;
            }
        });
    });

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('open');
    });

    mobileMenuClose.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.remove('open');
        }
    });

    // Mobile menu navigation
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
        });
    });

    // Cart and Compare buttons
    document.getElementById('cartBtn').addEventListener('click', () => {
        appState.navigate('cart');
        PageRenderer.renderCart();
    });

    document.getElementById('compareBtn').addEventListener('click', () => {
        appState.navigate('compare');
        PageRenderer.renderCompare();
    });

    // Rent Now Button
    document.getElementById('rentNowBtn').addEventListener('click', () => {
        const pickupDate = pickupDateInput.value;
        const returnDate = returnDateInput.value;
        
        if (!pickupDate || !returnDate) {
            appState.showAlert('Please select both pickup and return dates', 'error');
            return;
        }
        
        if (new Date(returnDate) <= new Date(pickupDate)) {
            appState.showAlert('Return date must be after pickup date', 'error');
            return;
        }
        
        appState.rentalDates = { pickupDate, returnDate };
        sessionStorage.setItem('rentalDates', JSON.stringify(appState.rentalDates));
        appState.navigate('cameras');
        PageRenderer.renderCameras();
    });

    // Modal close functionality
    const modal = document.getElementById('productModal');
    const modalClose = document.querySelector('.modal-close');

    modalClose.addEventListener('click', () => {
        modal.classList.remove('open');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
        }
    });

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            appState.showAlert('Message sent successfully!', 'success');
            contactForm.reset();
        });
    }

    // Checkout Form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            appState.showAlert('Order placed successfully!', 'success');
            appState.clearCart();
            appState.navigate('home');
            PageRenderer.renderHome();
        });
    }

    // Subscribe to state changes
    appState.subscribe(() => {
        // Update cart count
        document.getElementById('cartCount').textContent = appState.getTotalItems();
        
        // Update compare count
        document.getElementById('compareCount').textContent = appState.compareItems.length;
        
        // Re-render current page if needed
        if (appState.currentPage === 'cart') {
            PageRenderer.renderCart();
        } else if (appState.currentPage === 'compare') {
            PageRenderer.renderCompare();
        }
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.getElementById('header');
        if (window.scrollY > 0) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Initialize the app
    PageRenderer.renderHome();
    appState.notify(); // Update counts
});

// Global functions for onclick handlers
window.toggleFAQ = toggleFAQ;
window.ProductCard = ProductCard;