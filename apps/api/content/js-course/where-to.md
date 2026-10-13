## JavaScript qayerga yoziladi?

JavaScript HTML sahifaga `<script>` tegi orqali qo‘shiladi. Uchta usul bor.

## 1. Sahifa ichida (`<script>` blok)

```html
<body>
  <p id="holat">Kutilmoqda...</p>

  <script>
    document.getElementById('holat').textContent = 'Skript ishladi';
  </script>
</body>
```

Bitta sahifadagi kichik kod uchun qulay.

## 2. Tashqi faylda

Kod alohida `.js` faylga yoziladi va `src` atributi bilan ulanadi:

```html
<script src="script.js"></script>
```

`script.js` faylida `<script>` tegi **yozilmaydi** — faqat JavaScript kodi:

```js
document.getElementById('holat').textContent = 'Skript ishladi';
```

Afzalliklari:

- HTML va JavaScript ajratiladi — ikkalasini o‘qish oson;
- bitta faylni ko‘p sahifa ishlatadi;
- brauzer faylni keshlaydi — keyingi sahifalar tezroq ochiladi.

## Tartib muhim

Brauzer HTML’ni **yuqoridan pastga** o‘qiydi va `<script>` ga yetganda uni darhol bajaradi. Agar skript `<head>` da bo‘lsa, `<body>` dagi elementlar hali **yo‘q**:

```html
<head>
  <script>
    // XATO: #holat hali yaratilmagan, getElementById null qaytaradi
    document.getElementById('holat').textContent = 'Salom';
  </script>
</head>
<body>
  <p id="holat"></p>
</body>
```

Konsolda: `TypeError: Cannot set properties of null`.

Ikki to‘g‘ri yo‘l bor.

### `<body>` oxiriga qo‘yish

```html
<body>
  <p id="holat"></p>
  <script src="script.js"></script>
</body>
```

### `defer` bilan `<head>` da ulash

```html
<head>
  <script src="ilova.js" defer></script>
</head>
```

`defer` — “sahifa to‘liq o‘qilgandan keyin bajar” degani. Skript erta yuklanadi, lekin elementlar tayyor bo‘lgach ishlaydi. `defer` faqat **tashqi** skriptlarda (`src` bilan) ishlaydi.

## Bir nechta skript

```html
<script src="yordamchi.js"></script>
<script src="script.js"></script>
```

Ular **yozilgan tartibda** bajariladi: `yordamchi.js` dagi funksiyalarni `script.js` ishlata oladi.

> Bu kursdagi mashqlarda `script.js` allaqachon `<body>` oxirida ulangan. Kodingizni shu faylga yozing.
