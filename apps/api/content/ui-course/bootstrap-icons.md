## Tayyor ikonka to‘plamlari

Har bir ikonkani o‘zingiz chizish shart emas. Mashhur to‘plamlarning ikki xil ulanish usuli bor:

1. **SVG fayllar** yoki komponentlar (Tabler, Lucide, Heroicons) — har bir ikonka alohida.
2. **Ikonka shrifti** (Bootstrap Icons, Font Awesome) — barcha ikonkalar bitta shrift faylida, klass bilan chaqiriladi.

## Bootstrap Icons’ni ulash

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"
/>
```

```html
<a class="tugma" href="/"><i class="bi bi-house" aria-hidden="true"></i> Bosh sahifa</a>
```

`bi` — umumiy klass, `bi-house` — aniq ikonka. Ikonka nomlarini to‘plam saytidagi qidiruvdan topasiz: `bi-search`, `bi-person`, `bi-cart`, `bi-x-lg`.

Platformada tashqi havolalar bloklangan, lekin Bootstrap Icons kabi tanilgan kutubxonalarning CDN havolasini yozsangiz, fayl platformaning o‘zidan beriladi.

## Qanday ishlaydi

CSS fayl har bir klassga `::before` psevdoelementi orqali shriftdagi belgini qo‘yadi:

```css
.bi::before {
  font-family: bootstrap-icons;
}

.bi-house::before {
  content: '\f425';
}
```

Shuning uchun ikonka **matn** kabi: `color` va `font-size` bilan boshqariladi.

```css
.tugma .bi {
  font-size: 1.25em;
}
```

## Ikonka shriftining kamchiliklari

- Butun shrift (yuzlab ikonka) yuklanadi, siz atigi o‘ntasini ishlatsangiz ham.
- Shrift yuklanmasa yoki bloklansa, ikonka o‘rnida bo‘sh joy yoki kvadratcha.
- Ko‘p rangli ikonka yasab bo‘lmaydi.
- Ekran o‘quvchilar ba’zan `::before` dagi maxsus belgini o‘qib yuborishi mumkin — `aria-hidden="true"` shart.

Shuning uchun katta loyihalarda SVG afzal. Lekin tez prototip va Bootstrap’li loyihalarda ikonka shrifti juda qulay.

## Versiyani qotiring

CDN havolasida aniq versiya (`@1.13.1`) yozing. Versiyasiz havola yangi chiqqan versiyani olib, ikonkalarni kutilmaganda o‘zgartirishi mumkin.

Mashqda Bootstrap Icons’ni ulab, menyu havolalariga ikonka qo‘shasiz.
