## Jadval keng, ekran tor

Jadval tabiatan keng: 5–6 ustun telefonga sig‘maydi. Uchta yechim bor.

## 1. O‘ram ichida aylantirish

Eng oddiy va jadval tuzilishini saqlaydigan usul:

```css
.jadval-quti {
  overflow-x: auto;
}
```

```html
<div class="jadval-quti" role="region" aria-label="Kurslar jadvali" tabindex="0">
  <table>…</table>
</div>
```

`tabindex="0"` va `aria-label` klaviatura foydalanuvchisi o‘ramga fokus berib, strelkalar bilan aylantira olishi uchun. Sahifaning o‘zi yon tomonga aylanmaydi — faqat jadval.

Ko‘p ustunli, raqamlar solishtiriladigan jadvallar (narxlar, statistika) uchun eng yaxshi tanlov.

## 2. Qatorlarni kartochkaga aylantirish

Har bir qator — bitta “obyekt” (kurs, buyurtma) bo‘lsa, telefonda kartochka qulayroq:

```css
@media (max-width: 599px) {
  .jadval thead { display: none; }

  .jadval tr,
  .jadval td { display: block; }

  .jadval tr { margin-bottom: 12px; }

  .jadval td::before {
    content: attr(data-label) ": ";
    font-weight: 700;
  }
}
```

```html
<td data-label="Darslar">60</td>
```

Sarlavha qatori yashiriladi, har bir katak o‘z nomini `data-label` atributidan oladi.

**Diqqat:** `display: block` ba’zi brauzerlarda jadval semantikasini o‘chiradi — ekran o‘quvchi uni jadval deb tanimay qoladi. Muhim jadvallarda `role="table"`, `role="row"`, `role="cell"` qaytarib qo‘yiladi yoki birinchi usul tanlanadi.

## 3. Ustunlarni kamaytirish

Telefonda faqat eng muhim 2–3 ustunni ko‘rsatish va qolganini “Batafsil” sahifasiga olib o‘tish. Lekin ma’lumotni butunlay yo‘qotib qo‘ymang.

## Qaysi birini tanlash

| Holat | Usul |
| --- | --- |
| Raqamlarni ustun bo‘yicha solishtirish | Aylantirish |
| Har qator alohida yozuv | Kartochka |
| Juda ko‘p ustun, kam muhim ma’lumot | Kamaytirish + batafsil sahifa |

## Kichik maslahatlar

- Birinchi ustunni `position: sticky; left: 0` qilib qotirsa, aylantirganda qaysi qator ekani ko‘rinib turadi.
- Raqamli ustunlarni o‘ngga tekislang va `font-variant-numeric: tabular-nums` bering — raqamlar bir xil kenglikda.

Mashqda kurslar jadvalini telefonda kartochkalarga aylantirasiz.
