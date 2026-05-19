// Product Detail Page Script

// State Management
let currentImageIndex = 0;
let selectedQuantity = 1;
let selectedDuration = 0; // will be calculated
let selectedStartDate = null;
let selectedEndDate = null;
let selectedTimeSlot = null;
let currentMonth = new Date();

// Product-specific image galleries
const productImages = {
    'iphone-16-pro-max': [
        'https://powermaccenter.com/cdn/shop/files/iPhone_16_Pro_Max_Natural_Titanium_PDP_Image_Position_1__en-WW_8b820b11-36e5-4147-af03-879b6cebfdfd_720x.jpg?v=1726238578',
        'https://istore.ph/cdn/shop/files/iPhone_16_Pro_Max_Black_Titanium_PDP_Image_Position_1a_Black_Titanium_Color__ROSA-EN.jpg?v=1728460045',
        'https://www.techadvisor.com/wp-content/uploads/2024/10/iPhone-16-Pro-Max-Being-Held-in-Hand-4.jpg?quality=50&strip=all',
        'https://s.yimg.com/ny/api/res/1.2/jr50_ZSNrWdBnjQ34JMhqg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTE2MDA7aD05MDA7cT01MA--/https://s.yimg.com/os/creatr-uploaded-images/2024-09/b9cdc4d0-756d-11ef-b5e6-49e7b9de5265'
    ],
    'iphone-14-pro': [
        'https://powermaccenter.com/cdn/shop/files/iPhone_14_Pro_Silver_PDP_Image_Position-1a__en-US_0e607d08-2dff-4f8b-8a40-7f5da49434b9.jpg?v=1705403393',
        'https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-deep-purple-220907_inline.jpg.large.jpg',
        'https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-gold-220907_inline.jpg.large.jpg',
        'https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-space-black-220907_inline.jpg.large.jpg'
    ],
    'iphone-13-pro-max': [
        'https://images.unsplash.com/photo-1632633728024-e1fd4bef561a?w=800',
        'https://images.unsplash.com/photo-1632661674928-015af94cd8d5?w=800',
        'https://images.unsplash.com/photo-1635161966765-a5f6d3f2ed25?w=800',
        'https://images.unsplash.com/photo-1632633728053-e1a16f1d3b1e?w=800'
    ],
    'iphone-13-pro': [
        'https://images.unsplash.com/photo-1632661674740-e13ba96f4f5c?w=800',
        'https://images.unsplash.com/photo-1632633728024-e1fd4bef561a?w=800',
        'https://images.unsplash.com/photo-1635161966765-a5f6d3f2ed25?w=800',
        'https://images.unsplash.com/photo-1632661674928-015af94cd8d5?w=800'
    ],
    'samsung-s23-ultra': [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
        'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800'
    ],
    'samsung-s22-ultra': [
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800',
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800',
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'
    ],
    'samsung-z-flip-5': [
        'https://images.unsplash.com/photo-1592286927505-b7e6ab36161d?w=800',
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800',
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800',
        'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800'
    ],
    'samsung-z-fold-5': [
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800',
        'https://images.unsplash.com/photo-1592286927505-b7e6ab36161d?w=800',
        'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'
    ],
    'canon-g7x-mark-iii': [
        'https://images.unsplash.com/photo-1606941369253-f04339d78e35?w=800',
        'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
        'https://images.unsplash.com/photo-1606980620860-be9a0f750e39?w=800',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800'
    ],
    'sony-zv-1': [
        'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
        'https://images.unsplash.com/photo-1606941369253-f04339d78e35?w=800',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
        'https://images.unsplash.com/photo-1606980620860-be9a0f750e39?w=800'
    ],
    'sony-zv-1-ii': [
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
        'https://images.unsplash.com/photo-1606941369253-f04339d78e35?w=800',
        'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
        'https://images.unsplash.com/photo-1606980620860-be9a0f750e39?w=800'
    ],
    'fujifilm-x100vi': [
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
        'https://images.unsplash.com/photo-1606941369253-f04339d78e35?w=800',
        'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800'
    ],
    'canon-eos-m50-mark-ii': [
        'https://images.unsplash.com/photo-1606941369253-f04339d78e35?w=800',
        'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
        'https://images.unsplash.com/photo-1606980620860-be9a0f750e39?w=800',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800'
    ],
    'sony-a7iii': [
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
        'https://images.unsplash.com/photo-1606941369253-f04339d78e35?w=800',
        'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
        'https://images.unsplash.com/photo-1606980620860-be9a0f750e39?w=800'
    ],
    'fujifilm-xt30-ii': [
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
        'https://images.unsplash.com/photo-1606941369253-f04339d78e35?w=800',
        'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800'
    ],
        'gopro-hero-13': [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1606941369253-f04339d78e35?w=800',
        'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
        'https://images.unsplash.com/photo-1606980620860-be9a0f750e39?w=800'
    ],
    'dji-mini-4-pro': [
        'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800',
        'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=800',
        'https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=800',
        'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800'
    ],
    'fujifilm-instax-sq1': [
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800',
        'https://images.unsplash.com/photo-1606941369253-f04339d78e35?w=800',
        'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800'
    ],
    'dji-osmo-pocket-3': [
        'https://images.unsplash.com/photo-1606941369253-f04339d78e35?w=800',
        'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800'
    ],
    'insta360-x5': [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        'https://images.unsplash.com/photo-1606941369253-f04339d78e35?w=800',
        'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800',
        'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800'
    ],
    'rayban-meta': [
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800',
        'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800',
        'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800'
    ]
};

let images = [];

// Product info will be loaded from URL parameter
let productData = {
    id: '',
    name: '',
    category: '',
    basePrice: 850,
    price4Plus: null,
    price11Plus: null
};

