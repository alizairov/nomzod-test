# Nomzod kabinet — backend (Cloudflare Worker)

Saytdagi vakansiya anketalarini qabul qiladi (D1 bazaga yozadi, rezyumeni KV'ga saqlaydi, ballni hisoblaydi) va
`site/kabinet/` sahifasidagi maxfiy rekruter kabineti (kanban) uchun API beradi.

- `src/index.js` — Worker (bog'liqliksiz, oddiy JavaScript)
- `schema.sql` — D1 jadvallari (`IF NOT EXISTS`, qayta ishga tushirsa ham xavfsiz)
- `wrangler.toml` — D1 (`DB`) va KV (`CV`) ulanishlari

> Baholash kaliti (KALIT v4) repoda YO'Q. U D1'dagi `settings` jadvalida, `key = 'kalit'` qatorida turadi.
> Sessiya sirri (`session_secret`) birinchi kirishda Worker o'zi yaratib, shu jadvalga yozadi.

## Egasi uchun: ishga tushirish

D1 baza (`nomzod-kabinet`), KV va `settings.kalit` qatori allaqachon tayyor. Qolgani:

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Import a repository** → GitHub'dan `alizairov/nomzod` reposini tanlang.
2. **Root directory** (loyiha papkasi): `kabinet-api`. Deploy buyrug'i standart (`npx wrangler deploy`) qoladi → **Save and Deploy**.
3. Deploy tugagach Worker sahifasida **Settings → Variables and Secrets** bo'limiga o'ting va qo'shing:
   - **`ADMIN_PASSWORD`** (Secret) — kabinetga kirish paroli. Uzun va noyob parol qo'ying. Qo'yilmaguncha kirish 503 xatosini beradi.
   - ixtiyoriy **`TELEGRAM_TOKEN`** va **`TELEGRAM_CHAT_ID`** (Secret) — yangi ariza kelganda Telegram'ga xabar yuboradi.
   - ixtiyoriy **`KABINET_URL`** (oddiy Variable) — kabinet sahifasi manzili (masalan `https://nmzd.uz/kabinet/`); Telegram xabariga havola qo'shiladi.
   - Secret qo'shgandan keyin yana **Deploy** bosing.
4. Worker manzilini (`https://nomzod-kabinet.<nom>.workers.dev`) nusxalab, `site/assets/config.js` ichidagi `apiBase` ga yozing:
   `window.NOMZOD_CONFIG = { ..., apiBase: "https://nomzod-kabinet.<nom>.workers.dev" }` (oxirida `/` bo'lmasin) va saytni deploy qiling.
   Shundan keyin anketalar Worker'ga tushadi, kabinet `/kabinet/` manzilida ochiladi (saytda hech qayerdan havola yo'q, `noindex`).

Tekshirish: brauzerda Worker manzilini oching — `{"ok":true,"service":"Nomzod kabinet"}` chiqishi kerak.

## Sxemani qo'lda qo'llash (kerak bo'lsa)

```
npx wrangler d1 execute nomzod-kabinet --remote --file=schema.sql
```

## Mahalliy sinash

```
cd kabinet-api
npm install
echo 'ADMIN_PASSWORD=test123' > .dev.vars           # gitignore'da
npx wrangler d1 execute nomzod-kabinet --local --file=schema.sql
# kalitni (repodan tashqaridagi fayldan) mahalliy bazaga yozish:
npx wrangler d1 execute nomzod-kabinet --local --command "INSERT OR REPLACE INTO settings(key,value) VALUES('kalit','<KALIT JSON>')"
npx wrangler dev --local --port 8799
```

Keyin `site/assets/config.js` da `apiBase: "http://localhost:8799"` qo'ying (commit qilmang!) va saytni `python3 -m http.server` bilan oching.

## API (qisqacha)

| Metod | Yo'l | Izoh |
|---|---|---|
| GET | `/` | holat tekshiruvi |
| POST | `/api/apply` | ommaviy; `multipart/form-data` (+ ixtiyoriy `cv` fayli, ≤ 5 MB); IP bo'yicha 10 daqiqada 5 ta |
| POST | `/api/login` | `{password}` → `{token}` (15 daqiqada 5 ta xato urinish limiti) |
| GET | `/api/leads?vacancy=&q=&archived=0` | ro'yxat |
| POST | `/api/leads` | qo'lda qo'shish |
| GET / PATCH / DELETE | `/api/leads/:id` | to'liq ma'lumot / o'zgartirish / o'chirish |
| POST | `/api/leads/:id/notes` | eslatma |
| GET | `/api/leads/:id/cv` | rezyume fayli |
| GET | `/api/stats` | statistika |
| GET | `/api/export.csv` | CSV (UTF-8 BOM) |

`/api/login` va `/api/apply` dan boshqa hamma yo'l `Authorization: Bearer <token>` talab qiladi.
