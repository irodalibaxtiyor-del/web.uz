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

```tekshir
Aloqa formasini botlardan himoya qilishning oddiy, foydalanuvchini bezovta qilmaydigan usuli qaysi?
+ yashirin “honeypot” maydon (odam uni to‘ldirmaydi)
- har bir maydonga murakkab CAPTCHA
- formani butunlay o‘chirish
> Bot yashirin maydonni ham to‘ldiradi — server bunday so‘rovni rad etadi.
```

```jonli
<style>
  label { display: block; margin-top: 8px; }
  input, textarea { width: 100%; max-width: 320px; box-sizing: border-box; padding: 8px; font: inherit; }
  .hp { position: absolute; left: -9999px; }
</style>
<form id="f"><label for="i">Ism</label><input id="i" name="ism" required autocomplete="name">
<label for="x">Xabar</label><textarea id="x" name="xabar" required rows="3"></textarea>
<label class="hp" aria-hidden="true">Bo‘sh qoldiring<input name="website" tabindex="-1" autocomplete="off"></label>
<p><button>Yuborish</button></p><p id="n" role="status"></p></form>
<script>document.getElementById('f').onsubmit = (e) => { e.preventDefault(); document.getElementById('n').textContent = 'Rahmat! Xabaringiz qabul qilindi.'; };</script>
```
