# Clarity API Error Log

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
