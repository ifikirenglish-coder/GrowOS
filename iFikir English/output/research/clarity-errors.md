# Clarity API Errors

## 2026-07-08 (KL time) — Policy Denial

**Run time:** 2026-07-08 Wednesday (KL) / 2026-07-08T01:08 UTC

**Error:** All 4 Clarity API calls to `www.clarity.ms:443` were blocked by the egress proxy with HTTP 403 (connect_rejected — policy denial).

**Proxy status excerpt:**
```
"kind": "connect_rejected",
"detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)",
"host": "www.clarity.ms:443"
```

**Action required:** The remote Claude Code environment's network policy does not allow outbound connections to `www.clarity.ms`. To fix:
1. Update the environment's network policy to allow `www.clarity.ms` (port 443).
2. Or run the analytics routine from an environment with unrestricted HTTPS access.

**Impact:** No data written to Google Sheet or CSV for today (2026-07-08).

---

## 2026-07-09 (KL time) — Policy Denial (Repeat)

**Run time:** 2026-07-09 Thursday (KL) / 2026-07-09T01:xx UTC

**Error:** All 4 Clarity API calls to `www.clarity.ms:443` blocked again by egress proxy with HTTP 403 (connect_rejected — policy denial). This is the second consecutive day.

**Proxy status excerpt:**
```
"kind": "connect_rejected",
"detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)",
"host": "www.clarity.ms:443"
```

**Action required:** Network policy in the remote execution environment is blocking `www.clarity.ms`. This routine cannot run until resolved. Options:
1. Update environment network policy to allowlist `www.clarity.ms` (port 443).
2. Run routine from an environment with unrestricted HTTPS (local machine or different cloud config).

**Impact:** No data written to Google Sheet or CSV for today (2026-07-09). Two days of data gaps (Jul 8–9).

---

## 2026-07-10 (KL time) — Policy Denial (3rd Consecutive Day)

**Run time:** 2026-07-10 Friday (KL) / 2026-07-10T01:xx UTC

**Error:** All 4 Clarity API calls to `www.clarity.ms:443` blocked again by egress proxy with HTTP 403 (connect_rejected — policy denial). This is the **third consecutive day** of failure.

**Proxy status excerpt:**
```
"kind": "connect_rejected",
"detail": "gateway answered 403 to CONNECT (policy denial or upstream failure)",
"host": "www.clarity.ms:443"
```

**Action required:** This routine has now missed 3 days (Jul 8, 9, 10). Urgent action needed:
1. Update environment network policy to allowlist `www.clarity.ms` (port 443).
2. Or run routine from an environment with unrestricted HTTPS (local machine or different cloud config).
3. Historical backfill may be possible using Clarity's `numOfDays=3` parameter after the fix.

**Impact:** No data written to Google Sheet or CSV for today (2026-07-10). Three days of data gaps (Jul 8–10).

---
## 2026-07-11 (KL time) — Daily Run Failed

**Error:** All 4 Clarity API calls blocked by environment network policy.

- Host: `www.clarity.ms:443`
- Proxy response: 403 `connect_rejected` — "gateway answered 403 to CONNECT (policy denial or upstream failure)"
- All 4 calls (overall, device, source, OS) returned `HTTP_STATUS:000`

**Impact:** No data written to Google Sheet or CSV for 2026-07-11.

**Action required:** The remote execution environment's network policy does not allow outbound HTTPS to `www.clarity.ms`. This needs to be allowlisted in the environment's network policy settings for this routine to work.

**Timestamps (UTC):**
- 2026-07-11T01:08:59.230Z — overall
- 2026-07-11T01:08:59.581Z — device
- 2026-07-11T01:08:59.931Z — source
- 2026-07-11T01:09:00.288Z — OS

---
## 2026-07-12 (KL time) — Daily Run Failed (5th consecutive day)

**Error:** All 4 Clarity API calls blocked by environment network policy.

- Host: `www.clarity.ms:443`
- Proxy response: 403 `connect_rejected` — "gateway answered 403 to CONNECT (policy denial or upstream failure)"
- All 4 calls (overall, device, source, OS) returned `HTTP_STATUS:000`

**Impact:** No data written to Google Sheet or CSV for 2026-07-12.

**Critical:** This routine has now failed for **5 consecutive days** (Jul 8–12). Data gap is growing.

**Action required:** The remote execution environment's network policy does not allow outbound HTTPS to `www.clarity.ms`. Must be allowlisted for this routine to function. See options in earlier entries.

---
## 2026-07-13 Monday

**Error:** Outbound network access to `www.clarity.ms:443` blocked by proxy policy (HTTP 403 CONNECT rejection).

**Impact:** All 4 Clarity API calls failed. No metrics collected. Sheet write and CSV append skipped.

**Action needed:** The Claude Code remote execution environment's network policy does not allow connections to `clarity.ms`. The operator needs to whitelist `www.clarity.ms` in the environment's network policy, or run this routine from an environment with unrestricted outbound HTTPS.

**Run time:** 2026-07-13 09:09 KLT

## 2026-07-14 — Network Policy Denial

**Date (KL):** 2026-07-14 Tuesday  
**Time (UTC):** ~01:09  
**Error:** `gateway answered 403 to CONNECT (policy denial or upstream failure)` for `www.clarity.ms:443`  
**Cause:** The remote execution environment's egress proxy blocks outbound HTTPS to `www.clarity.ms`. This is a network policy restriction, not a Clarity API or token error.  
**Impact:** All 4 Clarity API calls failed. No data collected. Google Sheet not updated. CSV not appended.  
**Action needed:** To fix this, the remote environment's network policy needs to allowlist `www.clarity.ms:443`. This can be configured in the Claude Code on the Web environment settings.  

## 2026-07-15 (KL) — Daily routine failed

- **Time (UTC):** 2026-07-15T01:08 UTC
- **Error:** All 4 Clarity API calls blocked by remote environment proxy
- **Detail:** `www.clarity.ms:443` → 403 CONNECT rejected (gateway policy denial)
- **Root cause:** The Claude Code remote execution environment's outbound HTTPS proxy blocks `clarity.ms`. This is a network policy restriction, not a Clarity auth issue.
- **Impact:** No data written to tracking CSV or Google Sheet for today (2026-07-15 / Wed 15-Jul-26)
- **Resolution needed:** Either (a) run this routine locally/on a VPS with open egress, or (b) request that `clarity.ms` be added to the proxy allowlist.


---
## 2026-07-16 (KL) — Network Policy Blocking clarity.ms

**Run date:** 2026-07-16 Thursday (KL)
**Error:** All 4 Clarity API calls failed — proxy returned HTTP 403 CONNECT rejected for `www.clarity.ms:443`
**Proxy status:** `connect_rejected` — "gateway answered 403 to CONNECT (policy denial or upstream failure)"
**Impact:** No metrics collected. Sheet write and CSV append skipped.
**Action needed:** The remote execution environment's network policy does not allow outbound HTTPS to `www.clarity.ms`. To fix: whitelist `www.clarity.ms` in the environment's network policy settings, or run this routine from a less restricted environment.
