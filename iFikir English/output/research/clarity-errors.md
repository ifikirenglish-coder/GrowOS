# Clarity API Error Log

## 2026-06-13 Saturday (KL Time)

**Error:** All 4 Clarity API calls failed — `Host not in allowlist`

**Cause:** Same as previous days — remote execution environment blocks outbound access to `www.clarity.ms`.

**Calls attempted:**
- `GET /api/v1/project-live-insights?numOfDays=1` → blocked
- `GET /api/v1/project-live-insights?numOfDays=1&dimension1=Device` → blocked
- `GET /api/v1/project-live-insights?numOfDays=1&dimension1=Source` → blocked
- `GET /api/v1/project-live-insights?numOfDays=1&dimension1=OS` → blocked

**Impact:** No metrics written to Google Sheet or CSV for this date.

---

## 2026-06-12 Friday (KL Time)

**Error:** All 4 Clarity API calls failed — `Host not in allowlist`

**Cause:** Same as previous days — remote execution environment blocks outbound access to `www.clarity.ms`.

**Calls attempted:**
- `GET /api/v1/project-live-insights?numOfDays=1` → blocked
- `GET /api/v1/project-live-insights?numOfDays=1&dimension1=Device` → blocked
- `GET /api/v1/project-live-insights?numOfDays=1&dimension1=Source` → blocked
- `GET /api/v1/project-live-insights?numOfDays=1&dimension1=OS` → blocked

**Impact:** No metrics written to Google Sheet or CSV for this date.

---

## 2026-06-11 Thursday (KL Time)

**Error:** All 4 Clarity API calls failed — `Host not in allowlist`

**Cause:** Same as yesterday — remote execution environment blocks outbound access to `www.clarity.ms`.

**Calls attempted:**
- `GET /api/v1/project-live-insights?numOfDays=1` → blocked
- `GET /api/v1/project-live-insights?numOfDays=1&dimension1=Device` → blocked
- `GET /api/v1/project-live-insights?numOfDays=1&dimension1=Source` → blocked
- `GET /api/v1/project-live-insights?numOfDays=1&dimension1=OS` → blocked

**Impact:** No metrics written to Google Sheet or CSV for this date.

---

## 2026-06-10 Wednesday (KL Time)

**Error:** All 4 Clarity API calls failed — `Host not in allowlist`

**Cause:** The remote execution environment (Claude Code on the web) has outbound network restrictions. The Clarity API endpoint `https://www.clarity.ms` is not in the allowed outbound hosts for this environment.

**Calls attempted:**
- `GET /api/v1/project-live-insights?numOfDays=1` → blocked
- `GET /api/v1/project-live-insights?numOfDays=1&dimension1=Device` → blocked
- `GET /api/v1/project-live-insights?numOfDays=1&dimension1=Source` → blocked
- `GET /api/v1/project-live-insights?numOfDays=1&dimension1=OS` → blocked

**Impact:** No metrics written to Google Sheet or CSV for this date.

**Resolution:** To fix this, the environment's network policy needs to allow outbound access to `www.clarity.ms`. This can be configured when creating or editing the Claude Code environment at https://code.claude.com/docs/en/claude-code-on-the-web

Alternatively, run this analytics agent locally (where there are no outbound restrictions) via `claude` CLI.

---
## 2026-06-14 Sunday — Network Egress Block

**Time (KL):** 2026-06-14 (Sunday)
**Error:** `Host not in allowlist: www.clarity.ms`
**Cause:** The remote execution environment's network policy does not permit outbound connections to `www.clarity.ms`.
**Impact:** All 4 Clarity API calls failed. No metrics collected. Google Sheet not updated. CSV not appended.
**Action required:** Add `www.clarity.ms` to the environment's network egress allowlist in Claude Code on the web settings, or run this routine from an environment with unrestricted outbound access.

## 2026-06-15 (Monday) — Network Egress Block

**Time:** 2026-06-15 ~09:00 KL (01:00 UTC)
**Error:** All 4 Clarity API calls failed with:
> Host not in allowlist: www.clarity.ms. Add this host to your network egress settings to allow access.

**Cause:** The remote execution environment (Claude Code on the web) does not allow outbound connections to `www.clarity.ms`.
**Impact:** No data collected for 2026-06-15. CSV not updated. Google Sheet not written.
**Action required:** Add `www.clarity.ms` to the network egress allowlist in the Claude Code environment settings.
  - Go to: https://code.claude.com/docs/en/claude-code-on-the-web
  - Under Environment configuration → Network policy, add `www.clarity.ms` to the allowed hosts.

