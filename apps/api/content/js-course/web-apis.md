## Web API’lar

Brauzer JavaScript’ga ko‘plab tayyor imkoniyatlar beradi. Ular tilning emas, **brauzerning** qismi va **Web API** deyiladi. Siz allaqachon bir nechtasini ishlatdingiz: DOM, `fetch`, `localStorage`, taymerlar.

## Constraint Validation API

Forma maydonlarining o‘z tekshiruvi:

```html
<input id="email" type="email" required>
<input id="yosh" type="number" min="16" max="100">
```

```js
const email = document.getElementById('email');
email.checkValidity();        // true / false
email.validity.valueMissing   // required, lekin bo‘sh
email.validity.typeMismatch   // email emas
yosh.validity.rangeUnderflow  // min dan kichik
yosh.validity.rangeOverflow   // max dan katta
email.validationMessage       // brauzer xabari (brauzer tilida)
```

O‘z xabarlaringiz bilan:

```js
function xabar(maydon) {
  const v = maydon.validity;
  if (v.valueMissing) return 'Maydon to‘ldirilmagan';
  if (v.typeMismatch) return 'Email formati noto‘g‘ri';
  if (v.rangeUnderflow) return 'Juda kichik';
  if (v.rangeOverflow) return 'Juda katta';
  return '';
}
```

HTML atributlari qoidani bir joyda saqlaydi, JavaScript faqat xabarni chiroyli ko‘rsatadi.

## `Intl` — formatlash

Raqam, valyuta va sanalarni tilga mos formatlash:

```js
new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(1234.5);
// '$1,234.50'

new Intl.NumberFormat('ru-RU').format(1234567); // '1 234 567'

new Intl.DateTimeFormat('en-GB', { dateStyle: 'long' }).format(new Date(2026, 2, 8));
// '8 March 2026'
```

Natija brauzer qo‘llaydigan tillarga bog‘liq; o‘zbek tili qo‘llovi to‘liq emas (“Sana formatlari” darsida ko‘rgandik).

## Geolocation

```js
navigator.geolocation.getCurrentPosition(
  (pos) => console.log(pos.coords.latitude, pos.coords.longitude),
  (xato) => console.log('Ruxsat berilmadi', xato.message),
);
```

Foydalanuvchi **ruxsat** berishi shart va faqat HTTPS saytlarda ishlaydi. Mashq preview’ida o‘chirilgan — kompyuteringizda sinab ko‘ring.

## Clipboard

```js
await navigator.clipboard.writeText('Nusxalandi!');
```

Foydalanuvchi harakatidan (bosish) keyin va xavfsiz kontekstda ishlaydi.

## Boshqa API’lar

| API                    | Nima uchun                                   |
| ---------------------- | -------------------------------------------- |
| `IntersectionObserver` | Element ekranga kirdimi (lazy loading, animatsiya) |
| `Notification`         | Tizim bildirishnomalari (ruxsat bilan)       |
| `Web Workers`          | Og‘ir hisobni alohida oqimda bajarish        |
| `Canvas`, `WebGL`      | Grafika va o‘yinlar                          |
| `Web Audio`            | Ovoz bilan ishlash                           |
| `File` / `FileReader`  | Foydalanuvchi tanlagan faylni o‘qish         |

## Mavjudligini tekshirish

Barcha brauzerlar hamma API’ni qo‘llamaydi:

```js
if ('geolocation' in navigator) {
  // ishlatish mumkin
} else {
  // muqobil yo‘l
}
```

Yangi API’ni ishlatishdan oldin **MDN** dagi “Browser compatibility” jadvaliga qarang.
