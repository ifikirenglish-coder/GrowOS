# Laporan Mingguan iFikir English
Minggu berakhir: 25 Mei 2026 (Ahad)
Dijana: 26 Mei 2026, Selasa pagi

---

## ⚠️ Status Data Pull

| Sumber | Status | Nota |
|---|---|---|
| Facebook Ads (Windsor.ai) | ✅ Berjaya | Account: Fox iFikir — data penuh tersedia |
| OnPay (Form 31 – FB/MTC) | ❌ DATA NEEDED | `iFikir English/memory/onpay_api.md` masih tidak wujud |
| OnPay (Form 35 – TikTok) | ❌ DATA NEEDED | `iFikir English/memory/onpay_api.md` masih tidak wujud |
| TikTok Ads (Windsor.ai) | ❌ Belum Connect | TikTok Ads belum disambung ke Windsor.ai |
| Microsoft Clarity | ❌ API ERROR (403) | Minggu ke-3 berturut-turut — cloud IP blocked. Check manual. |

> **Good news:** Facebook Ads data kini auto-pull via Windsor.ai. Ini 1st time laporan ada real ad data.
> **Still missing:** Sales data (OnPay) dan landing page analytics (Clarity). Setup steps di bawah.

---

## 📦 Sales Summary — OnPay

