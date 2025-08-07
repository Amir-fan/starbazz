// STAR BAZZ Website JavaScript
// Image error handling
function handleImageErrors() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.error('Image failed to load:', this.src);
            this.style.display = 'none';
            // Add a placeholder or error message
            const parent = this.parentElement;
            if (parent && !parent.querySelector('.image-error')) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'image-error';
                errorDiv.innerHTML = '<i class="fas fa-image"></i><p>صورة غير متوفرة</p>';
                errorDiv.style.cssText = `
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #666;
                    background: #1a1a1a;
                    border-radius: 10px;
                `;
                parent.appendChild(errorDiv);
            }
        });
        
        img.addEventListener('load', function() {
            console.log('Image loaded successfully:', this.src);
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    handleImageErrors();
    initSmoothScrolling();
    initProductFilter();
    initScrollAnimations();
    initContactForm();
    initMobileMenu();
    initLoadingAnimations();
    initParallaxEffects();
    initTouchInteractions();
    initServiceWorker();
    initPWA();
    initDeveloperModal();
});

// Developer Modal Functions
function initDeveloperModal() {
    // Close modal when clicking outside
    const modal = document.getElementById('developerModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeDeveloperModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDeveloperModal();
        }
    });
}

function showDeveloperInfo() {
    const modal = document.getElementById('developerModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

function closeDeveloperModal() {
    const modal = document.getElementById('developerModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    }
}

// Service Worker Registration
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// PWA Installation
function initPWA() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install button if needed
        showInstallButton();
    });
    
    function showInstallButton() {
        // Create install button
        const installButton = document.createElement('button');
        installButton.textContent = 'تثبيت التطبيق';
        installButton.className = 'btn btn-primary install-btn';
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 1000;
            background: var(--gold);
            color: var(--dark-black);
            border: none;
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 600;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
            cursor: pointer;
            transition: var(--transition);
        `;
        
        installButton.addEventListener('click', () => {
            installButton.style.display = 'none';
            deferredPrompt.prompt();
            
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null;
            });
        });
        
        document.body.appendChild(installButton);
    }
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Product Filtering
function initProductFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    const productsGrid = document.querySelector('.products-grid');
    
    // Ensure all products are visible by default
    console.log('Found', productCards.length, 'product cards');
    
    // Add initial animation classes
    productCards.forEach((card, index) => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.transition = 'all 0.4s ease-in-out';
        console.log('Product', index + 1, ':', card.querySelector('img')?.src);
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            let visibleCount = 0;
            
            // Add loading state to grid
            productsGrid.style.opacity = '0.7';
            
            setTimeout(() => {
                productCards.forEach((card, index) => {
                    const categories = card.getAttribute('data-category');
                    
                    if (filterValue === 'all' || categories.includes(filterValue)) {
                        card.style.display = 'block';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        visibleCount++;
                        
                        // Stagger animation
                        setTimeout(() => {
                            card.style.transform = 'translateY(0) scale(1)';
                        }, index * 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px) scale(0.95)';
                        
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
                
                // Show results count
                showFilterResults(visibleCount, filterValue);
                
                // Restore grid opacity
                setTimeout(() => {
                    productsGrid.style.opacity = '1';
                }, 200);
                
            }, 100);
        });
    });
}

// Show filter results count
function showFilterResults(count, filterType) {
    const resultsText = document.querySelector('.filter-results');
    
    if (!resultsText) {
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'filter-results';
        resultsDiv.style.cssText = `
            text-align: center;
            margin: 1rem 0;
            color: var(--gold);
            font-weight: 600;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const productsSection = document.querySelector('.products');
        const productsGrid = productsSection.querySelector('.products-grid');
        productsSection.insertBefore(resultsDiv, productsGrid);
    }
    
    const filterNames = {
        'all': 'جميع المنتجات',
        'coco-phoenix': 'كوكو فينيكس',
        'one-nation': 'ون نيشن',
        'premium': 'المنتجات الفاخرة'
    };
    
    const name = filterNames[filterType] || filterType;
    resultsText.textContent = `تم العثور على ${count} منتج${count > 1 ? 'ات' : ''} في ${name}`;
    resultsText.style.opacity = '1';
}