// Comprehensive product details data
const productDetails = {
    'iphone-16-pro-max': {
        whatsIncluded: [
            'iPhone 16 Pro Max (256GB)',
            'USB-C to Lightning Cable',
            'Extra Battery Pack (20,000mAh)',
            'Protective Case',
            'Screen Protector (pre-installed)',
            '256GB Memory Card'
        ],
        overview: [
            'Latest flagship iPhone with A18 Pro chip for ultimate performance',
            '6.9" Super Retina XDR display with ProMotion 120Hz',
            'Pro camera system with 48MP main, ultra-wide, and telephoto lenses',
            'Advanced computational photography and Night mode',
            'Action button for quick camera access',
            'All-day battery life with fast charging support',
            '5G connectivity for blazing-fast downloads',
            'Titanium design with ceramic shield front'
        ],
        features: {
            'Display': '6.9" Super Retina XDR',
            'Processor': 'A18 Pro chip',
            'Camera System': '48MP main + 12MP ultra-wide + 12MP telephoto',
            'Video Recording': '4K Dolby Vision HDR at 60fps',
            'Storage': '256GB',
            'Battery Life': 'Up to 33 hours video playback',
            '5G': 'Supports all major 5G bands',
            'Water Resistance': 'IP68 (6 meters for 30 minutes)'
        },
        specifications: {
            'Display Size': '6.9 inches',
            'Resolution': '2868 x 1320 pixels',
            'Chip': 'A18 Pro with 6-core CPU',
            'RAM': '8GB',
            'Rear Cameras': '48MP + 12MP + 12MP',
            'Front Camera': '12MP TrueDepth',
            'Battery': 'Built-in rechargeable lithium-ion',
            'Weight': '221g'
        }
    },
    'iphone-14-pro': {
        whatsIncluded: [
            'iPhone 14 Pro (128GB)',
            'USB-C to Lightning Cable',
            'Portable Charger',
            'Protective Case',
            'Screen Protector (pre-installed)',
            '128GB Memory Card'
        ],
        overview: [
            'Pro-level iPhone with A16 Bionic chip',
            '6.1" Super Retina XDR display with Always-On display',
            'Dynamic Island for seamless multitasking',
            '48MP main camera with ProRAW support',
            'Cinematic mode for video with shallow depth of field',
            'Emergency SOS via satellite',
            'Durable ceramic shield and stainless steel design',
            'Face ID for secure authentication'
        ],
        features: {
            'Display': '6.1" Super Retina XDR',
            'Processor': 'A16 Bionic chip',
            'Camera System': '48MP main + 12MP ultra-wide + 12MP telephoto',
            'Video Recording': '4K Dolby Vision HDR at 60fps',
            'Storage': '128GB',
            'Battery Life': 'Up to 23 hours video playback',
            'Dynamic Island': 'Interactive notification system',
            'Water Resistance': 'IP68 rating'
        },
        specifications: {
            'Display Size': '6.1 inches',
            'Resolution': '2556 x 1179 pixels',
            'Chip': 'A16 Bionic',
            'RAM': '6GB',
            'Rear Cameras': '48MP + 12MP + 12MP',
            'Front Camera': '12MP TrueDepth',
            'Battery': 'Built-in rechargeable lithium-ion',
            'Weight': '206g'
        }
    },
    'iphone-13-pro-max': {
        whatsIncluded: [
            'iPhone 13 Pro Max (128GB)',
            'Lightning Cable',
            'Portable Charger',
            'Protective Case',
            'Screen Protector (pre-installed)',
            '64GB Memory Card'
        ],
        overview: [
            'Large-screen iPhone with A15 Bionic chip',
            '6.7" Super Retina XDR display with ProMotion',
            'Pro camera system with advanced computational photography',
            'Cinematic mode for professional-looking videos',
            'Night mode on all cameras',
            'Exceptional battery life lasting all day',
            'Premium stainless steel and glass design',
            'MagSafe wireless charging support'
        ],
        features: {
            'Display': '6.7" Super Retina XDR',
            'Processor': 'A15 Bionic chip',
            'Camera System': '12MP triple camera system',
            'Video Recording': '4K Dolby Vision HDR at 60fps',
            'Storage': '128GB',
            'Battery Life': 'Up to 28 hours video playback',
            'ProMotion': '120Hz adaptive refresh rate',
            'Water Resistance': 'IP68 rating'
        },
        specifications: {
            'Display Size': '6.7 inches',
            'Resolution': '2778 x 1284 pixels',
            'Chip': 'A15 Bionic',
            'RAM': '6GB',
            'Rear Cameras': '12MP + 12MP + 12MP',
            'Front Camera': '12MP TrueDepth',
            'Battery': 'Built-in rechargeable lithium-ion',
            'Weight': '240g'
        }
    },
    'samsung-s23-ultra': {
        whatsIncluded: [
            'Samsung Galaxy S23 Ultra',
            'USB-C Cable',
            'Extra Battery Pack',
            'Protective Case',
            'Screen Protector (pre-installed)',
            '256GB Memory Card'
        ],
        overview: [
            'Ultimate flagship Android phone with S Pen included',
            '6.8" Dynamic AMOLED 2X display with 120Hz',
            '200MP main camera with advanced AI processing',
            'Snapdragon 8 Gen 2 for exceptional performance',
            'Built-in S Pen for precision and productivity',
            'All-day battery with 45W super fast charging',
            '5G connectivity and Wi-Fi 6E support',
            'Premium design with Gorilla Glass Victus 2'
        ],
        features: {
            'Display': '6.8" Dynamic AMOLED 2X',
            'Processor': 'Snapdragon 8 Gen 2',
            'Camera System': '200MP + 12MP + 10MP + 10MP',
            'Video Recording': '8K at 30fps',
            'Storage': '256GB',
            'Battery': '5000mAh with 45W charging',
            'S Pen': 'Built-in with Bluetooth',
            'Water Resistance': 'IP68 rating'
        },
        specifications: {
            'Display Size': '6.8 inches',
            'Resolution': '3088 x 1440 pixels',
            'Chip': 'Snapdragon 8 Gen 2',
            'RAM': '12GB',
            'Rear Cameras': '200MP + 12MP + 10MP + 10MP',
            'Front Camera': '12MP',
            'Battery Capacity': '5000mAh',
            'Weight': '234g'
        }
    },
    'samsung-z-flip-5': {
        whatsIncluded: [
            'Samsung Galaxy Z Flip 5',
            'USB-C Cable',
            'Portable Charger',
            'Protective Case',
            'Screen Protector (pre-installed)',
            '128GB Memory Card'
        ],
        overview: [
            'Compact foldable phone with stylish flip design',
            '3.4" cover screen for quick access to notifications',
            '6.7" foldable AMOLED display inside',
            'Flex Mode for hands-free selfies and videos',
            'Snapdragon 8 Gen 2 for smooth performance',
            'Ultra-compact when folded, fits in small pockets',
            'Dual cameras for versatile photography',
            'IPX8 water resistance for peace of mind'
        ],
        features: {
            'Cover Display': '3.4" Super AMOLED',
            'Main Display': '6.7" foldable AMOLED',
            'Processor': 'Snapdragon 8 Gen 2',
            'Camera System': '12MP dual camera',
            'Video Recording': '4K at 60fps',
            'Storage': '256GB',
            'Battery': '3700mAh with wireless charging',
            'Water Resistance': 'IPX8 rating'
        },
        specifications: {
            'Folded Size': '85.1 x 71.9 x 15.1mm',
            'Unfolded Size': '165.1 x 71.9 x 6.9mm',
            'Chip': 'Snapdragon 8 Gen 2',
            'RAM': '8GB',
            'Rear Cameras': '12MP + 12MP',
            'Front Camera': '10MP',
            'Battery Capacity': '3700mAh',
            'Weight': '187g'
        }
    },
    'canon-g7x-mark-iii': {
        whatsIncluded: [
            'Canon G7X Mark III Camera',
            'Battery & Charger',
            'Extra Battery',
            'Camera Wrist Strap',
            'USB Cable',
            'Protective Padded Case',
            '64GB SD Card'
        ],
        overview: [
            'Compact vlogging camera with flip-up touchscreen',
            '20.1MP 1-inch sensor for excellent image quality',
            '4K video recording at 30fps',
            'Built-in Wi-Fi and Bluetooth for easy sharing',
            'Fast f/1.8-2.8 lens ideal for low light',
            '4.2x optical zoom (24-100mm equivalent)',
            'Live streaming directly to YouTube',
            'Compact design perfect for travel'
        ],
        features: {
            'Sensor Type': '1-inch CMOS',
            'Resolution': '20.1MP',
            'ISO Range': '125-12800',
            'Lens': '24-100mm f/1.8-2.8',
            'Video Recording': '4K at 30fps',
            'Screen': '3" tilting touchscreen',
            'Connectivity': 'Wi-Fi, Bluetooth',
            'Continuous Shooting': '30fps (RAW burst)'
        },
        specifications: {
            'Sensor Size': '13.2 x 8.8mm',
            'Image Processor': 'DIGIC 8',
            'Zoom Range': '4.2x optical',
            'LCD Screen': '3.0" touchscreen, 1.04M dots',
            'Battery Life': 'Approx. 265 shots',
            'Video Format': 'MP4',
            'Dimensions': '105.0 x 60.9 x 41.4mm',
            'Weight': '304g'
        }
    },
    'sony-zv-1': {
        whatsIncluded: [
            'Sony ZV-1 Camera',
            'NP-BX1 Battery & Charger',
            'Extra Battery',
            'Windscreen for mic',
            'USB Cable',
            'Protective Case',
            '64GB SD Card'
        ],
        overview: [
            'Purpose-built vlogging camera with excellent autofocus',
            'Product Showcase mode for detailed shots',
            'Real-time Eye AF for sharp subject focus',
            'Built-in directional microphone with wind screen',
            '4K video with active stabilization',
            'Vari-angle touchscreen for self-recording',
            'Background defocus button for cinematic look',
            'Live streaming ready via USB'
        ],
        features: {
            'Sensor Type': '1-inch Exmor RS CMOS',
            'Resolution': '20.1MP',
            'ISO Range': '125-12800',
            'Lens': '24-70mm f/1.8-2.8',
            'Video Recording': '4K at 30fps',
            'Screen': '3" vari-angle touchscreen',
            'Microphone': '3-capsule directional',
            'Continuous Shooting': '24fps'
        },
        specifications: {
            'Sensor Size': '13.2 x 8.8mm',
            'Image Processor': 'BIONZ X',
            'Zoom Range': '2.7x optical',
            'LCD Screen': '3.0" vari-angle, 921K dots',
            'Battery Life': 'Approx. 260 shots',
            'Video Format': 'XAVC S, AVCHD',
            'Dimensions': '105.5 x 60.0 x 43.5mm',
            'Weight': '294g'
        }
    },
    'fujifilm-x100vi': {
        whatsIncluded: [
            'Fujifilm X100VI Camera',
            'NP-W126S Battery & Charger',
            'Extra Battery',
            'Lens Cap & Hood',
            'Camera Strap',
            'Protective Leather Case',
            '64GB SD Card'
        ],
        overview: [
            'Premium compact camera with classic rangefinder design',
            '40.2MP X-Trans CMOS 5 HR sensor',
            'Fixed 23mm f/2 lens (35mm equivalent)',
            'Hybrid viewfinder (optical and electronic)',
            'Advanced film simulation modes',
            '6.2K video recording capability',
            '5-axis in-body image stabilization',
            'Weather-resistant metal construction'
        ],
        features: {
            'Sensor Type': 'APS-C X-Trans CMOS 5 HR',
            'Resolution': '40.2MP',
            'ISO Range': '125-12800',
            'Lens': '23mm f/2 (fixed)',
            'Video Recording': '6.2K at 30fps',
            'Viewfinder': 'Hybrid OVF/EVF',
            'Image Stabilization': '5-axis IBIS',
            'Continuous Shooting': '20fps'
        },
        specifications: {
            'Sensor Size': '23.5 x 15.7mm',
            'Image Processor': 'X-Processor 5',
            'Focal Length': '23mm (35mm equiv)',
            'LCD Screen': '3.0" tilting, 1.62M dots',
            'Battery Life': 'Approx. 450 shots',
            'Video Format': 'H.265, H.264',
            'Dimensions': '128 x 74.8 x 55.3mm',
            'Weight': '521g'
        }
    },
    'canon-eos-m50-mark-ii': {
        whatsIncluded: [
            'Canon EOS M50 Mark II Body',
            'EF-M 15-45mm f/3.5-6.3 IS STM Lens',
            'LP-E12 Battery & Charger',
            'Extra Battery',
            'Camera Strap',
            'Protective Camera Bag',
            '64GB SD Card'
        ],
        overview: [
            'Versatile mirrorless camera for beginners and enthusiasts',
            '24.1MP APS-C sensor for detailed images',
            'Eye Detection AF for sharp portraits',
            '4K UHD video recording',
            'Vari-angle touchscreen for creative angles',
            'Built-in Wi-Fi and Bluetooth',
            'Lightweight and compact design',
            'Compatible with Canon EF-M lens system'
        ],
        features: {
            'Sensor Type': 'APS-C CMOS',
            'Resolution': '24.1MP',
            'ISO Range': '100-25600',
            'Autofocus Points': 'Dual Pixel CMOS AF',
            'Video Recording': '4K UHD at 24fps',
            'Screen': '3" vari-angle touchscreen',
            'Connectivity': 'Wi-Fi, Bluetooth',
            'Continuous Shooting': '10fps'
        },
        specifications: {
            'Sensor Size': '22.3 x 14.9mm',
            'Image Processor': 'DIGIC 8',
            'Lens Mount': 'Canon EF-M',
            'LCD Screen': '3.0" vari-angle, 1.04M dots',
            'Battery Life': 'Approx. 305 shots',
            'Video Format': 'MP4',
            'Dimensions': '116.3 x 88.1 x 58.7mm',
            'Weight': '387g (with battery)'
        }
    },
    'sony-a7iii': {
        whatsIncluded: [
            'Sony A7 III Body',
            'FE 28-70mm f/3.5-5.6 OSS Lens',
            'NP-FZ100 Battery & Charger',
            'Extra Battery',
            'Camera Strap',
            'Protective Camera Bag',
            '128GB SD Card'
        ],
        overview: [
            'Full-frame mirrorless camera for professionals',
            '24.2MP BSI CMOS sensor with excellent low-light performance',
            '693-point phase-detection autofocus',
            'Real-time Eye AF for humans and animals',
            '4K HDR video recording',
            '5-axis in-body image stabilization',
            'Dual SD card slots for backup',
            'Long battery life for extended shoots'
        ],
        features: {
            'Sensor Type': 'Full-Frame BSI CMOS',
            'Resolution': '24.2MP',
            'ISO Range': '100-51200',
            'Autofocus Points': '693 phase-detection',
            'Video Recording': '4K HDR at 30fps',
            'Image Stabilization': '5-axis IBIS',
            'Continuous Shooting': '10fps',
            'Viewfinder': '2.36M-dot OLED EVF'
        },
        specifications: {
            'Sensor Size': '35.6 x 23.8mm',
            'Image Processor': 'BIONZ X',
            'Lens Mount': 'Sony FE',
            'LCD Screen': '3.0" tilting, 922K dots',
            'Battery Life': 'Approx. 710 shots',
            'Video Format': 'XAVC S, AVCHD',
            'Dimensions': '126.9 x 95.6 x 73.7mm',
            'Weight': '650g (with battery)'
        }
    },
    'fujifilm-xt30-ii': {
        whatsIncluded: [
            'Fujifilm X-T30 II Body',
            'XC 15-45mm f/3.5-5.6 OIS PZ Lens',
            'NP-W126S Battery & Charger',
            'Extra Battery',
            'Camera Strap',
            'Protective Camera Bag',
            '64GB SD Card'
        ],
        overview: [
            'Compact mirrorless camera with retro design',
            '26.1MP X-Trans CMOS 4 sensor',
            'Fast and accurate phase detection AF',
            '4K video recording at 30fps',
            'Film simulation modes for creative looks',
            'Tilting touchscreen LCD',
            'Lightweight for travel and everyday use',
            'Great value for Fujifilm system entry'
        ],
        features: {
            'Sensor Type': 'APS-C X-Trans CMOS 4',
            'Resolution': '26.1MP',
            'ISO Range': '160-12800',
            'Autofocus Points': '425 phase-detection',
            'Video Recording': '4K at 30fps',
            'Screen': '3" tilting touchscreen',
            'Film Simulations': '18 modes',
            'Continuous Shooting': '30fps (crop mode)'
        },
        specifications: {
            'Sensor Size': '23.5 x 15.7mm',
            'Image Processor': 'X-Processor 4',
            'Lens Mount': 'Fujifilm X',
            'LCD Screen': '3.0" tilting, 1.04M dots',
            'Battery Life': 'Approx. 380 shots',
            'Video Format': 'H.264',
            'Dimensions': '118.4 x 82.8 x 46.8mm',
            'Weight': '383g (with battery)'
        }
    },
    'nikon-z50': {
        whatsIncluded: [
            'Nikon Z50 Body',
            'NIKKOR Z DX 16-50mm f/3.5-6.3 VR Lens',
            'EN-EL25 Battery & Charger',
            'Extra Battery',
            'Camera Strap',
            'Protective Camera Bag',
            '64GB SD Card'
        ],
        overview: [
            'Entry-level mirrorless camera with DX sensor',
            '20.9MP CMOS sensor for sharp images',
            '209-point hybrid autofocus system',
            'Eye-detection AF for portraits',
            '4K UHD video with full pixel readout',
            'Tilting touchscreen for vlogging',
            'Built-in Wi-Fi and Bluetooth',
            'Compact Z-mount system'
        ],
        features: {
            'Sensor Type': 'DX-format CMOS',
            'Resolution': '20.9MP',
            'ISO Range': '100-51200',
            'Autofocus Points': '209 hybrid AF',
            'Video Recording': '4K UHD at 30fps',
            'Screen': '3.2" tilting touchscreen',
            'Connectivity': 'Wi-Fi, Bluetooth',
            'Continuous Shooting': '11fps'
        },
        specifications: {
            'Sensor Size': '23.5 x 15.7mm',
            'Image Processor': 'EXPEED 6',
            'Lens Mount': 'Nikon Z',
            'LCD Screen': '3.2" tilting, 1.04M dots',
            'Battery Life': 'Approx. 320 shots',
            'Video Format': 'MOV, MP4',
            'Dimensions': '126.5 x 93.5 x 60mm',
            'Weight': '450g (with battery)'
        }
    },
    'gopro-hero-13': {
        whatsIncluded: [
            'GoPro HERO 13 Black',
            'Rechargeable Battery',
            'Extra Battery',
            'Curved Adhesive Mounts',
            'Mounting Buckle',
            'USB-C Cable',
            'Waterproof Case',
            '128GB microSD Card'
        ],
        overview: [
            'Ultimate action camera with 5.3K video',
            'HyperSmooth 6.0 stabilization',
            'Waterproof to 10m without housing',
            'HDR photo and video',
            'TimeWarp 3.0 for creative time-lapse',
            'Live streaming to social media',
            'Voice control for hands-free operation',
            'Durable and rugged design'
        ],
        features: {
            'Video Resolution': '5.3K at 60fps',
            'Photo Resolution': '27MP',
            'Stabilization': 'HyperSmooth 6.0',
            'Waterproof': '10m (33ft)',
            'Screen': 'Front and rear touchscreens',
            'HDR': 'Photo and video',
            'Audio': '3 microphones',
            'Connectivity': 'Wi-Fi, Bluetooth, GPS'
        },
        specifications: {
            'Max Video': '5.3K60 / 4K120',
            'Max Photo': '27MP',
            'Field of View': 'SuperView, Wide, Linear, Narrow',
            'Battery Life': 'Up to 70 minutes (5.3K60)',
            'Storage': 'microSD up to 1TB',
            'Dimensions': '71.8 x 50.8 x 33.6mm',
            'Weight': '153g',
            'Waterproof Depth': '10 meters'
        }
    },
    'dji-osmo-pocket-3': {
        whatsIncluded: [
            'DJI Osmo Pocket 3 Camera',
            'Battery Handle',
            'Extra Battery Handle',
            'Wide-Angle Lens',
            'Protective Cover',
            'USB-C Cable',
            'Carrying Case',
            '128GB microSD Card'
        ],
        overview: [
            '3-axis gimbal camera in pocket size',
            '1-inch CMOS sensor for 4K video',
            '3" rotating touchscreen',
            'ActiveTrack 6.0 for subject tracking',
            'D-Log M color profile for grading',
            'Magnetic attachment for accessories',
            'Built-in microphone with noise cancellation',
            'Perfect for vlogging and travel'
        ],
        features: {
            'Sensor Type': '1-inch CMOS',
            'Video Resolution': '4K at 120fps',
            'Photo Resolution': '9.4MP',
            'Screen': '3" rotating touchscreen',
            'Stabilization': '3-axis mechanical gimbal',
            'Tracking': 'ActiveTrack 6.0',
            'Audio': 'Stereo microphones',
            'Storage': 'microSD up to 512GB'
        },
        specifications: {
            'Max Video': '4K120fps',
            'Max Photo': '9.4MP',
            'FOV': '108° (with wide lens)',
            'Battery Life': 'Approx. 166 minutes',
            'Charging': 'USB-C fast charging',
            'Dimensions': '139.7 x 42.2 x 33.5mm',
            'Weight': '179g',
            'Operating Temp': '0°C to 40°C'
        }
    },
    'insta360-x5': {
        whatsIncluded: [
            'Insta360 X5 Camera',
            'Rechargeable Battery',
            'Extra Battery',
            'Bullet Time Handle',
            'Invisible Selfie Stick',
            'Lens Guards',
            'USB-C Cable',
            '256GB microSD Card'
        ],
        overview: [
            '360-degree action camera with 8K recording',
            'Invisible selfie stick effect',
            'FlowState stabilization for smooth footage',
            'Bullet Time mode for Matrix-style shots',
            'AI-powered editing with auto-tracking',
            'Waterproof to 10m',
            '2.29" touchscreen',
            'TimeShift and loop recording modes'
        ],
        features: {
            'Video Resolution': '8K at 30fps (360°)',
            'Photo Resolution': '72MP',
            'Stabilization': 'FlowState',
            'Waterproof': '10m (33ft)',
            'Screen': '2.29" touchscreen',
            'Modes': 'Bullet Time, TimeShift',
            'Audio': '4 microphones',
            'Connectivity': 'Wi-Fi, Bluetooth'
        },
        specifications: {
            'Max Video': '8K30 / 5.7K60 (360°)',
            'Max Photo': '72MP (360°)',
            'Battery Life': 'Up to 80 minutes',
            'Storage': 'microSD up to 1TB',
            'Charging': 'USB-C',
            'Dimensions': '113 x 48 x 32.4mm',
            'Weight': '180g',
            'Waterproof Depth': '10 meters'
        }
    },
    'dji-mini-4-pro': {
        whatsIncluded: [
            'DJI Mini 4 Pro Drone',
            'RC-N2 Remote Controller',
            'Intelligent Flight Battery (3)',
            'Two-Way Charging Hub',
            'Propellers (pairs)',
            'Carrying Case',
            '256GB microSD Card',
            'ND Filters Set'
        ],
        overview: [
            'Ultra-lightweight drone under 249g',
            '4K/60fps HDR video with 10-bit D-Log M',
            'Omnidirectional obstacle sensing',
            '48MP photo capability',
            'ActiveTrack 360° subject tracking',
            'Up to 34 minutes flight time',
            'MasterShots and QuickShots modes',
            'Foldable and portable design'
        ],
        features: {
            'Camera': '1/1.3" CMOS sensor',
            'Video Resolution': '4K/60fps HDR',
            'Photo Resolution': '48MP',
            'Gimbal': '3-axis mechanical',
            'Obstacle Sensing': 'Omnidirectional',
            'Flight Time': 'Up to 34 minutes',
            'Transmission': 'OcuSync 4.0 (20km)',
            'Wind Resistance': 'Level 5 (38 km/h)'
        },
        specifications: {
            'Max Video': '4K/60fps',
            'Max Photo': '48MP',
            'Max Flight Speed': '57.6 km/h (S-mode)',
            'Max Ascent Speed': '5 m/s',
            'Max Descent Speed': '5 m/s',
            'Operating Temperature': '-10°C to 40°C',
            'Weight': '249g',
            'Dimensions Folded': '145×90×64mm'
        }
    },
    'fujifilm-instax-sq1': {
        whatsIncluded: [
            'Fujifilm Instax Square SQ1',
            'Hand Strap',
            '10-Pack Instant Film',
            'Extra 20-Pack Film',
            'Camera Case',
            '2x AA Batteries (installed)',
            'Extra Battery Pack'
        ],
        overview: [
            'Instant square format camera for fun photos',
            'Automatic exposure for perfect shots',
            'Built-in selfie mirror',
            'Close-up mode for detailed shots',
            'Square format prints (62x62mm)',
            'One-touch operation',
            'Stylish retro design',
            'Great for parties and events'
        ],
        features: {
            'Film Type': 'Instax Square',
            'Print Size': '62 x 62mm',
            'Lens': '65.75mm f/12.6',
            'Shutter Speed': '1/2 sec',
            'Flash': 'Auto flash',
            'Exposure': 'Automatic',
            'Selfie Mode': 'Built-in mirror',
            'Power': '2x CR2 batteries'
        },
        specifications: {
            'Film Format': 'Instax Square (62x62mm)',
            'Image Size': '62 x 62mm',
            'Development Time': 'Approx. 90 seconds',
            'Shooting Range': '0.3m - ∞',
            'Flash Range': '0.5m - 2m',
            'Battery Life': 'Approx. 100 packs',
            'Dimensions': '119 x 127 x 58mm',
            'Weight': '390g'
        }
    },
    'rayban-meta': {
        whatsIncluded: [
            'Ray-Ban Meta Wayfarer',
            'Charging Case',
            'USB-C Cable',
            'Cleaning Cloth',
            'Carrying Pouch',
            'Extra Nose Pads'
        ],
        overview: [
            'Smart glasses with built-in cameras',
            'Capture photos and videos hands-free',
            '12MP ultra-wide camera',
            'Open-ear speakers for audio',
            'Meta AI assistant built-in',
            'Live streaming to social media',
            'Classic Wayfarer style',
            'Prescription lens compatible'
        ],
        features: {
            'Camera': '12MP ultra-wide',
            'Video Resolution': '1080p at 60fps',
            'Audio': 'Open-ear speakers',
            'Microphones': '5-mic array',
            'Battery Life': 'Up to 4 hours',
            'Charging Case': 'Provides 8 charges',
            'Connectivity': 'Wi-Fi, Bluetooth 5.3',
            'Voice Control': 'Meta AI assistant'
        },
        specifications: {
            'Camera Resolution': '12MP',
            'Max Video': '1080p60fps',
            'Storage': '32GB internal',
            'Speaker Type': 'Open-ear directional',
            'Water Resistance': 'IPX4',
            'Charging Time': '75 minutes (full)',
            'Weight': '50g',
            'Frame Style': 'Wayfarer'
        }
    }
};

