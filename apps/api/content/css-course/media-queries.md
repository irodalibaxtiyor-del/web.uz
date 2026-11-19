## Media so‘rovlar

Media so‘rov — shart bajarilganda ichidagi CSS qoidalarini qo‘llaydigan blok:

```css
@media (min-width: 768px) {
  .maket {
    grid-template-columns: 2fr 1fr;
  }
}
```

“Ekran kengligi kamida 768px bo‘lsa, maket ikki ustunli bo‘lsin.”

## Kenglik shartlari

| Shart                 | Ma’nosi                   |
| --------------------- | ------------------------- |
| `(min-width: 768px)`  | 768px va undan keng       |
| `(max-width: 767px)`  | 767px va undan tor        |
| `(width >= 768px)`    | Yangi, o‘qilishi oson yozuv |
| `(600px <= width < 900px)` | Oraliq               |

Mobil birinchi yondashuvda asosan `min-width` ishlatiladi: standart uslub telefon uchun, so‘rovlar kattaroq ekranlar uchun **qo‘shiladi**.

## Tanaffus nuqtalari (breakpoints)

Ko‘p ishlatiladigan qiymatlar:

| Nuqta    | Taxminiy qurilma        |
| -------- | ----------------------- |
| `576px`  | Katta telefon           |
| `768px`  | Planshet                |
| `1024px` | Kichik noutbuk          |
| `1280px` | Katta ekran             |

Lekin eng yaxshi tanaffus nuqtasi — **kontent buzila boshlagan joy**. Brauzer oynasini asta-sekin toraytiring: maket qayerda noqulay bo‘lsa, o‘sha yerga so‘rov qo‘shing. Qurilmalar o‘zgaradi, kontent esa o‘zingizniki.

## Boshqa shartlar

```css
@media (orientation: landscape) { … }       /* gorizontal holat */
@media (hover: hover) { … }                 /* sichqonchali qurilma */
@media (prefers-color-scheme: dark) { … }   /* qorong‘i rejim */
@media (prefers-reduced-motion: reduce) { … } /* harakatni kamaytirish */
@media print { … }                          /* chop etish */
```

`(hover: hover)` foydali: hover effektlarini faqat sichqonchali qurilmalarga berish mumkin — telefonda “yopishib qolgan” hover bo‘lmaydi.

## Bir nechta shart

```css
@media (min-width: 768px) and (orientation: landscape) { … }
@media (max-width: 600px), print { … } /* vergul — “yoki” */
```

## So‘rovlarni qayerga yozish?

Ikkala usul ham to‘g‘ri:

- har bir komponentning **yoniga** (komponent bilan bog‘liq hamma narsa bir joyda);
- fayl **oxiriga** guruhlab.

Muhimi — kaskad: media so‘rov ichidagi qoida asosiy qoidani yengishi uchun u **keyin** yozilgan yoki kuchliroq selektorli bo‘lishi kerak.

## Konteyner so‘rovlari

Zamonaviy CSS’da ekran emas, **ota konteyner** kengligiga qarab ham uslub berish mumkin:

```css
.kartalar-joyi {
  container-type: inline-size;
}

@container (min-width: 500px) {
  .karta {
    display: flex;
  }
}
```

Kartochka yon panelda tor, asosiy qismda keng bo‘lsa — har joyda o‘ziga mos ko‘rinadi.

```tekshir
Mobil birinchi yondashuvda qaysi media so‘rov ishlatiladi?
+ `@media (min-width: 768px)`
- `@media (max-width: 768px)` faqat
- `@media screen-only`
> Oddiy uslub kichik ekran uchun, kattaroq ekranlar uchun `min-width` bilan qo‘shimcha.
```

```jonli
<style>
  .k { display: grid; gap: 8px; }
  .k div { background: #eef4fb; padding: 12px; }
  @media (min-width: 500px) { .k { grid-template-columns: 1fr 1fr 1fr; } }
</style>
<div class="k"><div>1</div><div>2</div><div>3</div></div>
<p>Oyna 500px dan keng bo‘lsa, uch ustun.</p>
```

## Xulosa

- `@media (min-width: …)` — mobil birinchi yondashuvning asosi.
- Tanaffus nuqtasini kontent belgilaydi.
- `hover`, `prefers-color-scheme`, `prefers-reduced-motion`, `print` — boshqa foydali shartlar.
- `@container` — konteyner kengligiga qarab uslub.
