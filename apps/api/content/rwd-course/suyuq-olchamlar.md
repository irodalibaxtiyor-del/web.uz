## Media so‘rovsiz moslashuv

Ko‘p holatda maketni har bir ekran uchun alohida yozish shart emas. CSS matematik funksiyalari bilan qiymatlar ekranga qarab **silliq** o‘zgaradi.

## `min()` — eng kichigini oladi

```css
.konteyner {
  width: min(100% - 2rem, 70rem);
  margin-inline: auto;
}
```

“Kenglik — ikki qiymatdan kichigi: ekran kengligidan 2rem kam yoki 70rem.” Telefonda chetlardan 1rem (16px) joy qoladi, katta ekranda esa konteyner 70rem (1120px) dan oshmaydi. Bitta qator ikki media so‘rov o‘rnini bosdi.

Funksiyalar ichida `+` va `-` belgilarining ikki tomonida bo‘shliq bo‘lishi shart: `100% - 2rem` to‘g‘ri, `100%-2rem` xato.

## `max()` — eng kattasini oladi

```css
.bosh {
  padding-block: max(2rem, 5vh);
}
```

Past ekranda bo‘shliq 2rem dan kam bo‘lmaydi, baland ekranda esa ekran balandligining 5% iga teng.

## `clamp()` — pastki va yuqori chegara

```css
h1 {
  font-size: clamp(1.5rem, 1rem + 2.5vw, 3rem);
}
```

Uchta qiymat: **eng kichik**, **istalgan**, **eng katta**. O‘rtadagi qiymat ekranga qarab o‘zgaradi, lekin chegaralardan chiqmaydi:

| Ekran | `1rem + 2.5vw` | Natija |
| --- | --- | --- |
| 320px | 16 + 8 = 24px | 24px |
| 800px | 16 + 20 = 36px | 36px |
| 1400px | 16 + 35 = 51px | 48px (chegara) |

O‘rtadagi qiymatda `rem` qismini qoldirish muhim. Faqat `vw` dan iborat shrift (`font-size: 4vw`) foydalanuvchi kattalashtirganda o‘zgarmaydi — bu accessibility talabiga zid.

## Qachon media so‘rov kerak?

Funksiyalar **o‘lchamlarni** silliq o‘zgartiradi. Lekin maket **tuzilishi** o‘zgarishi kerak bo‘lsa (masalan, menyu yashirinib burger paydo bo‘lsa yoki ikki ustun bitta bo‘lsa), media yoki konteyner so‘rovlari kerak bo‘ladi.

## Brauzer qo‘llab-quvvatlashi

`min()`, `max()` va `clamp()` barcha zamonaviy brauzerlarda ishlaydi. Juda eski brauzerlar uchun oddiy qiymatni oldin yozib qo‘yish mumkin — tushunmagan brauzer ikkinchi qatorni e’tiborsiz qoldiradi.

Mashqda konteyner, sarlavha va bo‘shliqni media so‘rovsiz moslashtirasiz. Brauzer oynasini toraytirib-kengaytirib, sarlavha qanday silliq o‘zgarishini kuzating.

```tekshir
`width: min(100%, 600px)` nima qiladi?
+ element 600px dan keng bo‘lmaydi, tor joyda esa 100% bo‘ladi
- har doim 600px
- har doim 100%
> `min()` ikki qiymatdan kichigini oladi — `max-width` ning qisqa yozuvi kabi.
```

```jonli
<style>
  .c { width: min(100%, 400px); background: #eef4fb; padding: 8px; }
  h2 { font-size: clamp(1.2rem, 4vw, 2.2rem); }
</style>
<h2>clamp() sarlavha</h2>
<div class="c">min(100%, 400px)</div>
```
