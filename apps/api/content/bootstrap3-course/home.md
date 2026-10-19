## Bootstrap nima?

**Bootstrap** — tayyor CSS klasslari va JavaScript komponentlaridan iborat bepul **frontend freymvork**. U sahifani noldan bezash o‘rniga, tayyor “g‘ishtlar”dan yig‘ish imkonini beradi: tugmalar, menyular, jadvallar, formalar, oynalar (modal), karusel va eng muhimi — **moslashuvchan setka** (grid).

Bootstrap’ni 2011-yilda Twitter dasturchilari Mark Otto va Jacob Thornton ichki loyihalar uchun yaratgan, keyin ochiq kodli qilib chiqarishgan. Bugun u dunyodagi eng mashhur CSS freymvorklaridan biri.

## Nega Bootstrap?

| Afzallik                 | Ma’nosi                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| Tez boshlash             | Bitta `<link>` ulanadi — tayyor uslublar ishlay boshlaydi               |
| Moslashuvchan (responsive) | Setka telefon, planshet va kompyuterga o‘zi moslashadi                 |
| Mobile-first             | Uslublar avval kichik ekran uchun yozilgan                              |
| Bir xil ko‘rinish        | Barcha zamonaviy brauzerlarda deyarli bir xil chiqadi                   |
| Hujjatlar va jamiyat     | Juda ko‘p misol, shablon va savol-javob bor                             |

## Bootstrap’ning versiyalari

| Versiya       | Asosiy farqi                                                                   |
| ------------- | ------------------------------------------------------------------------------ |
| Bootstrap 3   | `float` asosidagi setka, Glyphicons ikonkalari, panel va well komponentlari, jQuery kerak |
| Bootstrap 4   | Flexbox asosidagi setka, `card` komponenti, `rem` birliklari, Glyphicons yo‘q, jQuery kerak |
| Bootstrap 5   | jQuery’siz, yangi utilitalar, `offcanvas`, qorong‘i rejim, `xxl` ekran o‘lchami |

Bu kurs **Bootstrap 3.4.1** — 3-versiyaning oxirgi relizi bilan ishlaydi. Yangi loyihalar odatda Bootstrap 5 bilan boshlanadi, lekin juda ko‘p ishlab turgan saytlar, admin panellar va shablonlar hali ham Bootstrap 3 da. Uni bilish eski loyihalarni qo‘llab-quvvatlash va 4/5-versiyalarga o‘tishni tushunish uchun foydali.

## Bootstrap qanday ishlaydi?

Siz HTML yozasiz va elementlarga Bootstrap **klasslarini** berasiz:

```html
<button type="button" class="btn btn-primary">Saqlash</button>
<div class="alert alert-success">Ma’lumotlar saqlandi!</div>
```

- `btn btn-primary` — ko‘k, yumaloq burchakli, hover’da to‘qlashadigan tugma;
- `alert alert-success` — yashil fonli xabar qutisi.

O‘zingiz bitta qator CSS yozmadingiz — hammasi `bootstrap.min.css` ichida tayyor. Interaktiv qismlar (ochiladigan menyu, modal, karusel) uchun Bootstrap’ning JavaScript fayli ishlatiladi.

## Bootstrap 3 tarkibi

- **CSS:** setka, tipografiya, jadval, forma, tugma va boshqa komponentlar;
- **Glyphicons:** 250 dan ortiq ikonka (shrift ko‘rinishida);
- **JavaScript plaginlar:** dropdown, modal, tooltip, popover, collapse, carousel, scrollspy, affix va boshqalar. Ular **jQuery** kutubxonasiga tayanadi.

## Bu kursda nima qilamiz?

1. Bootstrap’ni sahifaga ulaymiz va setka bilan ishlaymiz.
2. Tipografiya, jadval, rasm, xabar va tugmalarni o‘rganamiz.
3. Navigatsiya: pagination, ro‘yxatlar, panellar, menyular, navbar.
4. Formalar va kiritish maydonlari.
5. JavaScript komponentlar: modal, karusel, tooltip, scrollspy.
6. Setka tizimini chuqur o‘rganamiz va uchta to‘liq sahifa (tema) yig‘amiz.

Har bir darsdan keyin **amaliy mashq** bor: kodni IDE’da yozasiz, **Ishga tushirish** bilan natijani ko‘rasiz va **Tekshirish** bilan server tekshiruvidan o‘tkazasiz.

> Platformada Bootstrap fayllari serverning o‘zida saqlanadi. Siz odatdagi CDN havolasini yozasiz (keyingi darsda ko‘rasiz) — platforma uni o‘zidagi xuddi shu faylga almashtiradi. Boshqa tashqi havolalar (rasm, shrift, skript) xavfsizlik uchun preview’da bloklangan.

## Xulosa

- Bootstrap — tayyor CSS klasslari va JS komponentlari to‘plami.
- U moslashuvchan, mobile-first va tez ishlashga mo‘ljallangan.
- Bootstrap 3 jQuery’ga tayanadi va `float` asosidagi setkadan foydalanadi.
