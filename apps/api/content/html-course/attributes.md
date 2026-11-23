## Atribut nima?

**Atributlar** elementga qo‘shimcha ma’lumot beradi. Ular har doim **ochuvchi tegda** yoziladi va odatda `nom="qiymat"` ko‘rinishida bo‘ladi:

```html
<a href="https://uz.wikipedia.org" title="O‘zbekcha Vikipediya">Vikipediya</a>
```

Bu yerda `href` va `title` — atributlar.

## Eng ko‘p ishlatiladigan atributlar

### `href`

Havola qayerga olib borishini bildiradi:

```html
<a href="kontaktlar.html">Biz bilan bog‘lanish</a>
```

### `src`

Rasm, video yoki skript manzili:

```html
<img src="images/samarqand.jpg" alt="Registon maydoni">
```

### `alt`

Rasm yuklanmasa yoki ekran o‘qiydigan dastur (ko‘zi ojiz foydalanuvchilar uchun) ishlatilganda chiqadigan matn. **Har bir mazmunli rasmda `alt` bo‘lishi shart.**

### `width` va `height`

Rasmning piksellardagi o‘lchami. Ularni ko‘rsatish sahifa yuklanayotganda “sakrashlar”ning oldini oladi:

```html
<img src="logo.svg" alt="Logo" width="160" height="48">
```

### `style`

Elementga to‘g‘ridan-to‘g‘ri CSS uslub beradi:

```html
<p style="color: darkgreen;">Yashil matn</p>
```

### `lang`

Sahifa yoki element tilini bildiradi. Qidiruv tizimlari va ekran o‘qiydigan dasturlar uchun muhim:

```html
<html lang="uz"></html>
```

### `title`

Sichqoncha element ustida turganda chiqadigan qo‘shimcha ma’lumot:

```html
<abbr title="HyperText Markup Language">HTML</abbr>
```

## Yozish qoidalari

- Atribut nomlarini **kichik harflar** bilan yozing.
- Qiymatlarni **qo‘shtirnoqqa** oling. Tirnoqsiz yozish ba’zan ishlaydi, lekin bo‘sh joyli qiymatlarda xato beradi:

```html
<!-- Xato: title faqat "Toshkent" bo‘lib qoladi -->
<p title=Toshkent shahri>...</p>

<!-- To‘g‘ri -->
<p title="Toshkent shahri">...</p>
```

- Qiymat ichida qo‘shtirnoq bo‘lsa, tashqarisiga bittalik tirnoq qo‘ying: `title='"Alpomish" dostoni'`.

```tekshir
Atribut qayerga yoziladi?
+ ochuvchi tegning ichiga
- yopuvchi tegning ichiga
- teglar orasidagi matnga
> Atributlar har doim ochuvchi tegda `nom="qiymat"` ko‘rinishida beriladi.
```

```jonli
<p title="Sichqonchani ustiga olib keling">Ustiga olib keling</p>
<img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27200%27%20height=%27120%27%20viewBox=%270%200%20200%20120%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%230071dc%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23f5a623%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27200%27%20height=%27120%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27144%27%20cy=%2736%27%20r=%2719%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20120%20L0%2084%20L70%2054%20L120%2090%20L160%2072%20L200%2096%20L200%20120%20Z%27%20fill=%27%23123456%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E" alt="Tasodifiy rasm" width="200" height="120">
```

## Xulosa

- Atributlar ochuvchi tegda `nom="qiymat"` shaklida yoziladi.
- `href`, `src`, `alt`, `width`, `height`, `style`, `lang`, `title` — eng kerakli atributlar.
- Rasmlarda `alt` majburiy deb hisoblang.
