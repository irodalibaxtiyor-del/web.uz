## Forma — eng muhim joy

Ro‘yxatdan o‘tish, buyurtma, aloqa — foydalanuvchi aynan formada eng ko‘p qiynaladi. Telefonda kichik maydonlar va noto‘g‘ri klaviatura uni saytdan qochirib yuboradi.

## Maket

```css
.forma {
  display: grid;
  gap: 16px;
}

@media (min-width: 640px) {
  .forma { grid-template-columns: 1fr 1fr; }
  .toliq { grid-column: 1 / -1; }
}
```

Telefonda hamma maydon bitta ustunda, kengroq ekranda qisqa maydonlar (ism, familiya) yonma-yon, uzunlari (email, xabar) to‘liq kenglikda.

Bitta ustunli forma odatda tezroq to‘ldiriladi: ko‘z faqat pastga harakatlanadi. Ikki ustunni faqat mantiqan bog‘liq qisqa maydonlar uchun ishlating.

## Maydon o‘lchami

```css
input,
textarea,
select {
  width: 100%;
  font-size: 1rem;
  min-height: 44px;
  padding: 10px 12px;
}
```

- `font-size` 16px dan kam bo‘lsa, iPhone maydonni bosganda sahifani kattalashtirib yuboradi;
- `min-height: 44px` — barmoq uchun qulay;
- `width: 100%` — maydon o‘z ustunini to‘liq egallaydi.

## To‘g‘ri klaviatura

`type` va `inputmode` telefonga qaysi klaviaturani ochishni aytadi:

| Maydon | Yozuv | Klaviatura |
| --- | --- | --- |
| Email | `type="email"` | `@` va `.` bor |
| Telefon | `type="tel"` | raqamlar |
| Son | `inputmode="numeric"` | raqamlar |
| Qidiruv | `type="search"` | “Qidirish” tugmasi |

## Avtomatik to‘ldirish

```html
<input name="email" type="email" autocomplete="email">
<input name="ism" autocomplete="given-name">
```

`autocomplete` bilan brauzer saqlangan ma’lumotni bir bosishda qo‘yadi — telefonda bu juda katta qulaylik.

## Yorliqlar

Har bir maydonning `<label>` i bo‘lishi shart. Faqat `placeholder` yetmaydi: yozishni boshlaganda u yo‘qoladi va foydalanuvchi nima kiritayotganini unutadi. Yorliqni maydon **ustiga** qo‘ying — tor ekranda yon tomonda joy yo‘q.

Mashqda aloqa formasini telefon va kompyuter uchun moslashtirasiz.

```tekshir
Telefonda raqamli klaviatura chiqishi uchun telefon raqami maydoniga nima yoziladi?
+ `type="tel"`
- `type="number"` (telefon uchun eng yaxshisi)
- `inputmode="text"`
> `type="tel"` raqamli klaviaturani chiqaradi va `autocomplete="tel"` bilan avtomatik to‘ldiriladi.
```

```jonli
<style>
  label { display: block; margin-top: 8px; }
  input { width: 100%; box-sizing: border-box; padding: 10px; font: inherit; font-size: 16px; }
</style>
<label for="t">Telefon</label><input id="t" type="tel" autocomplete="tel" placeholder="+998 90 123 45 67">
<label for="e">Email</label><input id="e" type="email" autocomplete="email">
```
