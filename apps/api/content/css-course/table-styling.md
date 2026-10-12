## Jadvalni chiroyli qilish

Oldingi darsda jadvalning asosini qurdik. Endi uni qulayroq qiladigan usullar.

## Zebra qatorlar

Keng jadvalda ko‘z qatorni “yo‘qotib qo‘yadi”. Har ikkinchi qatorga fon berish bu muammoni hal qiladi:

```css
tbody tr:nth-child(even) {
  background-color: #f5faff;
}
```

`:nth-child(even)` — juft o‘rindagi elementlar, `odd` — toq o‘rindagilar. Bu selektor 7-modulda batafsil o‘rganiladi.

## Hover qator

```css
tbody tr:hover {
  background-color: #e6f1fc;
}
```

Sichqoncha ostidagi qator ajralib turadi — uzun qatorni oxirigacha kuzatish oson.

## Sarlavha qatori

```css
thead th {
  background-color: #0e1133;
  color: white;
}
```

Jadval uzun bo‘lsa, sarlavhani sahifa aylantirilganda yuqorida ushlab turish mumkin:

```css
thead th {
  position: sticky;
  top: 0;
}
```

## Jadval nomi: `caption`

`<caption>` jadvalning nomi. U ekran o‘quvchilar uchun ham muhim. Joyi `caption-side` bilan o‘zgaradi:

```css
caption {
  caption-side: bottom;
  padding: 8px;
  font-size: 0.875rem;
  color: #555555;
}
```

## Kichik ekranlarda jadval

Ko‘p ustunli jadval telefon ekraniga sig‘maydi va butun sahifani yon tomonga cho‘zib yuboradi. Eng oddiy yechim — jadvalni o‘ramga solib, faqat **o‘ramni** aylantirish:

```html
<div class="jadval-quti">
  <table>…</table>
</div>
```

```css
.jadval-quti {
  overflow-x: auto;
}
```

Endi sahifa joyida qoladi, jadvalning o‘zi gorizontal aylantiriladi.

## Kataklar orasidagi masofa

`border-collapse: separate` bo‘lsa, kataklar orasidagi masofa `border-spacing` bilan beriladi:

```css
table {
  border-collapse: separate;
  border-spacing: 4px;
}
```

## Xulosa

- `tbody tr:nth-child(even)` — zebra qatorlar.
- `tr:hover` qatorni ajratadi.
- `caption` jadval nomi, `caption-side` uning joyi.
- Kichik ekranda jadvalni `overflow-x: auto` o‘ramga soling.
