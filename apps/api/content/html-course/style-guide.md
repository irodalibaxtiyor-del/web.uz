## Nima uchun uslub qo‘llanmasi kerak?

Kodni faqat brauzer emas, odamlar ham o‘qiydi: siz bir oydan keyin, jamoadoshingiz, ustozingiz. Bir xil va toza yozilgan kod tushunarli, xatolari kam bo‘ladi.

## 1. Hujjat turini e’lon qiling

```html
<!DOCTYPE html>
```

## 2. Kichik harflar

Teg va atribut nomlari — kichik harflar bilan:

```html
<!-- Yaxshi -->
<section class="kurslar">

<!-- Yomon -->
<SECTION CLASS="kurslar">
```

## 3. Elementlarni yoping

```html
<!-- Yaxshi -->
<p>Birinchi paragraf.</p>
<p>Ikkinchi paragraf.</p>

<!-- Yomon (ishlaydi, lekin chalkash) -->
<p>Birinchi paragraf.
<p>Ikkinchi paragraf.
```

## 4. Atribut qiymatlarini tirnoqqa oling

```html
<a href="kurslar.html" class="havola asosiy">Kurslar</a>
```

## 5. Rasmlarda `alt`, `width`, `height`

```html
<img src="logo.png" alt="WEBDIZAYN.UZ logotipi" width="160" height="48">
```

## 6. Chekinish va bo‘sh joylar

- Ichma-ich elementlar uchun 2 ta bo‘sh joy chekinish.
- `=` atrofida bo‘sh joy qoldirmang: `class="x"`, `class = "x"` emas.
- Juda uzun qatorlardan qoching (taxminan 80–100 belgi).

```html
<ul>
  <li>HTML</li>
  <li>CSS</li>
</ul>
```

## 7. Til va kodirovka

```html
<html lang="uz">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Sahifa nomi</title>
  </head>
</html>
```

## 8. Fayl nomlari

- Kichik harflar, bo‘sh joysiz, so‘zlar chiziqcha bilan: `kurs-dasturi.html`, `asosiy-banner.jpg`.
- Bosh sahifa: `index.html`.

## 9. Izohlar — qisqa va foydali

```html
<!-- Aksiya bloki: 31-dekabrdan keyin o‘chirilsin -->
```

## 10. Tekshirish

Kodni W3C validatorida (validator.w3.org) tekshirib turish yaxshi odat — u yopilmagan teglar va noto‘g‘ri atributlarni topadi.

## Xulosa

Kichik harflar, yopilgan elementlar, tirnoqli atributlar, aniq chekinish, `alt` va `lang` — toza HTML’ning asosiy qoidalari. Ular kodingizni professional va oson qo‘llab-quvvatlanadigan qiladi.
