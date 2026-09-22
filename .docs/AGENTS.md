# Automated Daily News Digest — Agent Workflow & Prompt

**Repository:** `soyda.github.io`  
**Working Directory:** `/home/user/soyda.github.io`  
**Branch Strategy:** `main` is always deployable. Use `feat/digest-update` for digest work.  
**Commit Convention:** `chore(digest): update daily news for YYYY-MM-DD`

---

## 📋 MANDATORY: Pre-flight Repo Review

Before doing anything, the agent MUST inspect the current repo state:

```bash
# 1. File structure & current data
ls -la /home/user/soyda.github.io/data/
cat /home/user/soyda.github.io/data/meta.json
head -c 500 /home/user/soyda.github.io/data/digest-latest.json

# 2. HTML page structures (DO NOT assume — read them)
cat /home/user/soyda.github.io/index.html          # verify digest section exists
cat /home/user/soyda.github.io/digest.html           # verify full digest table structure
cat /home/user/soyda.github.io/js/digest-loader.js   # understand data consumption logic

# 3. Git state
cd /home/user/soyda.github.io && git status && git log --oneline -5
```

**Save the current digest to archive:**  
`cp data/digest-latest.json data/archive/YYYY-MM-DD.json` (create archive dir first if missing)

---

## 📋 MANDATORY: Tasklist — Execute & Check Off Every Item

The agent MUST create and complete this tasklist. No task is skipped.

```
[ ] T1: Fetch fresh news for all 4 categories from live web sources
[ ] T2: Compile Top 10 per category (10 articles x 4 = 40 total)
[ ] T3: Format summaries as compact inline bullets (• point · • point · • point)
[ ] T4: Write updated digest-latest.json with correct JSON structure
[ ] T5: Verify digest.html will render correctly with the new data format
[ ] T6: Verify index.html news preview cards work with the new data format
[ ] T7: Validate all URLs are valid, working links (no dead/placeholder URLs)
[ ] T8: Commit & push with conventional commit message
```

---

## 📋 Execution Plan

### Phase 1 — Research & Compile (T1–T2)

Research today's date and fetch news from these categories using live sources:

| Category | Focus | Suggested Sources |
|----------|-------|-------------------|
| `france` 🇫🇷 | French national/domestic politics, society, culture, economy | Le Monde (English), France 24, AP News France, Le Figaro |
| `world` 🌍 | Global/international breaking news, geopolitics | BBC News World, Reuters, Al Jazeera, The Guardian World, AP News |
| `science` 🔬 | Science breakthroughs, space, physics, biology, climate | NASA Science, SciTechDaily, Nature, New Scientist, ESA |
| `ai` 🤖 | AI/ML developments, policy, industry, research | Stanford HAI AI Index, TechCrunch AI, The Guardian AI, OpenAI Blog |

**Requirements for each story:**
- `num`: 1–10 (ranking by relevance/recency)
- `title`: concise headline (< 80 chars)
- `url`: real, verifiable URL to the original article (HTTPS)
- `summary`: **compact inline bullets** — short bullet points joined with • as shown below
- `source`: name of the news outlet (e.g., "BBC News", "TechCrunch")

### Phase 2 — Summary Formatting Rule (T3)

SUMMARIES MUST use this exact format:
```
• Short key point one sentence. · • Another key point, different angle. · • Third supporting detail.
```

Rules:
- Each bullet starts with `• ` (Unicode bullet + space)
- Separated by ` · ` for compact inline display
- 2–4 bullet points per summary maximum
- No multi-line newlines inside summary values
- Total summary length: 80–160 characters
- Bullet fragments must be complete thoughts, not fragments

### Phase 3 — Data Output (T4)

Write `digest-latest.json` with this EXACT structure:

```json
{
  "date": "YYYY-MM-DD",
  "lastRefresh": "2026-XX-XXT07:00:00Z",
  "sources": ["Top 5 news outlets used for curation"],
  "data": {
    "france": [ { "num": 1, "title": "...", "url": "...", "summary": "• ... · • ... · • ...", "source": "..." } ],
    "world": [ ... 10 stories same structure ... ],
    "science": [ ... 10 stories same structure ... ],
    "ai": [ ... 10 stories same structure ... ]
  }
}
```

### Phase 4 — HTML & JS Verification (T5–T7)

The agent MUST verify that the digest data format is compatible with:

**`index.html`** (preview cards on homepage):
- Loads via `digest-loader.js` from `${basePath}data/digest-latest.json`
- Shows first story (`data[cat][0]`) per category in `.news-card` elements
- Strips `• ...` bullets for display: `summary.split('• ').map(s => s.trim()).filter(Boolean).slice(0,2).join(' — ')`
- Links to `digest.html#${categoryId}`

**`digest.html`** (full table view):
- Loads via `digest-loader.js`, splits bullets with `.split('\u2022 ')` for table display
- Shows all 10 stories in tabular format per category

**`js/digest-loader.js`**:
- Already handles bullet parsing — NO changes needed unless JSON schema changes
- Verifies it reads `${basePath}data/meta.json` for category metadata

### Phase 5 — Archive & Commit (T8)

```bash
cd /home/user/soyda.github.io
mkdir -p data/archive
cp data/digest-latest.json "data/archive/$(date +%Y-%m-%d).json"

git add data/archive/*.json data/digest-latest.json
git commit -m "chore(digest): update daily news for YYYY-MM-DD"
git push origin $(git branch --show-current)
```

---

## ⚠️ Quality Gate Checklist

Before committing, verify ALL of these:

- [ ] JSON is valid (parseable with `python3 -c "import json; json.load(open('data/digest-latest.json'))"`)
- [ ] Exactly 40 stories total (10 per category × 4)
- [ ] All `num` fields are sequential 1–10 within each category
- [ ] All `url` values are HTTPS and non-empty
- [ ] No summary contains `\n` (newlines — must be compact inline bullets)
- [ ] Sources array has exactly 5 outlets
- [ ] Date matches today's date in YYYY-MM-DD format
- [ ] Archive copy exists for the previous day

---

## 📂 Repo Reference: Key Files & Their Roles

| File | Role |
|------|------|
| `data/digest-latest.json` | Master data file — 40 stories, consumed by JS loader |
| `data/meta.json` | Category metadata (id, title, emoji) — feeds section titles |
| `js/digest-loader.js` | Fetches JSON + meta, populates both index.html preview cards AND digest.html tables |
| `index.html` | Homepage with 4 `.news-card` preview slots for top stories |
| `digest.html` | Dedicated page with full tabular view of all 40 stories |
| `styles.css` | All shared styling — new items must use existing CSS classes |

---

## 🔄 Maintenance Notes

- **Never edit index.html or digest.html manually for data** — they are generated by `digest-loader.js` from the JSON. Only update HTML structure/JS logic if needed.
- **The JSON data file is the single source of truth.** All content updates go through `digest-latest.json`.
- **Always backup old data to archive before overwriting.**
- **Keep URLs authoritative** — prefer outlet's own domain, not aggregators or mirror sites.
