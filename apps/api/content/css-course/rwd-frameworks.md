## CSS freymvorklari

Freymvork — tayyor uslublar to‘plami: to‘r, tugmalar, formalar, menyular. U loyihani tezroq boshlashga yordam beradi.

## Ikki yondashuv

| Yondashuv                    | Qanday ishlaydi                                        | Mashhur namunalar |
| ---------------------------- | ------------------------------------------------------ | ----------------- |
| Komponentlar                 | Tayyor klasslar: `.btn`, `.card`, `.navbar`            | Bootstrap, Bulma  |
| Utility (yordamchi) klasslar | Har bir klass — bitta xususiyat: `.flex`, `.p-4`, `.text-center` | Tailwind CSS |

**Komponent** yondashuvida HTML qisqa, lekin dizayn freymvorkning ko‘rinishiga o‘xshab qoladi va o‘zgartirish uchun uning uslublarini “yengish” kerak bo‘ladi.

**Utility** yondashuvida dizayn HTML’dagi klasslardan yig‘iladi:

```html
<div class="flex items-center gap-4 p-4 rounded-lg bg-white shadow">
  …
</div>
```

HTML uzunroq, lekin CSS yozish deyarli kerak emas va dizayn erkin.

## Utility klasslar ichida nima bor?

Sir yo‘q — oddiy CSS:

```css
.flex { display: flex; }
.items-center { align-items: center; }
.gap-4 { gap: 1rem; }
.p-4 { padding: 1rem; }
.text-center { text-align: center; }
```

Moslashuvchan variantlar media so‘rov ichida:

```css
@media (min-width: 768px) {
  .md\:flex-row { flex-direction: row; }
}
```

Klass nomidagi `:` CSS’da `\:` bilan ekranlanadi. HTML’da esa oddiy yoziladi: `class="md:flex-row"`.

## Freymvork kerakmi?

| Afzallik                                 | Kamchilik                                    |
| ---------------------------------------- | -------------------------------------------- |
| Tez boshlash                             | Keraksiz kod (agar tozalanmasa)              |
| Jamoada yagona qoidalar                  | Freymvorkni ham o‘rganish kerak              |
| Ko‘p brauzerda sinalgan                  | Ko‘plab saytlar bir-biriga o‘xshab qoladi   |

Eng muhimi: freymvork **CSS bilimini almashtirmaydi**. Tailwind’dagi `grid-cols-3` — bu `grid-template-columns: repeat(3, minmax(0, 1fr))`. Bu kursda o‘rgangan narsalaringiz har qanday freymvorkni tez tushunishga yordam beradi va freymvork yetmagan joyda o‘zingiz yozishingiz mumkin bo‘ladi.

## Freymvorksiz zamonaviy CSS

Bugun ko‘p narsani freymvorksiz qilish oson:

- maket — Grid va Flexbox;
- dizayn tokenlari — CSS o‘zgaruvchilari;
- moslashuv — `clamp()`, `min()`, `auto-fill`, konteyner so‘rovlari;
- tartib — `@layer`.

## Kurs yakuni

Tabriklaymiz! Siz CSS’ning asosiy qismini o‘rgandingiz: selektorlar, quti modeli, matn, ranglar, joylashuv, Flexbox, Grid, animatsiyalar va moslashuvchan dizayn. Keyingi qadam — o‘z loyihalaringizni qurish va ularni portfolioga qo‘shish.

## Xulosa

- Komponent freymvorklari tayyor bloklar beradi, utility freymvorklar — bitta xususiyatli klasslar.
- Utility klass — oddiy CSS qoidasi.
- Freymvork CSS bilimini almashtirmaydi, aksincha unga tayanadi.
