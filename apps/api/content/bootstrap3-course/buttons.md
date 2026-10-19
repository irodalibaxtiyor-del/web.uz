## Tugma klasslari

Bootstrap tugmasi ikki klassdan iborat: asosiy `.btn` va rang/uslub klassi.

```html
<button type="button" class="btn btn-default">Oddiy</button>
<button type="button" class="btn btn-primary">Asosiy</button>
<button type="button" class="btn btn-success">Muvaffaqiyat</button>
<button type="button" class="btn btn-info">Ma’lumot</button>
<button type="button" class="btn btn-warning">Diqqat</button>
<button type="button" class="btn btn-danger">Xavf</button>
<button type="button" class="btn btn-link">Havola ko‘rinishida</button>
```

| Klass          | Odatdagi ishlatilishi                         |
| -------------- | --------------------------------------------- |
| `.btn-default` | Oq, ikkinchi darajali amal (“Bekor qilish”)   |
| `.btn-primary` | Sahifadagi asosiy amal (“Saqlash”, “Yuborish”) |
| `.btn-success` | Ijobiy amal (“Tasdiqlash”)                    |
| `.btn-danger`  | Xavfli amal (“O‘chirish”)                      |
| `.btn-link`    | Havola kabi, lekin tugma o‘lchamida           |

Bitta ekranda **bitta** `.btn-primary` bo‘lgani ma’qul — foydalanuvchi asosiy amalni darrov topadi.

## Qaysi teglarga beriladi?

`.btn` klassini `<button>`, `<a>` va `<input>` ga berish mumkin:

```html
<a href="/kurslar" class="btn btn-default" role="button">Kurslar</a>
<button type="submit" class="btn btn-primary">Yuborish</button>
<input type="submit" class="btn btn-success" value="Jo‘natish">
```

Qoidani eslab qoling: **sahifaga o‘tish — havola (`<a>`), amal bajarish — tugma (`<button>`)**.

## O‘lchamlar

```html
<button class="btn btn-primary btn-lg">Katta</button>
<button class="btn btn-primary">Oddiy</button>
<button class="btn btn-primary btn-sm">Kichik</button>
<button class="btn btn-primary btn-xs">Juda kichik</button>
```

| Klass     | Shrift | Ichki bo‘shliq |
| --------- | ------ | -------------- |
| `.btn-lg` | 18px   | 10px 16px      |
| (oddiy)   | 14px   | 6px 12px       |
| `.btn-sm` | 12px   | 5px 10px       |
| `.btn-xs` | 12px   | 1px 5px        |

## Blok tugma

`.btn-block` tugmani ota elementning **to‘liq kengligiga** cho‘zadi — telefonda forma ostidagi asosiy tugma uchun qulay:

```html
<button type="submit" class="btn btn-success btn-block">Ro‘yxatdan o‘tish</button>
```

## Holatlar

**Faol (bosilgan)** — `.active`:

```html
<button class="btn btn-default active">Tanlangan</button>
```

**O‘chirilgan** — `<button>` uchun `disabled` atributi, `<a>` uchun `.disabled` klassi:

```html
<button class="btn btn-primary" disabled>Yuborilmoqda…</button>
<a href="#" class="btn btn-default disabled" role="button" aria-disabled="true">Mavjud emas</a>
```

O‘chirilgan tugma xiralashadi (`opacity: .65`) va kursor `not-allowed` ko‘rinishida bo‘ladi.

## Xulosa

- Tugma = `.btn` + rang klassi (`.btn-primary`, `.btn-danger`…).
- O‘lcham: `.btn-lg`, `.btn-sm`, `.btn-xs`; to‘liq kenglik — `.btn-block`.
- Holatlar: `.active`, `disabled`.
- Sahifaga o‘tish — `<a class="btn">`, amal — `<button>`.
