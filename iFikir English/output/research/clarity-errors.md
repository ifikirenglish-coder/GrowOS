# Clarity API Errors

## 2026-10-28 (KL time) — Network policy blocking Clarity

All 4 Clarity API calls to `www.clarity.ms:443` were rejected by the egress proxy with HTTP 403 (policy denial).

- The remote execution environment's network policy does not allow outbound connections to `www.clarity.ms`.
- This is a session-level network configuration issue, not a token or API problem.
- The Clarity token and project ID are valid (read from `memory/clarity_api.md`).

**Action required:** The session's network policy needs to allowlist `www.clarity.ms` for this scheduled routine to work. The user can reconfigure the network policy when creating a new session at https://code.claude.com/docs/en/claude-code-on-the-web.

No data was written to the tracking CSV or Google Sheet for today's run.

---
