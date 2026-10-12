## Kombinatorlar

Kombinator ikki selektor orasidagi **munosabatni** bildiradi: “ichidagi”, “bevosita bolasi”, “keyingi qo‘shnisi”.

| Kombinator | Yozuvi    | Nimani tanlaydi                                 |
| ---------- | --------- | ----------------------------------------------- |
| Avlod      | `A B`     | `A` ichidagi istalgan chuqurlikdagi `B`         |
| Bola       | `A > B`   | Faqat `A` ning **bevosita** bolasi bo‘lgan `B`  |
| Qo‘shni    | `A + B`   | `A` dan **darhol keyin** kelgan `B`             |
| Umumiy qo‘shni | `A ~ B` | `A` dan keyin kelgan **barcha** `B` qo‘shnilar |

## Avlod: bo‘sh joy

```css
.maqola a {
  color: #0071dc;
}
```

`.maqola` ichidagi hamma havolalar, qanchalik chuqur joylashganidan qat’i nazar.

## Bola: `>`

```html
<ul class="menyu">
  <li>Kurslar
    <ul>
      <li>HTML</li>
    </ul>
  </li>
</ul>
```

```css
.menyu > li {
  font-weight: 700; /* faqat yuqori darajadagi bandlar */
}
```

Bo‘sh joy bilan (`.menyu li`) ichki ro‘yxat bandlari ham qalin bo‘lib qolardi.

## Qo‘shni: `+`

```css
h2 + p {
  font-size: 1.125rem; /* sarlavhadan keyingi birinchi paragraf */
}

li + li {
  margin-top: 8px; /* birinchisidan tashqari hamma bandlar */
}
```

`li + li` juda foydali naqsh: “har bir band oldingisidan 8px pastda” — birinchi band tepasida ortiqcha bo‘shliq qolmaydi.

## Umumiy qo‘shni: `~`

```css
h2 ~ p {
  color: #555555; /* h2 dan keyingi barcha p qo‘shnilar */
}
```

Qo‘shnilar faqat **keyin** keladiganlarni tanlaydi. CSS’da “oldingi qo‘shni” kombinatori yo‘q (lekin `:has()` bilan bunga erishish mumkin — keyingi darsda).

## Murakkab selektorlardan qoching

```css
body div.konteyner > ul li a span { … }
```

Bunday selektor HTML tuzilmasi sal o‘zgarsa buziladi va juda “kuchli” bo‘lib qoladi (maxsuslik darsida ko‘ramiz). Ko‘p hollarda bitta klass yetarli: `.menyu-havola`.

## Xulosa

- `A B` — ichidagi, `A > B` — bevosita bola.
- `A + B` — darhol keyingi qo‘shni, `A ~ B` — keyingi barcha qo‘shnilar.
- `li + li` — elementlar orasiga masofa berishning qulay usuli.
- Selektorlarni qisqa saqlang.
