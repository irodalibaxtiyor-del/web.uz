## Aloqa formasi

Email havolasidan tashqari ko‘p portfoliolarda kichik aloqa formasi bo‘ladi: ism, email, xabar. Foydalanuvchi email dasturini ochmasdan yozadi, siz esa spam botlarga manzilingizni ochiq qoldirmaysiz.

## Brauzer tekshiruvi

HTML atributlarining o‘zi ko‘p xatolarni yuborishdan oldin ushlaydi:

```html
<label>Ismingiz <input name="ism" required autocomplete="name" /></label>
<label>Email <input type="email" name="email" required autocomplete="email" /></label>
<label>Xabar <textarea name="xabar" rows="4" required minlength="10"></textarea></label>
```

| Atribut        | Vazifasi                                            |
| -------------- | --------------------------------------------------- |
| `required`     | Bo‘sh qoldirib bo‘lmaydi                            |
| `type="email"` | `@` va domen tekshiriladi; telefonda mos klaviatura |
| `minlength`    | Kamida N belgi                                      |
| `autocomplete` | Brauzer saqlangan ma’lumotni taklif qiladi          |

Xato bo‘lsa, brauzer `submit` hodisasini umuman chiqarmaydi va xato maydoniga fokusni o‘tkazadi.

**Muhim:** brauzer tekshiruvi — qulaylik, himoya emas. Uni chetlab o‘tish oson, shuning uchun ma’lumotni qabul qiladigan server albatta qayta tekshiradi.

## Yuborish

```js
const forma = document.querySelector('.forma');
const natija = document.querySelector('.natija');

forma.addEventListener('submit', (e) => {
  e.preventDefault();
  natija.textContent = 'Rahmat! Xabaringiz yuborildi.';
  forma.reset();
});
```

Haqiqiy saytda bu yerda `fetch()` bilan serverga (yoki Formspree kabi xizmatga) yuboriladi, natija va xato holatlari ko‘rsatiladi. Statik portfolioda server bo‘lmasa, bunday xizmatlar qulay.

## Natija xabari

```html
<p class="natija" role="status"></p>
```

`role="status"` — matn paydo bo‘lganda ekran o‘quvchi uni o‘qiydi. Xato bo‘lsa (`fetch` muvaffaqiyatsiz) — aniq tushuntiring va foydalanuvchi yozgan matnni o‘chirmang.

## Spamdan himoya

- **Honeypot**: CSS bilan yashirilgan qo‘shimcha maydon. Odam uni ko‘rmaydi, bot to‘ldiradi — bunday xabarni server tashlab yuboradi.
- Server tomonida so‘rovlar sonini cheklash.
- CAPTCHA — oxirgi chora, foydalanuvchiga noqulay.

## Qulay forma

Har bir maydonning ko‘rinadigan yorlig‘i, kamida 44px balandlik, 16px shrift (telefonda kattalashib ketmasligi uchun), aniq xato matnlari — “UI asoslari” kursidagi qoidalar.

Mashqda formani brauzer tekshiruvi va natija xabari bilan to‘ldirasiz.
