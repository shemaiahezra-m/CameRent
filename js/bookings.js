// Bookings Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadBookingsFromServer();
    initFilterTabs();
    initBookingActions();
});

// Load bookings from server
async function loadBookingsFromServer() {
    try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        const orders = data.orders || [];
        
        console.log('📦 All orders from server:', orders);
        console.log('📦 Total orders:', orders.length);
        
        // Get current user from session (if logged in)
        const currentUser = await getCurrentUser();
        
        console.log('👤 Current user:', currentUser);
        
        // Filter orders for current user only
        const userOrders = currentUser ? orders.filter(order => order.userId === currentUser.id) : [];
        
        console.log('📦 Filtered user orders:', userOrders);
        console.log('📦 User orders count:', userOrders.length);
        
        // Convert server format to bookings page format
        const formattedOrders = userOrders.map(order => {
            console.log('🔄 Formatting order:', order);
            console.log('   📌 Raw status from server:', order.status);
            console.log('   📌 Payment method:', order.payment_method);
            console.log('   📌 Payment status:', order.paymentStatus);
            
            // Map server status to frontend status
            let displayStatus = order.status || 'pending';
            if (displayStatus === 'new') {
                displayStatus = 'pending';
            }
            
            console.log('   🔄 Mapped display status:', displayStatus);
            console.log('   📦 Order items:', order.items);
            
            // Add images to items based on product ID/name
            const itemsWithImages = (order.items || []).map(item => {
                console.log('      📸 Processing item:', item);
                console.log('      🔑 Item keys:', Object.keys(item));
                console.log('      🆔 productId:', item.productId);
                console.log('      🆔 id:', item.id);
                console.log('      📛 name:', item.name);
                
                // If item already has image, use it
                if (item.image) {
                    console.log('      ✅ Using existing image:', item.image);
                    return item;
                }
                
                // Map product IDs to image paths (using external CDN URLs)
                const productImages = {
                    'iphone-16-pro-max': 'https://powermaccenter.com/cdn/shop/files/iPhone_16_Pro_Max_Natural_Titanium_PDP_Image_Position_1__en-WW_8b820b11-36e5-4147-af03-879b6cebfdfd_720x.jpg?v=1726238578',
                    'iphone-14-pro': 'https://powermaccenter.com/cdn/shop/files/iPhone_14_Pro_Silver_PDP_Image_Position-1a__en-US_0e607d08-2dff-4f8b-8a40-7f5da49434b9.jpg?v=1705403393',
                    'iphone-13-pro-max': 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pro-max-blue-select?wid=470&hei=556&fmt=png-alpha&.v=1645552346295'
                };
                
                // Try to find image by productId or id first
                let productId = item.productId || item.id || '';
                
                // If no productId, try to parse from name
                if (!productId && item.name) {
                    const nameLower = item.name.toLowerCase();
                    console.log('      🔍 Parsing name:', nameLower);
                    
                    // Check each product pattern
                    if (nameLower.includes('iphone 16 pro max')) {
                        productId = 'iphone-16-pro-max';
                    } else if (nameLower.includes('iphone 16 pro')) {
                        productId = 'iphone-16-pro';
                    } else if (nameLower.includes('iphone 16 plus')) {
                        productId = 'iphone-16-plus';
                    } else if (nameLower.includes('iphone 16')) {
                        productId = 'iphone-16';
                    } else if (nameLower.includes('iphone 15 pro max')) {
                        productId = 'iphone-15-pro-max';
                    } else if (nameLower.includes('iphone 15 pro')) {
                        productId = 'iphone-15-pro';
                    } else if (nameLower.includes('iphone 15 plus')) {
                        productId = 'iphone-15-plus';
                    } else if (nameLower.includes('iphone 15')) {
                        productId = 'iphone-15';
                    } else if (nameLower.includes('iphone 14 pro max')) {
                        productId = 'iphone-14-pro-max';
                    } else if (nameLower.includes('iphone 14 pro')) {
                        productId = 'iphone-14-pro';
                    } else if (nameLower.includes('iphone 14 plus')) {
                        productId = 'iphone-14-plus';
                    } else if (nameLower.includes('iphone 14')) {
                        productId = 'iphone-14';
                    } else if (nameLower.includes('iphone 13 pro max')) {
                        productId = 'iphone-13-pro-max';
                    } else if (nameLower.includes('iphone 13 pro')) {
                        productId = 'iphone-13-pro';
                    } else if (nameLower.includes('iphone 13')) {
                        productId = 'iphone-13';
                    } else if (nameLower.includes('iphone 12 pro max')) {
                        productId = 'iphone-12-pro-max';
                    }
                    
                    console.log('      🎯 Matched productId:', productId);
                }
                
                console.log('      🔍 Looking for productId:', productId);
                item.image = productImages[productId] || '';
                
                console.log('      ✅ Item with image:', item.image);
                return item;
            });
            
            const formatted = {
                orderNumber: `ORD-${order.id}`,
                orderDate: new Date(order.createdAt * 1000).toISOString(),
                pickupDate: new Date(order.start_date * 1000).toISOString(),
                returnDate: new Date(order.end_date * 1000).toISOString(),
                status: displayStatus,
                paymentMethod: order.payment_method || 'card',
                paymentStatus: order.paymentStatus || order.payment_status || 'pending',
                items: itemsWithImages,
                total: `₱${order.total || 0}`,
                subtotal: `₱${order.total || 0}`,
                deliveryFee: '₱0',
                tax: '₱0',
                discount: '₱0',
                firstName: order.firstName || '',
                lastName: order.lastName || '',
                email: order.email || '',
                phone: order.phone || '',
                address: order.address || '',
                city: order.city || '',
                zipCode: order.zipCode || '',
                notes: order.notes || ''
            };
            console.log('✅ Formatted status:', formatted.status);
            return formatted;
        });
        
        console.log('📋 About to display orders:', formattedOrders);
        displayBookings(formattedOrders);
        
        console.log('✅ Orders displayed, initializing filters...');
        
        // Re-initialize filter tabs after orders are loaded
        initFilterTabs();
        
        // Update filter counts after loading
        updateFilterCounts();
        
        console.log('✅ Filter counts updated');
        
        // If no orders, show empty state
        if (formattedOrders.length === 0) {
            showEmptyBookings();
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        // Fallback to localStorage
        loadBookingsFromStorage();
    }
}

