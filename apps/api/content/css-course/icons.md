## Ikonkalar

Ikonka — ma’noni tez yetkazadigan kichik rasm: qidiruv lupasi, savatcha, uy. Saytga ikonka qo‘shishning bir nechta yo‘li bor.

| Usul             | Afzalligi                          | Kamchiligi                              |
| ---------------- | ---------------------------------- | --------------------------------------- |
| Inline SVG       | Tez, aniq, CSS bilan rang beriladi | HTML biroz uzunlashadi                  |
| SVG fayl `<img>` | Oddiy, keshlanadi                  | CSS bilan rangini o‘zgartirib bo‘lmaydi |
| Ikonka shrifti   | Bitta fayl, ko‘p ikonka            | Ortiqcha yuklama, qulaylik muammolari   |
| Emoji            | Hech narsa yuklanmaydi             | Har tizimda boshqacha ko‘rinadi         |

Bugun eng ko‘p tavsiya etiladigan usul — **inline SVG**.

## Inline SVG va `currentColor`

```html
<button class="tugma">
  <svg class="ikonka" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3z" />
  </svg>
  Bosh sahifa
</button>
```

```css
.ikonka {
  width: 1.25em;
  height: 1.25em;
  fill: currentColor;
  vertical-align: -0.2em;
}

.tugma {
  color: #0071dc;
}

.tugma:hover {
  color: #0e1133; /* ikonka ham birga o‘zgaradi */
}
```

- `fill: currentColor` — ikonka matn rangini oladi.
- `width: 1.25em` — ikonka matn o‘lchamiga moslashadi.
- `vertical-align` ikonkani matn bilan bir chiziqqa tushiradi.

## Foydalanish qulayligi

**Bezak ikonkasi** (yonida matn bor) ekran o‘quvchidan yashiriladi:

```html
<svg aria-hidden="true">…</svg> Saqlash
```

**Yolg‘iz ikonka** (matnsiz tugma) nom olishi shart:

```html
<button aria-label="Qidirish">
  <svg aria-hidden="true">…</svg>
</button>
```

Nomi yo‘q tugmani ekran o‘quvchi faqat “tugma” deb o‘qiydi — foydalanuvchi u nima qilishini bilmaydi.

## Ikonka shriftlari haqida

Ilgari ikonkalar maxsus shriftlar orqali qo‘shilardi (`<i class="icon-home">`). Ular hali ham uchraydi, lekin kamchiliklari bor: shrift yuklanmasa kvadratlar chiqadi, ekran o‘quvchi g‘alati belgilarni o‘qishi mumkin. Yangi loyihalarda SVG’ni tanlang.

## Xulosa

- Inline SVG + `fill: currentColor` — rang matndan olinadi.
- O‘lchamni `em` da bering, ikonka matn bilan birga kattalashadi.
- Bezak ikonkasiga `aria-hidden="true"`, matnsiz tugmaga `aria-label`.