// Initialize Accordion for all detail sections
function initializeAccordion() {
    const sections = document.querySelectorAll('.detail-section');
    
    sections.forEach(section => {
        const header = section.querySelector('.section-header');
        if (header) {
            header.addEventListener('click', function() {
                section.classList.toggle('active');
            });
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadProductFromURL();
    loadDatesFromCamerasPage();
    initializeGallery();
    initializeQuantityControls();
    initializeCalendars();
    initializeTimeSlots();
    initializeAddons();
    initializeAddToOrder();
    renderProductDetails();
    initializeAccordion();
    initializeMobileBooking();
});

// Load product info from URL parameter
function loadProductFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    console.log('Product ID from URL:', productId);
    
    if (!productId) {
        console.log('No product ID in URL');
        return;
    }
    
    // Find the product card from cameras page (we'll use localStorage to pass product data)
    const productInfo = localStorage.getItem('selectedProduct');
    
    if (productInfo) {
        productData = JSON.parse(productInfo);
        console.log('Product data:', productData);
        
        // Use the actual product image from cameras.html
        if (productData.image) {
            const mainImage = document.getElementById('mainProductImage');
            if (mainImage) {
                mainImage.src = productData.image;
                console.log('Set main image to:', productData.image);
            }
        }
        
        // Calculate lowest price (11+ days price if available, else 4+ days, else base)
        let lowestPrice = productData.basePrice;
        if (productData.price11Plus) {
            lowestPrice = productData.price11Plus;
        } else if (productData.price4Plus) {
            lowestPrice = productData.price4Plus;
        }
        
        // Update mobile price bar
        const mobilePrice = document.getElementById('mobilePrice');
        if (mobilePrice) {
            mobilePrice.textContent = `₱${lowestPrice}`;
        }
        
        // Update page with product info
        const productNameElements = document.querySelectorAll('.product-name, h1, #productTitle');
        productNameElements.forEach(el => {
            if (el.textContent.includes('Fujifilm') || el.classList.contains('product-name') || el.id === 'productTitle') {
                el.textContent = productData.name;
            }
        });
        
        const categoryElements = document.querySelectorAll('.category-badge');
        categoryElements.forEach(el => {
            el.textContent = productData.category;
        });
        
        // Update breadcrumb with product name
        const breadcrumb = document.getElementById('productBreadcrumb');
        if (breadcrumb) {
            breadcrumb.textContent = productData.name;
        }
        
        // Update quantity label with product name
        const quantityLabel = document.getElementById('quantityLabel');
        if (quantityLabel) {
            quantityLabel.textContent = productData.name;
        }
        
        // Update price displays with lowest price
        const priceElement = document.getElementById('productPrice');
        const originalPriceElement = document.getElementById('originalPrice');
        
        if (priceElement) {
            priceElement.textContent = `PHP ${lowestPrice.toLocaleString()}`;
        }
        
        // Check if product has discount (discount badge exists in cameras.html)
        // Get discount percentage from URL or productData
        const discountPercentages = {
            'iphone-16-pro-max': 15,
            'iphone-13-pro-max': 20,
            'canon-g7x-mark-iii': 25,
            'fujifilm-x100vi': 12,
            'canon-eos-m50-mark-ii': 18,
            'sony-a7iii': 15,
            'nikon-z50': 20,
            'gopro-hero-13': 10,
            'insta360-x5': 22,
            'dji-mini-4-pro': 8,
            'fujifilm-instax-sq1': 30
        };
        
        const productId = productData.id;
        const discountPercent = discountPercentages[productId];
        
        if (discountPercent && originalPriceElement) {
            // Calculate original price that ends in 99 while maintaining accurate discount
            // Formula: discountedPrice = originalPrice * (1 - discount/100)
            // We need: originalPrice ending in 99, AND (originalPrice - discountedPrice) / originalPrice = discount/100
            
            // Start with theoretical original price
            let targetOriginal = lowestPrice / (1 - discountPercent / 100);
            
            // Find the closest price ending in 99 that gives us close to the target discount
            const hundreds = Math.floor(targetOriginal / 100);
            let option1 = (hundreds * 100) + 99;
            let option2 = ((hundreds + 1) * 100) + 99;
            
            // Calculate actual discounts for both options
            const discount1 = ((option1 - lowestPrice) / option1) * 100;
            const discount2 = ((option2 - lowestPrice) / option2) * 100;
            
            // Choose the one closest to our target discount percentage
            const diff1 = Math.abs(discount1 - discountPercent);
            const diff2 = Math.abs(discount2 - discountPercent);
            
            const originalPrice = diff1 < diff2 ? option1 : option2;
            
            originalPriceElement.textContent = `PHP ${originalPrice.toLocaleString()}`;
            originalPriceElement.style.display = 'inline';
        }
    }
}

// Load dates from cameras page if available
function loadDatesFromCamerasPage() {
    // Try to get dates from localStorage (set by cameras page)
    const savedPickupDate = localStorage.getItem('selectedPickupDate');
    const savedReturnDate = localStorage.getItem('selectedReturnDate');
    
    if (savedPickupDate) {
        selectedStartDate = new Date(savedPickupDate);
        selectedStartDate.setHours(0, 0, 0, 0);
    }
    
    if (savedReturnDate) {
        selectedEndDate = new Date(savedReturnDate);
        selectedEndDate.setHours(0, 0, 0, 0);
    }
    
    // Calculate duration if both dates are available
    if (selectedStartDate && selectedEndDate) {
        calculateDuration();
        updateBookingSummary();
        updateOrderSummary();
    }
}

// Image Gallery Functions - Simplified (no thumbnails or navigation needed)
function initializeGallery() {
    // Gallery functionality removed - single image only
    console.log('Gallery initialized - single image mode');
}

// Quantity Controls
function initializeQuantityControls() {
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyInput = document.querySelector('.quantity-control input');

    minusBtn.addEventListener('click', function() {
        if (selectedQuantity > 1) {
            selectedQuantity--;
            qtyInput.value = selectedQuantity;
            updateOrderSummary();
        }
    });

    plusBtn.addEventListener('click', function() {
        if (selectedQuantity < 10) {
            selectedQuantity++;
            qtyInput.value = selectedQuantity;
            updateOrderSummary();
        }
    });

    qtyInput.addEventListener('change', function() {
        let value = parseInt(this.value);
        if (isNaN(value) || value < 1) {
            value = 1;
        } else if (value > 10) {
            value = 10;
        }
        selectedQuantity = value;
        this.value = selectedQuantity;
        updateOrderSummary();
    });
}

// Calendar Functions
function initializeCalendars() {
    // Set current month to pickup date month if available
    if (selectedStartDate) {
        currentMonth = new Date(selectedStartDate.getFullYear(), selectedStartDate.getMonth(), 1);
    }
    
    // Calendar navigation
    document.getElementById('prevMonth').addEventListener('click', function() {
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', function() {
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        renderCalendar();
    });

    renderCalendar();
}

function renderCalendar() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    document.getElementById('monthTitle').textContent = monthName;

    const datesContainer = document.getElementById('calendarDates');
    datesContainer.innerHTML = '';

    const firstDay = currentMonth.getDay();
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.className = 'calendar-date empty';
        datesContainer.appendChild(emptyCell);
    }

    // Add date cells
    for (let day = 1; day <= daysInMonth; day++) {
        const dateCell = document.createElement('div');
        dateCell.className = 'calendar-date';
        dateCell.textContent = day;
        
        const cellDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        cellDate.setHours(0, 0, 0, 0);

        // Disable past dates
        if (cellDate < today) {
            dateCell.classList.add('disabled');
        } else {
            // If pickup is selected but not return, disable pickup date and dates before it
            if (selectedStartDate && !selectedEndDate) {
                const minReturnDate = new Date(selectedStartDate);
                minReturnDate.setDate(minReturnDate.getDate() + 1);
                minReturnDate.setHours(0, 0, 0, 0);
                
                if (cellDate < minReturnDate) {
                    dateCell.classList.add('disabled');
                }
            }
            
            // Check if this is the start date
            if (selectedStartDate && cellDate.getTime() === selectedStartDate.getTime()) {
                dateCell.classList.add('selected');
            }
            
            // Check if this is the end date
            if (selectedEndDate && cellDate.getTime() === selectedEndDate.getTime()) {
                dateCell.classList.add('selected');
            }
            
            // Check if date is in range
            if (selectedStartDate && selectedEndDate) {
                if (cellDate > selectedStartDate && cellDate < selectedEndDate) {
                    dateCell.classList.add('in-range');
                }
            }
            
            dateCell.addEventListener('click', function() {
                selectDate(cellDate);
            });
        }

        datesContainer.appendChild(dateCell);
    }
}

