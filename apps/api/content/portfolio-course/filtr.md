## Ko‘p loyiha — filtr kerak

Loyihalar 6 tadan ko‘p bo‘lsa, ularni toifalar bo‘yicha saralash qulay: “CSS”, “JavaScript”, “Dizayn”. Bu klassik “filter elements” komponenti.

## HTML: holat atributlarda

```html
<div class="filtrlar" role="group" aria-label="Loyihalarni saralash">
  <button type="button" data-filtr="hammasi" aria-pressed="true">Hammasi</button>
  <button type="button" data-filtr="css" aria-pressed="false">CSS</button>
  <button type="button" data-filtr="js" aria-pressed="false">JavaScript</button>
</div>

<article class="ish" data-toifa="css">…</article>
<article class="ish" data-toifa="js">…</article>
```

- `data-filtr`, `data-toifa` — JavaScript uchun ma’lumot;
- `aria-pressed` — tugmaning “bosilgan/bosilmagan” holati, ekran o‘quvchi “CSS, bosilgan tugma” deydi;
- `role="group"` + `aria-label` — tugmalar bitta guruh ekanini bildiradi.

## JavaScript

```js
const tugmalar = document.querySelectorAll('[data-filtr]');
const ishlar = document.querySelectorAll('.ish');

tugmalar.forEach((tugma) => {
  tugma.addEventListener('click', () => {
    const filtr = tugma.dataset.filtr;
    tugmalar.forEach((t) => t.setAttribute('aria-pressed', String(t === tugma)));
    ishlar.forEach((ish) => {
      ish.hidden = filtr !== 'hammasi' && ish.dataset.toifa !== filtr;
    });
  });
});
```

`dataset.filtr` — `data-filtr` atributining qiymati. `hidden` xususiyati elementni ko‘rinishdan ham, ekran o‘quvchidan ham yashiradi.

## CSS: holat atributdan

```css
.filtrlar [aria-pressed='true'] {
  background-color: var(--urg);
  color: white;
  border-color: var(--urg);
}
```

Alohida `.faol` klassi kerak emas — atribut ham ma’noni, ham ko‘rinishni boshqaradi.

## `hidden` va `display`

Agar `.ish` ga CSS’da `display: grid` yoki `flex` berilsa, u `hidden` atributini yengib qo‘yadi va element yashirinmaydi. Himoya:

```css
[hidden] {
  display: none !important;
}
```

## Natija haqida xabar

Filtrdan keyin nechta loyiha qolganini aytish foydali: `<p role="status">2 ta loyiha</p>`. `role="status"` ekran o‘quvchiga o‘zgarishni bildiradi.

Mashqda loyihalarni toifa bo‘yicha filtrlaydigan tugmalar yasaysiz.
