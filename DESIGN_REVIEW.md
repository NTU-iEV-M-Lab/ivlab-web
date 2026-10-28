# 第二輪改版：已實作與驗證紀錄

本次接續 `feature/website-redesign`，沒有重建專案或變更 main。沒有 Git commit、push、PR、遠端更新或部署。沒有操作 Windows 分割區。

## 已修復的影片覆蓋問題

在 Linux Chrome 重現：捲動首頁第二組 YouTube 到 Header 後方時，`elementsFromPoint` 的首個元素為 iframe。原本 Tachyons 的 `.aspect-ratio--object` 設定 `z-index:100`；媒體父容器雖有定位及 overflow，沒有建立 stacking context，iframe 因而在根堆疊層蓋過 `z-index:50` 的 sticky header。

已實作：
- main 設定 `position:relative; z-index:0; isolation:isolate`。
- 媒體容器建立局部 stacking context；iframe 回到 `z-index:auto`。
- Header 保持 `z-index:50`，背景為不透明深色。
- 不將整個 iframe 的祖先套上 opacity reveal；僅揭示成果文字區。
- CSS／JS URL 加入內容雜湊，避免瀏覽器沿用第一版資源。
- Header 高度以 ResizeObserver 寫入 CSS 變數，供捲動定位及手機選單高度使用。

修復前截圖：[bug-before-desktop.png](resources/review-r2/bug-before-desktop.png)。
初步修復截圖：[1440](resources/review-r2/bug-fixed-1440.png)、[768](resources/review-r2/bug-fixed-768.png)、[390](resources/review-r2/bug-fixed-390.png)。
最終版截圖與資料位於 [screenshots](resources/review-r2/screenshots/) 及 [browser-results.json](resources/review-r2/browser-results.json)。

## 已研究並採用的視覺方法

以下網站以官方頁面、實際 Chrome DOM／CSS 及可取得的截圖研究。只借鏡方法，沒有將他站照片、影片、文字、字型或程式素材複製進網站。