// Scroll Animations
function initScrollAnimations() {
    // Simple approach: add animation class after a small delay
    const animateElements = document.querySelectorAll('.product-card, .feature-card, .certificate-item, .contact-item');
    
    // Add initial visibility
    animateElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.display = 'block';
    });
    
    // Add staggered animations
    animateElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('fade-in-up');
        }, index * 100); // Stagger by 100ms
    });
}

// Touch-friendly product interactions
function initTouchInteractions() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        let touchStartTime = 0;
        let touchEndTime = 0;
        
        card.addEventListener('touchstart', (e) => {
            touchStartTime = new Date().getTime();
            card.style.transform = 'scale(0.98)';
        });
        
        card.addEventListener('touchend', (e) => {
            touchEndTime = new Date().getTime();
            const touchDuration = touchEndTime - touchStartTime;
            
            // Reset scale
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 150);
            
            // If it's a quick tap (less than 200ms), treat as click
            if (touchDuration < 200) {
                // Add a subtle animation
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = 'scale(1)';
                }, 100);
            }
        });
        
        card.addEventListener('touchcancel', () => {
            card.style.transform = 'scale(1)';
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            // Simple validation
            if (!name || !email || !phone || !message) {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('جاري إرسال الرسالة...', 'info');
            
            setTimeout(() => {
                showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً', 'success');
                contactForm.reset();
            }, 2000);
        });
    }
}

// Mobile Menu Toggle
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Handle swipe to close on mobile
        let startX = 0;
        let startY = 0;
        
        navMenu.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        navMenu.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const diffX = startX - e.touches[0].clientX;
            const diffY = startY - e.touches[0].clientY;
            
            // If horizontal swipe is greater than vertical and significant
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            startX = 0;
            startY = 0;
        });
    }
}

// Loading Animations
function initLoadingAnimations() {
    const loadingElements = document.querySelectorAll('.loading');
    
    const loadingObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
            }
        });
    }, { threshold: 0.1 });
    
    loadingElements.forEach(el => {
        loadingObserver.observe(el);
    });
}

// Parallax Effects - DISABLED for stability
function initParallaxEffects() {
    // Disabled parallax effects to prevent background movement
    // This ensures the website stays completely still
    console.log('Parallax effects disabled for stability');
}

// Language Toggle Function
function toggleLanguage() {
    const currentLang = document.documentElement.lang;
    const isArabic = currentLang === 'ar';
    
    if (isArabic) {
        // Switch to English
        document.documentElement.lang = 'en';
        document.documentElement.dir = 'ltr';
        translateToEnglish();
    } else {
        // Switch to Arabic
        document.documentElement.lang = 'ar';
        document.documentElement.dir = 'rtl';
        translateToArabic();
    }
}

