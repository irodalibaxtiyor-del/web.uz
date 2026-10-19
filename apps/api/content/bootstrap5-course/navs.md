## Navs va yorliqlar

```html
<ul class="nav">
  <li class="nav-item"><a class="nav-link active" aria-current="page" href="#">Bosh sahifa</a></li>
  <li class="nav-item"><a class="nav-link" href="#">Kurslar</a></li>
  <li class="nav-item"><a class="nav-link disabled" aria-disabled="true">Arxiv</a></li>
</ul>
```

## Ko‘rinishlar

| Klass              | Natija                                    |
| ------------------ | ----------------------------------------- |
| `.nav-tabs`        | Yorliqlar                                 |
| `.nav-pills`       | Yumaloq tugmalar                          |
| `.nav-underline`   | Ostiga chizilgan (5.3 da yangi)           |
| `.nav-fill`        | Bandlar to‘liq kenglikni egallaydi        |
| `.nav-justified`   | Teng kenglikdagi bandlar                  |
| `.flex-column`     | Vertikal                                  |

```html
<ul class="nav nav-underline">…</ul>
```

## Dinamik yorliqlar

```html
<ul class="nav nav-tabs" id="kursYorliq" role="tablist">
  <li class="nav-item" role="presentation">
    <button class="nav-link active" id="tavsif-tab" data-bs-toggle="tab" data-bs-target="#tavsif"
            type="button" role="tab" aria-controls="tavsif" aria-selected="true">Tavsif</button>
  </li>
  <li class="nav-item" role="presentation">
    <button class="nav-link" id="dastur-tab" data-bs-toggle="tab" data-bs-target="#dastur"
            type="button" role="tab" aria-controls="dastur" aria-selected="false">Dastur</button>
  </li>
</ul>
<div class="tab-content">
  <div class="tab-pane fade show active" id="tavsif" role="tabpanel" aria-labelledby="tavsif-tab" tabindex="0">
    Kurs haqida.
  </div>
  <div class="tab-pane fade" id="dastur" role="tabpanel" aria-labelledby="dastur-tab" tabindex="0">
    8 modul, 49 dars.
  </div>
</div>
```

Bootstrap 5 hujjatlari yorliqlar uchun **`<button>`** ishlatishni tavsiya qiladi (havola emas) — chunki ular sahifaga o‘tmaydi, faqat panelni almashtiradi. Maqsad `data-bs-target` da.

- `data-bs-toggle="tab"` (pills uchun `"pill"`);
- `role="tab"` bo‘lsa plagin `aria-selected` ni o‘zi yangilaydi;
- ← → tugmalari bilan yorliqlar orasida yurish mumkin (5.3).

## Vertikal pills

```html
<div class="d-flex align-items-start">
  <div class="nav flex-column nav-pills me-3" role="tablist" aria-orientation="vertical">
    <button class="nav-link active" data-bs-toggle="pill" data-bs-target="#p1" type="button" role="tab">Profil</button>
    <button class="nav-link" data-bs-toggle="pill" data-bs-target="#p2" type="button" role="tab">Xabarlar</button>
  </div>
  <div class="tab-content">
    <div class="tab-pane fade show active" id="p1" role="tabpanel">…</div>
    <div class="tab-pane fade" id="p2" role="tabpanel">…</div>
  </div>
</div>
```

## JavaScript orqali

```js
const tab = bootstrap.Tab.getOrCreateInstance(document.querySelector('#dastur-tab'));
tab.show();
```

## Xulosa

- `.nav` > `.nav-item` > `.nav-link`; `.nav-tabs`, `.nav-pills`, `.nav-underline`.
- Dinamik: `button.nav-link[data-bs-toggle="tab"][data-bs-target]` + `.tab-content` > `.tab-pane.fade.show.active`.
- `role="tab"` — `aria-selected` avtomatik yangilanadi.
