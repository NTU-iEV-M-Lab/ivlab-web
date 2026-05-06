<!-- 1. 輪播容器與按鈕的 CSS 樣式 -->
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

<!-- 2. HTML 結構 (已加入按鈕與圓點) -->
<div class="lab-carousel">
  <div class="carousel-track" id="labSlider">
    <img src='{{ "/images/csme_group_photo.jpg" | relURL }}' alt="Lab Life 1">
    <img src='{{ "/images/graduation1.jpg" | relURL }}' alt="Lab Life 2">
    <img src='{{ "/images/dubi_lunch.jpg" | relURL }}' alt="Lab Life 3">
    <img src='{{ "/images/dubi_world_challenge1.jpg" | relURL }}' alt="Lab Life 4">
  </div>
  
  <!-- 控制按鈕 -->
  <button class="carousel-btn prev-btn" id="prevBtn">&#10094;</button>
  <button class="carousel-btn next-btn" id="nextBtn">&#10095;</button>
  <div class="carousel-dots" id="dotContainer"></div>
</div>

<!-- 3. 純手動 JavaScript 邏輯 (已徹底刪除自動播放) -->
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

<!-- 【關鍵這行】：啟動左右並排的 Flex 容器 -->
<div class="flex-l items-start">

<!-- 左側欄位：研究助理與博士生 (佔 50% 寬度) -->
<div class="w-100 w-50-l pr4-l">

## 研究助理

*   黃志峰: Email: [chihfeng0302@ntu.edu.tw](mailto:chihfeng0302@ntu.edu.tw)
*   黃曜駿: Email: [yaojiunhuang@ntu.edu.tw](mailto:yaojiunhuang@ntu.edu.tw)

## 博士生

*   陳軼: Email: [r07522845@ntu.edu.tw](mailto:r07522845@ntu.edu.tw),
*   曾靖雅: Email: [luisaariel24@gmail.com](mailto:luisaariel24@gmail.com),
*   胡聰賢: Email: [d14522012@ntu.edu.tw](mailto:d14522012@ntu.edu.tw),

</div>


<!-- 右側欄位：碩士生 (佔 50% 寬度) -->
<div class="w-100 w-50-l">

## 碩士生

*   李彥霆: Email: [tin35611@gmail.com](mailto:tin35611@gmail.com), 碩三
*   吳星融: Email: [a84677a51@gmail.com](mailto:a84677a51@gmail.com), 碩三
*   林郁倫: Email: [hn74191@gmail.com](mailto:hn74191@gmail.com), 碩二
*   張祐誠: Email: [george910103@gmail.com](mailto:george910103@gmail.com), 碩二
*   周冠翰: Email: [jay901105@icloud.com](mailto:jay901105@icloud.com), 碩二
*   蔡翔羽: Email: [asd30627@gmail.com](mailto:asd30627@gmail.com), 碩二
*   曾志榮: Email: [qwer8642@yahoo.com.tw](mailto:qwer8642@yahoo.com.tw), 碩二
*   方健丞: Email: [r14522852@ntu.edu.tw](mailto:r14522852@ntu.edu.tw), 碩一

</div>

<!-- 結束 Flex 容器 -->
</div>