## Ma’noli ranglar

Bootstrap’da ranglarni hex kodi bilan emas, **ma’nosi** bilan tanlaysiz. Bootstrap 4 palitrasi:

| Nomi        | Rang (hex) | Odatdagi ma’nosi                  |
| ----------- | ---------- | --------------------------------- |
| `primary`   | `#007bff`  | Asosiy amal, brend                |
| `secondary` | `#6c757d`  | Ikkinchi darajali                 |
| `success`   | `#28a745`  | Muvaffaqiyat                      |
| `danger`    | `#dc3545`  | Xato, xavfli amal                 |
| `warning`   | `#ffc107`  | Ogohlantirish                     |
| `info`      | `#17a2b8`  | Ma’lumot                          |
| `light`     | `#f8f9fa`  | Och fon                           |
| `dark`      | `#343a40`  | To‘q fon                          |

Bu nomlar deyarli barcha komponentlarda takrorlanadi: `btn-success`, `alert-success`, `badge-success`, `bg-success`, `text-success`, `border-success`…

## Matn rangi

```html
<p class="text-primary">Asosiy</p>
<p class="text-success">Saqlandi</p>
<p class="text-danger">Xato yuz berdi</p>
<p class="text-muted">Qo‘shimcha ma’lumot</p>
<p class="text-white bg-dark">Oq matn</p>
<p class="text-black-50">Yarim shaffof qora</p>
<p class="text-white-50 bg-dark">Yarim shaffof oq</p>
```

Havolalarga ham beriladi — hover’da avtomatik to‘qlashadi:

```html
<a href="#" class="text-danger">Hisobni o‘chirish</a>
```

## Fon rangi

```html
<div class="p-3 mb-2 bg-primary text-white">bg-primary</div>
<div class="p-3 mb-2 bg-warning text-dark">bg-warning</div>
<div class="p-3 mb-2 bg-light text-dark">bg-light</div>
<div class="p-3 mb-2 bg-dark text-white">bg-dark</div>
<div class="p-3 mb-2 bg-white text-dark border">bg-white</div>
```

`bg-*` matn rangini o‘zgartirmaydi — mos `text-*` ni o‘zingiz qo‘shasiz.

## Kontrast

Rangli fonda matn o‘qilishi uchun kontrast yetarli bo‘lishi kerak (WCAG tavsiyasi: oddiy matn uchun kamida 4.5:1).

| Fon          | Matn                |
| ------------ | ------------------- |
| `bg-primary`, `bg-success`, `bg-danger`, `bg-dark`, `bg-secondary` | `text-white` |
| `bg-warning`, `bg-light`, `bg-info` (och) | `text-dark` |

Sariq (`warning`) fonda oq matn deyarli o‘qilmaydi — doim to‘q matn ishlating.

## Rang yagona belgi bo‘lmasin

Rangni ajrata olmaydigan foydalanuvchilar ko‘p (erkaklarning ~8%). Ma’noni rang bilan **birga** so‘z yoki ikonka bilan ham bering:

```html
<p class="text-danger"><strong>Xato:</strong> parol juda qisqa.</p>
```

## Xulosa

- Sakkizta ma’noli rang: primary, secondary, success, danger, warning, info, light, dark.
- Matn — `.text-*`, fon — `.bg-*` (matn rangini alohida bering).
- Kontrastni tekshiring; rang yagona belgi bo‘lmasin.
