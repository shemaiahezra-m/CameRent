// ==============================================
// AUTHENTICATION FUNCTIONALITY
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ==============================================
    // SIGN UP FORM HANDLING
    // ==============================================
    
    const signupForm = document.getElementById('signupForm');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                password: document.getElementById('password').value,
                confirmPassword: document.getElementById('confirmPassword').value,
                terms: document.getElementById('terms').checked
            };
            
            // Validate form
            if (!validateSignupForm(formData)) {
                return;
            }
            
            const submitBtn = signupForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Creating Account...</span>';
            submitBtn.disabled = true;

            fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(async (res) => {
                const text = await res.text();
                let body = {};
                try { body = text ? JSON.parse(text) : {}; } catch (_) { body = { error: text || 'Unexpected response' }; }
                if (!res.ok) {
                    const msg = body.error || text || `Request failed (${res.status})`;
                    throw Object.assign(new Error(msg), { status: res.status, text });
                }
                console.info('Signup response', res.status, body);
                return body;
            })
            .then(() => {
                showNotification('Account created successfully! Redirecting...', 'success');
                setTimeout(() => { window.location.href = 'index.html'; }, 1200);
            })
            .catch(err => {
                console.error('Signup error:', err);
                if (err instanceof TypeError) {
                    showNotification('Cannot reach server. Please run Flask: python3 first_app.py', 'error');
                } else {
                    showNotification(err.message || 'Signup failed', 'error');
                }
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // ==============================================
    // LOG IN FORM HANDLING
    // ==============================================
    
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const remember = document.getElementById('remember').checked;
            
            // Validate form
            if (!email || !password) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            const submitBtn = loginForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Logging In...</span>';
            submitBtn.disabled = true;

            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, remember })
            })
            .then(async (res) => {
                const text = await res.text();
                let body = {};
                try { body = text ? JSON.parse(text) : {}; } catch (_) { body = { error: text || 'Unexpected response' }; }
                if (!res.ok) {
                    const msg = body.error || text || `Request failed (${res.status})`;
                    throw Object.assign(new Error(msg), { status: res.status, text });
                }
                console.info('Login response', res.status, body);
                return body;
            })
            .then(() => {
                showNotification('Login successful! Redirecting...', 'success');
                setTimeout(() => { window.location.href = 'index.html'; }, 1200);
            })
            .catch(err => {
                console.error('Login error:', err);
                if (err instanceof TypeError) {
                    showNotification('Cannot reach server. Please run Flask: python3 first_app.py', 'error');
                } else {
                    showNotification(err.message || 'Login failed', 'error');
                }
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
        });
    }
    
    // ==============================================
    // FORM VALIDATION
    // ==============================================
    
    function validateSignupForm(data) {
        let isValid = true;
        
        // Clear previous errors
        clearErrors();
        
        // Validate first name
        if (data.firstName.length < 2) {
            showError('firstName', 'First name must be at least 2 characters');
            isValid = false;
        }
        
        // Validate last name
        if (data.lastName.length < 2) {
            showError('lastName', 'Last name must be at least 2 characters');
            isValid = false;
        }
        
        // Validate email
        if (!isValidEmail(data.email)) {
            showError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate phone
        if (data.phone.length < 10) {
            showError('phone', 'Please enter a valid phone number');
            isValid = false;
        }
        
        // Validate password
        if (data.password.length < 8) {
            showError('password', 'Password must be at least 8 characters');
            isValid = false;
        }
        
        // Validate password match
        if (data.password !== data.confirmPassword) {
            showError('confirmPassword', 'Passwords do not match');
            isValid = false;
        }
        
        // Validate terms
        if (!data.terms) {
            showNotification('Please accept the terms and conditions', 'error');
            isValid = false;
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        field.classList.add('error');
        
        const errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        formGroup.appendChild(errorMessage);
    }
    
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('input.error').forEach(el => el.classList.remove('error'));
    }
    
    // ==============================================
    // SOCIAL AUTH BUTTONS
    // ==============================================
    
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google-btn') ? 'Google' : 'Facebook';
            showNotification(`${provider} authentication coming soon!`, 'info');
        });
    });
    
    // ==============================================
    // REAL-TIME VALIDATION
    // ==============================================
    
    // Email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !isValidEmail(this.value)) {
                this.classList.add('error');
            } else if (this.value) {
                this.classList.remove('error');
                this.classList.add('success');
            }
        });
        
        input.addEventListener('input', function() {
            this.classList.remove('error', 'success');
        });
    });
    
    // Password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = getPasswordStrength(password);
            
            // You can add visual feedback here
            if (password.length >= 8) {
                this.classList.add('success');
                this.classList.remove('error');
            } else if (password.length > 0) {
                this.classList.add('error');
                this.classList.remove('success');
            } else {
                this.classList.remove('error', 'success');
            }
        });
    }
    
    function getPasswordStrength(password) {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/)) strength++;
        if (password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        return strength;
    }
    
    // Confirm password validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            if (this.value && this.value === passwordInput.value) {
                this.classList.add('success');
                this.classList.remove('error');
            } else if (this.value) {
                this.classList.add('error');
                this.classList.remove('success');
            } else {
                this.classList.remove('error', 'success');
            }
        });
    }
});

