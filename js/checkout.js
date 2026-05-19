// CHECKOUT PAGE FUNCTIONALITY

// Load cart items on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded fired - initializing checkout page...');
    loadCartItems();
    initializePaymentMethods();
    initializeFormValidation();
    initializeDeliveryOption();
    initializeCardFormatting();
    prefillRentalDates();
    initializeDateChangeHandlers();
    initializeFileUpload();
    initializeInsuranceSelection();
});

// Fallback: If DOMContentLoaded already fired, run immediately
if (document.readyState === 'loading') {
    console.log('Document still loading, will wait for DOMContentLoaded');
} else {
    console.log('Document already loaded, initializing immediately');
    setTimeout(() => {
        loadCartItems();
        initializePaymentMethods();
        initializeFormValidation();
        initializeDeliveryOption();
        initializeCardFormatting();
        prefillRentalDates();
        initializeDateChangeHandlers();
        initializeFileUpload();
        initializeInsuranceSelection();
    }, 100);
}

// Prefill rental dates from localStorage
function prefillRentalDates() {
    const pickupDate = localStorage.getItem('selectedPickupDate');
    const returnDate = localStorage.getItem('selectedReturnDate');
    
    const pickupInput = document.getElementById('pickupDate');
    const returnInput = document.getElementById('returnDate');
    
    if (pickupDate && pickupInput) {
        // Convert ISO string to YYYY-MM-DD format for input
        const date = new Date(pickupDate);
        pickupInput.value = date.toISOString().split('T')[0];
    }
    
    if (returnDate && returnInput) {
        const date = new Date(returnDate);
        returnInput.value = date.toISOString().split('T')[0];
    }
}

// Date change listeners: update storage and recompute prices
function initializeDateChangeHandlers() {
    const pickupInput = document.getElementById('pickupDate');
    const returnInput = document.getElementById('returnDate');

    const recalc = function() {
        try {
            const pickupVal = pickupInput && pickupInput.value;
            const returnVal = returnInput && returnInput.value;

            if (pickupVal) {
                const iso = new Date(pickupVal).toISOString();
                localStorage.setItem('selectedPickupDate', iso);
            }
            if (returnVal) {
                const iso = new Date(returnVal).toISOString();
                localStorage.setItem('selectedReturnDate', iso);
            }

            // Rebuild items and recompute totals based on new dates
            loadCartItemsActual();

            // If insurance is checked, trigger its recalculation so total includes it
            const damage = document.getElementById('damageInsurance');
            const full = document.getElementById('fullInsurance');
            if (damage) damage.dispatchEvent(new Event('change'));
            if (full) full.dispatchEvent(new Event('change'));
        } catch (e) {
            console.warn('Date change recalculation error:', e);
        }
    };

    if (pickupInput) {
        pickupInput.addEventListener('change', recalc);
        pickupInput.addEventListener('input', recalc);
    }
    if (returnInput) {
        returnInput.addEventListener('change', recalc);
        returnInput.addEventListener('input', recalc);
    }
}

// Load cart items from localStorage
function loadCartItems() {
    // Add a small delay to ensure DOM is fully ready
    setTimeout(() => {
        loadCartItemsActual();
    }, 100);
}

