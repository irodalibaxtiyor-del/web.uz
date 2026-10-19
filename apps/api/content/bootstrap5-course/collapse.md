## Collapse

```html
<button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#batafsil"
        aria-expanded="false" aria-controls="batafsil">
  Batafsil
</button>

<div class="collapse" id="batafsil">
  <div class="card card-body">Kurs davomida 8 ta modul va har darsda amaliy mashq.</div>
</div>
```

- yashirin — `.collapse`, ochiq — `.collapse.show`;
- havola bilan: `<a data-bs-toggle="collapse" href="#batafsil" role="button">`.

## Gorizontal collapse

5.2 dan blok balandlik emas, **kenglik** bo‘yicha ochilishi mumkin:

```html
<div class="collapse collapse-horizontal" id="yon">
  <div class="card card-body" style="width: 300px;">Yon panel</div>
</div>
```

## Accordion komponenti

Bootstrap 5 da akkordeon alohida komponentga aylandi — strelka, chegara va ranglar tayyor:

```html
<div class="accordion" id="faq">
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button" type="button" data-bs-toggle="collapse"
              data-bs-target="#javob1" aria-expanded="true" aria-controls="javob1">
        Kurs qancha davom etadi?
      </button>
    </h2>
    <div id="javob1" class="accordion-collapse collapse show" data-bs-parent="#faq">
      <div class="accordion-body">Uch oy, haftasiga uch dars.</div>
    </div>
  </div>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
              data-bs-target="#javob2" aria-expanded="false" aria-controls="javob2">
        Sertifikat beriladimi?
      </button>
    </h2>
    <div id="javob2" class="accordion-collapse collapse" data-bs-parent="#faq">
      <div class="accordion-body">Ha, yakuniy loyihadan keyin.</div>
    </div>
  </div>
</div>
```

| Klass                 | Vazifasi                                        |
| --------------------- | ----------------------------------------------- |
| `.accordion`          | O‘ram                                           |
| `.accordion-item`     | Bitta bo‘lim                                    |
| `.accordion-header`   | Sarlavha (`h2` va h.k.)                         |
| `.accordion-button`   | Bosiladigan sarlavha, strelka bilan; yopiq bo‘lsa `.collapsed` |
| `.accordion-collapse` | Ochiladigan qism                                |
| `.accordion-body`     | Ichki kontent                                   |

- `data-bs-parent="#faq"` — bir vaqtda faqat bitta bo‘lim ochiq. Uni olib tashlasangiz, bo‘limlar mustaqil ochiladi (“always open”).
- `.accordion-flush` — tashqi chegara va fonsiz variant.

## JavaScript orqali

```js
const c = bootstrap.Collapse.getOrCreateInstance('#batafsil', { toggle: false });
c.show();
document.getElementById('batafsil').addEventListener('shown.bs.collapse', () => {
  console.log('Ochildi');
});
```

## Xulosa

- `.collapse` / `.collapse.show` + `data-bs-toggle="collapse"` + `data-bs-target`.
- `.collapse-horizontal` — kenglik bo‘yicha.
- Akkordeon: `.accordion` > `.accordion-item` > `.accordion-header` > `.accordion-button` + `.accordion-collapse[data-bs-parent]` > `.accordion-body`.
