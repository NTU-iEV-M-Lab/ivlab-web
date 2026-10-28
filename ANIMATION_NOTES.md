# 成員頁與全站動態效果

本機新版工作區：`/home/cat/ivlab-web-redesign`，分支 `feature/website-redesign`。

- 成員頁以模板重新編排原始 HTML：桌面為照片／名單雙欄，900px 以下改上下排列。三類、14 位成員及原順序完整保留。
- 五張原始照片保留，黑客松合照維持第一張；使用 `object-fit: contain`。縮圖移至照片下方，左右按鈕、圓點、縮圖及鍵盤切換持續可用。
- 成員輪播圓點、縮圖及論文／計畫目錄改由 Hugo 預先產生，避免 JavaScript 插入元素造成首屏位移。手機選單在首次繪製前決定排版，沒有 JavaScript 時直接展示導覽。

## 動畫與授權

實際查閱 [Motion quick start](https://motion.dev/docs/quick-start)、[animate API](https://motion.dev/docs/animate)、[Motion 原始碼與 MIT 授權](https://github.com/motiondivision/motion)、[GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)、[GSAP Standard License](https://gsap.com/community/standard-license/)，以及 [Hugo static 目錄](https://gohugo.io/getting-started/directory-structure/#static)。

採用 **Motion mini 14.7.1** 配合原生 IntersectionObserver。此站只需要短暫的進場及捲動顯示，無須 ScrollTrigger 的 pinning、scrubbing 等功能。GSAP 的現行授權可用於此站，但其授權為自訂條款；Motion 的 MIT 授權與這次所需功能較單純。

- `static/js/vendor/motion-mini-14.7.1.js` 為固定版本本機 ES module，瀏覽器不向 CDN 取得動畫程式，也不需要 npm、React 或額外 Hugo build 工具。
- 實際 bundle 12,978 bytes／gzip 5,391 bytes；站內控制腳本 6,901 bytes／gzip 2,243 bytes（gzip 大小為本機量測，實際傳輸取決於伺服器壓縮設定）。
- 套件來源、SHA-256、npm tarball integrity 與少量瀏覽器適配記錄在 `static/js/vendor/motion-provenance.json`；原始 MIT／0BSD 授權保留在同目錄的 `licenses/`。
- 動畫只影響短距離 transform 與 opacity，約 0.26–0.9 秒，僅播放一次。首頁 Hero、研究文字／成果照片、計畫卡片及成員名單有細緻進場；既有導覽／按鈕 hover 保留。
- 不移動捲軸、不 pin 區塊、不切割文字、不動畫化 iframe 的祖先；完成時清除動畫樣式，保留正常 hover。
- `prefers-reduced-motion` 啟用時不下載 Motion；若使用中切換該設定，立刻結束動畫。可見內容從未依賴「先隱藏、再用 JavaScript 顯示」的 CSS。
- 動畫檔或整個 JavaScript 載入失敗時，原文、照片及名單仍可閱讀；停用 JavaScript 時仍有完整導覽與 Hugo 產生的頁內目錄。

更新 Motion 時需重新確認官方授權、下載來源與 integrity，更新版本檔名／動態 import、provenance、授權副本，並重新進行本機瀏覽器驗證。不要自動追蹤 latest。

預覽、建置與人工驗收指令見 [LOCAL_PREVIEW.md](LOCAL_PREVIEW.md)。本輪實際測試結果及截圖保存在本機忽略的 `resources/round3-review/`。

## 本輪驗證

Hugo 0.168 Extended 建置成功，僅既有 locale／Ananke LibSass 棄用警告。Linux Chrome 實測中英文 12 個主要頁面、1440／768／390／320px，共 48 組；另加 1024px 中英文成員頁，共 **50 組通過**，量測 CLS 為 0，沒有站內 JavaScript／HTTP 錯誤或水平溢出。24 次 iframe／Sticky Header 命中測試通過。

另 **22 組備援情境通過**：初始／動態變更 reduced motion、阻擋動畫庫、阻擋動畫腳本、阻擋站內互動腳本及停用 JavaScript。三類 14 位成員、五張照片及輪播操作完整；155 個內容、媒體、主題和 workflow 檔案 hash 與本輪開始時一致，12 頁原文及原始媒體連結一致。測試限上述 Linux Chrome 模擬尺寸，尚未在實體 iOS／Android 裝置進行觸控驗收。

## 本輪編排與互動精修

首頁改為偏心的品牌標題／照片舞台，研究頁採影片先行的交錯版面，並以原有研究標題提供原生章節跳轉；完整技術內容維持原順序。成員保留並排版面，以分類側標及緊湊文字取代重複姓名卡片，照片原有名稱與張數指示同步更新。計畫改為標題／說明雙欄的編輯式清單，論文保留閱讀優先的排版。

實際透過瀏覽器查看以下參考，採用其編排方法，未下載或移植品牌素材、字型及程式碼：

- [Stanford ASL](https://stanfordasl.github.io/)：觀察大字級、緊密行高與清楚的研究層級，應用於首頁品牌標題及內頁標題比例。
- [Physical Intelligence](https://www.pi.website/)：觀察節制的研究索引、細分隔線與文字密度，應用於計畫清單及成員分類編排。
- [Figure](https://www.figure.ai/)：觀察媒體主導區塊及文字／操作的邊緣對齊，應用於成果展示的深淺交錯與影像尺度。參考截圖封鎖影片下載，未完整播放其首頁影片。
- [Google DeepMind](https://deepmind.google/)：觀察主標的視覺支配力及克制的操作提示，應用於品牌文字層次及較安靜的導覽／按鈕回饋。

繼續使用同一份 Motion mini，不增加動畫套件。進場順序依照標題、照片、操作安排；圖文 Reveal 有交錯方向，橫向位移依實際 viewport 邊界縮減。輪播文字以同一份狀態同步更新，快速操作時取消前次動畫；任何含 iframe 的元素均不套用進場動畫。程式新增約 1.6 KB 原始碼，未增加建置依賴。

本輪驗證資料與截圖保存在本機忽略的 `resources/round4-review/`。預覽維持 http://localhost:1314/ivlab-web/ 。

本輪最終結果：Hugo Build 成功（僅既有棄用警告）；Chrome 50 組版面、22 組備援及 20 組互動檢查通過，量測 CLS 為 0、站內 JavaScript 錯誤為 0。快速輪播同步、模擬觸控、原生章節跳轉及動畫過程的 Header／iframe 堆疊均通過。155 個原始檔案 hash 和 12 頁原文／原始媒體連結比對一致。實體裝置仍待人工驗收。
