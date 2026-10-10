## Izoh nima?

**Izohlar** — kod ichidagi eslatmalar. Brauzer ularni ko‘rsatmaydi, lekin kodni o‘qiyotgan dasturchi ko‘radi.

```html
<!-- Bu izoh. U sahifada ko‘rinmaydi. -->
<p>Bu esa ko‘rinadi.</p>
```

Izoh `<!--` bilan boshlanadi va `-->` bilan tugaydi.

## Nima uchun kerak?

1. **Tushuntirish.** Murakkab qismni keyinroq o‘zingiz yoki jamoadoshingiz tushunishi uchun:

```html
<!-- Bosh menyu: mobil ekranda yashiriladi -->
<nav>...</nav>
```

2. **Vaqtincha o‘chirish.** Kodni o‘chirmasdan yashirib turish:

```html
<!--
<p>Bu aksiya tugadi, keyinroq qaytaramiz.</p>
-->
```

3. **Xato qidirish.** Qismlarni birma-bir izohga olib, muammo qayerdaligini aniqlash.

## Ko‘p qatorli izoh

Izoh bir nechta qatorni egallashi mumkin — oxirgi `-->` gacha hammasi izoh hisoblanadi.

## Muhim ogohlantirish

Izohlar sahifada ko‘rinmaydi, lekin **sahifa kodida bor**. Har kim Ctrl + U orqali ularni o‘qiy oladi. Shuning uchun izohlarga parol, maxfiy manzil yoki shaxsiy ma’lumot yozmang.

## Xulosa

- Izoh: `<!-- matn -->`.
- Tushuntirish, kodni vaqtincha o‘chirish va xato qidirish uchun ishlatiladi.
- Izohlar maxfiy emas — ularni hamma ko‘ra oladi.
