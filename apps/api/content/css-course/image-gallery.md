## Rasmlar galereyasi

Galereya — bir xil o‘lchamdagi kartochkalar to‘ri: rasm va uning izohi.

## HTML

```html
<div class="galereya">
  <figure>
    <img src="tog.jpg" alt="Chimyon tog‘lari">
    <figcaption>Chimyon</figcaption>
  </figure>
  <figure>…</figure>
</div>
```

`<figure>` va `<figcaption>` rasmni izohi bilan ma’no jihatidan bog‘laydi.

## Grid bilan to‘r

```css
.galereya {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}
```

Bu bitta qator ko‘p ishni bajaradi: ekranga nechta 180px lik ustun sig‘sa, shuncha ustun hosil bo‘ladi va ular qolgan joyni teng bo‘lishadi. Media so‘rov kerak emas. Grid 14-modulda batafsil.

## Kartochka

```css
.galereya figure {
  margin: 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.galereya img {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}

.galereya figcaption {
  padding: 8px 12px;
  font-size: 0.875rem;
}
```

- `figure` ning standart marginini olib tashlaymiz.
- `overflow: hidden` rasmni yumaloq burchak bo‘ylab kesadi.
- `aspect-ratio: 4 / 3` hamma rasmlarni bir xil nisbatga keltiradi.
- `object-fit: cover` rasmni cho‘zmasdan, ortiqchasini kesib to‘ldiradi (12-modul).
- `display: block` rasm ostidagi kichik bo‘shliqni yo‘qotadi.

## Hover

```css
.galereya figure:hover {
  border-color: #0071dc;
}
```

## `alt` matni

Galereyadagi har bir rasmga ma’noli `alt` yozing. Agar izoh (`figcaption`) rasmni to‘liq tasvirlasa ham, `alt` rasmning **o‘zida** nima borligini aytadi.

## Xulosa

- `figure` + `figcaption` — rasm va izoh.
- `grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))` — moslashuvchan to‘r.
- `aspect-ratio` va `object-fit: cover` — bir xil o‘lchamdagi rasmlar.
