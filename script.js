/**
 * PSHS-BRC Promenade Website - Fixed JavaScript
 * Handles slideshows, navigation, and interactive elements
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ DOM loaded, initializing app...');

    // ========== HERO SLIDESHOW ==========
    setupHeroSlideshow();

    // ========== VILLA CACERES SLIDESHOW ==========
    setupCaceresSlideshow();

    // ========== ATTIRE SLIDERS ==========
    setupAttireSliders();

    // ========== NAVIGATION & PANEL SWITCHING ==========
    setupNavigation();

    console.log('✓ All features initialized');
});

/**
 * Hero/Picture Slideshow
 * Crossfades between background images every 7 seconds
 * Detects device orientation (portrait/landscape) and uses appropriate image set
 */
function setupHeroSlideshow() {
    const slideshowEl = document.querySelector('#pictures-slideshow');
    if (!slideshowEl) {
        console.warn('⚠ Hero slideshow element not found');
        return;
    }

    const layers = Array.from(slideshowEl.querySelectorAll('.slideshow-bg'));
    if (layers.length < 2) {
        console.warn('⚠ Slideshow layers not found. Expected 2, got:', layers.length);
        return;
    }

    // Define image sets for different orientations
    const portraitImages = [
        'images/portrait/slide1.png',
        'images/portrait/slide2.png',
        'images/portrait/slide3.png',
        'images/portrait/slide4.png',
        'images/portrait/slide5.png',
        'images/portrait/slide6.png',
        'images/portrait/slide7.png',
        'images/portrait/slide8.png',
        'images/portrait/slide9.png',
    ];

    const landscapeImages = [
        'images/landscape/slide1.jpg',
        'images/landscape/slide2.jpg',
        'images/landscape/slide3.jpg',
        'images/landscape/slide4.png',
        'images/landscape/slide5.jpg',
        'images/landscape/slide6.jpg',
        'images/landscape/slide7.jpg',
        'images/landscape/slide8.jpg',
        'images/landscape/slide9.jpg',
        'images/landscape/slide10.jpg',
    ];

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;
    let currentImages = portraitImages; // Default to portrait
    let heroInterval = null;

    /**
     * Determine device orientation
     * Returns 'portrait' or 'landscape' based on window dimensions
     */
    const getOrientation = () => {
        if (window.matchMedia('(orientation: portrait)').matches) {
            return 'portrait';
        } else {
            return 'landscape';
        }
    };

    /**
     * Get appropriate image set based on current orientation
     */
    const getImageSet = () => {
        return getOrientation() === 'portrait' ? portraitImages : landscapeImages;
    };

    /**
     * Initialize slideshow with current orientation images
     */
    const initializeSlideshow = () => {
        currentImages = getImageSet();
        current = 0;

        layers[0].style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${currentImages[0]}")`;
        layers[0].classList.add('visible');
        layers[1].style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${currentImages[1 % currentImages.length]}")`;

        const orientation = getOrientation();
        console.log(`✓ Hero slideshow initialized in ${orientation} mode with ${currentImages.length} images`);
    };

    /**
     * Start the slideshow interval
     */
    const startSlideshow = () => {
        if (prefersReduced) {
            console.log('✓ Reduced motion enabled - slideshow disabled');
            return;
        }

        // Clear existing interval if any to prevent duplicate intervals
        if (heroInterval) {
            clearInterval(heroInterval);
            console.log('► Cleared previous slideshow interval');
        }

        // Change image every 7 seconds
        heroInterval = setInterval(() => {
            // Safety check: ensure layers still exist
            if (!layers || layers.length < 2) {
                console.warn('⚠ Slideshow layers lost, clearing interval');
                clearInterval(heroInterval);
                return;
            }

            const next = (current + 1) % currentImages.length;
            const visibleLayer = layers.find(l => l.classList.contains('visible'));
            const hiddenLayer = layers.find(l => !l.classList.contains('visible'));

            // Ensure both layers exist before updating
            if (visibleLayer && hiddenLayer) {
                hiddenLayer.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${currentImages[next]}")`;
                hiddenLayer.classList.add('visible');
                visibleLayer.classList.remove('visible');
                current = next;
            }
        }, 7000);

        // Store interval ID for cleanup
        window.heroSlideInterval = heroInterval;
        console.log(`✓ Slideshow interval started (${currentImages.length} images, 7s interval)`);
    };

    // Initialize slideshow
    initializeSlideshow();
    startSlideshow();

    // Listen for orientation changes (handles device rotation)
    window.addEventListener('orientationchange', () => {
        console.log('► Device orientation changed, reinitializing slideshow...');
        initializeSlideshow();
        startSlideshow();
    });

    // Also listen for resize events to catch orientation changes on desktop
    let lastOrientation = getOrientation();
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newOrientation = getOrientation();

            // Only reinitialize if orientation actually changed
            if (lastOrientation !== newOrientation) {
                console.log(`► Orientation changed: ${lastOrientation} → ${newOrientation}, reinitializing slideshow...`);
                lastOrientation = newOrientation;
                initializeSlideshow();
                startSlideshow();
            }
        }, 250); // Debounce to avoid excessive reinitializations
    });
}

