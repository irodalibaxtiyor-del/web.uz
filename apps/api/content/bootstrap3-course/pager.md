## Pager nima?

**Pager** — faqat “Oldingi” va “Keyingi” havolalaridan iborat oddiy sahifalash. Sahifa raqamlari kerak bo‘lmaganda ishlatiladi: blog maqolalari, dars sahifalari, rasm galereyasi.

```html
<nav aria-label="Darslar">
  <ul class="pager">
    <li><a href="#">Oldingi</a></li>
    <li><a href="#">Keyingi</a></li>
  </ul>
</nav>
```

Standart holatda ikkala havola **markazda**, yonma-yon turadi va kuchli yumaloq (“pill”) shaklida bo‘ladi.

## Chetlarga tekislash

Havolalarni sahifaning chap va o‘ng chetiga surish uchun `.previous` va `.next`:

```html
<ul class="pager">
  <li class="previous"><a href="#"><span aria-hidden="true">&larr;</span> Oldingi dars</a></li>
  <li class="next"><a href="#">Keyingi dars <span aria-hidden="true">&rarr;</span></a></li>
</ul>
```

- `.previous` — chap chekka (`float: left`);
- `.next` — o‘ng chekka (`float: right`);
- `&larr;` ← va `&rarr;` → strelkalari.

## O‘chirilgan holat

Birinchi darsda “Oldingi” havolasi kerak emas — uni o‘chiring:

```html
<li class="previous disabled"><a href="#">&larr; Oldingi</a></li>
```

## Pagination yoki pager?

| Komponent     | Qachon                                              |
| ------------- | --------------------------------------------------- |
| `.pagination` | Sahifalar ko‘p, foydalanuvchi istalgan sahifaga o‘tishi kerak |
| `.pager`      | Ketma-ket o‘qiladigan kontent: oldingi/keyingi yetarli |

> Bootstrap 4 da `.pager` olib tashlangan. Uning o‘rniga oddiy tugmalar yoki `.pagination` ishlatiladi.

## Amaliy maslahat

Havola matnida qayerga o‘tilishini yozing: “Keyingi dars: Jadvallar” — “Keyingi” dan aniqroq. Ayniqsa ekran o‘quvchi havolalar ro‘yxatini o‘qiganda bu muhim.

## Xulosa

- `ul.pager` — oddiy “Oldingi / Keyingi”.
- `.previous` va `.next` — havolalarni chetlarga suradi.
- `.disabled` — bosib bo‘lmaydigan holat.
