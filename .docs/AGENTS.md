# Agent Workflow Guide — soyda.github.io

**Internal docs for AI agents working on this repository.**  
Not part of the public site. Do not include in commits that affect production without review.

---

## 🚨 MANDATORY: Pre-flight Repo Review (Every Task)

**Before doing ANY work**, inspect the full repo state. Never assume — read files.

```bash
# 1. Structure & data
cd /home/user/soyda.github.io
find . -not -path './.git/*' -not -path './node_modules/*' -type f | sort
cat data/meta.json
head -c 300 data/digest-latest.json

# 2. Key files — READ them (never assume content)
cat index.html
cat digest.html
cat js/digest-loader.js
cat styles.css        # check for existing class names you'll need

# 3. Git state
git status --short
git log --oneline -10
git branch --show-current
git remote -v
```

**Always save the current digest to archive before overwriting:**
```bash
mkdir -p data/archive && cp data/digest-latest.json "data/archive/$(date +%Y-%m-%d).json"
```

---

## 📋 MANDATORY: Tasklist Pattern (Every Session)

**Create a tasklist at the start of every multi-step session.** Check off every item before finishing.

```
[ ] T1: <description>
[ ] T2: <description>
...
```

**Check off tasks as completed.** Never skip. Never assume something is done — verify it.

---

## Git Branch Strategy

```bash
# Main branch is always deployable
git checkout main

# Feature work:
git checkout -b feat/<short-description>
git add .
git commit -m "feat: brief description"
git push origin feat/<short-description>
```

**Commit messages follow Conventional Commits:**

| Prefix    | Meaning                    | Example                          |
|-----------|----------------------------|----------------------------------|
| `feat:`   | New feature                | `feat: add dark mode`            |
| `fix:`    | Bug fix                    | `fix: missing script tag`        |
| `refactor:` | Code change, no behavior change | `refactor: simplify loader` |
| `chore:`  | Build/infra/maintenance    | `chore(digest): update news`     |
| `docs:`   | Documentation              | `docs: update AGENTS.md`         |

---

## 🏗️ Repo Architecture (What Each File Does)

### Data Layer (SINGLE SOURCE OF TRUTH)

| File | Role |
|------|------|
| `data/digest-latest.json` | **Master data** — 40 stories (10 per category). Consumed by JS loader. |
| `data/meta.json` | Category metadata: `{id, title, emoji}` for each section. |
| `data/archive/YYYY-MM-DD.json` | Historical snapshots of digest-latest.json. |

### Page Layer

| File | Role |
|------|------|
| `index.html` | Homepage with 4 `.news-card` preview slots (top story per category) → links to `digest.html`. |
| `digest.html` | Full page with tabular view of all 40 stories, split into 4 sections. |
| `js/digest-loader.js` | **Only script that loads data.** Fetches JSON+meta at runtime, populates BOTH index cards AND digest tables. |

### Key Rule: **Never manually edit HTML for content changes.** All dynamic content flows through `digest-latest.json`. Only modify HTML structure when adding/removing sections.

### Styles

| File | Role |
|------|------|
| `styles.css` | All styling. Use existing class names (`news-card`, `digest-bullet-list`, etc.). |
| `theme.js` | Theme cycling (gray/navy light/dark). |

---

## 🔄 Daily Digest Workflow (Template)

This is the repeatable pattern for updating the news digest:

### Phase 1 — Research & Compile
1. Get today's date (ISO `YYYY-MM-DD`).
2. Search live web sources across 4 categories:
   - `france` 🇫🇷 → Le Monde, France 24, AP News
   - `world` 🌍 → BBC World, Reuters, Al Jazeera, The Guardian
   - `science` 🔬 → NASA, SciTechDaily, Nature, ESA
   - `ai` 🤖 → Stanford HAI AI Index, TechCrunch AI, OpenAI Blog
3. Compile top 10 per category (40 total) by relevance/recency.

### Phase 2 — Summary Format Rule (STRICT)
Every summary MUST be **compact inline bullets**, single line:
```
• Short point one sentence. · • Another point with different angle. · • Third supporting detail.
```
Rules: `• ` as bullet prefix, ` · ` as separator, 2-4 points per summary, no newlines, 80-160 chars total.

