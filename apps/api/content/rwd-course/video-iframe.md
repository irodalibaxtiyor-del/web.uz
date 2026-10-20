## Video nisbati

YouTube va boshqa xizmatlar videosi `<iframe>` orqali joylanadi. Uning `width="560" height="315"` atributlari telefonda ekrandan chiqib ketadi, faqat `width: 100%` yozilsa, balandlik o‘zgarmay qolib, video cho‘zilgandek ko‘rinadi.

## Zamonaviy yechim

```css
.video iframe {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  border: 0;
}
```

Kenglik konteynerga teng, balandlik 16:9 nisbatda hisoblanadi: 640px kenglikda 360px.

## Eski usul (tanib olish uchun)

`aspect-ratio` paydo bo‘lgunga qadar “padding hiylasi” ishlatilardi:

```css
.video {
  position: relative;
  padding-top: 56.25%; /* 9 / 16 */
}

.video iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
```

`padding` foizi ota element **kengligidan** hisoblanishidan foydalanilgan. Eski kodda ko‘rsangiz, `aspect-ratio` bilan almashtirish mumkin.

## `<video>` elementi

O‘z serveringizdagi video uchun:

```html
<video controls preload="none" poster="muqova.jpg" width="640" height="360" playsinline>
  <source src="dars.webm" type="video/webm">
  <source src="dars.mp4" type="video/mp4">
  <track kind="captions" src="dars.uz.vtt" srclang="uz" label="O‘zbekcha">
</video>
```

```css
video {
  display: block;
  max-width: 100%;
  height: auto;
}
```

- `controls` — boshqaruv tugmalari;
- `preload="none"` — foydalanuvchi bosmaguncha video yuklanmaydi (mobil trafikni tejaydi);
- `poster` — ijro boshlanguncha ko‘rinadigan rasm;
- `playsinline` — iPhone’da to‘liq ekranga avtomatik o‘tmaydi;
- `<track>` — subtitrlar. Ovozsiz tomosha qiluvchilar va eshitishda qiyinchiligi bor foydalanuvchilar uchun muhim.

## Avtomatik ijro

`autoplay` faqat `muted` bilan ishlaydi va foydalanuvchini bezovta qiladi. Fon videolari uchun `prefers-reduced-motion` ni hisobga olib, harakatni kamaytirishni so‘raganlarga to‘xtatilgan holda ko‘rsating.

## Iframe va xavfsizlik

Begona sayt iframe’iga faqat kerakli ruxsatlarni bering (`allow="fullscreen"`) va `title` atributini yozing — ekran o‘quvchi iframe’ni shu nom bilan e’lon qiladi.

Mashqda joylashtirilgan va o‘z videongizni moslashuvchan qilasiz.
