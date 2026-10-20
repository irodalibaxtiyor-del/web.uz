## Case study

Eng yaxshi 1–3 loyiha uchun alohida sahifa yozing — **case study**. U skrinshotlardan ko‘ra ko‘proq narsani ko‘rsatadi: qanday fikrlaysiz, qanday muammolarni hal qilasiz.

## Tuzilma

1. **Vazifa** — mijoz kim, muammo nima edi.
2. **Rolingiz** — nimani o‘zingiz qildingiz (jamoaviy ish bo‘lsa, aniq ayting).
3. **Jarayon** — eskizlar, qarorlar, muqobillar, qiyinchiliklar.
4. **Yechim** — skrinshotlar, asosiy funksiyalar.
5. **Natija** — raqam bilan bo‘lsa yaxshi: “buyurtmalar 30% ga oshdi”, “sahifa 2 soniyada yuklanadi”.
6. **Havolalar** — jonli sayt va kod.

## Maket: hikoya + ma’lumot paneli

```css
.loyiha-sahifa {
  display: grid;
  gap: 48px;
}

@media (min-width: 1024px) {
  .loyiha-sahifa {
    grid-template-columns: 1fr 280px;
  }
}

.hikoya {
  max-width: 65ch;
}

.malumot {
  position: sticky;
  top: 96px;
  align-self: start;
}
```

- Hikoya qulay o‘qish kengligida (`65ch`).
- Ma’lumot paneli (rol, muddat, texnologiyalar) aylantirganda ko‘rinib turadi.
- `align-self: start` muhim: grid katagi standart holda butun qator balandligiga cho‘ziladi, cho‘zilgan elementda sticky ishlamaydi.
- `top: 96px` — yopishqoq header ostida qolmasligi uchun.

## Tavsif ro‘yxati

Ma’lumotlar uchun `<dl>` (description list) aynan mos:

```html
<dl>
  <dt>Rol</dt>
  <dd>Dizayn va frontend</dd>
  <dt>Muddat</dt>
  <dd>3 hafta</dd>
</dl>
```

`dt` — atama, `dd` — qiymat. Ekran o‘quvchi ularni juftlik sifatida o‘qiydi.

## Rasmlar hikoya ichida

Katta skrinshotlar hikoya ustunidan kengroq bo‘lishi mumkin — `figure` ga `grid-column: 1 / -1` berib, butun kenglikka chiqaring. `figcaption` da rasmda nima ko‘rinayotganini yozing.

## Navigatsiya

Sahifa oxirida “Keyingi loyiha →” havolasi o‘quvchini saytda ushlab qoladi.

Mashqda case study sahifasining ikki ustunli maketini yasaysiz.
