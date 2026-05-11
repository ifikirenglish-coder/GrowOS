# Clarity → GA4 Setup Status
Checked: 2026-05-11

## Status
- Clarity Project ID: woitwv8pge
- GA4 Measurement ID: G-PJ9M44L7X5
- GA4 Property: ifikirenglish.com - GA4

## API Check Result
Both Clarity API endpoints returned 403 (host not in allowlist) — external requests are blocked in this environment. Data status cannot be confirmed programmatically; manual browser check is required.

## Action Required (Browser Session Needed)
Next time Claude Code opens with browser access:
1. Go to: https://clarity.microsoft.com/projects/view/woitwv8pge/settings#integrations
2. Click "Google Analytics"
3. Enter Measurement ID: G-PJ9M44L7X5
4. Save

That's it — 2 minit je. Lepas connect, Clarity akan hantar scroll depth events ke GA4.

## After GA4 Connected
- Looker Studio boleh access GA4 data
- Scroll depth, heatmap events akan appear dalam GA4 reports
- Weekly report routine boleh diupdate untuk include Clarity metrics
