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

---

## 2026-10-30 — Proxy Network Policy Block (3rd consecutive day)

- **Run time:** 2026-10-30 09:00 KL (01:00 UTC)
- **Error:** All 4 Clarity API calls failed — proxy returned `403 Forbidden` (CONNECT tunnel rejected) for `www.clarity.ms:443`
- **Root cause:** Cloud session outbound network policy does not allow connections to `www.clarity.ms`. Same issue as Oct 28 and Oct 29.
- **Impact:** No data written to Google Sheet or CSV. Third consecutive missed day.
- **Action needed:** User must allowlist `www.clarity.ms` in the cloud session network policy. See https://code.claude.com/docs/en/claude-code-on-the-web
- **Sheet row:** Not written
- **CSV:** Not appended

---
## 2026-10-31 (KL) — API Blocked by Proxy

- Run time: 2026-10-31T01:02 UTC (09:02 KL)
- Error: All 4 Clarity API calls failed — HTTP_STATUS:000
- Cause: Proxy gateway returned 403 (policy denial) for CONNECT to www.clarity.ms:443
- Detail: Network policy in the remote execution environment blocks outbound HTTPS to clarity.ms
- Impact: No metrics collected. Sheet not updated. CSV row not appended.
- Action needed: The scheduled routine cannot reach Clarity from this environment. Consider running from a machine/environment where clarity.ms is not blocked.

---
## 2026-11-01 (KL) — API Blocked by Proxy (5th consecutive day)

- Run time: 2026-11-01T01:XX UTC (09:XX KL)
- Error: All 4 Clarity API calls failed — proxy returned `403 Forbidden` (CONNECT tunnel rejected) for `www.clarity.ms:443`
- Cause: Cloud session outbound network policy does not allow connections to `www.clarity.ms`
- Impact: No metrics collected. Sheet not updated. CSV row not appended. **5 consecutive missed days (Oct 28 – Nov 1).**
- Action needed: Allowlist `www.clarity.ms` in the cloud session network policy at https://code.claude.com/docs/en/claude-code-on-the-web

---
## 2026-11-02 (Monday) — Proxy Block (6th consecutive day)

- **Run time:** 2026-11-02T01:03 UTC (09:03 KL)
- **Error:** All 4 Clarity API calls failed — proxy returned `403 Forbidden` (CONNECT tunnel rejected) for `www.clarity.ms:443`
- **Root cause:** Cloud session outbound network policy does not allow connections to `www.clarity.ms`
- **Impact:** No metrics collected. Sheet not updated. CSV row not appended. **6 consecutive missed days (Oct 28 – Nov 2).**
- **Action needed:** Allowlist `www.clarity.ms` in the cloud session network policy at https://code.claude.com/docs/en/claude-code-on-the-web

## 2026-11-03 — API Blocked by Proxy
- **Date (KL):** 2026-11-03 Tuesday
- **Error:** `www.clarity.ms:443` blocked by outbound network policy (proxy returned 403 on CONNECT)
- **Curl exit code:** 56 (failure in receiving network data)
- **Impact:** All 4 API calls failed. No data collected. Sheet and CSV not updated.
- **Action needed:** The remote execution environment's network policy does not allow outbound connections to `www.clarity.ms`. This must be enabled to run this routine.

---
## 2026-11-04 (KL) — Routine Failed: Network Policy Blocking Clarity API

**Time:** 2026-11-04T01:02:55 UTC (09:02 KL)
**Error:** `www.clarity.ms:443` blocked by proxy — gateway returned 403 (policy denial / upstream failure)
**Calls attempted:** 4 (all failed)
**Sheet write:** Skipped (no data)
**CSV append:** Skipped (no data)

**What happened:** The cloud execution environment's network policy does not permit outbound connections to `www.clarity.ms`. All 4 Clarity API calls returned curl exit code 56 (network receive failure).

**Action needed:** The user must configure the execution environment to allow outbound HTTPS to `www.clarity.ms`. See environment network policy settings at https://code.claude.com/docs/en/claude-code-on-the-web.

## 2026-11-05 (Thu) — Scheduled routine failure

