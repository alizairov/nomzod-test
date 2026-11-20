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

## Vakansiyalar va ariza
Fayllar:
- `vakansiyalar/index.html` — ochiq vakansiyalar ro'yxati (ulashish uchun havola: `/vakansiyalar/`)
- Rezyume fayli (PDF/Word/rasm, 5 MB gacha) Google Drive'dagi `Nomzod — Rezyumelar` papkasiga saqlanadi, havolasi jadvalda. Birinchi deploy'da Drive ruxsatini tasdiqlang.
- `vakansiyalar/hr/index.html` — "HR mutaxassis" vakansiyasi va 3 qadamli anketa (Tanishuv / Xarakter testi / Bitta savol, taxminan 5–7 daqiqa; Turon Montessori anketasi formatida)
- `assets/apply.js` — umumiy ariza mexanizmi (savollarni `window.VACANCY_TEST` dan va vakansiya turini formadagi `data-vacancy` dan oladi)
- `assets/tests/hr.js` — HR vakansiyasi savollari (faqat matn, baholash kaliti YO'Q)
- `assets/vacancy.css` — vakansiya sahifalari va forma uslubi
- `apps-script/Vakansiya.gs` — arizalarni jadvalga yozadi va ball hisoblaydi (Turon `testBaho` mantiqi; kalit repoda yo'q)

Ulash:
1. Yangi Google Sheet oching: Extensions > Apps Script.
2. Ikkita fayl yarating: `Vakansiya.gs` (repodagi `apps-script/Vakansiya.gs` mazmuni) va `Kalit.gs` (KALIT v3; Ali shaxsan beradi, **repoga qo'yilmaydi**). `Kalit.gs` bo'lmasa, javoblar xom holda saqlanadi, ball ustunlari bo'sh qoladi.
3. `setup` funksiyasini bir marta ishga tushiring (varaqlar, rang shkalasi va "Holat" ro'yxati yaratiladi; ruxsat so'raladi).
4. (Ixtiyoriy) Project Settings > Script Properties: `TELEGRAM_TOKEN`, `CHAT_ID`.
5. Deploy > New deployment > Web app. Execute as: Me; Who has access: **Anyone**.
6. Olingan URL ni `assets/config.js` dagi `vacancyEndpoint` ga yozing. Kod yoki kalit o'zgarsa, qayta deploy qiling (New version).

`vacancyEndpoint` bo'sh bo'lsa, ariza yuborilmaydi: nomzodga "tizim sozlanmoqda" xabari ko'rsatiladi, javoblari esa brauzerda saqlanib qoladi. Sinash uchun sahifaga `?demo=1` qo'shing: tarmoqqa hech narsa yuborilmaydi, ma'lumotlar konsolga chiqadi va muvaffaqiyat ekrani ko'rsatiladi.

Yangi vakansiya qo'shish:
1. `vakansiyalar/hr/` papkasini nusxalang (masalan, `vakansiyalar/sotuv/`), sarlavha, tavsif va `data-vacancy="sotuv"` ni o'zgartiring.
2. `assets/tests/sotuv.js` yarating (`hr.js` tuzilmasi: `id`, `title`, `test` (`note`, `scale`, `lo`, `hi`, `items`), `question`) va sahifada `hr.js` o'rniga shuni ulang.
3. Ro'yxat sahifasiga (`vakansiyalar/index.html`) yangi `.card` qo'shing.
4. Baholash uchun alohida kalit va Apps Script kerak bo'ladi (`Vakansiya.gs` hozir HR anketasi tuzilmasiga moslangan).

