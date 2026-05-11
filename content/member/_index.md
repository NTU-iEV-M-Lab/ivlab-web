<style>
  .lab-carousel {
    width: 100%;
    max-width: 1000px; 
    height: 550px;     
    margin: 0 auto 3rem auto; 
    overflow: hidden;  
    position: relative;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15); 
  }
  .carousel-track {
    display: flex;
    width: 100%;
    height: 100%;
    transition: transform 0.6s ease-in-out; 
  }
  .carousel-track img {
    width: 100%;
    height: 100%;
    object-fit: cover; 
    flex-shrink: 0;    
  }
  
  /* 左右切換按鈕 */
  .carousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.4);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 20px;
    z-index: 10;
    transition: background-color 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .carousel-btn:hover { background-color: rgba(0, 0, 0, 0.8); }
  .prev-btn { left: 15px; }
  .next-btn { right: 15px; }

  /* 下方導覽小圓點 */
  .carousel-dots {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 10;
  }
  .dot {
    width: 12px;
    height: 12px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  .dot.active { background-color: white; }
</style>

<div class="lab-carousel">
  <div class="carousel-track" id="labSlider">
    <img src="/images/csme_group_photo.jpg" alt="Lab Life 1">
    <img src="/images/graduation1.jpg" alt="Lab Life 2">
    <img src="/images/dubi_lunch.jpg" alt="Lab Life 3">
    <img src="/images/dubi_world_challenge1.jpg" alt="Lab Life 4">
  </div>
  
  <button class="carousel-btn prev-btn" id="prevBtn">&#10094;</button>
  <button class="carousel-btn next-btn" id="nextBtn">&#10095;</button>
  <div class="carousel-dots" id="dotContainer"></div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('labSlider');
    const images = track.children;
    const imgCount = images.length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotContainer = document.getElementById('dotContainer');
    let currentIndex = 0;

    if (imgCount < 2) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      return;
    }

    // 動態產生圓點
    for (let i = 0; i < imgCount; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotContainer.appendChild(dot);
    }
    const dots = document.querySelectorAll('.dot');

    // 切換邏輯
    function goToSlide(index) {
      if (index < 0) currentIndex = imgCount - 1;
      else if (index >= imgCount) currentIndex = 0;
      else currentIndex = index;

      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach(dot => dot.classList.remove('active'));
      dots[currentIndex].classList.add('active');
    }

    // 綁定左右按鈕
    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  });
</script>

<h3 class="f3 mt5 mb4 pb2 bb b--light-gray dark-gray">實驗室成員</h3>
<div class="flex flex-wrap justify-between">
  
  <div class="w-100 w-30-l mb4">
    <div class="bg-white br3 ba b--black-10 shadow-1 pa4 h-100">
      <h4 class="f4 mt0 mb3 dark-blue bb b--black-10 pb2">博士生</h4>
      <ul class="list pl3 lh-copy f5 dark-gray">
        <li class="mb2" style="list-style-type: circle;">陳軼　</li>
        <li class="mb2" style="list-style-type: circle;">曾靖雅</li>
        <li class="mb2" style="list-style-type: circle;">胡聰賢</li>
        <li class="mb2" style="list-style-type: circle;">蔡育伸</li>
      </ul>
    </div>
  </div>

  <div class="w-100 w-30-l mb4">
    <div class="bg-white br3 ba b--black-10 shadow-1 pa4 h-100">
      <h4 class="f4 mt0 mb3 dark-green bb b--black-10 pb2">碩士生</h4>
      <div class="flex">
        <ul class="list pl3 lh-copy f5 dark-gray w-50">
          <li class="mb2" style="list-style-type: circle;">李彥霆</li>
          <li class="mb2" style="list-style-type: circle;">吳星融</li>
          <li class="mb2" style="list-style-type: circle;">林郁倫</li>
          <li class="mb2" style="list-style-type: circle;">張祐誠</li>
        </ul>
        <ul class="list pl3 lh-copy f5 dark-gray w-50">
          <li class="mb2" style="list-style-type: circle;">周冠翰</li>
          <li class="mb2" style="list-style-type: circle;">蔡翔羽</li>
          <li class="mb2" style="list-style-type: circle;">曾志榮</li>
          <li class="mb2" style="list-style-type: circle;">方健丞</li>
        </ul>
      </div>
    </div>
  </div>

  <div class="w-100 w-30-l mb4">
    <div class="bg-white br3 ba b--black-10 shadow-1 pa4 h-100">
      <h4 class="f4 mt0 mb3 dark-red bb b--black-10 pb2">研究助理</h4>
      <ul class="list pl3 lh-copy f5 dark-gray">
        <li class="mb2" style="list-style-type: circle;">黃志峰</li>
        <li class="mb2" style="list-style-type: circle;">黃曜駿</li>
      </ul>
    </div>
  </div>

</div>