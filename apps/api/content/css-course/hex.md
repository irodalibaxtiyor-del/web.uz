## HEX rang nima?

**HEX** (o‘n oltilik) rang — RGB’ning qisqaroq yozuvi. U `#` belgisidan keyin oltita belgidan iborat:

```css
h1 {
  color: #0071dc;
}
```

Belgilar juftlab o‘qiladi: `#RRGGBB`.

| Juftlik | Misolda | Ma’nosi       |
| ------- | ------- | ------------- |
| `RR`    | `00`    | Qizil: 0      |
| `GG`    | `71`    | Yashil: 113   |
| `BB`    | `dc`    | Ko‘k: 220     |

Demak, `#0071dc` aynan `rgb(0, 113, 220)` ning o‘zi.

## O‘n oltilik sanoq tizimi

Har bir belgi 0–9 raqamlari yoki `a`–`f` harflaridan biri bo‘ladi (`a` = 10, `f` = 15). Juftlik qiymati `00` dan `ff` gacha, ya’ni 0 dan 255 gacha.

| HEX       | Rang     |
| --------- | -------- |
| `#000000` | Qora     |
| `#ffffff` | Oq       |
| `#ff0000` | Qizil    |
| `#00ff00` | Yashil   |
| `#0000ff` | Ko‘k     |
| `#808080` | Kulrang  |

Harflarni katta yoki kichik yozish farq qilmaydi: `#0071DC` = `#0071dc`.

## Uch belgili qisqa yozuv

Agar har bir juftlik ikki bir xil belgidan iborat bo‘lsa, ularni bittadan yozish mumkin:

```css
p { color: #333; }   /* = #333333 */
.fon { background-color: #fc0; } /* = #ffcc00 */
```

`#0071dc` ni qisqartirib bo‘lmaydi — juftliklar bir xil emas.

## Shaffoflik bilan HEX

Sakkiz belgili yozuvda oxirgi juftlik — alfa (`00` — shaffof, `ff` — to‘liq):

```css
.qoplama {
  background-color: #00000080; /* yarim shaffof qora */
}
```

## HEX rangni qayerdan olish mumkin?

- Figma kabi dizayn dasturlari ranglarni HEX’da beradi;
- brauzer DevTools’idagi rang tanlagich;
- logotip yoki brend qo‘llanmasi.

> **Maslahat:** Saytdagi asosiy ranglarni bir joyga yozib qo‘ying (masalan, fayl boshidagi izohda yoki keyinroq o‘rganadigan CSS o‘zgaruvchilarida). Shunda bir xil ko‘kning o‘nta har xil varianti paydo bo‘lmaydi.

## Xulosa

- `#RRGGBB` — qizil, yashil, ko‘k ulushlari o‘n oltilik sanoqda.
- `#333` kabi qisqa yozuv har juftlik bir xil bo‘lganda ishlaydi.
- Sakkiz belgili HEX’da oxirgi juftlik shaffoflikni bildiradi.
