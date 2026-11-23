## Hero

```
Desktop 1440: H1 Bold 48/56
Mobile 360:   H1 Bold 32/40
```

Ikki freymdagi o‘lchamlarni media so‘rov bilan ham berish mumkin, lekin `clamp()` oraliq ekranlarda ham silliq natija beradi:

```css
h1 {
  font-size: clamp(2rem, 1rem + 2.5vw, 3rem); /* 32px … 48px */
  line-height: 1.17; /* 56 / 48 */
  font-weight: 700;
}
```

`1rem + 2.5vw` qanday topiladi? 360 da 32px va 1440 da 48px bo‘lishi uchun to‘g‘ri chiziq tenglamasi kerak: o‘sish `(48 − 32) / (1440 − 360) ≈ 1.48vw`. Yaxlit qiymat (2.5vw) bilan natija biroz tezroq o‘sadi, lekin chegaralar `clamp()` da baribir 32 va 48. Aniq hisob kerak bo‘lsa — “clamp calculator” vositalaridan foydalaning.

Qator balandligi `56 / 48 ≈ 1.17` — birliksiz, shuning uchun 32px’da ham mutanosib (~37px; maketdagi 40 ga yaqin).

## Konteyner

```css
.konteyner {
  width: min(100% - 32px, 1296px);
  margin-inline: auto;
}
```

Desktop maketdagi Layout Grid: margin 72 → `1440 − 2 × 72 = 1296`. Telefonda chetlardan 16px.

## Kartalar

```
Cards: 3 ta · Gap 24 · Padding 24 · Radius 16 · Stroke 1 #E2E8F0
```

```css
.kartalar {
  display: grid;
  gap: 24px;
}

@media (min-width: 1024px) {
  .kartalar {
    grid-template-columns: repeat(3, 1fr);
  }
}

.karta {
  padding: 24px;
  border-radius: 16px;
}
```

1296 kenglikda: `(1296 − 2 × 24) / 3 = 416px` — maketdagi karta kengligi bilan mos tushishi kerak. Mos tushmasa, maketni qayta tekshiring: ehtimol kartalar to‘rga emas, boshqa qiymatga tekislangan.

## Mos kelmaslik bo‘lsa

Ba’zan maketdagi karta 412 yoki 420 bo‘ladi — dizayner qo‘lda cho‘zgan. Bunday hollarda tizim (to‘r, gap) ustun: CSS to‘r bo‘yicha hisoblasin, farqni dizaynerga ayting. Bitta karta uchun “sehrli” qiymat yozmang.

Mashqda hero sarlavhasi va xizmat kartalarini ikki freym bo‘yicha yig‘asiz.

```tekshir
Maket va kodda kichik farq (1–2px) chiqsa, eng to‘g‘ri yo‘l qaysi?
+ tokenlar va shkaladagi eng yaqin qiymatni olish; katta farq bo‘lsa dizayner bilan kelishish
- har bir pikselni absolute bilan moslash
- maketni e’tiborsiz qoldirish
> Tizimli qiymatlar sahifani izchil qiladi.
```

```jonli
<style>
  .hero { max-width: 960px; margin: 0 auto; padding: 32px 16px; text-align: center; }
  .hero h1 { font-size: clamp(1.8rem, 1rem + 3vw, 3rem); margin: 0 0 12px; }
  .kartalar { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); margin-top: 20px; }
  .kartalar div { padding: 16px; border-radius: 10px; background: #eef4fb; }
</style>
<section class="hero"><h1>Maketdan sahifaga</h1><p>Figma qiymatlari tokenlar orqali.</p><div class="kartalar"><div>Tez</div><div>Moslashuvchan</div><div>Qulay</div></div></section>
```
