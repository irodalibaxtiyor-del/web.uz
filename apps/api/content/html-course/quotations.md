## Iqtiboslar va manbalar

Boshqa joydan olingan matn, qisqartma yoki manzilni to‘g‘ri belgilash sahifani tushunarliroq qiladi.

## Uzun iqtibos: `<blockquote>`

Boshqa manbadan olingan katta matn bo‘lagi. `cite` atributida manba manzili ko‘rsatiladi. Brauzer odatda uni chetdan surib ko‘rsatadi:

```html
<blockquote cite="https://example.uz/kitob">Ilm olish — beshikdan to qabrgacha.</blockquote>
```

## Qisqa iqtibos: `<q>`

Gap ichidagi qisqa iqtibos. Brauzer tirnoqlarni o‘zi qo‘yadi:

```html
<p>Ustoz aytgan edi: <q>Har kuni bitta yangi teg o‘rgan.</q></p>
```

## Qisqartma: `<abbr>`

To‘liq nomi `title` atributida yoziladi va sichqoncha ustiga kelganda chiqadi:

```html
<p><abbr title="Birlashgan Millatlar Tashkiloti">BMT</abbr> 1945-yilda tashkil topgan.</p>
```

## Aloqa ma’lumoti: `<address>`

Sahifa yoki maqola muallifi bilan bog‘lanish ma’lumotlari:

```html
<address>
  Muallif: Dilnoza Rahimova<br>
  Email: <a href="mailto:dilnoza@example.uz">dilnoza@example.uz</a><br>
  Toshkent, O‘zbekiston
</address>
```

## Asar nomi: `<cite>`

Kitob, film, qo‘shiq yoki rasmning nomi:

```html
<p><cite>O‘tkan kunlar</cite> — Abdulla Qodiriy romani.</p>
```

## Yozuv yo‘nalishi: `<bdo>`

Matn yo‘nalishini majburan o‘zgartiradi (`dir="rtl"` — o‘ngdan chapga):

```html
<bdo dir="rtl">Bu matn teskari ko‘rinadi</bdo>
```

```tekshir
Qisqartmaning to‘liq nomi qaysi atribut bilan beriladi?
+ `<abbr title="...">`
- `<abbr alt="...">`
- `<abbr name="...">`
> `title` dagi to‘liq nom sichqoncha ustiga olib kelinganda ko‘rinadi.
```

```jonli
<p><abbr title="HyperText Markup Language">HTML</abbr> — veb tili.</p>
<p>U aytdi: <q>Bilim — kuch</q>.</p>
<blockquote>Uzun iqtibos alohida blok bo‘lib turadi.</blockquote>
```

## Xulosa

- `<blockquote>` — katta iqtibos, `<q>` — qisqa iqtibos.
- `<abbr title>` — qisqartma, `<address>` — aloqa ma’lumoti, `<cite>` — asar nomi.
- `<bdo dir>` — matn yo‘nalishini o‘zgartiradi.
