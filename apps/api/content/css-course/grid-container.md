## Grid konteyner xususiyatlari

## Ustunlar va qatorlar

```css
.tor {
  display: grid;
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: 80px auto 60px;
}
```

- `grid-template-columns` — ustunlar o‘lchami;
- `grid-template-rows` — qatorlar o‘lchami. Ko‘pincha berilmaydi: qatorlar kontentga qarab avtomatik yaratiladi.

## `repeat()`

```css
grid-template-columns: repeat(4, 1fr);          /* 1fr 1fr 1fr 1fr */
grid-template-columns: repeat(3, 100px 1fr);    /* naqsh takrorlanadi */
```

## `minmax()`

Yo‘lning eng kichik va eng katta o‘lchami:

```css
grid-template-columns: repeat(3, minmax(200px, 1fr));
grid-auto-rows: minmax(120px, auto);
```

Ustun 200px dan torayolmaydi, lekin joy bo‘lsa teng o‘sadi. Qator kamida 120px, kontent ko‘p bo‘lsa — kattaroq.

## `auto-fill` va `auto-fit`

Media so‘rovsiz moslashuvchan to‘rning eng mashhur qatori:

```css
.kartalar {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}
```

Brauzer **nechta 220px lik ustun sig‘sa**, shuncha ustun yaratadi.

| Qiymat      | Elementlar kam bo‘lsa                                 |
| ----------- | ----------------------------------------------------- |
| `auto-fill` | Bo‘sh ustunlar saqlanadi — kartochkalar o‘z o‘lchamida |
| `auto-fit`  | Bo‘sh ustunlar yo‘qoladi — kartochkalar cho‘ziladi     |

## `gap`

```css
gap: 24px;          /* qator va ustunlar orasida */
row-gap: 24px;
column-gap: 16px;
```

## Tekislash

Grid’da tekislash ikki darajada:

| Xususiyat         | Nimani tekislaydi               | O‘q        |
| ----------------- | ------------------------------- | ---------- |
| `justify-items`   | Elementlarni o‘z kataklari ichida | Gorizontal |
| `align-items`     | Elementlarni o‘z kataklari ichida | Vertikal   |
| `place-items`     | Ikkalasi bir yo‘la              | —          |
| `justify-content` | Butun to‘rni konteyner ichida   | Gorizontal |
| `align-content`   | Butun to‘rni konteyner ichida   | Vertikal   |

```css
.markaz {
  display: grid;
  place-items: center; /* eng qisqa markazlash */
}
```

## Yashirin to‘r

Elementlar `grid-template-rows` da berilganidan ko‘p bo‘lsa, brauzer yangi qatorlarni o‘zi qo‘shadi. Ularning o‘lchami `grid-auto-rows` bilan beriladi:

```css
.tor {
  grid-auto-rows: 150px;
}
```

## Xulosa

- `grid-template-columns` + `repeat()` + `minmax()`.
- `repeat(auto-fill, minmax(220px, 1fr))` — moslashuvchan to‘r.
- `place-items: center` — katak ichida markazlash.
