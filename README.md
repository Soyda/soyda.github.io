# ⚡ Soyda Portfolio — Developer Site

A modern, theme-aware personal portfolio built with **vanilla HTML, CSS & JavaScript** — no frameworks, no build tools.

![License](https://img.shields.io/github/license/soyda/soyda.github.io?style=flat-square)
![Stars](https://img.shields.io/github/stars/soyda/soyda.github.io?style=flat-square&label=stars)
![Pages Status](https://img.shields.io/github/pages/status/soyda/soyda.github.io?style=flat-square)

---

## 📄 Live Site

Visit the portfolio at **[soyda.github.io](https://soyda.github.io)**

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Markup | HTML5 (semantic) |
| Styling | CSS3 (design tokens, custom properties) |
| Interactivity | Vanilla JavaScript (ES6+) |
| Hosting | GitHub Pages |
| Themes | 4 built-in themes (2 palettes × light/dark) |

---

## 🚀 Getting Started

### View locally

No dependencies to install. Just open the files in a browser:

```bash
# Clone the repo
git clone https://github.com/soyda/soyda.github.io.git

# Open index.html in your browser
cd soyda.github.io
open index.html          # macOS
# or double-click index.html
```

### Deploy (GitHub Pages)

1. Go to **Settings → Pages** in this repo
2. Under "Source", select **Deploy from a branch**
3. Choose the `main` branch and `/ (root)` folder
4. Save — your site will be live at `https://soyda.github.io`

---

## 🎨 Themes

Four color schemes are included:

| Name | Type | Description |
|------|------|-------------|
| Gray Light | Default | Neutral grays, professional look |
| Gray Dark | Dark mode | Low-light friendly dark variant |
| Navy Light | Blue-tinted | Calming blue accents on white |
| Navy Dark | Dark mode | Deep navy with cyan highlights |

**How to switch:** Click the `◐ Theme` button in the navbar. Your choice is saved via `localStorage`.

To set a default theme, add this class to `<body>` in both HTML files:
- `class="theme-gray"` (light)
- `class="theme-gray-dark"` (dark)
- `class="theme-navy-light"` (navy light)
- `class="theme-navy-dark"` (navy dark)

---

## 📁 Project Structure

```
soyda.github.io/
├── index.html          # Home page — hero, projects, contact
├── about.html          # About me page
├── styles.css          # All site styles + design tokens
├── theme.js            # Theme switcher logic
├── README.md           # You are here
├── LICENSE             # MIT License
└── .gitignore          # Ignored files
```

---

## 📝 Customization

- **Colors:** Edit the CSS custom properties in `styles.css` under each theme's rule block
- **Content:** Update text directly in `index.html` and `about.html`
- **Projects:** Add or modify `<article class="project-card">` blocks on index.html
- **Favicon:** Replace the inline data URI SVG link with a file path if desired

---

## 📄 License

This project is open source under the [MIT License](LICENSE).  
© 2026 Soyda.

---

## 🔗 Links

- **Live site:** <https://soyda.github.io>
- **GitHub:** <https://github.com/soyda>
- **All repos:** <https://github.com/soyda?tab=repositories>
