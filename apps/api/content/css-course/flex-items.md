## Flex element xususiyatlari

Bu xususiyatlar **elementlarning o‘ziga** yoziladi va har birini alohida boshqaradi.

## `flex-grow` — o‘sish

Konteynerda bo‘sh joy qolsa, uni kim va qancha oladi:

```css
.qidiruv {
  flex-grow: 1; /* bo‘sh joyning hammasini oladi */
}
```

Bir nechta elementda `flex-grow` bo‘lsa, bo‘sh joy **nisbatda** bo‘linadi: `1` va `2` — biri bir ulush, ikkinchisi ikki ulush.

## `flex-shrink` — siqilish

Joy yetmasa, kim qancha siqiladi. Standart `1` — hamma teng siqiladi. `0` — element siqilmaydi:

```css
.logo {
  flex-shrink: 0; /* logotip hech qachon torayib ketmaydi */
}
```

## `flex-basis` — boshlang‘ich o‘lcham

O‘sish yoki siqilishdan **oldingi** o‘lcham:

```css
.karta {
  flex-basis: 240px;
}
```

`auto` (standart) — elementning `width` qiymati yoki kontent o‘lchami.

## `flex` qisqa yozuvi

```css
flex: 1;          /* flex: 1 1 0%   — teng ulushlar */
flex: auto;       /* flex: 1 1 auto — kontentga qarab, keyin o‘sadi */
flex: none;       /* flex: 0 0 auto — qat’iy */
flex: 0 0 200px;  /* aynan 200px, o‘smaydi, siqilmaydi */
```

Amalda deyarli doim qisqa yozuv ishlatiladi.

### Teng ustunlar

```css
.ustunlar > * {
  flex: 1;
}
```

Har biri kontentidan qat’i nazar **teng** kenglikda bo‘ladi (`flex-basis: 0%` tufayli).

## `align-self`

Bitta elementning kesuvchi o‘qdagi joyini o‘zgartiradi — `align-items` ni faqat o‘zi uchun bekor qiladi:

```css
.pastda {
  align-self: flex-end;
}
```

## `order`

Elementlarning ko‘rinishdagi tartibini o‘zgartiradi (standart `0`, kichigi oldin):

```css
.muhim {
  order: -1; /* birinchi bo‘lib ko‘rinadi */
}
```

> `order` faqat vizual. Klaviatura va ekran o‘quvchi HTML tartibiga ergashadi. Ma’noli tartibni HTML’da to‘g‘rilang.

## `margin: auto` sehri

Flex elementdagi `auto` margin qolgan bo‘sh joyning hammasini egallaydi:

```css
.kirish {
  margin-left: auto; /* o‘ng chetga suriladi */
}
```

## Xulosa

- `flex-grow` — o‘sish, `flex-shrink` — siqilish, `flex-basis` — boshlang‘ich o‘lcham.
- `flex: 1` — teng ulushlar, `flex: none` / `flex-shrink: 0` — qat’iy o‘lcham.
- `align-self` — bitta elementni tekislash, `order` — faqat vizual tartib.
