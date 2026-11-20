/* HR mutaxassis vakansiyasi — ariza testi (faqat savollar matni).
   Baholash kaliti bu faylda YO'Q: u faqat Google Apps Script ichida (Kalit.gs) saqlanadi.
   Matn eski lotin alifbosida yoziladi; yangi alifboga brauzerda alphabet.js o'giradi. */
window.VACANCY_TEST = {
  id: "hr",
  title: "HR mutaxassis",

  /* 2-qism: "Mantiqiy fikrlash". Nomzod matndan eng to'g'ri kelib chiqadigan xulosani tanlaydi (bitta javob). */
  logic: {
    title: "Mantiqiy fikrlash",
    intro: "Har bir matnni diqqat bilan o'qing va undan mantiqan eng to'g'ri kelib chiqadigan xulosani tanlang. Faqat matndagi ma'lumotga tayaning.",
    items: [
      { id: "c1", text: "Tadqiqot ko'rsatdiki, o'z ishi haqida tez-tez fikr so'raydigan xodimlarning lavozimi o'rtacha tezroq ko'tariladi.",
        options: [
          { id: "a", text: "Fikr so'rash xatolarni erta tuzatishga imkon beradi, shu sabab bunday xodimlar tezroq o'sishi mumkin." },
          { id: "b", text: "Fikr so'raydigan xodimlar rahbar e'tiborini ko'proq tortadi, shu sabab tezroq ko'tarilishi mumkin." },
          { id: "c", text: "Fikr so'ramaydigan xodimlarning lavozimi ko'tarilmaydi." },
          { id: "d", text: "Lavozimi ko'tarilgan har bir xodim avval fikr so'ragan." }
        ] },
      { id: "c2", text: "Bir kompaniyada muammoli xodim bilan xayrlashish qarori 3 oy kechiktirildi. Shu davrda jamoaning yana ikki a'zosi ishdan ketdi.",
        options: [
          { id: "a", text: "Muammoning uzoq hal qilinmagani jamoadagi boshqa odamlarga ham ta'sir qilgan bo'lishi mumkin." },
          { id: "b", text: "Xodimga o'zgarish uchun imkoniyat berilgan, ammo jamoa buni kutishga tayyor bo'lmagan bo'lishi mumkin." },
          { id: "c", text: "Xodim darhol bo'shatilganida, hech kim ketmagan bo'lardi." },
          { id: "d", text: "Ketgan ikki xodim ham muammoli bo'lgan." }
        ] },
      { id: "c3", text: "Bir kompaniya har yili ish jarayonlarini o'zgartiradi. Xodimlar so'rovida \"barqarorlik yetishmaydi\" degan javob ko'p, lekin kompaniya daromadi har yili o'smoqda.",
        options: [
          { id: "a", text: "O'zgarishlar xodimlarga noqulay bo'lsa-da, kompaniyaga bozorga tez moslashishda yordam berayotgan bo'lishi mumkin." },
          { id: "b", text: "Daromad o'sayotgan bo'lsa ham, barqarorlik yetishmasligi uzoq muddatda kompaniyaga zarar berishi mumkin." },
          { id: "c", text: "Daromad aynan jarayonlar o'zgargani uchun o'smoqda." },
          { id: "d", text: "Xodimlar daromad o'sayotganini bilishmaydi." }
        ] },
      { id: "c4", text: "Kuzatuvlarga ko'ra, loyiha guruhida rasmiy rahbar tayinlanmasa, odatda eng faol gapirgan odam qarorlarni belgilay boshlaydi.",
        options: [
          { id: "a", text: "Guruhda rahbarlik ko'pincha lavozimdan emas, tashabbusdan paydo bo'ladi." },
          { id: "b", text: "Rasmiy rahbar bo'lmasa, qarorlar bir odamning shaxsiy fikriga bog'lanib qolish xavfi bor." },
          { id: "c", text: "Ko'p gapiradigan odamlar yaxshi rahbar bo'ladi." },
          { id: "d", text: "Rasmiy rahbar tayinlansa, guruhda hamma teng gapiradi." }
        ] },
      { id: "c5", text: "Bir kompaniyada ish haqi ma'lumotlari maxfiy saqlanadi. Xodimlar orasida \"kimdir ko'proq oladi\" degan gaplar tez-tez chiqadi.",
        options: [
          { id: "a", text: "Tushunarli mezonlar bo'lmasa, odamlar adolatsizlikni o'zlari taxmin qila boshlashi mumkin." },
          { id: "b", text: "Maosh mavzusi qancha ko'p muhokama qilinsa, norozilik shuncha ko'payishi mumkin, shuning uchun maxfiylikni kuchaytirish kerak." },
          { id: "c", text: "Bu gaplar to'g'ri — kimdir haqiqatan ko'proq oladi." },
          { id: "d", text: "Maoshlar ochiq bo'lsa, bunday gaplar umuman bo'lmaydi." }
        ] },
      { id: "c6", text: "Natijasi pasaygan xodimlarning ko'pchiligi rahbari bilan suhbatda shaxsiy muammolarini tilga olgan.",
        options: [
          { id: "a", text: "Shaxsiy hayotdagi qiyinchiliklar ish natijasiga ta'sir qilishi mumkin." },
          { id: "b", text: "Natija pasayganda odamlar buni tashqi sabablar bilan izohlashga moyil bo'lishi mumkin." },
          { id: "c", text: "Shaxsiy muammosi bor har bir xodimning natijasi pasayadi." },
          { id: "d", text: "Xodimlarning muammolariga rahbarlar sabab bo'lgan." }
        ] },
      { id: "c7", text: "Bir kompaniyaning sotuv bo'limida xodimlar tez almashadi: har safar yangi odam olinganda, bir necha oyda u ham ketadi.",
        options: [
          { id: "a", text: "Sabab alohida odamlarda emas, bo'limdagi sharoit yoki boshqaruvda bo'lishi mumkin." },
          { id: "b", text: "Sotuv ishi og'ir, bu sohada xodimlarning tez almashishi tabiiy bo'lishi mumkin." },
          { id: "c", text: "Bo'limga kelayotgan yangi xodimlar dangasa." },
          { id: "d", text: "Maosh oshirilsa, hamma qoladi." }
        ] },
      { id: "c8", text: "Rahbarlar uchun 360 daraja baholash o'tkazildi. Eng past baho olgan rahbarlar ko'pincha so'rovnoma savollari noto'g'ri tuzilgan deb hisoblashdi.",
        options: [
          { id: "a", text: "Past baho olgan odamga tanqidni qabul qilishdan ko'ra baholash usulini shubha ostiga olish osonroq bo'lishi mumkin." },
          { id: "b", text: "Savollar haqiqatan noaniq bo'lsa, past baholar rahbarning haqiqiy ishini aks ettirmasligi mumkin." },
          { id: "c", text: "Yuqori baho olgan rahbarlar so'rovnomani yaxshi deb bilishgan." },
          { id: "d", text: "360 daraja baholash rahbarlar uchun foydasiz." }
        ] },
      { id: "c9", text: "Muzokaralar bo'yicha tadqiqotlarga ko'ra, birinchi bo'lib yon bosgan tomon odatda oxirida kamroq foyda bilan chiqadi.",
        options: [
          { id: "a", text: "Muzokarada o'z pozitsiyasini uzoqroq ushlab turish foydali bo'lishi mumkin." },
          { id: "b", text: "Tomonlar erta yon bossa, muzokara tezroq va kelishuv bilan tugashi mumkin." },
          { id: "c", text: "Muzokarada hech qachon yon bosmaslik kerak." },
          { id: "d", text: "Birinchi yon bosgan tomon har doim yutqazadi." }
        ] },
      { id: "c10", text: "Ko'p kompaniyalarda muhim qarorlar rasmiy yig'ilishda emas, undan oldingi norasmiy suhbatlarda shakllanadi.",
        options: [
          { id: "a", text: "Qarorga ta'sir qilmoqchi bo'lgan odam yig'ilishdan oldin odamlar bilan gaplashib olgani ma'qul." },
          { id: "b", text: "Norasmiy kelishuvlar rasmiy yig'ilishni shunchaki tasdiqlash marosimiga aylantirib qo'yishi mumkin." },
          { id: "c", text: "Rasmiy yig'ilishlar keraksiz." },
          { id: "d", text: "Norasmiy suhbatlarda faqat rahbarlar qatnashadi." }
        ] },
      { id: "c11", text: "Tanishlar tavsiyasi bilan xodim oladigan kompaniyalarda xodimlarning ishdan ketishi kamroq.",
        options: [
          { id: "a", text: "Tavsiya orqali ishga olish ishonchli usul bo'lishi mumkin." },
          { id: "b", text: "Ketish kamligi — bitta ko'rsatkich; bu usul boshqa nomzodlarga teng imkoniyat bermasligi mumkin." },
          { id: "c", text: "Tanish orqali kelgan xodimlar yaxshiroq ishlaydi." },
          { id: "d", text: "Ochiq tanlov orqali olingan xodimlar bir yil ichida ketadi." }
        ] },
      { id: "c12", text: "Xodimlar qisqartirilishini oldindan va ochiq e'lon qilgan kompaniyalarda qolgan xodimlarning kompaniyaga sadoqati yuqoriroq bo'lgan.",
        options: [
          { id: "a", text: "Odamlar uchun yomon xabarning o'zidan ko'ra, unga qanday munosabatda bo'linishi muhimroq bo'lishi mumkin." },
          { id: "b", text: "Oldindan bilgan xodimlar o'zlarini o'zgarishga tayyorlashga ulgurgan bo'lishi mumkin." },
          { id: "c", text: "Qisqartirishni yashirgan kompaniyalardan hamma ketadi." },
          { id: "d", text: "Ochiq e'lon qilish qisqartirilganlar sonini kamaytiradi." }
        ] }
    ]
  },

  /* 3-qism: kundalik hayotdan vaziyatlar (bitta javob). */
  daily: {
    title: "Kundalik vaziyatlar",
    intro: "Ishga aloqasi yo'q oddiy vaziyatlar. Ko'p o'ylamang — odatda qanday yo'l tutsangiz, shuni tanlang.",
    items: [
      { id: "k1", text: "Do'stlaringiz bilan sayohatga chiqdingiz. Birinchi kuni ma'lum bo'ldiki, band qilingan mehmonxona yopiq ekan.",
        options: [
          { id: "a", text: "Darhol telefonni olib, boshqa variantlarni qidira boshlayman." },
          { id: "b", text: "Hammamiz birga o'tirib, nima qilishni maslahatlashamiz." },
          { id: "c", text: "Mehmonxona bilan bog'lanib, nima bo'lganini aniqlayman va pulni qaytarishni talab qilaman." },
          { id: "d", text: "Bu ham sayohatning bir qismi — kutilmagan joyda qolish qiziq bo'lishi mumkin." }
        ] },
      { id: "k2", text: "Oilaviy davrada qarindoshingiz siz noto'g'ri deb bilgan fikrni ishonch bilan aytmoqda.",
        options: [
          { id: "a", text: "Hozir bahslashmayman, keyinroq yolg'iz qolganda fikrimni aytaman." },
          { id: "b", text: "Fikrimni xotirjam aytaman — boshqalar ham eshitsin." },
          { id: "c", text: "Nega shunday deb o'ylashini so'rayman — balki men bilmagan narsa bordir." },
          { id: "d", text: "Gapni boshqa mavzuga buraman." }
        ] },
      { id: "k3", text: "Restoranda buyurtmangiz noto'g'ri keldi. Ofitsiant juda band.",
        options: [
          { id: "a", text: "Ofitsiantni chaqirib, almashtirib berishni so'rayman." },
          { id: "b", text: "Kelgan ovqat ham yomon emas — shuni yeyman." },
          { id: "c", text: "Ofitsiant bo'shaguncha kutaman, keyin xotirjam aytaman." },
          { id: "d", text: "Hisob-kitob paytida aytaman — keyingi safar xato qilmasliklari uchun." }
        ] },
      { id: "k4", text: "Siz uyushtirgan tadbirdan keyin bir do'stingiz \"menga unchalik yoqmadi\" dedi.",
        options: [
          { id: "a", text: "Aynan nima yoqmaganini so'rayman." },
          { id: "b", text: "Tadbir hammaga birdek yoqishi mumkin emasligini aytaman." },
          { id: "c", text: "Boshqa qatnashganlarning fikrini ham bilishga harakat qilaman." },
          { id: "d", text: "Keyingi safar tadbirni o'zi tashkil qilishini taklif qilaman." }
        ] },
      { id: "k5", text: "Navbatda turibsiz. Kimdir oldingizga o'tib oldi.",
        options: [
          { id: "a", text: "Xotirjam, navbat borligini aytaman." },
          { id: "b", text: "E'tibor bermayman — bir kishi katta farq qilmaydi." },
          { id: "c", text: "Atrofdagilar nima qilishini kuzataman." },
          { id: "d", text: "Balki shoshilinch ishi bordir, deb o'ylayman." }
        ] },
      { id: "k6", text: "Do'stlar bilan dam olish kunini rejalashtiryapsiz, lekin hech kim aniq taklif bermayapti.",
        options: [
          { id: "a", text: "O'zim reja tuzib, hammaga yuboraman." },
          { id: "b", text: "Har kimdan nima xohlashini alohida so'rayman." },
          { id: "c", text: "Bir nechta variant yozib, ovoz berishni taklif qilaman." },
          { id: "d", text: "Kimdir taklif qilishini kutaman — baribir yaxshi o'tadi." }
        ] },
      { id: "k7", text: "Yangi telefon oldingiz. Uning sozlamalari eskisidan butunlay boshqacha.",
        options: [
          { id: "a", text: "Bir oz vaqt ajratib, sozlamalarni boshidan oxirigacha ko'rib chiqaman." },
          { id: "b", text: "Ishlataveraman, kerak bo'lganda o'rganaman." },
          { id: "c", text: "Iloji boricha eskisiga o'xshatib sozlab olaman." },
          { id: "d", text: "Yaxshi tushunadigan tanishimdan ko'rsatib berishini so'rayman." }
        ] },
      { id: "k8", text: "Ko'changizdagi chiroq bir oydan beri yonmaydi.",
        options: [
          { id: "a", text: "Tegishli joyga o'zim murojaat qilaman." },
          { id: "b", text: "Qo'shnilar bilan kelishib, birgalikda murojaat yozamiz." },
          { id: "c", text: "Kimdir allaqachon murojaat qilgandir, deb o'ylayman." },
          { id: "d", text: "Avval nega bunday ishlar sekin hal bo'lishini surishtiraman." }
        ] },
      { id: "k9", text: "Do'stingiz qarzni qaytarish muddatini ikkinchi marta o'tkazib yubordi.",
        options: [
          { id: "a", text: "Ochiq gaplashib, aniq sana belgilaymiz." },
          { id: "b", text: "Qiyin ahvoldadir — o'zi qaytarguncha kutaman." },
          { id: "c", text: "Bundan keyin unga qarz bermaslikka qaror qilaman." },
          { id: "d", text: "Avval nima bo'lganini so'rayman, keyin nima qilishni hal qilaman." }
        ] },
      { id: "k10", text: "Do'stlaringiz bilan o'ynaydigan o'yinda (shaxmat, karta va h.k.) ketma-ket yutqazyapsiz.",
        options: [
          { id: "a", text: "Raqibim qanday o'ynayotganini kuzatib, o'rganaman." },
          { id: "b", text: "Yutmagunimcha o'ynayveraman." },
          { id: "c", text: "Boshqa o'yin o'ynashni taklif qilaman." },
          { id: "d", text: "Bu shunchaki o'yin — natija muhim emas." }
        ] }
    ]
  },

  /* 4-qism (a): qadriyatlarni muhimlik tartibida joylash. */
  values: {
    title: "Ish joyida siz uchun nima muhimroq?",
    intro: "Quyidagilarni o'zingiz uchun eng muhimidan boshlab tartib bilan bosing. Hammasi yaxshi narsalar — farq faqat tartibda.",
    items: [
      { id: "v1", text: "Hammaga bir xil, adolatli mezon" },
      { id: "v2", text: "Iliq, do'stona jamoa" },
      { id: "v3", text: "Yangilik va o'zgarishlar" },
      { id: "v4", text: "Qarorlarga ta'sir qila olish" },
      { id: "v5", text: "Ochiq va halol fikr-mulohaza" },
      { id: "v6", text: "Aniq tizim va uzoq muddatli reja" },
      { id: "v7", text: "Qat'iy talab va javobgarlik" }
    ]
  },

  /* 4-qism (b): o'zingiz haqingizda (Ha / Yo'q). */
  statements: [
    { id: "l1", text: "Hayotimda biror odamga nisbatan ichimda g'azab his qilmaganman." },
    { id: "l2", text: "Ba'zan tanqidni eshitganimda birinchi reaksiyam o'zimni himoya qilish bo'ladi." },
    { id: "l3", text: "Barcha va'dalarimni har doim o'z vaqtida bajarganman." },
    { id: "l4", text: "Ba'zan qaror qabul qilib, keyin uning xato ekanini tushunganman." },
    { id: "l5", text: "Har qanday odam bilan bir xil yaxshi ishlay olaman — men uchun qiyin odam bo'lmagan." },
    { id: "l6", text: "Ba'zida ishni ertaga qoldirgan paytlarim bo'lgan." }
  ],

  /* 5-qism: ochiq savollar. */
  open: [
    { id: "o1", text: "CEO va moliya direktori bir xodimni bo'shatish masalasida qarama-qarshi fikrda. Ikkalasi ham sizdan qo'llab-quvvatlash kutyapti. Qanday yo'l tutasiz?", hint: "3–6 gap" },
    { id: "o2", text: "Kimnidir ishdan bo'shatgan yoki shunday qarorga ta'sir qilgan bir holatni yozing. Nima qildingiz va hozir nimani boshqacha qilgan bo'lardingiz?", hint: "Agar bunday holat bo'lmagan bo'lsa, boshqa qiyin kadrlar qarorini yozing" },
    { id: "o3", text: "Sizga oxirgi marta berilgan, yoqmagan fidbek nima edi va unga qanday munosabat bildirdingiz?", hint: "Aniq holatni yozing" }
  ]
};
