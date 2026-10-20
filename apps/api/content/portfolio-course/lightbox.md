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