function loadCartItemsActual() {
    let cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const orderItemsContainer = document.getElementById('orderItems');
    
    // Comprehensive debug logging
    console.log('===== CHECKOUT PAGE DEBUG =====');
    console.log('Time:', new Date().toISOString());
    console.log('localStorage.cartItems:', cart.length, 'items');
    console.log('Full cart data:', JSON.stringify(cart, null, 2));
    console.log('localStorage keys:', Object.keys(localStorage));
    console.log('selectedPickupDate:', localStorage.getItem('selectedPickupDate'));
    console.log('selectedReturnDate:', localStorage.getItem('selectedReturnDate'));

    // Try fallbacks if cartItems is empty
    if (cart.length === 0) {
        const legacyCart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (legacyCart.length > 0) {
            console.warn('Found legacy cart key "cart". Converting to new format...');
            cart = legacyCart.map(item => ({
                id: item.id || item.productId || Date.now(),
                name: item.name || item.title || 'Product',
                image: item.image || item.img || '',
                price: (item.price && typeof item.price === 'string') ? item.price.replace(/[^0-9]/g, '') : String(item.price || 0),
                quantity: item.quantity || 1,
                addons: item.addons || []
            }));
            localStorage.setItem('cartItems', JSON.stringify(cart));
            console.log('Converted legacy cart:', JSON.stringify(cart, null, 2));
        } else {
            const selectedProductRaw = localStorage.getItem('selectedProduct');
            if (selectedProductRaw) {
                try {
                    const p = JSON.parse(selectedProductRaw);
                    console.warn('Using selectedProduct as single-item cart fallback');
                    cart = [{
                        id: p.id,
                        name: p.name,
                        image: p.image,
                        price: String(p.basePrice || p.price || 0),
                        quantity: 1,
                        addons: []
                    }];
                    localStorage.setItem('cartItems', JSON.stringify(cart));
                } catch(e) {
                    console.warn('Failed to parse selectedProduct fallback:', e);
                }
            }
        }
    }
    
    // Check if orderItemsContainer exists
    if (!orderItemsContainer) {
        console.error('❌ CRITICAL: orderItemsContainer (id="orderItems") not found in DOM!');
        console.error('Trying alternative selectors...');
        
        // Try alternative ways to find the container
        const alternativeContainer = document.querySelector('.order-items');
        if (alternativeContainer) {
            console.warn('⚠️ Found container using .order-items class instead');
            loadCartWithContainer(alternativeContainer, cart);
            return;
        }
        
        alert('ERROR: Order summary container not found. Please refresh the page.');
        return;
    }
    
    console.log('✓ orderItemsContainer found:', orderItemsContainer);
    loadCartWithContainer(orderItemsContainer, cart);
}

function loadCartWithContainer(orderItemsContainer, cart) {
    const emptyMessage = orderItemsContainer?.querySelector('.empty-cart');
    
    if (cart.length === 0) {
        console.error('🛑 CRITICAL: Cart is empty on checkout page!');
        console.error('This means cartItems was not persisted from previous page');
        if (emptyMessage) {
            emptyMessage.style.display = 'block';
        }
        updateOrderSummary([], 0);
        
        // Show alert and redirect after 2 seconds
        setTimeout(() => {
            // Double-check cart is still empty
            const reloadedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
            console.log('Reloaded cart after delay:', reloadedCart.length, 'items');
            if (reloadedCart.length === 0) {
                alert('❌ Your cart is empty.\n\nPlease go back to the cameras page and add items to your cart before checking out.\n\nTroubleshooting: Check your browser console (F12) for debug logs.');
                window.location.href = 'cameras.html';
            }
        }, 1500);
        return;
    }
    
    // FORCE HIDE empty message with multiple methods
    if (emptyMessage) {
        emptyMessage.style.display = 'none !important';
        emptyMessage.style.visibility = 'hidden';
        emptyMessage.style.opacity = '0';
        emptyMessage.style.height = '0';
        emptyMessage.style.overflow = 'hidden';
        emptyMessage.remove(); // Just remove it completely
        console.log('Empty message REMOVED');
    }
    
    console.log('✅ Cart loaded successfully with', cart.length, 'items');
    
    // Clear existing items (except empty message which is now removed)
    const existingItems = orderItemsContainer.querySelectorAll('.order-item');
    console.log('Clearing', existingItems.length, 'existing order items');
    existingItems.forEach(item => item.remove());
    
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
    
    console.log('Rental days:', rentalDays);
    console.log('Creating', cart.length, 'order item elements...');
    
    // Add a debug header to show we're loading items
    const debugHeader = document.createElement('div');
    debugHeader.id = 'debug-header';
    debugHeader.style.cssText = `
        background: #dbeafe;
        color: #1e40af;
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 15px;
        font-size: 13px;
        font-weight: 600;
        text-align: center;
    `;
    debugHeader.textContent = `📦 Loading ${cart.length} item${cart.length > 1 ? 's' : ''}...`;
    orderItemsContainer.appendChild(debugHeader);
    
    // Add cart items
    cart.forEach((item, index) => {
        console.log(`Creating order item ${index + 1}:`, item.name);
        const orderItem = createOrderItemElement(item, rentalDays);
        console.log('Order item element created:', orderItem);
        orderItemsContainer.appendChild(orderItem);
        console.log(`✓ Order item ${index + 1} appended to container`);
    });
    
    // Remove debug header and replace with success message
    setTimeout(() => {
        if (debugHeader.parentNode) {
            debugHeader.textContent = `✅ ${cart.length} item${cart.length > 1 ? 's' : ''} loaded`;
            debugHeader.style.background = '#d1fae5';
            debugHeader.style.color = '#065f46';
            
            setTimeout(() => {
                debugHeader.remove();
            }, 2000);
        }
    }, 500);
    
    // Verify items were added
    const addedItems = orderItemsContainer.querySelectorAll('.order-item');
    console.log('✅ Total order items in DOM after append:', addedItems.length);
    
    if (addedItems.length === 0) {
        console.error('❌ CRITICAL: Items were not added to DOM!');
        
        // Add visual debug info directly to page
        const debugDiv = document.createElement('div');
        debugDiv.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #fee2e2;
            border: 2px solid #ef4444;
            color: #991b1b;
            padding: 20px;
            border-radius: 12px;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        debugDiv.innerHTML = `
            <h3 style="margin: 0 0 10px 0; font-size: 16px;">⚠️ Debug: Items Not Rendering</h3>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Cart items in storage:</strong> ${cart.length}</p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Items in DOM:</strong> ${addedItems.length}</p>
            <p style="margin: 5px 0; font-size: 13px;"><strong>Container found:</strong> Yes</p>
            <p style="margin: 10px 0 5px 0; font-size: 12px;">Check browser console (F12) for details.</p>
            <button onclick="location.reload()" style="
                background: #3b82f6;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                margin-top: 10px;
                margin-right: 10px;
            ">🔄 Reload Page</button>
            <button onclick="this.parentElement.remove()" style="
                background: #dc2626;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                margin-top: 10px;
            ">Close</button>
        `;
        document.body.appendChild(debugDiv);
        
        // Also add a reload button to the order summary itself
        const reloadBtn = document.createElement('button');
        reloadBtn.textContent = '🔄 Reload Cart';
        reloadBtn.style.cssText = `
            width: 100%;
            padding: 12px;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 10px;
        `;
        reloadBtn.onclick = function() {
            console.log('Manual reload triggered');
            location.reload();
        };
        orderItemsContainer.appendChild(reloadBtn);
    } else {
        console.log('✅ SUCCESS: All items rendered correctly!');
        
        // Force container to be visible
        orderItemsContainer.style.display = 'block';
        orderItemsContainer.style.visibility = 'visible';
        
        // Add success indicator in console
        console.log('%c✅ ORDER SUMMARY RENDERED SUCCESSFULLY', 'color: #10b981; font-size: 16px; font-weight: bold;');
    }
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => {
        const price = parseInt(item.price);
        const quantity = parseInt(item.quantity) || 1;
        let itemTotal = price * rentalDays * quantity;
        
        // Add add-ons to subtotal
        const addons = item.addons || [];
        if (addons.length > 0) {
            addons.forEach(addon => {
                itemTotal += parseInt(addon.price);
            });
        }
        
        return total + itemTotal;
    }, 0);
    
    updateOrderSummary(cart, subtotal);
}