// Get current user from session
async function getCurrentUser() {
    try {
        const response = await fetch('/api/me');
        if (response.ok) {
            const data = await response.json();
            return data.user;
        }
    } catch (error) {
        console.error('Error getting current user:', error);
    }
    return null;
}

// Display bookings
function displayBookings(orders) {
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = '';
    
    // Display orders from newest to oldest
    orders.reverse().forEach((order, index) => {
        const bookingCard = createBookingCard(order, index);
        bookingsList.appendChild(bookingCard);
    });
}

// Load bookings from localStorage (fallback)
function loadBookingsFromStorage() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const bookingsList = document.getElementById('bookingsList');
    
    // Clear existing bookings (keep only demo bookings if orders is empty)
    if (orders.length > 0) {
        bookingsList.innerHTML = '';
    }
    
    // Display orders from newest to oldest
    orders.reverse().forEach((order, index) => {
        const bookingCard = createBookingCard(order, index);
        bookingsList.appendChild(bookingCard);
    });
    
    // Update filter counts after loading
    updateFilterCounts();
    
    // If no orders, show empty state
    if (orders.length === 0 && bookingsList.children.length === 0) {
        showEmptyBookings();
    }
}

// Create booking card from order data
function createBookingCard(order, index) {
    const card = document.createElement('div');
    card.className = 'booking-card';
    card.setAttribute('data-status', order.status || 'pending');
    
    // Format dates
    const orderDate = new Date(order.orderDate);
    const pickupDate = new Date(order.pickupDate);
    const returnDate = new Date(order.returnDate);
    
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
    
    // Calculate duration
    const duration = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
    
    // Get status badge
    const statusInfo = getStatusInfo(order.status || 'pending');
    
    // Create items HTML
    let itemsHTML = '';
    order.items.forEach(item => {
        const itemAddons = item.addons || [];
        const addonsText = itemAddons.length > 0 ? `<p class="item-addons-text">+ ${itemAddons.length} add-on${itemAddons.length > 1 ? 's' : ''}</p>` : '';
        
        itemsHTML += `
            <div class="booking-item">
                <div class="item-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<i class="fas fa-camera"></i>'}
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-quantity">Quantity: ${item.quantity || 1}</p>
                    ${addonsText}
                </div>
                <div class="item-price">₱${item.price}/day</div>
            </div>
        `;
    });
    
    // Get payment method display
    const paymentMethodText = getPaymentMethodText(order.paymentMethod);
    
    // Create action buttons based on status
    let actionButtons = '';
    if (order.status === 'pending') {
        actionButtons = `
            <button class="btn-secondary" onclick="viewOrderDetails('${order.orderNumber}')">View Details</button>
            <button class="btn-danger" onclick="cancelOrder('${order.orderNumber}')">Cancel Order</button>
        `;
    } else if (order.status === 'in-use') {
        actionButtons = `
            <button class="btn-secondary" onclick="viewOrderDetails('${order.orderNumber}')">View Details</button>
            <button class="btn-primary" onclick="returnEquipment('${order.orderNumber}')">Return Equipment</button>
        `;
    } else {
        actionButtons = `
            <button class="btn-secondary" onclick="viewOrderDetails('${order.orderNumber}')">View Details</button>
        `;
    }
    
    card.innerHTML = `
        <div class="booking-header">
            <div class="booking-info">
                <span class="booking-label">Order Number</span>
                <span class="booking-number">${order.orderNumber}</span>
            </div>
            <div class="booking-info">
                <span class="booking-label">Order Date</span>
                <span class="booking-date">${formatDate(orderDate)}</span>
            </div>
            <div class="booking-status ${order.status || 'pending'}">
                <i class="${statusInfo.icon}"></i> ${statusInfo.text}
            </div>
        </div>

        <div class="booking-items">
            ${itemsHTML}
        </div>

        <div class="booking-dates">
            <div class="date-info">
                <i class="far fa-calendar"></i>
                <div>
                    <span class="date-label">Pickup Date</span>
                    <span class="date-value">${formatDate(pickupDate)}</span>
                </div>
            </div>
            <div class="date-info">
                <div>
                    <span class="date-label">Return Date</span>
                    <span class="date-value">${formatDate(returnDate)}</span>
                </div>
            </div>
            <div class="duration-badge">
                <strong>${duration} day${duration > 1 ? 's' : ''}</strong>
            </div>
        </div>

        <div class="booking-payment">
            <div class="payment-method">
                <span class="payment-label">Payment Method:</span>
                <span class="payment-value">${paymentMethodText}</span>
            </div>
            <div class="payment-status-badge ${order.paymentStatus || 'pending'}">
                ${getPaymentStatusText(order.paymentStatus)}
            </div>
        </div>

        <div class="booking-footer">
            <div class="booking-total">
                <span class="total-label">Total Amount</span>
                <span class="total-amount">${order.total}</span>
            </div>
            <div class="booking-actions">
                ${actionButtons}
            </div>
        </div>
    `;
    
    return card;
}

