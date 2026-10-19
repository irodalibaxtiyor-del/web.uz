## Bootstrap tipografiyasi

Bootstrap ulangan zahoti matn ko‘rinishi o‘zgaradi:

- shrift: `"Helvetica Neue", Helvetica, Arial, sans-serif`;
- asosiy o‘lcham: **14px**, qatorlar orasi `1.428` (≈ 20px);
- paragraflar pastida 10px bo‘sh joy;
- sarlavhalar (`h1`–`h6`) qalin, aniq o‘lchamlarda.

| Teg  | O‘lcham |
| ---- | ------- |
| `h1` | 36px    |
| `h2` | 30px    |
| `h3` | 24px    |
| `h4` | 18px    |
| `h5` | 14px    |
| `h6` | 12px    |

Sarlavha ko‘rinishini boshqa tegga ham berish mumkin: `<p class="h3">` — paragraf, lekin `h3` kabi ko‘rinadi.

## Sarlavhadagi ikkilamchi matn

`<small>` sarlavha ichida ochroq va kichikroq matn hosil qiladi:

```html
<h1>Kitoblar <small>yangi kelganlar</small></h1>
```

## Ajratib ko‘rsatish

```html
<p class="lead">Kirish paragrafi — kattaroq va yengilroq shrift.</p>
<p>Bu so‘z <mark>belgilangan</mark>.</p>
<p><abbr title="HyperText Markup Language">HTML</abbr> — belgilash tili.</p>
<p><code>&lt;section&gt;</code> — kod parchasi.</p>
<p>Saqlash: <kbd>Ctrl + S</kbd></p>
```

- `.lead` — matn boshidagi muhim paragraf;
- `<mark>` — sariq fon bilan belgilash;
- `<abbr>` — qisqartma (sichqoncha olib borilganda to‘liq nomi);
- `<code>` — qator ichidagi kod, `<kbd>` — klaviatura tugmasi, `<pre>` — kod bloki.

## Iqtibos

```html
<blockquote>
  <p>Bilim — eng katta boylik.</p>
  <footer>Xalq maqoli</footer>
</blockquote>
<blockquote class="blockquote-reverse">
  <p>O‘ng tomonda tekislangan iqtibos.</p>
</blockquote>
```

## Matn klasslari

**Tekislash:** `.text-left`, `.text-center`, `.text-right`, `.text-justify`, `.text-nowrap`.

**Harf registri:** `.text-lowercase`, `.text-uppercase`, `.text-capitalize`.

**Rang (kontekstli):**

| Klass           | Ma’nosi               |
| --------------- | --------------------- |
| `.text-muted`   | Kulrang, ikkinchi darajali |
| `.text-primary` | Asosiy (ko‘k)         |
| `.text-success` | Muvaffaqiyat (yashil) |
| `.text-info`    | Ma’lumot (moviy)      |
| `.text-warning` | Ogohlantirish (sariq-jigarrang) |
| `.text-danger`  | Xavf (qizil)          |

**Fon:** `.bg-primary`, `.bg-success`, `.bg-info`, `.bg-warning`, `.bg-danger`.

> Rang faqat bezak. Muhim ma’noni (masalan, “xato”) so‘z bilan ham yozing — rangni ko‘ra olmaydigan foydalanuvchilar ham tushunsin.

## Ro‘yxatlar

```html
<ul class="list-unstyled">  <!-- nuqtalarsiz, chap bo‘shliqsiz -->
  <li>Birinchi</li>
  <li>Ikkinchi</li>
</ul>

<ul class="list-inline">    <!-- bir qatorda -->
  <li>Bosh sahifa</li>
  <li>Kurslar</li>
</ul>
```

Ta’riflar ro‘yxati `<dl class="dl-horizontal">` bilan ikki ustunli bo‘ladi (keng ekranda).

## Xulosa

- Bootstrap asosiy shrift o‘lchami 14px; sarlavhalar 36px dan 12px gacha.
- `.lead`, `<small>`, `<mark>`, `<abbr>`, `<code>`, `<kbd>` — matnni ajratish uchun.
- `.text-center`, `.text-uppercase`, `.text-danger` kabi klasslar — tekislash, registr va rang.
- `.list-unstyled` va `.list-inline` — ro‘yxat ko‘rinishi.
