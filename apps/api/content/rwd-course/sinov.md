## Moslashuvchan sahifani sinash

Sahifa tayyor. Endi uni har xil ekranda tekshirish kerak. Eng ko‘p uchraydigan muammo — telefonda **gorizontal aylanish**: sahifani barmoq bilan yon tomonga surish mumkin bo‘lib qoladi.

## Odatiy sabablar

| Sabab | Tuzatish |
| --- | --- |
| `width: 500px` kabi katta qotgan kenglik | `max-width`, `%`, `min()` |
| `max-width` siz rasm, video, iframe | `max-width: 100%; height: auto` |
| Uzun so‘z, manzil, kod qatori | `overflow-wrap: anywhere`, `pre` uchun `overflow-x: auto` |
| Keng jadval | O‘ram ichida aylantirish |
| `100vw` (aylantirish chizig‘i bilan birga) | `100%` |
| Manfiy `margin`, ekrandan chiqqan absolyut element | Joylashuvni qayta ko‘rib chiqish |

## Aybdorni topish

1. DevTools’da qurilma rejimini yoqing, 320–375px ni tanlang.
2. Sahifani yon tomonga surib ko‘ring — qaysi blok chegaradan chiqqan?
3. Vaqtincha hamma narsaga chiziq bering:

```css
* { outline: 1px solid red; }
```

Ekran chetidan chiqib turgan qizil ramka darhol ko‘rinadi.

4. Konsolda tekshirish:

```js
[...document.querySelectorAll('*')].filter(el => el.scrollWidth > document.documentElement.clientWidth)
```

## Tekshiruv ro‘yxati

- [ ] Viewport meta tegi to‘g‘ri, kattalashtirish taqiqlanmagan.
- [ ] 320px dan 1920px gacha gorizontal aylanish yo‘q.
- [ ] Matn telefonda kamida 16px, qatorlar 75 belgidan uzun emas.
- [ ] Tugma va havolalar kamida 44×44px.
- [ ] Rasmlarda `width`/`height`, `alt`; pastdagilarda `loading="lazy"`.
- [ ] Menyu telefonda ishlaydi, klaviatura bilan ham.
- [ ] Formalar to‘g‘ri klaviaturani ochadi.
- [ ] Gorizontal (yotiq) holatda ham ishlaydi.
- [ ] Sekin internetda (DevTools → Network → Slow 4G) sahifa o‘qiladigan holatda tez paydo bo‘ladi.

## Haqiqiy qurilma

DevTools taqlidi juda foydali, lekin u barmoq o‘lchamini, haqiqiy protsessor tezligini va brauzer panellarining yashirinib-ko‘rinishini to‘liq bermaydi. Imkon bo‘lsa, sahifani o‘z telefoningizda oching: kompyuter va telefon bitta Wi-Fi’da bo‘lsa, dev serverni kompyuterning IP manzili orqali ochish mumkin.

## Avtomatik tekshiruv

Lighthouse (DevTools → Lighthouse) mobil rejimda tezlik, accessibility va eng yaxshi amaliyotlar bo‘yicha baho beradi va aniq muammolarni ko‘rsatadi. 90 dan yuqori ball — yaxshi natija.

Mashqda ataylab buzilgan sahifadagi beshta tipik xatoni tuzatasiz. Kursni tugatdingiz — endi o‘z loyihangizni shu ro‘yxat bo‘yicha tekshiring.