function selectDate(date) {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
        // First click or reset - set as pickup date
        selectedStartDate = date;
        selectedEndDate = null;
    } else {
        // Second click - set as return date
        // Calculate minimum return date (next day after pickup)
        const minReturnDate = new Date(selectedStartDate);
        minReturnDate.setDate(minReturnDate.getDate() + 1);
        minReturnDate.setHours(0, 0, 0, 0);
        
        if (date >= minReturnDate) {
            // Valid return date (at least 1 day after pickup)
            selectedEndDate = date;
        } else if (date < selectedStartDate) {
            // If clicked earlier date, restart selection
            selectedStartDate = date;
            selectedEndDate = null;
        } else {
            // Same day or invalid - show notification
            if (typeof showNotification === 'function') {
                showNotification('Return date must be at least 1 day after pickup date', 'warning');
            } else {
                alert('Return date must be at least 1 day after pickup date');
            }
            return;
        }
    }
    
    renderCalendar();
    calculateDuration();
    updateBookingSummary();
    updateOrderSummary();
}

function calculateDuration() {
    if (selectedStartDate && selectedEndDate) {
        const timeDiff = selectedEndDate.getTime() - selectedStartDate.getTime();
        selectedDuration = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    } else {
        selectedDuration = 0;
    }
}

// Time Slots
function initializeTimeSlots() {
    const timeSlots = document.querySelectorAll('.time-slot');

    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            selectedTimeSlot = this.textContent.trim();
            updateBookingSummary();
        });
    });
}

