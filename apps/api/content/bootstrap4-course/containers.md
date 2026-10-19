## Konteynerlar

Bootstrap’da sahifa kontenti **konteyner** ichiga joylanadi. Konteyner kontentga ichki bo‘shliq (chap va o‘ngda 15px) beradi va uni ekran kengligiga moslab turadi.

```html
<div class="container">
  <h1>Belgilangan kenglikdagi konteyner</h1>
</div>

<div class="container-fluid">
  <h1>To‘liq kenglikdagi konteyner</h1>
</div>
```

## `.container` kengligi

`.container` har bir ekran sinfida ma’lum maksimal kenglikka ega va markazda turadi:

| Ekran (viewport) | Sinf | `.container` `max-width` |
| ---------------- | ---- | ------------------------ |
| < 576px          | xs   | 100%                     |
| ≥ 576px          | sm   | 540px                    |
| ≥ 768px          | md   | 720px                    |
| ≥ 992px          | lg   | 960px                    |
| ≥ 1200px         | xl   | 1140px                   |

`.container-fluid` esa har doim ekranning **to‘liq** kengligini egallaydi.

## Moslashuvchan konteynerlar

Bootstrap 4.4 dan boshlab oraliq variantlar bor: ma’lum sinfgacha 100%, undan keyin belgilangan kenglik.

| Klass             | 100% bo‘ladi | Belgilangan kenglik |
| ----------------- | ------------ | ------------------- |
| `.container-sm`   | < 576px      | ≥ 576px dan          |
| `.container-md`   | < 768px      | ≥ 768px dan          |
| `.container-lg`   | < 992px      | ≥ 992px dan          |
| `.container-xl`   | < 1200px     | ≥ 1200px dan         |

```html
<div class="container-lg">Planshetda to‘liq kenglik, noutbukda 960px</div>
```

## Konteynerga rang va bo‘shliq

Bootstrap 4 utilitalari bilan konteynerni bezash oson:

```html
<div class="container p-3 my-3 bg-dark text-white">
  To‘q fonli, ichki va tashqi bo‘shliqli konteyner
</div>
<div class="container p-3 my-3 border">Chegarali konteyner</div>
```

- `p-3` — ichki bo‘shliq (padding: 1rem);
- `my-3` — yuqori va pastki margin (1rem);
- `bg-dark text-white` — to‘q fon, oq matn;
- `border` — ingichka kulrang chegara.

Bu klasslarni “Utilitalar” modulida batafsil o‘rganamiz.

## Qaysi birini tanlash kerak?

| Holat                                   | Konteyner          |
| --------------------------------------- | ------------------ |
| Matnli sahifa, blog, forma              | `.container`       |
| Admin panel, jadval, to‘liq kenglikdagi banner | `.container-fluid` |
| Planshetda keng, katta ekranda tor      | `.container-lg`    |

Konteynerlarni ichma-ich qo‘yish shart emas — odatda har bir bo‘lim uchun bitta konteyner yetarli.

## Xulosa

- `.container` — markazda, ekranga qarab 540/720/960/1140px.
- `.container-fluid` — doim 100%.
- `.container-sm | -md | -lg | -xl` — ma’lum sinfgacha 100%.
- Utilitalar: `p-*`, `my-*`, `bg-*`, `text-white`, `border`.