> **[DATA NEEDED]** — OnPay credentials belum di-setup. Check manual dalam 5 minit:
> 1. Log masuk [onpay.my](https://onpay.my)
> 2. Form 31 → filter 19–25 Mei → catat orders + revenue
> 3. Form 35 → filter 19–25 Mei → catat orders + revenue
> 4. Bandingkan dengan 12–18 Mei

| | Minggu Ini (19–25 Mei) | Minggu Lepas (12–18 Mei) | Perubahan |
|---|---|---|---|
| Orders (FB/MTC – Form 31) | [DATA NEEDED] | [DATA NEEDED] | — |
| Revenue FB/MTC (RM) | [DATA NEEDED] | [DATA NEEDED] | — |
| Orders (TikTok – Form 35) | [DATA NEEDED] | [DATA NEEDED] | — |
| Revenue TikTok (RM) | [DATA NEEDED] | [DATA NEEDED] | — |
| **TOTAL Orders** | **[DATA NEEDED]** | **[DATA NEEDED]** | **—** |

---

## 📣 Facebook Ads Performance (Windsor.ai — Fox iFikir)

*Data auto-pulled. Minggu pertama dengan real data dalam laporan ini.*

| Metric | Minggu Ini (19–25 Mei) | Minggu Lepas (12–18 Mei) | Perubahan |
|---|---|---|---|
| Spend | RM 2,689.83 | RM 3,777.31 | ⬇️ -28.8% |
| Reach | 119,911 | 156,199 | ⬇️ -23.2% |
| Impressions | 221,257 | 231,879 | ⬇️ -4.6% |
| Clicks | 2,643 | 3,081 | ⬇️ -14.2% |
| CTR | 1.19% | 1.33% | ⬇️ -10.5% |
| CPC | RM 1.02 | RM 1.23 | ✅ -17.0% |
| CPM | RM 12.16 | RM 16.29 | ✅ -25.4% |
| Leads (via Pixel) | [PIXEL NOT CONNECTED] | [PIXEL NOT CONNECTED] | — |

**Interpretasi:**

Spend turun RM 1,087 (-28.8%) minggu ini. Tapi ada pattern menarik — walaupun spend turun, **efisiensi naik**:
- CPC turun RM 0.21 (17%) — setiap klik lebih murah
- CPM turun RM 4.13 (25.4%) — reach per ringgit lebih baik

Ini boleh bermaksud dua benda: (1) ada campaign atau ad set yang di-pause minggu ini, atau (2) Facebook algo optimize lebih baik dengan budget yang ada. **Check Ads Manager** untuk confirm mana satu.

> ⚠️ **CTR turun dari 1.33% → 1.19%** — creative mungkin dah fatigue, atau audience baru kurang targeted. Worth checking 2-3 top ads untuk tengok frequency dan reach overlap.

---

## 🖱️ Landing Page Performance (Clarity)

> **[API ERROR]** — Clarity API return 403 "Host not in allowlist" untuk **minggu ke-3 berturut-turut** (7 hari berturut-turut sejak 20 Mei). Ini bukan token issue — ia IP restriction dari Clarity pihak. Auto-pull tidak boleh berlaku dari cloud environment.

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

**Manual check (2 minit):** [Clarity Dashboard](https://clarity.microsoft.com/projects/view/woitwv8pge/dashboard) → filter 19–25 Mei → tengok scroll depth & rage clicks.

---

## 🔍 Key Observations

1. **Spend turun drastik tapi efisiensi naik** — Minggu ini RM 1,087 kurang dibelanjakan (-28.8%), tapi CPC dan CPM kedua-duanya improved. Persoalan penting: adakah ini sengaja (budget cut) atau ada campaign yang auto-pause/habis budget? Check Ads Manager untuk confirm.

2. **Clicks turun 438 (-14.2%) dengan spend turun 28.8%** — Ini sebenarnya signal positif. Spend turun lebih banyak dari clicks, bermakna duit yang ada digunakan lebih efisien. Tapi impak kepada jumlah leads/registrations perlu di-cross check dengan OnPay data.

3. **CTR slip dari 1.33% ke 1.19%** — Penurunan 10.5% dalam click-through rate. Boleh jadi creative fatigue (orang dah nampak iklan yang sama berkali-kali) atau audience overlap tinggi. Worth checking frequency per campaign dan consider refresh creative kalau frequency >3x.

4. **Lead tracking masih kosong** — Facebook Pixel lead events tak masuk Windsor.ai. Ini gap besar — tanpa conversion tracking yang proper, kita tak tahu berapa banyak leads datang dari setiap ringgit yang dibelanjakan. Connect pixel event tracking untuk minggu depan.

5. **TikTok Ads blind spot** — Form 35 (TikTok) masih tiada data dalam laporan. Connect TikTok Ads ke Windsor.ai untuk dapatkan combined picture ads performance.

---

## ✅ Action Items Minggu Ini

### 🔴 High Priority (Buat hari ini)

- [ ] **Check Ads Manager** — tengok campaign mana yang active/paused 19–25 Mei dan kenapa spend turun RM 1,087. Confirm sama ada ini intentional atau ada campaign yang terstopped.

- [ ] **Isi sales data manual** — buka OnPay → Form 31 dan Form 35 → filter 19–25 Mei → bandingkan dengan minggu lepas. 5 minit je. Data ini critical untuk tahu sama ada spend yang kurang tu berdampak pada registrations.

- [ ] **Check Clarity scroll depth** — buka [Clarity Dashboard](https://clarity.microsoft.com/projects/view/woitwv8pge/dashboard), filter 19–25 Mei. Kalau scroll depth <50%, ada masalah dengan hook atau headline landing page.

### 🟡 Medium Priority (Minggu ini)

- [ ] **Review creative frequency** — dalam Ads Manager, tengok frequency per ad set. Kalau frequency >3, creative dah fatigue — pertimbangkan refresh copy atau visual untuk counter CTR drop.

- [ ] **Setup `iFikir English/memory/onpay_api.md`** — satu fail, satu kali setup, auto-pull sales data setiap laporan lepas ni:
  ```
  # OnPay API Credentials
  API_KEY: [your-api-key-from-onpay]
  BASE_URL: https://api.onpay.my/v1
  FORM_31_ID: 31
  FORM_35_ID: 35
  ```

- [ ] **Connect TikTok Ads ke Windsor.ai** — pergi Windsor.ai dashboard → Connect → TikTok Ads → authorize. Lepas connect, TikTok data akan auto-pull dalam laporan depan.

### 🟢 Nice to Have

- [ ] **Connect Facebook Pixel lead events** — pastikan lead event (bukan just click) di-track dan sambung ke Windsor.ai supaya boleh tengok cost-per-lead setiap minggu.

- [ ] **Clarity + GA4 integration** — connect Clarity ke GA4 (`G-PJ9M44L7X5`) supaya scroll depth data accessible via GA4 tanpa IP restriction. Setup: Clarity Settings → Integrations → Google Analytics.

---

## 🔗 Quick Links

| | Link |
|---|---|
| Clarity Dashboard | https://clarity.microsoft.com/projects/view/woitwv8pge/dashboard |
| Clarity Recordings | https://clarity.microsoft.com/projects/view/woitwv8pge/recordings |
| Clarity GA4 Integration | https://clarity.microsoft.com/projects/view/woitwv8pge/settings#integrations |
| FB Events Manager | https://business.facebook.com/events_manager |
| FB Ads Manager | https://business.facebook.com/adsmanager |
| OnPay Dashboard | https://onpay.my |
| GA4 Property | https://analytics.google.com (ID: G-PJ9M44L7X5) |

---

*Laporan dijana secara automatik oleh GrowOS — 26 Mei 2026, Selasa pagi.*
*Facebook Ads data via Windsor.ai (Fox iFikir). OnPay + Clarity masih perlu manual check.*
