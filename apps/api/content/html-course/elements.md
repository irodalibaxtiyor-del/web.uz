## Element nima?

**HTML element** — ochuvchi teg, mazmun va yopuvchi tegdan iborat butunlik:

```html
<p>Bu paragraf.</p>
```

| Qism         | Qiymat         |
| ------------ | -------------- |
| Ochuvchi teg | `<p>`          |
| Mazmun       | `Bu paragraf.` |
| Yopuvchi teg | `</p>`         |

Yopuvchi teg nomidan oldin `/` belgisi turadi.

## Ichma-ich elementlar

Elementlar bir-birining ichida joylashishi mumkin. Aslida har bir sahifa ichma-ich elementlardan tashkil topgan daraxtdir:

```html
<body>
  <h1>Kundalik</h1>
  <p>Bugun <strong>HTML</strong> o‘rgandim.</p>
</body>
```

Bu yerda `<strong>` elementi `<p>` ichida, `<p>` esa `<body>` ichida joylashgan.

**Qoida:** ichkaridagi element tashqaridagisidan oldin yopilishi kerak.

```html
<!-- To‘g‘ri -->
<p><strong>Muhim</strong> matn</p>

<!-- Noto‘g‘ri: teglar kesishib ketgan -->
<p><strong>Muhim</p> matn</strong>
```

## Yopuvchi tegni unutmang

Brauzer ko‘p xatolarni “kechiradi”, lekin bunga tayanmang. Yopilmagan teglar kutilmagan natijalarga va CSS bilan muammolarga olib keladi.

## Bo‘sh elementlar

Ba’zi elementlarda mazmun bo‘lmaydi, shuning uchun yopuvchi tegi ham yo‘q:

```html
<p>Birinchi qator<br>Ikkinchi qator</p>
<hr>
<img src="rasm.png" alt="Tavsif">
```

- `<br>` — qatorni yangi qatorga o‘tkazadi;
- `<hr>` — mavzular orasidagi gorizontal chiziq;
- `<img>`, `<meta>`, `<link>`, `<input>` ham bo‘sh elementlar.

## Registr

HTML teglari registrga sezgir emas: `<P>` va `<p>` bir xil. Lekin hamma joyda **kichik harflar** bilan yozish qabul qilingan.

## Xulosa

- Element = ochuvchi teg + mazmun + yopuvchi teg.
- Elementlar ichma-ich joylashadi va to‘g‘ri tartibda yopilishi kerak.
- `<br>`, `<hr>`, `<img>` kabi bo‘sh elementlarning yopuvchi tegi yo‘q.