// Create order item element
function createOrderItemElement(item, rentalDays) {
    console.log('Creating order item element for:', item.name);
    console.log('Item data:', JSON.stringify(item, null, 2));
    console.log('Rental days:', rentalDays);
    
    const div = document.createElement('div');
    div.className = 'order-item';
    
    // FORCE visibility with inline styles
    div.style.cssText = `
        display: flex !important;
        gap: 15px;
        margin-bottom: 15px;
        visibility: visible !important;
        opacity: 1 !important;
        min-height: 60px;
        background: white;
        padding: 10px;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
    `;
    
    const price = parseInt(item.price);
    const quantity = parseInt(item.quantity) || 1;
    let itemTotal = price * rentalDays * quantity;
    
    console.log('Price calculation:', { price, quantity, rentalDays, itemTotal });
    
    // Add add-ons to total if any
    const addons = item.addons || [];
    let addonsTotal = 0;
    if (addons.length > 0) {
        addons.forEach(addon => {
            addonsTotal += parseInt(addon.price);
        });
        itemTotal += addonsTotal;
        console.log('Add-ons total:', addonsTotal, 'New item total:', itemTotal);
    }
    
    // Create add-ons display if any
    let addonsDisplay = '';
    if (addons.length > 0) {
        addonsDisplay = '<div class="item-addons-mini">';
        addons.forEach(addon => {
            addonsDisplay += `<span class="addon-tag">${addon.name}</span>`;
        });
        addonsDisplay += '</div>';
    }
    
    // Ensure image has proper URL or fallback
    const imageUrl = item.image && item.image !== '' ? item.image : 'https://via.placeholder.com/60?text=Camera';
    console.log('Image URL:', imageUrl);
    
    div.innerHTML = `
        <div class="item-image" style="width: 60px; height: 60px; border-radius: 8px; overflow: hidden; background: #f3f4f6; flex-shrink: 0;">
            <img src="${imageUrl}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60?text=No+Image'" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div class="item-details" style="flex: 1; min-width: 0;">
            <div class="item-name" style="font-weight: 600; color: #1f2937; font-size: 14px; margin-bottom: 4px;">${item.name}</div>
            <div class="item-meta" style="font-size: 12px; color: #6b7280;">${rentalDays} day${rentalDays > 1 ? 's' : ''} × ${quantity} item${quantity > 1 ? 's' : ''}</div>
            ${addonsDisplay}
        </div>
        <div class="item-price" style="font-weight: 600; color: #764ba2; font-size: 14px; flex-shrink: 0;">₱${itemTotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
    `;
    
    // Don't override inline styles
    // div.style properties are already set above
    
    console.log('Order item HTML created:', div.outerHTML.substring(0, 200) + '...');
    
    return div;
}

