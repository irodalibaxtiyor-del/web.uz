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

```tekshir
Galereyadagi har xil o‘lchamli rasmlar bir xil kvadrat ko‘rinishi uchun qaysi ikkitasi?
+ `aspect-ratio: 1`
+ `object-fit: cover`
- `float: left`
- `height: auto`
> Nisbat ramkani beradi, `cover` rasmni cho‘zmasdan to‘ldiradi.
```

```jonli
<style>
  .g { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 6px; }
  .g img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
</style>
<div class="g"><img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27300%27%20height=%27200%27%20viewBox=%270%200%20300%20200%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%23c0392b%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23f1c40f%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27300%27%20height=%27200%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27216%27%20cy=%2760%27%20r=%2732%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20200%20L0%20140%20L105%2090%20L180%20150%20L240%20120%20L300%20160%20L300%20200%20Z%27%20fill=%27%233b1a14%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E" alt=""><img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27200%27%20height=%27300%27%20viewBox=%270%200%20200%20300%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%2316a085%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23a8e6ff%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27200%27%20height=%27300%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27144%27%20cy=%2790%27%20r=%2732%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20300%20L0%20210%20L70%20135%20L120%20225%20L160%20180%20L200%20240%20L200%20300%20Z%27%20fill=%27%230b3b33%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E" alt=""><img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27400%27%20height=%27200%27%20viewBox=%270%200%20400%20200%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%230071dc%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23f5a623%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27400%27%20height=%27200%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27288%27%20cy=%2760%27%20r=%2732%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20200%20L0%20140%20L140%2090%20L240%20150%20L320%20120%20L400%20160%20L400%20200%20Z%27%20fill=%27%23123456%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E" alt=""><img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27250%27%20height=%27250%27%20viewBox=%270%200%20250%20250%27%3E%3Cdefs%3E%3ClinearGradient%20id=%27g%27%20x1=%270%27%20y1=%270%27%20x2=%271%27%20y2=%271%27%3E%3Cstop%20offset=%270%27%20stop-color=%27%232e8b57%27/%3E%3Cstop%20offset=%271%27%20stop-color=%27%23ffe08a%27/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width=%27250%27%20height=%27250%27%20fill=%27url(%23g)%27/%3E%3Ccircle%20cx=%27180%27%20cy=%2775%27%20r=%2740%27%20fill=%27%23fff%27%20fill-opacity=%27.75%27/%3E%3Cpath%20d=%27M0%20250%20L0%20175%20L88%20113%20L150%20188%20L200%20150%20L250%20200%20L250%20250%20Z%27%20fill=%27%231b3a2b%27%20fill-opacity=%27.8%27/%3E%3C/svg%3E" alt=""></div>
```

## Xulosa

- `figure` + `figcaption` — rasm va izoh.
- `grid-template-columns: repeat(auto-fill, minmax(180px, 1fr))` — moslashuvchan to‘r.
- `aspect-ratio` va `object-fit: cover` — bir xil o‘lchamdagi rasmlar.
