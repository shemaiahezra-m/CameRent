// ==============================================
// COMMON UTILITIES & SHARED FUNCTIONS
// ==============================================

// Load Footer
document.addEventListener('DOMContentLoaded', function() {
    // Load header partial and initialize header behaviors after it's inserted
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            const headerHolder = document.getElementById('header-placeholder');
            if (headerHolder) headerHolder.innerHTML = data;

            // Initialize header-related behaviors (buttons, mobile menu)
            initHeaderButtons();

            // Notify other modules that the header has been loaded and initialized.
            // Emit both the app event and a DOM event for compatibility.
            try {
                if (window.AppEvents && typeof window.AppEvents.emit === 'function') {
                    window.AppEvents.emit('header:loaded');
                }
            } catch (e) {
                console.error('Error emitting AppEvents header:loaded', e);
            }

            try {
                window.dispatchEvent(new CustomEvent('header:loaded'));
            } catch (e) {
                // older browsers may fail on CustomEvent construction
                const evt = document.createEvent('Event');
                evt.initEvent('header:loaded', true, true);
                window.dispatchEvent(evt);
            }
            // Mobile menu toggle is handled by navigation.js so we avoid duplicate handlers here.
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer partial
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
            
            // Initialize newsletter form after footer loads
            const newsletterForm = document.getElementById('newsletterForm');
            if (newsletterForm) {
                newsletterForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    const emailInput = this.querySelector('.newsletter-input');
                    const email = emailInput.value;
                    
                    // Show success message
                    const button = this.querySelector('.newsletter-button');
                    const originalText = button.textContent;
                    button.textContent = 'Subscribed! ✓';
                    button.style.background = '#10b981';
                    
                    // Reset after 3 seconds
                    setTimeout(() => {
                        button.textContent = originalText;
                        button.style.background = '';
                        emailInput.value = '';
                    }, 3000);
                    
                    console.log('Newsletter subscription:', email);
                });
            }
            
            // Initialize rating form after footer loads
            const ratingForm = document.getElementById('ratingForm');
            const thankYouNotification = document.getElementById('thankYouNotification');
            
            if (ratingForm && thankYouNotification) {
                ratingForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Get rating value
                    const rating = this.querySelector('input[name="rating"]:checked');
                    
                    if (!rating) {
                        alert('Please select a rating!');
                        return;
                    }
                    
                    // Show thank you notification
                    thankYouNotification.classList.add('show');
                    
                    // Reset form
                    this.reset();
                    
                    // Auto-hide notification after 3 seconds
                    setTimeout(() => {
                        thankYouNotification.classList.remove('show');
                    }, 3000);
                    
                    console.log('Rating submitted:', rating.value, 'stars');
                });
                
                // Close notification on click
                thankYouNotification.addEventListener('click', function() {
                    this.classList.remove('show');
                });
            }
        })
        .catch(error => console.error('Error loading footer:', error));
});

// Utility functions that can be used across all pages

// Date formatting utility
const DateUtils = {
    formatDate(date, format = 'short') {
        const options = {
            short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            },
            long: {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            },
            compact: {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric'
            }
        };
        
        return date.toLocaleDateString('en-US', options[format] || options.short);
    },
    
    isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    },
    
    daysBetween(startDate, endDate) {
        const timeDifference = endDate.getTime() - startDate.getTime();
        return Math.ceil(timeDifference / (1000 * 3600 * 24));
    }
};

// Local storage utilities
const StorageUtils = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },
    
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }
};