// Update order summary
function updateOrderSummary(cart, subtotal) {
    const subtotalElement = document.getElementById('subtotal');
    const deliveryElement = document.getElementById('deliveryFee');
    const taxElement = document.getElementById('tax');
    const discountElement = document.getElementById('discount');
    const discountRow = document.getElementById('discountRow');
    const totalElement = document.getElementById('total');
    
    // Get delivery fee
    const pickupLocation = document.getElementById('pickupLocation');
    const deliveryFee = pickupLocation && pickupLocation.value === 'delivery' ? 150 : 0;
    
    // Calculate tax (2% on subtotal + delivery)
    const taxableAmount = subtotal + deliveryFee;
    const tax = taxableAmount * 0.02;
    
    // Calculate discount (example: 5% for orders over 5000)
    let discount = 0;
    if (subtotal > 5000) {
        discount = subtotal * 0.05;
    }
    
    const total = subtotal + deliveryFee + tax - discount;
    
    // Update display
    if (subtotalElement) {
        subtotalElement.textContent = `₱${subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    if (deliveryElement) {
        deliveryElement.textContent = deliveryFee === 0 ? 'Free' : `₱${deliveryFee.toFixed(2)}`;
    }
    
    if (taxElement) {
        taxElement.textContent = `₱${tax.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    
    if (discountElement && discountRow) {
        if (discount > 0) {
            discountRow.style.display = 'flex';
            discountElement.textContent = `-₱${discount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else {
            discountRow.style.display = 'none';
        }
    }
    
    if (totalElement) {
        totalElement.textContent = `₱${total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
}

// Initialize delivery option
function initializeDeliveryOption() {
    const pickupLocation = document.getElementById('pickupLocation');
    
    if (pickupLocation) {
        pickupLocation.addEventListener('change', function() {
            // Recalculate order summary when delivery option changes
            const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
            
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
            
            const subtotal = cart.reduce((total, item) => {
                const price = parseInt(item.price);
                const quantity = parseInt(item.quantity) || 1;
                let itemTotal = price * rentalDays * quantity;
                
                // Add add-ons
                const addons = item.addons || [];
                if (addons.length > 0) {
                    addons.forEach(addon => {
                        itemTotal += parseInt(addon.price);
                    });
                }
                
                return total + itemTotal;
            }, 0);
            
            updateOrderSummary(cart, subtotal);
        });
    }
}

// Initialize payment method switching
function initializePaymentMethods() {
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Hide all payment details
            document.querySelectorAll('.payment-details').forEach(detail => {
                detail.style.display = 'none';
            });
            
            // Show selected payment details
            const selectedDetails = document.getElementById(`${this.value}Details`);
            if (selectedDetails) {
                selectedDetails.style.display = 'block';
            }
        });
    });
}

// (Removed duplicate initializeDeliveryOption using incorrect 'cart' key)

// Initialize card number formatting
function initializeCardFormatting() {
    const cardNumberInput = document.getElementById('cardNumber');
    const expiryDateInput = document.getElementById('expiryDate');
    const cvvInput = document.getElementById('cvv');
    const gcashNumberInput = document.getElementById('gcashNumber');
    const paymayaNumberInput = document.getElementById('paymayaNumber');
    
    // Format card number (XXXX XXXX XXXX XXXX)
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Format expiry date (MM/YY)
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // Limit CVV to 3-4 digits
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
        });
    }
    
    // Format phone numbers for GCash (09XX XXX XXXX or +63 9XX XXX XXXX)
    if (gcashNumberInput) {
        gcashNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // If starts with 63, format as +63 9XX XXX XXXX
            if (value.startsWith('63')) {
                value = value.slice(0, 12);
                if (value.length > 2) {
                    value = '+63 ' + value.slice(2, 5) + (value.length > 5 ? ' ' + value.slice(5, 8) : '') + (value.length > 8 ? ' ' + value.slice(8, 12) : '');
                } else {
                    value = '+' + value;
                }
            } 
            // If starts with 0 or 9, format as 09XX XXX XXXX
            else {
                value = value.slice(0, 11);
                if (value.length > 4) {
                    value = value.slice(0, 4) + ' ' + value.slice(4, 7) + (value.length > 7 ? ' ' + value.slice(7, 11) : '');
                }
            }
            
            e.target.value = value;
        });
    }
    
    // Format phone numbers for PayMaya (same as GCash)
    if (paymayaNumberInput) {
        paymayaNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // If starts with 63, format as +63 9XX XXX XXXX
            if (value.startsWith('63')) {
                value = value.slice(0, 12);
                if (value.length > 2) {
                    value = '+63 ' + value.slice(2, 5) + (value.length > 5 ? ' ' + value.slice(5, 8) : '') + (value.length > 8 ? ' ' + value.slice(8, 12) : '');
                } else {
                    value = '+' + value;
                }
            } 
            // If starts with 0 or 9, format as 09XX XXX XXXX
            else {
                value = value.slice(0, 11);
                if (value.length > 4) {
                    value = value.slice(0, 4) + ' ' + value.slice(4, 7) + (value.length > 7 ? ' ' + value.slice(7, 11) : '');
                }
            }
            
            e.target.value = value;
        });
    }
}

