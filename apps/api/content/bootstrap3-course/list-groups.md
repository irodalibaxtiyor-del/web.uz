## List group

**List group** — chegarali bandlardan iborat ro‘yxat. Menyu, sozlamalar ro‘yxati, xabarlar, kategoriyalar uchun qulay.

```html
<ul class="list-group">
  <li class="list-group-item">HTML asoslari</li>
  <li class="list-group-item">CSS bilan bezash</li>
  <li class="list-group-item">Bootstrap 3</li>
</ul>
```

## Badge bilan

Band ichidagi `.badge` avtomatik o‘ng tomonga suriladi:

```html
<ul class="list-group">
  <li class="list-group-item">Yangi xabarlar <span class="badge">12</span></li>
  <li class="list-group-item">Topshiriqlar <span class="badge">3</span></li>
</ul>
```

## Havolali bandlar

Bandlar bosiladigan bo‘lsa, `<ul>` o‘rniga `<div>` va `<a>` ishlatiladi:

```html
<div class="list-group">
  <a href="#" class="list-group-item active">Profil</a>
  <a href="#" class="list-group-item">Kurslarim</a>
  <a href="#" class="list-group-item">Sertifikatlar</a>
  <a href="#" class="list-group-item disabled">Arxiv (tez kunda)</a>
</div>
```

| Klass       | Ma’nosi                          |
| ----------- | -------------------------------- |
| `.active`   | Tanlangan band (ko‘k fon, oq matn) |
| `.disabled` | O‘chirilgan band (kulrang)       |

Havolali bandlar hover’da och kulrang bo‘ladi.

## Rangli bandlar

```html
<ul class="list-group">
  <li class="list-group-item list-group-item-success">To‘lov qabul qilindi</li>
  <li class="list-group-item list-group-item-info">Dars ertaga 10:00 da</li>
  <li class="list-group-item list-group-item-warning">Topshiriq muddati yaqin</li>
  <li class="list-group-item list-group-item-danger">Ulanishda xato</li>
</ul>
```

## Kontentli bandlar

Band ichida sarlavha va matn bo‘lishi mumkin:

```html
<div class="list-group">
  <a href="#" class="list-group-item">
    <h4 class="list-group-item-heading">Flexbox</h4>
    <p class="list-group-item-text">Elementlarni bir yo‘nalishda joylashtirish.</p>
  </a>
</div>
```

## Foydalanish imkoniyati

Tanlangan bandga faqat `.active` emas, `aria-current="true"` ham qo‘shing — ekran o‘quvchi qaysi band tanlanganini aytadi.

## Xulosa

- `.list-group` > `.list-group-item`.
- Havolali ro‘yxat: `div.list-group` > `a.list-group-item`; `.active`, `.disabled`.
- Rang: `.list-group-item-success | -info | -warning | -danger`.
- Sarlavha va matn: `.list-group-item-heading`, `.list-group-item-text`.
