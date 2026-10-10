## Sarlavhalar darajasi

HTML’da olti daraja sarlavha bor: `<h1>` dan `<h6>` gacha.

```html
<h1>O‘zbekiston shaharlari</h1>
<h2>Samarqand</h2>
<h3>Tarixi</h3>
<h3>Diqqatga sazovor joylari</h3>
<h2>Buxoro</h2>
```

Brauzer sarlavhalarni avtomatik ravishda qalin va kattaroq qilib ko‘rsatadi, ularning tepasi va pastiga bo‘sh joy qo‘shadi.

## Sarlavhalar — kitobning mundarijasi

Sarlavhalar faqat “katta yozuv” emas. Ular sahifaning **tuzilmasini** bildiradi:

- qidiruv tizimlari sahifa mavzusini sarlavhalar orqali tushunadi;
- ekran o‘qiydigan dasturlar foydalanuvchiga sarlavhalar bo‘yicha sakrab yurish imkonini beradi.

Shuning uchun:

1. Sahifada odatda **bitta `<h1>`** bo‘ladi — u sahifaning asosiy mavzusi.
2. Darajalarni **sakratmang**: `<h2>` dan keyin to‘g‘ridan-to‘g‘ri `<h4>` qo‘ymang.
3. Matnni kattalashtirish uchun sarlavha ishlatmang — buning uchun CSS bor.

## Sarlavha o‘lchamini o‘zgartirish

Ko‘rinishni CSS bilan o‘zgartirish mumkin. Bunda ma’no (daraja) saqlanib qoladi:

```html
<h1 style="font-size: 48px;">Katta sarlavha</h1>
<h2 style="font-size: 18px;">Kichik ko‘rinishli ikkinchi daraja</h2>
```

## Gorizontal chiziq

`<hr>` elementi mavzu o‘zgarganini bildiradi va odatda chiziq bo‘lib ko‘rinadi:

```html
<h2>Kirish</h2>
<p>...</p>
<hr>
<h2>Asosiy qism</h2>
```

## Xulosa

- `<h1>`…`<h6>` — sarlavhalarning olti darajasi.
- Sarlavhalar sahifa tuzilmasini bildiradi; darajalar ketma-ket bo‘lsin.
- Ko‘rinishni CSS bilan, ma’noni esa to‘g‘ri teg bilan bering.
