## CSS karusel

Mijoz fikrlari, sertifikatlar yoki skrinshotlarni gorizontal lentada ko‘rsatish mumkin. Ko‘p karusel kutubxonalari og‘ir va accessibility muammolariga ega. Zamonaviy CSS’da oddiy karusel umuman JavaScript’siz quriladi.

## Scroll snap

```css
.lenta {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 8px; /* aylantirish chizig‘iga joy */
}

.slayd {
  flex: 0 0 80%;
  scroll-snap-align: start;
}

@media (min-width: 768px) {
  .slayd {
    flex-basis: 45%;
  }
}
```

- `overflow-x: auto` — lenta o‘zi aylanadi, sahifa emas;
- `scroll-snap-type: x mandatory` — aylantirish to‘xtaganda brauzer eng yaqin “yopishish nuqtasi” ga suradi;
- `scroll-snap-align: start` — har bir slaydning boshi yopishish nuqtasi;
- `flex: 0 0 80%` — slayd kengligi lentaning 80% i: keyingi slayd chetidan ko‘rinib turadi va foydalanuvchi “surish mumkin” ekanini tushunadi.

## Nega avtomatik aylanmaydi?

Avtomatik aylanadigan karusellar foydalanuvchini bezovta qiladi: o‘qib ulgurmaydi, ekran o‘quvchi uchun kontent o‘z-o‘zidan o‘zgaradi. Agar avtomatik aylanish kerak bo‘lsa — to‘xtatish tugmasi majburiy va `prefers-reduced-motion` da o‘chiq bo‘lsin.

## Klaviatura

Lentaga `tabindex="0"`, `role="region"` va `aria-label="Mijozlar fikri"` bering — klaviatura foydalanuvchisi unga fokus berib, strelkalar bilan aylantira oladi.

## Tugmalar (ixtiyoriy)

“Oldingi / keyingi” tugmalari kompyuterda qulay:

```js
keyingi.addEventListener('click', () => {
  lenta.scrollBy({ left: lenta.clientWidth * 0.8, behavior: 'smooth' });
});
```

Scroll snap baribir slaydni to‘g‘ri joyga yopishtiradi.

## Fikrlar uchun semantika

Har bir slayd — `<figure>`, ichida `<blockquote>` (fikr) va `<figcaption>` (muallif). Keyingi modulda batafsil.

Mashqda fikrlar lentasini scroll-snap bilan yasaysiz.
