## Bootstrap Icons

Bootstrap’ning o‘z ikonkalar to‘plami — **Bootstrap Icons**: 2000 dan ortiq bepul (MIT) SVG ikonka. Ular Bootstrap 5 bilan bir xil uslubda chizilgan, lekin alohida ulanadi.

## Ulash (shrift sifatida)

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
```

```html
<i class="bi bi-house" aria-hidden="true"></i>
<i class="bi bi-heart-fill text-danger" aria-hidden="true"></i>
<i class="bi bi-gear fs-3" aria-hidden="true"></i>
```

- `.bi` + `.bi-{nomi}`; to‘ldirilgan variant — `-fill`;
- rang — `text-*` yoki `color`, o‘lcham — `fs-*` yoki `font-size`.

## Tugma, input group va alertda

```html
<button type="button" class="btn btn-primary">
  <i class="bi bi-download" aria-hidden="true"></i> Yuklab olish
</button>

<div class="input-group">
  <span class="input-group-text"><i class="bi bi-search" aria-hidden="true"></i></span>
  <input type="search" class="form-control" placeholder="Qidiruv" aria-label="Qidiruv">
</div>

<div class="alert alert-success d-flex align-items-center gap-2" role="alert">
  <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
  <div>Saqlandi!</div>
</div>
```

## Faqat ikonkali tugma

```html
<button type="button" class="btn btn-outline-secondary" aria-label="Sozlamalar">
  <i class="bi bi-gear" aria-hidden="true"></i>
</button>
```

Ikonkaning o‘zi ekran o‘quvchiga hech narsa demaydi — tugmaga `aria-label` (yoki ichida `.visually-hidden` matn) **shart**.

## SVG sifatida

Tashqi fayl yuklamaslik uchun ikonkaning SVG kodini to‘g‘ridan-to‘g‘ri qo‘yish mumkin (Bootstrap Icons saytidan nusxa olinadi):

```html
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
     class="bi bi-star-fill" viewBox="0 0 16 16" aria-hidden="true">
  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
</svg>
```

`fill="currentColor"` — ikonka matn rangini oladi, shuning uchun `text-warning` kabi klasslar ishlaydi.

| Usul    | Afzalligi                          | Kamchiligi                         |
| ------- | ---------------------------------- | ---------------------------------- |
| Shrift  | Oson: bitta `<link>` va klass      | Butun shrift fayli yuklanadi       |
| SVG     | Faqat kerakli ikonka, aniq chizilgan | HTML uzunroq                     |

## Foydalanish imkoniyati — xulosa

| Holat                               | Nima qilish kerak                             |
| ----------------------------------- | --------------------------------------------- |
| Ikonka matn yonida (bezak)          | `aria-hidden="true"`                          |
| Faqat ikonka tugmada/havolada       | Tugmaga `aria-label`                          |
| Ikonka ma’lumot beradi (✓ bajarildi) | Yonida `<span class="visually-hidden">Bajarildi</span>` |

## Xulosa

- Bootstrap Icons alohida ulanadi: `bootstrap-icons.min.css` yoki SVG.
- `<i class="bi bi-NOMI" aria-hidden="true"></i>`; rang — `text-*`, o‘lcham — `fs-*`.
- Faqat ikonkali tugmaga `aria-label`.
