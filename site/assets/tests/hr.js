/* HR mutaxassis vakansiyasi — ariza testi (faqat savollar matni).
   Baholash kaliti bu faylda YO'Q: u faqat Google Apps Script ichida (Kalit.gs) saqlanadi.
   Matn eski lotin alifbosida yoziladi; yangi alifboga brauzerda alphabet.js o'giradi. */
window.VACANCY_TEST = {
  id: "hr",
  title: "HR mutaxassis",

  /* 1-qism: vaziyatlar. Har birida nomzod "eng ehtimolli" va "eng kam ehtimolli" harakatni tanlaydi. */
  situations: [
    { id: "s1", text: "Rahbariyat yig'ilishida CEO siz tayyorlagan motivatsiya tizimini boshqa direktorlar oldida keskin tanqid qildi. Ba'zi gaplari sizga asossiz tuyuldi.",
      options: [
        { id: "a", text: "Yig'ilishda xotirjam tinglayman, yozib olaman. Keyin alohida uchrashib, qaysi qismlari asosli ekanini aniqlashtiraman va tuzatilgan variant bilan qaytaman." },
        { id: "b", text: "O'sha yerning o'zida dalillarim bilan tizimni himoya qilaman — direktorlarda noto'g'ri tasavvur qolmasligi kerak." },
        { id: "c", text: "Tanqidni qabul qilaman va CEO aytganlarini to'liq inobatga olib, tizimni qayta ishlayman." },
        { id: "d", text: "Yig'ilishdan keyin har bir direktordan alohida fikr so'rab, tizimni ular bilan birga qayta ko'rib chiqishni taklif qilaman." }
      ] },
    { id: "s2", text: "Kompaniyada 7 yildan beri ishlayotgan, asoschilarga yaqin bo'lim boshlig'i so'nggi bir yilda bo'lim natijalarini ancha pasaytirib yubordi. CEO: \"O'zingiz hal qiling\" dedi.",
      options: [
        { id: "a", text: "U bilan ochiq suhbat qilaman, aniq ko'rsatkichlar bilan 60 kunlik reja tuzamiz. Natija bo'lmasa — lavozimini o'zgartirish yoki xayrlashish." },
        { id: "b", text: "Xizmatlarini hisobga olib, unga kamroq mas'uliyatli lavozimni taklif qilaman, bo'limga yangi rahbar olamiz." },
        { id: "c", text: "Bir yil — yetarli muddat. Hurmat bilan, munosib kompensatsiya berib xayrlashamiz." },
        { id: "d", text: "Avval pasayishning asl sababini o'rganaman — balki muammo uning o'zida emas, resurs yoki tizimdadir." }
      ] },
    { id: "s3", text: "Bir xodim sizga ishonib oilaviy muammosini aytgan edi. CEO shu xodim haqida so'rab: \"Kompaniya uchun bilishim kerak\" deyapti.",
      options: [
        { id: "a", text: "Shaxsiy tafsilotlarni aytmayman, faqat ishga ta'sir qiladigan qismini aytaman (masalan, vaqtincha yuklamani kamaytirish kerakligini)." },
        { id: "b", text: "CEO — rahbar, qarorni u qabul qiladi. Unga to'liq ma'lumot beraman." },
        { id: "c", text: "Avval xodimning o'zidan ruxsat so'rayman, keyin CEOga aytaman." },
        { id: "d", text: "Ochiq aytaman: bu ma'lumot menga ishonch asosida berilgan, uni aytmayman — HRga ishonch shunga bog'liq." }
      ] },
    { id: "s4", text: "Kompaniya o'sishi uchun ikki bo'limni birlashtirish kerak. Natijada bo'lim boshliqlaridan biri ortiqcha bo'lib qoladi. Ikkalasi ham yaxshi xodim.",
      options: [
        { id: "a", text: "Ikkalasini yangi rol talablari bo'yicha baholayman (mezonlarni oldindan e'lon qilib). Kuchlirog'i rahbar bo'ladi, ikkinchisiga boshqa yo'nalishda o'sish rolini taklif qilaman." },
        { id: "b", text: "Birlashtirishni biroz kechiktirib, ikkalasiga ham mos rol paydo bo'lishini kutishni taklif qilaman." },
        { id: "c", text: "CEOga variantlarni tahlil bilan taqdim qilaman. Yakuniy tanlovni u qilsin — bu uning jamoasi." },
        { id: "d", text: "Ikkalasini birga rahbar qilib sinab ko'raman, 3 oydan keyin natijaga qarab qaror qilamiz." }
      ] },
    { id: "s5", text: "3 oy ustida ishlagan baholash tizimingizni ishga tushirishga bir hafta qolganda kompaniya strategiyasi o'zgardi va loyiha to'xtatildi.",
      options: [
        { id: "a", text: "Afsuslanaman, lekin tezda yangi strategiyada HR qaysi muammoni hal qilishi kerakligini aniqlab, yangi reja tuzaman." },
        { id: "b", text: "Tizimni tashlamasdan, uni yangi strategiyaga moslab qo'llash mumkinligini dalillar bilan ko'rsatishga harakat qilaman." },
        { id: "c", text: "Loyiha nega to'xtatilganini batafsil so'rayman va kelajakda shunday holat takrorlanmasligi uchun jarayonni kelishib olaman." },
        { id: "d", text: "Qaror qabul qilingan — muhokama qilmayman, menga beriladigan yangi vazifalarga o'taman." }
      ] },
    { id: "s6", text: "CEO tanishi tavsiya qilgan nomzodni moliya direktori lavozimiga olmoqchi. Siz suhbatda jiddiy xavotirli belgilarni ko'rdingiz.",
      options: [
        { id: "a", text: "CEOga aniq faktlar va xavflarni yozma taqdim etaman, tavsiyam \"olmaslik\" ekanini aytaman. Yakuniy qaror uniki." },
        { id: "b", text: "Qo'shimcha mustaqil bosqich taklif qilaman — amaliy topshiriq yoki oldingi ish joylaridan tekshiruv. Natija o'zi gapirsin." },
        { id: "c", text: "Tortishmayman — CEO tanishini mendan yaxshiroq biladi. Lekin sinov muddatini qattiqroq nazorat qilaman." },
        { id: "d", text: "Qaror qabul qilinsa ham, e'tirozimni rasmiy qayd etaman va boshqa rahbarlar fikrini ham so'rayman." }
      ] },
    { id: "s7", text: "Siz joriy qilgan adaptatsiya jarayoni haqida yangi kelgan kichik xodim \"bu jarayon vaqtni behuda o'tkazadi\" deb yozdi. Ohangi biroz qo'pol.",
      options: [
        { id: "a", text: "U bilan uchrashib, aynan qaysi qismlar ortiqcha ekanini so'rayman. Asosli bo'lsa, jarayonni o'zgartiraman va unga rahmat aytaman." },
        { id: "b", text: "Fikrini qabul qilaman, lekin avval qo'pol ohang haqida alohida gaplashaman — madaniyat ham muhim." },
        { id: "c", text: "Bir kishining fikri bilan jarayonni o'zgartirmayman — keyingi oqimdagi barcha yangi xodimlardan so'rovnoma olaman." },
        { id: "d", text: "Jarayonni tajriba asosida qurganman. Yangi xodim hali to'liq tushunmagan bo'lishi mumkin — biroz vaqtdan keyin yana so'rayman." }
      ] },
    { id: "s8", text: "CEO bir oyga ketdi. Shu orada ikki direktor o'rtasidagi kelishmovchilik jamoalarga ham o'tib, ish to'xtay boshladi. Sizga hech kim vakolat bermagan.",
      options: [
        { id: "a", text: "Ikkala direktorni bitta stolga yig'aman, muzokarani o'zim olib boraman va kelishuvni yozma qayd qilaman." },
        { id: "b", text: "CEOga vaziyatni qisqa yozib, qanday harakat qilishimni kelishib olaman, keyin harakat qilaman." },
        { id: "c", text: "Har bir direktor bilan alohida gaplashib, manfaatlarini tushunaman; jamoalarga vaqtincha ish tartibini taklif qilaman." },
        { id: "d", text: "Bu direktorlar darajasidagi masala, CEO qaytgach hal bo'ladi. Hozir jamoalarga ta'sirni kamaytirishga e'tibor beraman." }
      ] },
    { id: "s9", text: "Eng yuqori natijali sotuv menejeri jamoadoshlarini kamsitadi, shu sabab ikki kishi ishdan ketdi. Sotuv direktori: \"Unga tegmang, reja unga bog'liq\" deyapti.",
      options: [
        { id: "a", text: "Xulq qoidalari hammaga bir xil. Rasmiy ogohlantirish va aniq muddat beraman; o'zgarmasa — xayrlashamiz. Sotuv direktori bilan zaxira reja tuzamiz." },
        { id: "b", text: "Menejer bilan alohida, ochiq suhbat qilaman, coaching taklif qilaman — balki u o'z ta'sirini anglamaydi." },
        { id: "c", text: "Ketgan xodimlar kompaniyaga qanchaga tushganini (yo'qotish, yangi xodim xarajati) hisoblab, sotuv direktoriga raqamlarda ko'rsataman." },
        { id: "d", text: "Natija biznes uchun muhim. Hozircha uni tinch qo'yib, jamoaning o'ziga ko'proq e'tibor beraman." }
      ] },
    { id: "s10", text: "Siz tavsiya qilgan va ishga olingan direktor 2 oyda muvaffaqiyatsiz bo'lib, ketdi. CEO: \"Nima bo'ldi?\" deb so'radi.",
      options: [
        { id: "a", text: "Tanlov jarayonimda nima o'tkazib yuborilganini tahlil qilaman, xatoni tan olaman va jarayonga aniq o'zgarishlar taklif qilaman." },
        { id: "b", text: "Nomzod suhbatda yaxshi edi, muammo moslashuvda (adaptatsiya, rahbar bilan munosabat) bo'ldi — buni ham tahlil qilish kerak." },
        { id: "c", text: "Bu qarorni birgalikda qabul qilganimizni eslatib, kelajakda qanday qaror qilishimizni muhokama qilishni taklif qilaman." },
        { id: "d", text: "Xatoni tan olaman, lekin ishga olish 100% kafolat bermasligini ham tushuntiraman — bunday holatlar hamma joyda bo'ladi." }
      ] },
    { id: "s11", text: "Moliyaviy qiyinchilik sababli bonus tizimini qisqartirish qaror qilindi. E'lon qilish sizning zimmangizda, jamoa norozi bo'lishi aniq.",
      options: [
        { id: "a", text: "Sabablarni raqamlar bilan ochiq tushuntiraman, bonus qachon va qanday shartda qaytishini aytaman, savollarga yuzma-yuz javob beraman." },
        { id: "b", text: "Avval bo'lim boshliqlariga tushuntirib, ular orqali yetkazaman — xabar yaqin rahbardan kelsa yaxshiroq qabul qilinadi." },
        { id: "c", text: "CEO e'lon qilishini taklif qilaman — bunday qaror rahbardan kelishi kerak, HR keyin savollar bilan ishlaydi." },
        { id: "d", text: "Nomoddiy kompensatsiya (moslashuvchan grafik, qo'shimcha dam olish kuni) paketini tayyorlab, u bilan birga e'lon qilaman." }
      ] },
    { id: "s12", text: "Yangi kompaniyaga keldingiz. HR tizimi umuman yo'q. CEO \"tizim kerak\" deydi, lekin nima kerakligini aniq aytmaydi.",
      options: [
        { id: "a", text: "Dastlabki 2–3 hafta rahbarlar va xodimlar bilan suhbatlashib, muammolar xaritasini tuzaman, keyin ustuvorliklarni CEO bilan kelishaman." },
        { id: "b", text: "Eng og'riqli muammoni darhol tanlab, tez natija ko'rsataman. Ishonch qozongach, kattaroq ishlarga o'taman." },
        { id: "c", text: "Avval CEO bilan aniq maqsad va ko'rsatkichlarni yozma kelishib olaman, keyin ish boshlayman." },
        { id: "d", text: "Oldin ishlatib, natija bergan tizimimni (siyosat, hujjatlar, jarayonlar) olib kelib, kompaniyaga moslashtiraman." }
      ] },
    { id: "s13", text: "Xarajatlarni kamaytirish uchun xodimlarning 15 foizini qisqartirish kerak. Bir direktor ro'yxatdan o'z qarindoshini olib tashlashni so'radi; uning natijalari past.",
      options: [
        { id: "a", text: "Ro'yxat oldindan kelishilgan mezonlar asosida tuzilgan. Istisno qilmayman va buni direktorga xotirjam tushuntiraman." },
        { id: "b", text: "Masalani CEOga olib chiqaman — bu manfaatlar to'qnashuvi, buni yolg'iz hal qilmasligim kerak." },
        { id: "c", text: "Mezonlarni qayta ko'rib chiqaman — balki uning ishiga boshqa tomondan qaralsa, qolishi mumkin." },
        { id: "d", text: "Direktor bilan birga qarindoshining kompaniyadagi boshqa ochiq vakansiyaga umumiy shartlar asosida o'tish imkonini ko'rib chiqamiz." }
      ] },
    { id: "s14", text: "CEOning o'zi jamoada qo'rquv muhitini yaratayotganini ko'ryapsiz: yig'ilishlarda baqiradi, odamlar fikr aytmay qo'ydi, ishdan ketish ko'paydi.",
      options: [
        { id: "a", text: "CEO bilan yuzma-yuz, faktlar (ketish ko'rsatkichi, chiqish suhbatlari) bilan ochiq gaplashaman va xulqining ta'sirini aniq aytaman." },
        { id: "b", text: "Anonim so'rovnoma o'tkazib, natijalarni rahbariyatga umumiy hisobot sifatida taqdim qilaman — gapni ma'lumot aytsin." },
        { id: "c", text: "CEOga to'g'ridan-to'g'ri ayblovsiz, tashqi coach yoki rahbarlik dasturini taklif qilaman." },
        { id: "d", text: "Boshqaruv uslubi — CEOning huquqi. Men menejerlarga jamoalarini motivatsiya qilishda yordam beraman." }
      ] },
    { id: "s15", text: "Rahbariyat siz qarshi bo'lgan qarorni qabul qildi: masofaviy ish bekor qilinadi, hamma ofisga qaytadi. Siz buni xato deb hisoblaysiz.",
      options: [
        { id: "a", text: "E'tirozimni rahbariyatga aytganman. Qaror qabul qilingan ekan, uni to'liq qo'llab-quvvatlab, jamoaga eng yaxshi tarzda joriy qilaman." },
        { id: "b", text: "Qarorni joriy qilaman, 3 oydan keyin natijalarni (ketish, unumdorlik) o'lchab, ma'lumot bilan masalani yana ko'taraman." },
        { id: "c", text: "Xodimlar bilan gaplashganda o'zim ham bu qarorga qo'shilmasligimni yashirmayman — samimiylik muhim." },
        { id: "d", text: "Joriy qilishda alohida holatlar uchun istisnolar tartibini taklif qilaman, qaror yumshoqroq qabul qilinsin." }
      ] },
    { id: "s16", text: "Muhim lavozimga ikki nomzod qoldi. A — tajribali, darhol ishga tayyor, lekin qadriyatlarda shubha bor. B — tajribasi kamroq, lekin kompaniya qadriyatlariga to'liq mos va tez o'rganadi. Biznes 1 oyda natija kutyapti.",
      options: [
        { id: "a", text: "B ni olaman va dastlabki 3 oy uchun kuchli qo'llab-quvvatlash rejasini tuzaman — ko'nikma o'rgatiladi, qadriyat emas." },
        { id: "b", text: "A ni olaman, qadriyatlar bo'yicha aniq kutilmalarni shartnoma va sinov muddatida belgilab qo'yaman." },
        { id: "c", text: "Qarorni kechiktirib, ikkala sifatni birlashtirgan uchinchi nomzodni qidirishda davom etaman." },
        { id: "d", text: "Ikkalasini real biznes vazifasi bilan yakuniy amaliy bosqichga chaqiraman, qarorni natija va jamoa fikriga qarab qilaman." }
      ] }
  ],

  /* 2-qism: majburiy tanlov. Ikkala jumla ham ijobiy — nomzod o'ziga ko'proq mosini tanlaydi. */
  pairs: [
    { id: "p1",  a: "Qiyin qarorni tez qabul qilaman va uni oxirigacha izchil olib boraman.", b: "Qaror qabul qilishdan oldin unga aloqador har bir odamni tinglayman." },
    { id: "p2",  a: "Xatoimni aytishsa, avval rahmat aytaman, keyin o'ylab ko'raman.", b: "Dalillarim kuchli bo'lsa, bosim ostida ham pozitsiyamni o'zgartirmayman." },
    { id: "p3",  a: "Rejalar o'zgarsa, tez qayta tuzaman va bundan ortiqcha tashvishlanmayman.", b: "Muammoning ildizini topmaguncha tinchimayman." },
    { id: "p4",  a: "Guruhda hech kim boshqaruvni olmasa, o'zim olaman.", b: "Qoidalar hamma uchun bir xil bo'lishi men uchun eng muhim narsalardan biri." },
    { id: "p5",  a: "Odamlar kayfiyatini gaplashmasdan ham sezaman.", b: "Har bir qaror ortida raqam va fakt bo'lishi kerak deb hisoblayman." },
    { id: "p6",  a: "Yangi, noaniq vaziyatlar meni qiziqtiradi.", b: "Rahbarlarni ham o'z fikrimga ishontira olaman." },
    { id: "p7",  a: "Meni eng ko'p o'stirgan odamlar — meni tanqid qilganlar.", b: "Odamlar sirini menga ishonib aytishadi va u menda qoladi." },
    { id: "p8",  a: "Ishdan bo'shatish haqidagi suhbatni kechiktirmayman.", b: "Bir ishni bir necha usulda qila olaman, bittasiga yopishib qolmayman." },
    { id: "p9",  a: "Jamoaning kelajagi uchun bugungi qulaylikdan voz kechishga tayyorman.", b: "Odamlar men bilan eng qiyin mavzuda ham ochiq gaplasha olishadi." },
    { id: "p10", a: "Hamkasblarimdan o'zim haqimda tanqidiy fikr so'rab turaman.", b: "Mas'uliyatni o'z zimmamga olishdan qochmayman." },
    { id: "p11", a: "Yoqtirgan odamimga ham, yoqtirmaganimga ham bir xil mezon qo'llayman.", b: "Kerak bo'lsa, eng yaqin hamkasbimga ham \"yo'q\" deya olaman." },
    { id: "p12", a: "O'z g'oyamdan yaxshiroq g'oya chiqsa, undan oson voz kechaman.", b: "Murakkab vaziyatda boshqalar menga qarashadi." }
  ],

  /* 3-qism: o'zingiz haqingizda (Ha / Yo'q). */
  statements: [
    { id: "l1", text: "Hayotimda biror odamga nisbatan ichimda g'azab his qilmaganman." },
    { id: "l2", text: "Ba'zan tanqidni eshitganimda birinchi reaksiyam o'zimni himoya qilish bo'ladi." },
    { id: "l3", text: "Barcha va'dalarimni har doim o'z vaqtida bajarganman." },
    { id: "l4", text: "Ba'zan qaror qabul qilib, keyin uning xato ekanini tushunganman." },
    { id: "l5", text: "Har qanday odam bilan bir xil yaxshi ishlay olaman — men uchun qiyin odam bo'lmagan." },
    { id: "l6", text: "Ba'zida ishni ertaga qoldirgan paytlarim bo'lgan." }
  ],

  /* 4-qism: ochiq savollar. */
  open: [
    { id: "o1", text: "CEO va moliya direktori bir xodimni bo'shatish masalasida qarama-qarshi fikrda. Ikkalasi ham sizdan qo'llab-quvvatlash kutyapti. Qanday yo'l tutasiz?", hint: "3–6 gap" },
    { id: "o2", text: "Kimnidir ishdan bo'shatgan yoki shunday qarorga ta'sir qilgan bir holatni yozing. Nima qildingiz va hozir nimani boshqacha qilgan bo'lardingiz?", hint: "Agar bunday holat bo'lmagan bo'lsa, boshqa qiyin kadrlar qarorini yozing" },
    { id: "o3", text: "Sizga oxirgi marta berilgan, yoqmagan fidbek nima edi va unga qanday munosabat bildirdingiz?", hint: "Aniq holatni yozing" }
  ]
};
