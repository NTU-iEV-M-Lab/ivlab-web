<!-- 整個區塊容器 -->
<div class="w-100 mt4">

<!-- 標題區塊：移到最上方，字體放大為 f1 (最大層級) -->
<div class="w-100 mb4 pb3 bb b--black-10">
<h2 class="f2 fw6 mt0 mb0 dark-gray">🔍 研究領域 (Research Areas)</h2>
</div>

<!-- 左右雙欄配置 -->
<div class="flex flex-column flex-row-l w-100">

<!-- 左側：文字區塊 (50%) -->
<div class="w-100 w-50-l pr4-l black-80">
<!-- 大項字體放大至 f3 -->
<ul class="pl3 f3 mt0 lh-title">
<li class="mb4">
<strong>自主載具與先進駕駛輔助系統</strong>
<!-- 細項字體放大至 f3，並加入 lh-copy 拉開行距防擠壓 -->
<ul class="pl4 mt3 f3 dark-gray lh-copy">
<li class="mb2">多模態感知與場景理解</li>
<li class="mb2">高精度定位與動態導航</li>
<li class="mb2">決策規劃與邊緣運算部署</li>
<li class="mb2">整車機電與控制系統整合</li>
</ul>
</li>
<li class="mb4">
<strong>異質無人載具群體協作與控制</strong>
<ul class="pl4 mt3 f3 dark-gray lh-copy">
<li class="mb2">跨載具協同任務架構</li>
<li class="mb2">語意通訊與車聯網 (V2X)</li>
<li class="mb2">雲端與邊緣協同資源調度</li>
</ul>
</li>
<li class="mb4">
<strong>無人機群控制以及飛控抗干擾研究</strong>
<ul class="pl4 mt3 f3 dark-gray lh-copy">
<li class="mb2">分散式群集與編隊控制</li>
<li class="mb2">強健性飛控與抗擾動設計</li>
<li class="mb2">訊號干擾與遮蔽備援機制</li>
</ul>
</li>
</ul>
</div>

<!-- 右側：影片區塊 (50%) -->
<div class="w-100 w-50-l">

<!-- 第一排：CarSim 1 與 CarSim 2 (恢復為 16/9 比例) -->
<div class="flex justify-between mb4">
<div style="width: 48%;">
<div class="bg-near-white br2 overflow-hidden shadow-4 ba b--black-05" style="aspect-ratio: 16/9;">
<video style="width: 100%; height: 100%; object-fit: cover;" autoplay loop muted playsinline>
<source src='{{ "/videos/carsim1.mp4" | relURL }}' type="video/mp4">
</video>
</div>
<!-- 說明文字放大至 f3 -->
<p class="f4 mt2 mb0 dark-gray fw6 tc">高速軌跡跟蹤控制系統 (I)</p>
</div>

<div style="width: 48%;">
<div class="bg-near-white br2 overflow-hidden shadow-4 ba b--black-05" style="aspect-ratio: 16/9;">
<video style="width: 100%; height: 100%; object-fit: cover;" autoplay loop muted playsinline>
<source src='{{ "/videos/carsim2.mp4" | relURL }}' type="video/mp4">
</video>
</div>
<p class="f4 mt2 mb0 dark-gray fw6 tc">高速軌跡跟蹤控制系統 (II)</p>
</div>
</div>

<!-- 第二排：Routing (使用 px 自由控制高度) -->
<div class="mb4 w-100">
<!-- 更改這裡的 height: 400px; 即可自由調整高度 -->
<div class="bg-near-white br2 overflow-hidden shadow-4 ba b--black-05" style="height: 300px;">
<video style="width: 100%; height: 100%; object-fit: cover;" autoplay loop muted playsinline>
<source src='{{ "/videos/routing.mp4" | relURL }}' type="video/mp4">
</video>
</div>
<p class="f4 mt2 mb0 dark-gray fw6 tc">多載具動態路徑規劃</p>
</div>

<!-- 第三排：CARLA (使用 px 自由控制高度) -->
<div class="w-100">
<!-- 更改這裡的 height: 400px; 即可自由調整高度 -->
<div class="bg-near-white br2 overflow-hidden shadow-4 ba b--black-05" style="height: 300px;">
<video style="width: 100%; height: 100%; object-fit: cover;" autoplay loop muted playsinline>
<source src='{{ "/videos/carla.mp4" | relURL }}' type="video/mp4">
</video>
</div>
<p class="f4 mt2 mb0 dark-gray fw6 tc">CARLA & SUMO車流模擬</p>
</div>

</div>

</div>

</div>