// Update Booking Summary Text
function updateBookingSummary() {
    const summaryText = document.querySelector('.summary-text');
    
    // Determine discount percentage based on duration
    let discountInfo = '';
    if (selectedDuration >= 11 && productData.price11Plus) {
        discountInfo = ' 🎉 <strong style="color: #059669;">You\'re getting 15% OFF!</strong>';
    } else if (selectedDuration >= 4 && productData.price4Plus) {
        discountInfo = ' 🎉 <strong style="color: #059669;">You\'re getting 10% OFF!</strong>';
    }
    
    if (selectedStartDate && selectedEndDate && selectedTimeSlot) {
        const startDay = selectedStartDate.toLocaleDateString('en-US', { weekday: 'long' });
        const startDate = selectedStartDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
        const endDay = selectedEndDate.toLocaleDateString('en-US', { weekday: 'long' });
        const endDate = selectedEndDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
        
        summaryText.innerHTML = `Your booking will start <strong>${startDay} ${startDate}</strong> at <strong>${selectedTimeSlot}</strong> and end on <strong>${endDay} ${endDate}</strong>. You'll have <strong>${selectedDuration} ${selectedDuration === 1 ? 'day' : 'days'}</strong> to capture amazing moments with this camera.${discountInfo}`;
    } else if (selectedStartDate && selectedEndDate) {
        const startDay = selectedStartDate.toLocaleDateString('en-US', { weekday: 'long' });
        const startDate = selectedStartDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
        const endDay = selectedEndDate.toLocaleDateString('en-US', { weekday: 'long' });
        const endDate = selectedEndDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
        
        summaryText.innerHTML = `Your booking will start <strong>${startDay} ${startDate}</strong> and end on <strong>${endDay} ${endDate}</strong> (<strong>${selectedDuration} ${selectedDuration === 1 ? 'day' : 'days'}</strong>). Please select a pickup time.${discountInfo}`;
    } else if (selectedStartDate) {
        const startDay = selectedStartDate.toLocaleDateString('en-US', { weekday: 'long' });
        const startDate = selectedStartDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
        
        summaryText.innerHTML = `Pickup date: <strong>${startDay} ${startDate}</strong>. Now select your return date from the calendar.`;
    } else {
        summaryText.innerHTML = `Select your rental dates from the calendar above. Choose your <strong>pickup date</strong> and your <strong>return date</strong>, then select a pickup time.`;
    }
}

