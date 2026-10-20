## Ekran emas, joy muhim

Media so‘rov **butun ekran** kengligiga qaraydi. Lekin bitta karta sahifaning keng asosiy qismida ham, tor yon panelda ham ishlatilishi mumkin. Ekran 1280px bo‘lsa ham, yon panel 300px — kartaga 300px kerak bo‘lgan uslub.

**Konteyner so‘rovlari** shu muammoni hal qiladi: komponent o‘zini o‘rab turgan joy kengligiga qarab moslashadi.

## Ikki qadam

1. Ota elementni konteyner deb e’lon qilish:

```css
.joy {
  container-type: inline-size; /* kenglik bo‘yicha o‘lchanadi */
}
```

2. Ichidagi elementlar uchun shart yozish:

```css
@container (min-width: 500px) {
  .karta {
    display: flex;
    gap: 16px;
  }
}
```

Endi `.karta` qaysi `.joy` ichida turganiga qarab o‘zgaradi. Keng joyda rasm va matn yonma-yon, tor joyda ustma-ust.

## Konteynerga nom berish

Ichma-ich konteynerlar bo‘lsa, aniq qaysi biriga qarashni nom bilan ko‘rsatish mumkin:

```css
.yon-panel {
  container: yon / inline-size; /* nom / tur */
}

@container yon (min-width: 400px) { … }
```

Nom berilmagan so‘rov eng yaqin konteynerni oladi.

## Konteyner birliklari

| Birlik | Nimaga nisbatan |
| --- | --- |
| `cqi` | konteyner kengligining 1% (inline o‘lcham) |
| `cqb` | konteyner balandligining 1% |
| `cqmin`, `cqmax` | ikkalasidan kichigi / kattasi |

```css
.karta h2 {
  font-size: clamp(1rem, 4cqi, 1.5rem);
}
```

700px joyda `4cqi` = 28px (chegara 24px), 300px joyda 12px (chegara 16px). Sarlavha kartaning joyiga mos o‘lchamni oladi.

## Cheklovlar

- Konteyner o‘zini o‘zi so‘ray olmaydi: shart faqat uning **ichidagi** elementlarga ta’sir qiladi.
- `container-type: inline-size` elementning kengligini kontentga qarab hisoblashni o‘chiradi. Shuning uchun konteynerning kengligi ota elementdan kelishi kerak (blok element, grid katagi va hokazo).
- Barcha zamonaviy brauzerlar qo‘llab-quvvatlaydi.

## Qachon qaysi biri?

- Butun sahifa maketi (ustunlar soni, menyu turi) — **media so‘rov**.
- Qayta ishlatiladigan komponent (karta, forma bloki, vidjet) — **konteyner so‘rovi**.

Mashqda bir xil kartani keng va tor joyga qo‘yib, ikkalasini konteyner so‘rovi bilan moslashtirasiz.
