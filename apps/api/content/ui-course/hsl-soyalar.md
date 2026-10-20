## Bitta rang — butun oila

Interfeysga bitta ko‘k rang yetmaydi: tugma foni, ustiga olib borilganda (hover) biroz to‘qroq, bildirishnoma foni juda och, chegara — o‘rtacha. Bularning hammasi bitta **tondan** yasaladi.

## HSL bilan soyalar

Tonni (H) va to‘yinganlikni (S) qoldirib, faqat yorug‘likni (L) o‘zgartiramiz:

```css
:root {
  --ton: 210;
}

.ochroq {
  background-color: hsl(var(--ton) 100% 95%);
} /* fon, bildirishnoma */
.asosiy {
  background-color: hsl(var(--ton) 100% 43%);
} /* tugma */
.toq {
  background-color: hsl(var(--ton) 100% 25%);
} /* hover, matn */
```

Brendni yashilga almashtirish uchun faqat `--ton: 150` deb yozish kifoya — butun oila o‘zgaradi.

## Shkala

Katta dizayn tizimlari har bir rangga 10–11 soyalik shkala tuzadi: `50, 100, 200 … 900, 950`. 50 — deyarli oq, 950 — deyarli qora, 500–600 — asosiy rang:

```css
:root {
  --kok-50: hsl(210 100% 97%);
  --kok-100: hsl(210 100% 92%);
  --kok-600: hsl(210 100% 43%);
  --kok-900: hsl(210 100% 20%);
}
```

O‘zgaruvchi nomlarida lotin harflari va chiziqcha ishlatish odatiy: `--blue-600` yoki `--kok-600`.

## Muhim nozikliklar

1. **Yorug‘lik bir xil ko‘rinmaydi.** `hsl(60 100% 50%)` (sariq) va `hsl(240 100% 50%)` (ko‘k) — L bir xil, lekin sariq ancha och ko‘rinadi. Shuning uchun har bir rang uchun soyalarni ko‘z bilan tekshirish kerak.
2. **To‘q soyalarda to‘yinganlikni biroz kamaytiring**, aks holda rang “zaharli” ko‘rinadi.
3. **Kulrang ham rangli bo‘lishi mumkin.** Sof kulrang (`hsl(0 0% 50%)`) o‘rniga brend tonidan ozgina to‘yinganlik bilan (`hsl(215 15% 50%)`) — interfeys yaxlit ko‘rinadi.

## `color-mix()`

Zamonaviy CSS’da ikkita rangni aralashtirish mumkin:

```css
.hover {
  background-color: color-mix(in srgb, var(--asosiy) 85%, black);
}
```

“Asosiy rangning 85% i va 15% qora” — to‘qroq soya. Brauzer qo‘llab-quvvatlashini tekshirib ishlating.

Mashqda bitta tondan uch soya yasaysiz.
