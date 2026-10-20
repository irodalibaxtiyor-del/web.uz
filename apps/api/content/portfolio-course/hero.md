## Bosh ekran — 5 soniya

Tashrif buyuruvchi saytni ochgandan keyin bir necha soniyada qaror qiladi: qolishmi yoki yopishmi. Bosh ekran uchta savolga javob berishi kerak:

1. **Kim?** — ism.
2. **Nima qiladi?** — bir jumla: “Frontend dasturchi: tez, qulay va chiroyli sahifalar yasayman.”
3. **Endi nima qilay?** — tugma: “Ishlarimni ko‘rish”.

Uzun tarjimai hol, ko‘nikmalar ro‘yxati va “Saytimga xush kelibsiz!” kabi bo‘sh gaplar bu yerga kerak emas.

## Maket

```css
.bosh {
  display: grid;
  align-content: center;
  min-height: calc(100dvh - 64px);
  padding: 48px 24px;
}
```

- `100dvh − 64px` — ekran balandligidan header balandligi ayriladi, bosh ekran birinchi ekranni aynan to‘ldiradi;
- `align-content: center` — kontent vertikal markazda;
- `dvh` — telefonda manzil paneli hisobga olinadi.

Juda baland monitorlarda bosh ekran bo‘m-bo‘sh bo‘lib qolmasligi uchun `min(calc(100dvh - 64px), 800px)` kabi chegara ham qo‘yish mumkin.

## Ism — eng katta matn

```css
h1 {
  font-size: clamp(2.25rem, 1.5rem + 3vw, 4rem);
  line-height: 1.05;
}
```

Telefonda 36px, katta ekranda 64px. Katta sarlavhaga kichik qator balandligi — ikki qatorga tushsa ham ixcham turadi.

## Tugmalar

Ikki tugma: asosiy (“Ishlarimni ko‘rish”) va ikkinchi darajali (“Bog‘lanish”). Tor ekranda ular bir qatorga sig‘masligi mumkin:

```css
.tugmalar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
```

## Fotosurat bo‘lsa

Rasmni matn yoniga qo‘yish (keng ekranda ikki ustun, telefonda rasm matn ostida yoki kichik avatar tepada). Bosh ekrandagi rasmga `loading="lazy"` yozmang — u darhol ko‘rinadi.

## Kichik detal: “salom” qatori

Ism ustidagi kichik rangli yozuv (“Salom, men”) ko‘zni ismga yo‘naltiradi va brend rangini birinchi ekranda ko‘rsatadi. Lekin uni `h1` ichiga qo‘shmang — sarlavha qisqa va aniq bo‘lsin.

Mashqda bosh ekranni ekran balandligida, suyuq sarlavha va o‘raladigan tugmalar bilan yasaysiz.
