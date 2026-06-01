[2026-05-20] ERROR: Clarity API returned HTTP 403 — "Host not in allowlist". The remote execution environment's IP address is not permitted by Clarity's API allowlist. Resolution: Add the outbound IP of the Claude Code cloud environment to the Clarity project's allowed hosts, or run this agent from a local or static-IP environment.
[2026-05-21] ERROR: All 4 Clarity API calls (overall, Device, Source, OS) returned "Host not in allowlist". Same root cause as 2026-05-20 — remote cloud execution environment IP blocked by Clarity. No data available for today. Sheet write and CSV append skipped.
[2026-05-22] ERROR: All 4 Clarity API calls (overall, Device, Source, OS) returned "Host not in allowlist". Third consecutive day blocked. Remote cloud container IP not in Clarity's allowed hosts. Sheet write and CSV append skipped. ACTION REQUIRED: This issue will not self-resolve — see resolution note below.
[2026-05-23] ERROR: All 4 Clarity API calls (overall, Device, Source, OS) returned "Host not in allowlist". Fourth consecutive day blocked. Remote cloud container IP not in Clarity's allowed hosts. Sheet write and CSV append skipped.
[2026-05-24] ERROR: All 4 Clarity API calls (overall, Device, Source, OS) returned "Host not in allowlist". Fifth consecutive day blocked. Remote cloud container IP not in Clarity's allowed hosts. Sheet write and CSV append skipped.
[2026-05-25] ERROR: All 4 Clarity API calls (overall, Device, Source, OS) returned "Host not in allowlist". Sixth consecutive day blocked. Remote cloud container IP not in Clarity's allowed hosts. Sheet write and CSV append skipped.
[2026-05-26] ERROR: All 4 Clarity API calls (overall, Device, Source, OS) returned "Host not in allowlist". Seventh consecutive day blocked. Remote cloud container IP not in Clarity's allowed hosts. Sheet write and CSV append skipped.
[2026-05-27] ERROR: All 4 Clarity API calls (overall, Device, Source, OS) returned "Host not in allowlist". Eighth consecutive day blocked. Remote cloud container IP not in Clarity's allowed hosts. Sheet write and CSV append skipped.
[2026-05-28] ERROR: All 4 Clarity API calls (overall, Device, Source, OS) returned "Host not in allowlist". Ninth consecutive day blocked. Remote cloud container IP not in Clarity's allowed hosts. Sheet write and CSV append skipped.

---
## Error — 2026-05-29 Friday
**Time (KL):** 09:10
**Error:** Host not in allowlist — all 4 Clarity API calls blocked by environment network policy.
**URL attempted:** https://www.clarity.ms/export-data/api/v1/project-live-insights
**Action required:** clarity.ms must be added to the allowlist for this Claude Code environment. Go to environment settings at https://code.claude.com and add clarity.ms to the allowed outbound hosts.
**Data written:** None — CSV and Sheet rows skipped for this run.

## Error — 2026-05-30 Saturday

**Time (UTC):** 2026-05-30 01:09:36 UTC
**Status:** 403 Forbidden — `x-deny-reason: host_not_allowed`
**Message:** Host not in allowlist (sandbox egress policy blocks outbound to www.clarity.ms)
**Impact:** All 4 API calls failed. Metrics logged as zeros for this date.
**Action required:** Run from a machine/environment with outbound HTTPS access to www.clarity.ms

[2026-05-31 Sunday] ERROR: Clarity API returned 403 on all 4 calls — Host not in allowlist. Container IP not permitted by Clarity project settings.
[2026-06-01 Monday] ERROR: Clarity API returned "Host not in allowlist" on all 4 calls (overall, Device, Source, OS). 13th consecutive day blocked. Remote cloud container IP not in Clarity's allowed hosts. Sheet write and CSV append skipped.
