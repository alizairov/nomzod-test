/* Kabinet — HR saralash suhbati (telefon/onlayn) uchun savollar.
   Bazaviy saralash: umumiy savollar + vakansiyaga mos qisqa blok + baholash mezonlari.
   Matn eski lotin alifbosida; kabinet.js o'zining konvertori bilan yangi alifboga o'giradi. */
window.NOMZOD_SCREENING = {
  version: 1,

  /* Hamma vakansiyalar uchun umumiy bloklar */
  common: [
    {
      id: "tanishuv",
      title: "Tanishuv va motivatsiya",
      questions: [
        { id: "q1", text: "Özingiz haqingizda qisqacha gapirib bering: hozir nima bilan bandsiz?" },
        { id: "q2", text: "Oxirgi ish joyingizdan nega ketdingiz yoki ketmoqchisiz?" },
        { id: "q3", text: "Nima uchun aynan shu yo'nalishda ishlamoqchisiz?", hint: "Anketadagi javobi bilan solishting" },
        { id: "q4", text: "Ishdagi eng katta yutug'ingiz nima? Aniq misol keltiring." },
        { id: "q5", text: "Yo'l qo'ygan xatoingiz yoki qiyin vaziyat haqida aytib bering. Undan nima o'rgandingiz?" }
      ]
    },
    {
      id: "shartlar",
      title: "Shartlar",
      questions: [
        { id: "s1", text: "Qancha maoshni kutyapsiz (qo'l ostiga)?", short: true },
        { id: "s2", text: "Qachondan ish boshlay olasiz?", short: true },
        { id: "s3", text: "Ish grafigi yoki manzil bo'yicha cheklovlaringiz bormi?", short: true },
        { id: "s4", text: "Hozir boshqa takliflar yoki suhbatlar jarayonidamisiz?", short: true }
      ]
    }
  ],

  /* Vakansiyaga mos blok */
  byVacancy: {
    hr: {
      id: "kasb",
      title: "HR bo'yicha",
      questions: [
        { id: "h1", text: "Oxirgi ish joyingizda qaysi HR jarayonlarini o'zingiz yuritgansiz?" },
        { id: "h2", text: "Rahbariyat bilan fikringiz mos kelmagan kadrlar qaroriga misol keltiring. Qanday yo'l tutdingiz?", hint: "Anketadagi 'Bitta savol' javobini chuqurlashtiring" },
        { id: "h3", text: "Xodim bilan xayrlashish suhbatini qanday o'tkazasiz? Qadamlarini ayting." },
        { id: "h4", text: "HR ishi samarali ekanini qanday ko'rsatkichlar bilan o'lchaysiz?" },
        { id: "h5", text: "Maxfiy ma'lumot bilan bog'liq vaziyat bo'lganmi? Nima qildingiz?" }
      ]
    },
    sotuv: {
      id: "kasb",
      title: "Sotuv bo'yicha",
      questions: [
        { id: "v1", text: "Oxirgi joyingizda nimani sotgansiz? Oylik reja va natijangiz qanday edi?" },
        { id: "v2", text: "Mijoz bilan suhbatni boshidan oxirigacha qanday olib borasiz?" },
        { id: "v3", text: "Mini-sinov: \"Menga shu narsani soting\" (yoki mijoz kompaniya xizmatini).", hint: "Ehtiyojni so'rayaptimi, tinglayaptimi, yakunlayaptimi — shunga qarang" },
        { id: "v4", text: "Mijoz \"qimmat ekan\" desa, nima deysiz?" },
        { id: "v5", text: "Kuniga nechta qo'ng'iroq yoki mijoz bilan ishlagansiz? Qaysi CRM'da?", short: true }
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
