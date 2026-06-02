# Laporan Mingguan iFikir English
Minggu berakhir: 1 Jun 2026 (Isnin)
Dijana: 2 Jun 2026, Selasa pagi

---

## ⚠️ Status Data Pull

| Sumber | Status | Nota |
|---|---|---|
| Facebook Ads (Windsor.ai) | ✅ Berjaya | Account: Fox iFikir — data penuh tersedia |
| OnPay (Form 31 – FB/MTC) | ❌ DATA NEEDED | `iFikir English/memory/onpay_api.md` masih tidak wujud |
| OnPay (Form 35 – TikTok) | ❌ DATA NEEDED | `iFikir English/memory/onpay_api.md` masih tidak wujud |
| TikTok Ads (Windsor.ai) | ❌ Belum Connect | TikTok Ads belum disambung ke Windsor.ai |
| Microsoft Clarity | ❌ API ERROR (403) | **Minggu ke-4 berturut-turut** — cloud IP blocked. Check manual. |

---

## 📦 Sales Summary — OnPay

> **[DATA NEEDED]** — OnPay credentials masih belum di-setup. Dah 4 minggu berturut-turut. Ambil 5 minit sekarang:
> 1. Log masuk [onpay.my](https://onpay.my)
> 2. Form 31 → filter 26 Mei – 1 Jun → catat orders + revenue
> 3. Form 35 → filter 26 Mei – 1 Jun → catat orders + revenue
> 4. Bandingkan dengan 19–25 Mei

| | Minggu Ini (26 Mei – 1 Jun) | Minggu Lepas (19–25 Mei) | Perubahan |
|---|---|---|---|
| Orders (FB/MTC – Form 31) | [DATA NEEDED] | [DATA NEEDED] | — |
| Revenue FB/MTC (RM) | [DATA NEEDED] | [DATA NEEDED] | — |
| Orders (TikTok – Form 35) | [DATA NEEDED] | [DATA NEEDED] | — |
| Revenue TikTok (RM) | [DATA NEEDED] | [DATA NEEDED] | — |
| **TOTAL Orders** | **[DATA NEEDED]** | **[DATA NEEDED]** | **—** |

---

## 📣 Facebook Ads Performance (Windsor.ai — Fox iFikir)

*Data auto-pulled. Perbandingan: 26 Mei–1 Jun vs 19–25 Mei.*

| Metric | Minggu Ini (26 Mei–1 Jun) | Minggu Lepas (19–25 Mei) | Perubahan |
|---|---|---|---|
| Spend | RM 1,535.63 | RM 2,690.66 | ⬇️ **-42.9%** |
| Reach | 116,988 | 176,399 | ⬇️ -33.7% |
| Impressions | 136,751 | 221,328 | ⬇️ -38.2% |
| Clicks | 1,628 | 2,643 | ⬇️ -38.4% |
| CTR | 1.19% | 1.19% | ➡️ Flat |
| CPC | RM 0.94 | RM 1.02 | ✅ -7.3% |
| CPM | RM 11.23 | RM 12.16 | ✅ -7.6% |
| Leads (via Pixel) | [PIXEL NOT CONNECTED] | [PIXEL NOT CONNECTED] | — |

### 🚨 Trend 3 Minggu — PERLU PERHATIAN

| Minggu | Spend | Perubahan |
|---|---|---|
| 12–18 Mei | RM 3,777.31 | (baseline) |
| 19–25 Mei | RM 2,690.66 | ⬇️ -28.8% |
| 26 Mei–1 Jun | RM 1,535.63 | ⬇️ -42.9% |
| **Jumlah turun (3 minggu)** | | **⬇️ -59.3%** |

> ⚠️ **Ini bukan turun sikit-sikit — spend dah turun 60% dalam masa 3 minggu.** Mesti check Ads Manager sekarang untuk tahu sama ada ini intentional (budget cut) atau ada masalah dengan campaign.

### 📅 Breakdown Harian Minggu Ini

| Tarikh | Hari | Spend | Clicks | CTR | CPC |
|---|---|---|---|---|---|
| 26 Mei | Selasa | RM 296.14 | 340 | 1.18% | RM 0.87 |
| 27 Mei | Rabu | RM 204.64 | 198 | 1.12% | RM 1.03 |
| 28 Mei | Khamis | RM 200.75 | 222 | 1.08% | RM 0.90 |
| 29 Mei | Jumaat | RM 221.62 | 230 | 1.09% | RM 0.96 |
| 30 Mei | Sabtu | **RM 155.75** | 158 | 1.33% | RM 0.99 |
| 31 Mei | Ahad | RM 223.14 | 235 | 1.32% | RM 0.95 |
| 1 Jun | Isnin | RM 233.59 | 245 | 1.31% | RM 0.95 |

> **Note Sabtu 30 Mei:** Spend turun ke RM 155.75 — paling rendah minggu ini, tapi CTR paling tinggi (1.33%). Mungkin budget ad set habis awal hari. Semak Ads Manager untuk confirm.
>
> **Weekend pattern:** CTR hujung minggu (Sabtu–Ahad) consistently lebih tinggi (1.31–1.33%) vs weekday (1.08–1.18%). Kalau nak optimize, pertimbangkan dayparting atau higher budget allocation on weekends.

---

## 🖱️ Landing Page Performance (Clarity)

> **[API ERROR — 403 Forbidden]** — Minggu ke-4 berturut-turut. Cloud IP tidak di-allowlist oleh Clarity. Auto-pull tidak boleh berlaku dari remote environment.

| Metric | Nilai | Status |
|---|---|---|
| Total Sessions | [API ERROR] | Tengok manual |
| Avg Scroll Depth | [API ERROR] | Tengok manual |
| Pages per Session | [API ERROR] | Tengok manual |
| Rage Clicks | [API ERROR] | Tengok manual |
| Dead Clicks | [API ERROR] | Tengok manual |
| Avg Active Time | [API ERROR] | Tengok manual |

**Scroll depth interpretation (untuk check manual):**
- <30%: Kebanyakan visitor tak sampai offer section — headline/hook perlu diperbaiki
- 30–60%: Sederhana — visitor baca tapi tak convinced lagi
- >60%: Bagus — visitor engaged, masalah mungkin kat CTA atau harga

**Permanent fix (5 minit):** Connect Clarity ke GA4 → Clarity Settings → Integrations → Google Analytics (`G-PJ9M44L7X5`). Lepas tu, scroll depth boleh pull via GA4 terus tanpa IP issue. Dah disebut 4 minggu berturut-turut — masa untuk buat sekarang.

**Manual check (2 minit):** [Clarity Dashboard](https://clarity.microsoft.com/projects/view/woitwv8pge/dashboard) → filter 26 Mei–1 Jun → tengok scroll depth & rage clicks.

---

## 🔍 Key Observations

1. **Spend turun 59% dalam 3 minggu — ini mesti diinvestigate sekarang.** RM 3,777 (12 Mei) → RM 2,690 (19 Mei) → RM 1,536 (26 Mei). Ini bukan seasonal dip biasa. Sama ada budget kena cut secara manual, campaign habis masa, ad set kena reject, atau ada billing issue. Check Ads Manager → Billing + Campaign status sebelum buat apa-apa lagi.

2. **Efisiensi improve walaupun spend drop.** CPC turun dari RM 1.02 ke RM 0.94 (-7.3%), CPM turun dari RM 12.16 ke RM 11.23 (-7.6%). CTR stable at 1.19%. Ini signal yang iklan masih relevant — algo Facebook cuma dapat less budget untuk dibelanjakan. Kalau spend masalah diselesaikan dan budget dinaikkan, efficiency metrics yang ada sekarang adalah good baseline.

3. **Weekend vs weekday CTR gap is real.** Weekend (Sabtu-Ahad) CTR 1.31–1.33%, weekday (Rabu-Khamis) 1.08–1.12%. Gap hampir 20%. Kalau target audience iFikir English ramai working adults, ini masuk akal — mereka browse lebih aktif on weekends. Worth testing weekend-boosted budget.

4. **Sabtu 30 Mei anomaly perlu dijelaskan.** Spend RM 155.75 (vs average RM 220+ hari lain) tapi CTR was the highest at 1.33%. Impressions pun rendah (11,887 vs 17,000-28,000 hari lain). Ini bukan creative fatigue — kemungkinan daily budget cap hit early, atau ad set specific paused on that day.

5. **Zero data gaps masih ada.** Lead tracking null semua hari (Pixel tidak connect). Tanpa conversion data, kita hanya tahu orang klik — tapi tak tahu berapa yang register. ROI calculation masih impossible.

---

## ✅ Action Items Minggu Ini

### 🔴 URGENT (Buat sebelum tengahari)

- [ ] **INVESTIGATE spend drop** — buka [Ads Manager](https://business.facebook.com/adsmanager) → tengok campaign status, billing, dan ad set yang active/paused. Spend turun 59% dalam 3 minggu adalah red flag. Kalau intentional, ok. Kalau tidak, ada sesuatu yang patah.

- [ ] **Isi sales data manual** — buka [OnPay](https://onpay.my) → Form 31 dan Form 35 → filter 26 Mei–1 Jun → compare dengan minggu lepas. 5 minit sahaja. Data ni critical untuk tahu impact real sales.

### 🟡 Medium Priority (Minggu ini)

- [ ] **Investigate Sabtu 30 Mei** — dalam Ads Manager, check sama ada ada campaign yang hit budget cap or paused on 30 May. Kalau budget cap issue, pertimbangkan daily vs lifetime budget setting.

- [ ] **Connect Clarity ke GA4** — buat sekali, selesai masalah 4 minggu. Clarity Dashboard → Settings → Integrations → Google Analytics → masukkan `G-PJ9M44L7X5`. Lepas connect, landing page scroll data auto-masuk GA4.

- [ ] **Setup `iFikir English/memory/onpay_api.md`** — sekali setup, auto-pull setiap minggu:
  ```
  # OnPay API Credentials
  API_KEY: [your-api-key-from-onpay]
  BASE_URL: https://api.onpay.my/v1
  FORM_31_ID: 31
  FORM_35_ID: 35
  ```

### 🟢 Nice to Have

- [ ] **Connect Facebook Pixel lead events** — tanpa conversion tracking, kita buta dari segi cost-per-lead. Setup pixel event (lead) dan sambung ke Windsor.ai.

- [ ] **Connect TikTok Ads ke Windsor.ai** — Windsor.ai dashboard → Connect → TikTok Ads → authorize. TikTok data masuk laporan depan.

- [ ] **Test weekend budget increase** — based on CTR data, hujung minggu perform lebih baik. Pertimbangkan allocate 20-30% lebih budget on Sabtu-Ahad untuk test.

---

## 🔗 Quick Links

| | Link |
|---|---|
| Clarity Dashboard | https://clarity.microsoft.com/projects/view/woitwv8pge/dashboard |
| Clarity Recordings | https://clarity.microsoft.com/projects/view/woitwv8pge/recordings |
| Clarity GA4 Integration | https://clarity.microsoft.com/projects/view/woitwv8pge/settings#integrations |
| FB Ads Manager | https://business.facebook.com/adsmanager |
| FB Events Manager | https://business.facebook.com/events_manager |
| OnPay Dashboard | https://onpay.my |
| GA4 Property | https://analytics.google.com (ID: G-PJ9M44L7X5) |

---

*Laporan dijana secara automatik oleh GrowOS — 2 Jun 2026, Selasa pagi.*
*Facebook Ads data via Windsor.ai (Fox iFikir). OnPay + Clarity masih perlu manual check.*