// Get status badge info
function getStatusInfo(status) {
    const statusMap = {
        'pending': { icon: 'fas fa-clock', text: 'Pending' },
        'confirmed': { icon: 'fas fa-check-circle', text: 'Confirmed' },
        'in-use': { icon: 'fas fa-camera', text: 'In Use' },
        'completed': { icon: 'fas fa-box', text: 'Completed' },
        'cancelled': { icon: 'fas fa-times-circle', text: 'Cancelled' }
    };
    
    return statusMap[status] || statusMap['pending'];
}

// Get payment method text
function getPaymentMethodText(method) {
    const methodMap = {
        'card': 'Credit/Debit Card',
        'gcash': 'GCash',
        'paymaya': 'PayMaya',
        'bank': 'Bank Transfer',
        'cod': 'Cash on Pickup'
    };
    
    return methodMap[method] || method;
}

// Get payment status text
function getPaymentStatusText(status) {
    const statusMap = {
        'authorized': 'Paid',
        'awaiting_payment': 'Awaiting Payment',
        'pay_on_pickup': 'Pay on Pickup',
        'paid': 'Paid',
        'pending': 'Pending'
    };
    
    return statusMap[status] || 'Pending';
}

// Show empty bookings message
function showEmptyBookings() {
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-inbox"></i>
            <h3>No bookings yet</h3>
            <p>Start renting cameras to see your bookings here.</p>
            <a href="cameras.html" class="btn-primary" style="display: inline-block; margin-top: 20px; text-decoration: none;">
                Browse Cameras
            </a>
        </div>
    `;
}

// Global functions for action buttons
window.viewOrderDetails = function(orderNumber) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.orderNumber === orderNumber);
    
    if (order) {
        showOrderDetailsModal(order);
    }
};

// Show order details modal
function showOrderDetailsModal(order) {
    // Format dates
    const orderDate = new Date(order.orderDate);
    const pickupDate = new Date(order.pickupDate);
    const returnDate = new Date(order.returnDate);
    
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };
    
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };
    
    // Calculate duration
    const duration = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
    
    // Get status info
    const statusInfo = getStatusInfo(order.status || 'pending');
    
    // Build items HTML with add-ons
    let itemsHTML = '';
    order.items.forEach(item => {
        const itemAddons = item.addons || [];
        let addonsHTML = '';
        
        if (itemAddons.length > 0) {
            addonsHTML = '<div class="modal-item-addons"><strong>Add-ons:</strong><ul>';
            itemAddons.forEach(addon => {
                addonsHTML += `<li>${addon.name} - ${addon.price}</li>`;
            });
            addonsHTML += '</ul></div>';
        }
        
        itemsHTML += `
            <div class="modal-order-item">
                <div class="modal-item-image">
                    ${item.image ? `<img src="${item.image}" alt="${item.name}">` : '<i class="fas fa-camera"></i>'}
                </div>
                <div class="modal-item-info">
                    <h4>${item.name}</h4>
                    <p>${item.category || 'Camera'}</p>
                    <p class="modal-item-qty">Quantity: ${item.quantity || 1}</p>
                    ${addonsHTML}
                </div>
                <div class="modal-item-price">
                    <strong>${item.price}</strong>
                    <span>/day</span>
                </div>
            </div>
        `;
    });
    
    // Create modal HTML
    const modalHTML = `
        <div class="order-details-modal" id="orderDetailsModal">
            <div class="modal-overlay" onclick="closeOrderDetailsModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title-section">
                        <h2>Order Details</h2>
                        <span class="modal-order-number">${order.orderNumber}</span>
                    </div>
                    <button class="modal-close-btn" onclick="closeOrderDetailsModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <!-- Order Status Section -->
                    <div class="modal-section">
                        <div class="modal-section-header">
                            <i class="fas fa-info-circle"></i>
                            <h3>Order Status</h3>
                        </div>
                        <div class="modal-section-content">
                            <div class="modal-status-row">
                                <span class="modal-label">Current Status:</span>
                                <span class="booking-status ${order.status || 'pending'}" style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px;">
                                    <i class="${statusInfo.icon}"></i> ${statusInfo.text}
                                </span>
                            </div>
                            <div class="modal-status-row">
                                <span class="modal-label">Payment Status:</span>
                                <span class="payment-status-badge ${order.paymentStatus || 'pending'}" style="display: inline-block;">
                                    ${getPaymentStatusText(order.paymentStatus)}
                                </span>
                            </div>
                            <div class="modal-status-row">
                                <span class="modal-label">Order Date:</span>
                                <span>${formatDate(orderDate)} at ${formatTime(orderDate)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Rental Information -->
                    <div class="modal-section">
                        <div class="modal-section-header">
                            <i class="far fa-calendar"></i>
                            <h3>Rental Period</h3>
                        </div>
                        <div class="modal-section-content">
                            <div class="modal-date-row">
                                <div class="modal-date-item">
                                    <span class="modal-date-label">Pickup Date</span>
                                    <strong>${formatDate(pickupDate)}</strong>
                                </div>
                                <div class="modal-date-arrow">
                                    <i class="fas fa-arrow-right"></i>
                                </div>
                                <div class="modal-date-item">
                                    <span class="modal-date-label">Return Date</span>
                                    <strong>${formatDate(returnDate)}</strong>
                                </div>
                            </div>
                            <div class="modal-duration">
                                <i class="fas fa-clock"></i>
                                <span>Total Duration: <strong>${duration} day${duration > 1 ? 's' : ''}</strong></span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Order Items -->
                    <div class="modal-section">
                        <div class="modal-section-header">
                            <i class="fas fa-camera"></i>
                            <h3>Rented Items</h3>
                        </div>
                        <div class="modal-section-content">
                            ${itemsHTML}
                        </div>
                    </div>
                    
                    <!-- Customer Information -->
                    <div class="modal-section">
                        <div class="modal-section-header">
                            <i class="fas fa-user"></i>
                            <h3>Customer Information</h3>
                        </div>
                        <div class="modal-section-content modal-info-grid">
                            <div class="modal-info-item">
                                <span class="modal-label">Full Name</span>
                                <strong>${order.firstName} ${order.lastName}</strong>
                            </div>
                            <div class="modal-info-item">
                                <span class="modal-label">Email</span>
                                <strong>${order.email}</strong>
                            </div>
                            <div class="modal-info-item">
                                <span class="modal-label">Phone</span>
                                <strong>${order.phone}</strong>
                            </div>
                            <div class="modal-info-item">
                                <span class="modal-label">Address</span>
                                <strong>${order.address}<br>${order.city}, ${order.zipCode}</strong>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Payment Information -->
                    <div class="modal-section">
                        <div class="modal-section-header">
                            <i class="fas fa-credit-card"></i>
                            <h3>Payment Information</h3>
                        </div>
                        <div class="modal-section-content">
                            <div class="modal-info-item">
                                <span class="modal-label">Payment Method</span>
                                <strong>${getPaymentMethodText(order.paymentMethod)}</strong>
                            </div>
                            ${order.notes ? `
                                <div class="modal-info-item" style="margin-top: 12px;">
                                    <span class="modal-label">Order Notes</span>
                                    <p style="margin-top: 8px; color: #6b7280;">${order.notes}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- Order Summary -->
                    <div class="modal-section">
                        <div class="modal-section-header">
                            <i class="fas fa-receipt"></i>
                            <h3>Order Summary</h3>
                        </div>
                        <div class="modal-section-content modal-summary">
                            <div class="modal-summary-row">
                                <span>Subtotal</span>
                                <span>${order.subtotal}</span>
                            </div>
                            <div class="modal-summary-row">
                                <span>Delivery Fee</span>
                                <span>${order.deliveryFee || '₱0'}</span>
                            </div>
                            <div class="modal-summary-row">
                                <span>Tax (2%)</span>
                                <span>${order.tax || '₱0'}</span>
                            </div>
                            ${order.discount && order.discount !== '₱0' ? `
                                <div class="modal-summary-row discount">
                                    <span>Discount</span>
                                    <span>-${order.discount}</span>
                                </div>
                            ` : ''}
                            <div class="modal-summary-row total">
                                <span>Total Amount</span>
                                <strong>${order.total}</strong>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    ${order.status === 'pending' ? `
                        <button class="btn-danger" onclick="cancelOrderFromModal('${order.orderNumber}')">
                            <i class="fas fa-times"></i> Cancel Order
                        </button>
                    ` : ''}
                    ${order.status === 'in-use' ? `
                        <button class="btn-primary" onclick="returnEquipmentFromModal('${order.orderNumber}')">
                            <i class="fas fa-box"></i> Return Equipment
                        </button>
                    ` : ''}
                    <button class="btn-secondary" onclick="closeOrderDetailsModal()">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

// Close order details modal
window.closeOrderDetailsModal = function() {
    const modal = document.getElementById('orderDetailsModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
};

// Cancel order from modal
window.cancelOrderFromModal = function(orderNumber) {
    closeOrderDetailsModal();
    setTimeout(() => {
        cancelOrder(orderNumber);
    }, 300);
};

// Return equipment from modal
window.returnEquipmentFromModal = function(orderNumber) {
    closeOrderDetailsModal();
    setTimeout(() => {
        returnEquipment(orderNumber);
    }, 300);
};

window.cancelOrder = function(orderNumber) {
    if (confirm(`Are you sure you want to cancel order ${orderNumber}? This action cannot be undone.`)) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderIndex = orders.findIndex(o => o.orderNumber === orderNumber);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'cancelled';
            localStorage.setItem('orders', JSON.stringify(orders));
            
            showNotification('Order cancelled successfully', 'success');
            
            // Reload bookings
            setTimeout(() => {
                loadBookingsFromServer();
            }, 500);
        }
    }
};

window.returnEquipment = function(orderNumber) {
    if (confirm(`Are you sure you want to return the equipment for order ${orderNumber}?`)) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderIndex = orders.findIndex(o => o.orderNumber === orderNumber);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'completed';
            localStorage.setItem('orders', JSON.stringify(orders));
            
            showNotification('Return request submitted successfully!', 'success');
            
            // Reload bookings
            setTimeout(() => {
                loadBookingsFromServer();
            }, 500);
        }
    }
};

// Filter Tabs
function initFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const bookingCards = document.querySelectorAll('.booking-card');
    const filtersContainer = document.querySelector('.bookings-filters');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update data-active attribute for sliding indicator
            if (filtersContainer) {
                filtersContainer.setAttribute('data-active', filter);
            }
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter bookings with animation
            bookingCards.forEach(card => {
                const status = card.getAttribute('data-status');
                
                if (filter === 'all' || status === filter) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-20px)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 400);
                }
            });
            
            // Check if no results
            checkEmptyState(filter);
        });
    });
}

// Check for empty state
function checkEmptyState(filter) {
    const bookingsList = document.getElementById('bookingsList');
    const visibleCards = document.querySelectorAll('.booking-card:not(.hidden)');
    
    // Remove existing empty state
    const existingEmptyState = bookingsList.querySelector('.empty-state');
    if (existingEmptyState) {
        existingEmptyState.remove();
    }
    
    if (visibleCards.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <i class="fas fa-inbox"></i>
            <h3>No bookings found</h3>
            <p>You don't have any ${filter === 'all' ? '' : filter} bookings at the moment.</p>
        `;
        bookingsList.appendChild(emptyState);
    }
}

// Update filter counts
function updateFilterCounts() {
    const bookingCards = document.querySelectorAll('.booking-card');
    const counts = {
        all: bookingCards.length,
        pending: 0,
        confirmed: 0,
        'in-use': 0,
        completed: 0
    };
    
    bookingCards.forEach(card => {
        const status = card.getAttribute('data-status');
        if (counts.hasOwnProperty(status)) {
            counts[status]++;
        }
    });
    
    // Update count badges
    document.querySelectorAll('.filter-tab').forEach(tab => {
        const filter = tab.getAttribute('data-filter');
        const countBadge = tab.querySelector('.filter-count');
        if (countBadge && counts.hasOwnProperty(filter)) {
            countBadge.textContent = counts[filter];
        }
    });
}

// Booking Actions
function initBookingActions() {
    // View Details buttons
    document.querySelectorAll('.btn-secondary').forEach(btn => {
        if (btn.textContent.includes('View Details')) {
            btn.addEventListener('click', function() {
                const card = this.closest('.booking-card');
                const orderNumber = card.querySelector('.booking-number').textContent;
                showNotification(`Viewing details for ${orderNumber}`, 'success');
                // Here you can add modal or navigate to detail page
            });
        }
    });
    
    // Return Equipment buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('Return Equipment')) {
            btn.addEventListener('click', function() {
                const card = this.closest('.booking-card');
                const orderNumber = card.querySelector('.booking-number').textContent;
                
                if (confirm(`Are you sure you want to return the equipment for ${orderNumber}?`)) {
                    showNotification('Return request submitted successfully!', 'success');
                    // Update card status
                    setTimeout(() => {
                        card.setAttribute('data-status', 'completed');
                        const statusBadge = card.querySelector('.booking-status');
                        statusBadge.className = 'booking-status completed';
                        statusBadge.innerHTML = '<i class="fas fa-box"></i> Completed';
                        
                        // Hide return button
                        this.style.display = 'none';
                        
                        updateFilterCounts();
                    }, 1000);
                }
            });
        }
    });
    
    // Cancel Order buttons
    document.querySelectorAll('.btn-danger').forEach(btn => {
        if (btn.textContent.includes('Cancel Order')) {
            btn.addEventListener('click', function() {
                const card = this.closest('.booking-card');
                const orderNumber = card.querySelector('.booking-number').textContent;
                
                if (confirm(`Are you sure you want to cancel ${orderNumber}? This action cannot be undone.`)) {
                    showNotification('Order cancelled successfully', 'success');
                    // Remove card with animation
                    card.style.opacity = '0';
                    card.style.transform = 'translateX(-100px)';
                    setTimeout(() => {
                        card.remove();
                        updateFilterCounts();
                        checkEmptyState('all');
                    }, 400);
                }
            });
        }
    });
    
    // Contact Support button
    const helpBtn = document.querySelector('.btn-help');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            showNotification('Opening support chat...', 'success');
            // Here you can integrate live chat or open contact form
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
        padding: '10px 24px',
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

// Scroll animation for cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all booking cards on load
document.querySelectorAll('.booking-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});
