## Media object

**Media object** — chapda (yoki o‘ngda) rasm, yonida matn turadigan blok. Izohlar, sharhlar, xabarlar, yangiliklar lentasi aynan shunday tuzilgan.

```html
<div class="media">
  <div class="media-left">
    <img src="avatar.png" class="media-object" alt="Aziza" width="64" height="64">
  </div>
  <div class="media-body">
    <h4 class="media-heading">Aziza Karimova <small>2 soat oldin</small></h4>
    <p>Setka darsi juda tushunarli bo‘ldi, rahmat!</p>
  </div>
</div>
```

| Qism              | Vazifasi                                      |
| ----------------- | --------------------------------------------- |
| `.media`          | Tashqi blok                                    |
| `.media-left`     | Rasm chapda (`.media-right` — o‘ngda)         |
| `.media-object`   | Rasm (`display: block`)                        |
| `.media-body`     | Matn qismi, qolgan kenglikni egallaydi         |
| `.media-heading`  | Sarlavha (pastki bo‘shliq kamaytirilgan)       |

`.media-left` va `.media-body` jadval kataklari (`display: table-cell`) kabi ishlaydi — shuning uchun matn rasm ostiga tushmaydi.

## Rasmni vertikal tekislash

```html
<div class="media-left media-middle">...</div>  <!-- markazda -->
<div class="media-left media-bottom">...</div>  <!-- pastda -->
```

Standart holat — `.media-top` (yuqorida).

## Ichma-ich media (javoblar)

Javob izohi asosiy izohning `.media-body` ichiga joylanadi:

```html
<div class="media">
  <div class="media-left"><img class="media-object" src="a.png" alt="Aziza" width="64"></div>
  <div class="media-body">
    <h4 class="media-heading">Aziza</h4>
    <p>Grid’da offset qanday ishlaydi?</p>

    <div class="media">
      <div class="media-left"><img class="media-object" src="b.png" alt="O‘qituvchi" width="48"></div>
      <div class="media-body">
        <h4 class="media-heading">O‘qituvchi</h4>
        <p>Offset ustunni o‘ngga suradi — 7-modulda batafsil.</p>
      </div>
    </div>
  </div>
</div>
```

## Ro‘yxat ko‘rinishida

Bir nechta media’ni ro‘yxat sifatida yozish ham mumkin:

```html
<ul class="media-list">
  <li class="media">...</li>
  <li class="media">...</li>
</ul>
```

## Xulosa

- `.media` > `.media-left` (`img.media-object`) + `.media-body` (`.media-heading`).
- O‘ngdagi rasm — `.media-right`; vertikal tekislash — `.media-middle`, `.media-bottom`.
- Javoblar — ichma-ich `.media`.
