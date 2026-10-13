## Formalar va validatsiya

## `submit` hodisasi

Formani yuborish — tugma bosilishi, `Enter` tugmasi — barchasi formada **`submit`** hodisasini chaqiradi. Uni tugmaning `click` ida emas, **formaning** `submit` ida ushlang:

```js
const forma = document.getElementById('forma');

forma.addEventListener('submit', function (event) {
  event.preventDefault(); // sahifa qayta yuklanmasin
  // tekshirish va qayta ishlash
});
```

`preventDefault()` bo‘lmasa, brauzer formani `action` manziliga yuboradi va sahifa **qayta yuklanadi** — JavaScript’da qilingan hamma narsa yo‘qoladi.

## Maydonlarni o‘qish

```js
const ism = forma.elements.ism.value.trim(); // name="ism"
// yoki
const data = new FormData(forma);
data.get('email');
```

## JavaScript bilan tekshirish

```js
function tekshir({ ism, email, parol, parol2 }) {
  if (!ism) return 'Ism kiriting';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email noto‘g‘ri';
  if (parol.length < 8) return 'Parol kamida 8 belgi';
  if (parol !== parol2) return 'Parollar mos emas';
  return null; // xato yo‘q
}
```

Birinchi xatoni qaytarish — foydalanuvchi uchun tushunarli: bitta xabar, bitta harakat.

## Brauzerning o‘z validatsiyasi

HTML atributlari ham tekshiradi:

```html
<input name="email" type="email" required>
<input name="parol" type="password" minlength="8" required>
```

Bunday maydon noto‘g‘ri bo‘lsa, brauzer `submit` hodisasini **chaqirmaydi** va o‘z xabarini ko‘rsatadi. Xabarlarni o‘zingiz boshqarmoqchi bo‘lsangiz, formaga `novalidate` qo‘shing — atributlar qoladi, lekin tekshiruvni siz qilasiz:

```html
<form id="forma" novalidate>
```

## Constraint Validation API

`novalidate` bilan ham brauzer tekshiruvidan foydalanish mumkin:

```js
input.checkValidity();     // true / false
input.validity.valueMissing // required, lekin bo‘sh
input.validity.typeMismatch // email emas
input.validationMessage     // brauzer xabari
input.setCustomValidity('Bu ism band'); // o‘z xatoingiz
```

## Xatoni ko‘rsatish

```html
<p id="xato" role="alert"></p>
```

`role="alert"` ekran o‘quvchilariga xabarni darhol o‘qitadi. Xato maydonni ham belgilang:

```js
input.setAttribute('aria-invalid', 'true');
input.focus();
```

## Muvaffaqiyatdan keyin

```js
xabar.textContent = `Xush kelibsiz, ${ism}!`;
forma.reset(); // barcha maydonlarni tozalash
```

## Frontend tekshiruvi — xavfsizlik emas

Brauzerdagi tekshiruv — **qulaylik**: foydalanuvchi xatoni darhol ko‘radi. Lekin JavaScript’ni o‘chirib yoki so‘rovni qo‘lda yuborib uni chetlab o‘tish mumkin. Server **doim** ma’lumotni qayta tekshiradi.
