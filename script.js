document.addEventListener('DOMContentLoaded', () => {
    // Slideshow: crossfade between two background layers every 5s
    (function setupSlideshow(){
        const slideshowEl = document.querySelector('#pictures-slideshow');
        if (!slideshowEl) return;

        const layers = Array.from(slideshowEl.querySelectorAll('.slideshow-bg'));
        // If layers are not present, do nothing
        if (layers.length < 2) return;

        const images = [
            'images/slide1.jpg',
            'images/slide2.jpg',
            'images/slide3.jpg',
            'images/slide4.png',
            'images/slide5.jpg',
            'images/slide6.jpg',
            'images/slide7.jpg',
            'images/slide8.jpg',
            'images/slide9.jpg',
            'images/slide10.jpg',
        ];

        // Respect reduced-motion preference
        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; //waht??? di ko gets sarili kong logic 1 day later

        // initialize
        let current = 0;
        layers[0].style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${images[0]}")`;
        layers[0].classList.add('visible');
        layers[1].style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${images[1 % images.length]}")`;

        if (prefersReduced) return; // don't animate

        setInterval(() => {
            const next = (current + 1) % images.length;
            const visibleLayer = layers.find(l => l.classList.contains('visible'));
            const hiddenLayer = layers.find(l => !l.classList.contains('visible'));

            // put next image into hidden layer, then crossfade
            hiddenLayer.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("${images[next]}")`;

            // trigger crossfade
            hiddenLayer.classList.add('visible');
            visibleLayer.classList.remove('visible');

            current = next;
        }, 7000);
    })();

    // Villa Caceres slideshow (uses images in /images/villa caceres)
    (function setupCaceresSlideshow(){
        const container = document.querySelector('#caceres-slideshow');
        if (!container) return;

        const layers = Array.from(container.querySelectorAll('.caceres-bg'));
        if (layers.length < 2) return;

        const images = [
            'images/villa caceres/slide1.jpeg',
            'images/villa caceres/slide2.jpeg',
            'images/villa caceres/slide3.jpeg',
            'images/villa caceres/slide4.jpeg',
            'images/villa caceres/slide5.jpeg',
            'images/villa caceres/slide6.jpeg'
        ];

        const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let current = 0;
        // initialize first two layers
        layers[0].style.backgroundImage = `url("${images[0]}")`;
        layers[0].classList.add('visible');
        layers[1].style.backgroundImage = `url("${images[1 % images.length]}")`;

        if (prefersReduced) return;

        setInterval(() => {
            const next = (current + 1) % images.length;
            const visibleLayer = layers.find(l => l.classList.contains('visible'));
            const hiddenLayer = layers.find(l => !l.classList.contains('visible'));

            hiddenLayer.style.backgroundImage = `url("${images[next]}")`;
            hiddenLayer.classList.add('visible');
            visibleLayer.classList.remove('visible');

            current = next;
        }, 5000); // change every 5s as requested
    })();

    // Attire sliders: swipe right / click to advance images for boys and girls
    (function setupAttireSliders(){
        const sliders = Array.from(document.querySelectorAll('.attire-slider'));
        if (!sliders.length) return;

        // image lists
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
                index = (i + imgs.length) % imgs.length;
                if (imgEl) imgEl.src = imgs[index];
            };

            // click handlers
            if (nextBtn) nextBtn.addEventListener('click', (e)=>{ e.stopPropagation(); setImage(index+1); });
            if (prevBtn) prevBtn.addEventListener('click', (e)=>{ e.stopPropagation(); setImage(index-1); });

            // keyboard navigation when focused
            slider.addEventListener('keydown', (e)=>{
                if (e.key === 'ArrowRight') setImage(index+1);
                if (e.key === 'ArrowLeft') setImage(index-1);
            });

            // touch swipe: user asked for swipe right to view images -> treat right swipe as NEXT
            let touchStartX = null;
            slider.addEventListener('touchstart', (e)=>{
                if (e.touches && e.touches.length) touchStartX = e.touches[0].clientX;
            }, {passive: true});
            slider.addEventListener('touchend', (e)=>{
                if (touchStartX === null) return;
                const touchEndX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : null;
                if (touchEndX === null) return;
                const dx = touchEndX - touchStartX;
                const THRESH = 40; // px
                if (dx > THRESH) {
                    // swipe right -> NEXT (per your request)
                    setImage(index+1);
                } else if (dx < -THRESH) {
                    // swipe left -> PREV
                    setImage(index-1);
                }
                touchStartX = null;
            });

            // init
            setImage(0);
        });
    })();

    const openBtn = document.querySelector('#title button'); // the "Open Invitation" button
    const secondPanel = document.querySelector('#stack > .panel:nth-child(2)');

    if (openBtn && secondPanel) {
    openBtn.addEventListener('click', (e) => {
        // optional: prevent default if button is inside a <form>
        if (e && typeof e.preventDefault === 'function') e.preventDefault();

        // Use scrollIntoView for a more robust smooth scroll
        try {
        secondPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // move focus to the panel for accessibility
        if (typeof secondPanel.focus === 'function') secondPanel.focus();
        } catch (err) {
        // fallback: compute absolute Y and use window.scrollTo
        const targetY = secondPanel.getBoundingClientRect().top + (window.pageYOffset || window.scrollY || 0);
        window.scrollTo({ top: Math.round(targetY), behavior: 'smooth' });
        }
    });

    } else {
    // debug helper: log if selector failed
    if (!openBtn) console.warn('Open Invitation button not found using selector #title button');
    if (!secondPanel) console.warn('Second panel not found using selector #stack > .panel:nth-child(2)');
    }
    const navButtons = document.querySelectorAll('#navbar button');
    const panels = document.querySelectorAll('#content .panel');

    // helper to show the requested panel (fallback to first)
    const showPanel = (id) => {
    panels.forEach(panel => {
        if (panel.id === id) {
        // restore default display (allow CSS to control block behavior)
        panel.style.display = '';
        } else {
        panel.style.display = 'none';
        }
    });
    };

    // animate children of a panel with a small fade-up stagger
    const animatePanel = (panel) => {
    if (!panel) return;
    // Respect user preference for reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Include the panel itself first so text-only panels animate
    const elems = [panel].concat(Array.from(panel.querySelectorAll('*')));
    const duration = 360; // ms
    const stagger = 60; // ms per element

    elems.forEach((el, i) => {
        // apply animation inline so it triggers even when element was display:none
        el.style.animation = `fadeUp ${duration}ms cubic-bezier(.2,.9,.2,1) ${i*stagger}ms both`;
    });
    // clear animation styles after finished
    const total = duration + elems.length * stagger + 50;
    setTimeout(() => {
        elems.forEach(el => el.style.animation = '');
    }, total);
    };

    // show first panel by default
    if (panels.length) {
    showPanel(panels[0].id);
    if (navButtons.length) navButtons[0].classList.add('selected');
    // animate initial panel
    animatePanel(panels[0]);
    }

    navButtons.forEach(button => {
    button.addEventListener('click', () => {
        const target = button.dataset.target;
        if (!target) return console.warn('No data-target on button', button);

        showPanel(target);

    // animate the shown panel's children
    const shown = Array.from(panels).find(p => p.id === target);
    animatePanel(shown);

        // update button styles to show active button
        navButtons.forEach(b => b.classList.toggle('selected', b === button));
    });
    });
});
