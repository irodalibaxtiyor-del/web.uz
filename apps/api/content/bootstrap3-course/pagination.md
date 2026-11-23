## Sahifalash (pagination)

Natijalar ko‘p bo‘lsa (kurslar ro‘yxati, qidiruv natijalari, maqolalar), ular sahifalarga bo‘linadi. Bootstrap’da sahifa raqamlari oddiy ro‘yxatdan yasaladi:

```html
<nav aria-label="Kurslar sahifalari">
  <ul class="pagination">
    <li><a href="#" aria-label="Oldingi"><span aria-hidden="true">&laquo;</span></a></li>
    <li><a href="#">1</a></li>
    <li class="active"><a href="#">2 <span class="sr-only">(joriy)</span></a></li>
    <li><a href="#">3</a></li>
    <li><a href="#" aria-label="Keyingi"><span aria-hidden="true">&raquo;</span></a></li>
  </ul>
</nav>
```

- `ul.pagination` — tugmachalar qatori;
- `<li class="active">` — joriy sahifa (ko‘k fon);
- `&laquo;` va `&raquo;` — « va » belgilari.

## Holatlar

| Klass       | Qachon                                        |
| ----------- | --------------------------------------------- |
| `.active`   | Hozir ochiq turgan sahifa                     |
| `.disabled` | Bosib bo‘lmaydigan band (masalan, birinchi sahifada “Oldingi”) |

```html
<li class="disabled"><span aria-hidden="true">&laquo;</span></li>
```

`.disabled` faqat ko‘rinishni o‘zgartiradi (kulrang, `not-allowed` kursor). Havolani haqiqatan o‘chirish uchun `<a>` o‘rniga `<span>` yozing.

## O‘lchamlar

```html
<ul class="pagination pagination-lg">...</ul>
<ul class="pagination">...</ul>
<ul class="pagination pagination-sm">...</ul>
```

## Yo‘l ko‘rsatkichi (breadcrumb)

Sahifalashga yaqin komponent — **breadcrumb**. U foydalanuvchi sayt ichida qayerda ekanini ko‘rsatadi:

```html
<ol class="breadcrumb">
  <li><a href="#">Bosh sahifa</a></li>
  <li><a href="#">Kurslar</a></li>
  <li class="active">Bootstrap 3</li>
</ol>
```

Bandlar orasidagi `/` belgisini Bootstrap o‘zi qo‘shadi.

## Foydalanish imkoniyati

- Sahifalashni `<nav aria-label="…">` ichiga oling — ekran o‘quvchi uni alohida navigatsiya sifatida e’lon qiladi.
- Faqat belgidan iborat havolaga (`«`) `aria-label="Oldingi"` bering.
- Joriy sahifaga `.sr-only` matn (“joriy”) yoki `aria-current="page"` qo‘shing.

```tekshir
Sahifalashda joriy sahifa bandiga qaysi klass beriladi?
+ `active`
- `current`
- `selected`
> O‘chirilgan band — `disabled`; ekran o‘quvchiga esa `aria-current` yoki `sr-only` matn.
```

```jonli
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
<div class="container" style="padding-top: 15px">
  <nav aria-label="Sahifalar">
    <ul class="pagination">
      <li class="disabled"><span>&laquo;</span></li>
      <li class="active"><span>1</span></li>
      <li><a href="#">2</a></li>
      <li><a href="#">3</a></li>
    </ul>
  </nav>
  <ol class="breadcrumb"><li><a href="#">Bosh</a></li><li class="active">Kurslar</li></ol>
</div>
```

## Xulosa

- `ul.pagination` > `li` > `a`; joriy sahifa — `.active`, o‘chirilgan — `.disabled`.
- O‘lcham: `.pagination-lg`, `.pagination-sm`.
- Yo‘l ko‘rsatkichi: `ol.breadcrumb`.
