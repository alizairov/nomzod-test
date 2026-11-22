/* Sotuv menejeri vakansiyasi — onlayn anketa (1-saralash). HR anketasi bilan bir xil format.
   Faqat matnlar. Qaysi gap teskari baholanishi va sifatlarga bo'linishi — Apps Script'dagi Kalit.gs ichida.
   Matn eski lotin alifbosida yoziladi; yangi alifboga brauzerda alphabet.js o'giradi. */
window.VACANCY_TEST = {
  id: "sotuv",
  title: "Sotuv menejeri",

  /* 1-qadam: yo'nalish tanlash (bir yoki ikkalasi). */
  types: {
    label: "Qaysi yo'nalishda ishlamoqchisiz?",
    hint: "Bittasini yoki ikkalasini ham tanlashingiz mumkin.",
    items: [
      { id: "call", title: "Qo'ng'iroq orqali sotuv", sub: "Call-markaz: kiruvchi va chiquvchi qo'ng'iroqlar" },
      { id: "reception", title: "Reception", sub: "Ofisda mijozni kutib olish, maslahat berish va sotish" }
    ]
  },

  /* 1-qadam: qisqa Ha/Yo'q savollar. "for" — faqat shu yo'nalish tanlanganda ko'rinadi. */
  yn: [
    { id: "s1", text: "Sotuv sohasida ishlaganmisiz?" },
    { id: "s2", text: "Oylik sotuv rejasi (plan) bilan ishlaganmisiz?" },
    { id: "s3", text: "CRM tizimida (amoCRM, Bitrix24 va h.k.) ishlaganmisiz?" },
    { id: "s4", text: "Rus tilida mijoz bilan erkin gaplasha olasizmi?" },
    { id: "c1", for: "call", text: "Kuniga 50 tadan ortiq qo'ng'iroq bilan ishlaganmisiz?" },
    { id: "c2", for: "call", text: "Sizni tanimaydigan mijozga birinchi bo'lib qo'ng'iroq qilib, sotuv qilganmisiz?" },
    { id: "c3", for: "call", text: "Smenali grafikda (dam olish kunlari ham) ishlay olasizmi?" },
    { id: "r1", for: "reception", text: "Mijozlarni ofis yoki do'konda yuzma-yuz kutib olib, ularga xizmat ko'rsatganmisiz?" },
    { id: "r2", for: "reception", text: "To'lov qabul qilish yoki shartnoma rasmiylashtirish bilan ishlaganmisiz?" },
    { id: "r3", for: "reception", text: "Kun bo'yi ish joyida turib, mijozlar oqimi bilan ishlay olasizmi?" },
    { id: "s5", text: "Toshkentda, to'liq stavkada ishlay olasizmi?" }
  ],

  /* 2-qadam: xarakter testi. Har bir gap 1–5 shkalada baholanadi. */
  test: {
    title: "Xarakter testi",
    note: "Har bir gap sizga qanchalik mos kelishini belgilang. To'g'ri yoki noto'g'ri javob yo'q — o'ylab o'tirmay, birinchi xayolingizga kelganini tanlang.",
    scale: [["1", "Umuman mos emas"], ["2", "Mos emas"], ["3", "Qisman"], ["4", "Mos"], ["5", "Juda mos"]],
    lo: "Mos emas",
    hi: "Juda mos",
    items: [
      ["t1",  "Notanish odam bilan suhbatni osongina boshlay olaman."],
      ["t2",  "Mijoz \"yo'q\" desa, xafa bo'lmay keyingi mijozga o'taman."],
      ["t3",  "Reja bajarilmasa, bunga ko'pincha mijozlar yoki sharoit sabab bo'ladi deb o'ylayman."],
      ["t4",  "Taklif qilishdan oldin mijozdan aynan nima kerakligini so'rab olaman."],
      ["t5",  "Sotuv uchun mahsulotni biroz bo'rttirib maqtash — normal holat."],
      ["t6",  "Har bir mijoz bilan suhbatdan keyin natijani darhol yozib qo'yaman."],
      ["t7",  "Ko'p odam bilan gaplashgan kunning oxirida o'zimni juda holsiz his qilaman."],
      ["t8",  "O'z oldimga reja qo'yib, uni bajarmagunimcha tinchimayman."],
      ["t9",  "Qo'pol mijozdan keyin o'zimga kelishim uchun ancha vaqt kerak bo'ladi."],
      ["t10", "Mahsulot mijozga to'g'ri kelmasa, buni ochiq aytaman — sotuvni yo'qotsam ham."],
      ["t11", "Mahsulotni yaxshi bilsam, mijozga nima kerakligini u aytmasidanoq bilaman."],
      ["t12", "Bir xil ishni har kuni takrorlash meni tez zeriktiradi."]
    ]
  },

  /* 3-qadam: bitta savol. */
  question: {
    title: "Bitta savol",
    text: "Mijoz ikki marta \"qimmat ekan\" deb rad javobini berdi. U bilan uchinchi suhbatni qanday boshlagan bo'lardingiz? Hayotingizda shunday holat bo'lgan bo'lsa, o'shani yozing.",
    hint: "2–4 jumlada, o'z so'zlaringiz bilan yozing.",
    minSentences: 2
  }
};
