## Forma sozlamalarini maydonning o‘zida berish

Ba’zan bitta formadagi turli tugmalar har xil ish qilishi kerak: biri “Saqlash”, ikkinchisi “Qoralama sifatida saqlash”. Buning uchun `<input>` va `<button>` da formaning sozlamalarini **qayta belgilovchi** atributlar bor.

## `form` — formadan tashqaridagi maydon

Maydon `<form>` tegidan tashqarida bo‘lsa ham, unga tegishli bo‘lishi mumkin:

```html
<form id="buyurtma" action="/buyurtma">
  <label for="mahsulot">Mahsulot</label>
  <input id="mahsulot" name="mahsulot">
</form>

<label for="izoh">Izoh</label>
<input id="izoh" name="izoh" form="buyurtma">
```

`izoh` maydoni ham `buyurtma` formasi bilan birga yuboriladi.

## `formaction` — boshqa manzilga yuborish

```html
<form action="/saqlash" method="post">
  <input name="sarlavha">
  <button type="submit">Saqlash</button>
  <button type="submit" formaction="/qoralama">Qoralama sifatida saqlash</button>
</form>
```

## `formmethod`

Tugma bosilganda boshqa usul ishlatiladi:

```html
<button type="submit" formmethod="get">Ko‘rib chiqish</button>
```

## `formtarget`

Natijani boshqa oynada ochish:

```html
<button type="submit" formtarget="_blank">Oldindan ko‘rish (yangi tabda)</button>
```

## `formnovalidate`

Shu tugma bosilganda brauzer tekshiruvi o‘tkazib yuboriladi — qoralamani to‘liq bo‘lmasa ham saqlash uchun qulay:

```html
<form action="/maqola" method="post">
  <input name="sarlavha" required>
  <button type="submit">E’lon qilish</button>
  <button type="submit" formaction="/qoralama" formnovalidate>Qoralama</button>
</form>
```

## `formenctype`

Fayl bilan yuboradigan tugma uchun kodlash turini belgilaydi:

```html
<button type="submit" formenctype="multipart/form-data">Fayl bilan yuborish</button>
```

## Qisqacha jadval

| Maydon atributi  | `<form>` dagi muqobili            |
| ---------------- | --------------------------------- |
| `form`           | (maydon formaga tegishli bo‘ladi) |
| `formaction`     | `action`                          |
| `formmethod`     | `method`                          |
| `formtarget`     | `target`                          |
| `formnovalidate` | `novalidate`                      |
| `formenctype`    | `enctype`                         |

## Xulosa

- `form="id"` — maydonni tashqaridan formaga bog‘laydi.
- `formaction`, `formmethod`, `formtarget`, `formnovalidate`, `formenctype` — faqat shu tugma uchun forma sozlamalarini almashtiradi.
- Bitta formada turli harakatli tugmalar yaratish uchun qulay.
