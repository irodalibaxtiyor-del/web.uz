## Ijtimoiy isbot

Mijoz yoki hamkasbning bir jumlali fikri sizning so‘zlaringizdan ko‘ra ishonchliroq. Hali mijozlar bo‘lmasa — o‘qituvchi, guruhdosh yoki amaliyot rahbarining fikri ham bo‘ladi. Faqat **haqiqiy** fikr va ruxsat bilan; to‘qib chiqarilgan fikrlar tezda sezilib, ishonchni yo‘qotadi.

## Semantika

```html
<figure class="fikr">
  <blockquote>
    <p>Sayt tez va qulay chiqdi, buyurtmalar ko‘paydi.</p>
  </blockquote>
  <figcaption>Dilshod Rasulov, <cite>“Ko‘k choy” kafesi</cite></figcaption>
</figure>
```

- `blockquote` — boshqa odamdan olingan iqtibos;
- `figure` + `figcaption` — iqtibos va uning manbasini bog‘laydi;
- `cite` — asar yoki manba nomi (tashkilot, kitob).

Ekran o‘quvchi bu tuzilmani “iqtibos” deb e’lon qiladi; qidiruv tizimlari ham uni tushunadi.

## Ko‘rinish

```css
.fikr {
  margin: 0;
  padding: 20px;
  border-left: 4px solid var(--urg);
  background-color: white;
}

.fikr blockquote {
  margin: 0;
  font-style: italic;
}
```

Brauzer `figure` va `blockquote` ga standart chetlar beradi (40px gacha) — ularni tozalash kerak.

## Qo‘shtirnoqlar

Matnga qo‘shtirnoqni HTML’da yozish yoki CSS bilan qo‘shish mumkin:

```css
.fikr blockquote p::before {
  content: open-quote;
}
.fikr blockquote p::after {
  content: close-quote;
}

:root:lang(uz) {
  quotes: '“' '”';
}
```

`quotes` xususiyati til bo‘yicha to‘g‘ri qo‘shtirnoq belgilarini tanlaydi.

## Joylashuv

3 ta fikr — grid yoki oldingi darsdagi karusel. 10 ta fikr kerak emas; eng aniq va qisqa 2–4 tasini tanlang. Muallifning surati bo‘lsa, kichik doira avatar ishonchni oshiradi.

Mashqda fikrlarni semantik iqtiboslarga aylantirasiz.
