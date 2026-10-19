## Konteynerlar

Konteyner kontentni o‘rab, chetlardan ichki bo‘shliq beradi va ekran kengligiga moslashadi. Bootstrap 5 da konteyner padding’i — `0.75rem` (12px) chap va o‘ngda.

```html
<div class="container">Belgilangan kenglikdagi konteyner</div>
<div class="container-fluid">To‘liq kenglikdagi konteyner</div>
```

## Kengliklar

| Viewport   | Sinf | `.container` | `-sm` | `-md` | `-lg` | `-xl` | `-xxl` | `-fluid` |
| ---------- | ---- | ------------ | ----- | ----- | ----- | ----- | ------ | -------- |
| < 576px    | xs   | 100%         | 100%  | 100%  | 100%  | 100%  | 100%   | 100%     |
| ≥ 576px    | sm   | 540px        | 540px | 100%  | 100%  | 100%  | 100%   | 100%     |
| ≥ 768px    | md   | 720px        | 720px | 720px | 100%  | 100%  | 100%   | 100%     |
| ≥ 992px    | lg   | 960px        | 960px | 960px | 960px | 100%  | 100%   | 100%     |
| ≥ 1200px   | xl   | 1140px       | 1140px | 1140px | 1140px | 1140px | 100% | 100%     |
| ≥ 1400px   | xxl  | **1320px**   | 1320px | 1320px | 1320px | 1320px | 1320px | 100%   |

Yangi sinf — **xxl** (1400px dan), unda `.container` 1320px.

## Moslashuvchan konteynerlar

`.container-{sinf}` — shu sinfgacha 100%, undan keyin belgilangan kenglik:

```html
<div class="container-md">Telefon va kichik planshetda 100%, md dan 720px</div>
<div class="container-xxl">1400px gacha 100%, keyin 1320px</div>
```

## Bezash

Utilitalar bilan:

```html
<div class="container p-5 my-5 bg-dark text-white">To‘q konteyner</div>
<div class="container p-5 my-5 border">Chegarali konteyner</div>
<div class="container p-5 my-5 bg-primary text-white rounded-3">Ko‘k, yumaloq</div>
```

- `p-5` — ichki bo‘shliq 3rem;
- `my-5` — yuqori va pastki margin 3rem;
- `rounded-3` — burchak radiusi (Bootstrap 5 da `rounded-0` … `rounded-5`).

## Qorong‘i rejimli konteyner

Bootstrap 5.3 dan har qanday elementga mavzu berish mumkin:

```html
<div class="container p-4 bg-body text-body" data-bs-theme="dark">
  Bu blok ichida hamma narsa qorong‘i rejimda
</div>
```

Buni “Qorong‘i rejim” darsida batafsil ko‘ramiz.

## Xulosa

- `.container` — 540 / 720 / 960 / 1140 / 1320px; `.container-fluid` — doim 100%.
- `.container-sm | -md | -lg | -xl | -xxl` — shu sinfgacha 100%.
- Bootstrap 5 da konteyner padding’i 12px.
