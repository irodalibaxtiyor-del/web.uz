## Ko‘nikmalar paneli

Ko‘p portfoliolarda ko‘nikmalar foizli chiziqlar bilan ko‘rsatiladi: “HTML 90%”, “CSS 75%”. Bu chiroyli, lekin bir muammosi bor: ko‘nikmani foiz bilan o‘lchab bo‘lmaydi (90% HTML nima degani?). Shuning uchun bunday panelni ehtiyotkorlik bilan ishlating — loyihalar orqali ko‘rsatish ishonchliroq. Lekin texnika sifatida u yaxshi mashq: CSS o‘zgaruvchilari va accessibility.

## HTML

```html
<div class="konikma">
  <span>HTML</span>
  <div
    class="chiziq"
    role="progressbar"
    aria-label="HTML"
    aria-valuenow="90"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="daraja" style="--qiymat: 90%"></div>
  </div>
</div>
```

- `role="progressbar"` va `aria-value*` — ekran o‘quvchi “HTML, 90 foiz” deydi;
- qiymat inline `style` da CSS o‘zgaruvchisi sifatida — CSS faylda bitta qoida hamma chiziqqa xizmat qiladi.

`<progress value="90" max="100">` elementi ham bor, lekin uni bezash brauzerlarda turlicha va qiyinroq.

## CSS

```css
.chiziq {
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background-color: var(--chegara);
}

.daraja {
  height: 100%;
  width: var(--qiymat);
  background-color: var(--urg);
}
```

`overflow: hidden` — ichki chiziq yumaloq burchaklardan chiqmaydi.

## Animatsiya (ixtiyoriy)

```css
@media (prefers-reduced-motion: no-preference) {
  .daraja {
    animation: tolish 800ms ease-out;
  }
}

@keyframes tolish {
  from {
    width: 0;
  }
}
```

`from` da faqat boshlang‘ich qiymat yoziladi — oxirgi qiymat `var(--qiymat)` dan olinadi.

## Muqobil: teglar

Ko‘pincha oddiy ro‘yxat yaxshiroq ishlaydi:

```html
<ul class="teglar">
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
  <li>Figma</li>
  <li>Git</li>
</ul>
```

Darajalarni ko‘rsatish kerak bo‘lsa — so‘z bilan: “Ishonchli”, “Ishlay olaman”, “O‘rganyapman”.

Mashqda accessible ko‘nikma chiziqlarini yasaysiz.

```tekshir
Ko‘nikma darajasini ko‘rsatishda nima muhim?
+ faqat chiziq emas — matn yoki foiz bilan ham yozish
- faqat rangli chiziq yetarli
- 100% dan ortiq ko‘rsatish
> `<meter>` yoki `<progress>` elementi ekran o‘quvchiga qiymatni aytadi.
```

```jonli
<style>
  label { display: block; margin-top: 8px; }
  meter { width: 100%; max-width: 280px; height: 14px; }
</style>
<label>HTML — 90% <meter min="0" max="100" value="90"></meter></label>
<label>CSS — 80% <meter min="0" max="100" value="80"></meter></label>
<label>JavaScript — 60% <meter min="0" max="100" value="60"></meter></label>
```
