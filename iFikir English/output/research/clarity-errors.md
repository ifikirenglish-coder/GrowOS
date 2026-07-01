# Clarity API Errors

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
