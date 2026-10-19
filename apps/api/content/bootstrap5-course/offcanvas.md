## Offcanvas

**Offcanvas** — ekran chetidan siljib chiqadigan yon panel. Bootstrap 5 da yangi komponent: mobil menyu, filtrlar, savatcha, sozlamalar uchun qulay.

```html
<button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#filtr"
        aria-controls="filtr">
  Filtrlar
</button>

<div class="offcanvas offcanvas-start" tabindex="-1" id="filtr" aria-labelledby="filtrSarlavha">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="filtrSarlavha">Filtrlar</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Yopish"></button>
  </div>
  <div class="offcanvas-body">
    <p>Kurs darajasi, narxi va davomiyligi bo‘yicha saralang.</p>
  </div>
</div>
```

| Qism / atribut              | Vazifasi                                   |
| --------------------------- | ------------------------------------------ |
| `.offcanvas`                | Panel (boshida ekrandan tashqarida)        |
| `.offcanvas-start` / `-end` / `-top` / `-bottom` | Qaysi chetdan chiqadi |
| `.offcanvas-header`, `.offcanvas-title`, `.offcanvas-body` | Qismlar  |
| `data-bs-toggle="offcanvas"` + `data-bs-target` | Ochuvchi tugma       |
| `data-bs-dismiss="offcanvas"` | Yopuvchi tugma                           |

Ochilganda panelga `.show` qo‘shiladi va u `transform` bilan ekranga siljiydi. Orqa fon qorayadi (backdrop), **Esc** yoki fonga bosish yopadi.

## Sozlamalar

| Atribut                    | Natija                                           |
| -------------------------- | ------------------------------------------------ |
| `data-bs-scroll="true"`    | Panel ochiqligida sahifani aylantirish mumkin    |
| `data-bs-backdrop="false"` | Orqa fon qoraymaydi                              |
| `data-bs-backdrop="static"`| Fonga bosilganda yopilmaydi                      |

## Moslashuvchan offcanvas

`.offcanvas-lg` — `lg` dan **kichik** ekranda offcanvas, katta ekranda oddiy blok bo‘lib ko‘rinadi:

```html
<button class="btn btn-primary d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#yon">Menyu</button>

<div class="offcanvas-lg offcanvas-start" tabindex="-1" id="yon">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title">Kategoriyalar</h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#yon" aria-label="Yopish"></button>
  </div>
  <div class="offcanvas-body">…</div>
</div>
```

Telefonda tugma va yon panel, kompyuterda doim ko‘rinib turadigan yon ustun — bitta HTML bilan.

## Navbar bilan

```html
<nav class="navbar bg-body-tertiary fixed-top">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">WEBDIZAYN</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#menyu" aria-label="Menyu">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="offcanvas offcanvas-end" tabindex="-1" id="menyu">…</div>
  </div>
</nav>
```

## JavaScript orqali

```js
const panel = bootstrap.Offcanvas.getOrCreateInstance('#filtr');
panel.show();
document.getElementById('filtr').addEventListener('hidden.bs.offcanvas', () => { /* … */ });
```

## Offcanvas, modal yoki collapse?

| Komponent | Qachon                                              |
| --------- | --------------------------------------------------- |
| Offcanvas | Yon tomondagi qo‘shimcha kontent (menyu, filtr)     |
| Modal     | Diqqat talab qiladigan dialog (tasdiq, forma)       |
| Collapse  | Sahifa ichida joyida ochiladigan blok               |

## Xulosa

- `.offcanvas.offcanvas-start|end|top|bottom` > header (`.offcanvas-title`, `.btn-close`) + body.
- `data-bs-toggle="offcanvas"` + `data-bs-target`; yopish — `data-bs-dismiss="offcanvas"`; ochilganda `.show`.
- `.offcanvas-lg` — faqat kichik ekranda offcanvas.
