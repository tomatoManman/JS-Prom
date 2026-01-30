function setupAudioPlayer() {
    const audio = document.querySelector('#background-music');
    const musicToggle = document.querySelector('.music-toggle');

    if (!audio || !musicToggle) {
        console.warn('⚠ Audio player elements not found');
        return;
    }

    audio.loop = true;
    audio.volume = 0.5;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise
            .then(() => {
                console.log('✓ Background music auto-playing');
                musicToggle.classList.add('playing');
            })
            .catch(error => {
                console.log('⚠ Auto-play blocked by browser. User must click to play.', error);
                musicToggle.classList.add('muted');
            });
    }

    musicToggle.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            musicToggle.classList.add('playing');
            musicToggle.classList.remove('muted');
            console.log('✓ Music playing');
        } else {
            audio.pause();
            musicToggle.classList.remove('playing');
            musicToggle.classList.add('muted');
            console.log('✓ Music paused');
        }
    });
    audio.addEventListener('play', () => {
        musicToggle.classList.add('playing');
        musicToggle.classList.remove('muted');
    });

    audio.addEventListener('pause', () => {
        musicToggle.classList.remove('playing');
        musicToggle.classList.add('muted');
    });

    console.log('✓ Audio player initialized');
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ DOM loaded, initializing app...');

    setupAudioPlayer();
    setupHeroSlideshow();
    setupCaceresSlideshow();
    setupThemeSlideshow();
    setupAttireSliders();
    setupNavigation();

    console.log('✓ All features initialized');
});


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
        'images/portrait/portrait1.jpg',
        'images/portrait/portrait2.jpeg',
        'images/portrait/portrait3.png',
        'images/portrait/portrait4.jpg',
        'images/portrait/portrait5.jpg',
        'images/portrait/portrait6.jpg',
        'images/portrait/portrait7.jpg',
        'images/portrait/portrait8.jpg',
        'images/portrait/portrait9.png',
        'images/portrait/portrait10.png',
    ];

    const landscapeImages = [
        'images/landscape/landscape1.jpg',
        'images/landscape/landscape2.jpg',
        'images/landscape/landscape3.jpg',
        'images/landscape/landscape4.jpg',
        'images/landscape/landscape5.jpg',
    ];

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;
    let currentImages = portraitImages; // Default to portrait
    let heroInterval = null;

    const getOrientation = () => {
        if (window.matchMedia('(orientation: portrait)').matches) {
            return 'portrait';
        } else {
            return 'landscape';
        }
    };

    const getImageSet = () => {
        return getOrientation() === 'portrait' ? portraitImages : landscapeImages;
    };

    const initializeSlideshow = () => {
        currentImages = getImageSet();
        current = 0;

        layers[0].style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${currentImages[0]}")`;
        layers[0].classList.add('visible');
        layers[1].style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${currentImages[1 % currentImages.length]}")`;

        const orientation = getOrientation();
        console.log(`✓ Hero slideshow initialized in ${orientation} mode with ${currentImages.length} images`);
    };

    const startSlideshow = () => {
        if (prefersReduced) {
            console.log('✓ Reduced motion enabled - slideshow disabled');
            return;
        }

        if (heroInterval) {
            clearInterval(heroInterval);
            console.log('► Cleared previous slideshow interval');
        }

        heroInterval = setInterval(() => {
            if (!layers || layers.length < 2) {
                console.warn('⚠ Slideshow layers lost, clearing interval');
                clearInterval(heroInterval);
                return;
            }

            const next = (current + 1) % currentImages.length;
            const visibleLayer = layers.find(l => l.classList.contains('visible'));
            const hiddenLayer = layers.find(l => !l.classList.contains('visible'));

            if (visibleLayer && hiddenLayer) {
                hiddenLayer.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${currentImages[next]}")`;
                hiddenLayer.classList.add('visible');
                visibleLayer.classList.remove('visible');
                current = next;
            }
        }, 7000);

        window.heroSlideInterval = heroInterval;
        console.log(`✓ Slideshow interval started (${currentImages.length} images, 7s interval)`);
    };

    initializeSlideshow();
    startSlideshow();

    window.addEventListener('orientationchange', () => {
        console.log('► Device orientation changed, reinitializing slideshow...');
        initializeSlideshow();
        startSlideshow();
    });

    let lastOrientation = getOrientation();
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newOrientation = getOrientation();

            if (lastOrientation !== newOrientation) {
                console.log(`► Orientation changed: ${lastOrientation} → ${newOrientation}, reinitializing slideshow...`);
                lastOrientation = newOrientation;
                initializeSlideshow();
                startSlideshow();
            }
        }, 250);
    });
}

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

    layers[0].style.backgroundImage = `url("${images[0]}")`;
    layers[0].classList.add('visible');
    layers[1].style.backgroundImage = `url("${images[1 % images.length]}")`;

    console.log('✓ Caceres slideshow initialized with', images.length, 'images');

    if (prefersReduced) return;

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

