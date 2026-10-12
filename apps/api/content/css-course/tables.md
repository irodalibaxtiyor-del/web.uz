## Jadvallarni bezash

Standart HTML jadval juda oddiy ko‘rinadi: chegarasiz, katakchalar bir-biriga yaqin. Bir necha qator CSS uni o‘qishga qulay qiladi.

## Chegaralar va `border-collapse`

```css
th,
td {
  border: 1px solid #cccccc;
}
```

Natijada har bir katakning **o‘z** chegarasi bo‘ladi va qo‘shni kataklar orasida ikki qavat chiziq ko‘rinadi. Buni bitta chiziqqa aylantirish uchun:

```css
table {
  border-collapse: collapse;
}
```

| Qiymat     | Natija                                  |
| ---------- | --------------------------------------- |
| `separate` | Har katak alohida, orasida `border-spacing` |
| `collapse` | Qo‘shni chegaralar bitta chiziqqa qo‘shiladi |

## Kenglik

```css
table {
  width: 100%;
}
```

Jadval ota elementning butun kengligini egallaydi. Ustunlar kengligi kontentga qarab taqsimlanadi.

## Ichki bo‘shliq va tekislash

```css
th,
td {
  padding: 8px 12px;
  text-align: left;
}

td.raqam {
  text-align: right; /* raqamlar o‘ngga tekislanadi */
}
```

- `th` standart holda **markazda** va qalin bo‘ladi. Ko‘p jadvallarda sarlavhalarni ham chapga tekislash o‘qishni osonlashtiradi.
- Pul, ball kabi raqamlar o‘ngga tekislansa, xonalar bir ustunda turadi.

## Vertikal tekislash

```css
td {
  vertical-align: top;
}
```

Qiymatlar: `top`, `middle` (standart), `bottom`.

## Faqat gorizontal chiziqlar

Zamonaviy jadvallarda ko‘pincha faqat qatorlar orasida chiziq bo‘ladi:

```css
table {
  border-collapse: collapse;
}

th {
  border-bottom: 2px solid #0e1133;
}

td {
  border-bottom: 1px solid #dddddd;
}
```

## Jadval faqat ma’lumot uchun

Jadval bilan sahifa maketini (ustunlarni) qurish eskirgan usul. Maket uchun Flexbox va Grid bor — ular keyingi modullarda. Jadval — faqat jadval ko‘rinishidagi **ma’lumot** uchun.

## Xulosa

- `border-collapse: collapse` ikki qavat chegarani bitta qiladi.
- `padding` va `text-align` kataklarni o‘qishga qulay qiladi.
- Raqamlarni o‘ngga tekislang.
