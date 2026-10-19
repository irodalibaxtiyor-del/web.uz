## Progress bar

Bootstrap 5.3 da progress bar tuzilmasi yangilandi: `role` va `aria-*` atributlari **tashqi** `.progress` elementiga yoziladi.

```html
<div class="progress" role="progressbar" aria-label="HTML kursi progressi"
     aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar" style="width: 60%">60%</div>
</div>
```

- `.progress` — yo‘lak, ekran o‘quvchi uchun progressbar;
- `.progress-bar` — to‘lgan qism, kengligi `style="width: …"` yoki `w-*` utilitasi bilan.

> Eski usul (atributlar ichki `.progress-bar` da) hali ham ishlaydi, lekin 5.3 hujjatlari yangisini tavsiya qiladi.

## Balandlik va rang

```html
<div class="progress" role="progressbar" aria-label="Yuklash" aria-valuenow="25"
     aria-valuemin="0" aria-valuemax="100" style="height: 6px">
  <div class="progress-bar bg-success" style="width: 25%"></div>
</div>
```

- Balandlik — tashqi `.progress` ga;
- Rang — `bg-*` (yoki matn bilan `text-bg-*`):

```html
<div class="progress-bar text-bg-warning" style="width: 75%">75%</div>
```

## Chiziqli va harakatlanuvchi

```html
<div class="progress" role="progressbar" aria-label="CSS" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 45%"></div>
</div>
```

## Bir nechta qism: `.progress-stacked`

5.3 da bir nechta qismli progress uchun yangi o‘ram:

```html
<div class="progress-stacked">
  <div class="progress" role="progressbar" aria-label="Darslar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%">
    <div class="progress-bar bg-success"></div>
  </div>
  <div class="progress" role="progressbar" aria-label="Mashqlar" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100" style="width: 25%">
    <div class="progress-bar bg-warning"></div>
  </div>
</div>
```

Bu yerda har bir qism o‘z `.progress` elementi bilan — har biri ekran o‘quvchiga alohida nom bilan o‘qiladi.

## Matn haqida

Bar ichidagi matn bar juda tor bo‘lsa sig‘maydi. Muhim qiymatni bar yonida ham yozing:

```html
<div class="d-flex justify-content-between small"><span>HTML</span><span>60%</span></div>
```

## Xulosa

- `div.progress[role="progressbar"][aria-label][aria-value*]` > `div.progress-bar[style="width:…"]`.
- Rang — `bg-*`/`text-bg-*`; chiziq — `.progress-bar-striped`, harakat — `.progress-bar-animated`.
- Bir nechta qism — `.progress-stacked`.
