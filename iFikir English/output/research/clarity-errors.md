# Clarity API Errors

## 2026-06-03 (KL)

**Error:** All 4 API calls blocked with "Host not in allowlist"

The remote execution environment (Claude Code on the web) has a network policy that blocks outbound requests to `www.clarity.ms`. The Clarity `export-data` API is not in the allowed host list.

**Calls attempted:**
- `https://www.clarity.ms/export-data/api/v1/project-live-insights?numOfDays=1` → blocked
- `...&dimension1=Device` → blocked
- `...&dimension1=Source` → blocked
- `...&dimension1=OS` → blocked

**Impact:** No metrics were collected. Sheet write and CSV append were skipped.

**Resolution needed:** Run this script locally (on your machine) or configure a GitHub Action trigger that runs outside the restricted sandbox.
