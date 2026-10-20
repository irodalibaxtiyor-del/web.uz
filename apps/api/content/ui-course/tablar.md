## Tablar qachon kerak

Tablar bir sahifada bir nechta bo‘limni almashtirib ko‘rsatadi: “Dastur”, “Narx”, “Fikrlar”. Ular joyni tejaydi, lekin yashiringan kontentni foydalanuvchi ko‘rmasligi mumkin. Tablar faqat **teng darajadagi**, bir vaqtda bittasi kerak bo‘ladigan bo‘limlar uchun.

## Accessible tuzilma

```html
<div role="tablist" aria-label="Kurs ma’lumotlari">
  <button type="button" role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1">
    Dastur
  </button>
  <button type="button" role="tab" id="tab-2" aria-selected="false" aria-controls="panel-2">
    Narx
  </button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">…</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>…</div>
```

- `role="tablist"`, `role="tab"`, `role="tabpanel"` — ekran o‘quvchi “tab, 2 dan 1” deb aytadi;
- `aria-selected` — qaysi tab faol;
- `aria-controls` / `aria-labelledby` — tab va panel bog‘lanishi;
- `hidden` — yashirin panel ekran o‘quvchidan ham yashiriladi.

## JavaScript

```js
const tablar = document.querySelectorAll('[role="tab"]');

tablar.forEach((tab) => {
  tab.addEventListener('click', () => {
    tablar.forEach((t) => {
      const tanlangan = t === tab;
      t.setAttribute('aria-selected', String(tanlangan));
      document.getElementById(t.getAttribute('aria-controls')).hidden = !tanlangan;
    });
  });
});
```

## Holatni CSS’da atributdan olish

```css
[role='tab'][aria-selected='true'] {
  color: #005bb5;
  border-bottom-color: #0071dc;
  font-weight: 600;
}
```

Alohida `.faol` klassi kerak emas — atribut ham holatni, ham ko‘rinishni boshqaradi. Ular hech qachon bir-biridan ajralib qolmaydi.

## Klaviatura

To‘liq accessible tablarda strelka tugmalari tablar orasida yuradi, Tab esa panelga o‘tadi (_roving tabindex_). Buning uchun faol bo‘lmagan tablarga `tabindex="-1"` beriladi va `keydown` da ←/→ ishlov beriladi. Mashqda asosiy qism — bosish bilan almashtirish.

## Telefonda

Ko‘p tab telefon ekraniga sig‘maydi. Variantlar: tablar qatorini gorizontal aylantirish (`overflow-x: auto`) yoki telefonda tablar o‘rniga ochiladigan bo‘limlar (_accordion_, `<details>`).

Mashqda tablarni bosilganda ishlaydigan qilasiz.
