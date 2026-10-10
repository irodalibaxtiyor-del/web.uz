## Havolalar — vebning asosi

Havolalar sahifalarni bir-biri bilan bog‘laydi. Ular `<a>` (anchor — langar) tegi bilan yaratiladi:

```html
<a href="https://kun.uz">Yangiliklar</a>
```

- `href` — havola manzili;
- teglar orasidagi matn — foydalanuvchi bosadigan qism.

## Mutlaq va nisbiy manzillar

```html
<!-- Mutlaq: to‘liq manzil, boshqa saytga -->
<a href="https://www.gov.uz">Hukumat portali</a>

<!-- Nisbiy: shu saytning ichidagi sahifa -->
<a href="haqida.html">Biz haqimizda</a>
<a href="kurslar/html.html">HTML kursi</a>
```

## Yangi oynada ochish: `target`

```html
<a href="https://developer.mozilla.org" target="_blank" rel="noopener">MDN (yangi tabda)</a>
```

| Qiymat   | Qayerda ochiladi      |
| -------- | --------------------- |
| `_self`  | Shu oynada (standart) |
| `_blank` | Yangi tab yoki oynada |

Yangi tabda ochiladigan tashqi havolalarga `rel="noopener"` qo‘shish xavfsizlik uchun yaxshi odat.

## Sahifaning ichidagi bo‘limga havola

Elementga `id` bering va havolada `#` bilan murojaat qiling:

```html
<a href="#aloqa">Aloqa bo‘limiga o‘tish</a>
...
<h2 id="aloqa">Aloqa</h2>
```

## Email va telefon

```html
<a href="mailto:info@example.uz">Bizga yozing</a> <a href="tel:+998901234567">Qo‘ng‘iroq qilish</a>
```

## Rasm havola sifatida

```html
<a href="index.html">
  <img src="logo.png" alt="Bosh sahifaga qaytish" width="120" height="40">
</a>
```

## Havola matni haqida

“Bu yerni bosing” kabi matnlardan qoching. Havola matni qayerga olib borishini aytsin: “Narxlar ro‘yxatini ko‘rish”. Bu ekran o‘qiydigan dasturlar va qidiruv tizimlari uchun ham muhim.

## Havola ranglari

Brauzer odatda: ko‘rilmagan havola — ko‘k va tagiga chizilgan, ko‘rilgan — binafsha, bosilayotgan — qizil. Buni CSS bilan o‘zgartirish mumkin:

```css
a {
  color: #0071dc;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
a:visited {
  color: #5b3cc4;
}
```

## Xulosa

- Havola: `<a href="manzil">matn</a>`.
- `target="_blank"` — yangi tab, `#id` — sahifa ichidagi bo‘lim, `mailto:` va `tel:` — email va telefon.
- Havola matni aniq va tushunarli bo‘lsin.