// Add-ons functionality
function initializeAddons() {
    const addonCheckboxes = document.querySelectorAll('.addon-checkbox');
    
    addonCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateOrderSummary();
        });
    });
}

function calculateAddonsTotal() {
    const addonCheckboxes = document.querySelectorAll('.addon-checkbox:checked');
    let addonsTotal = 0;
    
    addonCheckboxes.forEach(checkbox => {
        const price = parseInt(checkbox.dataset.price);
        // Add-ons are fixed price, NOT per day
        addonsTotal += price;
    });
    
    return addonsTotal;
}

// Update Order Summary
function updateOrderSummary() {
    const qtyText = document.querySelector('.summary-item:nth-child(1) span:last-child');
    const durationText = document.querySelector('.summary-item:nth-child(2) span:last-child');
    const priceText = document.querySelector('.summary-item:nth-child(3) span:last-child');
    const subtotalText = document.querySelector('.summary-subtotal span:last-child');
    const addonsRow = document.querySelector('.summary-addons');
    const addonsText = document.querySelector('.summary-addons span:last-child');
    const discountRow = document.querySelector('.summary-discount');
    const discountText = document.querySelector('.summary-discount span:last-child');
    const totalText = document.querySelector('.summary-total span:last-child');

    qtyText.textContent = `${selectedQuantity}x`;
    
    if (selectedDuration > 0) {
        durationText.textContent = `${selectedDuration} ${selectedDuration === 1 ? 'Day' : 'Days'}`;
        
        // Calculate subtotal at base price
        const subtotal = productData.basePrice * selectedQuantity * selectedDuration;
        
        // Determine discount percentage based on duration
        let discountPercent = 0;
        let discountReason = '';
        let pricePerDay = productData.basePrice;
        
        // Apply discount based on duration
        if (selectedDuration >= 11) {
            discountPercent = 15;
            discountReason = '11+ days';
            // Use discounted price if available, otherwise calculate from base
            pricePerDay = productData.price11Plus || (productData.basePrice * 0.85);
        } else if (selectedDuration >= 4) {
            discountPercent = 10;
            discountReason = '4-10 days';
            // Use discounted price if available, otherwise calculate from base
            pricePerDay = productData.price4Plus || (productData.basePrice * 0.90);
        }
        
        // Calculate discount amount
        const discountAmount = subtotal * (discountPercent / 100);
        const baseTotal = pricePerDay * selectedQuantity * selectedDuration;
        
        // Calculate add-ons total (fixed price, not per day)
        const addonsTotal = calculateAddonsTotal();
        
        // Calculate final total
        const finalTotal = baseTotal + addonsTotal;
        
        // Update display
        subtotalText.textContent = `₱${subtotal.toLocaleString()}`;
        
        // Show add-ons if any selected
        if (addonsTotal > 0) {
            addonsRow.style.display = 'flex';
            addonsText.textContent = `₱${addonsTotal.toLocaleString()}`;
        } else {
            addonsRow.style.display = 'none';
        }
        
        // Show discount if applicable
        if (discountPercent > 0) {
            discountRow.style.display = 'flex';
            discountText.textContent = `-₱${discountAmount.toLocaleString()} (${discountReason})`;
        } else {
            discountRow.style.display = 'none';
        }
        
        totalText.textContent = `₱${finalTotal.toLocaleString()}`;
    } else {
        durationText.textContent = `0 Days`;
        subtotalText.textContent = `₱0`;
        addonsRow.style.display = 'none';
        discountRow.style.display = 'none';
        totalText.textContent = `₱0`;
    }
    
    priceText.textContent = `₱${productData.basePrice.toLocaleString()}/day`;
}

