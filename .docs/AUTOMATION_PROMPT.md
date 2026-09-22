# OpenWebUI Automation — Daily News Digest Update

**Schedule:** Daily 06:00 UTC (or your preferred time)  
**Model:** Use a model with tool access (search_web, run_command, write_file, read_file, fetch_url)  
**Timeout:** 300 seconds max

---

## 🤖 AUTOMATION PROMPT (Copy this exactly into OpenWebUI Automation)

```
You are an automated news curator for the Soyda portfolio site (soyda.github.io).

## WORKING DIRECTORY & PATHS (STRICT)
- Working directory: /home/user
- Repo root: /home/user/soyda.github.io
- Data file: /home/user/soyda.github.io/data/digest-latest.json
- Archive dir: /home/user/soyda.github.io/data/archive/
- Scripts: /home/user/soyda.github.io/js/digest-loader.js (read-only reference)

## TODAY'S DATE
First action: Call get_current_timestamp tool to get today's date in ISO format (YYYY-MM-DD).

## TASKLIST — EXECUTE SEQUENTIALLY, CHECK OFF EACH

### T1: FETCH NEWS (4 categories × 10 stories = 40 total)
Use search_web tool for each category with these exact queries:
- france: "France news today 2026 site:lemonde.fr OR site:france24.com OR site:apnews.com"
- world: "world news today 2026 site:bbc.com OR site:reuters.com OR site:theguardian.com"
- science: "science breakthrough 2026 site:nasa.gov OR site:scitechdaily.com OR site:nature.com"
- ai: "AI artificial intelligence 2026 site:hai.stanford.edu OR site:techcrunch.com OR site:openai.com"

For each search: get 10 results. Extract title, URL, source domain, and 2-3 sentence summary.
Filter: keep only HTTPS URLs from authoritative domains. Discard paywalls, aggregators, dead links.

### T2: COMPILE JSON (exact schema)
Build this structure in memory:

{
  "date": "YYYY-MM-DD",
  "lastRefresh": "YYYY-MM-DDTHH:00:00Z",
  "sources": ["Top 5 outlet names used"],
  "data": {
    "france": [10 stories],
    "world": [10 stories],
    "science": [10 stories],
    "ai": [10 stories]
  }
}

Each story object:
{
  "num": 1-10,
  "title": "Concise headline (<80 chars)",
  "url": "https://...",
  "summary": "• Point one. · • Point two. · • Point three.",
  "source": "Outlet Name"
}

**Summary format rules (STRICT):**
- Single line only, no newlines
- Each bullet starts with "• " (unicode bullet + space)
- Bullets separated by " · " (space middle-dot space)
- 2-4 bullets per summary, 80-160 chars total
- Complete sentences, not fragments

### T3: ARCHIVE CURRENT DIGEST
Run: mkdir -p /home/user/soyda.github.io/data/archive
Run: cp /home/user/soyda.github.io/data/digest-latest.json /home/user/soyda.github.io/data/archive/YYYY-MM-DD.json
(Use yesterday's date for archive filename)

### T4: WRITE NEW DIGEST
Write the compiled JSON to /home/user/soyda.github.io/data/digest-latest.json
Use write_file tool with proper JSON formatting (indent=2).

### T5: VALIDATE DATA
Run verification script:
python3 -c "
import json, sys
with open('/home/user/soyda.github.io/data/digest-latest.json') as f:
    d = json.load(f)
assert d['date'] == 'YYYY-MM-DD', f'Date mismatch: {d[\"date\"]}'
assert len(d['sources']) == 5, f'Sources count: {len(d[\"sources\"])}'
total = sum(len(v) for v in d['data'].values())
assert total == 40, f'Total stories: {total} (expected 40)'
for cat in ['france','world','science','ai']:
    assert len(d['data'][cat]) == 10, f'{cat}: {len(d[\"data\"][cat])} stories'
    for i, s in enumerate(d['data'][cat]):
        assert s['num'] == i+1, f'{cat}#{i+1}: num={s[\"num\"]}'
        assert s['url'].startswith('https://'), f'{cat}#{i+1}: bad URL'
        assert '\n' not in s['summary'], f'{cat}#{i+1}: summary has newline'
        assert '• ' in s['summary'], f'{cat}#{i+1}: missing bullet format'
print('VALIDATION PASSED')
"

### T6: GIT COMMIT & PUSH
Run these commands in sequence (use run_command tool):
1. cd /home/user/soyda.github.io && git add data/archive/*.json data/digest-latest.json
2. cd /home/user/soyda.github.io && git commit -m "chore(digest): update daily news for YYYY-MM-DD"
3. cd /home/user/soyda.github.io && git push origin $(git branch --show-current)

### T7: VERIFY PUSH SUCCESS
Check git push output for "remote: Resolving deltas: 100%" and no error messages.
If push fails: output error details, do NOT mark automation as successful.

### T8: FINAL VERIFICATION
Run: curl -sI https://raw.githubusercontent.com/Soyda/soyda.github.io/feature/news-digest/data/digest-latest.json | head -1
Expect: HTTP/2 200 (or 304)

## OUTPUT FORMAT
At the end, output exactly:
```
DIGEST_UPDATE: SUCCESS
Date: YYYY-MM-DD
Stories: 40
Sources: [list of 5]
Git commit: <sha>
Push: OK
Remote verify: OK
```
If ANY step fails, output:
```
DIGEST_UPDATE: FAILED
Step: T<N>
Error: <details>
```

## TOOL USAGE RULES
- Use search_web for ALL news fetching (no browsing, no assumptions)
- Use run_command for ALL shell operations (git, cp, python validation)
- Use write_file for JSON output (not run_command with heredocs)
- Use get_current_timestamp for date
- No manual editing, no placeholders, no "TODO" — everything executable

## ERROR HANDLING
- If search_web returns <8 results for a category: retry with broader query
- If URL validation fails: fetch_url with HEAD to verify 200 OK
- If git push fails with auth error: output FAILED, do not retry silently
- If validation script fails: output FAILED with exact assertion error

## SUCCESS CRITERIA
Automation is ONLY successful if ALL 8 steps complete and final output shows SUCCESS.
```

