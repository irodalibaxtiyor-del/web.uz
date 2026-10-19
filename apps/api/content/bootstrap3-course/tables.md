## Asosiy jadval

Oddiy `<table>` ga `.table` klassi berilsa, Bootstrap unga ichki bo‘shliq (padding), gorizontal chiziqlar va 100% kenglik beradi:

```html
<table class="table">
  <thead>
    <tr><th>Ism</th><th>Kurs</th><th>Ball</th></tr>
  </thead>
  <tbody>
    <tr><td>Aziza</td><td>HTML</td><td>92</td></tr>
    <tr><td>Bekzod</td><td>CSS</td><td>85</td></tr>
  </tbody>
</table>
```

`<thead>` va `<tbody>` ni yozishni unutmang: Bootstrap uslublari (masalan, sarlavha ostidagi qalin chiziq, “zebra” qatorlar) shularga tayanadi.

## Qo‘shimcha ko‘rinishlar

`.table` bilan **birga** ishlatiladi:

| Klass              | Natija                                       |
| ------------------ | -------------------------------------------- |
| `.table-striped`   | Juft-toq qatorlar turli fonda (“zebra”)      |
| `.table-bordered`  | Har bir katak atrofida chegara               |
| `.table-hover`     | Sichqoncha ustidagi qator ajralib turadi     |
| `.table-condensed` | Ixcham: padding ikki barobar kichik          |

```html
<table class="table table-striped table-bordered table-hover">
  ...
</table>
```

## Kontekstli qatorlar

Qator (`<tr>`) yoki katakka (`<td>`) rang berish:

| Klass      | Ma’nosi                 |
| ---------- | ----------------------- |
| `.active`  | Tanlangan (kulrang)     |
| `.success` | Muvaffaqiyatli (yashil) |
| `.info`    | Ma’lumot (moviy)        |
| `.warning` | Diqqat (sariq)          |
| `.danger`  | Xavfli/salbiy (qizil)   |

```html
<tr class="success"><td>Aziza</td><td>O‘tdi</td></tr>
<tr class="danger"><td>Sardor</td><td>O‘tmadi</td></tr>
```

Bu yerda ham rang ma’noni takrorlaydi — “O‘tdi/O‘tmadi” so‘zi jadvalda bor.

## Moslashuvchan jadval

Ustunlar ko‘p bo‘lsa, telefonda jadval ekrandan chiqib ketadi. Uni `.table-responsive` ichiga olsangiz, 768px dan tor ekranlarda **faqat jadval** gorizontal aylanadi, sahifa emas:

```html
<div class="table-responsive">
  <table class="table">
    ...
  </table>
</div>
```

## Yaxshi jadval uchun maslahatlar

- Sarlavha kataklari — `<th>`, oddiy kataklar — `<td>`.
- Jadval nimani ko‘rsatishini `<caption>` bilan yozing.
- Faqat ma’lumot uchun jadval ishlating; sahifa maketi uchun setka bor.

## Xulosa

- `.table` — asosiy uslub; `.table-striped`, `.table-bordered`, `.table-hover`, `.table-condensed` — qo‘shimchalar.
- Qatorlar rangi: `.active`, `.success`, `.info`, `.warning`, `.danger`.
- Keng jadvalni `.table-responsive` ichiga oling.
