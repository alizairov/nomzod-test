/* HR bo'limiga amaliyot — onlayn anketa (1-saralash). HR anketasi bilan bir xil format.
   Faqat matnlar. Qaysi gap teskari baholanishi va sifatlarga bo'linishi — kalit ichida (D1 settings.kalit.amaliyot), repoda YO'Q.
   Matn eski lotin alifbosida yoziladi; yangi alifboga brauzerda alphabet.js o'giradi. */
window.VACANCY_TEST = {
  id: "amaliyot",
  title: "HR amaliyotchi",

  /* 1-qadam: qisqa Ha/Yo'q savollar. */
  yn: [
    { id: "y1", text: "HR, rekruting yoki odamlar bilan ishlash bo'yicha biror tajribangiz bormi (ish, amaliyot yoki volontyorlik)?" },
    { id: "y2", text: "Biror tadbir, to'garak yoki loyihani o'zingiz tashkil qilganmisiz?" },
    { id: "y3", text: "Notanish odamlarga qo'ng'iroq qilib, ular bilan bemalol gaplasha olasizmi?" },
    { id: "y4", text: "Google Sheets yoki Excel'da ishlay olasizmi?" },
    { id: "y5", text: "Rus tilida erkin gaplasha olasizmi?" },
    { id: "y6", text: "Toshkentda, ofisda amaliyot o'tay olasizmi?" }
  ],

  /* 2-qadam: xarakter testi. Har bir gap 1–5 shkalada baholanadi. */
  test: {
    title: "Xarakter testi",
    note: "Har bir gap sizga qanchalik mos kelishini belgilang. To'g'ri yoki noto'g'ri javob yo'q — o'ylab o'tirmay, birinchi xayolingizga kelganini tanlang.",
    scale: [["1", "Umuman mos emas"], ["2", "Mos emas"], ["3", "Qisman"], ["4", "Mos"], ["5", "Juda mos"]],
    lo: "Mos emas",
    hi: "Juda mos",
    items: [
      ["a1",  "Ikki yo'l orasida qolsam, bor ma'lumotni tortib ko'raman va uzoq cho'zmay birini tanlayman."],
      ["a2",  "Ishni topshirishdan oldin xato bor-yo'qligini yana bir bor tekshirib chiqaman."],
      ["a3",  "Muammo chiqsa, avval uning sababini aniqlab olaman, keyin yechim qidiraman."],
      ["a4",  "Ishim haqida tanqidiy fikr eshitsam, uni yaxshilash imkoniyati deb qabul qilaman."],
      ["a5",  "Notanish odam bilan ham tez til topishib, uni gapirtira olaman."],
      ["a6",  "Jamoaga yangi odam kelsa, unga birinchilardan bo'lib yordam taklif qilaman."],
      ["a7",  "Qaror qabul qilishdan oldin, imkoni bo'lsa, boshqalar nima deyishini kutib turaman."],
      ["a8",  "Mayda tafsilotlar menga zerikarli, asosiysi — ishning umumiy natijasi."],
      ["a9",  "Bitta yechim ishlamasa, yana 2–3 ta boshqa variantni o'ylab ko'raman."],
      ["a10", "Tanqid eshitsam, ichimda xafa bo'lib, o'sha odamga nisbatan sovuqlashib qolaman."],
      ["a11", "Suhbatdoshni oxirigacha tinglab, keyin aniqlashtiruvchi savollar beraman."],
      ["a12", "Biror narsani tushuntirsam, odam haqiqatan tushunganiga ishonch hosil qilmaguncha qo'ymayman."],
      ["a13", "Qarorim noto'g'ri chiqsa, aybni sharoitdan izlamay, mas'uliyatni o'zim olaman."],
      ["a14", "Kimgadir \"qilaman\" degan bo'lsam, eslatishlarini kutmay, o'zim oxiriga yetkazaman."],
      ["a15", "Muammo murakkab bo'lsa, uni tajribaliroq odam hal qilishini kutgan ma'qul deb bilaman."],
      ["a16", "Ishimni kimdir tekshirib, kamchiligini aytishini o'zim so'rayman."],
      ["a17", "Bir kunda ko'p odam bilan gaplashish meni tez charchatadi, bunday ishdan qochaman."],
      ["a18", "Yangi odam o'zi so'rasa yordam beraman, so'ramasa — aralashmayman."]
    ]
  },

  /* 3-qadam: bitta savol (muammoga yechim). */
  question: {
    title: "Bitta savol",
    text: "Tasavvur qiling: rekruter sifatida 2 hafta ichida kompaniyaga 3 ta sotuv menejeri topishingiz kerak. Bir hafta o'tdi, lekin bitta ham mos nomzod chiqmadi. Nima qilasiz? Qadamlaringizni ketma-ket yozing.",
    hint: "3–5 jumlada, o'z so'zlaringiz bilan yozing.",
    minSentences: 3
  }
};
