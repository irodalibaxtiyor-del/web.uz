## Karta — moslashuvchan dizaynning g‘ishti

Kurslar, mahsulotlar, maqolalar — ko‘p narsa kartalar to‘ri ko‘rinishida. Yaxshi karta ikki narsani talab qiladi: to‘r ekranga moslashishi va kartaning **ichki** tuzilishi chiroyli bo‘lishi.

## To‘r

```css
.kartalar {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 20px;
}
```

Media so‘rovsiz: 1000px da 3 ustun, telefonda 1 ustun.

## Muammo: har xil uzunlikdagi matn

Kartalardan birida tavsif uzunroq bo‘lsa, Grid baribir qatordagi kartalarni **bir xil balandlikda** cho‘zadi. Lekin karta ichidagi tugmalar matndan keyin darhol turgani uchun har xil balandlikda qoladi — ko‘zga tartibsiz ko‘rinadi.

## Yechim: kartaning ichi Flexbox

```css
.karta {
  display: flex;
  flex-direction: column;
}

.karta-tana {
  flex-grow: 1; /* qolgan joyni egallaydi */
}
```

Matn qismi bo‘sh joyni “yutadi”, tugma esa har doim kartaning pastida turadi. Xuddi shu natijani tugmaga `margin-top: auto` berib ham olish mumkin.

## Karta ichidagi rasm

```css
.karta img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

Barcha muqovalar bir xil nisbatda — to‘r tekis ko‘rinadi.

## Butun karta bosiladigan bo‘lsa

Agar karta bitta sahifaga olib borsa, butun kartani `<a>` ga o‘rash o‘rniga “cho‘zilgan havola” usuli yaxshiroq:

```css
.karta { position: relative; }

.karta h2 a::after {
  content: "";
  position: absolute;
  inset: 0;
}
```

Kartada bitta havola qoladi (ekran o‘quvchi butun karta matnini havola nomi qilib o‘qimaydi), lekin istalgan joyini bosish mumkin. Fokus ko‘rinishini ham unutmang: `.karta:focus-within { outline: 2px solid; }`.

## Karta joyiga qarab

Bir xil karta keng joyda gorizontal, tor joyda vertikal bo‘lishi kerak bo‘lsa — konteyner so‘rovlari (2-modul).

Mashqda kurslar kartalarini teng balandlikda va tugmalarni bir qatorda qilasiz.
