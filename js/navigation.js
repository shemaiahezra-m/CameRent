// ==============================================
// NAVIGATION & GLOBAL FUNCTIONALITY
// ==============================================

// Navigation initializer: called after header exists
let navigationInitialized = false;

function initNavigation() {
    if (navigationInitialized) return;
    navigationInitialized = true;

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    function toggleMobileMenu() {
        if (!mobileMenu || !mobileMenuBtn) return;
        mobileMenu.classList.toggle('show');
        mobileMenuBtn.classList.toggle('active');
    }
    
    function closeMobileMenu() {
        if (!mobileMenu || !mobileMenuBtn) return;
        mobileMenu.classList.remove('show');
        mobileMenuBtn.classList.remove('active');
    }
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileNavLinks = mobileMenu.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Header scroll effect: switch to fixed when scrolled and avoid layout jump
    const header = document.getElementById('header');
    if (header) {
        const SCROLL_THRESHOLD = 100;
        let wasScrolled = false;

        const onScroll = function() {
            const scrolled = window.scrollY > SCROLL_THRESHOLD;
            if (scrolled && !wasScrolled) {
                // apply scrolled state
                header.classList.add('scrolled');
                // make header fixed to viewport so it stays visible
                header.style.position = 'fixed';
                header.style.top = '12px';
                header.style.left = '0';
                header.style.right = '0';
                // reserve space to avoid content jump
                document.body.style.paddingTop = header.offsetHeight + 'px';
                wasScrolled = true;
            } else if (!scrolled && wasScrolled) {
                // remove scrolled state
                header.classList.remove('scrolled');
                // restore sticky positioning
                header.style.position = '';
                header.style.top = '';
                header.style.left = '';
                header.style.right = '';
                // remove reserved space
                document.body.style.paddingTop = '';
                wasScrolled = false;
            }
        };

        // initial check in case page loaded scrolled
        onScroll();
        window.addEventListener('scroll', onScroll);
        // also update on resize since header height may change
        window.addEventListener('resize', function() {
            if (wasScrolled) {
                document.body.style.paddingTop = header.offsetHeight + 'px';
            }
        });
    }

    // "How to Rent" button redirect
    const howToRentBtn = document.getElementById('howToRentBtn');
    if (howToRentBtn) {
        howToRentBtn.addEventListener('click', function() {
            window.location.href = 'about.html#book-in-advance';
        });
    }

    // Active navigation highlighting
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref && linkHref.includes(currentPage)) {
            link.classList.add('active');
        } else if (currentPage === 'index.html' && linkHref && linkHref.includes('home.html')) {
            link.classList.add('active');
        }
    });

    // Contact form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation and submission
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');
            
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Show success message
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            
            // Reset form
            this.reset();
        });
    }
}

// Wait for DOMContentLoaded, then initialize when header exists or when header:loaded fires
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('header')) {
        initNavigation();
    } else {
        // Header will be injected; wait for the event
        const onLoaded = function() {
            initNavigation();
        };
        // Use both DOM event and AppEvents if available
        window.addEventListener('header:loaded', onLoaded, { once: true });
        if (window.AppEvents && typeof window.AppEvents.on === 'function') {
            window.AppEvents.on('header:loaded', onLoaded);
        }
    }
});

// Global notification function
function showNotification(message, type = 'info') {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    const notification = document.createElement('div');
    notification.className = 'global-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
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
    }, 4000);
}