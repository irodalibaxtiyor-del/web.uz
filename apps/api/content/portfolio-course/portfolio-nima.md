## Portfolio — sizning ish namunangiz

Frontend dasturchi yoki dizaynerni ishga olayotgan odam birinchi navbatda **nima qila olishingizni** ko‘rmoqchi. Diplom yoki sertifikatdan ko‘ra yaxshi qilingan bitta loyiha ko‘proq gapiradi. Portfolio sayti — shu loyihalarni ko‘rsatadigan joy, va uning o‘zi ham sizning ishingiz namunasi.

Bu kursda bosqichma-bosqich to‘liq portfolio saytini yasaysiz. Har bir dars oldingisiga qo‘shiladi.

## Nima kiritiladi

| Bo‘lim | Mazmuni |
| --- | --- |
| Bosh ekran | Ismingiz, kimligingiz (bir jumla), asosiy tugma |
| Ishlarim | 3–6 ta eng yaxshi loyiha |
| Men haqimda | Qisqa hikoya, ko‘nikmalar, tajriba |
| Aloqa | Email, Telegram, GitHub, forma |

Ko‘p loyiha emas, **yaxshi** loyiha. Har bir loyiha uchun: nima edi, siz nima qildingiz, qanday texnologiyalar, natija. Tugallanmagan yoki dars mashqlarini qo‘ymang — ish beruvchi eng zaif ishingizga qarab ham baho beradi.

## Kim uchun yozilgan

Portfolio’ni kim o‘qishini o‘ylang: HR mutaxassisi 30 soniyada ko‘zdan kechiradi, texnik rahbar kodga qaraydi, mijoz natijani ko‘rmoqchi. Shuning uchun:

- eng muhim narsa birinchi ekranda;
- har bir loyihada jonli havola va kod havolasi;
- ortiqcha bezaksiz, tez yuklanadigan sahifa.

## Semantik tuzilma

```html
<header>
  <a href="#bosh">Aziza Karimova</a>
  <nav aria-label="Asosiy">
    <a href="#haqimda">Men haqimda</a>
    <a href="#ishlar">Ishlarim</a>
    <a href="#aloqa">Aloqa</a>
  </nav>
</header>
<main>
  <section id="bosh"><h1>…</h1></section>
  <section id="haqimda"><h2>Men haqimda</h2>…</section>
  <section id="ishlar"><h2>Ishlarim</h2>…</section>
  <section id="aloqa"><h2>Aloqa</h2>…</section>
</main>
<footer>…</footer>
```

- `header`, `nav`, `main`, `footer` — ekran o‘quvchi ular orasida tez sakray oladi;
- `section` + sarlavha — har bir bo‘lim nomlangan hudud;
- bitta `h1` — sahifaning asosiy mavzusi; bo‘limlar `h2`.

`div` lardan iborat sahifa ko‘zga bir xil ko‘rinadi, lekin qidiruv tizimi va yordamchi texnologiyalar uchun u shunchaki “quti ichida quti”.

## Havola langarlari

`href="#ishlar"` — shu sahifadagi `id="ishlar"` elementiga o‘tadi. Bir sahifali portfolio uchun yetarli; keyinchalik har bir loyiha uchun alohida sahifa qo‘shish mumkin.

Mashqda `div` lardan iborat qoralamani semantik skeletga aylantirasiz.
