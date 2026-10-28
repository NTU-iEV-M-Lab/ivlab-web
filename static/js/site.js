(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('primary-menu');
  if (toggle && menu) {
    toggle.hidden = false;
    const closeMenu = (returnFocus = false) => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.dataset.open = 'false';
      if (returnFocus) toggle.focus();
    };
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      toggle.setAttribute('aria-expanded', String(open));
      menu.dataset.open = String(open);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.dataset.open === 'true') closeMenu(true);
    });
    document.addEventListener('click', event => {
      if (menu.dataset.open === 'true' && !event.target.closest('.site-header')) closeMenu();
    });
    menu.addEventListener('click', event => {
      if (event.target.closest('a')) closeMenu();
    });
    const desktop = window.matchMedia('(min-width: 1051px)');
    desktop.addEventListener('change', () => closeMenu(!desktop.matches && menu.contains(document.activeElement)));
  }

  const header = document.querySelector('.site-header');
  const measureHeader = () => {
    if (header) document.documentElement.style.setProperty('--header-height', header.getBoundingClientRect().height + 'px');
  };
  measureHeader();
  if (header && 'ResizeObserver' in window) new ResizeObserver(measureHeader).observe(header);

  // Preserve the existing autoplay behavior, while respecting reduced motion.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const videos = document.querySelectorAll('.page-content video[autoplay]');
  const updateMotion = () => {
    videos.forEach(video => {
      if (reducedMotion.matches) {
        video.autoplay = false;
        video.pause();
      } else {
        video.autoplay = true;
      }
    });
  };
  updateMotion();
  reducedMotion.addEventListener('change', updateMotion);

  // Both galleries use the original image elements and retain previous/next behavior.
  window.createLabGallery = ({ trackId, previousId, nextId, dotsId, dotClass }) => {
    const track = document.getElementById(trackId);
    const previous = document.getElementById(previousId);
    const next = document.getElementById(nextId);
    const dotContainer = document.getElementById(dotsId);
    if (!track || !previous || !next || !dotContainer) return;
    const slides = Array.from(track.children);
    if (!slides.length) return;
    const labels = document.body.dataset;
    const gallery = track.parentElement;
    gallery.setAttribute('role', 'region');
    gallery.setAttribute('aria-roledescription', 'carousel');
    gallery.setAttribute('aria-label', slides[0].alt || labels.slideLabel);
    previous.type = next.type = 'button';
    previous.setAttribute('aria-label', labels.previousSlide);
    next.setAttribute('aria-label', labels.nextSlide);
    previous.setAttribute('aria-controls', trackId);
    next.setAttribute('aria-controls', trackId);
    const status = document.createElement('span');
    status.className = 'carousel-status';
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    gallery.appendChild(status);
    let current = 0;
    let dots = Array.from(dotContainer.children);
    if (dots.length !== slides.length) {
      dotContainer.replaceChildren();
      dots = slides.map(() => dotContainer.appendChild(document.createElement('button')));
    }
    dots.forEach((dot, index) => {
      dot.type = 'button';
      dot.className = dotClass;
      dot.setAttribute('aria-label', labels.slideLabel + ' ' + (index + 1) + ': ' + slides[index].alt);
      dot.setAttribute('aria-controls', trackId);
      dot.addEventListener('click', () => show(index));
    });
    const thumbnails = [];
    const metadata = trackId === 'labSlider' ? gallery.parentElement.querySelector('.gallery-meta') : null;
    if (trackId === 'labSlider') {
      let thumbnailContainer = gallery.parentElement.querySelector('.gallery-thumbnails');
      if (!thumbnailContainer?.classList.contains('gallery-thumbnails')) {
        thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'gallery-thumbnails';
        gallery.after(thumbnailContainer);
      }
      const existingThumbnails = Array.from(thumbnailContainer.children);
      const reuseThumbnails = existingThumbnails.length === slides.length;
      if (!reuseThumbnails) thumbnailContainer.replaceChildren();
      slides.forEach((slide, index) => {
        const button = reuseThumbnails ? existingThumbnails[index] : document.createElement('button');
        button.className = 'gallery-thumbnail';
        button.type = 'button';
        button.setAttribute('aria-label', dots[index].getAttribute('aria-label'));
        button.setAttribute('aria-controls', trackId);
        if (!reuseThumbnails) {
          const image = slide.cloneNode(false);
          image.alt = '';
          image.removeAttribute('aria-hidden');
          image.loading = 'lazy';
          button.appendChild(image);
          thumbnailContainer.appendChild(button);
        }
        button.addEventListener('click', () => show(index));
        thumbnails.push(button);
      });
    }
    const show = index => {
      const nextIndex = (index + slides.length) % slides.length;
      const changed = current !== nextIndex;
      current = nextIndex;
      track.style.transform = 'translateX(-' + current * 100 + '%)';
      slides.forEach((slide, i) => {
        slide.setAttribute('aria-hidden', String(i !== current));
        dots[i].classList.toggle('active', i === current);
        dots[i].setAttribute('aria-current', String(i === current));
        if (thumbnails[i]) thumbnails[i].setAttribute('aria-current', String(i === current));
      });
      status.textContent = (current + 1) + ' / ' + slides.length + ': ' + slides[current].alt;
      if (metadata) {
        metadata.querySelector('.gallery-caption').textContent = slides[current].alt;
        metadata.querySelector('.gallery-index').textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
        if (changed) gallery.dispatchEvent(new CustomEvent('lab:slide-change', { bubbles: true }));
      }
    };
    previous.addEventListener('click', () => show(current - 1));
    next.addEventListener('click', () => show(current + 1));
    gallery.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        show(current + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    if (slides.length === 1) previous.hidden = next.hidden = dotContainer.hidden = true;
    show(0);
  };
})();
