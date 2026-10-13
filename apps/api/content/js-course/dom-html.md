## HTML va atributlarni o‘zgartirish

## Atributlar: xususiyat orqali

Ko‘p standart atributlar element xususiyatiga aylanadi:

```js
havola.href = '/kurslar/css';
rasm.src = 'logo.svg';
rasm.alt = 'WEBDIZAYN.UZ logotipi';
input.placeholder = 'Ism';
tugma.disabled = false;
input.type = 'password';
```

`href` o‘qilganda **to‘liq** manzil qaytadi (`https://sayt.uz/kurslar/css`), atributning o‘zi esa `/kurslar/css`.

## `getAttribute` va `setAttribute`

```js
havola.getAttribute('href');               // '/kurslar/css' — yozilganidek
havola.setAttribute('href', '/kurslar/js');
tugma.removeAttribute('disabled');
tugma.hasAttribute('disabled');            // false
el.setAttribute('aria-expanded', 'true');  // ARIA atributlari
```

Xususiyatga aylanmaydigan atributlar (`aria-*`, o‘zingizning atributlaringiz) uchun aynan shular.

## Boolean atributlar

`disabled`, `checked`, `hidden`, `required` — mavjud bo‘lsa yoqilgan:

```js
tugma.disabled = true;       // <button disabled>
tugma.disabled = false;      // atribut olib tashlanadi
el.hidden = true;            // yashirish
```

`setAttribute('disabled', 'false')` — **baribir faolsiz**! Atribut bor, qiymati muhim emas. Xususiyat (`disabled = false`) yoki `removeAttribute` ishlating.

## `data-*` atributlar va `dataset`

HTML’da o‘z ma’lumotlaringizni saqlash uchun:

```html
<button class="kurs" data-kurs="css" data-narx="350000">CSS</button>
```

```js
tugma.dataset.kurs   // 'css'
tugma.dataset.narx   // '350000' — doim matn
tugma.dataset.daraja = 'boshlangich'; // data-daraja yaratiladi
```

`data-kurs-nomi` → `dataset.kursNomi` (chiziqcha → camelCase).

Bitta funksiya ko‘p tugmaga xizmat qilishi uchun juda qulay:

```js
for (const tugma of document.querySelectorAll('.kurs')) {
  tugma.onclick = function () {
    havola.href = `/kurslar/${this.dataset.kurs}`;
    narx.textContent = this.dataset.narx;
  };
}
```

## Mazmunni almashtirish

```js
el.textContent = 'Yangi matn';
el.innerHTML = '<strong>Yangi</strong> matn'; // faqat ishonchli HTML
```

## Butun elementni almashtirish

```js
el.outerHTML = '<p>Yangi element</p>'; // elementning o‘zi ham almashadi
```

Kam ishlatiladi — elementlarni yaratish va almashtirish uchun `createElement`, `replaceWith` (keyingi modul) aniqroq.

## Forma maydonlari

```js
input.value = 'Ali';      // joriy qiymat
input.defaultValue;       // HTML’dagi value atributi
select.value = 'css';     // tanlov
checkbox.checked = true;
```
