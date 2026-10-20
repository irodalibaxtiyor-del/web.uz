## Holat variantlari

Figma’da komponent holatlari ko‘pincha **State** variant xususiyati sifatida chiziladi: Default, Hover, Pressed, Focused, Disabled. Har biri CSS’dagi psevdoklassga to‘g‘ri keladi:

| Figma State        | CSS                                         |
| ------------------ | ------------------------------------------- |
| Hover              | `:hover`                                    |
| Pressed            | `:active`                                   |
| Focused            | `:focus-visible`                            |
| Disabled           | `:disabled` (yoki `[aria-disabled="true"]`) |
| Selected / Checked | `[aria-selected="true"]`, `:checked`        |

```css
.tugma:hover {
  background-color: #005bb5;
}

.tugma:focus-visible {
  box-shadow: 0 0 0 3px rgb(0 113 220 / 0.4);
}

.tugma:disabled {
  background-color: #cbd5e1;
  color: #64748b;
  cursor: not-allowed;
}
```

Kodda bu holatlarni klass bilan (`.tugma--hover`) yozmang — brauzer ularni o‘zi aniqlaydi.

## Fokus holati yo‘q bo‘lsa

Ko‘p maketlarda Focused holat chizilmagan. Bu dizaynerning unutganligi, “fokus kerak emas” degani emas. Klaviatura foydalanuvchilari uchun fokus ko‘rinishi shart — o‘zingiz yasang (masalan, ko‘k halqa) va dizaynerga ko‘rsating.

## Interaktiv komponentlar va prototip

Figma’da _Interactive components_ bilan holatlar orasidagi o‘tishlar (hover’da Hover variantiga o‘tish, 150 ms) ham belgilanishi mumkin. Prototip panelidagi animatsiya vaqti va egri chizig‘i CSS’ga o‘tadi:

```
While hovering → Change to Hover · Smart animate · Ease out · 150 ms
```

```css
.tugma {
  transition: background-color 150ms ease-out;
}
```

## Telefon va hover

Hover holati sensorli ekranda deyarli ishlamaydi. Agar maketdagi muhim ma’lumot faqat hover’da ko‘rinsa (masalan, karta ustiga olib borilganda chiqadigan tugmalar), telefonda u ko‘rinmay qoladi. Bunday elementlar uchun telefonda doim ko‘rinadigan variant kerak — dizaynerga savol bering.

## Pressed holati

`:active` sichqoncha bosib turilganda ishlaydi va juda qisqa. Ko‘pincha rangni yana bir pog‘ona to‘qlashtirish yoki `transform: scale(0.98)` kifoya.

Mashqda Hover, Focused va Disabled variantlarini psevdoklasslarga o‘girasiz.
