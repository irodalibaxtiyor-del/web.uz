## Panel nima?

**Panel** — chegarali, oq fonli quti. U uch qismdan iborat bo‘lishi mumkin: sarlavha, tana va pastki qism. Bootstrap 3 da kartochka, sozlamalar bloki va yon panel ko‘pincha panel bilan yasaladi.

```html
<div class="panel panel-default">
  <div class="panel-heading">Kurs haqida</div>
  <div class="panel-body">
    Bootstrap 3 kursi 44 ta darsdan iborat.
  </div>
  <div class="panel-footer">Yangilangan: 2026-yil oktabr</div>
</div>
```

| Qism             | Vazifasi                               |
| ---------------- | -------------------------------------- |
| `.panel`         | Tashqi quti (chegara, soya, radius)    |
| `.panel-heading` | Yuqori qism, och kulrang fon           |
| `.panel-body`    | Asosiy kontent, 15px ichki bo‘shliq    |
| `.panel-footer`  | Pastki qism, och kulrang fon           |

Sarlavha qismida haqiqiy sarlavha tegi bo‘lsa, `.panel-title` qo‘shing:

```html
<div class="panel-heading">
  <h3 class="panel-title">Kurs haqida</h3>
</div>
```

## Rangli panellar

`.panel-default` o‘rniga kontekstli klass:

```html
<div class="panel panel-primary">...</div>
<div class="panel panel-success">...</div>
<div class="panel panel-info">...</div>
<div class="panel panel-warning">...</div>
<div class="panel panel-danger">...</div>
```

Rang sarlavha foniga va chegaraga beriladi. Masalan, `.panel-primary` — ko‘k sarlavha va oq matn.

## Panel guruhi

Bir nechta panelni bir-biriga yaqin joylashtirish uchun `.panel-group`:

```html
<div class="panel-group">
  <div class="panel panel-default">...</div>
  <div class="panel panel-default">...</div>
</div>
```

Panel guruhi “Collapse” darsida **akkordeon** yasash uchun ishlatiladi.

## Panel ichida jadval va ro‘yxat

Jadval yoki list group panelga to‘g‘ridan-to‘g‘ri (`.panel-body` dan tashqarida) qo‘yilsa, ular panel chegarasiga yopishib turadi:

```html
<div class="panel panel-default">
  <div class="panel-heading">Eng faol talabalar</div>
  <ul class="list-group">
    <li class="list-group-item">Aziza</li>
    <li class="list-group-item">Bekzod</li>
  </ul>
</div>
```

> Bootstrap 4 da panel, well va thumbnail o‘rniga bitta **card** komponenti bor. Bootstrap 3 loyihasini ko‘chirishda `.panel` → `.card`, `.panel-heading` → `.card-header`, `.panel-body` → `.card-body`.

## Xulosa

- `.panel` + `.panel-default | -primary | -success | …`.
- Qismlar: `.panel-heading` (`.panel-title`), `.panel-body`, `.panel-footer`.
- Bir nechta panel — `.panel-group`.