### Phase 3 — Write JSON (Exact Structure)
```json
{
  "date": "YYYY-MM-DD",
  "lastRefresh": "2026-XX-XXT07:00:00Z",
  "sources": ["Top 5 outlets"],
  "data": {
    "france": [{"num":1,"title":"...","url":"https://...","summary":"• ... · • ...","source":"..."}],
    "world": [...],
    "science": [...],
    "ai": [...]
  }
}
```

### Phase 4 — Verify Compatibility (MANDATORY)
Before committing, verify the data format works with BOTH pages:

**For digest.html tables:**
- `summary.split(' • ')` must produce bullet strings for `<ul><li>` rendering
- All fields: num, title, url (HTTPS), summary, source present

**For index.html preview cards:**
- `summary.split('• ')` → filter(Boolean) → slice(0,2).join(' — ') produces valid preview text
- First story exists in each category array

**Validation checklist:**
```bash
python3 -c "import json; d=json.load(open('data/digest-latest.json')); assert sum(len(v) for v in d['data'].values()) == 40; print('OK')"
```

### Phase 5 — Commit & Push
```bash
cd /home/user/soyda.github.io
mkdir -p data/archive && cp data/digest-latest.json "data/archive/$(date +%Y-%m-%d).json"
git add data/archive/*.json data/digest-latest.json
git commit -m "chore(digest): update daily news for YYYY-MM-DD"
git push origin $(git branch --show-current)
```

---

## 📂 Theme Development Guide

### Color System (4 themes, built on CSS custom properties)

| Theme | Mode |
|-------|------|
| `theme-gray` | Light (default) |
| `theme-gray-dark` | Dark mode |
| `theme-navy-light` | Blue-tinted light |
| `theme-navy-dark` | Blue-tinted dark |

**Every theme MUST define:** `--bg`, `--surface`, `--text`, `--text-muted`, `--accent`, `--accent-hover`, `--border`, `--tag-bg`, `--nav-bg`, `--shadow`, `--radius`

### Adding a New Theme
1. Add CSS rule block with all tokens in `styles.css`
2. Add to `THEMES` array in `theme.js`
3. Test manually in all 4 modes + responsive

---

## ⚠️ Quality Gate Checklist (Pre-Commit)

Before every commit:
- [ ] JSON valid (`python3 -c "import json; json.load(open('file.json'))"`)
- [ ] All URLs are HTTPS and non-empty
- [ ] No summary contains `\n` or raw dashes
- [ ] Theme works in all 4 modes
- [ ] Responsive on mobile (375px)
- [ ] Semantic HTML (`<main>`, `<section>`, `<article>`)
- [ ] No broken links or empty sections
- [ ] Commit uses conventional format
- [ ] All tasklist items checked off

---

## 📐 Content Templates

### New Project Card (for index.html)
```html
<article class="project-card">
  <div class="card-header">
    <span class="repo-badge"><svg ...>public</svg></span>
    <a href="https://github.com/..." class="card-title-link">repo-name</a>
  </div>
  <p>Description.</p>
  <div class="project-footer">
    <span class="language-dot" style="--dot-color: #color"></span>
    <span class="lang-name">Language</span>
    <span class="spacer"></span>
    <svg ...>star icon</svg>
  </div>
</article>
```

### New HTML Page Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title — Soyda</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,...">
</head>
<body class="theme-gray">
  <nav class="navbar">...</nav>
  <main class="container"><h1>Title</h1></main>
  <footer class="site-footer">...</footer>
  <script src="js/digest-loader.js"></script>
  <script src="theme.js"></script>
</body>
</html>
```

---

## 🚫 Anti-Patterns (Never Do These)

1. **Hardcode content in HTML** — always use JSON data layer
2. **Skip repo review** — always read key files before changing them
3. **Skip tasklist** — always create and complete tasks explicitly
4. **Assume git auth works** — verify remote URL and credentials before push
5. **Commit without validation** — run checks before every commit
6. **Edit digest-latest.json by hand** — use structured JSON tools

---

## 🔧 Quick Reference: Git Commands

```bash
# Check current state
cd /home/user/soyda.github.io && git status --short && git branch --show-current && git remote -v

# Create feature branch
git checkout -b feat/<description>

# Stage & commit
git add .
git commit -m "feat: description"

# Push
git push origin $(git branch --show-current)

# Switch back to main (after merging PR)
git checkout main && git pull origin main
```
