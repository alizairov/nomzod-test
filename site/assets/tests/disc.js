/* Shaxsiyat testi (ichkarida: DISC) — onlayn test (UZ / RU). Faqat matnlar: baholash kaliti bu yerda YO'Q, u serverda (kabinet-api/src/index.js).
   Har bir savol: q = [uz, ru]; o = [[harf, uz, ru], ...] (7- va 10-savolda faqat A/B, qolganlarida A/B/C/D).
   Uzbekcha matn eski lotin alifbosida yoziladi; yangi alifboga brauzerda alphabet.js o'giradi (ruscha matnga tegmaydi). */
window.DISC_TEST = {
  id: "disc",
  title: ["Shaxsiyat testi", "Тест личности"],
  time: ["taxminan 10 daqiqa", "около 10 минут"],
  instruction: [
    "Ushbu testning natijasi aniq chiqishi sizning aniq va shaffof javoblaringizga ko'ra bo'ladi. Shuning uchun savollarga samimiy javob bering. Agar shu holatga aynan tushgan bo'lsangiz, savollarga odatdagidek javob bering. Agar bunday holatga tushmagan bo'lsangiz ham, xuddi o'zingizni o'sha vaziyatga tushgandek javob bering.",
    "Главное условие достоверного результата данного теста – ваши искренние ответы. Отвечайте искренне, а не с позиции того, кем вы бы хотели быть. Отвечайте так, как вы обычно поступаете (если вы бывали в такой ситуации) или как вам действительно хочется поступить (если ситуация вам не знакома)."
  ],
  questions: [
    { q: ["Siz mehmonga keldingiz va 10 dan ortiq odam yig'ilgan. Sizning munosabatingiz:",
         "Вы пришли в гости, где собралось уже более 10 человек. Ваша реакция:"],
      o: [
        ["A", "Ajoyib! Menga gavjum davralar yoqadi. Yayrab suhbatlashishim va yangi do'stlar orttirishim mumkin.",
              "Здорово! Люблю большие компании: можно живо пообщаться и завести новых знакомых."],
        ["B", "Men jamoaviy tadbirlarda bo'lishni yaxshi ko'raman va tezda hammaning diqqat markazida bo'lolaman. Yoki maroqli vaqt o'tkazaman yoki hech bo'lmaganda foydali odamlar bilan uchrashaman.",
              "Я люблю бывать в компаниях, часто оказываюсь в центре внимания. Или удастся хорошенько зажечь, или уж, на худой конец, с полезными людьми познакомлюсь."],
        ["C", "Umid qilamanki, men bu yerda birorta tanishlarimni uchrataman, ular bilan muloqot qilish men uchun yoqimli bo'ladi. Agar hamma begona bo'lsa, men o'zimni noqulay his qilaman.",
              "Надеюсь, что встречу здесь каких-нибудь знакомых, мне будет приятно с ними пообщаться. Если все – незнакомые люди, то мне будет некомфортно."],
        ["D", "Men gavjum guruhlarda bo'lishni uncha yoqtirmayman va bunday yig'inlarga faqat foydali munosabatlar o'rnatish yoki saqlab qolish uchun boraman. Menga bir-ikki kishi bilan tinch va sokin joyda o'tirib, suhbatlashish yoqimliroq.",
              "Я не очень люблю шумные компании и хожу на такие встречи, только чтобы завести или поддержать полезные знакомства. Мне приятнее посидеть и поговорить с одним-двумя людьми в покое и тишине."]
      ] },
    { q: ["Xuddi shu davrada sizdan so'z aytishni so'rashdi. Sizning munosabatingiz:",
         "На этой же встрече вас попросили выступить с речью. Ваша реакция:"],
      o: [
        ["A", "Menga so'z berishganda o'zimga e'tiborni jalb qilishni yoqtirmayman. Men rozi bo'lmayman ham, rad etmayman ham, lekin nimadir qilib undan qochishga harakat qilaman.",
              "Я не люблю привлекать к себе внимание, не люблю выступать с речью. Я не буду ни соглашаться, ни отказываться, а просто как-нибудь увильну."],
        ["B", "Men yaxshi hikoyachiman va bir nechta ajoyib gaplarni bilaman. Hamma bundan xursand bo'ladi.",
              "Я хороший рассказчик и знаю пару интересных историй. Все будут в восторге."],
        ["C", "Men so'zga chiqishdan qo'rqmayman, hatto undan zavqlanaman, aqlli va aniq bir narsa aytaman.",
              "Я не боюсь выступать, даже получаю от этого удовольствие, скажу что-нибудь умное и по делу."],
        ["D", "Katta ehtimol bilan ishonarli bahona bilan rad etaman. Ammo agar men biznes manfaati uchun yaxshi taassurot qoldirishim kerak bo'lsa, unda men mos keladigan, aniq gaplarni ayta olaman.",
              "Я, скорее всего, откажусь под убедительным предлогом. Но если мне надо произвести хорошее впечатление для пользы дела, то могу сказать уместную и красивую речь."]
      ] },
    { q: ["Boshlig'ingiz sizga va hamkasbingizga topshiriq bergan, lekin uning bajarilishi uchun mas'ul shaxsni tayinlamagan. Ikkalangiz bir-biringizga ishondingiz va vazifani unutdingiz. Endi xo'jayiningiz vazifani bajarmaganingiz uchun sizga tanbeh bermoqda. Sizning munosabatingiz:",
         "Ваш начальник дал вам и вашему сослуживцу задание, но не назначил ответственного за его выполнение. Вы оба понадеялись друг на друга и забыли про задание. Сейчас ваш начальник ругает вас за невыполнение задания. Ваша реакция:"],
      o: [
        ["A", "Salbiy his-tuyg'ularimni ochiq ko'rsatmayman. Men o'zimni nazorat qila oladigan holatdaman, lekin endi bu odamlardan nima kutish kerakligini bilaman, kelajakda ular bilan ishlashda ehtiyotkor bo'laman.",
              "Негативные эмоции, которые никак не проявляются внешне. Я в состоянии контролировать себя, но теперь я знаю, чего можно ожидать от этих людей, буду осторожнее в работе с ними в будущем."],
        ["B", "Juda kuchli reaksiya, ko'z yoshi qilishim ham mumkin. Ha, men punktual odam emasman, lekin aybdor faqat men emasman. Men ular haqida barcha do'stlarim va tanishlarimga shikoyat qilaman.",
              "Очень эмоциональная реакция, возможны слезы у девушки. Ну да, я – рассеянный и не очень пунктуальный человек, но не я один (одна) виноват(а). Буду жаловаться на них всем друзьям и знакомым."],
        ["C", "Hamkasbimga nisbatan norozilik his qilaman. Qanday qilib u meni shunday holatga soldi! Rahbarga nisbatan norozilik. Men buni ichimga yutaman va uzoq vaqt bu haqida o'ylab yuraman.",
              "Обида на сослуживца. Как он мог так подставить меня! Обида на начальника. Я буду долго переживать из-за этого, скорее всего, молча."],
        ["D", "Rahbarga nisbatan savodsiz rahbar bo'lgani uchun va hamkasbimdan meni noqulay holatga solgani uchun g'azablanaman. Agressiv his-tuyg'ularimni ko'rsataman. Katta ehtimol bilan ulardan biriga nimadir deb noroziligimni bildiraman.",
              "Злость на начальника, потому что он безграмотный руководитель, и/или на сослуживца, потому что он меня подставил. Всплеск агрессивных эмоций. Скорее всего, кому-нибудь из них что-нибудь выскажу."]
      ] },
    { q: ["Sizga muhim vazifa berildi. Muddati bir oy, lekin u ikki hafta ichida tugatilishi mumkin. Sizning munosabatingiz:",
         "Вам дали важное задание. Срок выполнения – через месяц, а выполнить его можно за две недели. Ваша реакция:"],
      o: [
        ["A", "Men vazifani imkon qadar tezroq bajarib topshirsam yaxshi bo'lardi. Boshliqlarimning ko'ziga ham yaxshi ko'rinaman va boshqa ishlarga vaqtim bo'ladi.",
              "Лучше поскорее выполню задание и сдам его. И в глазах начальства буду хорошо выглядеть, и у меня время для других дел будет."],
        ["B", "Avval bu ishga qanday yondashish haqida o'ylashim kerak. Oldindan qilsam ham, uni darhol topshirmayman. Dam olaman, keyin xatolarni yana tuzataman. Ehtimol, muddatidan bir kun oldin ishni topshirarman.",
              "Сначала мне надо подумать, как лучше всего подойти к выполнению этой работы. Даже если сделаю ее заранее, сразу сдавать не буду. Пусть отлежится, потом еще раз исправлю ошибки. Может, сдам работу за день до срока."],
        ["C", "Men darhol ish bilan shug'ullanaman. Ammo, katta ehtimol bilan, men bu ishdan tezda zerikaman va boshqa vazifaga berilib ketaman. Muddati kelguncha bu ishni qoldiraman. Keyin men zudlik bilan hamma narsani oxirgi daqiqada tugataman va katta ehtimol bilan ishni topshirishga kechikib qolaman.",
              "Сразу возьмусь за дело. Но, скорее всего, мне быстро надоест эта работа, и я увлекусь другим заданием. Заброшу эту работу до тех пор, пока не наступит крайний срок. Потом срочно буду все доделывать, может, даже опоздаю со сдачей."],
        ["D", "Men buni darhol boshlashni xohlayman, lekin bilamanki, bunday bo'lmaydi. Har doim qilish kerak bo'lgan shoshilinch yoki muhimroq narsalar bor va har doim chalg'itadigan narsalar mavjud. Katta ehtimol bilan oxirgi daqiqagacha topshiriqni bajaraman.",
              "Хотелось бы начать делать сразу, но знаю, что так не получится. Всегда есть более срочные или важные дела, все время что-то отвлекает. Скорее всего, буду выполнять задание до последней минуты."]
      ] },
    { q: ["Oldinda uzoq dam olish kunlari. Siz biror joyga borishga qaror qilasiz. Siz nimani tanlaysiz:",
         "Впереди длинные выходные. Вы решили куда-нибудь выбраться. Что вы выберете:"],
      o: [
        ["A", "Qarindoshlarnikiga borasiz yoki kunni oilangiz (yoki turmush o'rtog'ingiz) bilan o'tkazasiz.",
              "Съездить в гости к родственникам или иначе провести день с семьей, супругой(м)."],
        ["B", "Parkka sayrga yoki do'stlar davrasiga borasiz.",
              "Сходить в парк или встретиться с друзьями."],
        ["C", "Do'stlar bilan kartingga borasiz yoki futbol o'ynaysiz.",
              "Съездить на картинг или поиграть в футбол с друзьями."],
        ["D", "Konsert yoki ko'rgazmaga yolg'iz yoki yaqinlaringiz bilan borishingiz mumkin.",
              "Сходить на концерт или выставку, можно в одиночку или с близким человеком."]
      ] },
    { q: ["Agar siz parashut bilan sakrashga qaror qilsangiz, unda bunga sabab nima bo'ladi?",
         "Если бы вы решили прыгнуть с парашютом, то по какой причине:"],
      o: [
        ["A", "Men parashut bilan shug'ullanadigan juda qiziqarli odamlarni (shaxslarni) uchratdim. Ular meni qo'shilishga ko'ndirishdi.",
              "Я познакомился с очень интересными людьми (человеком), которые занимаются парашютным спортом. Они меня уговорили присоединиться."],
        ["B", "Men uchun muhim bo'lgan maqsadga erishish uchun buni qilib ko'rishim kerak.",
              "Мне необходимо через это пройти для достижения важной для меня цели."],
        ["C", "Menga umuman xavf va adrenalin yoqadi. Men nimaga qodir ekanligimni bilmoqchiman.",
              "Я вообще люблю риск, адреналин. Хочу узнать, на что я способен."],
        ["D", "Meni sokin odam deb hisoblashadi. Men doim soyadaman, sukut saqlayman. Men o'zimga va boshqalarga qo'rqoq yoki bo'shang emasligimni isbotlamoqchiman.",
              "Меня считают тихоней. Я всегда в тени, отмалчиваюсь. Хочу доказать себе и другим, что я не трус и не тряпка."]
      ] },
    { q: ["Siz (ishda ham, uyda ham) qanday izohlarni tez-tez eshitasiz?",
         "Какие комментарии вы слышите чаще (как на работе, так и дома) в свой адрес:"],
      o: [
        ["A", "\"Bu ishni tezroq amalga oshirish mumkinmasmi?\" \"Siz yana vaqtni cho'zyapsiz!\" \"Bir xil narsani yana qachongacha muhokama qilishimiz mumkin?\"",
              "«А быстрее нельзя?» «Ты опять тянешь время!» «Сколько можно обсуждать одно и то же»."],
        ["B", "\"Iltimos, sekinlashtiring\" \"Yana hammani shoshiltiryapsiz, biz kechikmaymiz!\" \"Sizga hamma narsa allaqachon tushunarli, lekin men uchun hali barchasi aniq emas. Keling, vaqt ajratamiz va hamma narsani muhokama qilamiz.\"",
              "«Пожалуйста, помедленнее» «Ты опять всех торопишь, мы никуда не опаздываем!» «Тебе уже все ясно, а мне – еще нет. Давай не торопясь все обсудим»."]
      ] },
    { q: ["Ular sizni lavozimingizni oshirishga qaror qilishganini bilib qoldingiz. Eng avvalo nima qilasiz:",
         "Вы узнали, что вас решили повысить по службе. Что вы сделаете прежде всего:"],
      o: [
        ["A", "O'z oilangiz va do'stlaringizni bu yangilik haqida xabardor qilish, uyda kichik oilaviy dasturxon yozish.",
              "Сообщите родным и близким о повышении, устроите уютный домашний праздник."],
        ["B", "O'zingizga qimmatbaho buyum sotib olish, shunda siz yangi lavozimda birinchi ish kuningizda (soat, kostyum, mashina) ish joyingizga munosib shaklda kelishingiz mumkin.",
              "Купите себе какую-нибудь дорогую вещь, чтобы в достойном виде прибыть на место работы в первый день на новой должности (часы, костюм, машину)."],
        ["C", "Do'stlaringiz bilan birga quvonchni baham ko'rasiz, ularni yig'ib, katta dasturxon yozasiz.",
              "Поделитесь радостью с друзьями, соберёте их на большой праздничный ужин."],
        ["D", "Yangi joyda ishlashni rasman boshlamaguningizcha vaqtli xursand bo'lmaysiz, pulni behuda sarflash va ko'tarilish haqida gapirishga shoshmay turasiz. Axir, buyruq hali imzolanmagan.",
              "Подождете радоваться, сорить деньгами и трезвонить о повышении, пока не начнете работать на новом месте. Ведь еще даже приказ не подписан."]
      ] },
    { q: ["Ertaga imtihoningiz bor. Sizning xatti-harakatingiz:",
         "У вас завтра экзамен. Ваше поведение:"],
      o: [
        ["A", "Siz uchun muhim bo'lgan boshqa narsalarga vaqtingiz bo'lishi uchun materialni tezda ko'rib chiqish yaxshiroq.",
              "Лучше быстро повторить материал, чтобы осталось время на другие важные для вас дела."],
        ["B", "Tun bo'yi davom etsa ham, hamma narsani asta-sekin takrorlash yaxshiroq.",
              "Лучше еще раз не спеша все повторить, пускай это даже займет всю ночь."],
        ["C", "Imtihonga miyani dam oldirib kelishingiz uchun imtihon oldidan yaxshi uxlash yaxshiroq. Siz imtihonga oldindan tayyorgarlik ko'rgansiz.",
              "Лучше хорошенько отоспаться перед экзаменом, чтобы прийти на него со свежей головой. К экзамену вы готовились заранее."],
        ["D", "Oxirgi kechada tayyorlanib bo'lmaydi. Imtihon haqida umuman o'ylamay, dam olib, ko'ngil ochgan yaxshi.",
              "Перед смертью не надышишься. Лучше вообще не думать об экзамене, а просто отдохнуть."]
      ] },
    { q: ["Sizningcha, g'alaba qozonish, muvaffaqiyatga erishish uchun asosiy narsa nima?",
         "Как вы считаете, что является главным для победы, для достижения успеха:"],
      o: [
        ["A", "Har kimning shaxsiy harakatlari. Har bir inson o'zi uchun mas'ul bo'lishi, qo'lidan kelganini berishi va boshqalarning soyasiga yashirinmasligi kerak.",
              "Личные усилия каждого. Каждый человек должен отвечать за себя, выкладываться по максимуму, не прятаться за спинами других."],
        ["B", "Asosiysi - jamoaviy ish, odamlar birgalikda, bir-biriga yordam berish, bir-birini qo'llab-quvvatlash orqali hamma narsaga erisha oladi.",
              "Главное – командная работа, люди могут добиться чего-либо только вместе, помогая друг другу, поддерживая друг друга."]
      ] },
    { q: ["Agar siz o'z biznesingizni ochishga qaror qilsangiz (muvaffaqiyat va teng rentabellik kafolatlanadi), nimani tanlagan bo'lardingiz?",
         "Если бы вы решили открыть свой бизнес (успех и одинаковая прибыльность гарантированы), что бы вы выбрали (абстрагируйтесь от вашей профессии):"],
      o: [
        ["A", "Moliyaviy konsalting firmasi yoki zararkunandalarga qarshi kurashuvchi firma.",
              "Фирму финансового консалтинга или фирму по борьбе с вредными насекомыми."],
        ["B", "Xavfsizlik kompaniyasi yoki qurol do'koni.",
              "Охранную фирму или оружейный магазин."],
        ["C", "Restoran yoki to'yxona.",
              "Ресторан или банкетный зал."],
        ["D", "Tibbiyot markazi yoki xayriya xizmatlari byurosi.",
              "Медицинский центр или бюро добрых услуг."]
      ] },
    { q: ["Sizning yangi keng ofisingiz bor. Uning devorlarini qanday bezash kerak:",
         "У вас – новый просторный кабинет. Чем вы украсите его стены:"],
      o: [
        ["A", "Mashhur odamlar bilan, suratlaringiz yoki yorqin zamonaviy rasmlaringiz.",
              "Своими фото с известными людьми или яркими современными картинами."],
        ["B", "Turmush o'rtog'ingiz va farzandlaringizning fotosuratlari yoki korporativ tadbirdagi hamkasblaringizning guruh fotosuratlari.",
              "Фото супруга(и) и детей или групповыми фото ваших сослуживцев на корпоративе."],
        ["C", "Diplomlar yoki neytral rasmlar.",
              "Дипломами или нейтральными картинами."],
        ["D", "Prezident portreti yoki qadimiy qilich.",
              "Портретом президента или старинной саблей."]
      ] },
    { q: ["Kiyimda nimani ko'proq qadrlaysiz?",
         "Что вы цените более всего в одежде?"],
      o: [
        ["A", "Kiyimda qandaydir ajralib turadigan farqi, viqor bo'lishi kerak.",
              "В одежде обязательно должна быть какая-нибудь изюминка, кураж."],
        ["B", "Kiyimlar qimmat va chiroyli ko'rinishi kerak.",
              "Одежда должна выглядеть дорого и круто."],
        ["C", "Kiyimlar qulay bo'lishi kerak.",
              "Одежда должна быть удобной."],
        ["D", "Kiyim yuqori sifatli va qomatga mos bo'lishi kerak, ya'ni siz kiygan kiyim yosh, figura va vaziyatga mos kelishi kerak.",
              "Одежда должна быть качественной и уместной, то есть соответствовать возрасту, фигуре и ситуации, в которой ее надеваешь."]
      ] },
    { q: ["Siz ishtirok etishda o'zingizni eng qulay his qiladigan va g'alaba qozonish imkoniyati eng yuqori bo'lgan musobaqani tanlashingiz kerak. Siz nimani tanlaysiz?",
         "Вам надо выбрать соревнование, в котором вам комфортнее всего будет участвовать и где у вас больше шансов на победу. Что вы выберете?"],
      o: [
        ["A", "Reaksiya tezligi emas, balki aql-zakovat baholanadigan individual musobaqalar (shaxmat, bilyard, shashka).",
              "Индивидуальные соревнования, где оценивается сообразительность, а не быстрота реакции (шахматы, бильярд, шашки)."],
        ["B", "Tezlik va jasorat uchun individual musobaqalar (parashyutdan sakrash, avtopoyga, tog' chang'isi).",
              "Индивидуальные соревнования на скорость и смелость (прыжки с парашютом, автогонки, горные лыжи)."],
        ["C", "Jamoa musobaqalari, yaxshisi g'ayrioddiy narsalar (loydagi futbol, har xil korporativ qiziqarli musobaqalar).",
              "Командные соревнования, лучше какие-нибудь необычные (футбол в грязи, всякие корпоративные веселые старты)."],
        ["D", "Butun jamoaning o'zaro yordami va o'zaro ta'sirini talab qiladigan jamoaviy musobaqalar (eng yaxshi robotni yaratish bo'yicha universitet musobaqasi)",
              "Командные соревнования, где требуется взаимная поддержка, взаимодействие всей команды (соревнование университетов по созданию лучшего робота, керлинг)."]
      ] },
    { q: ["Sankt-Peterburgda mehmonxona tanlash kerak. Siz nimani tanlaysiz?",
         "Вам надо выбрать гостиницу в Питере. Что вы выберете?"],
      o: [
        ["A", "Uyalib qolmaslik uchun markazda yaxshi mehmonxona.",
              "Какую-нибудь приличную гостиницу в центре, чтобы не стыдно было."],
        ["B", "Qandaydir ajoyib noodatiy mini-mehmonxona.",
              "Какой-нибудь прикольный необычный мини-отель."],
        ["C", "Siz ilgari tashrif buyurgan yoki do'stlaringiz tavsiya qilgan mehmonxona.",
              "Гостиницу, где раньше останавливался или которую порекомендуют знакомые."],
        ["D", "Ideal, narxi sifatiga mos mehmonxona. Ehtimol, retro uslubidagi eski uyda.",
              "Гостиницу с идеальным соотношением цена/качество. Может быть, в старинном доме в ретростиле."]
      ] }
  ]
};
