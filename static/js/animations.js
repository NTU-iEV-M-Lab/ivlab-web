// Progressive enhancement: nothing is hidden until the local animation engine is ready.
(async () => {
  'use strict';
  const root = document.documentElement;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preference.matches) { root.dataset.motionEngine = 'reduced'; return; }
  if (!Element.prototype.animate || !('IntersectionObserver' in window)) {
    root.dataset.motionEngine = 'static';
    return;
  }

  try {
    const { animate } = await import('./vendor/motion-mini-14.7.1.js');
    if (preference.matches) { root.dataset.motionEngine = 'reduced'; return; }
    root.dataset.motionEngine = 'motion-mini-14.7.1';

    const active = new Map();
    const seen = new WeakSet();
    const pending = new Map();
    const easing = [0.16, 1, 0.3, 1];

    const restore = (element, entry) => {
      if (active.get(element) !== entry) return;
      entry.control.cancel();
      for (const [property, value] of Object.entries(entry.original)) {
        if (value) element.style.setProperty(property, value);
        else element.style.removeProperty(property);
      }
      element.dataset.motionState = 'done';
      active.delete(element);
    };

    const play = (element, options = {}) => {
      if (!element || preference.matches || element.querySelector('iframe')) return;
      const previous = active.get(element);
      if (previous) restore(element, previous);
      const original = {
        opacity: element.style.getPropertyValue('opacity'),
        transform: element.style.getPropertyValue('transform')
      };
      // Keep sideways reveals inside the viewport even at narrow responsive breakpoints.
      const bounds = element.getBoundingClientRect();
      const requestedX = options.x ?? 0;
      const x = requestedX > 0
        ? Math.min(requestedX, Math.max(0, root.clientWidth - bounds.right - 8))
        : Math.max(requestedX, Math.min(0, 8 - bounds.left));
      const control = animate(element, {
        opacity: [options.opacity ?? 0.72, 1],
        transform: ['translate3d(' + x + 'px,' + (options.distance ?? 16) + 'px,0)', 'none']
      }, {
        duration: options.duration ?? 0.64,
        delay: options.delay ?? 0,
        ease: easing
      });
      const entry = { control, original };
      active.set(element, entry);
      element.dataset.motionState = 'running';
      control.then(() => restore(element, entry));
    };

    const reveal = (element, options = {}) => {
      if (!element || seen.has(element)) return;
      seen.add(element);
      play(element, options);
    };

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        reveal(entry.target, pending.get(entry.target));
        pending.delete(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -16px 0px' });

    const onView = (selector, options = {}) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        const resolved = typeof options === 'function' ? options(index) : options;
        pending.set(element, resolved);
        observer.observe(element);
      });
    };

    // A short hierarchy of entrances follows the editorial composition, without splitting words.
    [
      ['.hero-copy .eyebrow', { duration: 0.5, distance: 10, opacity: 0.85 }],
      ['.hero-institution', { duration: 0.55, delay: 0.04, distance: 12 }],
      ['.hero-links', { duration: 0.6, delay: 0.18, distance: 12, opacity: 0.85 }],
      ['.hero-photo', { duration: 0.9, delay: 0.16, distance: 26, opacity: 0.85 }],
      ['.hero-photo-secondary', { duration: 0.8, delay: 0.27, distance: 18, opacity: 0.85 }],
      ['.page-heading h1', { duration: 0.6, distance: 16, opacity: 0.8 }],
      ['.heading-rule', { duration: 0.55, delay: 0.1, distance: 0, x: -12 }]
    ].forEach(([selector, options]) => {
      document.querySelectorAll(selector).forEach(element => reveal(element, options));
    });
    document.querySelectorAll('.hero-title-line').forEach((line, index) => {
      reveal(line, { duration: 0.8, delay: 0.07 + index * 0.09, distance: 24, opacity: 0.7 });
    });

    // Alternating directions gently express the layout. iframe ancestors are always excluded.
    onView('.page-home .page-content article > div:first-child', index => ({ x: index % 2 ? -18 : 18, distance: 14, opacity: 0.8 }));
    onView('.page-home .card-carousel', { x: -18, distance: 20, delay: 0.06, opacity: 0.85 });
    onView('.page-professor .page-content > div', index => ({ delay: index * 0.05, distance: 16, opacity: 0.85 }));
    onView('.page-research .page-content .pr4-l > div', index => ({ x: index % 2 ? 14 : -14, distance: 14, opacity: 0.85 }));
    onView('.page-research .pr4-l + div > .flex > div, .page-research .pr4-l + div > .mb4, .page-research .pr4-l + div > div:last-child', index => ({ x: index % 2 ? 16 : -16, distance: 20, delay: (index % 2) * 0.08, opacity: 0.85 }));
    onView('.page-projects .page-content article', index => ({ delay: (index % 3) * 0.04, distance: 16, opacity: 0.85 }));
    onView('.page-content > h2, .page-publication .page-content h2', { distance: 8, duration: 0.5, opacity: 0.9 });

    onView('.member-visual', { duration: 0.75, x: -16, distance: 8, opacity: 0.9 });
    onView('.member-roster > h2', { duration: 0.55, distance: 10, delay: 0.06, opacity: 0.8 });
    onView('.member-roster .people-group h3', index => ({ delay: index * 0.04, distance: 6, duration: 0.45, opacity: 0.8 }));
    document.querySelectorAll('.member-roster .people-grid').forEach(list => {
      Array.from(list.children).forEach((element, index) => {
        pending.set(element, { delay: index * 0.018, distance: 5, duration: 0.42, opacity: 0.8 });
        observer.observe(element);
      });
    });

    // The image track and caption react to the same user action; rapid clicks cancel old effects.
    document.addEventListener('lab:slide-change', event => {
      const metadata = event.target.parentElement.querySelector('.gallery-meta');
      metadata?.querySelectorAll('span').forEach(element => play(element, { duration: 0.26, distance: 4, opacity: 0.6 }));
    });

    const finishAll = () => {
      if (!preference.matches) return;
      observer.disconnect();
      pending.clear();
      for (const [element, entry] of active) {
        entry.control.complete();
        restore(element, entry);
      }
      root.dataset.motionEngine = 'reduced';
    };
    preference.addEventListener('change', finishAll);
    window.addEventListener('pagehide', () => {
      observer.disconnect();
      for (const [element, entry] of active) restore(element, entry);
    }, { once: true });
  } catch {
    // A failed optional module must not affect content, navigation or the galleries.
    root.dataset.motionEngine = 'unavailable';
  }
})();
