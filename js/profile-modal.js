// ==============================================
// EXPANDING PROFILE PANEL FUNCTIONALITY
// ==============================================

let profilePanelInitialized = false;

function initProfilePanel() {
    if (profilePanelInitialized) return;
    profilePanelInitialized = true;

    const profileBtn = document.getElementById('profileBtn');
    const profilePanel = document.getElementById('profilePanel');
    const profilePanelCard = profilePanel?.querySelector('.profile-panel-card');
    const profileWelcome = document.getElementById('profileWelcome');
    const profileOverlay = profilePanel?.querySelector('.profile-panel-overlay');
    const signupBtn = document.getElementById('signupBtnPanel');
    const loginBtn = document.getElementById('loginBtnPanel');
    let currentUser = null;

    if (!profileBtn || !profilePanel || !profilePanelCard || !profileWelcome) return;

    // Open panel when profile button is clicked
    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        profilePanel.classList.add('show');
        // Reset to collapsed state when opening
        profilePanelCard.classList.remove('expanded');
    });

    // Expand panel when welcome text is clicked
    profileWelcome.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!profilePanelCard.classList.contains('expanded')) {
            profilePanelCard.classList.add('expanded');
        }
    });

    // Close panel when clicking overlay
    if (profileOverlay) {
        profileOverlay.addEventListener('click', function() {
            closePanel();
        });
    }

    // Close panel when clicking outside
    document.addEventListener('click', function(e) {
        if (profilePanel.classList.contains('show') &&
            !profilePanelCard.contains(e.target) &&
            e.target !== profileBtn &&
            !profileBtn.contains(e.target)) {
            closePanel();
        }
    });

    // Close panel on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && profilePanel.classList.contains('show')) {
            closePanel();
        }
    });

    // Function to close panel
    function closePanel() {
        profilePanel.classList.remove('show');
        // Reset to collapsed state after closing animation
        setTimeout(() => {
            profilePanelCard.classList.remove('expanded');
        }, 300);
    }

    // Handle Sign Up button click (guest state)
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            closePanel();
            window.location.href = 'signup.html';
        });
    }

    // Handle Log In button click (guest state)
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            if (loginBtn.dataset.action === 'logout') {
                handleLogout(closePanel);
                return;
            }
            closePanel();
            window.location.href = 'login.html';
        });
    }

    // Load user and adjust UI
    fetch('/api/me', { credentials: 'same-origin' })
        .then(res => res.json().then(body => ({ ok: res.ok, body })))
        .then(({ ok, body }) => {
            if (!ok || !body.user) return;
            currentUser = body.user;
            setLoggedInUI();
        })
        .catch(() => {});

    // Star Rating Functionality
    initStarRating();

    function setLoggedInUI() {
        if (!currentUser) return;
        const welcome = profileWelcome.querySelector('.welcome-heading');
        const tagline = profileWelcome.querySelector('.welcome-tagline');
        if (welcome) welcome.textContent = `Hi, ${currentUser.firstName || 'User'}`;
        if (tagline) tagline.textContent = currentUser.email || '';

        if (signupBtn) {
            signupBtn.innerHTML = '<i class="fas fa-id-badge"></i><span>Profile</span>';
            signupBtn.onclick = function() {
                closePanel();
                window.location.href = 'profile';
            };
        }

        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i><span>Log Out</span>';
            loginBtn.dataset.action = 'logout';
        }
    }

    function handleLogout(closePanelFn) {
        fetch('/api/logout', { method: 'POST', credentials: 'same-origin' })
            .then(res => {
                if (!res.ok) throw new Error('Logout failed');
                showNotification('Logged out', 'success');
                closePanelFn();
                setTimeout(() => { window.location.href = 'index.html'; }, 500);
            })
            .catch(() => {
                showNotification('Logout failed. Please try again.', 'error');
            });
    }
}

// Star Rating System
function initStarRating() {
    const stars = document.querySelectorAll('.star-rating i');
    const ratingText = document.getElementById('ratingText');
    const submitBtn = document.getElementById('submitRatingBtn');
    let selectedRating = 0;

    const ratingMessages = {
        1: '⭐ Poor - We can do better',
        2: '⭐⭐ Fair - Room for improvement',
        3: '⭐⭐⭐ Good - Thanks for your feedback!',
        4: '⭐⭐⭐⭐ Great - We appreciate you!',
        5: '⭐⭐⭐⭐⭐ Excellent - You\'re awesome!'
    };

    stars.forEach((star, index) => {
        // Hover effect
        star.addEventListener('mouseenter', function() {
            highlightStars(index + 1);
        });

        // Click to select
        star.addEventListener('click', function() {
            selectedRating = index + 1;
            selectStars(selectedRating);
            ratingText.textContent = ratingMessages[selectedRating];
            submitBtn.style.display = 'block';
        });
    });

    // Remove hover effect when mouse leaves
    const starRating = document.getElementById('starRating');
    if (starRating) {
        starRating.addEventListener('mouseleave', function() {
            if (selectedRating > 0) {
                selectStars(selectedRating);
            } else {
                clearStars();
            }
        });
    }

    // Submit rating
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            if (selectedRating > 0) {
                // Save rating to localStorage
                const ratings = JSON.parse(localStorage.getItem('userRatings') || '[]');
                ratings.push({
                    rating: selectedRating,
                    date: new Date().toISOString()
                });
                localStorage.setItem('userRatings', JSON.stringify(ratings));

                // Show success message
                showNotification(`Thank you for rating us ${selectedRating} stars! 🎉`, 'success');
                
                // Reset rating
                selectedRating = 0;
                clearStars();
                ratingText.textContent = 'Click a star to rate';
                submitBtn.style.display = 'none';
            }
        });
    }

    function highlightStars(count) {
        stars.forEach((star, index) => {
            if (index < count) {
                star.classList.remove('far');
                star.classList.add('fas', 'hovered');
            } else {
                star.classList.remove('fas', 'hovered');
                star.classList.add('far');
            }
        });
    }

    function selectStars(count) {
        stars.forEach((star, index) => {
            if (index < count) {
                star.classList.remove('far');
                star.classList.add('fas', 'selected');
            } else {
                star.classList.remove('fas', 'selected');
                star.classList.add('far');
            }
        });
    }

    function clearStars() {
        stars.forEach(star => {
            star.classList.remove('fas', 'selected', 'hovered');
            star.classList.add('far');
        });
    }
}

// Initialize after DOM is ready and header is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('header')) {
        initProfilePanel();
    } else {
        // Wait for header to be injected
        const onHeaderLoaded = function() {
            initProfilePanel();
        };
        window.addEventListener('header:loaded', onHeaderLoaded, { once: true });
        if (window.AppEvents && typeof window.AppEvents.on === 'function') {
            window.AppEvents.on('header:loaded', onHeaderLoaded);
        }
    }
});

// Global notification function (if not already defined in navigation.js)
if (typeof showNotification !== 'function') {
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
}
