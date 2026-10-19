## Badge

Bootstrap 5 da badge rangi **fon utilitasi** bilan beriladi (`badge-primary` endi yo‘q):

```html
<h3>Bootstrap kursi <span class="badge bg-success">Yangi</span></h3>
<span class="badge text-bg-warning">Tez kunda</span>
<span class="badge text-bg-light">12</span>
```

- `.badge bg-success` — yashil fon (matn oq);
- `.badge text-bg-warning` — sariq fon va unga mos to‘q matn (tavsiya etiladi — kontrast avtomatik to‘g‘ri).

## Pill shakli

Bootstrap 4 dagi `.badge-pill` o‘rniga umumiy utilita `.rounded-pill`:

```html
<span class="badge rounded-pill text-bg-primary">14</span>
```

## Tugma ichida

```html
<button type="button" class="btn btn-primary">
  Xabarlar <span class="badge text-bg-light">4</span>
</button>
```

## Burchakdagi bildirishnoma belgisi

Pozitsiya utilitalari bilan:

```html
<button type="button" class="btn btn-primary position-relative">
  Xabarlar
  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
    99+
    <span class="visually-hidden">o‘qilmagan xabar</span>
  </span>
</button>
```

| Utilita                   | Vazifasi                                         |
| ------------------------- | ------------------------------------------------ |
| `position-relative`       | Tugma — badge uchun tayanch                      |
| `position-absolute`       | Badge oqimdan chiqadi                            |
| `top-0 start-100`         | Tugmaning yuqori o‘ng burchagi                   |
| `translate-middle`        | Badge markazini aynan burchakka siljitadi        |
| `visually-hidden`         | Ekran o‘quvchi uchun izoh (Bootstrap 4 dagi `.sr-only`) |

Sonsiz kichik nuqta:

```html
<span class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
  <span class="visually-hidden">Yangi xabar</span>
</span>
```

## Ro‘yxatda

```html
<li class="list-group-item d-flex justify-content-between align-items-center">
  Topshiriqlar
  <span class="badge text-bg-primary rounded-pill">3</span>
</li>
```

## Bootstrap 4 → 5

| Bootstrap 4                        | Bootstrap 5                         |
| ---------------------------------- | ----------------------------------- |
| `badge badge-success`              | `badge bg-success` / `text-bg-success` |
| `badge-pill`                       | `rounded-pill`                      |
| `sr-only`                          | `visually-hidden`                   |

## Xulosa

- `.badge` + `bg-*` yoki `text-bg-*`; pill — `.rounded-pill`.
- Burchakdagi belgi: `position-relative` + `position-absolute top-0 start-100 translate-middle`.
- Izohni `visually-hidden` bilan yozing.
