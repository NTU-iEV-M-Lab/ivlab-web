# 國立臺灣大學 智慧載具與機電整合實驗室 官方網站

本網站使用 [Hugo](https://gohugo.io/) 靜態網站框架與 [Ananke](https://github.com/theNewDynamic/gohugo-theme-ananke) 佈景主題建立，並透過 GitHub Actions 自動部署至 GitHub Pages。

**網站網址：** https://ntu-iev-m-lab.github.io/ivlab-web/

---

## 事前準備

| 工具 | 最低版本 | 安裝說明 |
|------|---------|---------|
| Hugo **extended 版** | 0.128.0 | [gohugo.io/installation](https://gohugo.io/installation/) |
| Git | 任意近期版本 | [git-scm.com](https://git-scm.com/) |

> 請務必安裝 Hugo **extended** 版本，而非標準版。安裝後執行 `hugo version`，輸出中應包含 `extended` 字樣。

---

## 本機預覽

```bash
# 1. 複製專案（第一次才需要）
git clone --recurse-submodules https://github.com/ntu-iev-m-lab/ivlab-web.git
cd ivlab-web

# 2. 啟動本機開發伺服器
hugo server -D

# 3. 開啟瀏覽器前往以下網址預覽
#    http://localhost:1313/ivlab-web/
```

> `-D` 旗標會同時顯示草稿（draft）頁面，方便在發布前預覽新增內容。若只想預覽已發布內容，可省略 `-D`。

存檔後瀏覽器會即時更新。按 `Ctrl+C` 停止伺服器。

> 如果複製時未加 `--recurse-submodules`，請執行 `git submodule update --init` 以拉取 Ananke 佈景主題。

---

## 內容修改說明

網站各頁面對應一個 Markdown 檔案，直接編輯對應檔案後存檔即可。

| 網站頁面 | 中文內容檔 | 英文內容檔 |
|---------|---------|---------|
| 首頁 | `content/_index.zh.md` | `content/_index.en.md` |
| 指導教授 | `content/professor/_index.zh.md` | `content/professor/_index.en.md` |
| 實驗室成員 | `content/member/_index.zh.md` | `content/member/_index.en.md` |
| 發表文章 | `content/publication/_index.zh.md` | `content/publication/_index.en.md` |
| 研究方向 | `content/research/_index.zh.md` | `content/research/_index.en.md` |
| 執行中計畫與專案 | `content/projects/_index.zh.md` | `content/projects/_index.en.md` |
| 網站標題 / 導覽選單 | `hugo.toml` | `hugo.toml` |

### 新增圖片

1. 將圖片放入 `static/images/` 資料夾
2. 在內容檔案中以 `/images/檔案名稱.jpg` 的方式引用

> 路徑前**不需要**加 `/ivlab-web/`，Hugo 版型會自動補上子路徑前綴。影片同理，以 `/videos/檔案名稱.mp4` 引用即可。

> 請確保圖片大小在 300 KB 以內。若圖片過大，請先用 [Squoosh](https://squoosh.app/) 壓縮（建議：JPEG 品質 80%，最大寬度 1200 px）後再放入。

### 新增影片

1. 將 `.mp4` 檔案放入 `static/videos/` 資料夾
2. 在內容檔案中以 `/videos/檔案名稱.mp4` 的方式引用（無需加 `/ivlab-web/` 前綴）

---

## 樣式、腳本與佈景主題

| 檔案 | 位置 | 用途 |
|------|------|------|
| 自訂 CSS | `static/css/custom.css` | 版面覆蓋、輪播圖樣式、手機版面修正 |
| 首頁輪播腳本 | `static/js/carousel.js` | 杜拜挑戰賽照片輪播（首頁） |
| 成員頁輪播腳本 | `static/js/lab-carousel.js` | 實驗室生活照片輪播（成員頁） |
| 基礎 HTML 版型 | `layouts/_default/baseof.html` | 覆蓋主題基礎版型，載入 JS 檔案 |
| 導覽列 | `layouts/partials/site-navigation.html` | 頂部導覽列含 Logo 與選單連結 |
| 佈景主題 | `themes/ananke/` | **請勿直接修改此資料夾內的檔案** |

若需新增全站樣式，請編輯 `static/css/custom.css`。**請勿**在內容 `.md` 檔案中直接加入 `<style>` 或 `<script>` 標籤。

---

## 部署說明

每當有 commit 推送到 `main` 分支，GitHub Actions 會自動建置並部署網站，無需手動操作。

```
推送到 main → GitHub Actions 以 Hugo 建置 → 部署至 GitHub Pages
```

- 建置設定檔：`.github/workflows/hugo.yml`
- 部署網址：`https://ntu-iev-m-lab.github.io/ivlab-web/`
- 建置時間約 1 分鐘。可至 GitHub 的 **Actions** 頁籤查看進度或排查錯誤。
