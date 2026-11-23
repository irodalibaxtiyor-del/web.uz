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

```tekshir
Loyiha kartasini butunlay bosiladigan qilish uchun qaysi usul accessible?
+ sarlavhadagi havolaga `::after { content: ""; position: absolute; inset: 0 }`
- butun kartani `<a>` ichiga, ichida tugmalar bilan
- kartaga `onclick` va `div`
> Havola matni (loyiha nomi) ekran o‘quvchiga aniq bo‘lib qoladi.
```

```jonli
<style>
  .t { display: grid; gap: 12px; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  .k { position: relative; border: 1px solid #ddd; border-radius: 10px; overflow: hidden; }
  .k img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; display: block; }
  .k h3 { font-size: 1rem; margin: 8px; }
  .k a::after { content: ""; position: absolute; inset: 0; }
  .k:focus-within { outline: 3px solid #6c3483; }
</style>
<div class="t"><article class="k"><img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27320%27%20height=%27200%27%3E%3Crect%20width=%27320%27%20height=%27200%27%20fill=%27%230071dc%27/%3E%3Ccircle%20cx=%27224%27%20cy=%2770%27%20r=%2730%27%20fill=%27%23fff%27/%3E%3C/svg%3E" alt=""><h3><a href="#">Kafe sayti</a></h3></article><article class="k"><img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27320%27%20height=%27200%27%3E%3Crect%20width=%27320%27%20height=%27200%27%20fill=%27%232e8b57%27/%3E%3Ccircle%20cx=%27224%27%20cy=%2770%27%20r=%2730%27%20fill=%27%23fff%27/%3E%3C/svg%3E" alt=""><h3><a href="#">Do‘kon</a></h3></article></div>
```
