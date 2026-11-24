/* Kabinet — HR saralash suhbati (telefon/onlayn) uchun savollar.
   Har savol — belgilanadigan variantlar (type: "single" — bittasi, "multi" — bir nechtasi) + ixtiyoriy izoh.
   tone: "good" — ijobiy, "warn" — e'tibor bering, "bad" — salbiy belgi (rang bilan ko'rsatiladi).
   Matn eski lotin alifbosida; kabinet.js o'zining konvertori bilan yangi alifboga o'giradi. */
window.NOMZOD_SCREENING = {
  version: 2,

  /* Hamma vakansiyalar uchun umumiy bloklar */
  common: [
    {
      id: "tanishuv",
      title: "Tanishuv va motivatsiya",
      questions: [
        { id: "q1", type: "single", text: "Hozir nima bilan band?",
          options: [
            { id: "ishlayapti", text: "Ishlayapti" },
            { id: "izlayapti", text: "Ishlamayapti, ish izlayapti" },
            { id: "oqiyapti", text: "O'qiyapti" },
            { id: "boshqa", text: "Boshqa" }
          ] },
        { id: "q2", type: "multi", text: "Oldingi ishdan ketish sababi",
          options: [
            { id: "maosh", text: "Maosh" },
            { id: "osish", text: "O'sish imkoni yo'q" },
            { id: "sharoit", text: "Grafik, masofa, sharoit" },
            { id: "qisqartirish", text: "Kompaniya yopildi / qisqartirish" },
            { id: "kelishmovchilik", text: "Rahbar yoki jamoa bilan kelishmovchilik", tone: "warn" },
            { id: "boshatilgan", text: "Ishdan bo'shatilgan", tone: "warn" },
            { id: "noaniq", text: "Javob noaniq", tone: "warn" }
          ] },
        { id: "q3", type: "single", text: "Nega aynan shu yo'nalish? (motivatsiya)", hint: "Anketadagi javobi bilan solishtiring",
          options: [
            { id: "aniq", text: "Aniq va o'ylangan", tone: "good" },
            { id: "umumiy", text: "Umumiy, yuzaki" },
            { id: "pul", text: "Faqat maosh uchun", tone: "warn" },
            { id: "yoq", text: "Javob bera olmadi", tone: "bad" }
          ] },
        { id: "q4", type: "single", text: "Ishdagi eng katta yutug'i",
          options: [
            { id: "raqam", text: "Aniq natija / raqam bilan", tone: "good" },
            { id: "umumiy", text: "Misol bor, lekin umumiy" },
            { id: "yoq", text: "Misol keltira olmadi", tone: "bad" }
          ] },
        { id: "q5", type: "single", text: "Xatosi va undan olgan saboq",
          options: [
            { id: "tanoldi", text: "Xatoni tan oldi, saboqni aytdi", tone: "good" },
            { id: "noaniq", text: "Tan oldi, lekin saboq noaniq" },
            { id: "ayblash", text: "Aybni boshqalarga to'nkadi", tone: "bad" },
            { id: "eslamadi", text: "Xato eslay olmadi", tone: "warn" }
          ] }
      ]
    },
    {
      id: "shartlar",
      title: "Shartlar",
      questions: [
        { id: "s1", type: "single", text: "Kutilayotgan maosh", notePlaceholder: "Summa, masalan: 8 mln",
          options: [
            { id: "mos", text: "Budjetga mos", tone: "good" },
            { id: "yuqoriroq", text: "Biroz yuqori", tone: "warn" },
            { id: "juda", text: "Juda yuqori", tone: "bad" },
            { id: "aytmadi", text: "Aytmadi" }
          ] },
        { id: "s2", type: "single", text: "Qachondan boshlay oladi?",
          options: [
            { id: "darhol", text: "Darhol", tone: "good" },
            { id: "2hafta", text: "1–2 hafta ichida" },
            { id: "1oy", text: "1 oy ichida" },
            { id: "kech", text: "1 oydan keyin", tone: "warn" }
          ] },
        { id: "s3", type: "multi", text: "Grafik va manzil bo'yicha cheklovlar",
          options: [
            { id: "yoq", text: "Cheklov yo'q", tone: "good" },
            { id: "grafik", text: "Grafik bo'yicha", tone: "warn" },
            { id: "manzil", text: "Manzil uzoq", tone: "warn" },
            { id: "boshqaish", text: "Boshqa ish bilan birga", tone: "warn" },
            { id: "oqish", text: "O'qish bilan birga" }
          ] },
        { id: "s4", type: "single", text: "Boshqa takliflar yoki suhbatlar",
          options: [
            { id: "yoq", text: "Yo'q" },
            { id: "jarayonda", text: "Bor, jarayonda" },
            { id: "offer", text: "Taklif olgan — tez qaror kerak", tone: "warn" }
          ] }
      ]
    }
  ],

  /* Vakansiyaga mos blok */
  byVacancy: {
    hr: {
      id: "kasb",
      title: "HR bo'yicha",
      questions: [
        { id: "h1", type: "multi", text: "O'zi yuritgan HR jarayonlari",
          options: [
            { id: "rekruting", text: "Rekruting" },
            { id: "adaptatsiya", text: "Adaptatsiya" },
            { id: "baholash", text: "Baholash / KPI" },
            { id: "motivatsiya", text: "Motivatsiya va kompensatsiya" },
            { id: "hujjatlar", text: "Kadrlar hujjatlari" },
            { id: "madaniyat", text: "Korporativ madaniyat" },
            { id: "oqitish", text: "O'qitish" },
            { id: "strategiya", text: "HR strategiya" },
            { id: "noldan", text: "Tizimni noldan qurgan", tone: "good" }
          ] },
        { id: "h2", type: "single", text: "Rahbariyat bilan fikri mos kelmagan kadrlar qarori", hint: "Anketadagi 'Bitta savol' javobini chuqurlashtiring",
          options: [
            { id: "dalil", text: "Dalil bilan pozitsiyasini aytdi, qarorni hurmat qildi", tone: "good" },
            { id: "rozi", text: "Darhol rozi bo'ldi, fikr aytmadi", tone: "warn" },
            { id: "konflikt", text: "Qattiq qarshilik, konflikt", tone: "warn" },
            { id: "yoq", text: "Misol keltira olmadi" }
          ] },
        { id: "h3", type: "single", text: "Xayrlashish suhbatini qanday o'tkazadi?",
          options: [
            { id: "tizimli", text: "Tizimli: tayyorgarlik, sabab, hurmat, hujjatlar", tone: "good" },
            { id: "asosiy", text: "Asosiy qadamlarni biladi" },
            { id: "yuzaki", text: "Tasavvuri yuzaki", tone: "bad" }
          ] },
        { id: "h4", type: "multi", text: "HR samaradorligini qanday o'lchaydi?",
          options: [
            { id: "turnover", text: "Xodimlar almashinuvi" },
            { id: "muddat", text: "Vakansiya yopilish muddati" },
            { id: "sinov", text: "Sinov muddatidan o'tganlar" },
            { id: "qoniqish", text: "Xodimlar qoniqishi (eNPS)" },
            { id: "xarajat", text: "HR xarajatlari" },
            { id: "yoq", text: "Ko'rsatkich ayta olmadi", tone: "bad" }
          ] },
        { id: "h5", type: "single", text: "Maxfiy ma'lumot bilan bog'liq vaziyat",
          options: [
            { id: "togri", text: "Maxfiylikni saqladi, to'g'ri yo'l tutdi", tone: "good" },
            { id: "noaniq", text: "Javob noaniq" },
            { id: "xavf", text: "Maxfiylikka beparvo munosabat", tone: "bad" },
            { id: "yoq", text: "Bunday holat bo'lmagan" }
          ] }
      ]
    },
    sotuv: {
      id: "kasb",
      title: "Sotuv bo'yicha",
      questions: [
        { id: "v1", type: "multi", text: "Nimani sotgan?",
          options: [
            { id: "xizmat", text: "Xizmat" },
            { id: "tovar", text: "Mahsulot (tovar)" },
            { id: "talim", text: "Ta'lim / kurslar" },
            { id: "kochmas", text: "Ko'chmas mulk" },
            { id: "b2b", text: "B2B (kompaniyalarga)" },
            { id: "b2c", text: "B2C (odamlarga)" },
            { id: "yoq", text: "Sotuvda tajribasi yo'q" }
          ] },
        { id: "v6", type: "single", text: "Sotuv rejasi bajarilishi",
          options: [
            { id: "oshirgan", text: "Rejadan oshirgan", tone: "good" },
            { id: "bajargan", text: "Rejani bajargan" },
            { id: "bazan", text: "Ba'zan bajarmagan", tone: "warn" },
            { id: "yoq", text: "Reja bilan ishlamagan" }
          ] },
        { id: "v2", type: "single", text: "Mijoz bilan suhbatni qanday olib boradi?",
          options: [
            { id: "tizimli", text: "Tizimli: ehtiyoj → taklif → e'tiroz → yakun", tone: "good" },
            { id: "qisman", text: "Qisman tizimli" },
            { id: "faqat", text: "Faqat mahsulot haqida gapiradi", tone: "bad" }
          ] },
        { id: "v3", type: "multi", text: "Mini-sinov: \"Menga shu narsani soting\" — nimalarni qildi?", hint: "Belgilanganlar qancha ko'p bo'lsa, shuncha yaxshi",
          options: [
            { id: "savol", text: "Savol berib ehtiyojni aniqladi", tone: "good" },
            { id: "tingladi", text: "Tingladi, gapni bo'lmadi", tone: "good" },
            { id: "foyda", text: "Foydani mijozga bog'ladi", tone: "good" },
            { id: "etiroz", text: "E'tirozga javob berdi", tone: "good" },
            { id: "yakun", text: "Sotuvni yakunlashga harakat qildi", tone: "good" },
            { id: "nutq", text: "Ishonchli ovoz va nutq", tone: "good" }
          ] },
        { id: "v4", type: "single", text: "\"Qimmat ekan\" e'tiroziga javobi",
          options: [
            { id: "qiymat", text: "Qiymatni ko'rsatdi, savol bilan aniqladi", tone: "good" },
            { id: "chegirma", text: "Darrov chegirma taklif qildi", tone: "warn" },
            { id: "yoq", text: "Javob topa olmadi", tone: "bad" }
          ] },
        { id: "v5", type: "single", text: "Kunlik ish hajmi", notePlaceholder: "CRM: amoCRM, Bitrix24…",
          options: [
            { id: "100", text: "100+ qo'ng'iroq / mijoz" },
            { id: "50", text: "50–100" },
            { id: "kam", text: "50 dan kam" },
            { id: "yoq", text: "Tajribasi yo'q" }
          ] }
      ]
    }
  },

  /* Baholash mezonlari (1–5). "for" bo'lsa — faqat shu vakansiyada. */
  criteria: [
    { id: "nutq", text: "Muloqot va nutq" },
    { id: "motiv", text: "Motivatsiya va qiziqish" },
    { id: "tajriba", text: "Tajriba mosligi" },
    { id: "madaniyat", text: "Jamoaga va madaniyatga moslik" },
    { id: "kasbiy", for: "hr", text: "Kasbiy bilim (HR)" },
    { id: "ishontirish", for: "sotuv", text: "Ishontirish va sotuv qobiliyati" }
  ],

  /* Yakuniy qaror */
  verdicts: [
    { id: "otdi", text: "Keyingi bosqichga", tone: "good", moveTo: "suhbat" },
    { id: "zaxira", text: "Zaxiraga", tone: "warn", moveTo: "zaxira" },
    { id: "rad", text: "Rad etish", tone: "bad", moveTo: "rad" }
  ]
};
