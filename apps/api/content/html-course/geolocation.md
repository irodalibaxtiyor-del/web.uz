## Geolocation API

Geolocation API foydalanuvchining **geografik joylashuvini** (kenglik va uzunlik) aniqlaydi. Masalan, eng yaqin do‘konni ko‘rsatish yoki ob-havoni avtomatik aniqlash uchun.

Bu shaxsiy ma’lumot bo‘lgani uchun:

- brauzer foydalanuvchidan **ruxsat so‘raydi**;
- API faqat `https://` yoki `localhost` da ishlaydi.

## Joylashuvni olish

```html
<button onclick="aniqlash()">Joylashuvimni aniqlash</button>
<p id="natija"></p>

<script>
  const natija = document.getElementById('natija');

  function aniqlash() {
    if (!('geolocation' in navigator)) {
      natija.textContent = 'Brauzeringiz joylashuvni aniqlay olmaydi.';
      return;
    }
    navigator.geolocation.getCurrentPosition(muvaffaqiyat, xato);
  }

  function muvaffaqiyat(pozitsiya) {
    const { latitude, longitude, accuracy } = pozitsiya.coords;
    natija.textContent =
      `Kenglik: ${latitude.toFixed(4)}, uzunlik: ${longitude.toFixed(4)} ` +
      `(aniqlik ~${Math.round(accuracy)} m)`;
  }

  function xato(e) {
    natija.textContent = 'Aniqlab bo‘lmadi: ' + e.message;
  }
</script>
```

`getCurrentPosition()` ikkita funksiya qabul qiladi: muvaffaqiyatli bo‘lganda va xato bo‘lganda chaqiriladigan.

## Xatolarni qayta ishlash

`e.code` qiymatlari:

| Kod | Ma’nosi                                  |
| --- | ---------------------------------------- |
| 1   | Foydalanuvchi ruxsat bermadi             |
| 2   | Joylashuvni aniqlab bo‘lmadi             |
| 3   | Vaqt tugadi                              |

Foydalanuvchi ruxsat bermasa, sahifa baribir ishlashi kerak — masalan, shaharni qo‘lda tanlash imkonini bering.

## Joylashuvni kuzatish

Harakatlanayotgan foydalanuvchi uchun `watchPosition()` joylashuv o‘zgargan sari funksiyani qayta chaqiradi:

```js
const id = navigator.geolocation.watchPosition(muvaffaqiyat, xato);
// keyin to‘xtatish:
navigator.geolocation.clearWatch(id);
```

## Yaxshi amaliyot

- Ruxsatni sahifa ochilishi bilan emas, foydalanuvchi tugmani bosganda so‘rang.
- Nima uchun joylashuv kerakligini oldindan tushuntiring.
- Joylashuvni kerakli maqsaddan boshqa joyda ishlatmang va saqlamang.

> **Platformada:** Ishga tushirish oynasida Geolocation o‘chirilgan. Misolni kompyuteringizda `index.html` sifatida sinab ko‘ring (fayl `localhost` orqali ochilsa ishonchliroq ishlaydi).

## Xulosa

- `navigator.geolocation.getCurrentPosition(ok, xato)` joylashuvni bir marta oladi.
- Brauzer ruxsat so‘raydi; rad etilganda ham sahifa ishlashi kerak.
- `watchPosition()` — kuzatish, `clearWatch()` — to‘xtatish.
