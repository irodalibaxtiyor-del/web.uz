## Asosiy qurilish bloklari

Bu darsda eng ko‘p ishlatiladigan teglarni qisqa misollar bilan ko‘rib chiqamiz. Keyingi darslarda ularning har biri batafsil o‘rganiladi.

## Hujjat turi

Har bir HTML hujjat birinchi qatorda hujjat turini e’lon qiladi:

```html
<!DOCTYPE html>
```

U registrga sezgir emas, lekin odatda aynan shunday yoziladi.

## Sarlavhalar

Sarlavhalar `<h1>` dan `<h6>` gacha bo‘ladi. `<h1>` eng muhim, `<h6>` eng kichik:

```html
<h1>Kurs nomi</h1>
<h2>Bo‘lim</h2>
<h3>Mavzu</h3>
```

## Paragraflar

```html
<p>HTML — veb-sahifaning skeleti.</p>
<p>CSS esa uning kiyimi.</p>
```

## Havolalar

Havola `<a>` tegi bilan yaratiladi, manzil esa `href` atributida yoziladi:

```html
<a href="https://developer.mozilla.org">MDN hujjatlari</a>
```

## Rasmlar

Rasm `<img>` tegi bilan qo‘shiladi. `src` — rasm manzili, `alt` — rasm ko‘rinmasa chiqadigan matn, `width` va `height` — o‘lchamlar:

```html
<img src="logo.png" alt="Sayt logotipi" width="120" height="40">
```

`<img>` — **bo‘sh element**: uning yopuvchi tegi yo‘q.

## Tugmalar

```html
<button>Yuborish</button>
```

## Ro‘yxatlar

```html
<ul>
  <li>HTML</li>
  <li>CSS</li>
</ul>
```

## Sahifa kodini qanday ko‘rish mumkin?

Istalgan saytda:

- **Ctrl + U** — sahifaning asl HTML kodi;
- sichqonchaning o‘ng tugmasi → **Inspect** (Tekshirish) yoki **F12** — dasturchi vositalari. Bu yerda elementlarni jonli ravishda o‘zgartirib ko‘rish mumkin.

Boshqa saytlarning kodini ko‘rish — o‘rganishning juda yaxshi usuli.

## Xulosa

- Sarlavha — `<h1>`…`<h6>`, paragraf — `<p>`, havola — `<a href>`, rasm — `<img src alt>`.
- Ba’zi elementlar (masalan, `<img>`) yopuvchi tegsiz yoziladi.
- Dasturchi vositalari (F12) sahifa tuzilishini o‘rganishga yordam beradi.
