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
