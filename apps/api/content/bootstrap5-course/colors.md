## Ranglar

Bootstrap 5 palitrasi:

| Nomi        | Hex        |
| ----------- | ---------- |
| `primary`   | `#0d6efd`  |
| `secondary` | `#6c757d`  |
| `success`   | `#198754`  |
| `danger`    | `#dc3545`  |
| `warning`   | `#ffc107`  |
| `info`      | `#0dcaf0`  |
| `light`     | `#f8f9fa`  |
| `dark`      | `#212529`  |

## Matn rangi

```html
<p class="text-primary">Asosiy</p>
<p class="text-success">Saqlandi</p>
<p class="text-danger">Xato</p>
<p class="text-body-secondary">Ikkinchi darajali matn</p>
<p class="text-body-emphasis">Ta’kidlangan matn</p>
<p class="text-white bg-dark">Oq</p>
```

**Kontrastli matn** — rangli fon ustida yaxshi o‘qiladigan to‘q variantlar (5.3):

```html
<p class="text-primary-emphasis">To‘q ko‘k matn</p>
<p class="text-danger-emphasis bg-danger-subtle p-2">Xato xabari</p>
```

## Fon rangi

```html
<div class="p-3 mb-2 bg-primary text-white">bg-primary</div>
<div class="p-3 mb-2 bg-success-subtle text-success-emphasis">bg-success-subtle</div>
<div class="p-3 mb-2 bg-body-tertiary">bg-body-tertiary</div>
```

- `.bg-*-subtle` — och, yumshoq fon (alert, badge uchun qulay);
- `.bg-body`, `.bg-body-secondary`, `.bg-body-tertiary` — sahifa fonining variantlari, qorong‘i rejimda o‘zi o‘zgaradi.

## Fon va matn birga: `text-bg-*`

Bootstrap 5.2 dan bitta klass fon va unga mos (kontrastli) matnni birga beradi:

```html
<span class="badge text-bg-warning">Diqqat</span>   <!-- sariq fon, to‘q matn -->
<div class="card text-bg-primary">…</div>          <!-- ko‘k fon, oq matn -->
```

Bu `bg-warning text-dark` ni qo‘lda tanlashdan qulayroq va xatoga yo‘l qo‘ymaydi.

## Shaffoflik

```html
<p class="text-primary text-opacity-50">50% shaffof matn</p>
<div class="bg-success bg-opacity-25 p-2">25% shaffof fon</div>
```

Bu Bootstrap 5 ranglari CSS o‘zgaruvchilar (`--bs-primary-rgb`) orqali ishlagani uchun mumkin.

## Havola rangi

```html
<a href="#" class="link-primary">Ko‘k havola</a>
<a href="#" class="link-danger link-underline-opacity-25">Qizil havola, och tagchiziq</a>
```

## Kontrast va ma’no

- Sariq (`warning`) va moviy (`info`) fonda to‘q matn ishlating — `text-bg-*` buni o‘zi qiladi.
- Rang yagona belgi bo‘lmasin: “Xato:” so‘zi yoki ikonka ham bo‘lsin.

## Xulosa

- `text-*`, `bg-*`, `text-bg-*` (fon + mos matn).
- `-subtle` (och fon) va `-emphasis` (to‘q matn) variantlari.
- `text-opacity-*`, `bg-opacity-*`; havolalar — `link-*`.