// Initialize form validation
function initializeFormValidation() {
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    console.log('initializeFormValidation called, button found:', !!placeOrderBtn);
    
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Place Order button clicked!');
            
            if (validateCheckoutForm()) {
                console.log('Validation passed, processing order...');
                processOrder();
            } else {
                console.log('Validation failed, check errors above');
            }
        });
        console.log('Click event listener attached to Place Order button');
    } else {
        console.error('Place Order button not found!');
    }
}

// Validate checkout form
function validateCheckoutForm() {
    let isValid = true;
    const errors = [];
    
    // Contact Information
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    
    if (!email || !validateEmail(email)) {
        errors.push('Please enter a valid email address');
        isValid = false;
    }
    
    if (!phone) {
        errors.push('Please enter your phone number');
        isValid = false;
    }
    
    // Rental Details
    const pickupDate = document.getElementById('pickupDate').value;
    const returnDate = document.getElementById('returnDate').value;
    const pickupLocation = document.getElementById('pickupLocation').value;
    
    if (!pickupDate) {
        errors.push('Please select a pickup date');
        isValid = false;
    }
    
    if (!returnDate) {
        errors.push('Please select a return date');
        isValid = false;
    }
    
    if (!pickupLocation) {
        errors.push('Please select a pickup location');
        isValid = false;
    }
    
    if (pickupDate && returnDate && new Date(returnDate) <= new Date(pickupDate)) {
        errors.push('Return date must be after pickup date');
        isValid = false;
    }
    
    // Billing Information
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const region = document.getElementById('region').value.trim();
    const province = document.getElementById('province').value.trim();
    const city = document.getElementById('city').value.trim();
    const barangay = document.getElementById('barangay').value.trim();
    const address = document.getElementById('address').value.trim();
    const zipCode = document.getElementById('zipCode').value.trim();
    
    if (!firstName) {
        errors.push('Please enter your first name');
        isValid = false;
    }
    
    if (!lastName) {
        errors.push('Please enter your last name');
        isValid = false;
    }
    
    if (!region) {
        errors.push('Please select a region');
        isValid = false;
    }
    
    if (!province) {
        errors.push('Please select a province');
        isValid = false;
    }
    
    if (!city) {
        errors.push('Please select a city/municipality');
        isValid = false;
    }
    
    if (!barangay) {
        errors.push('Please enter your barangay');
        isValid = false;
    }
    
    if (!address) {
        errors.push('Please enter your street address');
        isValid = false;
    }
    
    if (!zipCode) {
        errors.push('Please enter your ZIP code');
        isValid = false;
    }
    
    // ID VERIFICATION - NEW
    const idType = document.getElementById('idType').value;
    const idNumber = document.getElementById('idNumber').value.trim();
    const idPhoto = document.getElementById('idPhoto').files[0];
    
    if (!idType) {
        errors.push('Please select an ID type');
        isValid = false;
    }
    
    if (!idNumber) {
        errors.push('Please enter your ID number');
        isValid = false;
    }
    
    if (!idPhoto) {
        errors.push('Please upload a photo of your ID');
        isValid = false;
    }
    
    // Payment Method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    
    if (!paymentMethod) {
        errors.push('Please select a payment method');
        isValid = false;
    } else {
        // Validate payment-specific fields
        if (paymentMethod.value === 'card') {
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            const cardName = document.getElementById('cardName').value.trim();
            
            if (!cardNumber || cardNumber.length < 16) {
                errors.push('Please enter a valid card number');
                isValid = false;
            }
            
            if (!expiryDate || !validateExpiryDate(expiryDate)) {
                errors.push('Please enter a valid expiry date (MM/YY)');
                isValid = false;
            }
            
            if (!cvv || cvv.length !== 3) {
                errors.push('Please enter a valid CVV');
                isValid = false;
            }
            
            if (!cardName) {
                errors.push('Please enter the cardholder name');
                isValid = false;
            }
        } else if (paymentMethod.value === 'gcash') {
            const gcashNumber = document.getElementById('gcashNumber').value.trim();
            
            if (!gcashNumber || gcashNumber.length < 10) {
                errors.push('Please enter a valid GCash mobile number');
                isValid = false;
            }
        } else if (paymentMethod.value === 'paymaya') {
            const paymayaNumber = document.getElementById('paymayaNumber').value.trim();
            
            if (!paymayaNumber || paymayaNumber.length < 10) {
                errors.push('Please enter a valid PayMaya mobile number');
                isValid = false;
            }
        } else if (paymentMethod.value === 'cod') {
            // COD doesn't require additional validation
        }
    }
    
    // Terms & Conditions - Rental Agreement
    const termsCheckbox = document.getElementById('agreeTerms');
    
    if (!termsCheckbox || !termsCheckbox.checked) {
        errors.push('Please accept the Rental Agreement Contract');
        isValid = false;
    }
    
    // Check if cart is empty
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (cart.length === 0) {
        errors.push('Your cart is empty');
        isValid = false;
    }
    
    // Display errors
    if (!isValid) {
        console.error('Validation errors:', errors);
        alert('Please fix the following errors:\n\n' + errors.join('\n'));
    } else {
        console.log('All validation checks passed!');
    }
    
    return isValid;
}

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate expiry date
function validateExpiryDate(expiry) {
    if (!expiry.includes('/')) return false;
    
    const [month, year] = expiry.split('/');
    const monthNum = parseInt(month);
    const yearNum = parseInt('20' + year);
    
    if (monthNum < 1 || monthNum > 12) return false;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    
    if (yearNum < currentYear) return false;
    if (yearNum === currentYear && monthNum < currentMonth) return false;
    
    return true;
}

