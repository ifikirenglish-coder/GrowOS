# Clarity API Error Log

## 2026-09-19 (Saturday) — KL Time

**Error:** Network policy denial — outbound HTTPS to `www.clarity.ms:443` blocked by proxy.

**Detail:** The remote execution environment's network policy returned HTTP 403 on CONNECT to `www.clarity.ms:443`. This is a policy-level block, not a Clarity API error. All 4 API calls failed before reaching Clarity.

**Proxy status at time of failure:**
```
kind: connect_rejected
detail: gateway answered 403 to CONNECT (policy denial or upstream failure)
host: www.clarity.ms:443
ts: 2026-09-19T01:09:24.328Z
```

**Impact:**
- No metrics retrieved for 2026-09-19
- Google Sheet row NOT written
- CSV NOT updated

**Resolution:**
The scheduled task environment needs `www.clarity.ms` added to the network allowlist.
The user should check the environment's network policy settings at:
https://code.claude.com/docs/en/claude-code-on-the-web

---

## 2026-09-20 (Sunday) — KL Time

**Error:** Network policy denial — outbound HTTPS to `www.clarity.ms:443` blocked by proxy.

**Detail:** The remote execution environment's network policy returned HTTP 403 on CONNECT to `www.clarity.ms:443`. This is a policy-level block, not a Clarity API error. All 4 API calls failed before reaching Clarity. This is the **second consecutive day** with this failure.

**Proxy status at time of failure:**
```
kind: connect_rejected
detail: gateway answered 403 to CONNECT (policy denial or upstream failure)
host: www.clarity.ms:443
ts: 2026-09-20T01:09:13.849Z
```

**Impact:**
- No metrics retrieved for 2026-09-20
- Google Sheet row NOT written
- CSV NOT updated

**Resolution needed:**
`www.clarity.ms` must be added to the network allowlist in the remote execution environment.
Configure at: https://code.claude.com/docs/en/claude-code-on-the-web

---

## 2026-09-21 09:10 KL — BLOCKED: Network Policy

**Status:** All 4 Clarity API calls failed  
**Error:** `www.clarity.ms:443` — `connect_rejected` (gateway answered 403 to CONNECT — policy denial)  
**Root cause:** The Claude Code remote execution environment's egress proxy does not allow outbound HTTPS to `www.clarity.ms`.  
**Impact:** No data collected. Sheet not updated. CSV not appended.  
**Fix required:** The network policy for this environment must allowlist `www.clarity.ms`. The user needs to reconfigure the environment to permit this domain, or run the routine from a different environment with unrestricted egress.

