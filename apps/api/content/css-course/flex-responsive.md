## Moslashuvchan Flexbox

Flexbox’ning kuchi — media so‘rovlarsiz ham ekranga moslasha olishi.

## O‘z-o‘zidan qatorga o‘tuvchi kartochkalar

```css
.kartalar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.karta {
  flex: 1 1 240px;
}
```

Har bir kartochka:

- **240px** dan boshlanadi (`flex-basis`);
- bo‘sh joy bo‘lsa **o‘sadi** (`flex-grow: 1`);
- qatorga sig‘masa keyingi qatorga **o‘tadi** (`flex-wrap: wrap`).

Natijada katta ekranda 4 ta, planshetda 2 ta, telefonda 1 ta kartochka — bitta ham media so‘rovsiz.

> Oxirgi qatorda bitta kartochka qolsa, u butun qatorni egallaydi. Buni xohlamasangiz, Grid (`auto-fill`) yaxshiroq — keyingi modulda.

## Yonma-yon yoki ustma-ust

Rasm va matn katta ekranda yonma-yon, kichik ekranda ustma-ust:

```css
.blok {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.blok .rasm {
  flex: 1 1 280px;
}

.blok .matn {
  flex: 2 1 320px;
}
```

Joy yetarli bo‘lsa — yonma-yon (matn ikki baravar keng), yetmasa — matn rasm ostiga tushadi.

## Media so‘rov bilan yo‘nalishni almashtirish

Ba’zan aniq nazorat kerak:

```css
.menyu {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .menyu {
    flex-direction: row;
  }
}
```

Telefonda menyu bandlari ustma-ust, kattaroq ekranda — bir qatorda. Bu **mobil birinchi** yondashuv: asosiy uslub kichik ekran uchun, katta ekran uchun qo‘shimcha.

## Kartochka ichida tugma pastda

Bir qatordagi kartochkalar bir xil balandlikda (`stretch`), lekin matni har xil uzunlikda. Tugmalarni bir chiziqqa tushirish:

```css
.karta {
  display: flex;
  flex-direction: column;
}

.karta .tugma {
  margin-top: auto;
}
```

## Xulosa

- `flex-wrap: wrap` + `flex: 1 1 240px` — media so‘rovsiz moslashuvchan qator.
- Turli `flex-grow` — ustunlar nisbati.
- `flex-direction` ni media so‘rov bilan almashtirish — mobil birinchi.
- `margin-top: auto` — tugmani kartochka pastiga itarish.
