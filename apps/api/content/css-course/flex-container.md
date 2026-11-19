## Flex konteyner xususiyatlari

Bu xususiyatlar **konteynerga** yoziladi va barcha elementlarga ta’sir qiladi.

## `flex-direction`

| Qiymat           | Yo‘nalish                 |
| ---------------- | ------------------------- |
| `row`            | Chapdan o‘ngga (standart) |
| `row-reverse`    | O‘ngdan chapga            |
| `column`         | Yuqoridan pastga          |
| `column-reverse` | Pastdan yuqoriga          |

> `*-reverse` faqat ko‘rinishni o‘zgartiradi. Tab tugmasi va ekran o‘quvchi baribir HTML tartibiga ergashadi — bu chalkashlik keltirib chiqarishi mumkin.

## `flex-wrap`

```css
.teglar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
```

`wrap` — sig‘magan elementlar keyingi qatorga o‘tadi. Standart `nowrap` da ular siqiladi yoki chiqib ketadi.

Qisqa yozuv: `flex-flow: row wrap;`

## `justify-content` — asosiy o‘q

| Qiymat          | Natija                                                       |
| --------------- | ------------------------------------------------------------ |
| `flex-start`    | Boshida (standart)                                           |
| `flex-end`      | Oxirida                                                      |
| `center`        | O‘rtada                                                      |
| `space-between` | Birinchisi boshida, oxirgisi oxirida, qolgani teng oraliqda  |
| `space-around`  | Har elementning ikki tomonida teng joy                       |
| `space-evenly`  | Barcha oraliqlar (chetlar ham) teng                          |

```text
flex-start     [1][2][3]
center              [1][2][3]
space-between  [1]       [2]       [3]
space-evenly     [1]     [2]     [3]
```

## `align-items` — kesuvchi o‘q

| Qiymat       | Natija                                       |
| ------------ | -------------------------------------------- |
| `stretch`    | Konteyner balandligiga cho‘ziladi (standart) |
| `flex-start` | Yuqorida                                     |
| `flex-end`   | Pastda                                       |
| `center`     | O‘rtada                                      |
| `baseline`   | Matn chizig‘i bo‘yicha                       |

## `align-content` — qatorlar orasida

`flex-wrap: wrap` bilan bir nechta qator bo‘lsa, `align-content` **qatorlarning o‘zini** kesuvchi o‘q bo‘ylab taqsimlaydi (`justify-content` ga o‘xshash qiymatlar bilan). Bitta qatorda ta’siri yo‘q.

## `gap`

```css
.konteyner {
  gap: 16px;        /* hamma tomonga */
  gap: 24px 16px;   /* qatorlar orasida 24px, ustunlar orasida 16px */
}
```

`gap` faqat elementlar **orasida** joy beradi — chetlarda emas. Margin bilan qilinganidagi “oxirgi elementdagi ortiqcha margin” muammosi yo‘q.

## Klassik markazlash

```css
.markaz {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
```

```tekshir
`flex-direction: column` bo‘lsa, `justify-content` qaysi yo‘nalishni boshqaradi?
- gorizontalni
+ vertikalni
- hech qaysini
> Ustun yo‘nalishida asosiy o‘q vertikal bo‘ladi; `justify-content` doim asosiy o‘q bo‘ylab ishlaydi.
```

```jonli
<style>
  .k { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; background: #eef4fb; padding: 8px; }
  .k div { width: 90px; background: #0071dc; color: white; padding: 10px; }
</style>
<div class="k"><div>1</div><div>2</div><div>3</div><div>4</div><div>5</div></div>
<p>Oynani toraytiring — flex-wrap: wrap elementlarni keyingi qatorga o‘tkazadi.</p>
```

## Xulosa

- `flex-direction` — yo‘nalish, `flex-wrap` — qatorga o‘tish.
- `justify-content` — asosiy o‘q, `align-items` — kesuvchi o‘q.
- `gap` — elementlar orasidagi masofa.
