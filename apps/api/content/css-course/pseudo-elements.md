## Psevdoelementlar

Psevdoelement elementning **bir qismini** tanlaydi yoki unga **yangi qism** qo‘shadi. U ikki juft nuqta bilan yoziladi: `p::first-line`.

| Psevdoelement     | Nimani tanlaydi                               |
| ----------------- | --------------------------------------------- |
| `::before`        | Element kontentidan oldin qo‘shiladigan qism  |
| `::after`         | Element kontentidan keyin qo‘shiladigan qism  |
| `::first-letter`  | Birinchi harf                                 |
| `::first-line`    | Birinchi qator                                |
| `::marker`        | Ro‘yxat belgisi                               |
| `::placeholder`   | Maydondagi namuna matn                        |
| `::selection`     | Foydalanuvchi belgilagan matn                 |

## `::before` va `::after`

Bu ikkisi faqat `content` xususiyati bilan ishlaydi:

```css
.muhim::before {
  content: "⚠ ";
}

.tashqi::after {
  content: " ↗";
}
```

`content: ""` (bo‘sh) bilan bezak shakllar chiziladi:

```css
.sarlavha::after {
  content: "";
  display: block;
  width: 48px;
  height: 4px;
  margin-top: 8px;
  background-color: #fec400;
}
```

Sarlavha ostida qisqa sariq chiziq paydo bo‘ladi — HTML’ga hech narsa qo‘shmasdan.

> **Muhim:** `::before`/`::after` dagi matnni foydalanuvchi belgilab nusxa ololmaydi va uni ba’zi ekran o‘quvchilar o‘qimaydi. Muhim ma’lumotni HTML’da yozing, psevdoelementni faqat **bezak** uchun ishlating.

`::before`/`::after` `<img>` va `<input>` kabi “bo‘sh” elementlarda ishlamaydi.

## Birinchi harf va qator

```css
.maqola p:first-of-type::first-letter {
  float: left;
  font-size: 3em;
  line-height: 1;
  margin-right: 8px;
  color: #0071dc;
}

.maqola p::first-line {
  font-weight: 600;
}
```

Gazeta va kitoblardagi kabi katta bosh harf.

## Placeholder va belgilash

```css
input::placeholder {
  color: #888888;
}

::selection {
  background-color: #fec400;
  color: #0e1133;
}
```

> Placeholder rangini juda och qilmang — u ham o‘qilishi kerak. Lekin placeholder yorliq (`<label>`) o‘rnini bosmaydi.

## Bitta yoki ikkita ikki nuqta?

Eski CSS’da psevdoelementlar ham bitta ikki nuqta bilan yozilardi (`:before`). Brauzerlar buni hali ham qabul qiladi, lekin to‘g‘ri yozuv — `::before`. Ikki nuqta psevdoklassni, ikki juft nuqta psevdoelementni bildiradi.

## Xulosa

- `::before`/`::after` — `content` bilan bezak qo‘shadi.
- `::first-letter`, `::first-line` — matn qismlari.
- `::placeholder`, `::selection`, `::marker` — maxsus qismlar.
- Muhim matnni psevdoelementga yozmang.
