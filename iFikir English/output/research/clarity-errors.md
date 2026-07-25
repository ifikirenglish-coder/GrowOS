# Clarity API Error Log

## 2026-07-21 (KL time)

**Error:** Network policy blocks access to `www.clarity.ms:443`

**Detail:** The remote execution environment's outbound network proxy returned HTTP 403 (policy denial) for all 4 Clarity API calls. The host `www.clarity.ms` is not on the allowlist for this environment's network policy.

**Affected calls:**
- `project-live-insights?numOfDays=1` (overall)
- `...&dimension1=Device`
- `...&dimension1=Source`
- `...&dimension1=OS`

**Consequence:** No metrics collected. Google Sheet not updated. CSV not appended.

**Action needed:** Add `www.clarity.ms` to the allowed domains in the Claude Code on the Web environment network policy, or run this routine from an environment with unrestricted outbound HTTPS.

---

## 2026-07-22 (KL time) — Wednesday

**Error:** Network policy blocks access to `www.clarity.ms:443`

**Detail:** The remote execution environment's outbound network proxy returned HTTP 403 (policy denial) for all 4 Clarity API calls. This is the same persistent block as previous days.

**Affected calls:**
- `project-live-insights?numOfDays=1` (overall)
- `...&dimension1=Device`
- `...&dimension1=Source`
- `...&dimension1=OS`

**Consequence:** No metrics collected. Google Sheet not updated. CSV not appended.

**Action needed:** Add `www.clarity.ms` to the allowed domains in the Claude Code on the Web environment network policy, or run this routine from an environment with unrestricted outbound HTTPS.

---

## 2026-07-23 (KL time) — Thursday

**Error:** Network policy blocks access to `www.clarity.ms:443`

**Detail:** The remote execution environment's outbound network proxy returned HTTP 403 (policy denial) for all 4 Clarity API calls. This is the same persistent block as previous days (3rd consecutive day failing).

**Affected calls:**
- `project-live-insights?numOfDays=1` (overall)
- `...&dimension1=Device`
- `...&dimension1=Source`
- `...&dimension1=OS`

**Consequence:** No metrics collected. Google Sheet not updated. CSV not appended.

**Action needed:** Add `www.clarity.ms` to the allowed domains in the Claude Code on the Web environment network policy, or run this routine from an environment with unrestricted outbound HTTPS.

---

## 2026-07-24 (KL time) — Friday

**Error:** Network policy blocks access to `www.clarity.ms:443`

**Detail:** The remote execution environment's outbound network proxy returned HTTP 403 (policy denial) for all 4 Clarity API calls. Same persistent block — this is now the 4th consecutive day failing.

**Affected calls:**
- `project-live-insights?numOfDays=1` (overall)
- `...&dimension1=Device`
- `...&dimension1=Source`
- `...&dimension1=OS`

**Consequence:** No metrics collected. Google Sheet not updated. CSV not appended.

**Action needed:** Add `www.clarity.ms` to the allowed domains in the Claude Code on the Web environment network policy, or run this routine from an environment with unrestricted outbound HTTPS.

---

## Error — 2026-07-25 (KL time: Saturday)

**Time (UTC):** 2026-07-25T01:09 UTC  
**Step:** Step 2 — Clarity API calls  
**Error:** All 4 API calls failed with curl exit code 56 (CONNECT tunnel failed, 403 Forbidden)  
**Cause:** Remote execution environment network proxy blocks outbound connections to `www.clarity.ms:443` — policy denial at the gateway level.  
**Impact:** No data collected. Steps 3–5 skipped. No sheet row written. No CSV row appended.  
**Resolution needed:** This environment (Claude Code on web) cannot reach Microsoft Clarity's servers due to outbound network policy. Consider: (1) running this routine from a local machine or server with unrestricted outbound HTTPS, (2) requesting that `www.clarity.ms` be allowlisted in the environment network policy, or (3) using a different scheduling mechanism (e.g., a VPS cron job, GitHub Actions with unrestricted egress).

