## “Ishlarim” — portfolio yuragi

Tashrif buyuruvchilar aynan shu bo‘lim uchun kelishadi. Har bir loyiha kartasida:

- **muqova** — natijaning eng yaxshi skrinshoti;
- **nom** — qisqa va aniq;
- **bir jumla** — nima va kim uchun;
- **texnologiyalar** — teglar bilan (ixtiyoriy);
- **havolalar** — batafsil sahifa, jonli versiya, kod.

## To‘r

```css
.tor {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 24px;
}
```

Media so‘rovsiz: keng ekranda 3 ustun, planshetda 2, telefonda 1.

## Bir xil muqovalar

```css
.loyiha img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}
```

Skrinshotlar har xil o‘lchamda bo‘lsa ham, kartalar bir xil ko‘rinadi. Eng yaxshisi — skrinshotlarni oldindan bir xil nisbatda tayyorlash: muhim qism qirqilib ketmaydi.

## Butun karta bosiladi

```css
.loyiha {
  position: relative;
}

.loyiha h3 a::after {
  content: '';
  position: absolute;
  inset: 0;
}
```

Kartada **bitta** havola (sarlavhada), lekin uning `::after` psevdoelementi butun kartani qoplaydi. Afzalliklari:

- ekran o‘quvchi havolani qisqa nom bilan o‘qiydi (butun karta matni bilan emas);
- Tab bilan kartalar orasida bittadan qadam;
- kartaning istalgan joyi bosiladi.

Kartada yana boshqa havola (masalan, “GitHub”) bo‘lsa, unga `position: relative; z-index: 1` bering — u qoplama ustida qolsin.

## Fokus

Karta butunlay bosilsa, fokus ham butun kartada ko‘rinsin:

```css
.loyiha:focus-within {
  outline: 2px solid var(--urg);
  outline-offset: 2px;
}
```

## Skrinshot sifati

- Brauzer oynasini 1280 × 800 qilib skrinshot oling, keyin WebP’ga o‘giring.
- Telefondagi ko‘rinishini ham ko‘rsatish — moslashuvchan dizaynni bilishingizning isboti.
- `width`/`height` atributlari va `loading="lazy"` (birinchi ekrandan pastdagi rasmlar uchun).

Mashqda loyihalar galereyasini moslashuvchan to‘r va bosiladigan kartalar bilan yasaysiz.
