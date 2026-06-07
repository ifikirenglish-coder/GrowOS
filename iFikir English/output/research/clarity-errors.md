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

## 2026-06-04 — Network blocked

All 4 Clarity API calls returned: `Host not in allowlist`

The remote execution environment's network policy does not allow outbound connections to `www.clarity.ms`. This is an environment-level network restriction, not a token issue.

**Resolution:** Run this routine locally (your machine or a server with unrestricted outbound access), or ask the environment provider to allowlist `www.clarity.ms`.

Calls attempted:
- `GET /project-live-insights?numOfDays=1` → Host not in allowlist
- `GET /project-live-insights?numOfDays=1&dimension1=Device` → Host not in allowlist
- `GET /project-live-insights?numOfDays=1&dimension1=Source` → Host not in allowlist
- `GET /project-live-insights?numOfDays=1&dimension1=OS` → Host not in allowlist

## 2026-06-05 Friday — API Error

- **Date (KL):** 2026-06-05 Friday
- **Error:** HTTP 403 on all 4 Clarity API calls
- **Response body:** `Host not in allowlist`
- **Cause:** The remote execution environment's IP is not whitelisted in the Clarity project settings for project `woitwv8pge`.
- **Calls attempted:** base, Device, Source, OS
- **Result:** No data collected. Sheet and CSV not updated.
- **Fix:** In Microsoft Clarity → Project Settings → API → add the remote environment's egress IP to the allowlist. Alternatively, run this routine from a machine/IP already on the allowlist.

## 2026-06-06 Saturday — API Error

- **Date (KL):** 2026-06-06 Saturday
- **Error:** All 4 Clarity API calls blocked — `Host not in allowlist`
- **Calls attempted:** base, Device, Source, OS
- **Result:** No data collected. Sheet and CSV not updated.
- **Note:** 4th consecutive day blocked (Jun 3–6). This is a persistent environment-level network restriction.

## 2026-06-07 Sunday — API Error

- **Date (KL):** 2026-06-07 Sunday
- **Error:** All 4 Clarity API calls blocked — `Host not in allowlist`
- **Calls attempted:** base, Device, Source, OS
- **Result:** No data collected. Sheet and CSV not updated.
- **Note:** 5th consecutive day blocked (Jun 3–7). Persistent environment-level network restriction to `www.clarity.ms`.