// Process order
function processOrder() {
    // Show processing state
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const originalText = placeOrderBtn.innerHTML;
    placeOrderBtn.disabled = true;
    placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking availability...';
    
    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Check stock availability via API
    fetch('/api/inventory')
        .then(res => res.json())
        .then(data => {
            const inventory = data.inventory || [];
            const unavailableItems = [];
            
            // Check each cart item against inventory
            cartItems.forEach(cartItem => {
                const invItem = inventory.find(i => 
                    i.name.toLowerCase().includes(cartItem.name.toLowerCase()) ||
                    cartItem.name.toLowerCase().includes(i.name.toLowerCase())
                );
                
                if (!invItem) {
                    unavailableItems.push(`${cartItem.name} (not found in inventory)`);
                } else if (invItem.stock < (cartItem.quantity || 1)) {
                    unavailableItems.push(`${cartItem.name} (only ${invItem.stock} available, you need ${cartItem.quantity || 1})`);
                }
            });
            
            // If any items are out of stock, show error
            if (unavailableItems.length > 0) {
                placeOrderBtn.disabled = false;
                placeOrderBtn.innerHTML = originalText;
                alert('Sorry, some items are out of stock:\\n\\n' + unavailableItems.join('\\n') + '\\n\\nPlease update your cart and try again.');
                return;
            }
            
            // Stock is available, proceed with order
            placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing order...';
            submitOrder();
        })
        .catch(err => {
            console.error('Failed to check inventory:', err);
            // Continue anyway if inventory check fails
            placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing order...';
            submitOrder();
        });
}

