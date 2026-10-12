## `@supports` — imkoniyatni tekshirish

CSS doim rivojlanadi. Yangi xususiyat hamma brauzerda bo‘lmasligi mumkin. `@supports` brauzer biror CSS qoidasini **tushunsa**, ichidagi uslublarni qo‘llaydi.

```css
@supports (display: grid) {
  .galereya {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}
```

## Mantiqiy operatorlar

```css
@supports (display: grid) and (gap: 1rem) { … }

@supports not (aspect-ratio: 1) {
  /* aspect-ratio yo‘q brauzerlar uchun eski usul */
}

@supports (backdrop-filter: blur(4px)) or (-webkit-backdrop-filter: blur(4px)) { … }
```

## Selektorni tekshirish

```css
@supports selector(:has(a)) {
  .karta:has(img) {
    padding-top: 0;
  }
}
```

## Progressiv yaxshilash

`@supports` ning to‘g‘ri ishlatilishi — **progressiv yaxshilash**: avval hamma joyda ishlaydigan oddiy uslub, keyin yangi imkoniyatlar bor joyda yaxshiroq versiya.

```css
/* 1. Hamma uchun: oddiy, lekin ishlaydi */
.panel {
  background-color: rgba(255, 255, 255, 0.95);
}

/* 2. Imkoniyat bo‘lsa: chiroyliroq */
@supports (backdrop-filter: blur(8px)) {
  .panel {
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(8px);
  }
}
```

Eski brauzerda ham panel o‘qiladi; yangisida — shisha effekti.

## Ko‘pincha `@supports` kerak emas

Brauzer tushunmagan xususiyatni **e’tiborsiz qoldiradi**. Shuning uchun ko‘p hollarda oddiy kaskad yetarli:

```css
.quti {
  height: 100vh;  /* hamma brauzer */
  height: 100dvh; /* yangi brauzer buni oladi, eskisi e’tiborsiz qoldiradi */
}
```

`@supports` bir nechta xususiyat **birga** o‘zgarishi kerak bo‘lganda kerak — yuqoridagi panel misolidagi kabi (fon shaffofligi faqat blur bilan birga ma’noli).

## Brauzer qo‘llab-quvvatlashini qayerdan bilish mumkin?

“Can I use” kabi ma’lumotnoma saytlari va MDN sahifalaridagi moslik jadvallari har bir xususiyat qaysi brauzer versiyasidan ishlashini ko‘rsatadi.

## Xulosa

- `@supports (xususiyat: qiymat)` — brauzer tushunsa qo‘llanadi.
- `and`, `or`, `not`, `selector()`.
- Progressiv yaxshilash: oddiy asos + imkoniyat bo‘lsa yaxshiroq.
- Bitta xususiyat uchun kaskad (zaxira qator) ko‘pincha yetarli.