**Error:** Proxy blocked outbound connection to `www.clarity.ms` (HTTP 403 Forbidden).

**Cause:** The remote execution environment's network policy does not allow HTTPS connections to `www.clarity.ms`. This is a session-level network restriction — not a Clarity API issue.

**Calls attempted:** 4 (overall, Device, Source, OS dimensions)
**Data written:** None — no metrics recorded for this date.
**Sheet row written:** No.
**CSV appended:** No.

**Resolution required:** The environment's network policy must be updated to allow outbound HTTPS to `www.clarity.ms`. The user (or environment admin) needs to whitelist this host in the Claude Code remote environment network settings.


## 2026-11-06 09:03 KL
- **Error:** Proxy blocked connection to www.clarity.ms:443
- **HTTP status:** 000 (connection rejected)
- **Proxy reason:** gateway answered 403 to CONNECT (policy denial or upstream failure)
- **Affected calls:** All 4 (baseline, Device, Source, OS)
- **Result:** No data written to sheet or CSV for this date
- **Action needed:** Whitelist www.clarity.ms in the cloud environment's network policy
[2026-11-07 Saturday] ERROR: Clarity API unreachable. Proxy blocked www.clarity.ms:443 with 403 (policy denial). All 4 API calls failed (curl exit 56). No data collected.

---
## Error — 2026-11-08 Sunday (09:02 KL)

**Step:** Step 2 — Clarity API call
**Error:** All 4 API calls failed — proxy returned 403 (policy denial) on CONNECT to www.clarity.ms:443
**Detail:** The outbound network policy for this Claude Code remote session does not permit connections to clarity.ms. This is a session-level network restriction, not a token or authentication issue.
**Impact:** No data collected. No sheet row written. No CSV row appended.
**Action required:** User must add www.clarity.ms to the allowed hosts in the Claude Code environment's network policy, or run this routine from a session/environment with broader network access.

---
## Error — 2026-11-09 Monday (09:02 KL) — 13th consecutive missed day

**Step:** Step 2 — Clarity API call
**Error:** All 4 API calls failed — proxy returned 403 (policy denial) on CONNECT to www.clarity.ms:443
**Consecutive misses:** Oct 28 – Nov 9 (13 days)
**Impact:** No data collected. No sheet row written. No CSV row appended.
**Action required:** User must add www.clarity.ms to the allowed hosts in the Claude Code environment's network policy at https://code.claude.com/docs/en/claude-code-on-the-web

---
## Error — 2026-11-10 Tuesday (09:04 KL) — 14th consecutive missed day

**Step:** Step 2 — Clarity API call
**Error:** All 4 API calls failed — proxy returned 403 (policy denial) on CONNECT to www.clarity.ms:443
**Consecutive misses:** Oct 28 – Nov 10 (14 days)
**Impact:** No data collected. No sheet row written. No CSV row appended.
**Action required:** User must add www.clarity.ms to the allowed hosts in the Claude Code environment's network policy at https://code.claude.com/docs/en/claude-code-on-the-web

---
## Error — 2026-11-10 Tuesday weekly report run

- **Error:** www.clarity.ms:443 blocked by outbound network policy (proxy returned 403 on CONNECT)
- **Consecutive missed days:** ~156 (since ~Jun 7 2026)
- **Impact:** Clarity section in weekly report marked [API ERROR]. No data for sessions, scroll depth, rage/dead clicks, active time.
- **Action required:** Allowlist www.clarity.ms in Claude Code remote environment network policy at https://code.claude.com/docs/en/claude-code-on-the-web

---
## Error — 2026-11-11 Wednesday (09:02 KL) — 15th consecutive missed day

**Step:** Step 2 — Clarity API call
**Error:** All 4 API calls failed — proxy returned `connect_rejected` (policy denial) on CONNECT to www.clarity.ms:443
**Consecutive misses:** Oct 28 – Nov 11 (15 days)
**Impact:** No data collected. No sheet row written. No CSV row appended.
**Action required:** User must add www.clarity.ms to the allowed hosts in the Claude Code environment's network policy at https://code.claude.com/docs/en/claude-code-on-the-web
