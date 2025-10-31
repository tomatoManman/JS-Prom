document.addEventListener('DOMContentLoaded', () => {
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