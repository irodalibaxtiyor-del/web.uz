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
