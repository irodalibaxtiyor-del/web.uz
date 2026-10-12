## Atribut selektorlari

Elementni uning **atributi** bo‘yicha tanlash mumkin. Atribut selektori kvadrat qavsda yoziladi.

| Selektor              | Nimani tanlaydi                                       |
| --------------------- | ----------------------------------------------------- |
| `[title]`             | `title` atributi **bor** elementlar                   |
| `[type="email"]`      | Qiymati aynan `email`                                 |
| `[href^="https"]`     | Qiymati `https` bilan **boshlanadi**                  |
| `[href$=".pdf"]`      | Qiymati `.pdf` bilan **tugaydi**                      |
| `[href*="youtube"]`   | Qiymatida `youtube` **bor**                           |
| `[class~="faol"]`     | Bo‘sh joy bilan ajratilgan ro‘yxatda `faol` so‘zi bor |
| `[lang\|="uz"]`       | `uz` yoki `uz-` bilan boshlanadi (`uz-Latn`)          |

## Forma maydonlari

```css
input[type="text"],
input[type="email"] {
  padding: 8px;
  border: 1px solid #cccccc;
}

input[type="checkbox"] {
  width: 18px;
  height: 18px;
}
```

Klass qo‘shmasdan, maydon turiga qarab uslub berish mumkin.

## Havolalar turiga qarab

```css
a[href$=".pdf"]::after {
  content: " (PDF)";
}

a[href^="mailto:"]::before {
  content: "✉ ";
}

a[target="_blank"]::after {
  content: " ↗";
}
```

Foydalanuvchi havola nimaga olib borishini bosishdan oldin biladi.

## Holat atributlari

ARIA va `data-*` atributlari ham tanlanadi:

```css
button[aria-expanded="true"] {
  background-color: #e6f1fc;
}

[data-holat="xato"] {
  border-color: crimson;
}
```

Bu juda qulay: JavaScript faqat atributni o‘zgartiradi, ko‘rinishni esa CSS hal qiladi. `aria-expanded` kabi atributlar bir vaqtning o‘zida ekran o‘quvchiga ham holatni bildiradi.

## Registrni e’tiborsiz qoldirish

Qiymat oxiriga `i` qo‘shilsa, katta-kichik harf farqlanmaydi:

```css
a[href$=".pdf" i] {
  /* .pdf va .PDF ikkalasi ham */
}
```

## Xulosa

- `[atr]` — bor, `[atr="q"]` — aynan teng.
- `^=` boshlanadi, `$=` tugaydi, `*=` ichida bor.
- `aria-*` va `data-*` atributlari bo‘yicha holatga qarab uslub berish qulay.