// Animation utilities
const AnimationUtils = {
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let opacity = 0;
        const timer = setInterval(() => {
            opacity += 50 / duration;
            if (opacity >= 1) {
                clearInterval(timer);
                opacity = 1;
            }
            element.style.opacity = opacity;
        }, 50);
    },
    
    fadeOut(element, duration = 300) {
        let opacity = 1;
        const timer = setInterval(() => {
            opacity -= 50 / duration;
            if (opacity <= 0) {
                clearInterval(timer);
                element.style.display = 'none';
                opacity = 0;
            }
            element.style.opacity = opacity;
        }, 50);
    },
    
    slideDown(element, duration = 300) {
        element.style.display = 'block';
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        
        const targetHeight = element.scrollHeight;
        let height = 0;
        const increment = targetHeight / (duration / 16);
        
        const timer = setInterval(() => {
            height += increment;
            if (height >= targetHeight) {
                clearInterval(timer);
                element.style.height = '';
                element.style.overflow = '';
            } else {
                element.style.height = height + 'px';
            }
        }, 16);
    },
    
    slideUp(element, duration = 300) {
        let height = element.offsetHeight;
        const decrement = height / (duration / 16);
        
        const timer = setInterval(() => {
            height -= decrement;
            if (height <= 0) {
                clearInterval(timer);
                element.style.display = 'none';
                element.style.height = '';
            } else {
                element.style.height = height + 'px';
            }
        }, 16);
    }
};

// Form validation utilities
const ValidationUtils = {
    email(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    phone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },
    
    required(value) {
        return value && value.toString().trim().length > 0;
    },
    
    minLength(value, min) {
        return value && value.toString().length >= min;
    },
    
    maxLength(value, max) {
        return value && value.toString().length <= max;
    }
};

// Event emitter for cross-component communication
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }
    
    off(event, listenerToRemove) {
        if (!this.events[event]) return;
        
        this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
    }
    
    emit(event, data) {
        if (!this.events[event]) return;
        
        this.events[event].forEach(listener => {
            try {
                listener(data);
            } catch (error) {
                console.error('Error in event listener:', error);
            }
        });
    }
}

// Global event emitter instance
window.AppEvents = new EventEmitter();

// Track whether header buttons have been initialized to avoid duplicate bindings
let headerButtonsInitialized = false;

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
    // Add loading states for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            this.classList.add('error');
            // You could set a fallback image here
            // this.src = 'path/to/fallback-image.jpg';
        });
    });
    
    // Add smooth scroll behavior for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Note: header buttons are initialized after header partial loads.

    // If this page already has a synchronous header (like index.html), initialize header buttons now.
    if (document.getElementById('header') && !headerButtonsInitialized) {
        initHeaderButtons();
    }

    // Emit app ready event
    setTimeout(() => {
        window.AppEvents.emit('app:ready');
    }, 100);
});

// Initialize header action buttons
function initHeaderButtons() {
    if (headerButtonsInitialized) return;
    headerButtonsInitialized = true;
    
    // Update cart count on page load
    updateGlobalCartCount();
    
    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
        cartBtn.style.cursor = 'pointer';
    }
    
    // Compare button
    const compareBtn = document.getElementById('compareBtn');
    if (compareBtn) {
        compareBtn.addEventListener('click', function() {
            window.location.href = 'compare.html';
        });
        compareBtn.style.cursor = 'pointer';
    }
        // Profile button
        const profileBtn = document.getElementById('profileBtn');
        const profileModal = document.getElementById('profileModal');
        if (profileBtn && profileModal) {
            profileBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                profileModal.style.display = (profileModal.style.display === 'none' || profileModal.style.display === '') ? 'block' : 'none';
            });
            profileBtn.style.cursor = 'pointer';
            // Hide modal when clicking outside
            document.addEventListener('click', function(event) {
                if (profileModal.style.display === 'block' && !profileModal.contains(event.target) && event.target !== profileBtn) {
                    profileModal.style.display = 'none';
                }
            });
        }
}

// Global cart count updater - works across all pages
function updateGlobalCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCount.textContent = totalItems;
    }
}

// Listen for storage changes to update cart count across tabs
window.addEventListener('storage', function(e) {
    if (e.key === 'cartItems') {
        updateGlobalCartCount();
    }
});

// Update cart count periodically (in case localStorage changes in same tab)
setInterval(updateGlobalCartCount, 1000);

// Show notification utility
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
    const bgColors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        backgroundColor: bgColors[type] || bgColors.success,
        color: 'white',
        borderRadius: '12px',
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

// ==============================================
// SCROLL ANIMATIONS
// ==============================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.scroll-animate, .scroll-fade, .scroll-slide-left, .scroll-slide-right, .scroll-scale'
    );

    // Intersection Observer options
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing after animation triggers once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Re-initialize scroll animations when new content is loaded
window.AppEvents.on('content:loaded', initScrollAnimations);