function setupThemeSlideshow() {
    const slider = document.querySelector('.theme-slideshow');
    if (!slider) {
        console.warn('⚠ Theme slideshow element not found');
        return;
    }

    const images = [
        'images/theme/theme1.jpeg',
        'images/theme/theme2.jpg',
        'images/theme/theme3.jpeg',
        'images/theme/theme4.jpeg',
        'images/theme/theme5.jpeg',
        'images/theme/theme6.jpeg',
        'images/theme/theme7.jpeg',
    ];

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index = 0;
    let themeInterval = null;

    const currentImg = slider.querySelector('.theme-current');
    const nextImg = slider.querySelector('.theme-next-img');
    const prevBtn = slider.querySelector('.theme-prev');
    const nextBtn = slider.querySelector('.theme-next');
    const dotsContainer = slider.querySelector('.theme-dots');

    if (dotsContainer) {
        images.forEach((img, i) => {
            const dot = document.createElement('div');
            dot.className = 'theme-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Image ${i + 1} of ${images.length}`);
            dotsContainer.appendChild(dot);
        });
    }

    const updateDots = () => {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.theme-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    };

    const setImage = (newIndex) => {
        newIndex = ((newIndex % images.length) + images.length) % images.length;
        
        nextImg.src = images[newIndex];
        nextImg.style.opacity = '0';
        
        setTimeout(() => {
            nextImg.style.opacity = '1';
            currentImg.style.opacity = '0';
        }, 10);
        
        setTimeout(() => {
            currentImg.src = images[newIndex];
            currentImg.style.opacity = '1';
            nextImg.style.opacity = '0';
            index = newIndex;
            updateDots();
        }, 1620);
    };

    const startSlideshow = () => {
        if (prefersReduced) {
            console.log('✓ Reduced motion enabled - theme slideshow auto-play disabled');
            return;
        }

        if (themeInterval) {
            clearInterval(themeInterval);
        }

        themeInterval = setInterval(() => {
            setImage(index + 1);
        }, 6000);

        window.themeSlideInterval = themeInterval;
        console.log(`✓ Theme slideshow interval started (${images.length} images, 6s interval)`);
    };

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

    currentImg.src = images[0];
    nextImg.src = images[1];
    updateDots();
    startSlideshow();
    console.log('✓ Theme slideshow initialized with', images.length, 'images');
}

