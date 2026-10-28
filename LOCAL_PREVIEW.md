# 本機預覽與人工驗收

新版分支：`feature/website-redesign`。本機修改尚未提交，沒有推送或部署。
原工作區 `/home/cat/ivlab-web` 保持在 main；舊版 worktree 固定於 `87f6286`。

| 版本 | 工作目錄 | 首頁 |
|---|---|---|
| 舊版 | `/home/cat/ivlab-web-before` | http://localhost:1313/ivlab-web/ |
| 新版 | `/home/cat/ivlab-web-redesign` | http://localhost:1314/ivlab-web/ |

英文首頁在各網址後加入 `en/`。兩版使用獨立輸出目錄、快取和連接埠。
預覽已啟動；日誌及 PID 位於各 worktree 的 `resources/preview/`。

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

Hugo 0.168 Extended 可建置；既有設定及 Ananke 會出現棄用警告。
介面翻譯保留 `zh.yaml`，另有 `zh-tw.yaml` 對應新版 Hugo 的 locale 行為；兩者需同步介面文字。
沒有新增 Node、CSS framework 或外部字型；本輪動畫使用固定版本、本機提供的 Motion mini，無需增加建置工具。

## 第二輪改版

已完成 Robotics / AI 視覺翻新、影片堆疊修復及 People 姓名 Grid。實際參考、48 組 Chrome 驗證、截圖與內容保護結果見 [DESIGN_REVIEW.md](DESIGN_REVIEW.md)。

## 成員雙欄與動畫優化

成員頁改為照片／緊湊名單雙欄，手機上下排列。全站以 Motion mini 加入適度進場及捲動動畫，支援減少動態效果與載入失敗備援。技術、授權及維護說明見 [ANIMATION_NOTES.md](ANIMATION_NOTES.md)。

- 中文成員：http://localhost:1314/ivlab-web/member/
- 英文成員：http://localhost:1314/ivlab-web/en/member/

## 編排與互動精修

目前預覽包含大字級偏心首頁、研究影片交錯展示與章節跳轉、成員分類側標／照片名稱張數，以及編輯式計畫清單。沿用 Motion mini；參考方法與維護說明見 [ANIMATION_NOTES.md](ANIMATION_NOTES.md)。本輪本機測試資料在 `resources/round4-review/`。

## 人工驗收

- 比較中英文首頁、教授、成員、論文、研究、計畫共 12 個頁面。
- 測試語言切換後仍在同一內頁，導覽目前頁面狀態正確。
- 在桌面、平板、手機及瀏覽器縮放下檢查換行、欄位與內容可見性。
- 用 Tab、Enter、方向鍵及 Escape 測試手機選單與兩組照片輪播。
- 檢查原始圖片完整顯示、YouTube 及本機研究影片、外部報導連結。
- 原文、原始圖片、影片、主題與 GitHub Actions 設定均不應改動。

所有工作停留在本機，等待人工確認；不執行推送、PR 或部署。
