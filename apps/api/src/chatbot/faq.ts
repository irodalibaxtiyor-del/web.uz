import type { ChatLink } from '@webdizayn/shared';

export interface FaqEntry {
  id: string;
  /** Shown as a suggestion button; also searched. */
  question: string;
  /** Other ways people ask the same thing (searched with the question's weight). */
  ask: string[];
  answer: string;
  links: ChatLink[];
}

/**
 * How the platform works, in plain Uzbek. Only states what the platform actually does —
 * anything not covered here (prices, schedules, personal accounts) goes to the administrator.
 */
export const FAQ: FaqEntry[] = [
  {
    id: 'greeting',
    question: 'Salom',
    ask: ['assalomu alaykum', 'salom', 'hello', 'hi', 'привет', 'здравствуйте'],
    answer:
      'Assalomu alaykum! Men WEBDIZAYN.UZ yordamchisiman. Platformadan foydalanish, kurslar va yo‘nalishlar haqida so‘rashingiz mumkin.',
    links: [],
  },
  {
    id: 'thanks',
    question: 'Rahmat',
    ask: ['rahmat', 'katta rahmat', 'tashakkur', 'спасибо', 'thanks'],
    answer: 'Arzimaydi! Yana savolingiz bo‘lsa, yozavering.',
    links: [],
  },
  {
    id: 'register',
    question: 'Qanday ro‘yxatdan o‘taman?',
    ask: ['ro‘yxatdan o‘tish', 'akkaunt ochish', 'hisob yaratish', 'registratsiya', 'sign up'],
    answer:
      '“Ro‘yxatdan o‘tish” sahifasida ismingiz, emailingiz va parolingizni kiriting. Shundan keyin kurslarga yozilishingiz mumkin.\n\nAgar o‘qish joyingiz (guruhingiz) platformada bo‘lsa, administrator sizga tayyor login va vaqtinchalik parol beradi — u holda alohida ro‘yxatdan o‘tish shart emas.',
    links: [
      { label: 'Ro‘yxatdan o‘tish', href: '/register' },
      { label: 'Kirish', href: '/login' },
    ],
  },
  {
    id: 'login',
    question: 'Qanday kiraman?',
    ask: ['tizimga kirish', 'login qilish', 'kira olmayapman', 'login nima', 'kirish'],
    answer:
      '“Kirish” sahifasida login (masalan familiya.ism) yoki email va parolingizni kiriting. Administrator bergan vaqtinchalik parol bilan birinchi marta kirganingizda yangi parol o‘ylab topishingiz so‘raladi.\n\nBir necha marta noto‘g‘ri parol kiritilsa, kirish 15 daqiqaga to‘xtatiladi.',
    links: [{ label: 'Kirish', href: '/login' }],
  },
  {
    id: 'forgot-password',
    question: 'Parolimni unutdim',
    ask: ['parolni tiklash', 'parol esimdan chiqdi', 'parolni unutdim', 'parol yo‘qoldi'],
    answer:
      'Platformada parolni email orqali tiklash hozircha yo‘q. Parolni administrator yoki o‘qituvchingiz tiklab beradi: ular sizga yangi vaqtinchalik parol beradi, kirganingizdan keyin uni o‘zingiznikiga almashtirasiz.\n\nAdministratorga shu chat orqali ham yozishingiz mumkin.',
    links: [],
  },
  {
    id: 'change-password',
    question: 'Parolni qanday almashtiraman?',
    ask: ['parolni o‘zgartirish', 'yangi parol', 'parol almashtirish'],
    answer:
      'Tizimga kirgan holda “Parolni almashtirish” sahifasini oching: joriy parolingizni va yangisini kiriting. Boshqa qurilmalardagi sessiyalar yopiladi.',
    links: [{ label: 'Parolni almashtirish', href: '/change-password' }],
  },
  {
    id: 'enroll',
    question: 'Kursga qanday yozilaman?',
    ask: ['kursga yozilish', 'kursni boshlash', 'kursga kirish', 'darsni boshlash', 'kurs tanlash'],
    answer:
      '1. “Yo‘nalishlar” sahifasidan kerakli yo‘nalishni, so‘ng kursni tanlang.\n2. Kurs sahifasida “Kirish va boshlash” (akkauntingiz bo‘lmasa — “Ro‘yxatdan o‘tish”) tugmasini bosing.\n3. Kurs xaritasida “Kursga yozilish”ni bosing — birinchi dars ochiladi.\n\nGuruhingizni administrator kursga yozgan bo‘lsa, kurs kabinetingizda o‘zi chiqadi.',
    links: [
      { label: 'Yo‘nalishlar', href: '/yonalishlar' },
      { label: 'Kabinet', href: '/dashboard' },
    ],
  },
  {
    id: 'where-to-start',
    question: 'Qaysi yo‘nalishdan boshlash kerak?',
    ask: [
      'nimadan boshlay',
      'yangi boshlovchi',
      'noldan o‘rganish',
      'qaysi kursdan boshlash',
      'tartib',
      'birinchi qaysi kurs',
    ],
    answer:
      'Agar endi boshlayotgan bo‘lsangiz, tavsiya etilgan tartib: HTML → CSS → JavaScript. Keyin moslashuvchan dizayn, Flexbox va Grid, Bootstrap yoki PHP kabi yo‘nalishlarga o‘tasiz.\n\nKurslar katalogda shu tartibda joylashgan.',
    links: [
      { label: 'Yo‘nalishlar', href: '/yonalishlar' },
      { label: 'HTML yo‘nalishi', href: '/yonalishlar/html' },
    ],
  },
  {
    id: 'directions',
    question: 'Qanday yo‘nalishlar bor?',
    ask: [
      'yo‘nalishlar ro‘yxati',
      'barcha kurslar',
      'katalog',
      'qanday kurslar bor',
      'kurslar ro‘yxati',
    ],
    answer:
      'Platformada HTML, CSS va bezash, JavaScript, Flexbox va Grid, Moslashuvchan dizayn, UI asoslari, Figma’dan kodga, Portfolio, Bootstrap va PHP yo‘nalishlari bor. Har birida bir yoki bir nechta kurs.',
    links: [{ label: 'Barcha yo‘nalishlar', href: '/yonalishlar' }],
  },
  {
    id: 'locked',
    question: 'Nega dars yopiq?',
    ask: ['dars ochilmayapti', 'qulf', 'keyingi dars', 'dars yopiq', 'darsga kira olmayapman'],
    answer:
      'Darslar ketma-ket ochiladi: keyingi dars oldingisi tugatilgandan keyin ochiladi. Darsda mashq yoki test bo‘lsa, dars barcha mashqlar “O‘tdi” va testlar o‘tilgandan keyin avtomatik tugaydi. Mashqsiz darsda “Darsni tugatdim” tugmasini bosing.\n\nKurs xaritasida qaysi darslar tugagani va qaysi biri navbatda ekani ko‘rinadi.',
    links: [{ label: 'Kabinet', href: '/dashboard' }],
  },
  {
    id: 'check',
    question: 'Mashq qanday tekshiriladi?',
    ask: [
      'tekshirish tugmasi',
      'mashqni topshirish',
      'check',
      'mashq o‘tmadi',
      'o‘tdi deb chiqmayapti',
    ],
    answer:
      'Mashq sahifasida kodni yozing va “Tekshirish”ni bosing. Server saqlangan kodingizni haqiqiy brauzerda ochib, topshiriq shartlarini tekshiradi. Natija: “O‘tdi” yoki “Tuzatish kerak” — qaysi shart bajarilmagani va maslahat ko‘rsatiladi. Ba’zi shartlar yashirin bo‘ladi, shuning uchun topshiriqni to‘liq bajaring.\n\n“Vaqt tugadi” chiqsa, kodda cheksiz sikl bo‘lishi mumkin.',
    links: [],
  },
  {
    id: 'run',
    question: 'RUN va Tekshirish farqi nima?',
    ask: ['run tugmasi', 'natijani ko‘rish', 'preview', 'ishga tushirish', 'konsol'],
    answer:
      '“RUN” kodingizni darhol brauzerda ko‘rsatadi (natija oynasi va konsol) — bu faqat o‘zingiz uchun, baho emas. “Tekshirish” esa rasmiy tekshiruv: u serverda bajariladi va mashq holatini (“O‘tdi”) belgilaydi.\n\nRUN oynasida tashqi saytlarga so‘rov yuborib bo‘lmaydi — bu xavfsizlik uchun.',
    links: [{ label: 'Playground', href: '/playground' }],
  },
  {
    id: 'tutor',
    question: 'AI yordamchi nima qiladi?',
    ask: ['ai tutor', 'sun’iy intellekt', 'maslahat olish', 'yordam olish', 'hint'],
    answer:
      'Mashq va topshiriq sahifalaridagi AI yordamchi xatoni tushuntiradi, kodni izohlaydi va bosqichma-bosqich maslahat beradi (3 bosqichgacha). U tayyor yechim bermaydi va baho qo‘ymaydi. Kerak bo‘lsa, “O‘qituvchiga murojaat” tugmasi bilan savolingizni o‘qituvchiga yuborishingiz mumkin.',
    links: [],
  },
  {
    id: 'assignment',
    question: 'Topshiriqni qanday topshiraman?',
    ask: ['topshiriq yuborish', 'uy vazifasi', 'loyiha topshirish', 'muddat', 'urinishlar'],
    answer:
      'Topshiriq sahifasida kodni yozing (qoralama saqlanadi) va “Topshirish”ni bosing — har topshirish alohida versiya bo‘lib saqlanadi. Muddat va urinishlar soni sahifada ko‘rsatilgan. O‘qituvchi javobingizni ko‘rib chiqadi: ball qo‘yadi yoki izoh bilan qayta ishlashni so‘raydi — bu holda yana topshirishingiz mumkin.',
    links: [],
  },
  {
    id: 'quiz',
    question: 'Testni qayta topshirsa bo‘ladimi?',
    ask: ['test', 'test natijasi', 'test o‘tmadi', 'quiz', 'savollar'],
    answer:
      'Ha, testni qayta yechish mumkin (10 daqiqada 10 urinishgacha). Kurs testlarida o‘tish chegarasi odatda 70%. Natijada nechta javob to‘g‘riligi ko‘rsatiladi, lekin qaysi savol xato ekani aytilmaydi — darsni qayta ko‘rib chiqing. Bir marta o‘tgan test keyingi urinishlardan “o‘tmagan”ga qaytmaydi.',
    links: [],
  },
  {
    id: 'results',
    question: 'Natijalarimni qayerda ko‘raman?',
    ask: ['progress', 'baholar', 'ballarim', 'statistika', 'natija'],
    answer:
      '“Natijalarim” sahifasida kurslar bo‘yicha progress foizi, mashqlar, testlar, topshiriqlar bahosi va haftalik faolligingiz ko‘rinadi. Topshiriq bo‘yicha ball va o‘qituvchi izohi topshiriq sahifasining o‘zida ham bor.',
    links: [{ label: 'Natijalarim', href: '/analytics' }],
  },
  {
    id: 'portfolio',
    question: 'Portfolio nima?',
    ask: ['portfolio yaratish', 'ishlarimni ko‘rsatish', 'rezyume', 'portfolio e’lon qilish'],
    answer:
      'Portfolio — bajargan ishlaringiz sahifasi. Unga “O‘tdi” bo‘lgan mashqlar va baholangan topshiriqlarni qo‘shasiz; tugatilgan kurslar va yutuqlar o‘zi chiqadi. Portfolio boshida yashirin: manzil (slug) tanlab “E’lon qilish”ni bosganingizdan keyin havolani boshqalarga yuborishingiz mumkin. Email va ballaringiz ochiq sahifada ko‘rinmaydi.',
    links: [{ label: 'Portfolio', href: '/portfolio' }],
  },
  {
    id: 'certificate',
    question: 'Sertifikat beriladimi?',
    ask: ['sertifikat', 'diplom', 'guvohnoma', 'certificate'],
    answer:
      'Hozircha platformada sertifikat berilmaydi. Tugatilgan kurslar va yutuqlaringiz portfolioda ko‘rinadi — uni e’lon qilib, havolasini ish beruvchiga yuborishingiz mumkin.',
    links: [{ label: 'Portfolio', href: '/portfolio' }],
  },
  {
    id: 'books',
    question: 'Elektron darslik qayerda?',
    ask: ['kitob', 'darslik', 'pdf', 'kitob o‘qish', 'kitobni yuklab olish'],
    answer:
      '“Elektron darslik” bo‘limida kitoblarni sayt ichida, varaqlanadigan kitob ko‘rinishida o‘qiysiz. Bu bo‘lim tizimga kirgan foydalanuvchilar uchun. Kitoblarni yuklab olib bo‘lmaydi; qaysi betda to‘xtaganingiz eslab qolinadi.',
    links: [{ label: 'Elektron darslik', href: '/kitoblar' }],
  },
  {
    id: 'playground',
    question: 'Ro‘yxatdan o‘tmasdan kod yozsa bo‘ladimi?',
    ask: ['playground', 'kod sinash', 'bepul sinab ko‘rish', 'onlayn muharrir'],
    answer:
      'Ha. “Playground” sahifasida HTML, CSS va JavaScript yozib, natijani darhol ko‘rasiz — login shart emas. Kod faqat shu brauzerda saqlanadi. Mashqlar, tekshiruv va progress uchun esa ro‘yxatdan o‘tish kerak.',
    links: [{ label: 'Playground', href: '/playground' }],
  },
  {
    id: 'php',
    question: 'PHP kodini platformada bajarsa bo‘ladimi?',
    ask: ['php', 'server kodi', 'php ishlatish'],
    answer:
      'Yo‘q, platforma PHP kodini bajarmaydi. PHP kursi nazariya va har darsdagi testlardan iborat; amaliy mashqlarni o‘z kompyuteringizda (PHP 8.3) bajarasiz — darsda kutilgan natija berilgan.',
    links: [{ label: 'PHP yo‘nalishi', href: '/yonalishlar/php' }],
  },
  {
    id: 'bootstrap-cdn',
    question: 'Bootstrap mashqlarda ishlaydimi?',
    ask: ['bootstrap cdn', 'kutubxona ulash', 'jquery', 'bootstrap ishlamayapti'],
    answer:
      'Ha. Odatiy CDN havolasini yozing (masalan Bootstrap 5.3.8, 4.6.2 yoki 3.4.1, jQuery 3.7.1) — platforma o‘zidagi nusxasini ulaydi. Boshqa tashqi fayllar (rasmlar, shriftlar, boshqa versiyalar) xavfsizlik uchun yuklanmaydi.',
    links: [{ label: 'Bootstrap yo‘nalishi', href: '/yonalishlar/bootstrap' }],
  },
  {
    id: 'mobile',
    question: 'Telefonda o‘qisa bo‘ladimi?',
    ask: ['telefon', 'mobil', 'planshet', 'qorong‘i rejim', 'dark mode'],
    answer:
      'Ha, platforma telefon va planshetda ishlaydi. Darslarni, testlarni va elektron darslikni telefonda bemalol o‘qiysiz; kod yozish uchun esa kompyuter qulayroq. Qorong‘i rejim qurilmangiz sozlamasiga qarab o‘zi yoqiladi.',
    links: [],
  },
  {
    id: 'logout',
    question: 'Qanday chiqaman?',
    ask: ['chiqish', 'logout', 'akkauntdan chiqish', 'sessiyani yopish'],
    answer:
      'Yuqoridagi “Shaxsiy kabinet” (yoki ismingiz) menyusini oching va “Chiqish”ni tanlang. Umumiy kompyuterda doim chiqib keting.',
    links: [],
  },
  {
    id: 'teacher-course',
    question: 'O‘qituvchi kursni qanday yaratadi?',
    ask: ['kurs yaratish', 'o‘qituvchi', 'dars qo‘shish', 'mashq yaratish', 'kursni boshqarish'],
    answer:
      'O‘qituvchi kabinetda “+ Yangi kurs”ni bosadi, so‘ng “Boshqarish” sahifasida modul va darslar, mashqlar (tekshiruv shartlari bilan), testlar va topshiriqlar qo‘shadi va kursni e’lon qiladi. O‘qituvchi akkauntini va kurslarga biriktirishni tashkilot administratori beradi.',
    links: [{ label: 'Kabinet', href: '/dashboard' }],
  },
  {
    id: 'groups',
    question: 'Guruhim natijalarini qayerda ko‘raman?',
    ask: ['guruh', 'guruh paneli', 'talabalar natijasi', 'excel', 'eksport'],
    answer:
      'Guruhga biriktirilgan o‘qituvchi kabinetning yon menyusidagi “Guruh paneli”da talabalarning progressi, tekshiruvlari, testlari va ballarini ko‘radi va Excel’ga yuklab oladi. Guruhlarni va talabalar loginlarini tashkilot administratori boshqaradi.',
    links: [{ label: 'Kabinet', href: '/dashboard' }],
  },
  {
    id: 'contact',
    question: 'Administrator bilan qanday bog‘lanaman?',
    ask: [
      'admin',
      'administrator',
      'bog‘lanish',
      'aloqa',
      'gaplashish',
      'murojaat',
      'shikoyat',
      'operator',
      'yordam kerak',
    ],
    answer:
      'Pastdagi “Administratorga yozish” tugmasini bosing: ismingiz, bog‘lanish usuli (telefon, Telegram yoki email) va savolingizni qoldiring — administrator siz bilan bog‘lanadi.',
    links: [],
  },
];