// Translation Functions
function translateToEnglish() {
    const translations = {
        'الرئيسية': 'Home',
        'من نحن': 'About Us',
        'منتجاتنا': 'Our Products',
        'لماذا نحن': 'Why Us',
        'اتصل بنا': 'Contact Us',
        'تصفح المنتجات': 'Browse Products',
        'نخدم أكثر من ٣٠ دولة بجودة معتمدة وتميز مستمر': 'Serving over 30 countries with certified quality and continuous excellence',
        'الفحم الطبيعي الفاخر وإكسسوارات الأركيلة': 'Premium Natural Charcoal and Hookah Accessories',
        'منتجاتنا المميزة': 'Our Featured Products',
        'كوكو فينيكس': 'Coco Phoenix',
        'فحم طبيعي فاخر': 'Premium Natural Charcoal',
        'ستار باز': 'Star Bazz',
        'جودة عالية مضمونة': 'Guaranteed High Quality',
        'ون نيشن': 'One Nation',
        'فحم طبيعي مميز': 'Distinguished Natural Charcoal',
        'شهادة الجودة': 'Quality Certificate',
        'معتمد من الهيئات الدولية': 'Certified by International Bodies',
        'جودة معتمدة': 'Certified Quality',
        'أعلى معايير الجودة العالمية': 'Highest International Quality Standards',
        'انتشار عالمي': 'Global Reach',
        'أكثر من 30 دولة': 'Over 30 Countries',
        'من نحن؟': 'Who Are We?',
        'أكثر من ١٨ عاماً من التميز في الفحم الطبيعي والإكسسوارات': 'Over 18 years of excellence in natural charcoal and accessories',
        'نحن شركة STAR BAZZ، نفتخر بخدمة عملائنا في أكثر من 30 دولة حول العالم منذ عام 2005. نقدم أجود أنواع الفحم الطبيعي وإكسسوارات الأركيلة بأسعار تنافسية وجودة عالية.': 'We are STAR BAZZ company, proud to serve our customers in over 30 countries worldwide since 2005. We offer the finest natural charcoal and hookah accessories at competitive prices and high quality.',
        'موثوقون من عملاء في أكثر من ٣٠ دولة': 'Trusted by customers in over 30 countries',
        'جودة معتمدة يمكنك الاعتماد عليها': 'Certified quality you can rely on',
        'سرعة ودقة في التوصيل': 'Fast and accurate delivery',
        'جميع المنتجات': 'All Products',
        'مكعبات الفحم': 'Charcoal Cubes',
        'إكسسوارات الأركيلة': 'Hookah Accessories',
        'العلامات التجارية': 'Brands',
        'طبيعي 100%': '100% Natural',
        'طويل الاشتعال': 'Long Burning',
        'رماد منخفض': 'Low Ash',
        'اشتعال سريع': 'Fast Ignition',
        'حرارة مثالية': 'Perfect Heat',
        'مميز': 'Distinguished',
        'جودة عالية': 'High Quality',
        'تصميم فاخر': 'Luxury Design',
        'أسعار تنافسية': 'Competitive Prices',
        'لماذا تختار STAR BAZZ؟': 'Why Choose STAR BAZZ?',
        'نقدم أعلى معايير الجودة العالمية مع شهادات الاعتماد الرسمية': 'We provide the highest international quality standards with official certifications',
        'نخدم أكثر من 30 دولة حول العالم بخبرة 18 عاماً': 'We serve over 30 countries worldwide with 18 years of experience',
        'نضمن وصول منتجاتنا بسرعة ودقة إلى جميع أنحاء العالم': 'We ensure fast and accurate delivery of our products worldwide',
        'جميع منتجاتنا طبيعية 100% وصديقة للبيئة': 'All our products are 100% natural and environmentally friendly',
        'العنوان': 'Address',
        'تركيا - إسطنبول': 'Turkey - Istanbul',
        'الهاتف': 'Phone',
        'البريد الإلكتروني': 'Email',
        'تواصل معنا عبر واتساب': 'Contact us via WhatsApp',
        'الاسم الكامل': 'Full Name',
        'البريد الإلكتروني': 'Email',
        'رقم الهاتف': 'Phone Number',
        'رسالتك': 'Your Message',
        'إرسال الرسالة': 'Send Message',
        'روابط سريعة': 'Quick Links',
        'تواصل معنا': 'Contact Us',
        'جميع الحقوق محفوظة': 'All Rights Reserved'
    };
    
    updatePageContent(translations);
}