function setupAttireSliders() {
    const sliders = Array.from(document.querySelectorAll('.attire-slider'));
    if (!sliders.length) {
        console.warn('⚠ No attire sliders found');
        return;
    }

    const imagesFor = {
        boys: [
            'images/attire/boys1.jpg',
            'images/attire/boys2.jpg',
            'images/attire/boys3.jpg',
            'images/attire/boys4.jpg',
            'images/attire/boys5.jpg',
            'images/attire/boys6.jpg',
            'images/attire/boys8.jpg',
            'images/attire/boys9.jpg',
            'images/attire/boys10.png',
            'images/attire/boys11.png',
            'images/attire/boys12.png',
            'images/attire/boys13.png',
            'images/attire/boys14.png',
            'images/attire/boys15.png',
        ],
        girls: [
            'images/attire/girls1.jpg',
            'images/attire/girls2.jpg',
            'images/attire/girls4.jpg',
            'images/attire/girls5.jpg',
            'images/attire/girls6.jpg',
            'images/attire/girls7.jpg',
            'images/attire/girls8.jpg',
            'images/attire/girls9.jpg',
        ]
    };

    sliders.forEach(slider => {
        const gender = slider.dataset.gender || 'boys';
        const imgs = imagesFor[gender] || imagesFor.boys;
        let index = 0;

        const imgEl = slider.querySelector('.attire-current');
        const prevBtn = slider.querySelector('.attire-prev');
        const nextBtn = slider.querySelector('.attire-next');
        const dotsContainer = slider.querySelector('.attire-dots');

        if (dotsContainer) {
            imgs.forEach((img, i) => {
                const dot = document.createElement('div');
                dot.className = 'attire-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Image ${i + 1} of ${imgs.length}`);
                dotsContainer.appendChild(dot);
            });
        }

        const updateDots = () => {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.attire-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        const setImage = (i) => {
            index = ((i % imgs.length) + imgs.length) % imgs.length;
            if (imgEl) imgEl.src = imgs[index];
            updateDots();
        };

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

        let touchStartX = null;
        let mouseStartX = null;
        let isDragging = false;

        slider.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length) {
                touchStartX = e.touches[0].clientX;
                isDragging = true;
            }
        }, { passive: true });

        slider.addEventListener('touchmove', (e) => {
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            if (touchStartX === null) return;
            const touchEndX = (e.changedTouches && e.changedTouches[0]) 
                ? e.changedTouches[0].clientX 
                : null;
            if (touchEndX === null) return;

            const dx = touchEndX - touchStartX;
            const THRESHOLD = 40;

            if (dx > THRESHOLD) {
                setImage(index - 1);
            } else if (dx < -THRESHOLD) {
                setImage(index + 1);
            }
            touchStartX = null;
            isDragging = false;
        });
        
        slider.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            isDragging = true;
            slider.style.cursor = 'grabbing';
            e.preventDefault();
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDragging || mouseStartX === null) return;
            slider.style.cursor = 'grabbing';
        });

        slider.addEventListener('mouseup', (e) => {
            if (mouseStartX === null) return;
            const mouseEndX = e.clientX;
            const dx = mouseEndX - mouseStartX;
            const THRESHOLD = 40; 

            if (dx > THRESHOLD) {
                setImage(index + 1);
            } else if (dx < -THRESHOLD) {
                setImage(index - 1);
            }
            mouseStartX = null;
            isDragging = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseleave', () => {
            mouseStartX = null;
            isDragging = false;
            slider.style.cursor = 'grab';
        });

        slider.addEventListener('mouseenter', () => {
            slider.style.cursor = 'grab';
        });

        setImage(0);
    });

    console.log('✓ Attire sliders initialized');
}
function setupNavigation() {
    const navButtons = document.querySelectorAll('#navbar button, .nav-button');
    const panels = document.querySelectorAll('#content .panel, [data-panel]');

    if (!navButtons.length || !panels.length) {
        console.warn('⚠ Navigation elements not found. Buttons:', navButtons.length, 'Panels:', panels.length);
        return;
    }

    console.log('✓ Navigation setup: ', navButtons.length, 'buttons,', panels.length, 'panels');

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

    const animatePanel = (panel) => {
        if (!panel) return;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const elements = [panel, ...panel.querySelectorAll('*')];
        const duration = 360;
        const stagger = 60;

        elements.forEach((el, i) => {
            el.style.animation = `fadeUp ${duration}ms cubic-bezier(.2,.9,.2,1) ${i * stagger}ms both`;
        });

        const totalTime = duration + elements.length * stagger + 50;
        setTimeout(() => {
            elements.forEach(el => {
                el.style.animation = '';
            });
        }, totalTime);
    };

    if (panels.length) {
        const firstPanelId = panels[0].id || panels[0].dataset.panel;
        showPanel(firstPanelId);
        if (navButtons.length) navButtons[0].classList.add('selected');
        animatePanel(panels[0]);
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.target;
            if (!target) {
                console.warn('⚠ No data-target attribute on button', button);
                return;
            }

            showPanel(target);

            const shownPanel = Array.from(panels).find(p => {
                return (p.id === target || p.dataset.panel === target);
            });

            if (shownPanel) {
                animatePanel(shownPanel);
            }

            navButtons.forEach(b => {
                b.classList.toggle('selected', b === button);
            });

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
