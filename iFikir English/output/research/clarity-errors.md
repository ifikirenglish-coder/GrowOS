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