function translateToArabic() {
    const translations = {
        'Home': 'الرئيسية',
        'About Us': 'من نحن',
        'Our Products': 'منتجاتنا',
        'Why Us': 'لماذا نحن',
        'Contact Us': 'اتصل بنا',
        'Browse Products': 'تصفح المنتجات',
        'Serving over 30 countries with certified quality and continuous excellence': 'نخدم أكثر من ٣٠ دولة بجودة معتمدة وتميز مستمر',
        'Premium Natural Charcoal and Hookah Accessories': 'الفحم الطبيعي الفاخر وإكسسوارات الأركيلة',
        'Our Featured Products': 'منتجاتنا المميزة',
        'Coco Phoenix': 'كوكو فينيكس',
        'Premium Natural Charcoal': 'فحم طبيعي فاخر',
        'Star Bazz': 'ستار باز',
        'Guaranteed High Quality': 'جودة عالية مضمونة',
        'One Nation': 'ون نيشن',
        'Distinguished Natural Charcoal': 'فحم طبيعي مميز',
        'Quality Certificate': 'شهادة الجودة',
        'Certified by International Bodies': 'معتمد من الهيئات الدولية',
        'Certified Quality': 'جودة معتمدة',
        'Highest International Quality Standards': 'أعلى معايير الجودة العالمية',
        'Global Reach': 'انتشار عالمي',
        'Over 30 Countries': 'أكثر من 30 دولة',
        'Who Are We?': 'من نحن؟',
        'Over 18 years of excellence in natural charcoal and accessories': 'أكثر من ١٨ عاماً من التميز في الفحم الطبيعي والإكسسوارات',
        'We are STAR BAZZ company, proud to serve our customers in over 30 countries worldwide since 2005. We offer the finest natural charcoal and hookah accessories at competitive prices and high quality.': 'نحن شركة STAR BAZZ، نفتخر بخدمة عملائنا في أكثر من 30 دولة حول العالم منذ عام 2005. نقدم أجود أنواع الفحم الطبيعي وإكسسوارات الأركيلة بأسعار تنافسية وجودة عالية.',
        'Trusted by customers in over 30 countries': 'موثوقون من عملاء في أكثر من ٣٠ دولة',
        'Certified quality you can rely on': 'جودة معتمدة يمكنك الاعتماد عليها',
        'Fast and accurate delivery': 'سرعة ودقة في التوصيل',
        'All Products': 'جميع المنتجات',
        'Charcoal Cubes': 'مكعبات الفحم',
        'Hookah Accessories': 'إكسسوارات الأركيلة',
        'Brands': 'العلامات التجارية',
        '100% Natural': 'طبيعي 100%',
        'Long Burning': 'طويل الاشتعال',
        'Low Ash': 'رماد منخفض',
        'Fast Ignition': 'اشتعال سريع',
        'Perfect Heat': 'حرارة مثالية',
        'Distinguished': 'مميز',
        'High Quality': 'جودة عالية',
        'Luxury Design': 'تصميم فاخر',
        'Competitive Prices': 'أسعار تنافسية',
        'Why Choose STAR BAZZ?': 'لماذا تختار STAR BAZZ؟',
        'We provide the highest international quality standards with official certifications': 'نقدم أعلى معايير الجودة العالمية مع شهادات الاعتماد الرسمية',
        'We serve over 30 countries worldwide with 18 years of experience': 'نخدم أكثر من 30 دولة حول العالم بخبرة 18 عاماً',
        'We ensure fast and accurate delivery of our products worldwide': 'نضمن وصول منتجاتنا بسرعة ودقة إلى جميع أنحاء العالم',
        'All our products are 100% natural and environmentally friendly': 'جميع منتجاتنا طبيعية 100% وصديقة للبيئة',
        'Address': 'العنوان',
        'Turkey - Istanbul': 'تركيا - إسطنبول',
        'Phone': 'الهاتف',
        'Email': 'البريد الإلكتروني',
        'Contact us via WhatsApp': 'تواصل معنا عبر واتساب',
        'Full Name': 'الاسم الكامل',
        'Phone Number': 'رقم الهاتف',
        'Your Message': 'رسالتك',
        'Send Message': 'إرسال الرسالة',
        'Quick Links': 'روابط سريعة',
        'Contact Us': 'تواصل معنا',
        'All Rights Reserved': 'جميع الحقوق محفوظة'
    };
    
    updatePageContent(translations);
}

// Update page content with translations
function updatePageContent(translations) {
    const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, input, textarea, label');
    
    elements.forEach(element => {
        const text = element.textContent || element.placeholder || element.value;
        if (translations[text]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[text];
            } else {
                element.textContent = translations[text];
            }
        }
    });
    
    // Update language button text
    const langButton = document.querySelector('.language-switch button span');
    if (langButton) {
        langButton.textContent = document.documentElement.lang === 'ar' ? 'EN' : 'AR';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(17, 17, 17, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.3)';
    } else {
        header.style.background = 'rgba(17, 17, 17, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Product card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Add loading class to elements
document.addEventListener('DOMContentLoaded', function() {
    const elementsToAnimate = document.querySelectorAll('.product-card, .feature-card, .certificate-item');
    elementsToAnimate.forEach(el => {
        el.classList.add('loading');
    });
});

// Smooth reveal animation for sections
const revealSections = function() {
    const sections = document.querySelectorAll('section');
    
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section--revealed');
                observer.unobserve(entry.target);
            }
        });
    };
    
    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15,
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
        section.classList.add('section--hidden');
    });
};

// Initialize reveal sections
revealSections();

// Add CSS for section animations
const style = document.createElement('style');
style.textContent = `
    .section--hidden {
        opacity: 0;
        transform: translateY(8rem);
        transition: all 1s;
    }
    
    .section--revealed {
        opacity: 1;
        transform: translateY(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.7;
    }
`;
document.head.appendChild(style); 