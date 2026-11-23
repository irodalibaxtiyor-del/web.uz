## Ikonka nima uchun kerak

Yaxshi ikonka matnni tezroq topishga yordam beradi: savat, qidiruv, yopish, sozlamalar. Lekin ikonka **bezak emas** — u ma’no beradigan joyda turadi. Har bir sarlavha oldiga qo‘yilgan ikonka faqat shovqin qo‘shadi.

## Nega SVG?

|                               | SVG | Rasm (PNG) | Ikonka shrifti      |
| ----------------------------- | --- | ---------- | ------------------- |
| Har qanday o‘lchamda tiniq    | Ha  | Yo‘q       | Ha                  |
| Rangni CSS bilan o‘zgartirish | Ha  | Yo‘q       | Ha                  |
| Faqat kerakli ikonkalar       | Ha  | Ha         | Yo‘q (butun shrift) |
| Ko‘p rang, chiziq qalinligi   | Ha  | —          | Yo‘q                |

Bugun ko‘p loyihalar SVG ikonkalarni HTML ichiga yoki komponent sifatida joylaydi.

## `currentColor`

```html
<svg
  class="ikonka"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  aria-hidden="true"
>
  <path d="M5 12h14M13 6l6 6-6 6" />
</svg>
```

`stroke="currentColor"` — chiziq rangi atrofdagi matnning `color` qiymati. Tugma rangi o‘zgarsa (hover, qorong‘i mavzu), ikonka ham birga o‘zgaradi — alohida qoida kerak emas.

## O‘lcham `em` da

```css
.ikonka {
  width: 1.25em;
  height: 1.25em;
  flex-shrink: 0;
}
```

16px matnda ikonka 20px, 20px matnda 25px. Ikonka doim matnga mutanosib. `flex-shrink: 0` tor joyda ikonka siqilib ketmasligi uchun.

## Matn bilan tekislash

```css
.tugma {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
```

Bu usul `vertical-align` bilan qiynalishdan ancha oson.

## Izchillik

Bitta interfeysda **bitta ikonka to‘plami**: bir xil chiziq qalinligi, bir xil burchaklar, bir xil uslub (faqat chiziqli yoki faqat to‘ldirilgan). Turli to‘plamlardan olingan ikonkalar yonma-yon tursa, darhol sezilib qoladi. Mashhur bepul to‘plamlar: Tabler Icons, Phosphor, Lucide, Heroicons, Bootstrap Icons.

Ikonka o‘lchamlari ham shkalaga bo‘ysunsin: odatda 16, 20, 24px.

## Ikonka va ma’no

Hamma tushunadigan ikonkalar kam: uy, qidiruv, yopish (×), menyu, savat. Qolgan ikonkalar (masalan, “eksport”, “arxiv”) yorliqsiz tushunarsiz. Shubha bo‘lsa — ikonka yoniga matn yozing.

Mashqda tugmadagi ikonkani matnga moslashadigan qilasiz.

```tekshir
SVG ikonka atrofdagi matn bilan bir xil o‘lchamda bo‘lishi uchun o‘lcham qanday beriladi?
+ `width: 1em; height: 1em`
- `width: 24px` (har doim)
- `font-size: 0`
> `em` matn o‘lchamiga bog‘liq — ikonka matn bilan birga kattalashadi.
```

```jonli
<style>
  a { color: #0071dc; display: inline-flex; align-items: center; gap: .35em; font-size: 20px; }
  a:hover { color: crimson; }
  svg { width: 1em; height: 1em; fill: currentColor; }
</style>
<a href="#"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z"/></svg>Sevimlilar</a>
```
