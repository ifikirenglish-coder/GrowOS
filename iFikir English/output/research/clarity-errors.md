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

---
## 2026-10-11 Sunday — Run Failed: Proxy Blocked (5th consecutive failure)

**Error:** All 4 Clarity API calls failed.
**Cause:** Remote execution environment's network proxy denied CONNECT to `www.clarity.ms:443` (HTTP 403 — policy denial).
**Proxy host:** 127.0.0.1:45427

**Steps not completed:**
- Step 2: Clarity API calls (all 4) — FAILED
- Step 3: Parse metrics — SKIPPED (no data)
- Step 4: Write to Google Sheet — SKIPPED
- Step 5: Append to CSV — SKIPPED
- Step 6: Git commit — SKIPPED

**This is the 5th consecutive day (Oct 7–11) that this routine has failed due to the same proxy block.**

**Action required:** Recreate the Claude Code remote session environment with `www.clarity.ms` added to the allowed outbound hosts. See https://code.claude.com/docs for environment configuration.

## 2026-10-12 01:08 UTC — Egress Policy Blocking clarity.ms

- **Date (KL):** 2026-10-12 Monday
- **Error:** `connect_rejected` — gateway answered 403 to CONNECT
- **Host:** www.clarity.ms:443
- **Cause:** Organization egress proxy policy is blocking outbound HTTPS to clarity.ms
- **Action needed:** Whitelist `www.clarity.ms` in the Claude Code remote environment's network policy, or switch to an environment that allows this domain.
- **Impact:** No data written to sheet or CSV today. Routine stopped at Step 2.

## 2026-10-13 (Run at ~09:08 KL time)

**Error:** Proxy policy denial — all 4 Clarity API calls blocked.
- Host `www.clarity.ms:443` returns `HTTP/1.1 403 Forbidden` at the CONNECT tunnel level.
- This is an environment-level network policy restriction, not a Clarity API issue.
- No data was collected. Sheet not written. CSV not appended.

**Action required:** The cloud execution environment's network policy does not allow outbound HTTPS to `www.clarity.ms`. This needs to be whitelisted for the daily routine to function. The user should check their Claude Code remote environment network policy settings at https://code.claude.com/docs/en/claude-code-on-the-web and add `www.clarity.ms` to the allowed hosts list.


## 2026-10-14 (Run at ~09:08 KL time)

**Error:** Proxy policy denial — all 4 Clarity API calls blocked.
- Host `www.clarity.ms:443` returns `HTTP/1.1 403 Forbidden` at the CONNECT tunnel level.
- This is the **8th consecutive failure** (Oct 7–14).
- No data collected. Sheet not written. CSV not appended.

**Action required:** Whitelist `www.clarity.ms` in the Claude Code remote environment's network policy. See https://code.claude.com/docs/en/claude-code-on-the-web

## 2026-10-15 — Clarity API blocked by network policy

- **Date:** 2026-10-15 Thursday (KL)
- **Error:** www.clarity.ms:443 connect_rejected — gateway answered 403 (policy denial)
- **Cause:** The remote execution environment's egress proxy does not permit outbound connections to clarity.ms. This is a network-level block, not a token issue.
- **Impact:** No data fetched. Sheet not updated. CSV not appended.
- **Resolution needed:** Re-run this routine in an environment with clarity.ms access allowed, or whitelist clarity.ms in the session's network policy.

## 2026-10-16 — Clarity API blocked by network policy (10th consecutive failure)

- **Date:** 2026-10-16 Friday (KL)
- **Error:** www.clarity.ms:443 connect_rejected — gateway answered 403 (policy denial)
- **Cause:** The remote execution environment's egress proxy does not permit outbound connections to clarity.ms. This is a network-level block, not a token issue.
- **Impact:** No data fetched. Sheet not updated. CSV not appended.
- **Consecutive failures:** Oct 7–16 (10 days in a row)
- **Resolution needed:** Whitelist `www.clarity.ms` in the Claude Code remote environment's network policy at https://code.claude.com/docs/en/claude-code-on-the-web

---
## 2026-10-17 09:07 KL — Proxy Block (Policy Denial)

**Status:** FAILED — All 4 Clarity API calls blocked
**Error:** Proxy gateway returned 403 to CONNECT for `www.clarity.ms:443`
**Detail:** `connect_rejected: gateway answered 403 to CONNECT (policy denial or upstream failure)`

The outbound HTTPS proxy does not allow connections to `www.clarity.ms`. This is a network policy restriction in the remote execution environment, not an API token issue.

**Impact:** No data collected for Sat 17-Oct-26. Sheet and CSV not updated.

**Resolution needed:** The user must either:
1. Allow `www.clarity.ms` in the remote environment's network policy, OR
2. Run this routine from a local machine or environment without proxy restrictions.

## 2026-10-18 Sunday — API Call Failed

**Error:** Outbound proxy blocked connection to www.clarity.ms:443  
**Detail:** gateway answered 403 to CONNECT (policy denial or upstream failure)  
**Affected calls:** c1, c2, c3, c4 (all 4)  
**Exit code:** 56 (curl connection reset)  
**Action needed:** The remote execution environment's network policy does not permit outbound HTTPS to www.clarity.ms. No data was collected today.

