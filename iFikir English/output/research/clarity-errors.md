# Clarity API Errors Log

## 2026-09-10 Thursday (KL time)

**Error:** Egress policy denial — `www.clarity.ms:443` blocked by session proxy (403 CONNECT rejected).

All 4 API calls failed. No data was fetched, no CSV row appended, no sheet written.

**Root cause:** The Claude Code remote session's network egress policy does not permit outbound connections to `clarity.ms`. This is a session-level policy setting, not a token or authentication issue.

**Resolution required:** The session owner needs to update the egress policy for this scheduled task to allow outbound HTTPS to `www.clarity.ms`. This is configured in the Claude Code environment settings when creating the session/schedule.

Reference: https://code.claude.com/docs/en/claude-code-on-the-web

## 2026-09-11 Friday — API Call Failed

**Error:** The remote execution environment's egress proxy denied all connections to `www.clarity.ms:443` (HTTP 403 — organization policy).

**Cause:** The Claude Code cloud sandbox network policy does not permit outbound HTTPS to `www.clarity.ms`. This is a sandbox network restriction, not a token or API issue.

**Impact:** No Clarity data collected. No sheet row written. CSV not updated.

**Recommendation:** The user needs to whitelist `www.clarity.ms` in the cloud environment's network policy, or run this routine from a local/self-hosted environment.


## 2026-09-12 (Saturday) — Network Policy Denial

**Error:** Proxy blocked outbound connection to `www.clarity.ms:443`
**Detail:** `gateway answered 403 to CONNECT (policy denial or upstream failure)`
**Affected calls:** All 4 Clarity API calls (c1–c4)
**Result:** No data collected. Steps 3–6 skipped (no metrics to write).

**Action needed:** The remote execution environment's network policy does not permit connections to `www.clarity.ms`. To fix this, the user must allow this host in the environment's network policy settings.

See: https://code.claude.com/docs/en/claude-code-on-the-web for environment network configuration.

## 2026-09-13 (Sunday) — Network Policy Denial (4th consecutive day)

**Error:** Proxy blocked outbound connection to `www.clarity.ms:443`
**Detail:** `gateway answered 403 to CONNECT (policy denial or upstream failure)`
**Affected calls:** All 4 Clarity API calls (c1–c4)
**Result:** No data collected. Steps 3–6 skipped (no metrics to write).

**Action needed (urgent):** This is the 4th consecutive day the routine has failed due to the network egress policy blocking `www.clarity.ms`. The schedule is running successfully but cannot reach the Clarity API. No data has been logged to the sheet or CSV since the last successful run.

To resolve: allow `www.clarity.ms` in the environment's network policy, or reschedule this routine to run from a local environment.

See: https://code.claude.com/docs/en/claude-code-on-the-web

## 2026-09-14 (Monday) — Network Policy Denial (5th consecutive day)

**Error:** Proxy blocked outbound connection to `www.clarity.ms:443`
**Detail:** `gateway answered 403 to CONNECT (policy denial or upstream failure)`
**Affected calls:** All 4 Clarity API calls (c1–c4)
**Result:** No data collected. Steps 3–6 skipped (no metrics to write).

**Action needed (critical):** This is the 5th consecutive day this routine has failed. No Clarity data has been collected or logged since at least 2026-09-10. The schedule is firing correctly but the sandbox network policy blocks `www.clarity.ms`.

To resolve: allow `www.clarity.ms` in the environment's network policy at https://code.claude.com/docs/en/claude-code-on-the-web

## 2026-09-15 (Tuesday) — Network Policy Denial (6th consecutive day)

**Error:** Proxy blocked outbound connection to `www.clarity.ms:443`
**Detail:** `gateway answered 403 to CONNECT (policy denial or upstream failure)`
**Affected calls:** All 4 Clarity API calls (c1–c4)
**Result:** No data collected. Steps 3–6 skipped (no metrics to write).

**Action needed (critical):** This is the 6th consecutive day this routine has failed. No Clarity data has been collected or logged since at least 2026-09-10. The schedule is firing correctly but the sandbox network policy blocks `www.clarity.ms`.

To resolve: allow `www.clarity.ms` in the environment's network policy at https://code.claude.com/docs/en/claude-code-on-the-web

## 2026-09-16 (Wednesday) — Network Policy Denial (7th consecutive day)

**Error:** Proxy blocked outbound connection to `www.clarity.ms:443`
**Detail:** `gateway answered 403 to CONNECT (policy denial or upstream failure)`
**Affected calls:** All 4 Clarity API calls (c1–c4)
**Result:** No data collected. Steps 3–6 skipped (no metrics to write).

**Action needed (critical):** This is the 7th consecutive day this routine has failed. No Clarity data has been collected or logged since at least 2026-09-10. The schedule is firing correctly but the sandbox network policy blocks `www.clarity.ms`.

To resolve: allow `www.clarity.ms` in the environment's network policy at https://code.claude.com/docs/en/claude-code-on-the-web
