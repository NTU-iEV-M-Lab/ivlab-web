document.addEventListener('DOMContentLoaded', function() {
  const track = document.getElementById('dubaiSlider');
  const prevBtn = document.getElementById('dPrev');
  const nextBtn = document.getElementById('dNext');
  const dotContainer = document.getElementById('dDots');

  if (!track || !prevBtn || !nextBtn) return;

  const images = track.children;
  const imgCount = images.length;
  let currentIndex = 0;

  for (let i = 0; i < imgCount; i++) {
    const dot = document.createElement('div');
    dot.classList.add('c-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotContainer.appendChild(dot);
  }

  const dots = dotContainer.querySelectorAll('.c-dot');

  function goToSlide(index) {
    if (index < 0) index = imgCount - 1;
    if (index >= imgCount) index = 0;
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[currentIndex].classList.add('active');
  }

  prevBtn.addEventListener('click', (e) => {
    e.preventDefault();
    goToSlide(currentIndex - 1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.preventDefault();
    goToSlide(currentIndex + 1);
  });
});
