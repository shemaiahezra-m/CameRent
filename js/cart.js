// Cart Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    updateCartBadge();
});

// Load cart from localStorage
function loadCartFromStorage() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    const cartItemsContainer = document.querySelector('.cart-items');
    
    // Debug logging
    console.log('===== CART PAGE DEBUG =====');
    console.log('localStorage.cartItems:', cartItems.length, 'items');
    console.log('cartItems data:', JSON.stringify(cartItems, null, 2));
    console.log('selectedPickupDate:', localStorage.getItem('selectedPickupDate'));
    console.log('selectedReturnDate:', localStorage.getItem('selectedReturnDate'));
    
    if (cartItems.length === 0) {
        // Show empty cart
        if (emptyCart && cartContent) {
            emptyCart.style.display = 'block';
            cartContent.style.display = 'none';
        }
        console.warn('Cart is empty - showing empty state');
        return;
    }
    
    // Show cart with items
    if (emptyCart && cartContent) {
        emptyCart.style.display = 'none';
        cartContent.style.display = 'block';
    }
    
    // Clear existing items
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = '';
    }
    
    // Get saved dates
    const pickupDate = localStorage.getItem('selectedPickupDate');
    const returnDate = localStorage.getItem('selectedReturnDate');
    
    // Calculate rental days
    let rentalDays = 7; // default
    if (pickupDate && returnDate) {
        const pickup = new Date(pickupDate);
        const returnD = new Date(returnDate);
        const timeDiff = returnD.getTime() - pickup.getTime();
        rentalDays = Math.max(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)), 1);
    }
    
    // Format dates for display
    const pickupDisplay = pickupDate ? new Date(pickupDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not selected';
    const returnDisplay = returnDate ? new Date(returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not selected';
    
    // Add each cart item
    cartItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.dataset.id = item.id || index;
        
        const price = parseInt(item.price);
        const quantity = item.quantity || 1;
        const totalPrice = price * rentalDays * quantity;
        
        // Get add-ons if any
        const addons = item.addons || [];
        let addonsHTML = '';
        let addonsTotal = 0;
        
        if (addons.length > 0) {
            addonsHTML = '<div class="item-addons"><strong>Add-ons:</strong><ul>';
            addons.forEach(addon => {
                addonsHTML += `<li>${addon.name} - ₱${addon.price}</li>`;
                addonsTotal += parseInt(addon.price);
            });
            addonsHTML += '</ul></div>';
        }
        
        const finalTotal = totalPrice + addonsTotal;
        
        itemDiv.innerHTML = `
            <div class="item-image">
                ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<i class="fas fa-camera"></i>'}
            </div>
            <div class="item-info">
                <h3>${item.name}</h3>
                <p class="item-category">${item.category || 'Camera'}</p>
                <div class="item-dates">
                    <p><strong>Pickup:</strong> ${pickupDisplay}</p>
                    <p><strong>Return:</strong> ${returnDisplay}</p>
                    <p><strong>Duration:</strong> ${rentalDays} day${rentalDays > 1 ? 's' : ''}</p>
                </div>
                ${addonsHTML}
                <div class="item-controls">
                    <div class="quantity-control">
                        <button class="qty-btn minus" data-id="${item.id || index}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" value="${quantity}" min="1" class="qty-input" data-id="${item.id || index}" readonly>
                        <button class="qty-btn plus" data-id="${item.id || index}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="item-price-info">
                        <span class="price-per-day">₱${price}/day × ${rentalDays} days</span>
                        ${addons.length > 0 ? `<span class="addons-price-info">+ Add-ons: ₱${addonsTotal}</span>` : ''}
                        <span class="item-total">₱${finalTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id || index}">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        
        cartItemsContainer.appendChild(itemDiv);
    });
    
    // Initialize controls and calculate totals
    initQuantityControls();
    initRemoveButtons();
    initCheckoutButtons();
    calculateTotals();
}

// Initialize Cart
function initCart() {
    const cartItems = document.querySelectorAll('.cart-item');
    
    if (cartItems.length === 0) {
        showEmptyCart();
    } else {
        initQuantityControls();
        initRemoveButtons();
        initCheckoutButtons();
        calculateTotals();
    }
}

// Show Empty Cart
function showEmptyCart() {
    const emptyCart = document.getElementById('emptyCart');
    const cartContent = document.getElementById('cartContent');
    
    if (emptyCart && cartContent) {
        emptyCart.style.display = 'block';
        cartContent.style.display = 'none';
        updateCartBadge();
    }
}

// Initialize Quantity Controls
function initQuantityControls() {
    // Plus buttons
    document.querySelectorAll('.qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const input = document.querySelector(`.qty-input[data-id="${id}"]`);
            const currentValue = parseInt(input.value);
            input.value = currentValue + 1;
            
            // Update localStorage
            updateCartItemQuantity(id, currentValue + 1);
            updateItemTotal(id);
            calculateTotals();
        });
    });

    // Minus buttons
    document.querySelectorAll('.qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const input = document.querySelector(`.qty-input[data-id="${id}"]`);
            const currentValue = parseInt(input.value);
            if (currentValue > 1) {
                input.value = currentValue - 1;
                
                // Update localStorage
                updateCartItemQuantity(id, currentValue - 1);
                updateItemTotal(id);
                calculateTotals();
            }
        });
    });
}

// Update cart item quantity in localStorage
function updateCartItemQuantity(id, quantity) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const item = cartItems.find(item => item.id == id);
    if (item) {
        item.quantity = quantity;
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartBadge();
    }
}

// Update Item Total
function updateItemTotal(id) {
    const cartItem = document.querySelector(`.cart-item[data-id="${id}"]`);
    if (!cartItem) return;
    
    const quantity = parseInt(cartItem.querySelector('.qty-input').value);
    const pricePerDayText = cartItem.querySelector('.price-per-day').textContent;
    const priceMatch = pricePerDayText.match(/₱(\d+)\/day/);
    
    if (priceMatch) {
        const pricePerDay = parseInt(priceMatch[1]);
        
        // Get rental days from the duration text
        const durationText = cartItem.querySelector('.item-dates p:nth-child(3)').textContent;
        const daysMatch = durationText.match(/(\d+) day/);
        const days = daysMatch ? parseInt(daysMatch[1]) : 7;
        
        const total = pricePerDay * days * quantity;
        cartItem.querySelector('.item-total').textContent = `₱${total.toFixed(2)}`;
    }
}

// Initialize Remove Buttons
function initRemoveButtons() {
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const cartItem = document.querySelector(`.cart-item[data-id="${id}"]`);
            const itemName = cartItem.querySelector('h3').textContent;
            
            if (confirm(`Remove ${itemName} from cart?`)) {
                // Remove from localStorage
                let cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
                cartItems = cartItems.filter(item => item.id != id);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                
                // Animate removal
                cartItem.style.opacity = '0';
                cartItem.style.transform = 'translateX(-100px)';
                
                setTimeout(() => {
                    cartItem.remove();
                    calculateTotals();
                    updateCartBadge();
                    
                    // Check if cart is empty
                    const remainingItems = document.querySelectorAll('.cart-item');
                    if (remainingItems.length === 0) {
                        showEmptyCart();
                    }
                    
                    showNotification('Item removed from cart', 'success');
                }, 300);
            }
        });
    });
}

// Calculate Totals
function calculateTotals() {
    const cartItems = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    
    // Update summary items list
    const summaryItems = document.querySelector('.summary-items');
    summaryItems.innerHTML = '';
    
    cartItems.forEach(item => {
        const itemName = item.querySelector('h3').textContent;
        const quantity = parseInt(item.querySelector('.qty-input').value);
        const itemTotalText = item.querySelector('.item-total').textContent;
        const itemTotal = parseFloat(itemTotalText.replace('₱', '').replace(',', ''));
        
        subtotal += itemTotal;
        
        // Add to summary
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
            <span>${itemName} (${quantity})</span>
            <span>₱${itemTotal.toFixed(2)}</span>
        `;
        summaryItems.appendChild(summaryItem);
    });
    
    const tax = subtotal * 0.02; // 2% tax
    const total = subtotal + tax;
    
    // Update summary totals
    document.getElementById('subtotal').textContent = `₱${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `₱${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `₱${total.toFixed(2)}`;
}

// Update Cart Badge
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    let totalQuantity = 0;
    
    cartItems.forEach(item => {
        totalQuantity += (item.quantity || 1);
    });
    
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = totalQuantity;
        
        if (totalQuantity === 0) {
            cartCount.style.display = 'none';
        } else {
            cartCount.style.display = 'flex';
        }
    }
}

// Initialize Checkout Buttons
function initCheckoutButtons() {
    const checkoutBtn = document.querySelector('.btn-checkout');
    const continueBtn = document.querySelector('.btn-continue');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Cart is already in localStorage as 'cartItems'
            // Just redirect to checkout
            window.location.href = 'checkout.html';
        });
    }
    
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            window.location.href = 'cameras.html';
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
`;
document.head.appendChild(style);

// Test empty cart functionality
window.testEmptyCart = function() {
    document.querySelectorAll('.cart-item').forEach(item => item.remove());
    showEmptyCart();
};

// Test with items functionality
window.testWithItems = function() {
    location.reload();
};
