// COMPARE FUNCTIONALITY

// Compare storage
let compareList = JSON.parse(localStorage.getItem('compareList')) || [];

// Camera database with detailed specs
const cameraDatabase = {
    // SMARTPHONES
    'iphone-16-pro-max': {
        id: 'iphone-16-pro-max',
        name: 'iPhone 16 Pro Max (256GB)',
        category: 'Smartphone',
        price: 1499,
        image: 'https://powermaccenter.com/cdn/shop/files/iPhone_16_Pro_Max_Natural_Titanium_PDP_Image_Position_1__en-WW_8b820b11-36e5-4147-af03-879b6cebfdfd_720x.jpg?v=1726238578',
        specs: {
            sensor: '48MP Main + 48MP Ultra Wide',
            video: '4K 120fps ProRes',
            screen: '6.9" Super Retina XDR',
            storage: '256GB',
            battery: 'Up to 33 hours video',
            features: 'A18 Pro, Camera Control'
        }
    },
    'iphone-14-pro': {
        id: 'iphone-14-pro',
        name: 'iPhone 14 Pro (128GB)',
        category: 'Smartphone',
        price: 899,
        image: 'https://powermaccenter.com/cdn/shop/files/iPhone_14_Pro_Silver_PDP_Image_Position-1a__en-US_0e607d08-2dff-4f8b-8a40-7f5da49434b9.jpg?v=1705403393',
        specs: {
            sensor: '48MP Main + 12MP Ultra Wide',
            video: '4K Cinematic Mode',
            screen: '6.1" ProMotion Display',
            storage: '128GB',
            battery: 'Up to 23 hours video',
            features: 'Dynamic Island, Always-On Display'
        }
    },
    'iphone-13-pro-max': {
        id: 'iphone-13-pro-max',
        name: 'iPhone 13 Pro Max (128GB Sierra Blue)',
        category: 'Smartphone',
        price: 699,
        image: 'https://compasia.com.ph/cdn/shop/files/iphone-13-pro-max-328530_800x.png?v=1737456763',
        specs: {
            sensor: '12MP Triple Camera',
            video: '4K ProRes',
            screen: '6.7" Super Retina XDR',
            storage: '128GB',
            battery: 'Up to 28 hours video',
            features: 'ProMotion, Macro Photography'
        }
    },
    'iphone-13-pro': {
        id: 'iphone-13-pro',
        name: 'iPhone 13 Pro (128GB)',
        category: 'Smartphone',
        price: 1200,
        image: 'https://powermaccenter.com/cdn/shop/files/iPhone_13_Midnight_PDP_Image_Position-1A__en-US_823x__1_-removebg-preview.png?v=1754528364',
        specs: {
            sensor: '12MP Triple Camera',
            video: '4K ProRes',
            screen: '6.1" Super Retina XDR',
            storage: '128GB',
            battery: 'Up to 22 hours video',
            features: 'Cinematic Mode, ProRAW'
        }
    },
    'samsung-s23-ultra': {
        id: 'samsung-s23-ultra',
        name: 'Galaxy S23 Ultra',
        category: 'Smartphone',
        price: 1499,
        image: 'https://images.samsung.com/is/image/samsung/p6pim/ph/2302/gallery/ph-galaxy-s23-s918-sm-s918bzkcphl-534856194?$684_547_PNG$',
        specs: {
            sensor: '200MP Quad Camera',
            video: '8K @ 30fps',
            screen: '6.8" Dynamic AMOLED',
            storage: '256GB',
            battery: '5000mAh',
            features: 'S Pen, 100x Zoom'
        }
    },
    'samsung-s22-ultra': {
        id: 'samsung-s22-ultra',
        name: 'Galaxy S22 Ultra',
        category: 'Smartphone',
        price: 1800,
        image: 'https://images.samsung.com/ph/smartphones/galaxy-s22-ultra/buy/S22_Ultra_ProductKV_Green_MO.jpg',
        specs: {
            sensor: '108MP Quad Camera',
            video: '8K @ 24fps',
            screen: '6.8" Dynamic AMOLED',
            storage: '256GB',
            battery: '5000mAh',
            features: 'S Pen, 100x Zoom'
        }
    },
    'samsung-z-flip-5': {
        id: 'samsung-z-flip-5',
        name: 'Galaxy Z Flip 5',
        category: 'Smartphone',
        price: 1299,
        image: 'https://images.samsung.com/is/image/samsung/p6pim/za/2307/gallery/za-galaxy-z-flip5-f731-sm-f731bzeaafa-537230624?$684_547_PNG$',
        specs: {
            sensor: '12MP Dual Camera',
            video: '4K @ 60fps',
            screen: '6.7" Foldable AMOLED',
            storage: '256GB',
            battery: '3700mAh',
            features: 'FlexCam, Flip Cover Display'
        }
    },
    'samsung-z-fold-5': {
        id: 'samsung-z-fold-5',
        name: 'Galaxy Z Fold 5',
        category: 'Smartphone',
        price: 2000,
        image: 'https://www.kimstore.com/cdn/shop/files/samsung-galaxy-z-fold-5-12gb512gb-cream-tw.png?v=1758606197',
        specs: {
            sensor: '50MP Triple Camera',
            video: '8K @ 30fps',
            screen: '7.6" Foldable AMOLED',
            storage: '512GB',
            battery: '4400mAh',
            features: 'S Pen Support, Multi-Window'
        }
    },
    
    // COMPACT CAMERAS
    'canon-g7x-mark-iii': {
        id: 'canon-g7x-mark-iii',
        name: 'Canon G7X Mark III',
        category: 'Compact',
        price: 499,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvgk1L9bXg83yoruPuQ03jXEY8DhFAm0N6Qw&s',
        specs: {
            sensor: '20.1MP 1" CMOS',
            video: '4K @ 30fps',
            screen: '3" Tilting Touchscreen',
            storage: 'SD Card',
            battery: '235 shots',
            features: 'Live Streaming, WiFi'
        }
    },
    'sony-zv-1': {
        id: 'sony-zv-1',
        name: 'Sony ZV-1',
        category: 'Compact',
        price: 599,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN8_TKqPDCEJWr5aaOFmYBiF5LcGJ-28RQJQ&s',
        specs: {
            sensor: '20.1MP 1" Exmor RS',
            video: '4K HDR',
            screen: '3" Vari-angle',
            storage: 'SD Card',
            battery: '260 shots',
            features: 'Product Showcase, Bokeh Switch'
        }
    },
    'sony-zv-1-ii': {
        id: 'sony-zv-1-ii',
        name: 'Sony ZV-1 II',
        category: 'Compact',
        price: 850,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD6HEXkpSWxcqJMsyX_YyUt5JJwXvpvZAUlg&s',
        specs: {
            sensor: '20.1MP 1" Exmor RS',
            video: '4K 60fps',
            screen: '3" Vari-angle',
            storage: 'SD Card',
            battery: '305 shots',
            features: 'Ultra-Wide Lens, AI Subject Recognition'
        }
    },
    'fujifilm-x100vi': {
        id: 'fujifilm-x100vi',
        name: 'Fujifilm X100VI',
        category: 'Compact',
        price: 699,
        image: 'https://fujifilm-x.com/wp-content/uploads/2024/02/X100VI_main.png',
        specs: {
            sensor: '40.2MP X-Trans CMOS 5',
            video: '6.2K @ 30fps',
            screen: '3" Tilting Touchscreen',
            storage: 'SD Card',
            battery: '310 shots',
            features: 'Film Simulations, Hybrid Viewfinder'
        }
    },
    
    // MIRRORLESS CAMERAS
    'canon-eos-m50-mark-ii': {
        id: 'canon-eos-m50-mark-ii',
        name: 'Canon EOS M50 Mark II',
        category: 'Mirrorless',
        price: 499,
        image: 'https://urbangiz.com/cdn/shop/products/1_33daa636-9576-4c78-9a88-c45603f760c5.png?v=1678337750',
        specs: {
            sensor: '24.1MP APS-C CMOS',
            video: '4K @ 24fps',
            screen: '3" Vari-angle Touchscreen',
            storage: 'SD Card',
            battery: '305 shots',
            features: 'Dual Pixel AF, Eye Detection'
        }
    },
    'sony-a7iii': {
        id: 'sony-a7iii',
        name: 'Sony A7III',
        category: 'Mirrorless',
        price: 999,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSu5Ph0Hq_p4nIQrk8IEPowhv4-s_d464MuJg&s',
        specs: {
            sensor: '24.2MP Full-Frame BSI',
            video: '4K HDR',
            screen: '3" Tilting Touchscreen',
            storage: 'Dual SD UHS-II',
            battery: '710 shots',
            features: 'Eye AF, 10fps, 5-axis IBIS'
        }
    },
    'fujifilm-xt30-ii': {
        id: 'fujifilm-xt30-ii',
        name: 'Fujifilm X-T30 II',
        category: 'Mirrorless',
        price: 899,
        image: 'https://fujifilm-x.com/wp-content/uploads/2021/09/X-T30-II_Black_Front.png',
        specs: {
            sensor: '26.1MP X-Trans CMOS 4',
            video: '4K @ 30fps',
            screen: '3" Tilting Touchscreen',
            storage: 'SD Card',
            battery: '380 shots',
            features: 'Film Simulations, Face/Eye AF'
        }
    },
    'nikon-z50': {
        id: 'nikon-z50',
        name: 'Nikon Z50',
        category: 'Mirrorless',
        price: 799,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYLVAx8N8C4rPMFKWz1hwNXGEiIrk2tBYxOQ&s',
        specs: {
            sensor: '20.9MP DX CMOS',
            video: '4K @ 30fps',
            screen: '3.2" Tilting Touchscreen',
            storage: 'SD Card',
            battery: '320 shots',
            features: 'Eye Detection AF, 11fps'
        }
    },
    
    // ACTION CAMERAS
    'gopro-hero-13': {
        id: 'gopro-hero-13',
        name: 'GoPro HERO 13 Black',
        category: 'Action Camera',
        price: 499,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3IZqG7EdmnRKoHX_t0YYrffJ02-WEBgkz7A&s',
        specs: {
            sensor: '27MP',
            video: '5.3K60 / 4K120',
            screen: '2.27" Touchscreen',
            storage: 'microSD up to 512GB',
            battery: 'Enduro 1720mAh',
            features: 'HyperSmooth 6.0, Waterproof'
        }
    },
    'dji-osmo-action-4': {
        id: 'dji-osmo-action-4',
        name: 'DJI Osmo Action 4',
        category: 'Action Camera',
        price: 550,
        image: 'https://dji-official-fe.djicdn.com/dps/89fc2199b28b27ae17d7ac3fc084c2d1.png',
        specs: {
            sensor: '1/1.3" CMOS',
            video: '4K 120fps',
            screen: 'Dual Touchscreens',
            storage: 'microSD up to 256GB',
            battery: '1770mAh',
            features: 'RockSteady 3.0, 18m Waterproof'
        }
    },
    'dji-mini-4-pro': {
        id: 'dji-mini-4-pro',
        name: 'DJI Mini 4 Pro',
        category: 'Drone',
        price: 1199,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ74FLrLGWqTM8f-5mZd1RhbdWId970JCyGMA&s',
        specs: {
            sensor: '1/1.3" CMOS 48MP',
            video: '4K 100fps HDR',
            screen: 'RC Controller',
            storage: 'microSD',
            battery: '34min flight time',
            features: 'Omnidirectional Obstacle Sensing'
        }
    },
    'dji-air-3': {
        id: 'dji-air-3',
        name: 'DJI Air 3',
        category: 'Drone',
        price: 1800,
        image: 'https://dji-official-fe.djicdn.com/dps/a8c0fbd6fba82e3f3c89479a56c38de0.png',
        specs: {
            sensor: 'Dual 48MP Wide & Tele',
            video: '4K 100fps HDR',
            screen: 'RC-N2 Controller',
            storage: '8GB Internal + microSD',
            battery: '46min flight time',
            features: 'ActiveTrack 5.0, Waypoints'
        }
    },
    
    // MORE ACTION CAMERAS
    'dji-osmo-pocket-3': {
        id: 'dji-osmo-pocket-3',
        name: 'DJI Osmo Pocket 3 (Creator Combo)',
        category: 'Action Camera',
        price: 599,
        image: 'https://www.gizmocentral.com/cdn/shop/files/1_35e44149-4d6c-4021-aee6-ff7ab501baf8_1200x1200.jpg?v=1698398653',
        specs: {
            sensor: '1" CMOS',
            video: '4K 120fps',
            screen: '2" Rotating Touchscreen',
            storage: 'microSD',
            battery: '166min recording',
            features: '3-Axis Gimbal, Face Tracking'
        }
    },
    'insta360-x5': {
        id: 'insta360-x5',
        name: 'Insta360 X5 (Bullet Time Bundle)',
        category: 'Action Camera',
        price: 499,
        image: 'https://hypehub.com.ph/wp-content/uploads/2023/10/X5.jpg',
        specs: {
            sensor: 'Twin 1/2" Sensors',
            video: '5.7K 360° @ 30fps',
            screen: '2.2" Touchscreen',
            storage: 'microSD',
            battery: '81min recording',
            features: 'FlowState, Invisible Selfie Stick'
        }
    },
    
    // INSTANT/FILM
    'fujifilm-instax-sq1': {
        id: 'fujifilm-instax-sq1',
        name: 'Fujifilm Instax Square SQ1',
        category: 'Instant/Film',
        price: 299,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP1FpZx5p5y_Px_l1cmtXkxq9aKdIVOP2I1w&s',
        specs: {
            sensor: 'Instant Film',
            video: 'N/A',
            screen: 'N/A',
            storage: 'Instax Square Film',
            battery: '300 shots',
            features: 'Auto Exposure, Selfie Mode'
        }
    },
    
    // OTHERS
    'rayban-meta': {
        id: 'rayban-meta',
        name: 'Ray-Ban Meta (Wayfarer)',
        category: 'Other',
        price: 399,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSguDKRUIbKJLIAkRt5sVdeNbXrrFeFg5YOjA&s',
        specs: {
            sensor: '12MP Ultra-Wide',
            video: '1080p @ 60fps',
            screen: 'N/A (Audio Only)',
            storage: '32GB Internal',
            battery: 'Up to 4 hours',
            features: 'Meta AI, Open-Ear Audio'
        }
    }
};

