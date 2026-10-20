## Footer

```
Desktop 1440: Fill #0F172A · Text #CBD5E1
  Grid: 2fr 1fr 1fr 1fr · Gap 32
  Bottom bar: Stroke top 1 #334155
Mobile 360: 2 ustun · Gap 32 · Brand — 2 ustun
```

## Qorong‘i sirt

```css
.footer {
  background-color: #0f172a;
  color: #cbd5e1;
}

.footer a {
  color: inherit;
}
```

Qorong‘i fonda kontrastni tekshiring: `#cbd5e1` `#0f172a` ustida ~12:1 — yaxshi. Havolalar uchun `color: inherit` — ular footer matni rangini oladi; hover’da tagiga chiziq yoki ochroq rang.

## To‘r

```css
.tor {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.footer-brend {
  grid-column: 1 / -1; /* telefonda ikkala ustun */
}

@media (min-width: 1024px) {
  .tor {
    grid-template-columns: 2fr 1fr 1fr 1fr;
  }
  .footer-brend {
    grid-column: auto;
  }
}
```

`fr` ulushlari: 1296 kenglikdan 3 × 32 = 96 gap ayriladi, qolgan 1200 besh ulushga bo‘linadi: 480, 240, 240, 240.

## Pastki qator

```css
.pastki {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #334155;
}
```

Mualliflik huquqi, maxfiylik siyosati havolalari va ijtimoiy tarmoqlar odatda shu qatorda.

## Semantika

- Footer’dagi havola guruhlari — `<nav aria-label="…">`: ekran o‘quvchi ularni alohida navigatsiya hududlari sifatida e’lon qiladi.
- Ustun sarlavhalari — haqiqiy sarlavha (`h2`) yoki ro‘yxat yorlig‘i. Vizual o‘lchami kichik bo‘lsa ham, semantik daraja to‘g‘ri bo‘lsin.

## Loyihani yakunlash

Uch qism tayyor bo‘lgach, butun sahifani 360 va 1440 da maket bilan solishtiring, keyin 768 va 1024 kabi oraliq kengliklarda buzilmasligini tekshiring. Shundan keyin dizaynerga havola yuboring — eng yaxshi handoff ikki tomonlama: dizayner ham kod natijasini ko‘rib chiqadi.

Kursni tugatdingiz. Endi “Portfolio” kursida o‘z saytingizni shu usulda — avval maket, keyin kod — yasashingiz mumkin.

Mashqda footer’ni ikki freym bo‘yicha yig‘asiz.