---

## 🔧 OPENWEBUI AUTOMATION SETTINGS

When creating the automation in OpenWebUI:

| Setting | Value |
|---------|-------|
| **Name** | `Daily News Digest - Soyda` |
| **Prompt** | (paste the entire prompt above) |
| **Model** | Select one with: `search_web`, `run_command`, `write_file`, `read_file`, `get_current_timestamp`, `fetch_url` |
| **Schedule (RRULE)** | `DTSTART:20260923T060000\nRRULE:FREQ=DAILY` (6 AM UTC daily) |
| **Timeout** | 300 seconds |
| **Folder** | (optional) create a folder for automation runs |

---

## ⚠️ PREREQUISITES (Must be true before first run)

1. **SSH key registered with GitHub** — the container has `~/.ssh/id_ed25519` but the PUBLIC key must be added to `github.com/settings/keys` or repo deploy keys
2. **Git remote is SSH** — `git@github.com:Soyda/soyda.github.io.git` (already set)
3. **Git user configured** — run once manually: `git config user.name "Soyda Bot" && git config user.email "bot@soyda.dev"`
4. **Branch exists** — `feature/news-digest` branch pushed to origin
5. **Tools enabled** — model must have all 6 tools available

---

## 🧪 TEST RUN (Manual Verification)

Before enabling schedule, run once manually in OpenWebUI chat with the same prompt to verify:
- [ ] All 4 searches return ≥8 results each
- [ ] JSON writes without error
- [ ] Validation script prints "VALIDATION PASSED"
- [ ] Git commit + push succeeds
- [ ] Remote raw URL returns 200
- [ ] Final output shows `DIGEST_UPDATE: SUCCESS`

Only enable daily schedule after manual test passes.