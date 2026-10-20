## Matnning ritmi

Bir xil shrift va o‘lchamdagi matn qator balandligi va harflar oralig‘iga qarab yengil yoki og‘ir o‘qiladi.

## Qator balandligi (`line-height`)

| Matn turi         | Tavsiya                    |
| ----------------- | -------------------------- |
| Oddiy matn        | 1.5–1.7                    |
| Kichik sarlavha   | 1.25–1.35                  |
| Katta sarlavha    | 1.05–1.2                   |
| Bir qatorli tugma | 1.2 yoki aniq `min-height` |

Qoida: shrift qancha katta bo‘lsa, `line-height` shuncha kichik. Katta sarlavhada 1.6 qatorlarni bir-biridan uzoqlashtirib, bitta fikrni ikki alohida qatorga o‘xshatib qo‘yadi.

Doim **birliksiz** qiymat yozing (`1.6`, `1.6em` emas): u har bir element o‘z shriftiga ko‘paytiriladi.

## Harf oralig‘i (`letter-spacing`)

- Katta sarlavhalar biroz zichlashtiriladi: `letter-spacing: -0.01em` — `-0.02em`.
- Oddiy matnga tegilmaydi — shrift dizayneri allaqachon to‘g‘ri sozlagan.
- **Bosh harfli** kichik yorliqlar siyraklashtiriladi: `0.05em` — `0.1em`. Bosh harflar bir-biriga yopishib, o‘qilishi qiyinlashadi.

`em` da yozish shrift o‘lchami o‘zgarganda nisbatni saqlaydi: 12px yorliqda `0.06em` = 0.72px.

## Bosh harflar

```css
.yorliq {
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-size: 0.75rem;
  font-weight: 700;
}
```

Matnni HTML’da bosh harf bilan yozmang (`YANGILIK`) — ekran o‘quvchi uni harfma-harf o‘qishi mumkin, nusxa olganda ham bosh harf qoladi. Ko‘rinishni CSS’da `text-transform` bilan bering.

Uzun matnni bosh harflarda yozmang: so‘zlarning shakli yo‘qoladi va o‘qish sekinlashadi. Bosh harf — faqat qisqa yorliq va tugmalar uchun.

## Paragraflar orasidagi masofa

Paragraflar orasidagi `margin` odatda qator balandligiga yaqin (~1em). Sarlavhadan oldingi bo‘shliq undan keyingisidan kattaroq bo‘lsin — shunda sarlavha o‘zidan keyingi matnga “tegishli” ko‘rinadi (yaqinlik qoidasi, 3-modulda).

Mashqda matn, sarlavha va yorliqqa to‘g‘ri ritm berasiz.