function submitOrder() {
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const originalText = placeOrderBtn.innerHTML;
    
    // Collect all form data
    const paymentMethodElement = document.querySelector('input[name="paymentMethod"]:checked');
    
    const orderData = {
        // Contact Info
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        
        // Rental Details
        pickupDate: document.getElementById('pickupDate').value,
        returnDate: document.getElementById('returnDate').value,
        pickupLocation: document.getElementById('pickupLocation').value,
        
        // Billing Info
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        region: document.getElementById('region').value,
        province: document.getElementById('province').value,
        city: document.getElementById('city').value,
        barangay: document.getElementById('barangay').value,
        address: document.getElementById('address').value.trim(),
        zipCode: document.getElementById('zipCode').value.trim(),
        
        // ID Verification - NEW
        idType: document.getElementById('idType').value,
        idNumber: document.getElementById('idNumber').value.trim(),
        idVerified: false, // Mark as pending verification
        
        // Insurance - NEW
        damageInsurance: document.getElementById('damageInsurance')?.checked || false,
        fullInsurance: document.getElementById('fullInsurance')?.checked || false,
        
        // Payment Method
        paymentMethod: paymentMethodElement.value,
        
        // Additional Notes
        notes: document.getElementById('additionalNotes')?.value.trim() || '',
        
        // Cart Items
        items: JSON.parse(localStorage.getItem('cartItems')) || [],
        
        // Order Summary
        subtotal: document.getElementById('subtotal').textContent,
        deliveryFee: document.getElementById('deliveryFee').textContent,
        tax: document.getElementById('tax').textContent,
        discount: document.getElementById('discount').textContent,
        total: document.getElementById('total').textContent,
        
        // Order Date
        orderDate: new Date().toISOString(),
        orderNumber: 'ORD-' + Date.now(),
        status: 'pending' // Will be updated based on payment method
    };
    
    // Add payment-specific data and update status
    if (orderData.paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        orderData.cardLast4 = cardNumber.slice(-4); // Last 4 digits only
        orderData.cardName = document.getElementById('cardName').value.trim();
        orderData.paymentStatus = 'paid';
        orderData.status = 'confirmed'; // Auto-confirm for paid orders
    } else if (orderData.paymentMethod === 'gcash') {
        orderData.gcashNumber = document.getElementById('gcashNumber').value.trim();
        orderData.paymentStatus = 'paid';
        orderData.status = 'confirmed'; // Auto-confirm for paid orders
    } else if (orderData.paymentMethod === 'paymaya') {
        orderData.paymayaNumber = document.getElementById('paymayaNumber').value.trim();
        orderData.paymentStatus = 'paid';
        orderData.status = 'confirmed'; // Auto-confirm for paid orders
    } else if (orderData.paymentMethod === 'cod') {
        orderData.paymentStatus = 'pending';
        orderData.status = 'pending'; // Keep pending for COD
    }
    
    // Send order to server
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const pickupDate = new Date(orderData.pickupDate).getTime() / 1000; // Convert to Unix timestamp
    const returnDate = new Date(orderData.returnDate).getTime() / 1000;
    
    const serverPayload = {
        items: cartItems.map(item => ({
            product_id: item.id,
            name: item.name,
            quantity: item.quantity || 1,
            price: parseFloat(item.price) || 0
        })),
        total: parseFloat(orderData.total.replace(/[^\d.-]/g, '')),
        start_date: pickupDate,
        end_date: returnDate,
        payment_method: orderData.paymentMethod,
        shipping_method: orderData.pickupLocation,
        security_deposit_status: null,
        status: orderData.status === 'confirmed' ? 'confirmed' : 'new' // Use confirmed for paid orders
    };
    
    fetch('/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(serverPayload)
    })
    .then(response => {
        if (!response.ok) {
            console.error('Server response not OK:', response.status, response.statusText);
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.ok || data.order) {
            console.log('Order saved to server:', data);
            
            // Also save to localStorage for bookings page
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(orderData);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Clear cart
            localStorage.removeItem('cartItems');
            localStorage.removeItem('selectedPickupDate');
            localStorage.removeItem('selectedReturnDate');
            
            // Reset button
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = originalText;
            
            // Show success message with payment method specific info
            let successMessage = `Order #${orderData.orderNumber} placed successfully!\n\n`;
        
        if (orderData.paymentMethod === 'card') {
            successMessage += 'Your card has been charged. You will receive a confirmation email shortly.';
        } else if (orderData.paymentMethod === 'gcash') {
            successMessage += 'Please check your GCash app for the payment request.';
        } else if (orderData.paymentMethod === 'paymaya') {
            successMessage += 'You will be redirected to PayMaya to complete payment.';
        } else if (orderData.paymentMethod === 'bank') {
            successMessage += 'Please transfer to the bank account provided and send proof of payment.';
        } else if (orderData.paymentMethod === 'cod') {
            successMessage += 'Payment will be collected when you pick up your items.';
        }
            
            successMessage += '\n\nWe will contact you shortly to confirm your booking.';
            
            alert(successMessage);
            
            // Redirect to bookings page
            window.location.href = 'bookings.html';
        } else {
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = originalText;
            alert('Failed to place order. Please try again.');
        }
    })
    .catch(error => {
        console.error('Order submission error:', error);
        placeOrderBtn.disabled = false;
        placeOrderBtn.innerHTML = originalText;
        
        let errorMessage = 'Error placing order.\n\n';
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage += '⚠️ Cannot connect to server.\n\nPlease make sure:\n1. The Flask server is running (python3 first_app.py)\n2. You\'re accessing the page through http://127.0.0.1:5001/checkout.html\n   (NOT by opening the file directly)\n\nCurrent URL: ' + window.location.href;
        } else {
            errorMessage += error.message + '\n\nPlease check the browser console (F12) for more details.';
        }
        
        alert(errorMessage);
    });
}

