/* Ariza formasi hozircha o'chirilgan (index.html da form-card hidden). Qayta yoqishda bu yerga Apps Script web app URL yoziladi. Kod: apps-script/Code.gs */
/* formEndpoint — bosh sahifadagi forma (Code.gs); vacancyEndpoint — vakansiya arizalari (Vakansiya.gs). Bo'sh bo'lsa, ariza yuborilmaydi va nomzodga xabar ko'rsatiladi. */
/* apiBase — Cloudflare Worker manzili (kabinet-api/), masalan "https://nomzod-kabinet.<nom>.workers.dev" (oxirida "/" siz). To'ldirilsa, vakansiya arizalari Worker'ga (D1 + kabinet) yuboriladi; bo'sh bo'lsa vacancyEndpoint (Apps Script) ishlatiladi. Kabinet sahifasi (/kabinet/) ham shu manzildan foydalanadi. */
window.NOMZOD_CONFIG = { formEndpoint: "", vacancyEndpoint: "", apiBase: "" };