// Initialize compare page
function initComparePage() {
    updateCompareDisplay();
    
    // Clear all button
    const clearBtn = document.getElementById('clearCompareBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllCompare);
    }
}

// Add to compare
function addToCompare(cameraId) {
    if (compareList.includes(cameraId)) {
        // Remove if already in compare
        removeFromCompare(cameraId);
        return false;
    }
    
    if (compareList.length >= 4) {
        showNotification('You can only compare up to 4 cameras', 'warning');
        return false;
    }
    
    compareList.push(cameraId);
    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCompareCount();
    showNotification('Camera added to compare!', 'success');
    return true;
}

// Remove from compare
function removeFromCompare(cameraId) {
    compareList = compareList.filter(id => id !== cameraId);
    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCompareCount();
    updateCompareDisplay();
    showNotification('Camera removed from compare', 'info');
}

// Clear all compare
function clearAllCompare() {
    compareList = [];
    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCompareCount();
    updateCompareDisplay();
    showNotification('Compare list cleared', 'info');
}

// Update compare count badge
function updateCompareCount() {
    const compareCount = document.getElementById('compareCount');
    if (compareCount) {
        compareCount.textContent = compareList.length;
        compareCount.style.display = compareList.length > 0 ? 'flex' : 'none';
    }
}

// Update compare display (for compare.html page)
function updateCompareDisplay() {
    const compareEmpty = document.getElementById('compareEmpty');
    const compareGrid = document.getElementById('compareGrid');
    const compareTableContainer = document.getElementById('compareTableContainer');
    const compareActions = document.getElementById('compareActions');
    
    if (!compareGrid) return; // Not on compare page
    
    if (compareList.length === 0) {
        compareEmpty.style.display = 'block';
        compareGrid.style.display = 'none';
        compareTableContainer.style.display = 'none';
        compareActions.style.display = 'none';
    } else {
        compareEmpty.style.display = 'none';
        compareGrid.style.display = 'grid';
        compareTableContainer.style.display = 'block';
        compareActions.style.display = 'flex';
        
        renderCompareCards();
        renderCompareTable();
    }
}

