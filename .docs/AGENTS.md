# Agent Workflow Guide — soyda.github.io

**Internal docs for AI agents working on this repository. Not part of the public site.**

---

## Git Branch Strategy

```bash
# Main branch is always deployable
git checkout main

# Feature work:
git checkout -b feat/<description>      # e.g., feat/agent-dashboard
git add .
git commit -m "feat: add agent dashboard"
git push origin feat/<description>

# PR workflow:
# 1. Create PR targeting main
# 2. Request review
# 3. Squash merge after approval
```

---

## Conventional Commits

| Prefix     | Meaning                          | Example                              |
|------------|----------------------------------|--------------------------------------|
| `feat:`    | New feature                      | `feat: add dark mode toggle`         |
| `fix:`     | Bug fix                          | `fix: responsive grid on mobile`     |
| `docs:`    | Documentation changes            | `docs: update README.md`             |
| `style:`   | Formatting, no code change       | `style: indent CSS consistently`     |
| `refactor:`| Code change that fixes neither   | `refactor: extract theme logic to module` |
| `test:`    | Adding or updating tests         | `test: add theme-switcher test`      |
| `chore:`   | Build process, deps, etc.        | `chore: update .gitignore`           |

---

## Theme Development Guide

### Color System

Four themes exist, built on CSS custom properties (design tokens):

```
theme-gray          → Light (default)
theme-gray-dark     → Dark mode
theme-navy-light    → Blue-tinted light
theme-navy-dark     → Blue-tinted dark
```

**To add a new theme:**

1. Add CSS rule in `styles.css` with all design tokens (`--bg`, `--surface`, `--text`, etc.)
2. Add to `THEMES` array in `theme.js`
3. Test both light and dark modes

### Key Properties Checklist

Every theme must define these tokens:
- `--bg` — page background
- `--surface` — card/panel backgrounds
- `--text` — primary text color
- `--text-muted` — secondary text color
- `--accent` — link/button accent color
- `--accent-hover` — hover state
- `--border` — borders and dividers
- `--tag-bg` — pill/tag backgrounds
- `--nav-bg` — navbar background (rgba with transparency)
- `--shadow` — card shadows
- `--radius` — border radius (px or rem)

---

## Deployment Checklist

Before merging to `main`:

- [ ] All HTML pages have `<meta name="viewport">`
- [ ] All HTML pages have `<meta name="description">`
- [ ] No `_site/` contents in commit (use `.gitignore`)
- [ ] Theme works in all 4 modes (test manually)
- [ ] Responsive on mobile (375px width)
- [ ] Semantic HTML used (`<main>`, `<section>`, `<article>`, etc.)
- [ ] No broken links
- [ ] `git commit` uses conventional commit format

---

## Adding Content — Templates

### New Project Card (for index.html)

```html
<article class="project-card">
  <div class="card-header">
    <span class="repo-badge"><svg ...>Public</svg></span>
    <a href="https://github.com/username/repo" class="card-title-link">repo-name</a>
  </div>
  <p>Brief description of the project.</p>
  <div class="project-footer">
    <span class="language-dot" style="--dot-color: #color"></span>
    <span class="lang-name">Language</span>
    <span class="spacer"></span>
    <svg ...>star icon</svg>
  </div>
</article>
```

### New Page Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title — Soyda</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="theme-gray">
  <nav class="navbar">...</nav>
  <main class="container page-content"><h1>Page Title</h1></main>
  <footer class="site-footer">...</footer>
  <script src="theme.js"></script>
</body>
</html>
```
