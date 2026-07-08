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
