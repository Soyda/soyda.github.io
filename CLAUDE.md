# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

A static personal portfolio site for GitHub Pages (`soyda.github.io`) — plain HTML/CSS/JS, no build tools, no package manager, no dependencies. There is no build/lint/test step; changes are made directly to the HTML/CSS/JS files and viewed by opening them in a browser.

Pages: `index.html` (home), `digest.html` (daily news digest), `about.html`. All three share `styles.css` and `theme.js`.

## Running locally

Open the HTML files directly in a browser, or serve the directory statically, e.g.:
```bash
python3 -m http.server 8000
```
No install/build/test commands exist for this repo.

## Architecture

**Design tokens + theme system**: `styles.css` defines shared tokens once in `:root` (spacing, font, radius, transition), then each theme is a class (`.theme-gray`, `.theme-dark`, `.theme-blue`, `.theme-blue-dark`, `.theme-emerald`, `.theme-emerald-dark`, `.theme-violet`, `.theme-violet-dark`, `.theme-amber`, `.theme-amber-dark`, `.theme-rose`, `.theme-rose-dark` — 6 palettes × light/dark) that overrides a fixed set of color variables: `--bg`, `--bg-alt`, `--surface`, `--text`, `--text-muted`, `--accent`, `--accent-hover`, `--border`, `--tag-bg`, `--highlight`, `--nav-bg`, `--shadow`, `--code-bg`, `--scrollbar`. Every theme class must define all of these or elements using an undefined one will render incorrectly.

`theme.js` applies one theme class to `<body>`, cycles through the `THEMES` array on click of `#theme-switcher`, and persists the choice to `localStorage` under `soyda-theme`. **The `THEMES` array in `theme.js` and the theme classes defined in `styles.css` must stay in sync** — adding a theme requires updating both, plus setting a default class on `<body>` in each HTML page (currently `class="theme-gray"`).

**Aesthetic**: terminal/command-line styling throughout — monospace font, sharp corners (`--radius: 0px`), `$`-prefixed text, command-style link labels (e.g. `ls projects/`, `cat about.txt →`). Keep new content/copy consistent with this style rather than conventional prose/button labels.

**Page structure**: every page repeats the same shell — `<nav class="navbar">` with logo + nav links + `#theme-switcher` button, a `<main class="container">`, and `<footer class="site-footer">`, with `theme.js` loaded at the end of `<body>`. New pages should copy this shell (see `.docs/AGENTS.md` for a template) and set the active nav link via `class="active"`.

**digest.html** is a generated-looking content page (dated news tables for France/World/Sci-Tech sourced from external articles); when updating it, refresh both the visible date/content and the Open Graph/Twitter meta tags, and keep `index.html`'s "Daily News" preview cards in sync with whatever digest.html currently leads with.

**Placeholder identity content**: the "soyda" persona, bio, tech stack, and the three project cards on `index.html` are intentionally fake demo content, not a real person's info — do not "fix" them by inventing more fake specifics. Each page carries a `.disclaimer-banner` (styles in `styles.css` near the navbar rules) stating this; the contact links (`mailto:`/`github.com/soyda`) are deliberately rendered as inert `<span class="contact-link is-disabled">` rather than real hrefs. Only `digest.html`'s news content is real. If the user provides real bio/project/contact details, replace the fake content directly and remove the now-unneeded disclaimer/disabled-state markup for that section.

## Internal docs

`.docs/AGENTS.md` has agent-facing workflow notes: git branch/commit conventions, the full list of design-token properties every theme must define, a pre-merge checklist, and copy-paste templates for new project cards and new pages. Read it before adding a page or a theme. Note it (and `README.md`) still describe an older 4-theme, 2-palette setup — the actual current theme system (in `styles.css`/`theme.js`) has 12 themes across 6 palettes; trust the code over these docs on theme count.
