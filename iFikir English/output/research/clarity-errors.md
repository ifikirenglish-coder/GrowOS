# Clarity API Errors

## 2026-10-07 (Wednesday) — KL time

**Error:** Proxy policy denial — `www.clarity.ms:443` blocked with HTTP 403 (CONNECT tunnel rejected)

**Details:**
- All 4 Clarity API calls failed before reaching the endpoint
- The outbound HTTPS proxy at `127.0.0.1:35869` enforces an egress policy that does not permit connections to `www.clarity.ms`
- This is a network policy issue, not an authentication or token issue
- Exit code: 56 (CURLE_RECV_ERROR — CONNECT tunnel failed, response 403)

**Impact:**
- No metrics collected for 2026-10-07
- Google Sheet row not written
- CSV not updated

**Resolution needed:**
- The host `www.clarity.ms` needs to be added to the allowed egress policy for this session/environment
- Contact Anthropic support or the environment administrator to whitelist `www.clarity.ms:443`

---

---
## 2026-10-08 (Thu) — API Call Failed

**Time:** 2026-10-08T01:07 UTC (09:07 KL)
**Error:** All 4 Clarity API calls rejected by egress proxy (policy denial)
**Detail:** `www.clarity.ms:443` — gateway answered 403 to CONNECT
**Cause:** The remote Claude Code environment's network policy does not allow outbound connections to `www.clarity.ms`
**Action required:** User must allow `www.clarity.ms` in the environment's network policy, or run this routine from a session with unrestricted egress.

No data written to sheet or CSV today.
