## Foydalanuvchiga xabar berish

Amal muvaffaqiyatli bo‘ldimi? Xato bormi? Bildirishnoma (_alert_) foydalanuvchiga holatni aytadi. U uch narsani birga ishlatadi: **rang**, **shakl** (chiziq, ikonka) va **matn**.

## Variantlar

```css
.xabar {
  padding: 12px 16px;
  border-left: 4px solid;
  border-radius: 8px;
}

.xabar--muvaffaqiyat {
  background-color: #f0fdf4;
  border-color: #15803d;
  color: #14532d;
}

.xabar--xato {
  background-color: #fef2f2;
  border-color: #b91c1c;
  color: #7f1d1d;
}
```

Och fon + to‘q matn + yorqin chiziq — kontrast yetarli va rang “qichqirmaydi”. `border-left: 4px solid` da rang berilmasa, chegara matn rangini oladi; keyin `border-color` bilan almashtiramiz.

## Ekran o‘quvchiga e’lon qilish

Sahifaga dinamik qo‘shilgan xabarni ekran o‘quvchi o‘zi sezmaydi. Rollar yordam beradi:

| Rol             | Qachon                   | Xatti-harakat                  |
| --------------- | ------------------------ | ------------------------------ |
| `role="status"` | Oddiy xabar (“Saqlandi”) | Joriy o‘qishdan keyin aytiladi |
| `role="alert"`  | Muhim xato               | Darhol, gapni bo‘lib aytiladi  |

`role="alert"` ni har narsaga qo‘ymang — foydalanuvchini tinmay bo‘lib turadi.

## Toast

Ekranning chetida bir necha soniya ko‘rinib yo‘qoladigan xabar — _toast_. Ehtiyot bo‘ling: tez yo‘qolsa, sekin o‘qiydiganlar ulgurmaydi. Muhim xatolar toast’da emas, tegishli joyida (masalan, maydon ostida) ko‘rsatilsin.

## Belgi (badge)

```css
.belgi {
  display: inline-block;
  min-width: 1.5em;
  padding: 0 6px;
  border-radius: 999px;
  background-color: #0071dc;
  color: white;
  text-align: center;
}
```

`border-radius: 999px` — har qanday o‘lchamda “tabletka” shakli. `min-width` bilan bir xonali son ham doira bo‘ladi.

Belgi ekran o‘quvchiga kontekstsiz “3” deb o‘qiladi. Yaxshisi: `<span class="belgi" aria-label="3 ta yangi xabar">3</span>` yoki matnni yonida yozish.

Mashqda muvaffaqiyat va xato xabarlarini hamda hisoblagich belgisini yasaysiz.
