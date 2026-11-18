import {
  codeFill,
  fill,
  lessonQuiz,
  match,
  order,
  q,
  sortInto,
  tf,
  why,
  type QuizDef,
} from '../helpers';

/**
 * Per-lesson tests of the CSS course (lessons that close a module keep their module quiz).
 * Original Uzbek questions based on each lesson's text; every question has an explanation.
 */
export const CSS_LESSON_QUIZZES: Record<string, QuizDef> = {
  // ---- 1. CSS bilan tanishuv ----------------------------------------------------
  introduction: lessonQuiz([
    why(
      match('q1', 'Qaysi til nima uchun javob beradi?', [
        ['HTML', 'Sahifa mazmuni (nimani ko‘rsatish)'],
        ['CSS', 'Sahifa ko‘rinishi (qanday ko‘rsatish)'],
      ]),
      'Mazmun va ko‘rinish ajratilgani uchun dizaynni HTML’ga tegmasdan o‘zgartirish mumkin.',
    ),
    why(
      tf('q2', 'CSS dasturlash tili: unda shartlar va sikllar yoziladi.', false),
      'CSS faqat “qaysi elementga qanday ko‘rinish” degan qoidalardan iborat.',
    ),
    why(
      q(
        'q3',
        'Butun saytdagi asosiy rangni o‘zgartirish uchun odatda nimani tahrirlaysiz?',
        [
          'Bitta umumiy CSS faylni',
          'Har bir HTML sahifani',
          'Har bir tegning style atributini',
          'Brauzer sozlamalarini',
        ],
        [0],
      ),
      'Yuzlab sahifa bitta `style.css` faylidan foydalanadi.',
    ),
    why(
      fill(
        'q4',
        'Bo‘sh joyni to‘ldiring.',
        'Bir nechta qoidaning ma’lum tartibda birlashishi “{{1}}” deyiladi.',
        [['kaskad', 'cascade']],
      ),
      'CSS — Cascading Style Sheets, ya’ni kaskadli uslublar jadvali.',
    ),
  ]),
  syntax: lessonQuiz([
    why(
      match('q1', '`h1 { color: navy; }` qoidasining qismlarini moslang.', [
        ['h1', 'Selektor'],
        ['color', 'Xususiyat'],
        ['navy', 'Qiymat'],
        ['color: navy;', 'E’lon'],
      ]),
      'Qoida = selektor + `{ xususiyat: qiymat; }`.',
    ),
    why(
      codeFill('q2', 'Qoidani to‘g‘ri yozing.', 'p {{1}}\n  color{{2}} gray{{3}}\n}', [
        '{',
        ':',
        ';',
      ]),
      'Blok `{ }` ichida, xususiyat va qiymat orasida `:`, e’lon oxirida `;`.',
    ),
    why(
      q(
        'q3',
        'Ikki selektorga bitta uslub qanday beriladi?',
        ['h1, h2 { … }', 'h1 + h2 { … }', 'h1; h2 { … }', 'h1 & h2 { … }'],
        [0],
      ),
      'Selektorlar vergul bilan ajratiladi.',
    ),
    why(
      tf('q4', 'CSS qoidasidagi bo‘sh joylar va yangi qatorlar natijaga ta’sir qiladi.', false),
      'Ular faqat o‘qishni osonlashtiradi.',
    ),
  ]),
  selectors: lessonQuiz([
    why(
      match('q1', 'Selektorni nimani tanlashi bilan moslang.', [
        ['p', 'Barcha <p> lar'],
        ['.karta', 'class="karta" bo‘lgan elementlar'],
        ['#menyu', 'id="menyu" bo‘lgan bitta element'],
        ['*', 'Hamma elementlar'],
      ]),
      'Element — teg nomi, klass — `.nom`, id — `#nom`.',
    ),
    why(
      q(
        'q2',
        'Bezak (uslub) berish uchun qaysi selektor turi tavsiya etiladi?',
        ['Klass', 'Id', 'Universal', 'Inline style'],
        [0],
      ),
      'Klasslar qayta ishlatiladi; id’larning “og‘irligi” katta va ular xatcho‘p va JavaScript uchun qulayroq.',
    ),
    why(
      codeFill('q3', '`tugma` klassli elementlarni tanlang.', '{{1}}tugma {\n  padding: 8px;\n}', [
        '.',
      ]),
      'Klass selektori nuqta bilan boshlanadi.',
    ),
    why(
      tf('q4', '`#menyu` selektori sahifadagi bir nechta elementga mo‘ljallangan.', false),
      '`id` sahifada yagona bo‘ladi.',
    ),
  ]),
  howto: lessonQuiz([
    why(
      match('q1', 'Ulash usulini yozilish joyi bilan moslang.', [
        ['Tashqi fayl', 'Alohida .css fayl'],
        ['Ichki uslub', '<head> dagi <style> bloki'],
        ['Inline uslub', 'Elementning style atributi'],
      ]),
      'Asosiy usul — tashqi fayl; `<style>` bitta sahifa uchun, `style` atributi istisno holatlar uchun.',
    ),
    why(
      codeFill('q2', 'Tashqi CSS faylni ulang.', '<link {{1}}="stylesheet" href="style.css">', [
        'rel',
      ]),
      '`<link rel="stylesheet">` `<head>` ichida yoziladi.',
    ),
    why(
      tf('q3', 'CSS fayl ichida qoidalar `<style>` tegi ichiga yoziladi.', false),
      'CSS faylida faqat qoidalar bo‘ladi, `<style>` tegi yozilmaydi.',
    ),
    why(
      q(
        'q4',
        'Tashqi CSS faylning afzalliklari qaysilar? (bir nechta javob)',
        [
          'Bitta fayl butun saytga xizmat qiladi',
          'Brauzer faylni keshlaydi',
          'HTML toza qoladi',
          'Uning ustunligi inline uslubdan yuqori',
        ],
        [0, 1, 2],
      ),
      'Inline uslubning ustunligi eng yuqori — shu sababli uni keyin o‘zgartirish qiyin.',
    ),
  ]),
  comments: lessonQuiz([
    why(
      q(
        'q1',
        'CSS’da izoh qanday yoziladi?',
        ['/* izoh */', '// izoh', '<!-- izoh -->', '# izoh'],
        [0],
      ),
      'CSS’da faqat `/* … */`; `//` va HTML izohi ishlamaydi.',
    ),
    why(
      tf('q2', '`//` bilan boshlangan qator CSS’da izoh hisoblanadi.', false),
      'U izoh emas va keyingi qoidani buzadi.',
    ),
    why(
      tf('q3', 'CSS izohlarini ichma-ich yozish mumkin.', false),
      'Birinchi `*/` izohni tugatadi.',
    ),
    why(
      sortInto('q4', 'Izohlardan nima uchun foydalanish mumkin?', {
        Foydali: [
          'Qoidani vaqtincha o‘chirish',
          'Faylni bo‘limlarga ajratish',
          'Murakkab qoidani tushuntirish',
        ],
        Ishlamaydi: ['// bilan qatorni o‘chirish', '<!-- --> bilan blokni yashirish'],
      }),
      'Izoh brauzer uchun ko‘rinmas, lekin kod o‘quvchisi uchun foydali.',
    ),
  ]),

  // ---- 2. Ranglar va fon --------------------------------------------------------
  colors: lessonQuiz([
    why(
      match('q1', 'Xususiyatni nimaning rangi ekanligi bilan moslang.', [
        ['color', 'Matn'],
        ['background-color', 'Fon'],
        ['border-color', 'Chegara'],
        ['outline-color', 'Kontur'],
      ]),
      '`text-decoration-color` esa tagiga chizilgan chiziq rangi.',
    ),
    why(
      q(
        'q2',
        'Oddiy matn uchun tavsiya etilgan eng kam kontrast nisbati qaysi?',
        ['4.5:1', '1.5:1', '2:1', '10:1'],
        [0],
      ),
      'DevTools rang tanlagichda kontrast nisbatini ko‘rsatadi.',
    ),
    why(
      tf('q3', 'Xatoni faqat qizil rang bilan ko‘rsatish yetarli.', false),
      'Faqat rang bilan ma’no bermang: matn yoki ikonka ham qo‘shing.',
    ),
    why(
      fill(
        'q4',
        'Kalit so‘zni yozing.',
        'Elementning joriy matn rangini olish uchun {{1}} kalit so‘zi ishlatiladi.',
        ['currentcolor'],
      ),
      '`transparent` esa to‘liq shaffof rang.',
    ),
  ]),
  rgb: lessonQuiz([
    why(
      match('q1', 'Yozuvni rangi bilan moslang.', [
        ['rgb(0, 0, 0)', 'Qora'],
        ['rgb(255, 255, 255)', 'Oq'],
        ['rgb(255, 0, 0)', 'Qizil'],
        ['rgb(128, 128, 128)', 'Kulrang'],
      ]),
      'Uchala qiymat teng bo‘lsa — kulrang tus.',
    ),
    why(
      q(
        'q2',
        'RGB’da har bir qism qanday oraliqda bo‘ladi?',
        ['0 dan 255 gacha', '0 dan 100 gacha', '0 dan 360 gacha', '0 dan 1 gacha'],
        [0],
      ),
      'Qizil, yashil va ko‘k yorug‘lik ulushi 0–255.',
    ),
    why(
      codeFill(
        'q3',
        'Yarim shaffof qora fon yozing (zamonaviy yozuv).',
        'background-color: rgb(0 0 0 {{1}} 0.5);',
        ['/'],
      ),
      'Alfa `/` dan keyin keladi; eski yozuv: `rgba(0, 0, 0, 0.5)`.',
    ),
    why(
      tf('q4', '`rgb(255, 255, 0)` sariq rangni beradi.', true),
      'Qizil va yashil yorug‘lik aralashmasi sariq bo‘ladi.',
    ),
  ]),
  hex: lessonQuiz([
    why(
      order('q1', '`#RRGGBB` dagi juftliklar tartibini joylang.', ['Qizil', 'Yashil', 'Ko‘k']),
      '`#0071dc`: qizil 00, yashil 71 (113), ko‘k dc (220).',
    ),
    why(
      q('q2', '`#ffffff` qaysi rang?', ['Oq', 'Qora', 'Qizil', 'Kulrang'], [0]),
      '`ff` = 255 — har uchala qism to‘liq.',
    ),
    why(
      fill('q3', 'Qisqa yozuvni to‘liq yozing.', '#333 = #{{1}}', ['333333']),
      'Qisqa yozuvda har bir belgi ikki marta takrorlanadi.',
    ),
    why(
      tf('q4', 'Sakkiz belgili HEX’da oxirgi juftlik shaffoflikni bildiradi.', true),
      'Masalan, `#0071dc80` — taxminan yarim shaffof.',
    ),
  ]),
  hsl: lessonQuiz([
    why(
      match('q1', 'HSL harfini ma’nosi bilan moslang.', [
        ['H', 'Tus — rang g‘ildiragidagi burchak (0–360)'],
        ['S', 'To‘yinganlik (0% kulrang – 100% yorqin)'],
        ['L', 'Yorqinlik (0% qora – 100% oq)'],
      ]),
      '`hsl(210, 100%, 43%)` — ko‘k.',
    ),
    why(
      match('q2', 'Burchakni rang bilan moslang.', [
        ['0', 'Qizil'],
        ['120', 'Yashil'],
        ['240', 'Ko‘k'],
      ]),
      'Rang g‘ildiragida har 60° da yangi asosiy rang: 60 — sariq, 180 — moviy, 300 — binafsha.',
    ),
    why(
      q(
        'q3',
        'Bir rangning ochroq variantini olish uchun HSL’da nimani oshirasiz?',
        ['Yorqinlik (L)', 'Tus (H)', 'To‘yinganlik (S)', 'Alfa'],
        [0],
      ),
      'Tusni saqlab yorqinlikni o‘zgartirish — HSL’ning asosiy afzalligi.',
    ),
    why(
      tf('q4', 'To‘yinganlik 0% bo‘lsa, rang kulrang bo‘ladi.', true),
      'To‘yinganlik rangning “sofligi”; 0% da faqat kulrang tus qoladi.',
    ),
  ]),
  backgrounds: lessonQuiz([
    why(
      q(
        'q1',
        '`background-color` ning standart qiymati qaysi?',
        ['transparent', 'white', 'none', 'inherit'],
        [0],
      ),
      'Shuning uchun element ortidagi fon ko‘rinib turadi.',
    ),
    why(
      tf('q2', 'Fon rangi `padding` maydonini ham qamraydi.', true),
      'Fon kontent va padding ostida bo‘ladi; margin esa shaffof.',
    ),
    why(
      match('q3', 'Shaffoflik usulini natijasi bilan moslang.', [
        ['background-color: rgb(0 0 0 / 0.5)', 'Faqat fon shaffof, matn to‘liq ko‘rinadi'],
        ['opacity: 0.5', 'Butun element (matni bilan) shaffof'],
      ]),
      'Matn o‘qilishi kerak bo‘lsa, alfa kanalli fon rangini tanlang.',
    ),
    why(
      codeFill('q4', 'Elementga och sariq fon bering.', '.eslatma {\n  {{1}}: lightyellow;\n}', [
        'background-color',
      ]),
      '`color` matn rangi, `background-color` fon rangi.',
    ),
  ]),
  'background-image': lessonQuiz([
    why(
      match('q1', '`background-size` qiymatini natijasi bilan moslang.', [
        ['cover', 'Maydonni to‘liq qoplaydi, rasm qisman kesilishi mumkin'],
        ['contain', 'Rasm to‘liq ko‘rinadi, bo‘sh joy qolishi mumkin'],
        ['auto', 'Asl o‘lcham'],
      ]),
      'Aniq o‘lcham ham berish mumkin: `200px`.',
    ),
    why(
      codeFill('q2', 'Fon rasmi bir marta chiqsin.', 'background-repeat: {{1}};', ['no-repeat']),
      'Standart — `repeat` (ikki yo‘nalishda takrorlanadi).',
    ),
    why(
      tf('q3', 'Mahsulot surati kabi ma’noli rasmni fon rasmi qilib qo‘yish to‘g‘ri.', false),
      'Fon rasmini ekran o‘qiydigan dastur ko‘rmaydi; ma’noli rasm `<img alt>` bilan qo‘yiladi.',
    ),
    why(
      q(
        'q4',
        'Rasm yuklanmasa matn o‘qilishi uchun nima qilish kerak?',
        [
          'Zaxira background-color berish',
          'Rasmni kattalashtirish',
          'background-repeat qo‘shish',
          'Hech narsa',
        ],
        [0],
      ),
      'Rasm yuklanmasa zaxira fon rangi ko‘rinadi.',
    ),
  ]),
  'background-attachment': lessonQuiz([
    why(
      match('q1', 'Qiymatni natijasi bilan moslang.', [
        ['scroll', 'Fon element bilan birga siljiydi (standart)'],
        ['fixed', 'Fon ekranga “yopishib” qoladi'],
        ['local', 'Fon blokning ichki aylantirishi bilan siljiydi'],
      ]),
      '`fixed` parallaks effektini beradi.',
    ),
    why(
      tf(
        'q2',
        'Ko‘p mobil brauzerlar `background-attachment: fixed` ni qo‘llab-quvvatlamaydi.',
        true,
      ),
      'Ular uni `scroll` kabi ishlatishi mumkin.',
    ),
    why(
      fill(
        'q3',
        'Media so‘rov nomini yozing.',
        'Harakat effektlarini yoqtirmaydigan foydalanuvchilar uchun {{1}} media so‘rovi bilan effektni o‘chirish mumkin.',
        ['prefers-reduced-motion'],
      ),
      'Ba’zi odamlarda harakat effektlari bosh aylanishiga sabab bo‘ladi.',
    ),
    why(
      q(
        'q4',
        'Katta `fixed` fon rasmining kamchiligi qaysi?',
        [
          'Kuchsiz qurilmalarda aylantirishni sekinlashtirishi',
          'Rasmni rangsiz qilishi',
          'Matnni yashirishi',
          'Sahifani chop etib bo‘lmasligi',
        ],
        [0],
      ),
      'Effektni o‘rinli va ehtiyotkorlik bilan ishlating.',
    ),
  ]),

  // ---- 3. Chegara va bo‘shliqlar -----------------------------------------------
  borders: lessonQuiz([
    why(
      tf(
        'q1',
        '`border-width` va `border-color` berilsa, `border-style` siz ham chegara ko‘rinadi.',
        false,
      ),
      '`border-style` ning standart qiymati `none` — usiz chegara yo‘q.',
    ),
    why(
      codeFill('q2', 'Qisqa yozuvni to‘ldiring.', 'border: 2px {{1}} #0071dc;', ['solid']),
      'Qisqa yozuv: qalinlik, tur, rang.',
    ),
    why(
      match('q3', 'Chiziq turini ko‘rinishi bilan moslang.', [
        ['solid', 'Yaxlit chiziq'],
        ['dashed', 'Uzuq-uzuq chiziqchalar'],
        ['dotted', 'Nuqtalar'],
        ['double', 'Qo‘sh chiziq'],
      ]),
      '`groove`, `ridge`, `inset`, `outset` — 3D ko‘rinishli turlar.',
    ),
    why(
      q(
        'q4',
        'Rang berilmasa chegara qaysi rangni oladi?',
        ['Elementning matn rangini', 'Qora', 'Fon rangini', 'Ko‘k'],
        [0],
      ),
      'Chegara rangi standart holda `currentcolor`.',
    ),
  ]),
  'border-sides': lessonQuiz([
    why(
      order('q1', '`border-width: 1px 2px 3px 4px` dagi tomonlar tartibini joylang.', [
        'Yuqori',
        'O‘ng',
        'Past',
        'Chap',
      ]),
      'Soat mili bo‘yicha: 12, 3, 6, 9.',
    ),
    why(
      q(
        'q2',
        '`border-width: 2px 4px;` nimani bildiradi?',
        [
          'Yuqori-past 2px, o‘ng-chap 4px',
          'Yuqori 2px, past 4px',
          'Chap 2px, o‘ng 4px',
          'Hamma tomon 6px',
        ],
        [0],
      ),
      'Ikki qiymat: birinchisi vertikal, ikkinchisi gorizontal tomonlar.',
    ),
    why(
      codeFill(
        'q3',
        'Faqat pastki chegarani olib tashlang.',
        '.karta {\n  border: 1px solid #ccc;\n  {{1}}: none;\n}',
        ['border-bottom'],
      ),
      'Avval umumiy chegara, keyin bitta tomonni o‘chirish qulay.',
    ),
    why(
      match('q4', 'Fizik tomonni mantiqiy nomi bilan moslang.', [
        ['border-left', 'border-inline-start'],
        ['border-top', 'border-block-start'],
        ['border-bottom', 'border-block-end'],
      ]),
      'Mantiqiy tomonlar yozuv yo‘nalishiga (masalan, o‘ngdan chapga) moslashadi.',
    ),
  ]),
  'rounded-borders': lessonQuiz([
    why(
      codeFill('q1', 'Kvadrat rasmni doiraga aylantiring.', 'img {\n  border-radius: {{1}};\n}', [
        '50%',
      ]),
      '`50%` kvadratni doiraga, to‘rtburchakni ellipsga aylantiradi.',
    ),
    why(
      q(
        'q2',
        '“Tabletka” shaklidagi tugma uchun qaysi qiymat qulay?',
        ['border-radius: 999px;', 'border-radius: 0;', 'border-radius: 50% 0;', 'border: pill;'],
        [0],
      ),
      'Juda katta qiymat qisqa tomonning yarmigacha yumaloqlaydi.',
    ),
    why(
      tf('q3', '`border-radius` faqat chegarasi bor elementda ishlaydi.', false),
      'U fon va rasm burchaklarini ham yumaloqlaydi.',
    ),
    why(
      order('q4', 'To‘rt qiymatli `border-radius` burchaklari tartibini joylang.', [
        'Chap-yuqori',
        'O‘ng-yuqori',
        'O‘ng-past',
        'Chap-past',
      ]),
      'Chap-yuqoridan boshlab soat mili bo‘yicha.',
    ),
  ]),
  margins: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Kengligi 600px bo‘lgan blokni markazlang.',
        '.sahifa {\n  max-width: 600px;\n  margin: 0 {{1}};\n}',
        ['auto'],
      ),
      '`auto` chap va o‘ng marginlarni teng taqsimlaydi.',
    ),
    why(
      q(
        'q2',
        '`margin: 8px 16px 24px;` nimani bildiradi?',
        [
          'Yuqori 8px, yonlar 16px, past 24px',
          'Yuqori 8px, o‘ng 16px, chap 24px',
          'Hamma tomon 48px',
          'Chap 8px, o‘ng 16px, past 24px',
        ],
        [0],
      ),
      'Uch qiymat: yuqori, o‘ng-chap, past.',
    ),
    why(
      tf('q3', '`margin` chegaradan tashqaridagi shaffof bo‘shliq — u fon rangini olmaydi.', true),
      'Fonni oladigan ichki bo‘shliq — `padding`.',
    ),
    why(
      tf('q4', 'Margin manfiy bo‘lishi mumkin.', true),
      'Manfiy margin elementni qo‘shnisi tomon suradi; padding esa manfiy bo‘lolmaydi.',
    ),
  ]),
  'margin-collapse': lessonQuiz([
    why(
      q(
        'q1',
        'Ustma-ust ikki blok: birida `margin-bottom: 30px`, ikkinchisida `margin-top: 20px`. Oradagi masofa qancha?',
        ['30px', '50px', '20px', '10px'],
        [0],
      ),
      'Vertikal marginlar qo‘shilib (collapse), kattasi qoladi.',
    ),
    why(
      tf('q2', 'Chap va o‘ng marginlar ham xuddi shunday qo‘shilib ketadi.', false),
      'Faqat yuqori va pastki marginlar qo‘shiladi.',
    ),
    why(
      q(
        'q3',
        'Biri `30px`, ikkinchisi `-10px` bo‘lsa, natija qancha?',
        ['20px', '30px', '40px', '-10px'],
        [0],
      ),
      'Biri manfiy bo‘lsa, ular qo‘shiladi: 30 + (−10) = 20.',
    ),
    why(
      sortInto('q4', 'Ota va bola marginlari qo‘shilishini nima to‘xtatadi?', {
        'To‘xtatadi': ['Otaga padding berish', 'Otaga border berish', 'display: flow-root'],
        'To‘xtatmaydi': ['Bolaga color berish', 'Otaga font-size berish'],
      }),
      'Flex va grid ichidagi marginlar ham qo‘shilmaydi.',
    ),
  ]),
  padding: lessonQuiz([
    why(
      sortInto('q1', 'Vazifaga mos xususiyatni tanlang.', {
        padding: ['Fon bo‘shliqni ham qoplashi kerak', 'Bosiladigan maydonni kattalashtirish'],
        margin: ['Elementni qo‘shnisidan uzoqlashtirish', 'Blokni markazlash (0 auto)'],
      }),
      '`padding` kontent va chegara orasida, `margin` chegaradan tashqarida.',
    ),
    why(
      tf('q2', '`padding: auto;` blokni markazlaydi.', false),
      'Padding `auto` va manfiy qiymatni qabul qilmaydi.',
    ),
    why(
      q(
        'q3',
        '`padding: 8px 16px;` nimani bildiradi?',
        [
          'Yuqori-past 8px, yonlar 16px',
          'Yuqori 8px, past 16px',
          'Chap 8px, o‘ng 16px',
          'Hamma tomon 24px',
        ],
        [0],
      ),
      'Qisqa yozuv margin bilan bir xil.',
    ),
    why(
      codeFill('q4', 'Padding kenglik ichida hisoblansin.', '* {\n  box-sizing: {{1}};\n}', [
        'border-box',
      ]),
      'Aks holda padding `width` ga qo‘shilib, element kengayadi.',
    ),
  ]),
  'height-width': lessonQuiz([
    why(
      q(
        'q1',
        'Telefonda ekrandan chiqib ketmasligi uchun kenglikni qanday cheklash to‘g‘ri?',
        ['max-width: 600px;', 'width: 600px;', 'min-width: 600px;', 'height: 600px;'],
        [0],
      ),
      '`width: 600px` qat’iy — tor ekranda gorizontal aylantirish paydo bo‘ladi; `max-width` esa qisqaradi.',
    ),
    why(
      match('q2', 'Xususiyatni ma’nosi bilan moslang.', [
        ['max-width', 'Bundan kengroq bo‘lmasin'],
        ['min-width', 'Bundan torroq bo‘lmasin'],
        ['min-height', 'Bundan pastroq bo‘lmasin'],
      ]),
      '`max-width` va `min-height` — moslashuvchan dizaynning asosiy vositalari.',
    ),
    why(
      tf('q3', 'Matnli blokka qat’iy `height` berish xavfsiz.', false),
      'Matn ko‘paysa yoki shrift kattalashsa, kontent blokdan chiqib ketadi.',
    ),
    why(
      tf('q4', 'Foizli balandlik faqat ota elementning balandligi aniq bo‘lsa ishlaydi.', true),
      'Aks holda `height: 50%` hisoblanmaydi.',
    ),
  ]),
  'box-model': lessonQuiz([
    why(
      order('q1', 'Quti modeli qatlamlarini ichkaridan tashqariga tartiblang.', [
        'Content',
        'Padding',
        'Border',
        'Margin',
      ]),
      'Kontent → ichki bo‘shliq → chegara → tashqi bo‘shliq.',
    ),
    why(
      fill(
        'q2',
        'Hisoblang (standart box-sizing).',
        'width: 300px; padding: 20px; border: 5px — ko‘rinadigan kenglik {{1}}px.',
        ['350'],
      ),
      '300 + 20 + 20 + 5 + 5 = 350; margin bilan egallagan joy bundan ham katta.',
    ),
    why(
      match('q3', '`box-sizing` qiymatini `width` nimani o‘lchashi bilan moslang.', [
        ['content-box', 'Faqat kontentni (standart)'],
        ['border-box', 'Kontent + padding + chegarani'],
      ]),
      '`border-box` bilan `width: 300px` — butun ko‘rinadigan quti 300px.',
    ),
    why(
      q(
        'q4',
        'Quti modelini jonli ko‘rish uchun qayerga qaraysiz?',
        [
          'Brauzer DevTools’idagi Computed/Layout paneliga',
          'Sahifa manba kodiga (Ctrl+U)',
          'CSS fayl oxiriga',
          'Brauzer tarixiga',
        ],
        [0],
      ),
      'DevTools har qatlam o‘lchamini rangli quti sifatida ko‘rsatadi.',
    ),
  ]),

  // ---- 4. Matn va shriftlar ---------------------------------------------------------
  text: lessonQuiz([
    why(
      match('q1', 'Xususiyatni vazifasi bilan moslang.', [
        ['text-align', 'Gorizontal tekislash'],
        ['line-height', 'Qatorlar orasidagi balandlik'],
        ['letter-spacing', 'Harflar orasidagi masofa'],
        ['text-indent', 'Birinchi qator chekinishi'],
      ]),
      '`word-spacing` esa so‘zlar orasidagi masofa.',
    ),
    why(
      q(
        'q2',
        '`line-height` uchun qaysi qiymat eng qulay?',
        ['Birliksiz 1.5–1.7', '0.8', '40px har doim', '10%'],
        [0],
      ),
      'Birliksiz qiymat shrift o‘lchamiga mos ravishda o‘zgaradi.',
    ),
    why(
      codeFill('q3', 'Matn ikki chetga teng tekislansin.', 'p {\n  text-align: {{1}};\n}', [
        'justify',
      ]),
      '`left`, `right`, `center`, `justify`, `start`.',
    ),
    why(
      tf('q4', 'O‘zbek tilida matnning standart tekislanishi chapga.', true),
      'Lotin yozuvi chapdan o‘ngga yoziladi.',
    ),
  ]),
  'text-decoration': lessonQuiz([
    why(
      codeFill('q1', 'Havoladan tagchiziqni olib tashlang.', 'a {\n  text-decoration: {{1}};\n}', [
        'none',
      ]),
      'Lekin matn ichidagi havolalar faqat rang bilan emas, chiziq bilan ham ajralib tursin.',
    ),
    why(
      match('q2', 'Qiymatni ko‘rinishi bilan moslang.', [
        ['underline', 'Tagiga chizilgan'],
        ['line-through', 'Ustidan chizilgan'],
        ['overline', 'Ustiga chizilgan'],
        ['wavy', 'To‘lqinsimon chiziq uslubi'],
      ]),
      'Qisqa yozuv: chiziq turi, uslubi, rangi va qalinligi.',
    ),
    why(
      q(
        'q3',
        'Tagchiziqni harflardan uzoqlashtiradigan xususiyat qaysi?',
        ['text-underline-offset', 'text-indent', 'letter-spacing', 'padding-bottom'],
        [0],
      ),
      'Masalan: `text-underline-offset: 4px`.',
    ),
    why(
      tf(
        'q4',
        'Havola bo‘lmagan oddiy matnga tagchiziq berish foydalanuvchini chalg‘itishi mumkin.',
        true,
      ),
      'Tagchiziqli matn odatda havola deb qabul qilinadi.',
    ),
  ]),
  'text-transform': lessonQuiz([
    why(
      match('q1', 'Qiymatni natijasi bilan moslang.', [
        ['uppercase', 'HAMMASI BOSH HARF'],
        ['lowercase', 'hammasi kichik harf'],
        ['capitalize', 'Har So‘zning Birinchi Harfi Bosh'],
      ]),
      '`text-transform` faqat ko‘rinishni o‘zgartiradi, HTML matni o‘zgarmaydi.',
    ),
    why(
      tf(
        'q2',
        'Bosh harfli yorliqni HTML’da BOSH HARF bilan yozgandan ko‘ra CSS bilan qilish yaxshiroq.',
        true,
      ),
      'Dizayn o‘zgarsa faqat CSS tahrirlanadi; ekran o‘qiydigan dastur so‘zni harfma-harf o‘qimaydi.',
    ),
    why(
      codeFill('q3', 'Matn bitta qatorda qolsin.', '.yorliq {\n  white-space: {{1}};\n}', [
        'nowrap',
      ]),
      '`nowrap` avtomatik ko‘chirishni o‘chiradi.',
    ),
    why(
      q(
        'q4',
        'Bo‘sh joy va qator o‘tishlarini saqlab, avtomatik ko‘chirishga ham ruxsat beradigan qiymat qaysi?',
        ['pre-wrap', 'pre', 'nowrap', 'normal'],
        [0],
      ),
      '`pre` saqlaydi, lekin ko‘chirmaydi; `normal` bo‘sh joylarni birlashtiradi.',
    ),
  ]),
  'text-shadow': lessonQuiz([
    why(
      order('q1', '`text-shadow` qiymatlari tartibini joylang.', [
        'Gorizontal siljish',
        'Vertikal siljish',
        'Xiralik radiusi',
        'Rang',
      ]),
      'Masalan: `2px 2px 4px rgb(0 0 0 / 0.3)`.',
    ),
    why(
      tf('q2', '`text-shadow` joy egallab, qo‘shni elementlarni suradi.', false),
      'Soya joy egallamaydi.',
    ),
    why(
      q(
        'q3',
        'Matnga ikkita soya qanday beriladi?',
        [
          'Vergul bilan ajratib',
          'Ikki marta text-shadow yozib',
          'Bo‘sh joy bilan',
          'Bunga imkon yo‘q',
        ],
        [0],
      ),
      'Ikkinchi `text-shadow` qatori birinchisini bekor qiladi.',
    ),
    why(
      tf('q4', 'Oddiy uzun paragraflarga ham soya berish o‘qishni osonlashtiradi.', false),
      'Soya faqat o‘qishni osonlashtirsa ishlatiladi (masalan, rasm ustidagi sarlavha).',
    ),
  ]),
  fonts: lessonQuiz([
    why(
      match('q1', 'Umumiy oilani tavsifi bilan moslang.', [
        ['serif', 'Harf uchlarida “oyoqchalar” bor'],
        ['sans-serif', 'Oyoqchasiz, toza'],
        ['monospace', 'Har harf bir xil kenglikda'],
        ['system-ui', 'Operatsion tizim interfeysi shrifti'],
      ]),
      'Kod uchun doim `monospace`.',
    ),
    why(
      q(
        'q2',
        '`font-family` ro‘yxati qanday tugashi kerak?',
        [
          'Umumiy oila bilan (masalan, sans-serif)',
          'Eng chiroyli shrift bilan',
          'Vergul bilan',
          'inherit bilan',
        ],
        [0],
      ),
      'Ro‘yxatdagi birinchi mavjud shrift ishlatiladi; umumiy oila — oxirgi zaxira.',
    ),
    why(
      codeFill('q3', 'Tugma sahifa shriftini olsin.', 'button {\n  font-family: {{1}};\n}', [
        'inherit',
      ]),
      '`button`, `input`, `textarea` shriftni meros olmaydi.',
    ),
    why(
      tf('q4', 'Sahifada 2 tadan ortiq shrift ishlatmaslik tavsiya etiladi.', true),
      'Biri sarlavhalar, biri matn uchun yetarli.',
    ),
  ]),
  'font-style': lessonQuiz([
    why(
      match('q1', '`font-weight` sonini nomi bilan moslang.', [
        ['400', 'Oddiy (normal)'],
        ['700', 'Qalin (bold)'],
        ['300', 'Ingichka (light)'],
        ['600', 'Yarim qalin'],
      ]),
      'Qalinliklar 100 dan 900 gacha.',
    ),
    why(
      q(
        'q2',
        'Foydalanuvchi brauzer sozlamasini hurmat qiladigan matn o‘lchami birligi qaysi?',
        ['rem', 'px', 'pt', 'cm'],
        [0],
      ),
      '`rem` ildiz element shriftiga nisbatan; foydalanuvchi shriftni kattalashtirsa, sahifa ham kattalashadi.',
    ),
    why(
      tf('q3', '`em` ota elementga bog‘liq va ichma-ich elementlarda to‘planib boradi.', true),
      'Masalan, `1.5em` ichida yana `1.5em` — 2.25 marta.',
    ),
    why(
      codeFill('q4', 'Matnni kursiv qiling.', 'em {\n  font-style: {{1}};\n}', ['italic']),
      '`oblique` esa oddiy harflarni qiyshaytiradi.',
    ),
  ]),
  'web-fonts': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Shriftni ulaydigan qoidani yozing.',
        "{{1}} {\n  font-family: 'Mening shriftim';\n  src: url('shrift.woff2') format('woff2');\n}",
        ['@font-face'],
      ),
      '`@font-face` shriftga nom beradi va faylini ko‘rsatadi.',
    ),
    why(
      q(
        'q2',
        'Shrift yuklanguncha matn darhol (zaxira shrift bilan) ko‘rinsin desangiz, nima yozasiz?',
        ['font-display: swap;', 'font-display: block;', 'font-weight: auto;', 'src: local();'],
        [0],
      ),
      '`swap` bo‘sh ekranda kutishdan saqlaydi.',
    ),
    why(
      tf('q3', 'Internetdagi har qanday shriftni saytga erkin qo‘yish mumkin.', false),
      'Shrift litsenziyasi veb uchun ruxsat berishini tekshiring.',
    ),
    why(
      q(
        'q4',
        'Bugun veb uchun qaysi shrift formati yetarli?',
        ['WOFF2', 'TTF', 'EOT', 'SVG font'],
        [0],
      ),
      'WOFF2 siqilgan va barcha zamonaviy brauzerlar uni qo‘llaydi; har qalinlik — alohida `@font-face`.',
    ),
  ]),
  'font-shorthand': lessonQuiz([
    why(
      order('q1', '`font` qisqa yozuvi qismlarini tartiblang.', [
        'style / weight',
        'size',
        '/ line-height',
        'family',
      ]),
      '`font: italic 700 18px/1.5 Georgia, serif;`.',
    ),
    why(
      sortInto('q2', '`font` qisqa yozuvida qaysi qismlar majburiy?', {
        Majburiy: ['font-size', 'font-family'],
        Ixtiyoriy: ['font-style', 'font-weight', 'line-height'],
      }),
      'Majburiy qismlardan biri bo‘lmasa, butun qator e’tiborsiz qoladi.',
    ),
    why(
      tf('q3', 'Qisqa yozuvda yozilmagan qismlar standart qiymatiga qaytariladi.', true),
      'Masalan, avval berilgan `font-weight: 700` `font: 16px Arial` dan keyin bekor bo‘ladi.',
    ),
    why(
      codeFill(
        'q4',
        'Forma elementlari sahifa shriftini to‘liq olsin.',
        'input,\nbutton {\n  font: {{1}};\n}',
        ['inherit'],
      ),
      'Bitta qator bilan o‘lcham, qalinlik va oilani meros oladi.',
    ),
  ]),

  // ---- 5. Havola, ro‘yxat va jadval ------------------------------------------------
  links: lessonQuiz([
    why(
      order('q1', 'Havola psevdoklasslarini to‘g‘ri yozish tartibida joylang (LVHA).', [
        ':link',
        ':visited',
        ':hover',
        ':active',
      ]),
      'Aks holda keyingi qoida oldingisini yopib qo‘yadi.',
    ),
    why(
      match('q2', 'Psevdoklassni holati bilan moslang.', [
        [':hover', 'Sichqoncha ustida'],
        [':focus-visible', 'Klaviatura bilan fokuslanganda'],
        [':active', 'Bosilayotgan paytda'],
        [':visited', 'Oldin ochilgan havola'],
      ]),
      'Hover bilan birga fokus uslubini ham yozing.',
    ),
    why(
      q(
        'q3',
        'Sahifada amal bajaradigan (masalan, oynani ochadigan) element qaysi bo‘lishi kerak?',
        ['<button>', '<a href="#">', '<span onclick>', '<div>'],
        [0],
      ),
      'Boshqa sahifaga olib boradigan narsa — `<a>`, amal — `<button>`, ko‘rinishidan qat’i nazar.',
    ),
    why(
      codeFill(
        'q4',
        'Havolani tugmadek ko‘rsating.',
        '.havola-tugma {\n  display: {{1}};\n  padding: 8px 16px;\n}',
        ['inline-block'],
      ),
      '`inline-block` bilan padding va o‘lcham ishlaydi.',
    ),
  ]),
  lists: lessonQuiz([
    why(
      match('q1', '`list-style-type` ni ko‘rinishi bilan moslang.', [
        ['disc', '●'],
        ['square', '■'],
        ['decimal', '1, 2, 3'],
        ['upper-roman', 'I, II, III'],
      ]),
      '`disc` — `ul`, `decimal` — `ol` standarti.',
    ),
    why(
      codeFill(
        'q2',
        'Menyu uchun belgilarni olib tashlang.',
        'nav ul {\n  list-style: {{1}};\n  padding-left: 0;\n}',
        ['none'],
      ),
      'Menyular odatda belgisiz ro‘yxat bo‘ladi.',
    ),
    why(
      q(
        'q3',
        'Ro‘yxat belgisining rangini qaysi psevdoelement bilan o‘zgartirasiz?',
        ['::marker', '::before', '::bullet', ':first-child'],
        [0],
      ),
      '`li::marker { color: … }`.',
    ),
    why(
      tf('q4', '`list-style-position: inside` da ikkinchi qator belgi ostidan boshlanadi.', true),
      '`outside` (standart) da belgi matn chegarasidan tashqarida turadi.',
    ),
  ]),
  tables: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Qo‘sh chegaralarni bitta chiziqqa aylantiring.',
        'table {\n  border-collapse: {{1}};\n}',
        ['collapse'],
      ),
      '`separate` da har katak alohida, orasida `border-spacing`.',
    ),
    why(
      q(
        'q2',
        'Pul yoki ball ustunidagi raqamlarni qanday tekislash qulay?',
        ['O‘ngga', 'Chapga', 'Markazga', 'Ikki chetga (justify)'],
        [0],
      ),
      'O‘ngga tekislanganda xonalar bir ustunda turadi.',
    ),
    why(
      tf('q3', '`th` standart holda markazda va qalin bo‘ladi.', true),
      'Ko‘p jadvallarda sarlavhalarni ham chapga tekislash o‘qishni osonlashtiradi.',
    ),
    why(
      q(
        'q4',
        'Jadvalni nima uchun ishlatish mumkin?',
        [
          'Faqat jadvalli ma’lumot uchun',
          'Sahifa maketi uchun',
          'Menyu uchun',
          'Rasmlarni joylash uchun',
        ],
        [0],
      ),
      'Maket uchun Flexbox va Grid bor.',
    ),
  ]),

  // ---- 6. Joylashuv ---------------------------------------------------------------
  display: lessonQuiz([
    why(
      match('q1', 'Yashirish usulini natijasi bilan moslang.', [
        ['display: none', 'Element joyi bilan olib tashlanadi'],
        ['visibility: hidden', 'Ko‘rinmaydi, lekin bo‘sh joy qoladi'],
      ]),
      'Ikkalasini ham ekran o‘qiydigan dastur o‘qimaydi.',
    ),
    why(
      tf('q2', '`inline` elementda `width` va `height` ishlamaydi.', true),
      'Ular uchun `inline-block` yoki `block` kerak.',
    ),
    why(
      sortInto('q3', 'Elementlarni standart `display` turiga ajrating.', {
        block: ['div', 'p', 'section', 'ul'],
        inline: ['a', 'span', 'strong', 'em'],
      }),
      'Blok elementlar yangi qatordan boshlanadi, qator elementlar matn oqimida qoladi.',
    ),
    why(
      tf('q4', '`display` elementning HTML ma’nosini ham o‘zgartiradi.', false),
      '`display` faqat ko‘rinishni o‘zgartiradi.',
    ),
  ]),
  'max-width': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Markazdagi konteyner yasang.',
        '.konteyner {\n  {{1}}: 700px;\n  margin: 0 auto;\n}',
        ['max-width'],
      ),
      'Katta ekranda 700px dan oshmaydi, kichik ekranda moslashadi.',
    ),
    why(
      q(
        'q2',
        'Uzun matn qatorini o‘qishga qulay kenglikda qaysi qiymat ushlab turadi?',
        ['max-width: 65ch;', 'width: 100vw;', 'max-width: 3000px;', 'min-width: 65ch;'],
        [0],
      ),
      '`ch` — “0” belgisining kengligi; ~65 belgi qulay qator uzunligi.',
    ),
    why(
      codeFill(
        'q3',
        'Rasm konteynerdan chiqmasin.',
        'img {\n  max-width: {{1}};\n  height: auto;\n}',
        ['100%'],
      ),
      '`height: auto` proporsiyani saqlaydi.',
    ),
    why(
      tf('q4', '`width: 700px` tor telefon ekranida o‘z-o‘zidan qisqaradi.', false),
      'Qat’iy kenglik qisqarmaydi — gorizontal aylantirish paydo bo‘ladi.',
    ),
  ]),
  position: lessonQuiz([
    why(
      match('q1', '`position` qiymatini nimaga nisbatan joylashishi bilan moslang.', [
        ['relative', 'O‘zining asl joyiga'],
        ['absolute', 'Eng yaqin joylashtirilgan ota elementga'],
        ['fixed', 'Brauzer oynasiga'],
        ['sticky', 'Aylantirishgacha oddiy, keyin yopishadi'],
      ]),
      '`static` — standart, joylashtirilmaydi.',
    ),
    why(
      sortInto('q2', 'Element oqimda o‘z joyini saqlaydimi?', {
        'Joy qoladi': ['static', 'relative', 'sticky'],
        'Oqimdan chiqadi': ['absolute', 'fixed'],
      }),
      'Oqimdan chiqqan element o‘rnini qo‘shnilar egallaydi.',
    ),
    why(
      q(
        'q3',
        '`absolute` belgini kartaning burchagiga qo‘ymoqchisiz. Kartaga nima yozasiz?',
        ['position: relative;', 'position: static;', 'display: block;', 'z-index: 1;'],
        [0],
      ),
      '`relative` ota absolute bolalar uchun tayanch bo‘ladi.',
    ),
    why(
      codeFill(
        'q4',
        'Qisqa yozuv bilan to‘rt tomonni 0 qiling.',
        '.fon {\n  position: fixed;\n  {{1}}: 0;\n}',
        ['inset'],
      ),
      '`inset: 0` = `top: 0; right: 0; bottom: 0; left: 0`.',
    ),
  ]),
  'z-index': lessonQuiz([
    why(
      tf('q1', '`z-index` `position: static` elementda ishlaydi.', false),
      'U joylashtirilgan (va flex/grid ichidagi) elementlarda ishlaydi.',
    ),
    why(
      q(
        'q2',
        'Qaysi element ustda turadi?',
        ['z-index: 100', 'z-index: 10', 'z-index: auto', 'z-index: -1'],
        [0],
      ),
      'Katta qiymat ustda.',
    ),
    why(
      sortInto('q3', 'Qaysi xususiyat yangi qatlam konteksti (stacking context) yaratadi?', {
        Yaratadi: ['opacity: 0.9', 'transform: scale(1)', 'position: fixed'],
        Yaratmaydi: ['color: red', 'margin: 10px'],
      }),
      'Bola elementi otasining qatlam kontekstidan chiqa olmaydi.',
    ),
    why(
      order('q4', 'Darajalarni pastdan yuqoriga tartiblang.', [
        'Oddiy kontent',
        'Yopishqoq sarlavha',
        'Ochiladigan menyu',
        'Modal oyna',
        'Bildirishnoma (toast)',
      ]),
      'Qiymatlarni tartibli tanlang: 10, 20, 100, 200.',
    ),
  ]),
  overflow: lessonQuiz([
    why(
      match('q1', 'Qiymatni natijasi bilan moslang.', [
        ['visible', 'Chegaradan chiqib ko‘rinadi (standart)'],
        ['hidden', 'Ortiqcha qism kesiladi'],
        ['scroll', 'Doim aylantirish paneli'],
        ['auto', 'Kerak bo‘lsagina aylantirish paneli'],
      ]),
      '`clip` — `hidden` ga o‘xshash, dastur bilan ham aylantirib bo‘lmaydi.',
    ),
    why(
      codeFill(
        'q2',
        'Uzun nomni “…” bilan kesing.',
        '.nom {\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: {{1}};\n}',
        ['ellipsis'],
      ),
      'Uchala qator birga kerak.',
    ),
    why(
      q(
        'q3',
        'Faqat gorizontal aylantirishni boshqaradigan xususiyat qaysi?',
        ['overflow-x', 'overflow-y', 'scroll-x', 'overflow-horizontal'],
        [0],
      ),
      '`overflow-y` — vertikal.',
    ),
    why(
      tf('q4', '`overflow: hidden` fokus konturi va soyalarni ham kesib qo‘yishi mumkin.', true),
      'Shuning uchun undan ehtiyotkorlik bilan foydalaning.',
    ),
  ]),
  float: lessonQuiz([
    why(
      q(
        'q1',
        '`float: left` rasmga berilsa nima bo‘ladi?',
        [
          'Matn rasm atrofidan oqib o‘tadi',
          'Rasm yashirinadi',
          'Rasm sahifa markaziga o‘tadi',
          'Hech narsa',
        ],
        [0],
      ),
      'Float jurnal maqolalaridagi rasm atrofidagi matn uchun mo‘ljallangan.',
    ),
    why(
      tf('q2', 'Bugun sahifa maketini float bilan qurish tavsiya etiladi.', false),
      'Maket uchun Flexbox va Grid ishlating.',
    ),
    why(
      q(
        'q3',
        'Chapga suzayotgan rasmga qaysi tomondan margin berish kerak?',
        ['O‘ng tomondan', 'Chap tomondan', 'Yuqoridan', 'Margin kerak emas'],
        [0],
      ),
      'Matn rasmga yopishmasligi uchun ichki tomondan bo‘shliq kerak.',
    ),
    why(
      match('q4', 'Qiymatni natijasi bilan moslang.', [
        ['left', 'Chapga suzadi'],
        ['right', 'O‘ngga suzadi'],
        ['none', 'Suzmaydi (standart)'],
      ]),
      'Suzayotgan elementga kenglik ham bering.',
    ),
  ]),
  clear: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Element ikkala tomondagi suzuvchilar ostidan boshlansin.',
        'footer {\n  clear: {{1}};\n}',
        ['both'],
      ),
      '`left` va `right` faqat bir tomonni hisobga oladi.',
    ),
    why(
      q(
        'q2',
        'Suzayotgan bolalarni o‘rash (ota balandligini tiklash) uchun zamonaviy usul qaysi?',
        ['display: flow-root;', 'clearfix hack', 'height: 100%;', 'float: none;'],
        [0],
      ),
      '`flow-root` eski clearfix usulini almashtiradi.',
    ),
    why(
      tf(
        'q3',
        'Ichida faqat suzayotgan elementlar bo‘lgan ota blokning balandligi 0 ga tushib qolishi mumkin.',
        true,
      ),
      'Float elementlar oqimdan chiqadi, ota ularni “ko‘rmaydi”.',
    ),
    why(
      tf('q4', 'Clearfix — bugun ham eng yaxshi yechim.', false),
      'Bu eski usul; `display: flow-root` sodda va aniq.',
    ),
  ]),
  'inline-block': lessonQuiz([
    why(
      sortInto('q1', '`inline-block` ning xususiyatlarini ajrating.', {
        Ha: ['Bir qatorda turadi', 'width va height ishlaydi', 'Vertikal padding joy oladi'],
        "Yo'q": ['Har doim yangi qatordan boshlanadi'],
      }),
      'U `inline` va `block` ning yaxshi tomonlarini birlashtiradi.',
    ),
    why(
      q(
        'q2',
        '`inline-block` elementlar orasida kutilmagan kichik bo‘sh joy paydo bo‘ladi. Sababi?',
        [
          'HTML’dagi bo‘sh joy va qator o‘tishlari',
          'Margin standart 4px',
          'Brauzer xatosi',
          'padding',
        ],
        [0],
      ),
      'Ular matn kabi oqimda turadi, shuning uchun so‘zlar orasidagi bo‘sh joy ham ko‘rinadi.',
    ),
    why(
      codeFill(
        'q3',
        'Yorliqlarni vertikal markazga tekislang.',
        '.yorliq {\n  display: inline-block;\n  vertical-align: {{1}};\n}',
        ['middle'],
      ),
      '`vertical-align` qator elementlarini tekislaydi.',
    ),
    why(
      tf('q4', 'Murakkab qatorli maket uchun `inline-block` dan ko‘ra Flexbox qulayroq.', true),
      'Flexbox bo‘sh joy muammosisiz tekislash va taqsimlashni beradi.',
    ),
  ]),

  // ---- 7. Selektorlar va kaskad ---------------------------------------------------------
  combinators: lessonQuiz([
    why(
      match('q1', 'Kombinatorni nimani tanlashi bilan moslang.', [
        ['A B', 'A ichidagi istalgan chuqurlikdagi B'],
        ['A > B', 'A ning bevosita bolasi B'],
        ['A + B', 'A dan darhol keyin kelgan B'],
        ['A ~ B', 'A dan keyin kelgan barcha qo‘shni B lar'],
      ]),
      'Avlod kombinatori — oddiy bo‘sh joy.',
    ),
    why(
      codeFill(
        'q2',
        'Ro‘yxat bandlari orasiga masofa bering (birinchisidan oldin emas).',
        'li {{1}} li {\n  margin-top: 8px;\n}',
        ['+'],
      ),
      '`li + li` — oldida qo‘shnisi bor har bir band.',
    ),
    why(
      q(
        'q3',
        '`nav > ul` qaysi `ul` ni tanlaydi?',
        [
          'Faqat nav ning bevosita bolasi bo‘lgan ul',
          'nav ichidagi barcha ul',
          'nav dan keyingi ul',
          'Hech qaysi',
        ],
        [0],
      ),
      '`>` faqat bir daraja pastni tanlaydi.',
    ),
    why(
      tf('q4', 'Uzun, ko‘p qismli selektorlar yozish yaxshi amaliyot.', false),
      'Qisqa selektorlarni keyin qayta yozish oson.',
    ),
  ]),
  'pseudo-classes': lessonQuiz([
    why(
      match('q1', 'Psevdoklassni nimani tanlashi bilan moslang.', [
        [':first-child', 'Otasining birinchi bolasi'],
        [':nth-child(odd)', 'Toq o‘rindagilar (1, 3, 5…)'],
        [':nth-child(3n)', 'Har uchinchisi (3, 6, 9…)'],
        [':checked', 'Belgilangan checkbox yoki radio'],
      ]),
      '`:empty` — ichi bo‘sh element, `:only-child` — yagona bola.',
    ),
    why(
      codeFill(
        'q2',
        'Jadvalning juft qatorlarini bo‘yang.',
        'tr:nth-child({{1}}) {\n  background: #f5faff;\n}',
        ['even'],
      ),
      '`even` — juft, `odd` — toq; `2n` ham juft.',
    ),
    why(
      sortInto('q3', 'Psevdoklasslarni turiga ajrating.', {
        Holat: [':hover', ':focus-visible', ':disabled'],
        Tuzilma: [':last-child', ':first-of-type'],
        Mantiq: [':not()', ':is()', ':has()'],
      }),
      'Holat foydalanuvchi harakatiga, tuzilma — HTML’dagi o‘ringa bog‘liq.',
    ),
    why(
      tf(
        'q4',
        '`:focus-visible` faqat klaviatura bilan fokuslanganda ishlaydi, `:focus` esa har qanday usulda.',
        true,
      ),
      'Sichqoncha bilan bosilganda fokus halqasi ko‘rinmasligi uchun `:focus-visible` qulay.',
    ),
  ]),
  'pseudo-elements': lessonQuiz([
    why(
      codeFill(
        'q1',
        '`::before` ishlashi uchun majburiy xususiyatni yozing.',
        '.yangi::before {\n  {{1}}: "★ ";\n}',
        ['content'],
      ),
      '`content` bo‘lmasa psevdoelement yaratilmaydi (bo‘sh bo‘lsa ham `""` yoziladi).',
    ),
    why(
      match('q2', 'Psevdoelementni nimani tanlashi bilan moslang.', [
        ['::first-letter', 'Birinchi harf'],
        ['::first-line', 'Birinchi qator'],
        ['::selection', 'Foydalanuvchi belgilagan matn'],
        ['::placeholder', 'Maydondagi namuna matn'],
      ]),
      '`::marker` — ro‘yxat belgisi.',
    ),
    why(
      tf('q3', 'Muhim ma’lumotni `::after` ichidagi `content` ga yozish yaxshi amaliyot.', false),
      'Uni nusxalab bo‘lmaydi va ba’zi ekran o‘qiydigan dasturlar o‘qimaydi.',
    ),
    why(
      q(
        'q4',
        'Psevdoelementlar qaysi belgi bilan yoziladi?',
        ['Ikki ikki nuqta (::)', 'Bitta ikki nuqta (:)', 'Nuqta (.)', 'Panjara (#)'],
        [0],
      ),
      '`::` psevdoelementni psevdoklassdan ajratadi (eski `:before` ham ishlaydi).',
    ),
  ]),
  'attribute-selectors': lessonQuiz([
    why(
      match('q1', 'Selektorni ma’nosi bilan moslang.', [
        ['[href^="https"]', 'https bilan boshlanadi'],
        ['[href$=".pdf"]', '.pdf bilan tugaydi'],
        ['[href*="youtube"]', 'Ichida youtube bor'],
        ['[title]', 'title atributi bor'],
      ]),
      '`[atr="q"]` — qiymat aynan teng.',
    ),
    why(
      codeFill(
        'q2',
        'Email maydonlarini tanlang.',
        'input[type{{1}}"email"] {\n  border-color: teal;\n}',
        ['='],
      ),
      'Aniq qiymat uchun `=`.',
    ),
    why(
      q(
        'q3',
        'Ochilgan menyu tugmasini holatiga qarab bezash uchun qaysi selektor qulay?',
        ['[aria-expanded="true"]', '.ochiq-menyu-tugma-2', '#tugma', 'button:first-child'],
        [0],
      ),
      '`aria-*` va `data-*` atributlari holatni bildiradi — uslubni ham ularga bog‘lash qulay.',
    ),
    why(
      tf(
        'q4',
        '`[class~="faol"]` bo‘sh joy bilan ajratilgan ro‘yxatda aynan `faol` so‘zi bor elementni tanlaydi.',
        true,
      ),
      'Masalan, `class="tugma faol"`.',
    ),
  ]),
  specificity: lessonQuiz([
    why(
      order('q1', 'Selektorlarni maxsusligi bo‘yicha kuchsizdan kuchliga tartiblang.', [
        'p',
        '.matn',
        'p.matn',
        '#asosiy',
      ]),
      '(0,0,1) < (0,1,0) < (0,1,1) < (1,0,0).',
    ),
    why(
      fill(
        'q2',
        '`nav .menyu a:hover` maxsusligini yozing (ID, klass, teg).',
        '({{1}}, {{2}}, {{3}})',
        ['0', '2', '2'],
      ),
      '`.menyu` va `:hover` — 2 ta klass ustuni, `nav` va `a` — 2 ta teg.',
    ),
    why(
      q(
        'q3',
        '`:where()` ichidagi selektorning maxsusligi qancha?',
        ['Doim nol', 'Eng kuchli selektornikiday', 'Har doim (0,1,0)', 'Inline uslubdek'],
        [0],
      ),
      '`:is()` va `:not()` esa ichidagi eng kuchli selektor maxsusligini oladi.',
    ),
    why(
      order('q4', 'Kaskadda qoidani tanlash mezonlari tartibini joylang.', [
        'Muhimlik',
        'Maxsuslik',
        'Tartib',
      ]),
      'Maxsuslik teng bo‘lsa, keyinroq yozilgan qoida ustun keladi.',
    ),
  ]),

  // ---- 8. Amaliy komponentlar -----------------------------------------------------------
  opacity: lessonQuiz([
    why(
      match('q1', 'Usulni ta’sir doirasi bilan moslang.', [
        ['opacity: 0.6', 'Butun element va uning bolalari'],
        ['rgb(0 0 0 / 0.6)', 'Faqat shu rang (masalan, fon)'],
      ]),
      'Matn to‘liq ko‘rinishi kerak bo‘lsa, alfa kanalli rang ishlating.',
    ),
    why(
      tf(
        'q2',
        '`opacity: 0` bo‘lgan elementni hali ham bosish va ekran o‘qiydigan dastur bilan o‘qish mumkin.',
        true,
      ),
      'U faqat ko‘zga ko‘rinmaydi; to‘liq yashirish uchun `display: none` yoki `visibility: hidden`.',
    ),
    why(
      q(
        'q3',
        '`opacity` qanday oraliqda bo‘ladi?',
        ['0 dan 1 gacha', '0 dan 100 gacha', '0 dan 255 gacha', '-1 dan 1 gacha'],
        [0],
      ),
      '1 — to‘liq ko‘rinadi, 0 — to‘liq shaffof.',
    ),
    why(
      codeFill('q4', 'Rasm sichqoncha ustida xiralashsin.', 'img:{{1}} {\n  opacity: 0.8;\n}', [
        'hover',
      ]),
      'Hover effekti uchun `transition` qo‘shsangiz, o‘zgarish silliq bo‘ladi.',
    ),
  ]),
  'navbar-vertical': lessonQuiz([
    why(
      order('q1', 'Vertikal menyu qurish qadamlarini tartiblang.', [
        'nav ichida ul ro‘yxat yozish',
        'list-style, margin va padding ni tozalash',
        'Havolalarni display: block qilish',
        'Hover va joriy sahifa uslubi',
      ]),
      'Menyu — `nav` ichidagi ro‘yxat.',
    ),
    why(
      q(
        'q2',
        'Havolaga `display: block` berishdan foyda nima?',
        [
          'Butun qator bosiladigan bo‘ladi',
          'Havola yashirinadi',
          'Matn qalin bo‘ladi',
          'Havola yangi tabda ochiladi',
        ],
        [0],
      ),
      'Bosiladigan maydon kattaroq — foydalanish qulay.',
    ),
    why(
      codeFill(
        'q3',
        'Joriy sahifa havolasini belgilang.',
        '<a href="kurslar.html" aria-current="{{1}}">Kurslar</a>',
        ['page'],
      ),
      'CSS’da `[aria-current="page"]` bilan bezash mumkin.',
    ),
    why(
      tf(
        'q4',
        'Yon menyuni `position: sticky` bilan aylantirishda ko‘rinib turadigan qilish mumkin.',
        true,
      ),
      'Yopishqoq yon menyu uzun sahifalarda qulay.',
    ),
  ]),
  'navbar-horizontal': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Logo chapda, menyu o‘ngda tursin.',
        'header {\n  display: flex;\n  justify-content: {{1}};\n}',
        ['space-between'],
      ),
      'Bo‘sh joy ikki element orasiga taqsimlanadi.',
    ),
    why(
      q(
        'q2',
        'Flex menyudagi bitta bandni (masalan, “Kirish”) o‘ng chetga qanday surasiz?',
        ['margin-left: auto;', 'float: right;', 'text-align: right;', 'position: right;'],
        [0],
      ),
      '`auto` margin bo‘sh joyning hammasini egallaydi.',
    ),
    why(
      sortInto('q3', 'Kichik ekranlarda gorizontal menyu muammosining yechimlari?', {
        Yechim: ['flex-wrap: wrap', 'overflow-x: auto', '☰ tugmasi bilan ochiladigan menyu'],
        'Yechim emas': ['Shriftni 6px qilish', 'Menyuni butunlay o‘chirish'],
      }),
      'Menyu telefonda ham ishlatiladigan bo‘lishi kerak.',
    ),
    why(
      tf('q4', 'Bandlar orasidagi masofani `gap` bilan berish mumkin.', true),
      '`display: flex` + `gap` — eng sodda gorizontal menyu.',
    ),
  ]),
  dropdowns: lessonQuiz([
    why(
      match('q1', 'Qoidani vazifasi bilan moslang.', [
        ['.dropdown { position: relative }', 'Menyu shu otaga nisbatan joylashadi'],
        ['.menyu { top: 100% }', 'Menyu tugmaning aynan ostidan boshlanadi'],
        ['.menyu { z-index: 20 }', 'Menyu boshqa kontent ustida turadi'],
      ]),
      'Menyuning o‘zi `position: absolute`.',
    ),
    why(
      tf(
        'q2',
        'Dropdown’ni faqat `:hover` bilan ochish barcha foydalanuvchilar uchun yetarli.',
        false,
      ),
      'Telefonda va klaviaturada “ustiga kelish” yo‘q.',
    ),
    why(
      codeFill(
        'q3',
        'Klaviatura bilan ichidagi havolaga o‘tganda ham menyu ochiq qolsin.',
        '.dropdown:hover .menyu,\n.dropdown:{{1}} .menyu {\n  display: block;\n}',
        ['focus-within'],
      ),
      '`:focus-within` ichidagi biror element fokusda bo‘lsa ishlaydi.',
    ),
    why(
      q(
        'q4',
        'JavaScript’siz ochiladigan menyu uchun qaysi HTML elementidan foydalanish mumkin?',
        ['<details> va <summary>', '<select>', '<menu>', '<dialog> har doim'],
        [0],
      ),
      'Eng qulay variant — bosish bilan ochiladigan tugma (`aria-expanded` bilan).',
    ),
  ]),
  'image-gallery': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Moslashuvchan to‘rni yozing.',
        '.galereya {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, {{1}}(180px, 1fr));\n}',
        ['minmax'],
      ),
      'Ustunlar soni ekran kengligiga qarab o‘zgaradi.',
    ),
    why(
      match('q2', 'Xususiyatni vazifasi bilan moslang.', [
        ['aspect-ratio: 4 / 3', 'Hamma rasmlar bir xil nisbatda'],
        ['object-fit: cover', 'Rasm cho‘zilmay, ortiqchasi kesiladi'],
        ['overflow: hidden', 'Rasm yumaloq burchak bo‘ylab kesiladi'],
        ['display: block', 'Rasm ostidagi kichik bo‘shliq yo‘qoladi'],
      ]),
      'Bularning hammasi galereya kartochkasida birga ishlatiladi.',
    ),
    why(
      q(
        'q3',
        'Rasm va uning izohi uchun qaysi HTML juftligi to‘g‘ri?',
        [
          '<figure> + <figcaption>',
          '<div> + <span>',
          '<img> + <p class="izoh">',
          '<picture> + <label>',
        ],
        [0],
      ),
      '`figure` ning standart marginini CSS’da olib tashlash odatiy.',
    ),
    why(
      tf('q4', 'Galereyadagi rasmlarga ham mazmunli `alt` kerak.', true),
      'Ko‘rmaydigan foydalanuvchi rasmda nima borligini `alt` dan biladi.',
    ),
  ]),
  'image-sprites': lessonQuiz([
    why(
      q(
        'q1',
        'Sprayt nima?',
        [
          'Bir faylga joylangan ko‘p rasm, kerakli qismi background-position bilan ko‘rsatiladi',
          'Animatsiyali GIF',
          'SVG ikonkalar to‘plami',
          'Rasmning kichik nusxasi',
        ],
        [0],
      ),
      'Element o‘lchami “oyna”, rasm esa uning ortida suriladi.',
    ),
    why(
      match('q2', '`background-position` ni ma’nosi bilan moslang.', [
        ['0 0', 'Rasmning chap yuqori burchagi'],
        ['-32px 0', 'Rasm 32px chapga surilgan'],
        ['0 -32px', 'Rasm 32px yuqoriga surilgan'],
      ]),
      'Manfiy pozitsiya rasmni suradi va keyingi kadrni ko‘rsatadi.',
    ),
    why(
      tf('q3', 'Bugun ikonkalar uchun spraytdan ko‘ra SVG afzalroq.', true),
      'SVG har o‘lchamda tiniq va rangini CSS bilan o‘zgartirish mumkin.',
    ),
    why(
      q(
        'q4',
        'Spraytlar bugun ham qayerda uchraydi?',
        [
          'O‘yinlarda personaj kadrlari uchun',
          'Matn shriftlari uchun',
          'Jadvallarda',
          'Formalarda',
        ],
        [0],
      ),
      'Shuningdek eski loyihalar va `steps()` bilan kadrma-kadr animatsiyalarda.',
    ),
  ]),
  forms: lessonQuiz([
    why(
      sortInto('q1', 'Maydonning asosiy uslubidagi qoidalarni vazifasiga ajrating.', {
        'Kenglik ota’dan chiqmasin': ['width: 100%', 'box-sizing: border-box'],
        'Matn qulay bo‘lsin': ['font: inherit', 'padding: 10px 12px'],
      }),
      'Standart holda maydon kichikroq tizim shriftida bo‘ladi.',
    ),
    why(
      codeFill('q2', 'Checkbox va radio rangini o‘zgartiring.', 'input {\n  {{1}}: #0071dc;\n}', [
        'accent-color',
      ]),
      '`accent-color` brauzerning o‘z elementlarini bo‘yaydi.',
    ),
    why(
      q(
        'q3',
        'Foydalanuvchi maydonga tegib, noto‘g‘ri qiymat kiritgandan keyingina xato ko‘rsatadigan psevdoklass?',
        [':user-invalid', ':invalid', ':empty', ':disabled'],
        [0],
      ),
      '`:invalid` sahifa ochilishi bilan ham ishlab, bo‘sh formani qizil qilib qo‘yadi.',
    ),
    why(
      tf('q4', 'Maydonning fokus holati aniq ko‘rinib turishi kerak.', true),
      'Klaviatura foydalanuvchisi qayerda ekanini shundan biladi.',
    ),
  ]),
  counters: lessonQuiz([
    why(
      order('q1', 'Hisoblagich bilan ishlash qadamlarini tartiblang.', [
        'counter-reset: bolim',
        'counter-increment: bolim',
        'content: counter(bolim)',
      ]),
      'Yaratish → oshirish → chiqarish.',
    ),
    why(
      codeFill(
        'q2',
        'Sarlavha oldiga raqam chiqaring.',
        'h2::before {\n  counter-increment: bolim;\n  content: {{1}}(bolim) ". ";\n}',
        ['counter'],
      ),
      '`counter()` joriy qiymatni `content` da chiqaradi.',
    ),
    why(
      tf(
        'q3',
        'Ko‘rsatma qadamlari kabi ma’noli raqamlar uchun HTML’da `<ol>` ishlatish yaxshiroq.',
        true,
      ),
      '`<ol>` o‘zi raqamlanadi va ekran o‘qiydigan dastur raqamni o‘qiydi.',
    ),
    why(
      q(
        'q4',
        '“1.1, 1.2, 2.1” kabi ichma-ich raqamlash uchun nima kerak?',
        ['Ikkita hisoblagich', 'Bitta hisoblagich', 'JavaScript', 'Jadval'],
        [0],
      ),
      'Biri bo‘limlar, ikkinchisi ichki bandlar uchun.',
    ),
  ]),

  // ---- 9. Birliklar va funksiyalar ---------------------------------------------------
  units: lessonQuiz([
    why(
      match('q1', 'Birlikni nimaga nisbatan ekanligi bilan moslang.', [
        ['rem', 'Ildiz (html) elementning shrifti'],
        ['em', 'Elementning shrifti'],
        ['vw', 'Oyna kengligining 1%'],
        ['ch', '“0” belgisining kengligi'],
      ]),
      '`px` — mutlaq piksel; `%` — ota elementga nisbatan.',
    ),
    why(
      sortInto('q2', 'Vazifaga tavsiya etilgan birlikni tanlang.', {
        rem: ['Shrift o‘lchami'],
        em: ['Tugmadagi padding'],
        px: ['Chegara qalinligi'],
        dvh: ['To‘liq ekranli blok balandligi'],
      }),
      '`dvh` telefonda manzil paneli o‘zgarishini hisobga oladi.',
    ),
    why(
      tf('q3', '`padding-top: 10%` ota elementning balandligidan hisoblanadi.', false),
      'Foizli padding va margin doim ota **kengligidan** hisoblanadi.',
    ),
    why(
      fill('q4', 'Hisoblang.', 'html shrifti 16px bo‘lsa, 1.25rem = {{1}}px', ['20']),
      '1.25 × 16 = 20.',
    ),
  ]),
  'math-functions': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Suyuq sarlavha o‘lchamini yozing.',
        'h1 {\n  font-size: {{1}}(1.75rem, 4vw + 1rem, 3rem);\n}',
        ['clamp'],
      ),
      '`clamp(min, ideal, max)`.',
    ),
    why(
      match('q2', 'Funksiyani vazifasi bilan moslang.', [
        ['calc()', 'Har xil birliklarni aralashtirib hisoblash'],
        ['min()', 'Yuqori chegara (eng kichigini oladi)'],
        ['max()', 'Pastki chegara (eng kattasini oladi)'],
      ]),
      'Masalan, `width: min(100%, 700px)`.',
    ),
    why(
      q(
        'q3',
        '`calc()` ichida qaysi yozuv to‘g‘ri?',
        ['calc(100% - 2rem)', 'calc(100%-2rem)', 'calc(100% -2rem)', 'calc[100% - 2rem]'],
        [0],
      ),
      '`+` va `-` atrofida bo‘sh joy majburiy.',
    ),
    why(
      tf(
        'q4',
        'Shrift uchun faqat `vw` ishlatish (`font-size: 5vw`) foydalanuvchi zoom qilganda ham matnni kattalashtiradi.',
        false,
      ),
      'Faqat `vw` zoomga javob bermaydi; `vw + rem` ni `clamp()` ichida ishlating.',
    ),
  ]),
  variables: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Asosiy rangni e’lon qilib ishlating.',
        ':root {\n  {{1}}asosiy: #0071dc;\n}\na {\n  color: {{2}}(--asosiy);\n}',
        ['--', 'var'],
      ),
      'Nom `--` bilan boshlanadi, qiymat `var()` bilan olinadi.',
    ),
    why(
      q(
        'q2',
        'Hamma joyda ishlaydigan (global) o‘zgaruvchi qayerda e’lon qilinadi?',
        [':root', 'body::before', '@media', '#global'],
        [0],
      ),
      '`:root` — sahifaning ildizi (`html`).',
    ),
    why(
      tf(
        'q3',
        'O‘zgaruvchi nomlari katta-kichik harfni farqlaydi: `--Rang` va `--rang` boshqa-boshqa.',
        true,
      ),
      'Nomlarni bir xil uslubda (kichik harf) yozing.',
    ),
    why(
      q(
        'q4',
        '`var(--soya, none)` dagi `none` nima?',
        [
          'O‘zgaruvchi topilmasa ishlatiladigan zaxira qiymat',
          'O‘zgaruvchining yangi qiymati',
          'Xato belgisi',
          'Izoh',
        ],
        [0],
      ),
      'Zaxira qiymat ikkinchi argument sifatida yoziladi.',
    ),
  ]),

  // ---- 10. Bezak effektlari ------------------------------------------------------------
  'border-images': lessonQuiz([
    why(
      tf(
        'q1',
        '`border-image` ishlashi uchun avval oddiy `border` (qalinlik va uslub) berilishi kerak.',
        true,
      ),
      'Chegara bo‘lmasa, uni rasm bilan chizishning joyi ham yo‘q.',
    ),
    why(
      codeFill(
        'q2',
        'Gradientli chegara yozing.',
        '.karta {\n  border: 4px solid;\n  border-image: {{1}}(90deg, #0071dc, #fec400) 1;\n}',
        ['linear-gradient'],
      ),
      'Oxiridagi `1` — `border-image-slice`.',
    ),
    why(
      match('q3', 'Xususiyatni vazifasi bilan moslang.', [
        ['border-image-source', 'Rasm yoki gradient'],
        ['border-image-slice', 'Burchaklar qanchadan kesiladi'],
        ['border-image-repeat', 'Cho‘zish yoki takrorlash'],
      ]),
      '`border-image-width` — chegara rasmining qalinligi.',
    ),
    why(
      tf('q4', '`border-image` `border-radius` bilan birga yumaloq burchak hosil qiladi.', false),
      'Bu cheklov; yumaloq gradient chegara uchun ikki qatlamli fon usuli ishlatiladi.',
    ),
  ]),
  'background-size': lessonQuiz([
    why(
      tf('q1', 'Bir nechta fon vergul bilan yoziladi va birinchisi eng ustda turadi.', true),
      'Masalan, gradient (ustda) va rasm (ostida).',
    ),
    why(
      match('q2', 'Xususiyatni javob beradigan savol bilan moslang.', [
        ['background-origin', 'Fon rasmi qayerdan boshlanadi?'],
        ['background-clip', 'Fon qayergacha chiziladi?'],
      ]),
      '`background-clip: text` bilan gradientli matn ham qilinadi.',
    ),
    why(
      q(
        'q3',
        'Rasm to‘liq ko‘rinib, maydonda bo‘sh joy qolishiga rozi bo‘lsangiz qaysi qiymat?',
        ['contain', 'cover', 'auto', 'fill'],
        [0],
      ),
      '`cover` esa maydonni to‘liq qoplab, ortiqchasini kesadi.',
    ),
    why(
      codeFill('q4', 'Fon element kengligining yarmi bo‘lsin.', 'background-size: {{1}} auto;', [
        '50%',
      ]),
      'Ikkinchi qiymat `auto` — balandlik nisbatga qarab.',
    ),
  ]),
  'color-keywords': lessonQuiz([
    why(
      match('q1', 'Kalit so‘zni natijasi bilan moslang.', [
        ['inherit', 'Ota elementning qiymatini oladi'],
        ['initial', 'Spetsifikatsiyadagi boshlang‘ich qiymat'],
        ['revert', 'Brauzerning standart uslubiga qaytaradi'],
        ['unset', 'Meros xususiyatda inherit, aks holda initial'],
      ]),
      'Bu so‘zlar har qanday xususiyatda ishlaydi.',
    ),
    why(
      codeFill(
        'q2',
        'Ikonka chegarasi matn rangini olsin.',
        '.ikonka {\n  border: 2px solid {{1}};\n}',
        ['currentColor'],
        false,
      ),
      'Matn rangini o‘zgartirsangiz, chegara ham o‘zgaradi.',
    ),
    why(
      q(
        'q3',
        'Hover’da chegara paydo bo‘lganda element “sakramasligi” uchun boshlang‘ich holatda nima yoziladi?',
        ['border: 2px solid transparent;', 'border: none;', 'border: 0;', 'outline: none;'],
        [0],
      ),
      'Shaffof chegara joy egallaydi — hover’da faqat rang o‘zgaradi.',
    ),
    why(
      fill(
        'q4',
        'Xususiyat nomini yozing.',
        'Brauzerga sahifa yorug‘ va qorong‘i rejimni qo‘llashini {{1}} xususiyati aytadi.',
        ['color-scheme'],
      ),
      'Masalan, `:root { color-scheme: light dark; }` — forma elementlari ham mos rangda chiziladi.',
    ),
  ]),
  'linear-gradients': lessonQuiz([
    why(
      match('q1', 'Burchakni yo‘nalish bilan moslang.', [
        ['0deg', 'Pastdan yuqoriga'],
        ['90deg', 'Chapdan o‘ngga'],
        ['180deg', 'Yuqoridan pastga'],
      ]),
      'Kalit so‘z bilan ham yozish mumkin: `to right`.',
    ),
    why(
      codeFill(
        'q2',
        'Chapdan o‘ngga gradient yozing.',
        'background-image: linear-gradient({{1}}, #0071dc, #fec400);',
        ['to right'],
      ),
      'Gradient `background-image` da yoziladi.',
    ),
    why(
      q(
        'q3',
        'Ikki rang orasida silliq o‘tish emas, keskin chiziq qanday hosil qilinadi?',
        [
          'Ikkala rang bir xil nuqtada to‘xtaydi (masalan, 50% va 50%)',
          'Ranglar sonini oshirish',
          'Burchakni 0 qilish',
          'opacity berish',
        ],
        [0],
      ),
      'Masalan: `#0071dc 50%, #fec400 50%`.',
    ),
    why(
      fill('q4', 'Funksiya nomini yozing.', 'Chiziqli naqshni qaytaradigan gradient — {{1}}.', [
        'repeating-linear-gradient',
      ]),
      'Masalan, chiziqli “ogohlantirish” lentasi.',
    ),
  ]),
  'radial-gradients': lessonQuiz([
    why(
      match('q1', 'Gradient turini natijasi bilan moslang.', [
        ['linear-gradient', 'To‘g‘ri chiziq bo‘ylab o‘tish'],
        ['radial-gradient', 'Markazdan tashqariga doira yoki ellips'],
        ['conic-gradient', 'Markaz atrofida aylanma (diagramma)'],
      ]),
      'Doiraviy diagramma uchun `conic-gradient` qulay.',
    ),
    why(
      codeFill(
        'q2',
        'Gradient markazini chap yuqori burchakka qo‘ying.',
        'background: radial-gradient(circle {{1}} top left, #fff, #0071dc);',
        ['at'],
      ),
      'Yozilishi: `radial-gradient(shakl o‘lcham at markaz, ranglar)`.',
    ),
    why(
      q(
        'q3',
        'Radial gradientning standart o‘lchami qaysi?',
        ['farthest-corner', 'closest-side', '50px', 'contain'],
        [0],
      ),
      'Gradient eng uzoq burchakkacha yetadi.',
    ),
    why(
      tf(
        'q4',
        'Kichik radial gradient + `background-size` bilan nuqtali naqsh yasash mumkin.',
        true,
      ),
      'Gradient kichik katakda takrorlanib, nuqtalar to‘rini hosil qiladi.',
    ),
  ]),
  'box-shadow': lessonQuiz([
    why(
      order('q1', '`box-shadow` qiymatlari tartibini joylang.', [
        'Gorizontal siljish',
        'Vertikal siljish',
        'Xiralik',
        'Yoyilish',
        'Rang',
      ]),
      '`inset` qo‘shilsa — ichki soya.',
    ),
    why(
      codeFill('q2', 'Ichki soya yozing.', 'box-shadow: {{1}} 0 2px 4px rgb(0 0 0 / 0.2);', [
        'inset',
      ]),
      '`inset` boshida yoki oxirida yoziladi.',
    ),
    why(
      q(
        'q3',
        'Joy egallamaydigan fokus halqasi uchun qaysi soya qulay?',
        ['0 0 0 3px #0071dc', '10px 10px 0 black', '0 20px 40px gray', 'inset 0 0 50px red'],
        [0],
      ),
      'Siljish va xiraliksiz, faqat yoyilish — aniq halqa.',
    ),
    why(
      tf('q4', 'Tabiiy soya odatda yumshoq, shaffof va ko‘pincha ikki qatlamli bo‘ladi.', true),
      'Qora, keskin soya “arzon” ko‘rinadi.',
    ),
  ]),

  // ---- 11. Transformatsiya va animatsiya ---------------------------------------------
  'transforms-2d': lessonQuiz([
    why(
      match('q1', 'Funksiyani vazifasi bilan moslang.', [
        ['translate()', 'Surish'],
        ['rotate()', 'Aylantirish'],
        ['scale()', 'Kattalashtirish yoki kichraytirish'],
        ['skew()', 'Qiyshaytirish'],
      ]),
      'Transformatsiya joyni o‘zgartirmaydi — qo‘shnilar surilmaydi.',
    ),
    why(
      tf('q2', '`transform` dagi funksiyalar tartibi natijaga ta’sir qiladi.', true),
      '`rotate(45deg) translateX(50px)` va `translateX(50px) rotate(45deg)` turli natija beradi.',
    ),
    why(
      codeFill(
        'q3',
        'Aylanish chap yuqori burchak atrofida bo‘lsin.',
        '.belgi {\n  {{1}}: top left;\n  rotate: 15deg;\n}',
        ['transform-origin'],
      ),
      'Standart nuqta — markaz.',
    ),
    why(
      q(
        'q4',
        '`translate(-50%, -50%)` dagi foiz nimaga nisbatan?',
        ['Elementning o‘z o‘lchamiga', 'Ota elementga', 'Oynaga', 'Shrift o‘lchamiga'],
        [0],
      ),
      'Shuning uchun u elementni aniq markazlashda qo‘l keladi.',
    ),
  ]),
  'transforms-3d': lessonQuiz([
    why(
      match('q1', 'Funksiyani harakati bilan moslang.', [
        ['rotateX()', 'Gorizontal o‘q atrofida (oldinga-orqaga egiladi)'],
        ['rotateY()', 'Vertikal o‘q atrofida (eshikdek buriladi)'],
        ['translateZ()', 'Ko‘ruvchiga yaqinlashtirish yoki uzoqlashtirish'],
      ]),
      '`rotateZ()` — oddiy `rotate()` bilan bir xil.',
    ),
    why(
      q(
        'q2',
        '3D chuqurlik hissi uchun ota elementga nima beriladi?',
        ['perspective', 'z-index', 'depth', 'opacity'],
        [0],
      ),
      'Masalan, `perspective: 800px`.',
    ),
    why(
      sortInto('q3', 'Ag‘dariladigan kartochkada qaysi qoida qayerga yoziladi?', {
        'Ichki kartochka': ['transform-style: preserve-3d'],
        'Har bir tomon': ['backface-visibility: hidden'],
        'Orqa tomon': ['transform: rotateY(180deg)'],
      }),
      'Orqa tomon oldindan 180° buriladi; ag‘darilganda u to‘g‘ri ko‘rinadi.',
    ),
    why(
      tf(
        'q4',
        'Muhim ma’lumotni faqat kartochka ag‘darilgandagina ko‘rsatish yaxshi amaliyot.',
        false,
      ),
      'Klaviatura va sensorli ekran foydalanuvchilari uni ko‘rmay qolishi mumkin.',
    ),
  ]),
  transitions: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Fon rangi 0.3 soniyada silliq o‘zgarsin.',
        '.tugma {\n  transition: {{1}} 0.3s ease-out;\n}',
        ['background-color'],
      ),
      '`transition` boshlang‘ich holatga (hover’ga emas) yoziladi.',
    ),
    why(
      match('q2', 'Tezlik egri chizig‘ini harakat bilan moslang.', [
        ['linear', 'Bir xil tezlikda'],
        ['ease-in', 'Sekin boshlanadi'],
        ['ease-out', 'Sekin tugaydi — interfeys uchun eng tabiiy'],
        ['ease', 'Sekin boshlanib, tezlashib, sekin tugaydi (standart)'],
      ]),
      'O‘z egri chizig‘ingiz: `cubic-bezier(…)`.',
    ),
    why(
      q(
        'q3',
        'Hover kabi kichik o‘zgarishlar uchun qaysi davomiylik mos?',
        ['150–300ms', '1–2 soniya', '5 soniya', '10ms'],
        [0],
      ),
      '1 soniyadan uzun o‘tishlar interfeysni “sekin” his qildiradi.',
    ),
    why(
      sortInto('q4', 'Qaysi xususiyatlar eng silliq animatsiya qilinadi?', {
        'Eng silliq': ['transform', 'opacity'],
        'Og‘irroq (qayta chizish/joylash)': ['width', 'top', 'margin'],
      }),
      '`transform` va `opacity` maketni qayta hisoblatmaydi.',
    ),
  ]),

  // ---- 12. Rasmlar va interfeys -------------------------------------------------------
  tooltips: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Tooltipni gorizontal markazga qo‘ying.',
        '.tooltip {\n  position: absolute;\n  left: 50%;\n  transform: translateX({{1}});\n}',
        ['-50%'],
      ),
      '`left: 50%` chap chetni markazga qo‘yadi, `-50%` esa tooltipni o‘z kengligining yarmiga qaytaradi.',
    ),
    why(
      q(
        'q2',
        'Ko‘rinmas tooltip sichqonchaga xalaqit bermasligi uchun nima yoziladi?',
        ['pointer-events: none;', 'cursor: none;', 'z-index: -1;', 'user-select: none;'],
        [0],
      ),
      'Yashirish `opacity: 0` bilan qilinsa, element hali ham bosiladi.',
    ),
    why(
      codeFill(
        'q3',
        'Tooltip matnini tugmaning tavsifi sifatida bog‘lang.',
        '<button aria-{{1}}="maslahat-1">Saqlash</button>\n<span id="maslahat-1" role="tooltip">Ctrl + S</span>',
        ['describedby'],
      ),
      'Ekran o‘qiydigan dastur tavsifni tugma nomidan keyin o‘qiydi.',
    ),
    why(
      tf('q4', 'Tooltipga faqat muhim, boshqa joyda yo‘q ma’lumotni yozish kerak.', false),
      'Telefonda hover yo‘q — tooltipda faqat qo‘shimcha ma’lumot bo‘lsin.',
    ),
  ]),
  'image-styling': lessonQuiz([
    why(
      sortInto('q1', '`img` uchun asosiy qoidalarni vazifasiga ajrating.', {
        'Otadan kengaymaydi': ['max-width: 100%'],
        'Nisbat saqlanadi': ['height: auto'],
        'Ostidagi bo‘shliq yo‘qoladi': ['display: block'],
      }),
      'Rasm standart holda qator element — matn chizig‘i ostida kichik bo‘shliq qoladi.',
    ),
    why(
      match('q2', '`filter` funksiyasini natijasi bilan moslang.', [
        ['grayscale(1)', 'Oq-qora'],
        ['blur(4px)', 'Xira'],
        ['sepia(1)', 'Eski surat rangi'],
        ['brightness(1.2)', 'Yorqinroq'],
      ]),
      'Bir nechta filtrni bo‘sh joy bilan qo‘shish mumkin.',
    ),
    why(
      codeFill(
        'q3',
        'Kvadrat avatar yasang.',
        '.avatar {\n  width: 64px;\n  height: 64px;\n  border-radius: 50%;\n  object-fit: {{1}};\n}',
        ['cover'],
      ),
      'Rasm cho‘zilmay doirani to‘ldiradi.',
    ),
    why(
      tf('q4', 'Faqat bezak uchun qo‘yilgan rasmga bo‘sh `alt=""` beriladi.', true),
      'Ekran o‘qiydigan dastur uni o‘tkazib yuboradi.',
    ),
  ]),
  'object-fit': lessonQuiz([
    why(
      match('q1', '`object-fit` qiymatini natijasi bilan moslang.', [
        ['fill', 'Qutini to‘ldiradi, rasm cho‘ziladi (standart)'],
        ['cover', 'To‘ldiradi, nisbat saqlanadi, ortiqchasi kesiladi'],
        ['contain', 'Rasm to‘liq ko‘rinadi, bo‘sh joy qolishi mumkin'],
        ['none', 'Asl o‘lchamda, ortiqchasi kesiladi'],
      ]),
      '`scale-down` — `none` va `contain` dan kichigi.',
    ),
    why(
      codeFill(
        'q2',
        'Kesishda rasmning yuqori qismi ko‘rinib qolsin.',
        'img {\n  object-fit: cover;\n  {{1}}: top;\n}',
        ['object-position'],
      ),
      'Masalan, portretda yuz kesilib qolmasligi uchun.',
    ),
    why(
      q(
        'q3',
        'Logotip kabi hech qismi kesilmasligi kerak bo‘lgan rasm uchun qaysi qiymat?',
        ['contain', 'cover', 'fill', 'none'],
        [0],
      ),
      '`contain` rasmni to‘liq sig‘diradi.',
    ),
    why(
      tf('q4', '`object-fit` `<video>` elementida ham ishlaydi.', true),
      'Video ham “almashtiriladigan” element.',
    ),
  ]),
  masking: lessonQuiz([
    why(
      match('q1', '`clip-path` funksiyasini shakli bilan moslang.', [
        ['circle()', 'Doira'],
        ['polygon()', 'Istalgan ko‘pburchak'],
        ['inset()', 'Ichkariga surilgan to‘rtburchak'],
        ['ellipse()', 'Ellips'],
      ]),
      'Masalan, `clip-path: circle(50% at center)`.',
    ),
    why(
      sortInto('q2', 'Qaysi vosita qachon qulay?', {
        'clip-path': ['Aniq geometrik shakl', 'Keskin chet'],
        mask: ['Silliq so‘nish (gradient)', 'Rasm shaffofligi bo‘yicha niqob'],
      }),
      '`clip-path` yozish oson, `mask` ko‘proq imkoniyat beradi.',
    ),
    why(
      codeFill(
        'q3',
        'Rasm pastga qarab silliq so‘nsin.',
        'img {\n  {{1}}: linear-gradient(black, transparent);\n}',
        ['mask-image'],
      ),
      'Niqobning shaffof joyida element ko‘rinmaydi.',
    ),
    why(
      tf('q4', 'Kesilgan (`clip-path`) element joyi ham kichrayadi va qo‘shnilar suriladi.', false),
      'Kesish faqat chizilishni o‘zgartiradi, maketdagi joy o‘zgarmaydi.',
    ),
  ]),
  buttons: lessonQuiz([
    why(
      codeFill(
        'q1',
        'Ikonka va matnni yonma-yon tekislang.',
        '.tugma {\n  display: {{1}};\n  align-items: center;\n  gap: 8px;\n}',
        ['inline-flex'],
      ),
      '`inline-flex` matn oqimida qoladi va ichini flex bilan tekislaydi.',
    ),
    why(
      sortInto('q2', 'Tugma holatlarini psevdoklassga moslang.', {
        Bosilganda: [':active'],
        'Klaviatura fokusi': [':focus-visible'],
        'O‘chirilgan': [':disabled'],
        'Sichqoncha ustida': [':hover'],
      }),
      'Har holat aniq ko‘rinib turishi kerak.',
    ),
    why(
      q(
        'q3',
        'Bosish maydoni uchun tavsiya etilgan eng kam o‘lcham?',
        ['44px', '20px', '12px', '100px'],
        [0],
      ),
      'Barmoq bilan bosish oson bo‘lishi kerak.',
    ),
    why(
      tf('q4', 'Sahifada bitta asosiy tugma, qolganlari ikkinchi darajali bo‘lishi kerak.', true),
      'Foydalanuvchi asosiy harakatni darhol ko‘radi.',
    ),
  ]),
  pagination: lessonQuiz([
    why(
      codeFill('q1', 'Joriy sahifani belgilang.', '<a href="?p=3" aria-current="{{1}}">3</a>', [
        'page',
      ]),
      'Ekran o‘qiydigan dastur “joriy sahifa” deb aytadi.',
    ),
    why(
      q(
        'q2',
        '“‹” strelkali havolaga nima qo‘shish kerak?',
        ['aria-label="Oldingi sahifa"', 'title="‹"', 'class="strelka"', 'Hech narsa'],
        [0],
      ),
      '“‹” belgisi o‘zi hech narsa demaydi.',
    ),
    why(
      tf(
        'q3',
        'Mavjud bo‘lmagan sahifaga olib boradigan strelka ham havola bo‘lib qolishi kerak.',
        false,
      ),
      'Ishlamaydigan strelka havola emas — oddiy, o‘chirilgan ko‘rinishdagi element.',
    ),
    why(
      q(
        'q4',
        'Bir va ikki xonali raqamli kataklar bir xil ko‘rinishi uchun nima beriladi?',
        ['min-width', 'max-width', 'font-size', 'letter-spacing'],
        [0],
      ),
      '`display: grid; place-items: center` bilan raqam katak o‘rtasida turadi.',
    ),
  ]),
  'multi-columns': lessonQuiz([
    why(
      match('q1', 'Xususiyatni vazifasi bilan moslang.', [
        ['column-count', 'Ustunlar soni'],
        ['column-width', 'Ustunning ideal kengligi'],
        ['column-gap', 'Ustunlar orasidagi masofa'],
        ['column-rule', 'Ustunlar orasidagi chiziq'],
      ]),
      '`columns` — `column-width` va `column-count` ning qisqa yozuvi.',
    ),
    why(
      codeFill(
        'q2',
        'Sarlavha barcha ustunlar bo‘ylab cho‘zilsin.',
        'h2 {\n  column-span: {{1}};\n}',
        ['all'],
      ),
      'Aks holda sarlavha bitta ustun ichida qoladi.',
    ),
    why(
      codeFill(
        'q3',
        'Kartochka ikki ustunga bo‘linib ketmasin.',
        '.karta {\n  break-inside: {{1}};\n}',
        ['avoid'],
      ),
      'Kartochka butunligicha bitta ustunda turadi.',
    ),
    why(
      q(
        'q4',
        'Ekran kengligiga qarab ustunlar sonini o‘zi tanlaydigan yozuv qaysi?',
        ['column-width: 220px;', 'column-count: 3;', 'width: 33%;', 'columns: 1;'],
        [0],
      ),
      'Brauzer 220px li ustunlardan nechtasi sig‘sa, shuncha ustun qiladi.',
    ),
  ]),
  'user-interface': lessonQuiz([
    why(
      match('q1', '`cursor` qiymatini ma’nosi bilan moslang.', [
        ['pointer', 'Qo‘l — bosiladigan narsa'],
        ['not-allowed', 'Taqiq — o‘chirilgan'],
        ['grab', 'Sudrash mumkin'],
        ['text', 'Matn kursori'],
      ]),
      'Kursor foydalanuvchiga nima bo‘lishini oldindan ko‘rsatadi.',
    ),
    why(
      codeFill(
        'q2',
        '`#bolim` havolasi bosilganda sahifa silliq aylansin.',
        'html {\n  scroll-behavior: {{1}};\n}',
        ['smooth'],
      ),
      'Harakatni kamaytirishni so‘ragan foydalanuvchilar uchun buni o‘chirish yaxshi.',
    ),
    why(
      q(
        'q3',
        'Yopishqoq sarlavha ostida bo‘lim sarlavhasi qolib ketmasligi uchun bo‘limga nima beriladi?',
        ['scroll-margin-top', 'margin-top', 'padding-top', 'top'],
        [0],
      ),
      'Aylantirish bo‘lim boshidan biroz pastda to‘xtaydi.',
    ),
    why(
      match('q4', 'Xususiyatni vazifasi bilan moslang.', [
        ['resize', 'Foydalanuvchi o‘lchamni o‘zgartira oladimi'],
        ['user-select', 'Matnni belgilash mumkinmi'],
        ['caret-color', 'Matn kiritish kursori rangi'],
      ]),
      '`pointer-events` — element sichqonchaga javob beradimi.',
    ),
  ]),

  // ---- 13. Flexbox --------------------------------------------------------------------
  flexbox: lessonQuiz([
    why(
      match('q1', '`flex-direction: row` da o‘qni boshqaruvchi xususiyat bilan moslang.', [
        ['Asosiy o‘q (gorizontal)', 'justify-content'],
        ['Kesuvchi o‘q (vertikal)', 'align-items'],
      ]),
      '`flex-direction: column` da o‘qlar almashadi.',
    ),
    why(
      tf(
        'q2',
        '`display: flex` faqat konteynerning bevosita bolalarini flex elementga aylantiradi.',
        true,
      ),
      'Nevaralar oddiy oqimda qoladi.',
    ),
    why(
      sortInto('q3', 'Flex konteynerning standart xatti-harakati?', {
        Standart: [
          'Elementlar qatorga tiziladi',
          'Balandlik bo‘yicha cho‘ziladi',
          'Sig‘masa siqiladi',
        ],
        'Standart emas': ['Keyingi qatorga o‘tadi', 'Elementlar markazda turadi'],
      }),
      'Standart: `row`, `align-items: stretch`, `flex-shrink: 1`, `flex-wrap: nowrap`.',
    ),
    why(
      codeFill(
        'q4',
        'Elementlar orasiga 16px masofa bering.',
        '.konteyner {\n  display: flex;\n  {{1}}: 16px;\n}',
        ['gap'],
      ),
      '`gap` faqat elementlar orasiga qo‘yiladi, chetlarga emas.',
    ),
  ]),
  'flex-container': lessonQuiz([
    why(
      match('q1', '`justify-content` qiymatini natijasi bilan moslang.', [
        ['space-between', 'Chetdagilar chekkada, qolgani teng oraliqda'],
        ['space-around', 'Har elementning ikki tomonida teng joy'],
        ['space-evenly', 'Barcha oraliqlar (chetlar ham) teng'],
        ['center', 'Hammasi o‘rtada'],
      ]),
      'Standart — `flex-start`.',
    ),
    why(
      codeFill(
        'q2',
        'Klassik markazlash: element ham gorizontal, ham vertikal markazda.',
        '.quti {\n  display: flex;\n  justify-content: center;\n  align-items: {{1}};\n}',
        ['center'],
      ),
      'Ikki o‘q ham markazda.',
    ),
    why(
      q(
        'q3',
        'Sig‘magan elementlar keyingi qatorga o‘tishi uchun nima yoziladi?',
        ['flex-wrap: wrap;', 'flex-direction: column;', 'overflow: auto;', 'white-space: wrap;'],
        [0],
      ),
      'Standart — `nowrap`.',
    ),
    why(
      match('q4', '`flex-direction` ni yo‘nalish bilan moslang.', [
        ['row', 'Chapdan o‘ngga'],
        ['row-reverse', 'O‘ngdan chapga'],
        ['column', 'Yuqoridan pastga'],
      ]),
      '`column-reverse` — pastdan yuqoriga.',
    ),
  ]),
  'flex-items': lessonQuiz([
    why(
      match('q1', 'Xususiyatni vazifasi bilan moslang.', [
        ['flex-grow', 'Bo‘sh joyni egallab o‘sish'],
        ['flex-shrink', 'Joy yetmasa siqilish'],
        ['flex-basis', 'Boshlang‘ich o‘lcham'],
        ['align-self', 'Bitta elementni kesuvchi o‘qda tekislash'],
      ]),
      '`flex` — uchalasining qisqa yozuvi.',
    ),
    why(
      q(
        'q2',
        'Uchta kartochka teng ulushda kenglikni bo‘lishi uchun har biriga nima yoziladi?',
        ['flex: 1;', 'flex: none;', 'width: auto;', 'order: 1;'],
        [0],
      ),
      '`flex: none` (yoki `flex-shrink: 0`) esa qat’iy o‘lcham.',
    ),
    why(
      tf(
        'q3',
        '`order` HTML’dagi tartibni ham o‘zgartiradi, shuning uchun klaviatura bilan o‘tish tartibi ham o‘zgaradi.',
        false,
      ),
      '`order` faqat vizual tartib — klaviatura va ekran o‘qiydigan dastur HTML tartibida yuradi.',
    ),
    why(
      codeFill('q4', 'Oxirgi bandni o‘ng chetga suring.', '.oxirgi {\n  margin-left: {{1}};\n}', [
        'auto',
      ]),
      '`margin: auto` flex konteynerdagi bo‘sh joyni o‘ziga oladi.',
    ),
  ]),

  // ---- 14. Grid -----------------------------------------------------------------------
  'grid-intro': lessonQuiz([
    why(
      sortInto('q1', 'Vazifaga qaysi vosita mosroq?', {
        Flexbox: ['Menyu', 'Tugmalar guruhi'],
        Grid: ['Sahifa maketi', 'Kartochkalar to‘ri', 'Galereya'],
      }),
      'Flexbox — bir o‘lchamli, Grid — ikki o‘lchamli (qator va ustun).',
    ),
    why(
      codeFill(
        'q2',
        'Uchta teng ustun yasang.',
        '.tor {\n  display: grid;\n  grid-template-columns: 1fr 1fr {{1}};\n}',
        ['1fr'],
      ),
      '`fr` — qolgan joyning ulushi.',
    ),
    why(
      match('q3', 'Atamani ma’nosi bilan moslang.', [
        ['Chiziq (line)', 'Ustun va qatorlarni ajratuvchi, 1 dan raqamlanadi'],
        ['Yo‘l (track)', 'Ikki chiziq orasidagi ustun yoki qator'],
        ['Katak (cell)', 'Bitta ustun va qator kesishmasi'],
        ['Hudud (area)', 'Bir nechta katakdan iborat to‘rtburchak'],
      ]),
      'DevTools grid chiziqlarini raqamlari bilan ko‘rsatadi.',
    ),
    why(
      fill(
        'q4',
        'Hisoblang.',
        '600px kenglikda `grid-template-columns: 1fr 2fr` — ikkinchi ustun {{1}}px.',
        ['400'],
      ),
      '3 ulush: 1 ulush = 200px, 2 ulush = 400px (gap bo‘lmasa).',
    ),
  ]),
  'grid-container': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Kamida 220px li moslashuvchan kartochkalar to‘ri.',
        'grid-template-columns: {{1}}(auto-fill, minmax(220px, 1fr));',
        ['repeat'],
      ),
      'Media so‘rovsiz moslashadigan eng mashhur qator.',
    ),
    why(
      match('q2', 'Kalit so‘zni elementlar kam bo‘lgandagi natijasi bilan moslang.', [
        ['auto-fill', 'Bo‘sh ustunlar saqlanadi — kartochkalar o‘z o‘lchamida'],
        ['auto-fit', 'Bo‘sh ustunlar yo‘qoladi — kartochkalar cho‘ziladi'],
      ]),
      'Farq faqat elementlar ustunlardan kam bo‘lganda ko‘rinadi.',
    ),
    why(
      q(
        'q3',
        'Elementlarni o‘z kataklari ichida ikki o‘qda markazlaydigan qisqa yozuv?',
        [
          'place-items: center;',
          'justify-content: center;',
          'align-content: center;',
          'text-align: center;',
        ],
        [0],
      ),
      '`justify-content`/`align-content` esa butun to‘rni konteyner ichida suradi.',
    ),
    why(
      tf(
        'q4',
        '`grid-template-rows` berilmasa, qatorlar kontentga qarab avtomatik yaratiladi.',
        true,
      ),
      'Bu yashirin (implicit) to‘r.',
    ),
  ]),
  'grid-items': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Element butun kenglikni egallasin.',
        '.sarlavha {\n  grid-column: 1 / {{1}};\n}',
        ['-1'],
      ),
      '`-1` — oxirgi chiziq.',
    ),
    why(
      q(
        'q2',
        '`grid-column: span 2` nimani bildiradi?',
        [
          'Element ikki ustun yo‘lini egallaydi',
          'Element 2-ustunda turadi',
          'Ikki marta takrorlanadi',
          'Ustunlar orasi 2px',
        ],
        [0],
      ),
      '`span` — nechta yo‘l egallashi.',
    ),
    why(
      match('q3', 'Xususiyatni o‘qi bilan moslang.', [
        ['justify-self', 'Gorizontal'],
        ['align-self', 'Vertikal'],
        ['place-self', 'Ikkalasi'],
      ]),
      'Bitta elementni o‘z katagi ichida tekislaydi.',
    ),
    why(
      tf(
        'q4',
        'Ikki elementga bir xil `grid-area: 1 / 1` berib, ularni ustma-ust qo‘yish mumkin.',
        true,
      ),
      'Masalan, rasm ustiga matn.',
    ),
  ]),
  'grid-layout': lessonQuiz([
    why(
      codeFill('q1', 'Elementni nomlangan hududga joylang.', '.yon {\n  {{1}}: yon-panel;\n}', [
        'grid-area',
      ]),
      'Hududlar xaritasi konteynerda `grid-template-areas` bilan chiziladi.',
    ),
    why(
      tf('q2', '`grid-template-areas` da “L” shaklidagi hudud yozish mumkin.', false),
      'Hudud doim to‘rtburchak bo‘lishi kerak, aks holda butun qoida ishlamaydi.',
    ),
    why(
      q(
        'q3',
        'Hududlar xaritasida bo‘sh katak qanday belgilanadi?',
        ['Nuqta (.)', 'Bo‘sh joy', 'none', '0'],
        [0],
      ),
      'Masalan: `". asosiy"`.',
    ),
    why(
      tf(
        'q4',
        'Telefon uchun maketni o‘zgartirishda media so‘rovda faqat hududlar xaritasini qayta yozish kifoya.',
        true,
      ),
      'Elementlarning `grid-area` nomlari o‘zgarmaydi.',
    ),
  ]),

  // ---- 15. Moslashuvchan dizayn -----------------------------------------------------
  'rwd-intro': lessonQuiz([
    why(
      match('q1', 'Tamoyilni vositasi bilan moslang.', [
        ['Suyuq maket', '%, fr, max-width, Flexbox, Grid'],
        ['Moslashuvchan media', 'max-width: 100%'],
        ['Media so‘rovlar', '@media'],
      ]),
      'Moslashuvchan dizaynning uch asosiy tamoyili.',
    ),
    why(
      q(
        'q2',
        '“Mobil birinchi” yondashuvda katta ekranlar uchun qaysi so‘rovlar yoziladi?',
        ['min-width', 'max-width', 'orientation', 'print'],
        [0],
      ),
      'Avval telefon uchun oddiy maket, keyin `min-width` bilan qo‘shimchalar.',
    ),
    why(
      sortInto('q3', 'Mobil birinchi yondashuvning foydalari?', {
        Foyda: [
          'Telefon uslubi sodda',
          'Qo‘shish olib tashlashdan oson',
          'Sekin telefon keraksiz uslubni qayta ishlamaydi',
        ],
        'Foyda emas': ['Media so‘rovlar butunlay kerak bo‘lmaydi'],
      }),
      'Media so‘rovlar baribir kerak, lekin kamroq va soddaroq bo‘ladi.',
    ),
    why(
      tf(
        'q4',
        'Grid `auto-fill`, `clamp()` va `min()` ko‘p hollarda media so‘rovsiz moslashuv beradi.',
        true,
      ),
      'Masalan, `repeat(auto-fill, minmax(220px, 1fr))`.',
    ),
  ]),
  'rwd-viewport': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Viewport tegini yozing.',
        '<meta name="viewport" content="width=device-width, {{1}}=1">',
        ['initial-scale'],
      ),
      'Boshlang‘ich masshtab — 100%.',
    ),
    why(
      tf(
        'q2',
        'Viewport tegiga `user-scalable=no` yozib, kattalashtirishni o‘chirish tavsiya etiladi.',
        false,
      ),
      'Ko‘rish qobiliyati past foydalanuvchilar sahifani kattalashtira olishi kerak.',
    ),
    why(
      match('q3', 'Gorizontal aylantirish sababini yechimi bilan moslang.', [
        ['Qat’iy width: 800px', 'max-width: 800px'],
        ['Uzun havola yoki so‘z', 'overflow-wrap: anywhere'],
        ['Keng jadval', 'O‘ramga overflow-x: auto'],
        ['100vw + aylantirish paneli', '100% ishlatish'],
      ]),
      'Bitta keng element butun sahifani gorizontal aylantiradi.',
    ),
    why(
      q(
        'q4',
        'Viewport tegi bo‘lmasa telefon sahifani qanday ko‘rsatadi?',
        [
          'Keng kompyuter sahifasi kabi chizib, kichraytiradi',
          'Avtomatik moslashtiradi',
          'Sahifani ochmaydi',
          'Faqat matnni ko‘rsatadi',
        ],
        [0],
      ),
      'Natijada matn juda mayda bo‘lib qoladi.',
    ),
  ]),
  'rwd-grid-view': lessonQuiz([
    why(
      codeFill(
        'q1',
        '12 ustunli to‘r yasang.',
        '.qator {\n  display: grid;\n  grid-template-columns: repeat({{1}}, 1fr);\n}',
        ['12'],
      ),
      '12 soni 2, 3, 4 va 6 ga bo‘linadi — maket uchun qulay.',
    ),
    why(
      q(
        'q2',
        '12 ustunli to‘rda yarim kenglikdagi blok uchun nima yoziladi?',
        ['grid-column: span 6;', 'grid-column: span 2;', 'width: 6%;', 'grid-column: 6;'],
        [0],
      ),
      '6 / 12 = yarim.',
    ),
    why(
      tf(
        'q3',
        'Mobil birinchi to‘rda bloklar standart holda `span 12` (to‘liq kenglik) bo‘ladi.',
        true,
      ),
      'Katta ekranda media so‘rov bilan kamroq ustun egallaydi.',
    ),
    why(
      tf('q4', 'Har qanday sahifa uchun albatta 12 ustunli to‘r kerak.', false),
      'Oddiy maket uchun ikki-uch ustunli grid yetarli.',
    ),
  ]),
  'media-queries': lessonQuiz([
    why(
      codeFill(
        'q1',
        '768px va undan keng ekranlar uchun so‘rov yozing.',
        '@media ({{1}}: 768px) {\n  .ustunlar { display: flex; }\n}',
        ['min-width'],
      ),
      'Mobil birinchi yondashuvning asosi.',
    ),
    why(
      match('q2', 'Shartni vazifasi bilan moslang.', [
        ['prefers-color-scheme: dark', 'Qorong‘i rejim'],
        ['prefers-reduced-motion: reduce', 'Harakatni kamaytirish'],
        ['hover: hover', 'Sichqonchali qurilma'],
        ['print', 'Chop etish'],
      ]),
      'Ekran kengligidan tashqari foydali shartlar.',
    ),
    why(
      q(
        'q3',
        'Tanaffus nuqtasini (breakpoint) nima belgilashi kerak?',
        [
          'Kontent (maket qayerda buzilsa)',
          'Mashhur telefon modeli',
          'Har doim 1000px',
          'Brauzer turi',
        ],
        [0],
      ),
      '576/768/1024/1280 — faqat taxminiy yo‘nalish.',
    ),
    why(
      fill(
        'q4',
        'Qoida nomini yozing.',
        'Ekran emas, konteyner kengligiga qarab uslub berish uchun @{{1}} ishlatiladi.',
        ['container'],
      ),
      'Konteyner so‘rovlari komponentni har qanday joyga moslashtiradi.',
    ),
  ]),
  'mq-examples': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Hover effekti faqat sichqonchali qurilmalarda ishlasin.',
        '@media ({{1}}: hover) {\n  .karta:hover { transform: translateY(-4px); }\n}',
        ['hover'],
      ),
      'Telefonda “hover” bosishdan keyin yopishib qoladi.',
    ),
    why(
      tf('q2', 'Telefonda kontentni yashirgandan ko‘ra qayta joylashtirish yaxshiroq.', true),
      'Telefon foydalanuvchisiga ham o‘sha ma’lumot kerak.',
    ),
    why(
      sortInto('q3', 'Media so‘rovlarda eng ko‘p uchraydigan o‘zgarishlar?', {
        'Ko‘p uchraydi': ['Menyu yo‘nalishi', 'Ustunlar soni', 'Shrift o‘lchami'],
        'Kam ishlatiladi': ['Sahifa tilini almashtirish'],
      }),
      'Maket telefonda ustma-ust, kompyuterda yonma-yon.',
    ),
    why(
      codeFill(
        'q4',
        'Chop etishda menyuni yashiring.',
        '@media {{1}} {\n  nav { display: none; }\n}',
        ['print'],
      ),
      'Chop etilganda menyu va tugmalar kerak emas.',
    ),
  ]),
  'rwd-images': lessonQuiz([
    why(
      match('q1', 'Atributni vazifasi bilan moslang.', [
        ['srcset', 'Fayllar va ularning haqiqiy kengligi (w)'],
        ['sizes', 'Rasm sahifada qancha joy egallashi'],
        ['loading="lazy"', 'Pastdagi rasmni ekranga yaqinlashganda yuklash'],
      ]),
      'Brauzer ekran va piksel zichligiga qarab eng mos faylni o‘zi tanlaydi.',
    ),
    why(
      q(
        'q2',
        'Telefonda boshqacha kesilgan (masalan, kvadrat) rasm ko‘rsatish uchun qaysi element?',
        ['<picture>', '<figure>', '<img srcset>', '<canvas>'],
        [0],
      ),
      '`<picture>` ichidagi `<source media>` turli rasm beradi; yangi format uchun ham.',
    ),
    why(
      tf('q3', 'HTML’dagi `width` va `height` atributlari moslashuvchan rasmda kerak emas.', false),
      'Ular nisbatni beradi va yuklanish paytida sahifa “sakramaydi”.',
    ),
    why(
      codeFill('q4', 'Asosiy qoida.', 'img {\n  max-width: 100%;\n  height: {{1}};\n}', ['auto']),
      'Rasm konteynerdan chiqmaydi va proporsiya saqlanadi.',
    ),
  ]),
  'rwd-videos': lessonQuiz([
    why(
      codeFill(
        'q1',
        'Iframe videoni moslashuvchan qiling.',
        'iframe {\n  width: 100%;\n  height: auto;\n  aspect-ratio: {{1}};\n}',
        ['16 / 9'],
      ),
      'Eski usul — padding hiylasi; bugun `aspect-ratio` yetarli.',
    ),
    why(
      tf('q2', 'Brauzerlar `autoplay` ni faqat ovozsiz (`muted`) videoda ishlatadi.', true),
      'Avtomatik ijro baribir chalg‘itishi mumkin.',
    ),
    why(
      q(
        'q3',
        'Iframe’ga qaysi atribut ekran o‘qiydigan dastur uchun kerak?',
        ['title', 'alt', 'name', 'allow'],
        [0],
      ),
      'Masalan: `title="CSS Grid bo‘yicha videodars"`.',
    ),
    why(
      codeFill(
        'q4',
        'Keng ekranda video 900px dan oshmasin va markazda tursin.',
        '.video {\n  max-width: 900px;\n  {{1}}: auto;\n}',
        ['margin-inline'],
      ),
      '`margin-inline` — chap va o‘ng marginlar.',
    ),
  ]),
};
