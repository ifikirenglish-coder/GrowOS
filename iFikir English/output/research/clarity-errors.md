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

## 2026-10-09 (Friday) — Daily Run Failed

**Error:** All 4 Clarity API calls blocked by egress proxy policy.

- Host blocked: `www.clarity.ms:443`
- Proxy response: `403 connect_rejected` — gateway denied CONNECT (policy denial)
- All 4 calls failed: overall, device, source, OS
- No data written to LPTrx sheet or CSV this date

**Action required:** The session's network egress policy does not allow outbound HTTPS to `www.clarity.ms`. The scheduled routine cannot fetch Clarity data until this host is allowlisted in the Claude Code remote session network policy.

To fix: In the session settings at https://code.claude.com, add `www.clarity.ms` to the allowed outbound hosts for this environment.

---
## 2026-10-10 Saturday — Run Failed: Proxy Blocked

**Error:** All 4 Clarity API calls failed.
**Cause:** The remote execution environment's network proxy denied CONNECT to `www.clarity.ms:443` (HTTP 403 — policy denial).
**Curl exit code:** 56 (network receive failure)
**Proxy host:** 127.0.0.1:43961

**Steps not completed:**
- Step 2: Clarity API calls (all 4) — FAILED
- Step 3: Parse metrics — SKIPPED (no data)
- Step 4: Write to Google Sheet — SKIPPED
- Step 5: Append to CSV — SKIPPED
- Step 6: Git commit — SKIPPED

**Action required:** The clarity.ms domain needs to be allowlisted in the environment's network policy. Contact environment admin or recreate the environment with clarity.ms access permitted.
