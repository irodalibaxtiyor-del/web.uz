## Tekislash to‘ri

Auto Layout panelida 3 × 3 nuqtali kichik to‘r bor — bu tekislash. Yonida “Packed” yoki “Space between” tanlovi. Ularni CSS’ga o‘girish yo‘nalishga bog‘liq.

## Gorizontal (row) uchun

| Figma                             | CSS                                               |
| --------------------------------- | ------------------------------------------------- |
| Chap / markaz / o‘ng (gorizontal) | `justify-content: flex-start / center / flex-end` |
| Tepa / markaz / past (vertikal)   | `align-items: flex-start / center / flex-end`     |
| Space between                     | `justify-content: space-between`                  |

## Vertikal (column) uchun

O‘qlar almashadi:

| Figma                | CSS               |
| -------------------- | ----------------- |
| Tepa / markaz / past | `justify-content` |
| Chap / markaz / o‘ng | `align-items`     |

Bu eng ko‘p chalkashtiriladigan joy: `justify-content` — **asosiy o‘q** (yo‘nalish bo‘ylab), `align-items` — **ko‘ndalang o‘q**.

## Misol

```
Card/Tasks (Vertical ↓, Gap 12)
├── Header (Horizontal →, Space between, Align: center)
│   ├── Title "Topshiriqlar"
│   └── Link "Hammasi"
└── List (Vertical ↓, Gap 8)
```

```css
.karta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.karta-bosh {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.royxat {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
```

## “Stretch”

Vertikal Auto Layout’da bola element “Fill container” (kenglik bo‘yicha) bo‘lsa, u butun kenglikni egallaydi — CSS’da `align-items: stretch` (standart) yoki `align-self: stretch`. Agar maketdagi element “Hug” bo‘lsa, unga `align-self: flex-start` kerak bo‘lishi mumkin — aks holda u cho‘zilib ketadi.

## Matn bazaviy chizig‘i

Turli o‘lchamdagi matnlar (katta sarlavha va kichik havola) bir qatorda turganda Figma’da “Align baseline” bo‘lishi mumkin. CSS’da: `align-items: baseline` — harflarning pastki chizig‘i bir chiziqda.

## Space between va bitta element

“Space between” da bitta element bo‘lsa, u chap chetda qoladi. Ba’zan dizayner shu tarzda “o‘ngga tekislash” ni nazarda tutadi — natijani tekshiring.

Mashqda vazifalar kartasidagi tekislashlarni Figma’dan CSS’ga o‘girasiz.
