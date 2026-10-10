## API nima?

**API** (Application Programming Interface) — dasturning boshqa dasturga taqdim etadigan “tugmalari”, ya’ni tayyor funksiyalar to‘plami. Siz qanday ishlashini bilmasangiz ham, ularni chaqirib natija olasiz.

Masalan, restoranda siz oshxonaga kirmaysiz — ofitsiant orqali buyurtma berasiz. Ofitsiant — API.

## Web API’lar

Brauzer JavaScript’ga juda ko‘p imkoniyatlarni API ko‘rinishida beradi. Biz ularni oldingi darslarda ishlatganmiz:

| API          | Nima qiladi                                 |
| ------------ | ------------------------------------------- |
| DOM          | Sahifa elementlarini topish va o‘zgartirish |
| Canvas       | Rasm chizish                                |
| Geolocation  | Foydalanuvchi joylashuvini aniqlash         |
| Drag and Drop | Elementlarni sudrab tashlash               |
| Web Storage  | Brauzerda ma’lumot saqlash                  |
| Web Workers  | Og‘ir hisobni fonda bajarish                |
| Fetch        | Serverdan ma’lumot olish                    |

```js
// DOM API
document.querySelector('h1').textContent = 'Salom!';

// Console API
console.log('Sahifa tayyor');
```

## Tashqi (uchinchi tomon) API’lar

Brauzerda o‘rnatilmagan, lekin internet orqali chaqiriladigan xizmatlar ham bor: ob-havo, xarita, valyuta kursi va hokazo. Ular odatda `fetch()` orqali chaqiriladi va ko‘pincha **kalit** (API key) talab qiladi.

> **Xavfsizlik:** API kalitlarini hech qachon brauzer kodiga yozmang — sahifa kodini istalgan foydalanuvchi ko‘ra oladi. Bunday kalitlar faqat serverda saqlanadi.

## Ruxsat so‘raydigan API’lar

Ba’zi API’lar shaxsiy ma’lumotga tegadi (joylashuv, kamera, mikrofon). Brauzer ularni ishlatishdan oldin foydalanuvchidan **ruxsat** so‘raydi. Ular faqat xavfsiz ulanishda (`https://` yoki `localhost`) ishlaydi.

## API mavjudligini tekshirish

Har bir brauzer hamma API’ni qo‘llab-quvvatlamaydi. Ishlatishdan oldin tekshiring:

```js
if ('geolocation' in navigator) {
  console.log('Geolocation bor');
} else {
  console.log('Bu brauzerda Geolocation yo‘q');
}
```

## Xulosa

- API — tayyor imkoniyatlardan foydalanish uchun interfeys.
- Brauzer DOM, Canvas, Geolocation, Storage kabi ko‘plab Web API’larni beradi.
- Shaxsiy ma’lumot API’lari ruxsat so‘raydi; API kalitlari brauzer kodida saqlanmaydi.