// Add to Order
function initializeAddToOrder() {
    const addBtn = document.querySelector('.btn-add-to-order');

    addBtn.addEventListener('click', async function() {
        // Check if user is logged in first
        if (typeof isUserLoggedIn === 'function') {
            const loggedIn = await isUserLoggedIn();
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
        }

        // User is logged in - proceed with validation and adding to cart
        if (!selectedStartDate || !selectedEndDate) {
            alert('Please select your rental dates from the calendar.');
            return;
        }

        if (!selectedTimeSlot) {
            alert('Please select a pickup time.');
            return;
        }

        // Determine price per day based on duration
        let pricePerDay = productData.basePrice;
        if (productData.price11Plus && selectedDuration >= 11) {
            pricePerDay = productData.price11Plus;
        } else if (productData.price4Plus && selectedDuration >= 4) {
            pricePerDay = productData.price4Plus;
        }
        
        // Get selected add-ons
        const selectedAddons = [];
        const addonCheckboxes = document.querySelectorAll('.addon-checkbox:checked');
        addonCheckboxes.forEach(checkbox => {
            selectedAddons.push({
                name: checkbox.dataset.name,
                price: checkbox.dataset.price
            });
        });
        
        const orderItem = {
            id: productData.id,
            name: productData.name,
            category: productData.category,
            image: productData.image || images[0],
            price: pricePerDay.toString(),
            quantity: selectedQuantity,
            addons: selectedAddons
        };

        // Get existing cart using cartItems key
        let cart = localStorage.getItem('cartItems');
        cart = cart ? JSON.parse(cart) : [];

        // Check if item already exists (same product)
        const existingIndex = cart.findIndex(item => item.id === orderItem.id);

        if (existingIndex !== -1) {
            // Update existing item
            cart[existingIndex] = orderItem;
        } else {
            // Add new item
            cart.push(orderItem);
        }

        // Save to localStorage using cartItems key
        localStorage.setItem('cartItems', JSON.stringify(cart));
        
        // Also save the dates
        if (selectedStartDate) {
            localStorage.setItem('selectedPickupDate', selectedStartDate.toISOString());
        }
        if (selectedEndDate) {
            localStorage.setItem('selectedReturnDate', selectedEndDate.toISOString());
        }

        // Show success message
        if (typeof showNotification === 'function') {
            showNotification('Added to cart!', 'success');
        } else {
            alert('Added to cart! Redirecting to cart page...');
        }

        // Redirect to cart after short delay
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1000);
    });
}

