## Lightbox

Galereyadagi kichik rasmni bosganda katta variantini ko‘rsatish — **lightbox**. Ilgari buning uchun jQuery plaginlari ishlatilardi; bugun `<dialog>` elementi ishning asosiy qismini o‘zi bajaradi.

## HTML

```html
<button type="button" class="kichik" data-katta="kafe-katta.webp">
  <img src="kafe-kichik.webp" alt="Kafe sayti" width="300" height="225" />
</button>

<dialog class="lightbox" aria-label="Rasmni kattalashtirib ko‘rish">
  <img src="" alt="" />
  <button type="button" class="yopish" aria-label="Yopish">…</button>
</dialog>
```

Kichik rasm `<button>` ichida — bu “amal” (oynani ochish), havola emas. Tugma klaviatura bilan ham ishlaydi.

## JavaScript

```js
const oyna = document.querySelector('.lightbox');
const kattaRasm = oyna.querySelector('img');

document.querySelectorAll('.kichik').forEach((tugma) => {
  tugma.addEventListener('click', () => {
    kattaRasm.src = tugma.dataset.katta;
    kattaRasm.alt = tugma.querySelector('img').alt;
    oyna.showModal();
  });
});

oyna.querySelector('.yopish').addEventListener('click', () => oyna.close());
```

`showModal()`:

- Esc bilan yopiladi;
- fokus oyna ichida qoladi, yopilganda bosilgan tugmaga qaytadi;
- orqadagi sahifa bosilmaydi.

Katta rasmning `alt` i kichik rasmnikidan olinadi — ekran o‘quvchi nima ochilganini biladi.

## CSS

```css
.lightbox {
  padding: 0;
  border: 0;
  background: transparent;
}

.lightbox::backdrop {
  background-color: rgb(0 0 0 / 0.8);
}

.lightbox img {
  max-width: min(90vw, 1000px);
  max-height: 85vh;
  height: auto;
}
```

## Fonni bosib yopish

```js
oyna.addEventListener('click', (e) => {
  if (e.target === oyna) oyna.close();
});
```

`<dialog>` elementining o‘zi bosilsa (rasm yoki tugma emas) — bu fon.

## Katta rasm faqat kerak bo‘lganda

Katta faylning manzili `data-katta` da saqlanadi va faqat bosilganda yuklanadi. Agar katta rasmlar oldindan `<img>` sifatida sahifada tursa, sahifa ochilganda ularning hammasi yuklanadi.

Mashqda galereya uchun `<dialog>` asosidagi lightbox yasaysiz.

```tekshir
Lightbox uchun qaysi HTML elementi qulay, chunki Esc va fokusni o‘zi boshqaradi?
+ `<dialog>` va `showModal()`
- oddiy `<div>` va `z-index`
- `<iframe>`
> `showModal()` fonni bloklaydi va Esc bilan yopiladi.
```

```jonli
<style>
  dialog { border: 0; padding: 0; border-radius: 10px; }
  dialog::backdrop { background: rgb(0 0 0 / .7); }
  dialog img { display: block; max-width: 80vw; height: auto; }
</style>
<button id="o"><img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27160%27%20height=%27100%27%3E%3Crect%20width=%27160%27%20height=%27100%27%20fill=%27%23f5a623%27/%3E%3Ccircle%20cx=%27112%27%20cy=%2735%27%20r=%2715%27%20fill=%27%23fff%27/%3E%3C/svg%3E" alt="Loyiha skrinshotini kattalashtirish" width="160" height="100"></button>
<dialog id="d"><img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27640%27%20height=%27400%27%3E%3Crect%20width=%27640%27%20height=%27400%27%20fill=%27%23f5a623%27/%3E%3Ccircle%20cx=%27448%27%20cy=%27140%27%20r=%2760%27%20fill=%27%23fff%27/%3E%3C/svg%3E" alt="Loyiha skrinshoti" width="640" height="400"><form method="dialog" style="padding: 8px; text-align: right"><button>Yopish</button></form></dialog>
<script>
  const d = document.getElementById('d');
  document.getElementById('o').onclick = () => d.showModal();
  d.onclick = (e) => { if (e.target === d) d.close(); };
</script>
```
