## Jadval qachon kerak?

Jadval — **satr va ustunlardagi ma’lumot** uchun: dars jadvali, narxlar ro‘yxati, statistika. Sahifa joylashuvini (maketini) jadval bilan qurmang — buning uchun CSS bor.

## Jadval tuzilishi

```html
<table>
  <tr>
    <th>Kun</th>
    <th>Fan</th>
    <th>Xona</th>
  </tr>
  <tr>
    <td>Dushanba</td>
    <td>HTML</td>
    <td>204</td>
  </tr>
  <tr>
    <td>Seshanba</td>
    <td>CSS</td>
    <td>301</td>
  </tr>
</table>
```

| Teg       | Ma’nosi                                                       |
| --------- | ------------------------------------------------------------- |
| `<table>` | Butun jadval                                                  |
| `<tr>`    | Satr (table row)                                              |
| `<th>`    | Sarlavha katakchasi (table header) — odatda qalin va markazda |
| `<td>`    | Oddiy katakcha (table data)                                   |

## Jadval qismlari

Katta jadvallarni mantiqiy qismlarga ajratish foydali:

```html
<table>
  <caption>
    2026-yil birinchi chorak savdosi
  </caption>
  <thead>
    <tr>
      <th>Oy</th>
      <th>Savdo (mln so‘m)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Yanvar</td>
      <td>120</td>
    </tr>
    <tr>
      <td>Fevral</td>
      <td>135</td>
    </tr>
    <tr>
      <td>Mart</td>
      <td>150</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th>Jami</th>
      <td>405</td>
    </tr>
  </tfoot>
</table>
```

- `<caption>` — jadval nomi (jadval ostida yoki ustida ko‘rinadi);
- `<thead>`, `<tbody>`, `<tfoot>` — sarlavha, asosiy qism va yakun.

## Katakchalarni birlashtirish

- `colspan` — katakcha bir nechta **ustunni** egallaydi;
- `rowspan` — bir nechta **satrni** egallaydi.

```html
<table>
  <tr>
    <th colspan="2">Talaba</th>
    <th rowspan="2">Ball</th>
  </tr>
  <tr>
    <th>Ism</th>
    <th>Familiya</th>
  </tr>
  <tr>
    <td>Aziza</td>
    <td>Karimova</td>
    <td>92</td>
  </tr>
</table>
```

## Ustun sarlavhasining yo‘nalishi

`<th scope="col">` — ustun sarlavhasi, `<th scope="row">` — satr sarlavhasi. Bu ekran o‘qiydigan dasturlarga jadvalni tushunishga yordam beradi.

## Jadvalni CSS bilan bezash

```css
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  border: 1px solid #d0d7de;
  padding: 8px 12px;
  text-align: left;
}
thead th {
  background-color: #f5faff;
}
tbody tr:nth-child(even) {
  background-color: #fafafa;
}
```

`border-collapse: collapse` qo‘sh chiziqlarni bitta chiziqqa aylantiradi.

## Xulosa

- Jadval: `<table>` → `<tr>` → `<th>`/`<td>`.
- `<caption>`, `<thead>`, `<tbody>`, `<tfoot>` jadvalni tushunarli qiladi.
- `colspan` va `rowspan` katakchalarni birlashtiradi; ko‘rinish — CSS bilan.
