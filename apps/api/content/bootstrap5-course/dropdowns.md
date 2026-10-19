## Dropdown

Bootstrap 5 da menyu bandlari yana ro‘yxat (`ul > li`) ko‘rinishida yoziladi va atributlar `data-bs-*`:

```html
<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
    Kurslar
  </button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">HTML</a></li>
    <li><a class="dropdown-item" href="#">CSS</a></li>
    <li><a class="dropdown-item" href="#">JavaScript</a></li>
  </ul>
</div>
```

Ochilganda `.dropdown-menu` ga `.show` qo‘shiladi, tugmaning `aria-expanded` qiymati `true` bo‘ladi. **Esc** va ↑ ↓ tugmalari ishlaydi.

## Menyu ichida

```html
<ul class="dropdown-menu">
  <li><h6 class="dropdown-header">Frontend</h6></li>
  <li><a class="dropdown-item active" href="#" aria-current="true">HTML</a></li>
  <li><a class="dropdown-item" href="#">CSS</a></li>
  <li><hr class="dropdown-divider"></li>
  <li><h6 class="dropdown-header">Backend</h6></li>
  <li><a class="dropdown-item disabled" aria-disabled="true">Python</a></li>
  <li><span class="dropdown-item-text">Oddiy matn</span></li>
</ul>
```

Ajratuvchi — `<hr class="dropdown-divider">`.

## Yo‘nalish

| Klass          | Ochilish yo‘nalishi |
| -------------- | ------------------- |
| `.dropdown`    | Pastga              |
| `.dropup`      | Yuqoriga            |
| `.dropend`     | O‘ngga (Bootstrap 4 dagi `dropright`) |
| `.dropstart`   | Chapga (`dropleft`) |
| `.dropdown-center` / `.dropup-center` | Tugma markaziga tekislangan (5.2) |

Menyuni tekislash: `.dropdown-menu-end` (Bootstrap 4 dagi `dropdown-menu-right`), ekranga qarab: `.dropdown-menu-lg-end`.

## Qorong‘i menyu

```html
<ul class="dropdown-menu dropdown-menu-dark">…</ul>
```

5.3 da buning o‘rniga ota elementga `data-bs-theme="dark"` berish tavsiya etiladi.

## Yopilish xatti-harakati

`data-bs-auto-close`:

| Qiymat     | Qachon yopiladi                       |
| ---------- | ------------------------------------- |
| `true`     | Ichkarida yoki tashqarida bosilganda (standart) |
| `inside`   | Faqat ichkarida bosilganda            |
| `outside`  | Faqat tashqarida bosilganda           |
| `false`    | Faqat tugma yoki kod bilan            |

Menyu ichida forma bo‘lsa `outside` qulay:

```html
<button class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside">Kirish</button>
<form class="dropdown-menu p-4">…</form>
```

## JavaScript orqali

```js
const dd = bootstrap.Dropdown.getOrCreateInstance(document.querySelector('#kursMenyu'));
dd.toggle();
```

## Xulosa

- `.dropdown` > `button.dropdown-toggle[data-bs-toggle="dropdown"]` + `ul.dropdown-menu` > `li` > `.dropdown-item`.
- Ajratuvchi — `hr.dropdown-divider`; yo‘nalish — `.dropup`, `.dropend`, `.dropstart`; tekislash — `.dropdown-menu-end`.
- `data-bs-auto-close` — yopilish qoidasi.
