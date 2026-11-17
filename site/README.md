# Nomzod — nmzd.uz

Bir sahifali statik sayt (HTML/CSS/JS, build kerak emas).

## Fayllar
- `index.html` — sahifa
- `assets/style.css`, `assets/main.js` — dizayn va skript
- `assets/config.js` — forma sozlamasi (`formEndpoint`)
- `assets/fonts/` — shriftlar; `assets/logo*.svg`, `favicon.*`, `og.png` — brend
- `apps-script/Code.gs` — arizalarni Google Sheet'ga yozuvchi skript

## Formani ulash
1. Yangi Google Sheet oching: Extensions > Apps Script.
2. `apps-script/Code.gs` mazmunini qo'ying va saqlang.
3. (Ixtiyoriy, Telegram uchun) Project Settings > Script Properties: `TELEGRAM_TOKEN` va `CHAT_ID`.
4. Deploy > New deployment > Web app. Execute as: Me; Who has access: **Anyone**.
5. Olingan URL ni `assets/config.js` dagi `formEndpoint` ga yozing.
6. Kod o'zgarsa, qayta deploy qiling (New version).

`formEndpoint` bo'sh bo'lsa, forma demo rejimida ishlaydi (hech narsa yuborilmaydi).

## nmzd.uz ni ulash (GitHub Pages)
1. Repozitoriy Settings > Pages da branch'ni tanlang.
2. Domen provayderida: `nmzd.uz` uchun A yozuvlar (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) yoki `www` uchun CNAME `<username>.github.io`.
3. Pages sozlamasida Custom domain: `nmzd.uz` ni kiriting (CNAME fayli shunda avtomatik yaratiladi). Hozircha CNAME fayli qo'shilmagan.
4. Aloqa: Telegram — https://t.me/ali_zairov, Instagram — https://www.instagram.com/nomzod.agency (index.html footer qismida).
