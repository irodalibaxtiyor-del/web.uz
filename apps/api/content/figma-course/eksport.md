## Maketdan fayllar

Rasmlar, logotiplar va ikonkalar maketdan **eksport** qilinadi. Qatlamni tanlab, o‘ng panelning pastidagi **Export** bo‘limida format va o‘lcham tanlanadi.

| Narsa                     | Format     | O‘lcham  |
| ------------------------- | ---------- | -------- |
| Ikonka, logo, diagramma   | SVG        | —        |
| Fotosurat                 | JPG / WebP | 1x va 2x |
| Shaffof rasm (soya bilan) | PNG / WebP | 1x va 2x |

## 1x va 2x

Retina ekranlarda bitta CSS piksel 2–3 jismoniy nuqtaga teng. 120 × 40 logo shunday ekranda xira ko‘rinadi. Shuning uchun ikki fayl eksport qilinadi: `logo.png` (120 × 40) va `logo@2x.png` (240 × 80):

```html
<img
  class="logo"
  src="logo.png"
  srcset="logo.png 1x, logo@2x.png 2x"
  width="120"
  height="40"
  alt="WEBDIZAYN.UZ"
/>
```

Brauzer ekran zichligiga qarab faylni tanlaydi. `width` va `height` — CSS piksellarda (1x o‘lcham).

## SVG eksporti

Figma’da ikonkani SVG qilib eksport qilsangiz, rang odatda qattiq yozilgan bo‘ladi: `stroke="#000000"`. Kodga qo‘yishdan oldin uni `currentColor` ga almashtiring:

```html
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
  <path d="M5 12h14M13 6l6 6-6 6" />
</svg>
```

Endi ikonka tugma matnining rangida, hover va qorong‘i mavzuda ham.

SVG’ni optimallashtirish: Figma eksporti ba’zan ortiqcha guruhlar va atributlar qo‘shadi. SVGO kabi vositalar faylni 30–60% kichraytiradi.

## `viewBox`

`viewBox="0 0 24 24"` — ikonka chizilgan koordinatalar maydoni. Uni o‘chirmang: usiz SVG CSS bilan o‘lchanmaydi. `width` va `height` esa standart o‘lcham (CSS ustun).

## Rasm sifati

- Fotosuratni Figma’dan **asl sifatda** eksport qiling, siqishni esa alohida (Squoosh kabi vositalar yoki build jarayoni) bajaring.
- Juda katta rasmlarni sahifaga qo‘ymang: 1440 freymdagi to‘liq kenglikdagi rasm uchun 1440 va 2880 piksellik variant yetarli.

## Nomlash

Eksport fayl nomlari qatlam nomidan olinadi. `Frame 427.png` emas, `hero-talaba.webp` — loyihada topish oson. Figma’da qatlamni to‘g‘ri nomlash eksportdan oldin bir daqiqalik ish.

Mashqda logoga 1x/2x fayl beradigan `srcset` qo‘shasiz va ikonkani `currentColor` ga o‘tkazasiz.
