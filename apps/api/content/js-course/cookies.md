## Cookie’lar

**Cookie** — brauzer saqlaydigan va **har bir so‘rov bilan serverga** yuboradigan kichik matn. Asosan sessiya (kirganlik), til tanlovi kabi narsalar uchun.

## O‘qish

```js
document.cookie // 'til=ru; mavzu=qorongi'
```

Barcha cookie’lar bitta satrda, `; ` bilan ajratilgan. Bittasini olish uchun parse qilish kerak:

```js
function cookieOl(nom) {
  for (const qism of document.cookie.split('; ')) {
    const [kalit, qiymat] = qism.split('=');
    if (kalit === nom) return decodeURIComponent(qiymat);
  }
  return null;
}
```

## Yozish

`document.cookie` ga yozish **bitta** cookie qo‘shadi yoki yangilaydi (boshqalarini o‘chirmaydi):

```js
document.cookie = 'til=ru; max-age=31536000; path=/; SameSite=Lax';
```

| Parametr          | Ma’nosi                                           |
| ----------------- | ------------------------------------------------- |
| `max-age=soniya`  | Necha soniya yashaydi (yo‘q bo‘lsa — brauzer yopilguncha) |
| `expires=sana`    | Eski usul: aniq tugash sanasi                     |
| `path=/`          | Saytning qaysi sahifalarida ko‘rinadi             |
| `SameSite=Lax`    | Boshqa saytlardan so‘rovda yuborilmaydi (CSRF himoyasi) |
| `Secure`          | Faqat HTTPS orqali                                |

Qiymatda maxsus belgilar bo‘lsa — `encodeURIComponent(qiymat)`.

## O‘chirish

`max-age=0` (yoki o‘tgan sana) bilan qayta yozish:

```js
document.cookie = 'til=; max-age=0; path=/';
```

`path` yozilgandagi bilan bir xil bo‘lishi kerak, aks holda boshqa cookie hisoblanadi.

## Xavfsizlik

- **Sessiya cookie’lari** server tomonidan `HttpOnly` bilan o‘rnatiladi — JavaScript ularni **ko‘ra olmaydi**. Bu XSS hujumida sessiyani o‘g‘irlashdan himoya qiladi. WEBDIZAYN.UZ ning o‘zi ham shunday ishlaydi.
- Parol, token kabi maxfiy ma’lumotni JavaScript’dan cookie’ga **yozmang**.
- Har bir cookie har so‘rov bilan yuboriladi — katta ma’lumot uchun `localStorage` mos.

## Qachon cookie, qachon localStorage?

| Kerak                                  | Tanlov          |
| -------------------------------------- | --------------- |
| Server ham bilishi kerak (sessiya, til) | Cookie          |
| Faqat brauzerdagi sozlama yoki qoralama | `localStorage`  |
| Tab yopilguncha                         | `sessionStorage` |

## Cookie mavjud bo‘lmasligi mumkin

Foydalanuvchi cookie’larni o‘chirib qo‘ygan, maxfiy rejimda yoki izolyatsiyalangan iframe ichida (masalan, mashq preview’ida) `document.cookie` xato beradi yoki ishlamaydi. Kodni `try...catch` bilan himoyalang va sahifa cookie’siz ham ishlasin:

```js
let zaxira = null; // cookie ishlamasa — xotirada

function tilSaqla(til) {
  try {
    document.cookie = `til=${til}; max-age=31536000; path=/; SameSite=Lax`;
  } catch {
    zaxira = til;
  }
}
```
