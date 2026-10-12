## Moslashuvchan dizayn nima?

Saytingizni telefon, planshet, noutbuk va katta monitorda ochishadi. Ekran kengligi 320px dan 2500px gacha bo‘lishi mumkin. **Moslashuvchan dizayn** (responsive web design, RWD) — bitta sahifa har qanday ekranda qulay ko‘rinishi va ishlashi.

Bugun internet foydalanuvchilarining katta qismi telefondan kiradi. Telefonda yaxshi ishlamaydigan sayt ko‘p foydalanuvchini yo‘qotadi.

## Uch asosiy tamoyil

| Tamoyil                 | Ma’nosi                                           | Vosita                          |
| ----------------------- | ------------------------------------------------- | ------------------------------- |
| Suyuq maket             | Bloklar kenglikka moslashadi, qat’iy piksel emas  | `%`, `fr`, `max-width`, Flexbox, Grid |
| Moslashuvchan media     | Rasm va videolar konteynerdan chiqmaydi           | `max-width: 100%`               |
| Media so‘rovlar         | Ma’lum kenglikda maketni o‘zgartirish             | `@media`                        |

Bularning birinchi ikkisini oldingi modullarda ko‘p ishlatdik.

## Mobil birinchi (mobile first)

Ikki yondashuv bor:

- **Desktop birinchi:** avval katta ekran uchun yoziladi, keyin `max-width` so‘rovlari bilan kichraytiriladi.
- **Mobil birinchi:** avval telefon uchun oddiy, bir ustunli maket yoziladi, keyin `min-width` so‘rovlari bilan kattaroq ekranlar uchun ustunlar qo‘shiladi.

Mobil birinchi yondashuv tavsiya etiladi:

- telefon uchun uslub sodda — bir ustun, kam qoida;
- katta ekranga **qo‘shish** olib tashlashdan osonroq;
- sekin telefonlar keraksiz murakkab uslublarni qayta ishlamaydi.

## “Media so‘rovsiz” moslashuv

Zamonaviy CSS ko‘p ishni media so‘rovlarsiz qiladi:

```css
.kartalar {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

h1 {
  font-size: clamp(1.75rem, 4vw + 1rem, 3rem);
}

.konteyner {
  width: min(100% - 32px, 1100px);
  margin-inline: auto;
}
```

Uchta qoida — to‘r, sarlavha va konteyner har qanday ekranga moslashadi.

## Sinab ko‘rish

Brauzer DevTools’idagi “qurilma rejimi” (Ctrl+Shift+M) turli ekran o‘lchamlarini ko‘rsatadi. Lekin imkon bo‘lsa, haqiqiy telefonda ham sinab ko‘ring: barmoq bilan bosish, klaviatura ochilishi kabi narsalar emulyatorda boshqacha.

## Xulosa

- Moslashuvchan dizayn: suyuq maket, moslashuvchan media, media so‘rovlar.
- Mobil birinchi: oddiy maketdan boshlab, katta ekranlar uchun qo‘shish.
- Grid `auto-fill`, `clamp()`, `min()` — ko‘p hollarda media so‘rovsiz yechim.
