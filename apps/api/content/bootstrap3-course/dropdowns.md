## Ochiladigan menyu

**Dropdown** — tugma bosilganda ochiladigan havolalar ro‘yxati. U Bootstrap’ning JavaScript plagini bilan ishlaydi, shuning uchun jQuery va `bootstrap.min.js` ulangan bo‘lishi shart.

```html
<div class="dropdown">
  <button class="btn btn-default dropdown-toggle" type="button" id="kursMenyu"
          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Kurslar <span class="caret"></span>
  </button>
  <ul class="dropdown-menu" aria-labelledby="kursMenyu">
    <li><a href="#">HTML</a></li>
    <li><a href="#">CSS</a></li>
    <li><a href="#">JavaScript</a></li>
  </ul>
</div>
```

Qismlar:

| Qism                     | Vazifasi                                         |
| ------------------------ | ------------------------------------------------ |
| `.dropdown`              | Ota element (`position: relative`)              |
| `.dropdown-toggle`       | Menyuni ochuvchi tugma                           |
| `data-toggle="dropdown"` | Plaginga “bu tugma menyuni ochadi” deydi         |
| `.caret`                 | Pastga qaragan kichik uchburchak                 |
| `.dropdown-menu`         | Yashirin ro‘yxat                                 |

Tugma bosilganda plagin ota elementga `.open` klassini qo‘shadi va menyu ko‘rinadi. Sahifaning boshqa joyiga bosilsa yoki **Esc** bosilsa, menyu yopiladi. `aria-expanded` qiymatini ham plagin o‘zi almashtiradi.

## Menyu ichidagi qo‘shimcha elementlar

```html
<ul class="dropdown-menu">
  <li class="dropdown-header">Frontend</li>
  <li><a href="#">HTML</a></li>
  <li><a href="#">CSS</a></li>
  <li role="separator" class="divider"></li>
  <li class="dropdown-header">Backend</li>
  <li><a href="#">PHP</a></li>
  <li class="disabled"><a href="#">Python (tez kunda)</a></li>
</ul>
```

- `.dropdown-header` — guruh sarlavhasi (bosilmaydi);
- `.divider` — ajratuvchi chiziq;
- `.disabled` — o‘chirilgan band;
- `.active` — tanlangan band.

## Yuqoriga ochilish va o‘ngga tekislash

```html
<div class="dropup">...</div>                         <!-- menyu yuqoriga ochiladi -->
<ul class="dropdown-menu dropdown-menu-right">...</ul> <!-- o‘ng chetga tekislanadi -->
```

## Tugma guruhida dropdown

```html
<div class="btn-group">
  <button type="button" class="btn btn-primary">Saqlash</button>
  <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown"
          aria-haspopup="true" aria-expanded="false">
    <span class="caret"></span><span class="sr-only">Boshqa variantlar</span>
  </button>
  <ul class="dropdown-menu">
    <li><a href="#">Qoralama sifatida saqlash</a></li>
    <li><a href="#">Nusxa yaratish</a></li>
  </ul>
</div>
```

Bu “split button”: asosiy amal chapda, qo‘shimcha variantlar o‘ngdagi strelkada.

## Xulosa

- `.dropdown` > `button.dropdown-toggle[data-toggle="dropdown"]` + `ul.dropdown-menu`.
- Ochilganda ota elementga `.open` qo‘shiladi.
- `.dropdown-header`, `.divider`, `.disabled`, `.active` — menyu bandlari.
- `.dropup`, `.dropdown-menu-right` — yo‘nalish va tekislash.
