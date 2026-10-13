## DOM metodlari va xususiyatlari

**Metod** — elementlar ustida bajariladigan amal (`querySelector()`), **xususiyat** — o‘qiladigan yoki o‘zgartiriladigan qiymat (`textContent`).

## Topish: ikki asosiy metod

```js
document.getElementById('profil');        // id bo‘yicha, eng tez
document.querySelector('.karta .ism');    // istalgan CSS selektor, birinchisi
```

`querySelector` CSS’dagi barcha selektorlarni qabul qiladi:

```js
document.querySelector('#forma input[type="email"]');
document.querySelector('ul > li:last-child');
document.querySelector('[data-kurs="js"]');
```

Topilmasa — `null`. Undan keyin xususiyat o‘qish `TypeError` beradi, shuning uchun selektorni diqqat bilan yozing.

## Elementning ichidan qidirish

`querySelector` faqat `document` da emas, istalgan elementda ishlaydi — qidiruv shu element ichida bo‘ladi:

```js
const karta = document.querySelector('.karta');
karta.querySelector('.ism'); // faqat karta ichidagi .ism
```

## Mazmun: `textContent` va `innerHTML`

```js
el.textContent = 'Salom';           // oddiy matn
el.innerHTML = '<b>Salom</b>';      // HTML sifatida o‘qiladi
```

| Xususiyat      | Qachon                                    |
| -------------- | ----------------------------------------- |
| `textContent`  | Har doim, ayniqsa foydalanuvchi matni uchun |
| `innerHTML`    | Faqat o‘zingiz yozgan, ishonchli HTML uchun |
| `innerText`    | Ko‘rinadigan matn (CSS’ni hisobga oladi, sekinroq) |

## XSS — nega `textContent`?

```js
const izoh = document.getElementById('izoh').value;
chiqish.innerHTML = izoh; // XAVFLI!
```

Foydalanuvchi `<img src=x onerror="...">` yozsa, uning kodi **sizning sahifangizda** ishlaydi: cookie’larni, ma’lumotlarni o‘g‘irlashi mumkin. Bu **XSS** (cross-site scripting) hujumi.

```js
chiqish.textContent = izoh; // xavfsiz — teglar shunchaki matn bo‘lib ko‘rinadi
```

Qoida: **foydalanuvchidan kelgan matn — faqat `textContent`**.

## Input qiymatlari

```js
input.value          // matn
input.value = '';    // tozalash
checkbox.checked     // true / false
input.disabled = true;
input.focus();       // kursorni qo‘yish
```

## Ko‘p ishlatiladigan xususiyatlar

| Xususiyat           | Ma’nosi                         |
| ------------------- | ------------------------------- |
| `id`, `className`   | Atributlar                      |
| `value`             | Forma maydoni qiymati           |
| `href`, `src`       | Havola va rasm manzili          |
| `style`             | Ichki uslub                     |
| `classList`         | Klasslar ro‘yxati               |
| `dataset`           | `data-*` atributlar             |
| `hidden`            | Yashirish (`true`/`false`)      |

Har birini keyingi darslarda ko‘ramiz.