| 網站 | 觀察 | 已應用於本網站 |
|---|---|---|
| [Stanford Autonomous Systems Lab](https://stanfordasl.github.io/)／[Team](https://stanfordasl.github.io/team/) | 大型實驗室名稱、清楚導覽、研究圖像分組；Team 將 Director、Research Team、博士後及博士生分開呈現 | 清楚的品牌 Hero、統一的內頁標題、以原有分類組織 People；不照搬其人物資料或照片 |
| [Figure](https://www.figure.ai/) | 極簡導航、全高媒體區、精簡標題與單一清楚的行動入口；本次截圖中部分影片未完成呈現，未將空白狀態當作設計目標 | 保留媒體主導的構圖，但使用可直接顯示的本地研究照片；只連到原有研究與計畫網址 |
| [Physical Intelligence](https://www.pi.website/) | 接近編輯／研究索引的閱讀方式、少量裝飾、成果條目重於介面 | 論文保持完整引文與原始順序，以閱讀欄、細分隔及分類導覽整理 |
| [FieldAI](https://www.fieldai.com/) | 深色、真實機器人場域影像、64px 級主標及清楚的次標層次 | 深色識別區、原始杜拜研究照片、低對比工程格線與明亮閱讀區 |
| [Skild AI](https://www.skild.ai/) | 充分留白、簡潔導航、標題與大面積成果影片形成焦點 | 精簡 Header；成果媒體保持足夠尺寸，避免每個內容都包成相同卡片 |
| [Dyna Robotics](https://www.dyna.co/) | 大型字體、媒體與文字交替、不同密度的深淺區塊 | 兩項首頁成果使用不同排版；NTU EAT 改為深色、雙影片並排區，手機依序堆疊 |
| [Awwwards Technology](https://www.awwwards.com/websites/technology/) | 已瀏覽科技網站目錄；部分縮圖載入不完整，未引用評分、獎項或未看過的特定作品 | 用於篩選參考方向，沒有導入炫技 WebGL 或高成本捲動特效 |

額外檢查了 [MIT CSAIL](https://www.csail.mit.edu/)、[ETH RSL](https://rsl.ethz.ch/) 與 [CMU Robotics Institute](https://www.ri.cmu.edu/) 的研究／People／分類入口。這三者本次以公開 HTML 的資訊架構研究為主，未宣稱做過完整視覺檢查。[Toyota Research Institute](https://www.tri.global/) 主站擷取遭 403，因此未臆測其頁面呈現。

參考截圖位於 [references](resources/review-r2/references/)，兩份彙整圖為 [第一組](resources/review-r2/reference-contact-sheet.jpg)、[第二組](resources/review-r2/reference-contact-sheet-2.jpg)。這些僅為本機研究紀錄，不是網站素材。

## 元件庫評估與實際選擇

| 資源 | 研究重點／授權來源 | 本次決定 |
|---|---|---|
| [Tailwind CSS](https://tailwindcss.com/)／[GitHub](https://github.com/tailwindlabs/tailwindcss) | 響應式、間距、狀態與設計變數；開源核心 MIT | 採用明確 tokens 與斷點的設計方法，以原生 CSS 實作，沒有加入編譯依賴 |
| [Flowbite](https://flowbite.com/)／[GitHub](https://github.com/themesberg/flowbite) | 導覽、媒體與互動元件；官方站擷取 403，程式／授權依官方 GitHub 檢查 | 沒有導入整套 CSS／JS，避免與 Tachyons utilities 及層級設定競爭 |
| [daisyUI](https://daisyui.com/)／[GitHub](https://github.com/saadeghi/daisyui) | 色彩角色及一致元件狀態；開源核心 MIT | 建立 night、accent、ink、muted、line 等角色，不加入套件 |
| [Preline UI](https://preline.co/)／[授權](https://www.preline.co/license.html) | Hero 組合、留白、導航與跨裝置元件；官方標示 MIT 與 Fair Use 雙重條款，Pro 另有授權 | 參考對齊、層次及響應式方法，未複製元件程式或付費素材 |

網站沒有新增套件、外部字型、動畫框架或 UI Framework。原始 Ananke 保持不變。

## 全站與 People 的實作

- 首頁：本地研究照片 Hero、原有研究／計畫入口、兩種成果排版與深淺交錯。
- Header：精簡深色品牌列、完整六項原有選單、手機 disclosure、鍵盤操作及同頁翻譯切換。
- Footer：相同品牌、原有六項連結與原版權文字。
- 教授：原肖像、完整履歷、清楚的學歷／專長／經歷欄位。
- 論文與計畫：原有分類及內容完整保留；頁內導航只重用既有標題。
- 研究：統一影片框、保留原順序及所有影片，使用 contain 避免裁切。
- People：保留原有博士生 4 位、碩士生 8 位、助理 2 位，中英文各 14 位。三組分類及每組順序不變。
- 每位成員只用原姓名設計，不加入空白頭像、學歷、職稱、研究領域或個人連結。
- 團隊四張原圖以主圖、縮圖及鍵盤輪播呈現；桌面側邊縮圖、手機下方縮圖。
- 成員資料以輸出層重組，原始 content 檔不變。轉換包含文字完整性 guard；若未來資料不符合既有結構，保留原 HTML。
- 姓名區採分組標題與平面 Grid，以邊線、字體、間距及輕量 hover 區分個人。
- Scroll reveal 只在支援 IntersectionObserver 且未要求減少動態時啟用；原文不依賴 JS 產生。

## 實際測試

Hugo 0.168.0 Extended production build 成功。既有 languageCode／languageName 與 Ananke LibSass 的棄用警告保留，沒有編譯錯誤。未變更部署工作流程或宣稱執行遠端建置。

Linux headless Chrome 測試 12 個中英文頁面 × 4 個尺寸，共 48 組：
- 1440×900、768×1024、390×844、320×800。
- 初始／完整捲動後無文件水平溢出，原圖沒有本機載入失敗。
- 中英文首頁各三個 iframe，四種尺寸共 24 組捲動 hit-test，Header 均在最上層。
- 手機與平板以真實 CDP Enter、Tab、Escape 事件檢查選單與焦點。
- 成員縮圖、下一張、循環回第一張，以及首頁照片切換通過。
- 本站 top-level JavaScript exception／console error 為 0，本機 HTTP 400 以上資源為 0。
- 減少動態效果時，停用 reveal，原生影片暫停並保留 controls。
- 停用 JavaScript 時，14 位成員仍由伺服器輸出，導覽可用，無水平溢出。
- 另外等候 YouTube 播放器載入，取得桌面／平板／手機的已載入影片捲動截圖：[1440](resources/review-r2/loaded-video-header-1440.png)、[768](resources/review-r2/loaded-video-header-768.png)、[390](resources/review-r2/loaded-video-header-390.png)。
- YouTube 的第三方播放及串流網路不納入「本站 JS 錯誤 0」的保證；本次已驗證其原始 URL、幾何位置與堆疊行為。

初次鍵盤測試未送出 Enter 的 keypress／文字事件，形成假失敗；補上完整原生 Enter 事件後通過。一次開發中的 LiveReload 銷毀導覽 context，已於來源穩定後重測該案例並保留重測紀錄。沒有以忽略網站斷言的方式將失敗改為通過。

資料：
- [48 組瀏覽器結果](resources/review-r2/browser-results.json)
- [減少動態／無 JS 結果](resources/review-r2/accessibility-checks.json)
- [最終頁面截圖](resources/review-r2/screenshots/)
- [其他內頁彙整](resources/review-r2/inner-pages-review.jpg)

內容驗證：12 份 content、10 張原圖、4 支原生影片、127 份主題檔與 GitHub workflow 位元組完全一致。12 個輸出頁面正文、既有連結與媒體 URL／順序比較不變，原有 20 個 HTML 路由保留。

## 本機預覽

- 舊版：http://localhost:1313/ivlab-web/
- 新版：http://localhost:1314/ivlab-web/
- 成員頁：http://localhost:1314/ivlab-web/member/
- 英文成員頁：http://localhost:1314/ivlab-web/en/member/

啟動指令與工作目錄見 [LOCAL_PREVIEW.md](LOCAL_PREVIEW.md)。所有變更停留本機，等待人工審查。
