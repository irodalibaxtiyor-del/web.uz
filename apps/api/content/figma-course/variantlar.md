## Variant — komponentning ko‘rinishlari

Bitta tugmaning o‘lchamlari (kichik, o‘rta, katta), turlari (asosiy, ikkinchi darajali) va holatlari (oddiy, hover, o‘chirilgan) bor. Figma’da ular bitta **component set** ichida variantlar sifatida saqlanadi:

```
Button
  Size = Small | Medium | Large
  Type = Primary | Secondary
  State = Default | Hover | Disabled
```

Instance’ni tanlasangiz, o‘ng panelda shu xususiyatlar tanlov sifatida chiqadi.

## Kodda: asos + modifikatorlar

Har bir variant kombinatsiyasi uchun alohida klass yozilmaydi (3 × 2 × 3 = 18 ta bo‘lardi!). Har bir **xususiyat** alohida modifikator:

```css
.tugma {
  /* Medium + Primary — standart */
  min-height: 44px;
  padding-inline: 16px;
  font-size: 16px;
  background-color: #0071dc;
}

.tugma--kichik {
  min-height: 36px;
  padding-inline: 12px;
  font-size: 14px;
}
.tugma--katta {
  min-height: 52px;
  padding-inline: 20px;
  font-size: 18px;
}

.tugma--ikkinchi {
  background-color: white;
  border-color: #cbd5e1;
  color: #0f172a;
}
```

```html
<button class="tugma tugma--katta tugma--ikkinchi">…</button>
```

Modifikatorlar mustaqil — har qanday kombinatsiya o‘zi ishlaydi.

## Standart variant

Eng ko‘p ishlatiladigan variant (odatda Medium + Primary) modifikatorsiz bo‘lsin. Shunda HTML qisqa, tasodifan modifikator unutilsa ham to‘g‘ri ko‘rinish chiqadi.

## Variantlar va tokenlar

Ko‘p variantli komponentda qiymatlarni tokenlar orqali yozish qulay:

```css
.tugma {
  --tugma-balandlik: 44px;
  min-height: var(--tugma-balandlik);
}

.tugma--katta {
  --tugma-balandlik: 52px;
}
```

Modifikator faqat o‘zgaruvchini almashtiradi.

## Atribut bilan

Ba’zi jamoalar klass o‘rniga `data-` atribut ishlatadi: `<button class="tugma" data-size="lg">` va `.tugma[data-size="lg"]`. Bu Figma’dagi “xususiyat = qiymat” yozuviga juda yaqin.

## Maketda yo‘q kombinatsiya

Figma’da “Small + Secondary + Disabled” chizilmagan bo‘lishi mumkin. Kodda u baribir paydo bo‘ladi — modifikatorlar to‘g‘ri yozilgan bo‘lsa, natija mantiqiy. Uni dizaynerga ko‘rsatib tasdiqlating.

Mashqda Size va Type variantlarini modifikator klasslarga aylantirasiz.
