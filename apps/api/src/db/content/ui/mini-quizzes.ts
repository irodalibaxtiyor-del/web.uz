import { codeFill, fill, miniQuiz, order, q, sortInto, tf, why, type QuizDef } from '../helpers';

/** Exercise mini-tests of the "UI asoslari" course: three questions per exercise. */
export const UI_MINI_QUIZZES: Record<string, QuizDef> = {
  'rang-modellari': miniQuiz([
    why(
      sortInto('q1', 'Yozuvlarni modelga ajrating.', {
        HEX: ['#0071dc'],
        RGB: ['rgb(254 196 0)'],
        HSL: ['hsl(210 100% 43%)'],
      }),
      'Bir rangning turli yozuvlari.',
    ),
    why(
      tf('q2', 'Sariq fonda to‘q (`#0e1133`) matn o‘qilishi uchun kerak.', true),
      'Kontrast yetarli bo‘lishi kerak.',
    ),
    why(
      q(
        'q3',
        'Faqat fon shaffof bo‘lishi uchun?',
        ['Rangning alfasi (rgb … / 0.5)', 'opacity: 0.5', 'filter', 'visibility'],
        [0],
      ),
      '`opacity` matnni ham xiralashtiradi.',
    ),
  ]),
  'hsl-soyalar': miniQuiz([
    why(
      codeFill(
        'q1',
        'Ton o‘zgaruvchidan.',
        '.ochroq {\n  background-color: hsl({{1}}(--ton) 100% 95%);\n}',
        ['var'],
      ),
      'Bitta tondan soyalar.',
    ),
    why(
      q(
        'q2',
        'Och soya uchun qaysi qiymat katta?',
        ['Yorug‘lik (L)', 'Ton (H)', 'To‘yinganlik (S)', 'Alfa'],
        [0],
      ),
      '95% — juda och.',
    ),
    why(
      tf(
        'q3',
        'Tonni bitta o‘zgaruvchida saqlash butun palitrani bir joydan o‘zgartirish imkonini beradi.',
        true,
      ),
      '`--ton` ni o‘zgartirish kifoya.',
    ),
  ]),
  uygunlik: miniQuiz([
    why(
      codeFill(
        'q1',
        'Komplementar rang.',
        '.komplement {\n  background-color: hsl(calc(var(--h) + {{1}}) 80% 45%);\n}',
        ['180'],
      ),
      'Qarama-qarshi ton.',
    ),
    why(
      q('q2', 'Analog rang uchun qo‘shiladigan burchak?', ['±30', '180', '120', '90'], [0]),
      'Qo‘shni tonlar.',
    ),
    why(fill('q3', 'Triada.', 'Triadaning ikkinchi rangi uchun + {{1}}', ['120']), '+120 va +240.'),
  ]),
  palitra: miniQuiz([
    why(
      codeFill('q1', 'Urg‘u rangini ishlating.', '.tugma {\n  background: {{1}}(--urg);\n}', [
        'var',
      ]),
      'Token orqali.',
    ),
    why(
      order('q2', 'Rollar ulushini kattadan kichikka.', [
        '--fon (60%)',
        '--sirt (30%)',
        '--urg (10%)',
      ]),
      '60-30-10 qoidasi.',
    ),
    why(
      tf('q3', 'Urg‘u rangi kam ishlatilgani uchun e’tiborni tortadi.', true),
      'Hamma joyda bo‘lsa kuchini yo‘qotadi.',
    ),
  ]),
  kontrast: miniQuiz([
    why(
      q('q1', 'Oddiy matn uchun WCAG minimali?', ['4.5:1', '3:1', '2:1', '7:1 majburiy'], [0]),
      'Katta matn — 3:1.',
    ),
    why(
      tf('q2', 'Placeholder ham o‘qilishi kerak — uni ham kontrastga tekshiring.', true),
      'Mashqda `#64748b` (4.8:1).',
    ),
    why(
      q(
        'q3',
        'Och ko‘k tugmada oq matn 2.6:1. Yechim?',
        [
          'Fonni to‘qroq qilish (#005bb5)',
          'Matnni och qilish',
          'Shrift kichraytirish',
          'Soya qo‘shish',
        ],
        [0],
      ),
      'To‘qroq soya kontrastni oshiradi.',
    ),
  ]),
  'rang-tokenlari': miniQuiz([
    why(
      codeFill(
        'q1',
        'Qorong‘i mavzu tokenlari.',
        '[data-theme="{{1}}"] {\n  --fon: #0b1120;\n  --matn: #e2e8f0;\n}',
        ['dark'],
      ),
      'Atribut selektori.',
    ),
    why(
      tf(
        'q2',
        'Komponentlar to‘g‘ridan-to‘g‘ri HEX emas, tokenlarni (`var(--fon)`) ishlatsa, mavzu almashtirish oson.',
        true,
      ),
      'Bitta joydan.',
    ),
    why(
      q(
        'q3',
        'JS bilan mavzuni almashtirish?',
        [
          "document.documentElement.dataset.theme = 'dark'",
          "body.style = 'dark'",
          'location.reload()',
          'CSS faylni o‘chirish',
        ],
        [0],
      ),
      '`data-theme` atributi.',
    ),
  ]),
  'shrift-oilalari': miniQuiz([
    why(
      codeFill(
        'q1',
        'Ro‘yxat oxiri.',
        'body {\n  font-family: system-ui, -apple-system, "Segoe UI", Roboto, {{1}};\n}',
        ['sans-serif'],
      ),
      'Umumiy oila — oxirgi zaxira.',
    ),
    why(
      q('q2', 'Kod uchun oila?', ['monospace', 'serif', 'cursive', 'fantasy'], [0]),
      'Belgilar bir xil kenglikda.',
    ),
    why(
      tf('q3', 'Bo‘sh joyli shrift nomi (`"Segoe UI"`) qo‘shtirnoqda yoziladi.', true),
      'Aks holda noto‘g‘ri o‘qiladi.',
    ),
  ]),
  shkala: miniQuiz([
    why(
      codeFill('q1', 'Shkala tokeni.', 'h1 {\n  font-size: var({{1}});\n}', ['--t-3xl']),
      'Eng katta o‘lcham.',
    ),
    why(fill('q2', 'Hisoblang.', '--t-xl: 1.5rem = {{1}}px', ['24']), '1.5 × 16 = 24 piksel.'),
    why(
      tf(
        'q3',
        'Tasodifiy o‘lchamlar (17px, 23px) o‘rniga shkala tokenlari izchillik beradi.',
        true,
      ),
      'Bir xil mutanosiblik.',
    ),
  ]),
  'qator-oraligi': miniQuiz([
    why(
      codeFill(
        'q1',
        'Katta sarlavha zichroq.',
        'h1 {\n  line-height: 1.15;\n  {{1}}: -0.01em;\n}',
        ['letter-spacing'],
      ),
      'Harflar biroz yaqinlashadi.',
    ),
    why(
      q(
        'q2',
        'Bosh harfli yorliqqa?',
        [
          'letter-spacing: 0.05em (siyraklashtirish)',
          'letter-spacing: -0.05em',
          'line-height: 0',
          'font-size: 2em',
        ],
        [0],
      ),
      'Bosh harflar yopishmasin.',
    ),
    why(tf('q3', 'Oddiy matn uchun `line-height: 1.6` qulay.', true), '1.5–1.7 oralig‘i.'),
  ]),
  'matn-ierarxiyasi': miniQuiz([
    why(
      codeFill('q1', 'Nom kuchliroq.', '.nomi {\n  font-size: 1.25rem;\n  font-weight: {{1}};\n}', [
        '600',
      ]),
      'Yarim qalin.',
    ),
    why(
      q(
        'q2',
        'Kichik toifa yorlig‘i qanday ajratiladi?',
        ['Kichik o‘lcham, qalin, bosh harf, siyrak', 'Juda katta', 'Kursiv va xira', 'Qizil'],
        [0],
      ),
      'Kichik, lekin ajralib turadi.',
    ),
    why(
      tf('q3', 'Ikkilamchi matn xira rang bilan ajratiladi, juda kichraytirilmaydi.', true),
      'O‘qilishi saqlanadi.',
    ),
  ]),
  'font-face': miniQuiz([
    why(
      codeFill(
        'q1',
        'Kompyuterdagi shriftlar.',
        '@font-face {\n  font-family: "Sarlavha";\n  src: {{1}}("Georgia"), local("Times New Roman");\n}',
        ['local'],
      ),
      'Tashqi fayl yuklanmaydi.',
    ),
    why(
      q(
        'q2',
        'Matn darhol ko‘rinsin?',
        ['font-display: swap', 'font-display: block', 'font-weight: auto', 'src: none'],
        [0],
      ),
      'Yuklanguncha zaxira.',
    ),
    why(
      tf('q3', '`font-weight: 700` bu @font-face qalin variant uchun ekanini bildiradi.', true),
      'Har qalinlik — alohida qoida.',
    ),
  ]),
  'oraliq-tizimi': miniQuiz([
    why(
      codeFill('q1', 'Karta ichidagi bo‘shliq.', '.karta {\n  gap: var({{1}});\n}', ['--s-4']),
      '`--s-4` — 16 piksel.',
    ),
    why(
      order('q2', 'Tokenlarni kichikdan kattaga.', [
        '--s-1 (4px)',
        '--s-2 (8px)',
        '--s-4 (16px)',
        '--s-8 (32px)',
      ]),
      '8px tizimi.',
    ),
    why(
      tf('q3', 'Ichki oraliq tashqi oraliqdan kichik bo‘lishi kerak.', true),
      'Element bir butun ko‘rinadi.',
    ),
  ]),
  yaqinlik: miniQuiz([
    why(
      q(
        'q1',
        'Yorliq va maydon orasi (6px) va maydonlar orasi (24px) — nega farq?',
        [
          'Yorliq o‘z maydoniga tegishli ekani ko‘rinadi',
          'Tasodifiy',
          'Chiroy uchun',
          'Farq kerak emas',
        ],
        [0],
      ),
      'Yaqinlik qoidasi.',
    ),
    why(
      codeFill('q2', 'Maydonlar orasi.', '.forma {\n  display: grid;\n  gap: {{1}};\n}', ['24px']),
      'Guruhlar orasida katta.',
    ),
    why(
      tf('q3', 'Sarlavhaning yuqori margini pastkisidan katta bo‘lishi kerak.', true),
      'Sarlavha o‘z bo‘limiga yaqin.',
    ),
  ]),
  tekislash: miniQuiz([
    why(
      codeFill(
        'q1',
        'Navigatsiya qatori.',
        '.nav {\n  display: flex;\n  align-items: center;\n  justify-content: {{1}};\n}',
        ['space-between'],
      ),
      'Chetlarga taqsimlash.',
    ),
    why(
      q(
        'q2',
        'Karta matni qayerga tekislanadi?',
        ['Chapga', 'Markazga', 'Ikki chetga', 'O‘ngga'],
        [0],
      ),
      'Ko‘p qatorli matn — chapga.',
    ),
    why(tf('q3', 'Raqamli ustunlar o‘ngga tekislanadi.', true), 'Xonalar bir chiziqda.'),
  ]),
  'oq-joy': miniQuiz([
    why(
      codeFill(
        'q1',
        'Bo‘lim ichki bo‘shlig‘i.',
        '.bolim {\n  padding-block: {{1}}(3rem, 8vw, 6rem);\n}',
        ['clamp'],
      ),
      'Ekranga qarab.',
    ),
    why(
      q(
        'q2',
        '`padding-block` qaysi tomonlar?',
        ['Yuqori va past', 'Chap va o‘ng', 'Hamma tomon', 'Faqat past'],
        [0],
      ),
      'Inline — chap/o‘ng.',
    ),
    why(
      tf('q3', 'Kirish matniga `max-width` (masalan, 60ch) o‘qishni osonlashtiradi.', true),
      'Qator uzunligi.',
    ),
  ]),
  'svg-ikonkalar': miniQuiz([
    why(
      codeFill(
        'q1',
        'Ikonka matn o‘lchamida.',
        '.ikonka {\n  width: 1.25{{1}};\n  height: 1.25em;\n}',
        ['em'],
      ),
      'Matnga moslashadi.',
    ),
    why(
      q(
        'q2',
        'Ikonka va matnni tekislash?',
        [
          'inline-flex + align-items: center + gap',
          'float',
          'vertical-align: top',
          'position: absolute',
        ],
        [0],
      ),
      'Tugma ichida.',
    ),
    why(
      tf('q3', '`fill: currentColor` ikonkani matn rangida bo‘yaydi.', true),
      'Hover’da ham birga.',
    ),
  ]),
  'bootstrap-icons': miniQuiz([
    why(
      tf('q1', 'Bootstrap Icons `<head>` ga `<link rel="stylesheet">` bilan ulanadi.', true),
      'Ikonka shrifti.',
    ),
    why(
      codeFill('q2', 'Ikonka.', '<i class="bi {{1}}" aria-hidden="true"></i>', ['bi-search']),
      'bi + bi-NOMI.',
    ),
    why(
      q(
        'q3',
        'CDN versiyasini qotirish nega kerak?',
        [
          'Kutilmagan yangilanish ikonkalarni buzmasligi uchun',
          'Tezlik uchun',
          'Kerak emas',
          'Litsenziya uchun',
        ],
        [0],
      ),
      'Barqarorlik.',
    ),
  ]),
  'ikonka-a11y': miniQuiz([
    why(
      codeFill(
        'q1',
        'Faqat ikonkali tugma.',
        '<button class="qidiruv" {{1}}="Qidirish">…</button>',
        ['aria-label'],
      ),
      'Tugma nomi.',
    ),
    why(
      q(
        'q2',
        'Matnli tugmadagi bezak ikonka?',
        ['aria-hidden="true"', 'aria-label', 'role="img"', 'title'],
        [0],
      ),
      'Ikki marta o‘qilmasin.',
    ),
    why(
      tf('q3', 'Eski brauzerlarda SVG alohida fokus olmasligi uchun `focusable="false"`.', true),
      'Tab tartibi toza.',
    ),
  ]),
  'rasm-bezagi': miniQuiz([
    why(
      codeFill(
        'q1',
        'Bir xil ramka.',
        '.galereya img {\n  aspect-ratio: 4 / 3;\n  object-fit: {{1}};\n}',
        ['cover'],
      ),
      'Cho‘zilmaydi.',
    ),
    why(
      q('q2', 'Rasm izohi elementi?', ['figcaption', 'caption', 'label', 'small'], [0]),
      '`<figure>` ichida.',
    ),
    why(
      tf('q3', 'Galereya rasmlariga `border-radius: 12px` yumshoq ko‘rinish beradi.', true),
      'Burchak radiusi tizimi.',
    ),
  ]),
  tugmalar: miniQuiz([
    why(
      codeFill('q1', 'Bosish maydoni.', '.tugma {\n  {{1}}: 44px;\n}', ['min-height']),
      'Barmoq uchun.',
    ),
    why(
      q(
        'q2',
        'Nega `border: 1px solid transparent`?',
        ['Variantlarda o‘lcham sakramasligi uchun', 'Rang uchun', 'Soya uchun', 'Kerak emas'],
        [0],
      ),
      'Bir xil o‘lcham.',
    ),
    why(
      tf('q3', 'Bitta asos klass va modifikatorlar (`.tugma--ikkinchi`) — yaxshi tuzilma.', true),
      'Takrorlanmaydi.',
    ),
  ]),
  'tugma-holatlari': miniQuiz([
    why(
      codeFill('q1', 'Klaviatura fokusi.', '.tugma:{{1}} {\n  outline: 3px solid #59a2ff;\n}', [
        'focus-visible',
      ]),
      'Aniq halqa.',
    ),
    why(
      q('q2', 'O‘chirilgan tugma kursori?', ['not-allowed', 'pointer', 'wait', 'help'], [0]),
      'Taqiq belgisi.',
    ),
    why(tf('q3', 'Hover rangi asosiy rangdan biroz to‘qroq bo‘ladi.', true), 'Masalan, #005bb5.'),
  ]),
  'forma-maydonlari': miniQuiz([
    why(
      q('q1', 'Maydon chegarasining minimal kontrasti?', ['3:1', '4.5:1', '1.5:1', '7:1'], [0]),
      'Grafik element.',
    ),
    why(
      codeFill(
        'q2',
        'Xato holatini atribut bo‘yicha bezang.',
        'input[{{1}}="true"] {\n  border-color: #dc2626;\n}',
        ['aria-invalid'],
      ),
      'Holat bitta joyda.',
    ),
    why(
      tf('q3', 'Xato faqat qizil rang bilan emas, matn bilan ham ko‘rsatiladi.', true),
      'Rang yagona belgi emas.',
    ),
  ]),
  'ui-kartalar': miniQuiz([
    why(
      codeFill(
        'q1',
        'Rasm burchak bo‘ylab kesilsin.',
        '.karta {\n  border-radius: 12px;\n  {{1}}: hidden;\n}',
        ['overflow'],
      ),
      'Ichki elementlar ham yumaloq.',
    ),
    why(
      order('q2', 'Karta qismlari.', ['Media', 'Mazmun', 'Oyoq (amallar)']),
      'Uch qism: media, mazmun, amallar.',
    ),
    why(tf('q3', 'Hover effekti faqat bosiladigan kartaga.', true), 'Aks holda chalg‘itadi.'),
  ]),
  bildirishnoma: miniQuiz([
    why(
      codeFill('q1', 'Chap tomondagi rangli chiziq.', '.xabar {\n  {{1}}: 4px solid;\n}', [
        'border-left',
      ]),
      'Rang modifikatorda.',
    ),
    why(
      q(
        'q2',
        'Oddiy “Saqlandi” xabari uchun rol?',
        ['role="status"', 'role="alert"', 'role="button"', 'role="dialog"'],
        [0],
      ),
      'Muhim xato — alert.',
    ),
    why(
      tf('q3', 'Muvaffaqiyat xabari och yashil fon va yashil chegara bilan ajratiladi.', true),
      'Holat rangi.',
    ),
  ]),
  tablar: miniQuiz([
    why(
      codeFill('q1', 'Tanlangan tab.', "tab.setAttribute('{{1}}', 'true');", ['aria-selected']),
      'Qolganlariga false.',
    ),
    why(
      q(
        'q2',
        'Tanlanmagan panellar?',
        ['hidden atributi', 'opacity: 0', 'display: block', 'z-index: -1'],
        [0],
      ),
      'Ko‘rinmaydi va o‘qilmaydi.',
    ),
    why(
      tf(
        'q3',
        'Tab ro‘yxati `role="tablist"`, har tab `role="tab"`, panel `role="tabpanel"`.',
        true,
      ),
      'ARIA tab naqshi.',
    ),
  ]),
  holatlar: miniQuiz([
    why(
      codeFill(
        'q1',
        'Skelet animatsiyasi.',
        '.skeleton {\n  animation: {{1}} 1.4s ease-in-out infinite;\n}',
        ['pulse'],
      ),
      '@keyframes nomi.',
    ),
    why(
      q(
        'q2',
        'Harakatni kamaytirish so‘ralganda?',
        [
          '@media (prefers-reduced-motion: reduce) da animation: none',
          'Hech narsa',
          'Tezlashtirish',
          'Sahifani yashirish',
        ],
        [0],
      ),
      'Harakatdan bezovta bo‘ladiganlar uchun.',
    ),
    why(
      sortInto('q3', 'Holatni ko‘rinish bilan moslang.', {
        Yuklanmoqda: ['Skelet bloklar'],
        'Bo‘sh': ['“Hali loyiha yo‘q” va tugma'],
        Xato: ['“Qayta urinish” tugmasi'],
      }),
      'Uch holat — uch ko‘rinish.',
    ),
  ]),
  'dizayn-tizimi': miniQuiz([
    why(
      codeFill(
        'q1',
        'Qattiq qiymat o‘rniga token.',
        '.karta {\n  border-radius: {{1}}(--r-md);\n}',
        ['var'],
      ),
      'Bitta joydan boshqariladi.',
    ),
    why(
      q('q2', 'Semantik token nomi qaysi?', ['--rang-urg', '--kok-600', '--blue', '--c1'], [0]),
      'Vazifani bildiradi.',
    ),
    why(
      tf(
        'q3',
        'Koddagi bir xil HEX qiymatlarni topib tokenga almashtirish dizayn tizimining boshlanishi.',
        true,
      ),
      'Qiymatlardan tokenlarga.',
    ),
  ]),
  yakuniy: miniQuiz([
    why(
      codeFill(
        'q1',
        'Avatar doira.',
        '.avatar {\n  border-radius: {{1}};\n  object-fit: cover;\n}',
        ['50%'],
      ),
      'Kvadrat rasm.',
    ),
    why(
      q('q2', 'Profil kartasi burchagi (katta karta)?', ['16px', '0', '50%', '2px'], [0]),
      'Mashq talabi.',
    ),
    why(
      tf(
        'q3',
        'Yakuniy ishda oldingi barcha qoidalar (rang, tipografiya, oraliq, holatlar) birga qo‘llanadi.',
        true,
      ),
      'Kurs xulosasi.',
    ),
  ]),
  'vizual-ierarxiya': miniQuiz([
    why(
      order('q1', 'Tugmalarni ahamiyati bo‘yicha tartiblang.', [
        'Asosiy (to‘ldirilgan)',
        'Ikkinchi (chegarali)',
        'Uchinchi (matnli havola)',
      ]),
      'Bitta ekranda bitta asosiy harakat.',
    ),
    why(
      codeFill(
        'q2',
        'Ikkinchi darajali tugma foni.',
        '.tugma-ikkinchi {\n  background-color: {{1}};\n  border: 1px solid #0071dc;\n}',
        ['transparent'],
      ),
      'Faqat chegara va matn rangli.',
    ),
    why(
      tf(
        'q3',
        'Barcha tugmalar bir xil yorqin bo‘lsa, foydalanuvchi asosiy harakatni topa olmaydi.',
        true,
      ),
      'Ierarxiya e’tiborni boshqaradi.',
    ),
  ]),
};
