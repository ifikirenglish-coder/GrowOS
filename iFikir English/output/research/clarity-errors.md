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