/**
 * Villa Caceres Background Slideshow
 * Crossfades between venue images every 5 seconds
 */
function setupCaceresSlideshow() {
    const container = document.querySelector('#caceres-slideshow');
    if (!container) {
        console.warn('⚠ Caceres slideshow container not found');
        return;
    }

    const layers = Array.from(container.querySelectorAll('.caceres-bg'));
    if (layers.length < 2) {
        console.warn('⚠ Caceres layers not found. Expected 2, got:', layers.length);
        return;
    }

    const images = [
        'images/villa caceres/slide1.jpeg',
        'images/villa caceres/slide2.jpeg',
        'images/villa caceres/slide3.jpeg',
        'images/villa caceres/slide4.jpeg',
        'images/villa caceres/slide5.jpeg',
        'images/villa caceres/slide6.jpeg'
    ];

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;

    // Initialize first two layers
    layers[0].style.backgroundImage = `url("${images[0]}")`;
    layers[0].classList.add('visible');
    layers[1].style.backgroundImage = `url("${images[1 % images.length]}")`;

    console.log('✓ Caceres slideshow initialized with', images.length, 'images');

    if (prefersReduced) return;

    // Change image every 5 seconds
    const caceresInterval = setInterval(() => {
        const next = (current + 1) % images.length;
        const visibleLayer = layers.find(l => l.classList.contains('visible'));
        const hiddenLayer = layers.find(l => !l.classList.contains('visible'));

        hiddenLayer.style.backgroundImage = `url("${images[next]}")`;
        hiddenLayer.classList.add('visible');
        visibleLayer.classList.remove('visible');

        current = next;
    }, 5000);

    window.caceresSlideInterval = caceresInterval;
}

/**
 * Attire Sliders
 * Handles click, keyboard, and swipe navigation for boys/girls attire galleries
 */
