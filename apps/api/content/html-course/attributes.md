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

## Xulosa

- Atributlar ochuvchi tegda `nom="qiymat"` shaklida yoziladi.
- `href`, `src`, `alt`, `width`, `height`, `style`, `lang`, `title` — eng kerakli atributlar.
- Rasmlarda `alt` majburiy deb hisoblang.
