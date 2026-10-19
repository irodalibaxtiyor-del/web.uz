## Ogohlantirish xabarlari

**Alert** — foydalanuvchiga harakat natijasi yoki muhim holat haqida xabar beradigan rangli quti. Asosiy klass `.alert` va to‘rt rangdan biri bilan yoziladi:

```html
<div class="alert alert-success">
  <strong>Tayyor!</strong> Profilingiz saqlandi.
</div>
<div class="alert alert-info">
  <strong>Ma’lumot:</strong> yangi dars ertaga ochiladi.
</div>
<div class="alert alert-warning">
  <strong>Diqqat:</strong> topshiriq muddati 2 kundan keyin tugaydi.
</div>
<div class="alert alert-danger">
  <strong>Xato!</strong> Parol noto‘g‘ri.
</div>
```

| Klass            | Qachon                         |
| ---------------- | ------------------------------ |
| `.alert-success` | Muvaffaqiyatli bajarilgan amal |
| `.alert-info`    | Neytral ma’lumot               |
| `.alert-warning` | E’tibor talab qiladigan holat  |
| `.alert-danger`  | Xato yoki xavfli amal          |

Xabarning birinchi so‘zini `<strong>` bilan yozish odat: “Xato!”, “Tayyor!” — rangni ko‘rmaydigan foydalanuvchi ham ma’noni tushunadi.

## Xabar ichidagi havola

Havolaga `.alert-link` berilsa, uning rangi xabar rangiga moslashadi va qalin bo‘ladi:

```html
<div class="alert alert-warning">
  Profilingiz to‘liq emas. <a href="#" class="alert-link">To‘ldirish</a>
</div>
```

## Yopiladigan xabar

Foydalanuvchi xabarni yopishi uchun:

1. `.alert-dismissible` klassi qo‘shiladi (o‘ng tomonda tugma uchun joy);
2. ichiga `.close` tugmasi qo‘yiladi, unda `data-dismiss="alert"` atributi bo‘ladi.

```html
<div class="alert alert-info alert-dismissible">
  <button type="button" class="close" data-dismiss="alert" aria-label="Yopish">
    <span aria-hidden="true">&times;</span>
  </button>
  Yangi kurslar e’lon qilindi.
</div>
```

`data-dismiss="alert"` ni Bootstrap’ning JavaScript plagini tushunadi: tugma bosilganda xabar DOM’dan **olib tashlanadi**. Shuning uchun jQuery va `bootstrap.min.js` ulangan bo‘lishi kerak.

- `&times;` — × belgisi;
- `aria-label="Yopish"` — ekran o‘quvchi tugma nima qilishini aytadi, `aria-hidden="true"` esa × belgisini o‘qimaydi.

## Silliq yo‘qolish

`.fade` va `.in` klasslari qo‘shilsa, xabar yopilganda asta-sekin xiralashib yo‘qoladi:

```html
<div class="alert alert-success alert-dismissible fade in">
  ...
</div>
```

## Xulosa

- `.alert` + `.alert-success | -info | -warning | -danger`.
- Havola uchun `.alert-link`.
- Yopiladigan xabar: `.alert-dismissible` + `<button class="close" data-dismiss="alert">`.
- Animatsiya: `.fade.in`.
