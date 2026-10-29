# 本機預覽與人工驗收

主要開發工作區：`/home/cat/ivlab-web-redesign`，分支 `feature/ui-projects-refinement`，基於 `69e06cb`。提交與部署狀態以 Git 歷史及 GitHub Actions 為準。
原工作區 `/home/cat/ivlab-web` 用於管理 main；`feature/website-redesign` 保留前一版 `69e06cb`，舊版 worktree 固定於 `87f6286`。部署前另建立 main 備份分支，所有 worktree 均保留。

| 版本 | 工作目錄 | 首頁 |
|---|---|---|
| 舊版 | `/home/cat/ivlab-web-before` | http://localhost:1313/ivlab-web/ |
| 新版 | `/home/cat/ivlab-web-redesign` | http://localhost:1314/ivlab-web/ |

英文首頁在各網址後加入 `en/`。兩版使用獨立輸出目錄、快取和連接埠。
新版 1314 預覽已啟動，日誌與 PID 位於新版 worktree 的 `resources/ui-projects-review/preview.log`、`preview.pid`。舊版 1313 如有需要可依下方指令另行啟動。

若伺服器已停止，可在兩個 Ubuntu VS Code Terminal 分別執行：

```bash
cd /home/cat/ivlab-web-before
hugo server -D --bind 127.0.0.1 --port 1313 --baseURL http://localhost:1313/ivlab-web/ --cacheDir ./resources/_cache --destination ./resources/preview/public --disableFastRender
```

```bash
cd /home/cat/ivlab-web-redesign
hugo server -D --bind 127.0.0.1 --port 1314 --baseURL http://localhost:1314/ivlab-web/ --cacheDir ./resources/_cache --destination ./resources/preview/public --disableFastRender
```

## 建置

```bash
cd /home/cat/ivlab-web-redesign
hugo --minify --environment production --baseURL https://ntu-iev-m-lab.github.io/ivlab-web/ --destination ./public --cacheDir ./resources/_cache --printPathWarnings --printI18nWarnings
```

本輪已用 GitHub Actions 固定的 Hugo 0.128.0 Extended 與本機 0.169.0 Extended 完成 Production Build；新版 Hugo 對既有設定及 Ananke 會出現棄用警告。
介面翻譯保留 `zh.yaml`，另有 `zh-tw.yaml` 對應新版 Hugo 的 locale 行為；兩者需同步介面文字。
沒有新增 Node、CSS framework 或外部字型；本輪動畫使用固定版本、本機提供的 Motion mini，無需增加建置工具。

## 第二輪改版

已完成 Robotics / AI 視覺翻新、影片堆疊修復及 People 姓名 Grid。實際參考、48 組 Chrome 驗證、截圖與內容保護結果見 [DESIGN_REVIEW.md](DESIGN_REVIEW.md)。

## 成員雙欄與動畫優化

成員頁改為照片／緊湊名單雙欄，手機上下排列。全站以 Motion mini 加入適度進場及捲動動畫，支援減少動態效果與載入失敗備援。技術、授權及維護說明見 [ANIMATION_NOTES.md](ANIMATION_NOTES.md)。

- 中文成員：http://localhost:1314/ivlab-web/member/
- 英文成員：http://localhost:1314/ivlab-web/en/member/

## 編排與互動精修

目前預覽包含文字／照片雙欄首頁、研究影片等比例 Grid 與章節跳轉、成員分類側標／照片名稱張數，以及編輯式計畫清單。沿用 Motion mini；參考方法與維護說明見 [ANIMATION_NOTES.md](ANIMATION_NOTES.md)。較早輪次的測試資料在 `resources/round4-review/`。

## 全站字體系統

共用 Typography Tokens 位於 `static/css/custom.css`：H1 32–44px、H2 26–30px、一般 H3 22–24px、正文 16–17px、導覽 16px、Caption 14px。成員姓名、分類、教授姓名與計畫標題使用各自的語意角色；字重、行高、段落間距及中英文換行共用規則，沒有新增字型或動畫依賴。

Linux Chrome 實測中英文 12 頁、320／375／768／1024／1440px 及導覽斷點，共 64 組通過；28 組無 JavaScript／減少動態效果／動畫庫失敗備援、36 組最終元件及文字節點檢查通過。手機輪播 Caption 預留兩行，切換長標題不推動名單。測試資料與截圖在 Git 忽略的 `resources/typography-review/`，不納入提交；實體 iOS／Android 裝置仍需人工驗收。

## 人工驗收

本輪將首頁改為文字／照片並排、統一 Hero／Page Title 響應式字級、放大頂部導覽並強化語言切換。研究計畫頁更名為「研究計畫與專案／Research Projects」，維持原 URL；三個指定計畫整段移至已完成分類，四區計畫數量依序為 1／2／0／3。國際合作保留空狀態，既有三個分類錨點保留，新增 `#completed-projects`。

本輪檢查與截圖：`resources/ui-projects-review/`（Git 忽略）。人工預覽：

- 中文首頁：http://localhost:1314/ivlab-web/
- 英文首頁：http://localhost:1314/ivlab-web/en/
- 中文計畫：http://localhost:1314/ivlab-web/projects/
- 英文計畫：http://localhost:1314/ivlab-web/en/projects/

- 比較中英文首頁、教授、成員、論文、研究、計畫共 12 個頁面。
- 測試語言切換後仍在同一內頁，導覽目前頁面狀態正確。
- 在桌面、平板、手機及瀏覽器縮放下檢查換行、欄位與內容可見性。
- 用 Tab、Enter、方向鍵及 Escape 測試手機選單與兩組照片輪播。
- 檢查原始圖片完整顯示、YouTube 及本機研究影片、外部報導連結。
- 除本輪已授權的分類、頁名及介面文字外，原研究文字、人物資料、圖片、影片、主題與 GitHub Actions 設定均應保留。

一般修改流程為本機開發、預覽、人工審查，得到明確授權後才合併及部署。本次最新版已經人工確認並獲授權部署；後續新修改仍須重新取得部署授權。