// Initialize file upload
function initializeFileUpload() {
    const fileUploadArea = document.querySelector('.file-upload-area');
    const fileInput = document.getElementById('idPhoto');
    const fileNameDisplay = document.getElementById('idPhotoName');
    
    if (fileUploadArea && fileInput) {
        // Click to upload
        fileUploadArea.addEventListener('click', function() {
            fileInput.click();
        });
        
        // File selected
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                fileNameDisplay.textContent = '✓ ' + file.name + ' (' + (file.size / 1024).toFixed(2) + ' KB)';
                fileNameDisplay.style.color = '#059669';
            }
        });
        
        // Drag and drop
        fileUploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#7c3aed';
            fileUploadArea.style.background = '#fef5ff';
        });
        
        fileUploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#d1d5db';
            fileUploadArea.style.background = '#fafbfc';
        });
        
        fileUploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            fileUploadArea.style.borderColor = '#d1d5db';
            fileUploadArea.style.background = '#fafbfc';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                const file = files[0];
                fileNameDisplay.textContent = '✓ ' + file.name + ' (' + (file.size / 1024).toFixed(2) + ' KB)';
                fileNameDisplay.style.color = '#059669';
            }
        });
    }
}

// Initialize insurance selection
function initializeInsuranceSelection() {
    const damageCheckbox = document.getElementById('damageInsurance');
    const fullCheckbox = document.getElementById('fullInsurance');
    
    const updateInsuranceCost = function() {
        const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
        const pickupDate = localStorage.getItem('selectedPickupDate');
        const returnDate = localStorage.getItem('selectedReturnDate');
        
        // Calculate rental days
        let rentalDays = 7;
        if (pickupDate && returnDate) {
            const pickup = new Date(pickupDate);
            const returnD = new Date(returnDate);
            const timeDiff = returnD.getTime() - pickup.getTime();
            rentalDays = Math.max(Math.ceil(timeDiff / (1000 * 60 * 60 * 24)), 1);
        }
        
        // Calculate subtotal
        const subtotal = cart.reduce((total, item) => {
            const price = parseInt(item.price);
            const quantity = parseInt(item.quantity) || 1;
            let itemTotal = price * rentalDays * quantity;
            
            const addons = item.addons || [];
            if (addons.length > 0) {
                addons.forEach(addon => {
                    itemTotal += parseInt(addon.price);
                });
            }
            
            return total + itemTotal;
        }, 0);
        
        // Get other charges
        const pickupLocation = document.getElementById('pickupLocation');
        const deliveryFee = pickupLocation && pickupLocation.value === 'delivery' ? 150 : 0;
        const taxableAmount = subtotal + deliveryFee;
        const tax = taxableAmount * 0.02;
        let discount = 0;
        if (subtotal > 5000) {
            discount = subtotal * 0.05;
        }
        
        // Add insurance costs
        let insuranceCost = 0;
        if (damageCheckbox && damageCheckbox.checked) {
            insuranceCost += 200;
        }
        if (fullCheckbox && fullCheckbox.checked) {
            insuranceCost += 500;
        }
        
        const total = subtotal + deliveryFee + tax + insuranceCost - discount;
        
        // Update total display
        const totalElement = document.getElementById('total');
        if (totalElement) {
            totalElement.textContent = `₱${total.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    };
    
    if (damageCheckbox) {
        damageCheckbox.addEventListener('change', updateInsuranceCost);
    }
    
    if (fullCheckbox) {
        fullCheckbox.addEventListener('change', updateInsuranceCost);
    }
}
// End of checkout.js
