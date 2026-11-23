## Shaxsiy uslub

Portfolio — sizning “vizit kartangiz”. Uning uslubi ham siz haqingizda gapiradi: tartibli, o‘ylangan, izchil. Buning uchun ko‘p narsa kerak emas:

- bitta urg‘u rangi;
- bitta yoki ikkita shrift;
- bir xil burchaklar va oraliqlar.

## Tokenlar

“UI asoslari” kursidagi kabi qarorlarni tokenlarga yig‘amiz:

```css
:root {
  --fon: #fafaf9;
  --matn: #1c1917;
  --sirt: #ffffff;
  --chegara: #e7e5e4;
  --urg: #c2410c;
  --r-karta: 16px;
  --shrift: Georgia, serif;
}

body {
  background-color: var(--fon);
  color: var(--matn);
}

h2, h3 {
  font-family: var(--shrift);
}
```

Butun sayt shu bir necha qatorga tayanadi. Brend rangini o‘zgartirmoqchi bo‘lsangiz — bitta qator.

## Rang tanlash

Ko‘k rangli portfoliolar juda ko‘p. O‘zingizga mos, lekin ko‘zni charchatmaydigan urg‘u tanlang: terrakota (`#c2410c`), zumrad (`#047857`), siyoh ko‘k (`#1d4ed8`). Neytrallarni ham shu rang tonida biroz “iliq” yoki “sovuq” qilish mumkin: iliq rang uchun `#fafaf9` / `#1c1917` (stone), sovuq rang uchun `#f8fafc` / `#0f172a` (slate).

Kontrastni albatta tekshiring: urg‘u rangidagi tugmada oq matn 4.5:1 dan kam bo‘lmasin.

## Shrift juftligi

Sarlavhalar uchun xarakterli shrift (serif yoki geometrik), matn uchun neytral sans-serif. Platformada tashqi shriftlar bloklangani uchun tizim shriftlaridan foydalanamiz; o‘z saytingizda o‘z serveringizdagi shriftni ulashingiz mumkin.

## Fotosurat

Professional, yaxshi yoritilgan, oddiy fondagi fotosurat ishonch uyg‘otadi. U shart emas, lekin bo‘lsa — sifatli bo‘lsin. Avatarni `aspect-ratio: 1`, `object-fit: cover` bilan bezang.

## Kamroq — yaxshiroq

Har bir bo‘limga boshqa rang, har bir sarlavhaga boshqa shrift — havaskorlik belgisi. Cheklangan palitra va izchil oraliqlar portfolioni “qimmat” ko‘rsatadi.

Mashqda portfolio uslubini tokenlarga yig‘asiz.

```tekshir
Shaxsiy sayt uchun nechta shrift oilasi yetarli?
+ bir yoki ikkita (sarlavha va matn uchun)
- beshta va undan ko‘p
- har bo‘limga alohida
> Kamroq shrift — izchilroq va tezroq sayt.
```

```jonli
<style>
  :root { --rang: #6c3483; --fon: #faf7fc; --matn: #221b26; --shrift: Georgia, serif; }
  .p { background: var(--fon); color: var(--matn); padding: 16px; border-radius: 10px; }
  .p h2 { font-family: var(--shrift); color: var(--rang); margin: 0 0 6px; }
</style>
<div class="p"><h2>Aziza Karimova</h2><p>Bitta urg‘u rangi va ikki shrift — shaxsiy uslub.</p></div>
```
