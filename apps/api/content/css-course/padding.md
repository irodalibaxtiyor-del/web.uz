## Ichki bo‘shliq: `padding`

`padding` — kontent bilan **chegara orasidagi** bo‘sh joy. Margindan farqli o‘laroq, padding elementning fonini oladi.

```css
.tugma {
  padding: 12px 24px;
  background-color: #0071dc;
  color: white;
}
```

Paddingsiz tugma matni chetlarga yopishib qoladi va bosish qiyin bo‘ladi.

## Tomonlar va qisqa yozuv

Xuddi margin kabi: `padding-top`, `padding-right`, `padding-bottom`, `padding-left` yoki qisqa yozuv.

| Yozuv                       | Ma’nosi                              |
| --------------------------- | ------------------------------------ |
| `padding: 16px;`            | Hamma tomon 16px                     |
| `padding: 8px 16px;`        | Yuqori-past 8px, yonlar 16px         |
| `padding: 8px 16px 24px;`   | Yuqori 8px, yonlar 16px, past 24px   |
| `padding: 1px 2px 3px 4px;` | Yuqori, o‘ng, past, chap             |

> **Farq:** padding **manfiy bo‘lolmaydi** va `auto` qiymatini qabul qilmaydi.

## Margin yoki padding?

| Savol                                  | Javob    |
| -------------------------------------- | -------- |
| Fon bo‘shliqni ham qoplashi kerakmi?    | `padding` |
| Elementni qo‘shnisidan uzoqlashtirishmi? | `margin` |
| Bosiladigan maydonni kattalashtirishmi? | `padding` |
| Blokni markazlashmi?                    | `margin: 0 auto` |

## Padding va kenglik

Standart holda padding elementning **kengligiga qo‘shiladi**:

```css
.quti {
  width: 300px;
  padding: 20px; /* ekranda 340px! */
}
```

Bu ko‘pincha noqulay. `box-sizing: border-box` bilan padding kenglik ichida hisoblanadi:

```css
.quti {
  box-sizing: border-box;
  width: 300px;
  padding: 20px; /* ekranda aynan 300px */
}
```

Ko‘p loyihalar buni butun sahifaga qo‘llaydi:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

## Foizli padding

Foizli padding **ota elementning kengligidan** hisoblanadi — hatto yuqori va pastki padding ham. Bu xususiyatdan ilgari doimiy nisbatli bloklar yasash uchun foydalanilgan.

## Xulosa

- `padding` — kontent va chegara orasidagi bo‘shliq, fonni oladi.
- Qisqa yozuv margin bilan bir xil; manfiy yoki `auto` bo‘lmaydi.
- `box-sizing: border-box` padding’ni kenglik ichida hisoblaydi.
