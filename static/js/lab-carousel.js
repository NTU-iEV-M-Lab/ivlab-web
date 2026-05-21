document.addEventListener('DOMContentLoaded', function() {
  const track = document.getElementById('labSlider');
  if (!track) return;

  const images = track.children;
  const imgCount = images.length;
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotContainer = document.getElementById('dotContainer');
  let currentIndex = 0;

  if (imgCount < 2) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    return;
  }

  for (let i = 0; i < imgCount; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotContainer.appendChild(dot);
  }
  const dots = document.querySelectorAll('.dot');

  function goToSlide(index) {
    if (index < 0) currentIndex = imgCount - 1;
    else if (index >= imgCount) currentIndex = 0;
    else currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');
  }

  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
});
