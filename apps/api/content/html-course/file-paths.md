## Fayl yo‘li nima?

Rasm, CSS, JavaScript yoki boshqa sahifaga murojaat qilganda brauzerga faylning **qayerda** ekanini aytish kerak. Bu manzil **fayl yo‘li** deyiladi.

## Namuna loyiha tuzilmasi

```text
sayt/
├── index.html
├── haqida.html
├── css/
│   └── style.css
├── images/
│   └── logo.png
└── blog/
    └── birinchi-post.html
```

## Nisbiy yo‘llar

Joriy fayl joylashgan papkaga nisbatan yoziladi.

| Yo‘l                 | Ma’nosi                                          |
| -------------------- | ------------------------------------------------ |
| `logo.png`           | Shu papkadagi fayl                               |
| `images/logo.png`    | Shu papkadagi `images` papkasidagi fayl          |
| `../logo.png`        | Bitta yuqori papkadagi fayl                      |
| `../images/logo.png` | Bitta yuqoriga chiqib, `images` papkasiga kirish |

`index.html` dan:

```html
<img src="images/logo.png" alt="Logo">
<link rel="stylesheet" href="css/style.css">
<a href="blog/birinchi-post.html">Blog</a>
```

`blog/birinchi-post.html` dan esa bitta yuqoriga chiqish kerak:

```html
<img src="../images/logo.png" alt="Logo"> <a href="../index.html">Bosh sahifa</a>
```

## Ildizdan boshlanuvchi yo‘l

`/` bilan boshlangan yo‘l saytning **ildiz** papkasidan hisoblanadi — fayl qaysi papkada bo‘lishidan qat’i nazar:

```html
<img src="/images/logo.png" alt="Logo">
```

## Mutlaq URL

To‘liq manzil — boshqa saytdagi resurs uchun:

```html
<img src="https://example.uz/images/logo.png" alt="Logo">
```

## Qaysi birini tanlash kerak?

Sayt ichidagi fayllar uchun **nisbiy yo‘llar** afzal: sayt boshqa domenga yoki kompyuterdan serverga ko‘chirilganda ham havolalar buzilmaydi.

## Ko‘p uchraydigan xatolar

- Registr: serverlarda `Logo.png` va `logo.png` — har xil fayllar.
- Windows uslubidagi teskari chiziq: `images\logo.png` emas, `images/logo.png`.
- Bo‘sh joyli fayl nomlari: `mening rasmim.png` o‘rniga `mening-rasmim.png`.

## Xulosa

- Nisbiy yo‘l joriy faylga nisbatan, `../` — bitta yuqori papka.
- `/` bilan boshlangan yo‘l — sayt ildizidan.
- Sayt ichidagi fayllar uchun nisbiy yo‘llardan foydalaning.