// ==============================================
// PASSWORD TOGGLE FUNCTIONALITY
// ==============================================

function togglePassword(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const icon = document.getElementById(fieldId + '-icon');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordField.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// ==============================================
// NOTIFICATION SYSTEM
// ==============================================

function showNotification(message, type = 'info') {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    
    const notification = document.createElement('div');
    notification.className = 'auth-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 10px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        transform: translateX(400px);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 350px;
        font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 4000);
}

// ==============================================
// CHECK IF ALREADY LOGGED IN
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    fetch('/api/me')
        .then(res => res.json().then(body => ({ ok: res.ok, body })))
        .then(({ ok, body }) => {
            if (ok && body.user && (currentPage === 'login.html' || currentPage === 'signup.html')) {
                showNotification('You are already logged in!', 'info');
                setTimeout(() => { window.location.href = 'index.html'; }, 1000);
            }
        })
        .catch(() => {});
});

// ==============================================
// CHECK USER LOGIN STATUS
// ==============================================

// Function to check if user is logged in
async function isUserLoggedIn() {
    try {
        const response = await fetch('/api/me');
        const data = await response.json();
        return response.ok && data.user;
    } catch (error) {
        return false;
    }
}

// Function to show login prompt - opens the profile panel
function showLoginPrompt(message = 'Please log in to add items to cart') {
    // First, show a quick notification message
    const notification = document.createElement('div');
    notification.className = 'login-prompt-notification';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-lock" style="font-size: 18px;"></i>
            <span style="font-weight: 600;">${message}</span>
        </div>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #3b82f6;
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        z-index: 10000;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        transform: translateX(400px);
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        max-width: 350px;
        font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-close after 2.5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 2500);
    
    // Open the profile panel to show login/signup options
    setTimeout(() => {
        const profileBtn = document.getElementById('profileBtn');
        const profilePanel = document.getElementById('profilePanel');
        
        if (profileBtn && profilePanel) {
            // Trigger the profile panel to open
            profilePanel.classList.add('show');
            
            // Optional: Add a subtle highlight effect to the sign up/login buttons
            const signupBtn = document.getElementById('signupBtnPanel');
            const loginBtn = document.getElementById('loginBtnPanel');
            
            if (signupBtn && loginBtn) {
                // Add pulse animation
                setTimeout(() => {
                    signupBtn.style.animation = 'pulse 1s ease-in-out 2';
                    loginBtn.style.animation = 'pulse 1s ease-in-out 2';
                }, 300);
            }
        }
    }, 500);
}