// Render Product Details Sections
function renderProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId || !productDetails[productId]) {
        console.log('No product details found for:', productId);
        return;
    }
    
    const details = productDetails[productId];
    
    // Render What's Included
    const includedItemsList = document.getElementById('includedItemsList');
    if (includedItemsList && details.whatsIncluded) {
        includedItemsList.innerHTML = details.whatsIncluded.map(item => `
            <div class="included-item">
                <i class="fas fa-check-circle"></i>
                <span>${item}</span>
            </div>
        `).join('');
    }
    
    // Render Overview
    const overviewList = document.getElementById('overviewList');
    if (overviewList && details.overview) {
        overviewList.innerHTML = details.overview.map(item => `
            <div class="overview-item">
                <i class="fas fa-star"></i>
                <span>${item}</span>
            </div>
        `).join('');
    }
    
    // Render Features
    const featuresList = document.getElementById('featuresList');
    if (featuresList && details.features) {
        featuresList.innerHTML = Object.entries(details.features).map(([label, value]) => `
            <div class="feature-item">
                <div class="feature-label">${label}</div>
                <div class="feature-value">${value}</div>
            </div>
        `).join('');
    }
    
    // Render Specifications
    const specsList = document.getElementById('specsList');
    if (specsList && details.specifications) {
        specsList.innerHTML = Object.entries(details.specifications).map(([label, value]) => `
            <div class="spec-item">
                <div class="spec-label">${label}</div>
                <div class="spec-value">${value}</div>
            </div>
        `).join('');
    }
}

// Initialize Mobile Booking
function initializeMobileBooking() {
    const productInfo = document.querySelector('.product-info');
    const productLeftColumn = document.querySelector('.product-left-column');
    const mobileBookBtn = document.getElementById('mobileBookBtn');
    const backToDetailsBtn = document.getElementById('backToDetailsBtn');
    
    // Hide booking sections on mobile initially
    if (window.innerWidth <= 768) {
        productInfo.classList.add('booking-hidden');
    }
    
    // Handle Book Now button click
    if (mobileBookBtn) {
        mobileBookBtn.addEventListener('click', function() {
            productInfo.classList.remove('booking-hidden');
            
            // Hide product details sections on mobile
            if (productLeftColumn) {
                productLeftColumn.classList.add('details-hidden');
            }
            
            // Advance progress bar to step 2 (Select Dates)
            if (typeof setProgress === 'function') {
                setProgress(2);
            }
            
            // Scroll to rental section smoothly
            const quantitySection = document.querySelector('.quantity-section');
            if (quantitySection) {
                quantitySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Hide the mobile booking bar after clicking
            const mobileBar = document.querySelector('.mobile-booking-bar');
            if (mobileBar) {
                mobileBar.style.display = 'none';
            }
        });
    }
    
    // Handle Back to Details button click
    if (backToDetailsBtn) {
        backToDetailsBtn.addEventListener('click', function() {
            productInfo.classList.add('booking-hidden');
            
            // Show product details sections again
            if (productLeftColumn) {
                productLeftColumn.classList.remove('details-hidden');
            }
            
            // Reset progress bar to step 1 (Details)
            if (typeof setProgress === 'function') {
                setProgress(1);
            }
            
            // Show the mobile booking bar again
            const mobileBar = document.querySelector('.mobile-booking-bar');
            if (mobileBar && window.innerWidth <= 768) {
                mobileBar.style.display = 'block';
            }
            
            // Scroll to product details
            if (productLeftColumn) {
                productLeftColumn.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            productInfo.classList.remove('booking-hidden');
            if (productLeftColumn) {
                productLeftColumn.classList.remove('details-hidden');
            }
            const mobileBar = document.querySelector('.mobile-booking-bar');
            if (mobileBar) {
                mobileBar.style.display = 'none';
            }
        } else {
            const mobileBar = document.querySelector('.mobile-booking-bar');
            if (mobileBar && productInfo.classList.contains('booking-hidden')) {
                mobileBar.style.display = 'block';
            }
        }
    });
}
