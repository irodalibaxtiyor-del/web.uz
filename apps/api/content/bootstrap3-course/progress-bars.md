## Progress bar

**Progress bar** jarayon qancha bajarilganini ko‘rsatadi: kurs progressi, fayl yuklash, profilning to‘ldirilganligi.

```html
<div class="progress">
  <div class="progress-bar" role="progressbar"
       aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width: 70%">
    70%
  </div>
</div>
```

Tuzilma ikki qavatli:

- `.progress` — kulrang “yo‘lak” (to‘liq kenglik);
- `.progress-bar` — to‘lgan qism; uning kengligi `style="width: 70%"` bilan beriladi.

## Foydalanish imkoniyati

Ekran o‘quvchi uchun atributlar:

| Atribut          | Ma’nosi             |
| ---------------- | ------------------- |
| `role="progressbar"` | Bu progress ko‘rsatkichi |
| `aria-valuenow`  | Joriy qiymat        |
| `aria-valuemin`  | Eng kichik qiymat   |
| `aria-valuemax`  | Eng katta qiymat    |

Foiz matnini ko‘rsatmasangiz, uni `.sr-only` bilan yashirin yozing: `<span class="sr-only">70% bajarildi</span>`.

## Rangli progress bar

```html
<div class="progress-bar progress-bar-success" style="width: 40%">40%</div>
<div class="progress-bar progress-bar-info" style="width: 50%">50%</div>
<div class="progress-bar progress-bar-warning" style="width: 60%">60%</div>
<div class="progress-bar progress-bar-danger" style="width: 80%">80%</div>
```

## Chiziqli va harakatlanuvchi

```html
<div class="progress">
  <div class="progress-bar progress-bar-striped active" role="progressbar"
       aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 45%">
    45%
  </div>
</div>
```

- `.progress-bar-striped` — diagonal chiziqlar (gradient);
- `.active` — chiziqlar harakatlanadi (animatsiya). Jarayon davom etayotganini ko‘rsatish uchun qulay.

## Bir nechta qism (stacked)

Bitta `.progress` ichiga bir nechta bar qo‘yish mumkin — ular yonma-yon tiziladi:

```html
<div class="progress">
  <div class="progress-bar progress-bar-success" style="width: 50%">Bajarildi</div>
  <div class="progress-bar progress-bar-warning" style="width: 20%">Jarayonda</div>
  <div class="progress-bar progress-bar-danger" style="width: 10%">Muammo</div>
</div>
```

Kengliklar yig‘indisi 100% dan oshmasligi kerak.

## Xulosa

- `.progress` > `.progress-bar` + `style="width: N%"`.
- `role="progressbar"` va `aria-value*` atributlari.
- Rang: `.progress-bar-success | -info | -warning | -danger`; chiziqli: `.progress-bar-striped`, harakat: `.active`.