function setupAttireSliders() {
    const sliders = Array.from(document.querySelectorAll('.attire-slider'));
    if (!sliders.length) {
        console.warn('⚠ No attire sliders found');
        return;
    }

    const imagesFor = {
        boys: [
            'images/attire/boys1.png',
            'images/attire/boys2.png',
            'images/attire/boys3.png',
            'images/attire/boys4.png',
            'images/attire/boys5.png',
            'images/attire/boys6.png',
            'images/attire/boys7.png',
            'images/attire/boys8.png'
        ],
        girls: [
            'images/attire/girls.png',
            'images/attire/girls1.png',
            'images/attire/girls2.png',
            'images/attire/girls4.png',
            'images/attire/girls5.jpg',
            'images/attire/girls6.png',
            'images/attire/girls7.png'
        ]
    };

    sliders.forEach(slider => {
        const gender = slider.dataset.gender || 'boys';
        const imgs = imagesFor[gender] || imagesFor.boys;
        let index = 0;

        const imgEl = slider.querySelector('.attire-current');
        const prevBtn = slider.querySelector('.attire-prev');
        const nextBtn = slider.querySelector('.attire-next');

        const setImage = (i) => {
            index = ((i % imgs.length) + imgs.length) % imgs.length;
            if (imgEl) imgEl.src = imgs[index];
        };

        // Click handlers
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                setImage(index + 1);
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                setImage(index - 1);
            });
        }

        // Keyboard navigation
        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                setImage(index + 1);
            }
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setImage(index - 1);
            }
        });

        // Touch swipe detection
        let touchStartX = null;
        slider.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length) touchStartX = e.touches[0].clientX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            if (touchStartX === null) return;
            const touchEndX = (e.changedTouches && e.changedTouches[0]) 
                ? e.changedTouches[0].clientX 
                : null;
            if (touchEndX === null) return;

            const dx = touchEndX - touchStartX;
            const THRESHOLD = 40; // pixels

            if (dx > THRESHOLD) {
                // Swipe right -> next image
                setImage(index + 1);
            } else if (dx < -THRESHOLD) {
                // Swipe left -> previous image
                setImage(index - 1);
            }
            touchStartX = null;
        });

        // Initialize
        setImage(0);
    });

    console.log('✓ Attire sliders initialized');
}

/**
 * Navigation & Panel Switching
 * Handles nav button clicks and panel display logic
 */
function setupNavigation() {
    const navButtons = document.querySelectorAll('#navbar button, .nav-button');
    const panels = document.querySelectorAll('#content .panel, [data-panel]');

    if (!navButtons.length || !panels.length) {
        console.warn('⚠ Navigation elements not found. Buttons:', navButtons.length, 'Panels:', panels.length);
        return;
    }

    console.log('✓ Navigation setup: ', navButtons.length, 'buttons,', panels.length, 'panels');

    /**
     * Show specific panel by ID
     */
    const showPanel = (id) => {
        panels.forEach(panel => {
            const panelId = panel.id || panel.dataset.panel;
            if (panelId === id) {
                panel.style.display = 'block';
                console.log('► Panel shown:', id);
            } else {
                panel.style.display = 'none';
            }
        });
    };

    /**
     * Animate panel children with staggered fade-up
     */
    const animatePanel = (panel) => {
        if (!panel) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const elements = [panel, ...panel.querySelectorAll('*')];
        const duration = 360; // ms
        const stagger = 60; // ms per element

        elements.forEach((el, i) => {
            el.style.animation = `fadeUp ${duration}ms cubic-bezier(.2,.9,.2,1) ${i * stagger}ms both`;
        });

        // Clean up animations after completion
        const totalTime = duration + elements.length * stagger + 50;
        setTimeout(() => {
            elements.forEach(el => {
                el.style.animation = '';
            });
        }, totalTime);
    };

    // Show first panel by default
    if (panels.length) {
        const firstPanelId = panels[0].id || panels[0].dataset.panel;
        showPanel(firstPanelId);
        if (navButtons.length) navButtons[0].classList.add('selected');
        animatePanel(panels[0]);
    }

    // Add click listeners to all nav buttons
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.target;
            if (!target) {
                console.warn('⚠ No data-target attribute on button', button);
                return;
            }

            // Show the target panel
            showPanel(target);

            // Find and animate the shown panel
            const shownPanel = Array.from(panels).find(p => {
                return (p.id === target || p.dataset.panel === target);
            });

            if (shownPanel) {
                animatePanel(shownPanel);
            }

            // Update button styles
            navButtons.forEach(b => {
                b.classList.toggle('selected', b === button);
            });

            // Smooth scroll button into view on mobile
            if (window.innerWidth < 768 && button.scrollIntoView) {
                button.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        });
    });
}

console.log('✓ Script loaded successfully');