// Render compare cards
function renderCompareCards() {
    const compareGrid = document.getElementById('compareGrid');
    if (!compareGrid) return;
    
    compareGrid.innerHTML = '';
    
    compareList.forEach(cameraId => {
        const camera = cameraDatabase[cameraId];
        if (!camera) return;
        
        const card = document.createElement('div');
        card.className = 'compare-card';
        card.innerHTML = `
            <button class="compare-card-remove" onclick="removeFromCompare('${camera.id}')">
                <i class="fas fa-times"></i>
            </button>
            <div class="compare-card-image">
                <img src="${camera.image}" alt="${camera.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<i class=\\'fas fa-camera\\' style=\\'font-size:60px;color:#ccc;\\'></i>';">
            </div>
            <div class="compare-card-info">
                <p class="compare-card-category">${camera.category}</p>
                <h3 class="compare-card-name">${camera.name}</h3>
                <p class="compare-card-price">₱${camera.price.toLocaleString()}/day</p>
            </div>
        `;
        
        compareGrid.appendChild(card);
    });
}

// Render compare table
function renderCompareTable() {
    const tableBody = document.getElementById('compareTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Header row with images
    const headerRow = document.createElement('tr');
    headerRow.className = 'table-header-row';
    headerRow.innerHTML = '<th></th>';
    
    compareList.forEach(cameraId => {
        const camera = cameraDatabase[cameraId];
        if (camera) {
            headerRow.innerHTML += `
                <th>
                    <img src="${camera.image}" alt="${camera.name}" class="table-image">
                    <div style="margin-top: 10px;">${camera.name}</div>
                </th>
            `;
        }
    });
    tableBody.appendChild(headerRow);
    
    // Price row
    addCompareRow(tableBody, 'Price', compareList.map(id => {
        const camera = cameraDatabase[id];
        return camera ? `₱${camera.price.toLocaleString()}/day` : 'N/A';
    }));
    
    // Category row
    addCompareRow(tableBody, 'Category', compareList.map(id => {
        const camera = cameraDatabase[id];
        return camera ? camera.category : 'N/A';
    }));
    
    // Sensor row
    addCompareRow(tableBody, 'Sensor', compareList.map(id => {
        const camera = cameraDatabase[id];
        return camera?.specs?.sensor || 'N/A';
    }));
    
    // Video row
    addCompareRow(tableBody, 'Video', compareList.map(id => {
        const camera = cameraDatabase[id];
        return camera?.specs?.video || 'N/A';
    }));
    
    // Screen row
    addCompareRow(tableBody, 'Screen', compareList.map(id => {
        const camera = cameraDatabase[id];
        return camera?.specs?.screen || 'N/A';
    }));
    
    // Storage row
    addCompareRow(tableBody, 'Storage', compareList.map(id => {
        const camera = cameraDatabase[id];
        return camera?.specs?.storage || 'N/A';
    }));
    
    // Battery row
    addCompareRow(tableBody, 'Battery', compareList.map(id => {
        const camera = cameraDatabase[id];
        return camera?.specs?.battery || 'N/A';
    }));
    
    // Features row
    addCompareRow(tableBody, 'Features', compareList.map(id => {
        const camera = cameraDatabase[id];
        return camera?.specs?.features || 'N/A';
    }));
}

// Helper function to add compare row
function addCompareRow(tableBody, label, values) {
    const row = document.createElement('tr');
    row.innerHTML = `<th>${label}</th>`;
    
    values.forEach(value => {
        row.innerHTML += `<td>${value}</td>`;
    });
    
    tableBody.appendChild(row);
}

// Check if camera is in compare list
function isInCompareList(cameraId) {
    return compareList.includes(cameraId);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCompareCount();
    
    // Initialize compare page if we're on it
    if (document.getElementById('compareGrid')) {
        initComparePage();
    }
});

// Notification function (if not already in common.js)
function showNotification(message, type = 'info') {
    if (window.showNotification) {
        window.showNotification(message, type);
        return;
    }
    
    // Fallback notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#667eea'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
