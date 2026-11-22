/* HR mutaxassis vakansiyasi — onlayn anketa (1-saralash). Turon Montessori anketasi formatida.
   Faqat matnlar. Qaysi gap teskari baholanishi va sifatlarga bo'linishi — Apps Script'dagi Kalit.gs ichida.
   Matn eski lotin alifbosida yoziladi; yangi alifboga brauzerda alphabet.js o'giradi.
   (Avvalgi yashirin o'lchovli test — "Ko'zgu" — 1-suhbat uchun saqlangan: nomzod-test reposi, `kozgu` branchi.) */
window.VACANCY_TEST = {
  id: "hr",
  title: "HR mutaxassis",

  /* 1-qadam: qisqa Ha/Yo'q savollar. */
  yn: [
    { id: "y1", text: "Kompaniya rahbari (CEO) yoki top-menejerlar bilan bevosita ishlaganmisiz?" },
    { id: "y2", text: "Xodimni ishga olish yoki ishdan bo'shatish bo'yicha yakuniy qaror qabul qilganmisiz yoki qarorga bevosita ta'sir qilganmisiz?" },
    { id: "y3", text: "Xodimni boshqa lavozimga o'tkazish (rokirovka) jarayonini olib borganmisiz?" },
    { id: "y4", text: "Ishdan bo'shatish haqidagi suhbatni o'zingiz o'tkazganmisiz?" },
    { id: "y5", text: "Kompaniyada HR tizimini (nizom, baholash, motivatsiya va h.k.) noldan qurganmisiz?" },
    { id: "y6", text: "Kamida 3 kishilik jamoani boshqarganmisiz?" },
    { id: "y7", text: "Toshkentda, ofisda, to'liq stavkada ishlay olasizmi?" }
  ],

  /* 2-qadam: xarakter testi. Har bir gap 1–5 shkalada baholanadi. */
  test: {
    title: "Xarakter testi",
    note: "Har bir gap sizga qanchalik mos kelishini belgilang. To'g'ri yoki noto'g'ri javob yo'q — o'ylab o'tirmay, birinchi xayolingizga kelganini tanlang.",
    scale: [["1", "Umuman mos emas"], ["2", "Mos emas"], ["3", "Qisman"], ["4", "Mos"], ["5", "Juda mos"]],
    lo: "Mos emas",
    hi: "Juda mos",
    items: [
      ["t1",  "Xodim bilan xayrlashish kabi noxush qarorni kechiktirmay, o'z vaqtida aytaman."],
      ["t2",  "Kerak bo'lsa, kompaniya rahbariga ham uning fikriga qo'shilmasligimni ochiq aytaman."],
      ["t3",  "Muhim ishni topshirishdan oldin kimdandir tanqidiy fikr so'rab olaman."],
      ["t4",  "Bir muammo ikki marta takrorlansa, uning ildiz sababini qidiraman."],
      ["t5",  "Reja oxirgi daqiqada o'zgarsa, tez yangi yo'l topaman."],
      ["t6",  "Katta kadrlar qarorlarini rahbarlar qabul qilgani ma'qul, men ularni amalga oshirishga yordam beraman."],
      ["t7",  "Kimdir ishimni tanqid qilsa, birinchi navbatda nega shunday qilganimni tushuntiraman."],
      ["t8",  "Yaqin hamkasbim haqida qaror qilayotganda ham, boshqalarga qo'llagan mezonni qo'llayman."],
      ["t9",  "Odamni xafa qilmaslik uchun noxush gapni yumshatib aytaman, ba'zan umuman aytmay qo'yaman."],
      ["t10", "Kadrlar qarorida raqamlardan ko'ra ichki sezgimga ko'proq ishonaman."],
      ["t11", "O'zim yaxshi biladigan, sinalgan usullar bilan ishlashni afzal ko'raman."],
      ["t12", "Yaxshi xodimni saqlab qolish uchun ba'zan qoidadan istisno qilish kerak deb hisoblayman."]
    ]
  },

  /* 3-qadam: bitta savol. */
  question: {
    title: "Bitta savol",
    text: "Rahbariyat siz qo'shilmaydigan kadrlar qarorini qabul qilgan holatni eslang (bo'lmagan bo'lsa — tasavvur qiling). Qanday yo'l tutdingiz va nima uchun?",
    hint: "3–5 jumlada, o'z so'zlaringiz bilan yozing.",
    minSentences: 3
  }
};
