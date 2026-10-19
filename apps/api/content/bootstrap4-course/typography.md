## Bootstrap 4 tipografiyasi

Bootstrap 4 da asosiy shrift o‘lchami **16px** (`1rem`), qatorlar orasi `1.5`. Shrift — foydalanuvchi qurilmasining tizim shrifti: Windows’da Segoe UI, macOS’da San Francisco, Android’da Roboto. Shuning uchun matn har bir qurilmada “o‘ziga xos” va tez yuklanadi.

| Teg  | O‘lcham        |
| ---- | -------------- |
| `h1` | 2.5rem (40px)  |
| `h2` | 2rem (32px)    |
| `h3` | 1.75rem (28px) |
| `h4` | 1.5rem (24px)  |
| `h5` | 1.25rem (20px) |
| `h6` | 1rem (16px)    |

`rem` — `html` elementining shrift o‘lchamiga nisbatan birlik. Foydalanuvchi brauzerda shriftni kattalashtirsa, butun sahifa mutanosib kattalashadi.

## Display sarlavhalar

Oddiy sarlavhalardan **kattaroq** va **yengilroq** sarlavha — bosh sahifa yoki banner uchun:

```html
<h1 class="display-1">Display 1</h1>  <!-- 6rem -->
<h1 class="display-2">Display 2</h1>  <!-- 5.5rem -->
<h1 class="display-3">Display 3</h1>  <!-- 4.5rem -->
<h1 class="display-4">Display 4</h1>  <!-- 3.5rem -->
```

## Ikkilamchi matn

```html
<h2>Kurslar <small class="text-muted">kuzgi mavsum</small></h2>
```

Bootstrap 4 da `<small>` o‘zi kulrang bo‘lmaydi — `.text-muted` qo‘shiladi.

## Matnni ajratish

```html
<p class="lead">Kirish paragrafi.</p>
<p>Bu <mark>belgilangan</mark> so‘z.</p>
<p><abbr title="Cascading Style Sheets" class="initialism">CSS</abbr></p>
<p><code>&lt;div&gt;</code>, <kbd>Ctrl + C</kbd></p>
```

## Iqtibos

Bootstrap 4 da iqtibosga klass beriladi:

```html
<blockquote class="blockquote">
  <p class="mb-0">Ilm olish — beshikdan qabrgacha.</p>
  <footer class="blockquote-footer">Xalq maqoli</footer>
</blockquote>
```

O‘ngga tekislash: `<blockquote class="blockquote text-right">`.

## Matn utilitalari

| Klass                                   | Natija                        |
| --------------------------------------- | ----------------------------- |
| `.text-left`, `.text-center`, `.text-right` | Tekislash                 |
| `.text-md-center`                       | Faqat `md` dan katta ekranda markazda |
| `.text-uppercase`, `.text-lowercase`, `.text-capitalize` | Registr      |
| `.font-weight-bold`, `.font-weight-light`, `.font-italic` | Qalinlik va kursiv |
| `.text-truncate`                        | Sig‘magan matn `…` bilan qisqaradi |
| `.text-nowrap`                          | Qator uzilmaydi               |

## Ro‘yxatlar

```html
<ul class="list-unstyled">…</ul>

<ul class="list-inline">
  <li class="list-inline-item">HTML</li>
  <li class="list-inline-item">CSS</li>
</ul>
```

Bootstrap 4 da qatorli ro‘yxatning har bir bandiga `.list-inline-item` beriladi.

## Xulosa

- Asosiy o‘lcham 16px, sarlavhalar `rem` da.
- Katta sarlavhalar: `.display-1` … `.display-4`.
- Iqtibos: `.blockquote` + `.blockquote-footer`.
- Matn utilitalari: tekislash, registr, qalinlik, `.text-truncate`.
