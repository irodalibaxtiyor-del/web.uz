## `<div>` — universal konteyner

`<div>` elementi boshqa elementlarni **guruhlash** uchun ishlatiladi. O‘zi hech qanday ma’no bildirmaydi va ko‘rinishi yo‘q — uning kuchi CSS bilan birga ochiladi.

```html
<div>
  <h2>Yangiliklar</h2>
  <p>Ertaga yangi kurs boshlanadi.</p>
</div>
```

## Guruhlab uslub berish

```html
<div style="border: 1px solid #d0d7de; border-radius: 8px; padding: 16px;">
  <h3>Mahsulot</h3>
  <p>Narxi: 45 000 so‘m</p>
  <button>Savatga qo‘shish</button>
</div>
```

## Elementlarni yonma-yon joylashtirish

`<div>` blok element bo‘lgani uchun odatda bir-birining ostiga tushadi. Yonma-yon qo‘yishning zamonaviy usuli — **Flexbox**:

```html
<div style="display: flex; gap: 16px;">
  <div style="flex: 1; background: #e0f2fe; padding: 12px;">Chap ustun</div>
  <div style="flex: 1; background: #fef9c3; padding: 12px;">O‘rta ustun</div>
  <div style="flex: 1; background: #dcfce7; padding: 12px;">O‘ng ustun</div>
</div>
```

Yana bir usul — **CSS Grid**:

```html
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

## Markazga joylashtirish

```html
<div style="max-width: 600px; margin: 0 auto;">Bu blok sahifa markazida turadi.</div>
```

`margin: 0 auto` — chap va o‘ng tashqi oraliqni teng bo‘lishga majbur qiladi.

## `<div>` yoki semantik teg?

Agar qism aniq ma’noga ega bo‘lsa (sarlavha qismi, menyu, maqola, pastki qism), `<header>`, `<nav>`, `<article>`, `<footer>` kabi **semantik teglarni** ishlating. `<div>` esa ma’nosi yo‘q, faqat uslub yoki joylashuv uchun kerak bo‘lgan guruhlar uchun qoladi. Semantik teglar alohida darsda o‘rganiladi.

## Xulosa

- `<div>` — elementlarni guruhlovchi blok konteyner.
- Flexbox (`display: flex`) va Grid (`display: grid`) bilan bloklarni yonma-yon joylashtirish mumkin.
- Ma’noli qismlar uchun semantik teglarni afzal ko‘ring.
