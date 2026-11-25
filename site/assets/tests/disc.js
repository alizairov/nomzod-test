/* Shaxsiyat testi (ichkarida: DISC) — onlayn test (UZ / RU). Faqat matnlar: baholash kaliti bu yerda YO'Q, u serverda (kabinet-api/src/index.js).
   Har bir savol: q = [uz, ru]; o = [[harf, uz, ru], ...] (7- va 10-savolda faqat A/B, qolganlarida A/B/C/D).
   Uzbekcha matn eski lotin alifbosida yoziladi; yangi alifboga brauzerda alphabet.js o'giradi (ruscha matnga tegmaydi). */
window.DISC_TEST = {
  id: "disc",
  title: ["Shaxsiyat testi", "Тест личности"],
  time: ["taxminan 10 daqiqa", "около 10 минут"],
  instruction: [
    "Test natijasi to'g'ri chiqishi uchun samimiy javob bering: kim bo'lishni xohlashingizga qarab emas, aslida qanday bo'lsangiz, shunday javob bering. Bunday vaziyatga tushgan bo'lsangiz, odatda qanday yo'l tutgan bo'lsangiz, shuni belgilang. Tushmagan bo'lsangiz, o'sha vaziyatda chindan qanday yo'l tutishni xohlashingizni belgilang.",
    "Главное условие достоверного результата данного теста – ваши искренние ответы. Отвечайте искренне, а не с позиции того, кем вы бы хотели быть. Отвечайте так, как вы обычно поступаете (если вы бывали в такой ситуации) или как вам действительно хочется поступить (если ситуация вам не знакома)."
  ],
  questions: [
    { q: ["Mehmonga keldingiz, u yerda 10 dan ortiq odam yig'ilgan. Munosabatingiz:",
         "Вы пришли в гости, где собралось уже более 10 человек. Ваша реакция:"],
      o: [
        ["A", "Ajoyib! Gavjum davralarni yaxshi ko'raman: yayrab suhbatlashaman, yangi tanishlar orttiraman.",
              "Здорово! Люблю большие компании: можно живо пообщаться и завести новых знакомых."],
        ["B", "Davralarni yaxshi ko'raman, ko'pincha diqqat markazida bo'laman. Yo maroqli vaqt o'tkazaman, yo hech bo'lmasa foydali odamlar bilan tanishaman.",
              "Я люблю бывать в компаниях, часто оказываюсь в центре внимания. Или удастся хорошенько зажечь, или уж, на худой конец, с полезными людьми познакомлюсь."],
        ["C", "Biror tanishimni uchratsam, xursand bo'lardim. Hamma notanish bo'lsa, o'zimni noqulay his qilaman.",
              "Надеюсь, что встречу здесь каких-нибудь знакомых, мне будет приятно с ними пообщаться. Если все – незнакомые люди, то мне будет некомфортно."],
        ["D", "Gavjum davralarni unchalik yoqtirmayman, bunday joylarga faqat foydali tanishlar uchun boraman. Bir-ikki kishi bilan sokin suhbatlashish menga yoqimliroq.",
              "Я не очень люблю шумные компании и хожу на такие встречи, только чтобы завести или поддержать полезные знакомства. Мне приятнее посидеть и поговорить с одним-двумя людьми в покое и тишине."]
      ] },
    { q: ["O'sha davrada sizdan so'z aytishni so'rashdi. Munosabatingiz:",
         "На этой же встрече вас попросили выступить с речью. Ваша реакция:"],
      o: [
        ["A", "E'tiborni o'zimga tortishni yoqtirmayman. Rozi ham bo'lmayman, rad ham etmayman, qandaydir yo'l bilan chetlab o'taman.",
              "Я не люблю привлекать к себе внимание, не люблю выступать с речью. Я не буду ни соглашаться, ни отказываться, а просто как-нибудь увильну."],
        ["B", "Men yaxshi hikoyachiman, bir-ikkita qiziq gaplarim bor. Hammaga yoqadi.",
              "Я хороший рассказчик и знаю пару интересных историй. Все будут в восторге."],
        ["C", "So'zga chiqishdan qo'rqmayman, hatto zavqlanaman. Aqlli va o'rinli gap aytaman.",
              "Я не боюсь выступать, даже получаю от этого удовольствие, скажу что-нибудь умное и по делу."],
        ["D", "Ehtimol, biror bahona bilan rad etaman. Lekin ish uchun yaxshi taassurot qoldirish kerak bo'lsa, o'rinli va chiroyli gap ayta olaman.",
              "Я, скорее всего, откажусь под убедительным предлогом. Но если мне надо произвести хорошее впечатление для пользы дела, то могу сказать уместную и красивую речь."]
      ] },
    { q: ["Rahbar sizga va hamkasbingizga topshiriq berdi, lekin mas'ulni belgilamadi. Ikkalangiz bir-biringizga ishonib, topshiriqni unutdingiz. Endi rahbar sizni koyimoqda. Munosabatingiz:",
         "Ваш начальник дал вам и вашему сослуживцу задание, но не назначил ответственного за его выполнение. Вы оба понадеялись друг на друга и забыли про задание. Сейчас ваш начальник ругает вас за невыполнение задания. Ваша реакция:"],
      o: [
        ["A", "Ichimda norozi bo'laman, lekin buni sirtimga chiqarmayman. Endi bu odamlardan nima kutish kerakligini bilaman va keyin ular bilan ehtiyot bo'lib ishlayman.",
              "Негативные эмоции, которые никак не проявляются внешне. Я в состоянии контролировать себя, но теперь я знаю, чего можно ожидать от этих людей, буду осторожнее в работе с ними в будущем."],
        ["B", "Juda ta'sirlanaman, yig'lab yuborishim ham mumkin. Ha, men biroz parishon va vaqtga rioya qilmaydigan odamman, lekin faqat men aybdor emasman. Bu haqda barcha tanishlarimga gapirib beraman.",
              "Очень эмоциональная реакция, возможны слезы у девушки. Ну да, я – рассеянный и не очень пунктуальный человек, но не я один (одна) виноват(а). Буду жаловаться на них всем друзьям и знакомым."],
        ["C", "Hamkasbimdan xafa bo'laman: qanday qilib meni shunday ahvolga soldi! Rahbardan ham xafa bo'laman. Buni uzoq vaqt, ehtimol indamay, ichimda o'ylab yuraman.",
              "Обида на сослуживца. Как он мог так подставить меня! Обида на начальника. Я буду долго переживать из-за этого, скорее всего, молча."],
        ["D", "Rahbarga (yomon boshqargani uchun) va hamkasbga (meni noqulay ahvolga solgani uchun) jahlim chiqadi. Ehtimol, ulardan biriga gapimni aytaman.",
              "Злость на начальника, потому что он безграмотный руководитель, и/или на сослуживца, потому что он меня подставил. Всплеск агрессивных эмоций. Скорее всего, кому-нибудь из них что-нибудь выскажу."]
      ] },
    { q: ["Muhim topshiriq oldingiz. Muddati bir oy, lekin ikki haftada bajarsa bo'ladi. Munosabatingiz:",
         "Вам дали важное задание. Срок выполнения – через месяц, а выполнить его можно за две недели. Ваша реакция:"],
      o: [
        ["A", "Tezroq bajarib topshiraman: rahbar oldida ham yaxshi ko'rinaman, boshqa ishlarga ham vaqt qoladi.",
              "Лучше поскорее выполню задание и сдам его. И в глазах начальства буду хорошо выглядеть, и у меня время для других дел будет."],
        ["B", "Avval qanday yondashishni o'ylab olaman. Erta tugatsam ham darhol topshirmayman: biroz turib, keyin yana xatolarini tuzataman. Ehtimol, muddatdan bir kun oldin topshiraman.",
              "Сначала мне надо подумать, как лучше всего подойти к выполнению этой работы. Даже если сделаю ее заранее, сразу сдавать не буду. Пусть отлежится, потом еще раз исправлю ошибки. Может, сдам работу за день до срока."],
        ["C", "Darhol boshlayman, lekin tez zerikib, boshqa ishga o'tib ketaman. Muddat yaqinlashganda shoshilib tugataman, hatto kechikishim ham mumkin.",
              "Сразу возьмусь за дело. Но, скорее всего, мне быстро надоест эта работа, и я увлекусь другим заданием. Заброшу эту работу до тех пор, пока не наступит крайний срок. Потом срочно буду все доделывать, может, даже опоздаю со сдачей."],
        ["D", "Darhol boshlagim keladi, lekin bunday bo'lmasligini bilaman: doim shoshilinchroq ishlar va chalg'ituvchi narsalar chiqadi. Ehtimol, oxirgi daqiqagacha bajaraman.",
              "Хотелось бы начать делать сразу, но знаю, что так не получится. Всегда есть более срочные или важные дела, все время что-то отвлекает. Скорее всего, буду выполнять задание до последней минуты."]
      ] },
    { q: ["Oldinda uzoq dam olish kunlari. Qayerga borasiz?",
         "Впереди длинные выходные. Вы решили куда-нибудь выбраться. Что вы выберете:"],
      o: [
        ["A", "Qarindoshlarnikiga yoki kunni oilam bilan o'tkazaman.",
              "Съездить в гости к родственникам или иначе провести день с семьей, супругой(м)."],
        ["B", "Parkka yoki do'stlar davrasiga.",
              "Сходить в парк или встретиться с друзьями."],
        ["C", "Do'stlar bilan kartingga yoki futbol o'ynashga.",
              "Съездить на картинг или поиграть в футбол с друзьями."],
        ["D", "Yolg'iz yoki yaqin odamim bilan konsert yoki ko'rgazmaga.",
              "Сходить на концерт или выставку, можно в одиночку или с близким человеком."]
      ] },
    { q: ["Parashutdan sakrashga qaror qilsangiz, sababi nima bo'ladi?",
         "Если бы вы решили прыгнуть с парашютом, то по какой причине:"],
      o: [
        ["A", "Parashut sporti bilan shug'ullanadigan qiziq odamlar bilan tanishdim, ular meni ko'ndirdi.",
              "Я познакомился с очень интересными людьми (человеком), которые занимаются парашютным спортом. Они меня уговорили присоединиться."],
        ["B", "Men uchun muhim maqsadga erishish uchun bundan o'tishim kerak.",
              "Мне необходимо через это пройти для достижения важной для меня цели."],
        ["C", "Xavf va adrenalinni yaxshi ko'raman. Nimaga qodirligimni bilmoqchiman.",
              "Я вообще люблю риск, адреналин. Хочу узнать, на что я способен."],
        ["D", "Meni jimgina, ko'zga tashlanmaydigan odam deb bilishadi. O'zimga ham, boshqalarga ham qo'rqoq va bo'shang emasligimni isbotlamoqchiman.",
              "Меня считают тихоней. Я всегда в тени, отмалчиваюсь. Хочу доказать себе и другим, что я не трус и не тряпка."]
      ] },
    { q: ["Ishda ham, uyda ham ko'proq qaysi gaplarni eshitasiz?",
         "Какие комментарии вы слышите чаще (как на работе, так и дома) в свой адрес:"],
      o: [
        ["A", "\"Tezroq bo'lmaydimi?\", \"Yana cho'zyapsiz!\", \"Bir narsani qachongacha muhokama qilamiz?\"",
              "«А быстрее нельзя?» «Ты опять тянешь время!» «Сколько можно обсуждать одно и то же»."],
        ["B", "\"Iltimos, sekinroq\", \"Yana hammani shoshiltiryapsiz, hech qayerga kechikmayapmiz!\", \"Sizga hammasi tushunarli, menga hali yo'q. Keling, shoshmasdan gaplashib olaylik.\"",
              "«Пожалуйста, помедленнее» «Ты опять всех торопишь, мы никуда не опаздываем!» «Тебе уже все ясно, а мне – еще нет. Давай не торопясь все обсудим»."]
      ] },
    { q: ["Sizni lavozimga ko'tarishga qaror qilishganini bildingiz. Birinchi navbatda nima qilasiz?",
         "Вы узнали, что вас решили повысить по службе. Что вы сделаете прежде всего:"],
      o: [
        ["A", "Oila va yaqinlarimga aytaman, uyda kichik oilaviy dasturxon yozaman.",
              "Сообщите родным и близким о повышении, устроите уютный домашний праздник."],
        ["B", "Yangi lavozimga birinchi kuni munosib ko'rinishda borish uchun o'zimga qimmat narsa olaman (soat, kostyum, mashina).",
              "Купите себе какую-нибудь дорогую вещь, чтобы в достойном виде прибыть на место работы в первый день на новой должности (часы, костюм, машину)."],
        ["C", "Quvonchimni do'stlarim bilan baham ko'raman, ularni yig'ib katta dasturxon yozaman.",
              "Поделитесь радостью с друзьями, соберёте их на большой праздничный ужин."],
        ["D", "Yangi joyda ishlashni boshlamagunimcha xursandchilik qilmayman, pul sarflamayman va hech kimga aytmayman. Axir, buyruq hali imzolanmagan.",
              "Подождете радоваться, сорить деньгами и трезвонить о повышении, пока не начнете работать на новом месте. Ведь еще даже приказ не подписан."]
      ] },
    { q: ["Ertaga imtihon. Nima qilasiz?",
         "У вас завтра экзамен. Ваше поведение:"],
      o: [
        ["A", "Boshqa muhim ishlarimga vaqt qolishi uchun materialni tezda takrorlab chiqaman.",
              "Лучше быстро повторить материал, чтобы осталось время на другие важные для вас дела."],
        ["B", "Tun bo'yi bo'lsa ham, hammasini shoshilmasdan yana bir bor takrorlayman.",
              "Лучше еще раз не спеша все повторить, пускай это даже займет всю ночь."],
        ["C", "Oldindan tayyorlanganman, shuning uchun bosh yangi bo'lishi uchun yaxshilab uxlayman.",
              "Лучше хорошенько отоспаться перед экзаменом, чтобы прийти на него со свежей головой. К экзамену вы готовились заранее."],
        ["D", "Oxirgi kechada tayyorlanib bo'lmaydi. Imtihon haqida umuman o'ylamay, dam olaman.",
              "Перед смертью не надышишься. Лучше вообще не думать об экзамене, а просто отдохнуть."]
      ] },
    { q: ["Sizningcha, g'alaba va muvaffaqiyatning asosiy sharti nima?",
         "Как вы считаете, что является главным для победы, для достижения успеха:"],
      o: [
        ["A", "Har kimning shaxsiy harakati. Har kim o'zi uchun javob berishi, bor kuchini berishi va boshqalarning orqasiga yashirinmasligi kerak.",
              "Личные усилия каждого. Каждый человек должен отвечать за себя, выкладываться по максимуму, не прятаться за спинами других."],
        ["B", "Jamoaviy ish. Odamlar faqat birgalikda, bir-biriga yordam berib, qo'llab-quvvatlab natijaga erishadi.",
              "Главное – командная работа, люди могут добиться чего-либо только вместе, помогая друг другу, поддерживая друг друга."]
      ] },
    { q: ["O'z biznesingizni ochmoqchisiz (muvaffaqiyat va daromad har birida bir xil kafolatlangan). Kasbingizdan qat'i nazar, nimani tanlaysiz?",
         "Если бы вы решили открыть свой бизнес (успех и одинаковая прибыльность гарантированы), что бы вы выбрали (абстрагируйтесь от вашей профессии):"],
      o: [
        ["A", "Moliyaviy konsalting firmasi yoki zararkunandalarga qarshi xizmat.",
              "Фирму финансового консалтинга или фирму по борьбе с вредными насекомыми."],
        ["B", "Qo'riqlash firmasi yoki qurol do'koni.",
              "Охранную фирму или оружейный магазин."],
        ["C", "Restoran yoki to'yxona.",
              "Ресторан или банкетный зал."],
        ["D", "Tibbiyot markazi yoki xayriya xizmatlari byurosi.",
              "Медицинский центр или бюро добрых услуг."]
      ] },
    { q: ["Sizga yangi, keng ofis berildi. Devorlarni nima bilan bezaysiz?",
         "У вас – новый просторный кабинет. Чем вы украсите его стены:"],
      o: [
        ["A", "Mashhur odamlar bilan tushgan suratlarim yoki yorqin zamonaviy rasmlar bilan.",
              "Своими фото с известными людьми или яркими современными картинами."],
        ["B", "Oilam suratlari yoki hamkasblar bilan korporativ tadbirda tushgan guruh suratlari bilan.",
              "Фото супруга(и) и детей или групповыми фото ваших сослуживцев на корпоративе."],
        ["C", "Diplomlar yoki oddiy, neytral rasmlar bilan.",
              "Дипломами или нейтральными картинами."],
        ["D", "Prezident portreti yoki qadimiy qilich bilan.",
              "Портретом президента или старинной саблей."]
      ] },
    { q: ["Kiyimda nimani ko'proq qadrlaysiz?",
         "Что вы цените более всего в одежде?"],
      o: [
        ["A", "Kiyimda o'ziga xoslik, jozibali bir jihat bo'lishi kerak.",
              "В одежде обязательно должна быть какая-нибудь изюминка, кураж."],
        ["B", "Kiyim qimmatbaho va salobatli ko'rinishi kerak.",
              "Одежда должна выглядеть дорого и круто."],
        ["C", "Kiyim qulay bo'lishi kerak.",
              "Одежда должна быть удобной."],
        ["D", "Kiyim sifatli va o'rinli bo'lishi kerak: yoshga, qomatga va vaziyatga mos.",
              "Одежда должна быть качественной и уместной, то есть соответствовать возрасту, фигуре и ситуации, в которой ее надеваешь."]
      ] },
    { q: ["O'zingizni eng qulay his qiladigan va g'alaba qozonish imkoningiz eng yuqori bo'lgan musobaqani tanlang:",
         "Вам надо выбрать соревнование, в котором вам комфортнее всего будет участвовать и где у вас больше шансов на победу. Что вы выберете?"],
      o: [
        ["A", "Tezlik emas, aql baholanadigan yakka musobaqalar (shaxmat, bilyard, shashka).",
              "Индивидуальные соревнования, где оценивается сообразительность, а не быстрота реакции (шахматы, бильярд, шашки)."],
        ["B", "Tezlik va jasorat talab qiladigan yakka musobaqalar (parashyut, avtopoyga, tog' chang'isi).",
              "Индивидуальные соревнования на скорость и смелость (прыжки с парашютом, автогонки, горные лыжи)."],
        ["C", "Jamoaviy, iloji bo'lsa g'ayrioddiy musobaqalar (loyda futbol, korporativ qiziqarli o'yinlar).",
              "Командные соревнования, лучше какие-нибудь необычные (футбол в грязи, всякие корпоративные веселые старты)."],
        ["D", "Butun jamoaning o'zaro yordami talab qilinadigan musobaqalar (universitetlar o'rtasida eng yaxshi robot yaratish).",
              "Командные соревнования, где требуется взаимная поддержка, взаимодействие всей команды (соревнование университетов по созданию лучшего робота, керлинг)."]
      ] },
    { q: ["Sankt-Peterburgda mehmonxona tanlaysiz. Qaysi birini?",
         "Вам надо выбрать гостиницу в Питере. Что вы выберете?"],
      o: [
        ["A", "Markazdagi obro'li mehmonxonani: kishi uyalib qolmasin.",
              "Какую-нибудь приличную гостиницу в центре, чтобы не стыдно было."],
        ["B", "Qandaydir qiziq, noodatiy mini-mehmonxonani.",
              "Какой-нибудь прикольный необычный мини-отель."],
        ["C", "Oldin to'xtagan yoki tanishlar tavsiya qilgan mehmonxonani.",
              "Гостиницу, где раньше останавливался или которую порекомендуют знакомые."],
        ["D", "Narxi va sifati eng mos keladiganini, balki retro uslubdagi eski binoda.",
              "Гостиницу с идеальным соотношением цена/качество. Может быть, в старинном доме в ретростиле."]
      ] }
  ]
};
