## Matnni ajratib ko‘rsatish

HTML’da matn qismini alohida ma’noga ega qilib belgilaydigan teglar bor. Muhimi — ular faqat ko‘rinish emas, **ma’no** ham beradi.

## Qalin: `<strong>` va `<b>`

```html
<p><strong>Diqqat:</strong> imtihon soat 9:00 da boshlanadi.</p>
<p>Mahsulot nomi: <b>Choynak</b></p>
```

- `<strong>` — matn **muhim** ekanini bildiradi (ekran o‘qiydigan dasturlar urg‘u bilan o‘qiydi).
- `<b>` — shunchaki e’tiborni tortish uchun qalin, alohida ahamiyatsiz.

## Kursiv: `<em>` va `<i>`

```html
<p>Men bu kitobni <em>albatta</em> o‘qiyman.</p>
<p>Kema nomi <i>“Mustaqillik”</i> edi.</p>
```

- `<em>` — gapdagi **urg‘u**;
- `<i>` — atama, chet so‘z yoki nom kabi boshqacha ohangdagi matn.

## Boshqa teglar

| Teg       | Ma’nosi                    | Misol                   |
| --------- | -------------------------- | ----------------------- |
| `<mark>`  | Belgilangan (marker bilan) | `<mark>yangi</mark>`    |
| `<small>` | Kichik izoh, huquqiy matn  | `<small>© 2026</small>` |
| `<del>`   | O‘chirilgan matn           | `<del>100 000</del>`    |
| `<ins>`   | Qo‘shilgan matn            | `<ins>80 000</ins>`     |
| `<sub>`   | Pastki indeks              | `H<sub>2</sub>O`        |
| `<sup>`   | Yuqori indeks              | `x<sup>2</sup>`         |

## Misol: chegirma narxi

```html
<p>
  Narxi: <del>120 000 so‘m</del> <ins>90 000 so‘m</ins>
  <mark>25% chegirma</mark>
</p>
<p>Suv formulasi: H<sub>2</sub>O, kvadrat: a<sup>2</sup></p>
<p><small>Aksiya 31-dekabrgacha amal qiladi.</small></p>
```

## Xulosa

- `<strong>` — muhimlik, `<em>` — urg‘u; ular ma’no beradi.
- `<b>` va `<i>` — faqat uslubiy ajratish.
- `<mark>`, `<small>`, `<del>`, `<ins>`, `<sub>`, `<sup>` — maxsus holatlar uchun.
