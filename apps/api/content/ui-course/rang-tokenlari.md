## Token nima?

**Dizayn tokeni** — dizayn qarorining nomlangan qiymati: rang, o‘lcham, soya. CSS’da token odatda maxsus o‘zgaruvchi (_custom property_):

```css
:root {
  --fon: #ffffff;
  --matn: #0f172a;
}
```

`:root` — `<html>` elementi; u yerda e’lon qilingan o‘zgaruvchi butun sahifaga meros bo‘ladi.

## Ikki qavatli tokenlar

Katta loyihalarda tokenlar ikki qavatda bo‘ladi:

```css
:root {
  /* 1-qavat: palitra (qiymatlar) */
  --kok-600: #0071dc;
  --kulrang-900: #0f172a;

  /* 2-qavat: semantika (vazifalar) */
  --urg: var(--kok-600);
  --matn: var(--kulrang-900);
}
```

Komponentlar faqat semantik tokenlarni ishlatadi: `.tugma { background: var(--urg) }`. Shunda mavzu almashganda faqat ikkinchi qavat qayta yoziladi.

## Qorong‘i mavzu

Qorong‘i mavzu uchun semantik tokenlar qayta aniqlanadi:

```css
[data-theme='dark'] {
  --fon: #0b1120;
  --matn: #e2e8f0;
}

body {
  background-color: var(--fon);
  color: var(--matn);
}
```

Komponent kodiga tegilmaydi — u baribir `var(--fon)` ni oladi.

## Tizim sozlamasi va tugma

Ikki usulni birlashtirish mumkin:

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    --fon: #0b1120;
    --matn: #e2e8f0;
  }
}
```

Foydalanuvchi tizimda qorong‘i mavzuni yoqqan bo‘lsa, sahifa avtomatik qorong‘i. Lekin u sahifadagi tugma bilan o‘zi tanlashi ham mumkin:

```js
tugma.addEventListener('click', () => {
  const qorongi = document.documentElement.dataset.theme !== 'dark';
  if (qorongi) document.documentElement.dataset.theme = 'dark';
  else delete document.documentElement.dataset.theme;
  tugma.setAttribute('aria-pressed', String(qorongi));
});
```

`aria-pressed` ekran o‘quvchiga tugmaning “yoqilgan/o‘chirilgan” holatini aytadi. Tanlovni `localStorage` da saqlab, sahifa ochilganda qayta qo‘llash odatiy.

## Qorong‘i mavzu qoidalari

- Fon sof qora emas, to‘q ko‘k-kulrang.
- Matn sof oq emas, biroz yumshoq.
- Soyalar qorong‘ida ko‘rinmaydi — ajratish uchun chegaralar va ochroq sirtlardan foydalaning.
- Urg‘u rangi ko‘pincha bir pog‘ona ochroq olinadi, aks holda qorong‘i fonda kontrast yetmaydi.
- `color-scheme: light dark` yozing — brauzer formalar va aylantirish chizig‘ini ham mos rangda chizadi.

Mashqda semantik tokenlar va mavzu almashtiruvchi tugma yasaysiz.

```tekshir
Semantik rang tokeni qaysi?
+ `--color-text-muted`
- `--blue-500`
- `#0071dc`
> Semantik token vazifani aytadi; qorong‘i mavzuda faqat uning qiymati almashadi.
```

```jonli
<style>
  .t { --bg: #ffffff; --text: #1b2430; --muted: #5b6573; background: var(--bg); color: var(--text); padding: 12px; border: 1px solid #ccc; margin-bottom: 8px; }
  .t.dark { --bg: #101820; --text: #e8eef5; --muted: #9aa6b2; }
  .t small { color: var(--muted); }
</style>
<div class="t"><b>Yorug‘ mavzu</b><br><small>Ikkilamchi matn</small></div>
<div class="t dark"><b>Qorong‘i mavzu</b><br><small>Xuddi shu klasslar, boshqa tokenlar</small></div>
```
