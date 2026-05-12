# Laporan Mingguan iFikir English
Minggu berakhir: 11 Mei 2026 (Isnin)
Dijana: 12 Mei 2026, Selasa pagi

---

## ⚠️ Status Data Pull

| Sumber | Status | Sebab |
|---|---|---|
| brand.md | ❌ Tidak Jumpa | Fail belum dibuat — run `/setup` untuk create |
| OnPay (Form 31 – FB/MTC) | ❌ DATA NEEDED | `iFikir English/memory/onpay_api.md` tidak wujud |
| OnPay (Form 35 – TikTok) | ❌ DATA NEEDED | `iFikir English/memory/onpay_api.md` tidak wujud |
| Microsoft Clarity | ❌ API ERROR (403) | Host environment tidak dalam allowlist Clarity |
| clarity_api.md | ❌ Tidak Jumpa | Path Windows tidak accessible dari environment Linux |

**Cara nak fix sebelum laporan minggu depan — tengok bahagian Setup di bawah.**

---

## 📦 Sales Summary

> **[DATA NEEDED]** — OnPay API credentials tidak jumpa.
> Fail yang perlu dibuat: `iFikir English/memory/onpay_api.md`

| | Minggu Ini (5–11 Mei) | Minggu Lepas (28 Apr–4 Mei) | Perubahan |
|---|---|---|---|
| Orders (FB/MTC) | [DATA NEEDED] | [DATA NEEDED] | — |
| Revenue FB (RM) | [DATA NEEDED] | [DATA NEEDED] | — |
| Orders (TikTok) | [DATA NEEDED] | [DATA NEEDED] | — |
| Revenue TikTok (RM) | [DATA NEEDED] | [DATA NEEDED] | — |
| **TOTAL** | **—** | **—** | **—** |

**Manual check:** Log masuk OnPay dashboard → pilih Form 31 dan Form 35 → filter 5 Mei–11 Mei vs 28 Apr–4 Mei.

---

## 🖱️ Landing Page Performance (Clarity)

> **[API ERROR]** — Clarity API return 403. Environment ini (GrowOS web/cloud) tidak dalam allowlist Clarity.
> Project ID: `woitwv8pge` | Website: ifikirenglish.com

| Metric | Nilai | Status |
|---|---|---|
| Total Sessions | [API ERROR] | — |
| Avg Scroll Depth | [API ERROR] | — |
| Pages per Session | [API ERROR] | — |
| Rage Clicks | [API ERROR] | — |
| Dead Clicks | [API ERROR] | — |
| Avg Active Time | [API ERROR] | — |

**Scroll depth interpretation (untuk check manual):**
- <30%: Kebanyakan visitor tak sampai offer section — headline/hook perlu diperbaiki
- 30–60%: Sederhana — visitor baca tapi tak convinced lagi
- >60%: Bagus — visitor engaged, masalah mungkin kat CTA atau harga

**Manual check:** [Clarity Dashboard](https://clarity.microsoft.com/projects/view/woitwv8pge/dashboard) → filter 5 Mei–11 Mei

---

## 🔍 Key Observations

- **Data gaps present this week** — laporan ini tidak boleh generate insights yang berguna without actual numbers. Setup steps di bawah perlu dilakukan sekali sahaja.
- **Clarity API blocked** — ini bukan error token, tapi environment restriction. Cara terbaik ialah buat local script atau check Clarity manually setiap Selasa pagi.
- **Clarity ↔ GA4 integration** masih belum confirmed (tengok `clarity-ga4-setup-status.md`) — kalau dah connect, data Clarity boleh accessed through GA4 instead.

---

## ✅ Action Items Minggu Ini

### Setup (Sekali je — supaya laporan minggu depan complete)

- [ ] **Buat `iFikir English/brand.md`** — run `/setup` dalam Claude Code untuk complete business profile
- [ ] **Buat `iFikir English/memory/onpay_api.md`** dengan format:
  ```
  # OnPay API Credentials
  API Key: [your-api-key]
  Base URL: https://api.onpay.my/v1  (confirm with OnPay docs)
  Form 31 ID: 31
  Form 35 ID: 35
  ```
- [ ] **Connect Clarity ↔ GA4** (2 minit):
  1. Pergi: https://clarity.microsoft.com/projects/view/woitwv8pge/settings#integrations
  2. Klik "Google Analytics"
  3. Enter: `G-PJ9M44L7X5`
  4. Save

### Marketing (Buat minggu ini)

- [ ] **Check OnPay manual** — tengok Form 31 dan Form 35 untuk numbers minggu lepas, note down untuk reference
- [ ] **Check Clarity scroll depth** — pergi dashboard, tengok sama ada >50% atau tak
- [ ] **Review recordings terbaru** di Clarity — focus pada visitor yang drop off awal (tengok kat mana diorang stop scroll)

---

## 📋 Setup: Cara Buat Memory Files

Untuk laporan minggu depan boleh auto-pull data, create these files:

### 1. OnPay API (`iFikir English/memory/onpay_api.md`)
Tanya OnPay support untuk API access. Format file:
```
# OnPay API Credentials
API_KEY: xxxxx
FORM_31_ID: 31
FORM_35_ID: 35
```

### 2. Clarity Token (`iFikir English/memory/clarity_api.md`)
- Pergi: https://clarity.microsoft.com/projects/view/woitwv8pge/settings
- Cari API/Export section untuk bearer token
- Note: Clarity API mungkin perlu IP whitelist — check documentation

---

## 🔗 Quick Links

| | Link |
|---|---|
| Clarity Dashboard | https://clarity.microsoft.com/projects/view/woitwv8pge/dashboard |
| Clarity Recordings | https://clarity.microsoft.com/projects/view/woitwv8pge/recordings |
| FB Events Manager | https://business.facebook.com/events_manager |
| GA4 Property | https://analytics.google.com (Property: ifikirenglish.com - GA4, ID: G-PJ9M44L7X5) |
| OnPay Dashboard | https://onpay.my (login manual) |

---

*Laporan ini dijana secara automatik oleh GrowOS. Data perlu diisi manual minggu ini — setup credentials sekali untuk automate minggu depan.*
