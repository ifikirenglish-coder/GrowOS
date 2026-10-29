# Clarity API Errors

## 2026-10-28 (KL time) — Network policy blocking Clarity

All 4 Clarity API calls to `www.clarity.ms:443` were rejected by the egress proxy with HTTP 403 (policy denial).

- The remote execution environment's network policy does not allow outbound connections to `www.clarity.ms`.
- This is a session-level network configuration issue, not a token or API problem.
- The Clarity token and project ID are valid (read from `memory/clarity_api.md`).

**Action required:** The session's network policy needs to allowlist `www.clarity.ms` for this scheduled routine to work. The user can reconfigure the network policy when creating a new session at https://code.claude.com/docs/en/claude-code-on-the-web.

No data was written to the tracking CSV or Google Sheet for today's run.

---

## 2026-10-29 — Proxy Network Policy Block

- **Run time:** 2026-10-29 09:00 KL (01:00 UTC)
- **Error:** All 4 Clarity API calls failed — proxy returned `403 Forbidden` (CONNECT tunnel rejected) for `www.clarity.ms:443`
- **Root cause:** The cloud session's outbound network policy does not allow connections to `www.clarity.ms`. This is a proxy/environment restriction, not a Clarity API or token issue.
- **Impact:** No data written to Google Sheet or CSV for today (2026-10-29).
- **Action needed:** The user must enable `www.clarity.ms` in the allowed domains list for their cloud execution environment, or run this routine from an environment with unrestricted outbound access.
- **Sheet row:** Not written
- **CSV:** Not appended
