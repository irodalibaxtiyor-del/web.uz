## Kenglikdan boshqa shartlar

Media so‘rov faqat kenglikni emas, qurilma va foydalanuvchi sozlamalarini ham tekshira oladi.

## Yo‘nalish: `orientation`

```css
@media (orientation: landscape) { … } /* kenglik balandlikdan katta */
@media (orientation: portrait) { … }  /* balandlik kenglikdan katta yoki teng */
```

Telefonni yotqizganda ekran past va keng bo‘ladi. Masalan, tik holatda ustma-ust turgan bloklarni yotiq holatda yonma-yon qo‘yish mumkin. Faqat telefonning yotiq holatini ajratish uchun balandlik bilan birlashtiriladi:

```css
@media (orientation: landscape) and (max-height: 500px) {
  h1 { font-size: 24px; }
}
```

## Kiritish usuli: `hover` va `pointer`

| So‘rov | Ma’nosi |
| --- | --- |
| `(hover: hover)` | Asosiy kiritish qurilmasi ustiga olib borishni biladi (sichqoncha) |
| `(hover: none)` | Bilmaydi (barmoq) |
| `(pointer: coarse)` | Aniqligi past — barmoq |
| `(pointer: fine)` | Aniq — sichqoncha, qalam |

```css
@media (hover: hover) {
  .karta:hover { transform: translateY(-2px); }
}

@media (pointer: coarse) {
  .tugma { min-height: 48px; }
}
```

Telefonda hover effekti bosilgandan keyin “yopishib qoladi” — shuning uchun uni faqat `(hover: hover)` da berish yaxshi odat.

## Foydalanuvchi sozlamalari: `prefers-*`

```css
@media (prefers-color-scheme: dark) {
  :root { --fon: #0b1120; --matn: #e2e8f0; }
}

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

- `prefers-color-scheme` — tizimda qorong‘i mavzu yoqilganmi;
- `prefers-reduced-motion` — harakatdan bezovta bo‘ladigan foydalanuvchi animatsiyalarni kamaytirishni so‘raganmi;
- `prefers-contrast` — yuqori kontrast so‘ralganmi.

Bu sozlamalarni hurmat qilish — accessibility’ning bir qismi.

## Chop etish: `print`

```css
@media print {
  nav, footer, .tugma { display: none; }
  a::after { content: " (" attr(href) ")"; }
}
```

Chop etilganda menyu va tugmalar kerak emas, havola manzillari esa qog‘ozda ko‘rinib tursa foydali.

## Sinab ko‘rish

Brauzer DevTools’ida **Rendering** panelidan `prefers-color-scheme`, `prefers-reduced-motion` va `print` ni taqlid qilish mumkin. Platformadagi avtomatik tekshiruv faqat ekran o‘lchamini o‘zgartiradi, shuning uchun mashq yo‘nalish (`orientation`) haqida.
