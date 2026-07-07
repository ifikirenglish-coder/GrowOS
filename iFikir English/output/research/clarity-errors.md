# Clarity API Errors

## 2026-07-07 Tuesday (KL Time) — FAILURE #8

**Error: Network policy blocking outbound connections**

- Run time: 2026-07-07 (weekly report routine)
- Clarity API call failed: `www.clarity.ms:443` — proxy returned HTTP_CODE:000 (policy denial)
- Root cause: Remote execution environment network policy blocks outbound HTTPS to `www.clarity.ms`
- This is the **8th consecutive failure** (~27 days, since ~10 Jun 2026)

No Clarity data collected for weekly report.

**Action required:** Update the Claude Code on the Web environment's network policy to allow `www.clarity.ms`. See: https://code.claude.com/docs/en/claude-code-on-the-web

---

## 2026-07-06 Monday (KL Time) — FAILURE #7

**Error: Network policy blocking outbound connections**

- Run time: 2026-07-06 09:09 KL (01:09 UTC)
- All 4 Clarity API calls failed: `www.clarity.ms:443` — proxy returned 403 (policy denial)
- Root cause: Remote execution environment network policy blocks outbound HTTPS to `www.clarity.ms`
- This is the **7th+ consecutive failure** (2026-06-28, 07-01, 07-02, 07-03, 07-04, 07-05, 07-06)

No data was written to the tracking CSV or Google Sheet for this date.

**Action required (urgent — 7+ days of data missing):** Update the Claude Code on the Web environment's network policy to allow:
- `www.clarity.ms` (Clarity analytics API)
- `oauth2.googleapis.com` (Google OAuth token refresh)
- `sheets.googleapis.com` (Google Sheets API)

See: https://code.claude.com/docs/en/claude-code-on-the-web for environment network policy configuration.

---

## 2026-07-03 Friday (KL Time)

**Error: Network policy blocking outbound connections**

- Run time: 2026-07-03 09:09 KL (01:09 UTC)
- All 4 Clarity API calls failed: `www.clarity.ms:443` — proxy returned 403 (policy denial)
- Root cause: Remote execution environment network policy blocks outbound HTTPS to `www.clarity.ms`
- This is the **4th consecutive failure** (also failed 2026-07-02, 2026-07-01, 2026-06-28)

No data was written to the tracking CSV or Google Sheet for this date.

**Action required (urgent — 4 days of data missing):** Update the Claude Code on the Web environment's network policy to allow:
- `www.clarity.ms` (Clarity analytics API)
- `oauth2.googleapis.com` (Google OAuth token refresh)
- `sheets.googleapis.com` (Google Sheets API)

See: https://code.claude.com/docs/en/claude-code-on-the-web for environment network policy configuration.

---

## 2026-07-02 Thursday (KL Time)

**Error: Network policy blocking outbound connections**

- Run time: 2026-07-02 09:08 KL (01:08 UTC)
- All 4 Clarity API calls failed: `www.clarity.ms:443` — proxy returned 403 (policy denial)
- Root cause: Remote execution environment network policy blocks outbound HTTPS to `www.clarity.ms`
- This is the 3rd consecutive failure (also failed 2026-07-01 and 2026-06-28)

No data was written to the tracking CSV or Google Sheet for this date.

**Action required:** Update the Claude Code on the Web environment's network policy to allow:
- `www.clarity.ms` (Clarity analytics API)
- `oauth2.googleapis.com` (Google OAuth token refresh)
- `sheets.googleapis.com` (Google Sheets API)

---

## 2026-07-01 Wednesday (KL Time)

**Error: Network policy blocking outbound connections**

- Run time: 2026-07-01 ~09:00 KL (01:00 UTC)
- All 4 Clarity API calls failed: `www.clarity.ms:443` — proxy returned 403 (policy denial)
- Root cause: Remote execution environment network policy blocks outbound HTTPS to `www.clarity.ms`

No data was written to the tracking CSV or Google Sheet for this date.

---

## 2026-06-28 Sunday (KL Time)

**Error: Network policy blocking outbound connections**

- Run time: 2026-06-28 ~09:05 KL (01:05 UTC)
- All 4 Clarity API calls failed: `www.clarity.ms:443` — proxy returned 403 (policy denial)
- Google Sheets API also blocked: `www.google.com:443` — proxy returned 403
- Root cause: The remote execution environment's network policy does not allow connections to `www.clarity.ms` or Google APIs

**Resolution needed:**
The Claude Code on the Web environment running this routine needs an updated network policy that allows outbound HTTPS to:
- `www.clarity.ms` (Clarity analytics API)
- `oauth2.googleapis.com` (Google OAuth token refresh)
- `sheets.googleapis.com` (Google Sheets API)

No data was written to the tracking CSV or Google Sheet for this date.

## 2026-07-04 — Network policy block (KL: Saturday)

**Error:** The remote execution environment's network proxy blocked all outbound HTTPS connections to `www.clarity.ms:443`.

**Proxy response:** `HTTP/1.1 403 Forbidden` — gateway policy denial on CONNECT tunnel.

**Impact:** All 4 Clarity API calls failed (HTTP_CODE:000). No metrics collected. Sheet row not written. CSV not updated.

**Action needed:** The Claude Code on the web environment requires outbound access to `www.clarity.ms` to be allowed in the network policy. The user or admin needs to update the session's network policy to permit this domain.

**Reference:** https://code.claude.com/docs/en/claude-code-on-the-web


---
## Error: 2026-07-05 Sunday

**Run time (UTC):** 2026-07-05T01:09:52Z
**Stage:** Step 2 — Clarity API calls
**Error:** Network policy blocked all 4 API calls to www.clarity.ms:443

Proxy rejected CONNECT to www.clarity.ms:443 with 403 (policy denial).
This is a firewall/allowlist restriction in the Claude Code remote execution environment.

**Impact:** No metrics collected. Sheet not updated. CSV not appended.

**Fix:** The network policy for this remote session needs to allow outbound HTTPS to www.clarity.ms.
See: https://code.claude.com/docs/en/claude-code-on-the-web for environment configuration.

## 2026-07-07 Tuesday — API BLOCKED

- **Time:** $(TZ=Asia/Kuala_Lumpur date +"%H:%M KL")
- **Error:** All 4 Clarity API calls failed — `www.clarity.ms:443` blocked by egress proxy (403 policy denial)
- **Exit code:** 56 (CONNECT tunnel rejected)
- **Proxy status:** `recentRelayFailures` confirms `connect_rejected` for clarity.ms
- **Action required:** Whitelist `www.clarity.ms` in the session's egress policy, OR switch to a network policy that permits the Clarity API endpoint.
- **Impact:** No data written to sheet or CSV for this date.
