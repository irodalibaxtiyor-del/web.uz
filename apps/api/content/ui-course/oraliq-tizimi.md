## Oraliqlar ham tizim bo‘lsin

Ranglar va shriftlar kabi oraliqlar ham tasodifiy bo‘lmasligi kerak. 13px, 7px, 29px kabi qiymatlar kodda birma-bir ko‘rinmaydi, lekin sahifada “nimadir noto‘g‘ri” degan his qoldiradi: kartalar ichidagi bo‘shliqlar har xil, bo‘limlar notekis.

## 8px qoidasi

Ko‘p dizayn tizimlari oraliqlarni **8 ga** (mayda joylarda **4 ga**) karrali qiladi:

| Token    | Qiymat | Odatda                       |
| -------- | ------ | ---------------------------- |
| `--s-1`  | 4px    | ikonka va matn orasi         |
| `--s-2`  | 8px    | kichik elementlar orasi      |
| `--s-3`  | 12px   | tugma ichki chetlari         |
| `--s-4`  | 16px   | karta ichidagi bloklar orasi |
| `--s-6`  | 24px   | karta chetidan               |
| `--s-8`  | 32px   | kartalar, bo‘limlar orasi    |
| `--s-12` | 48px   | katta bo‘limlar              |
| `--s-16` | 64px   | sahifa bo‘limlari            |

Nega 8? U 2 va 4 ga bo‘linadi, ko‘p ekran o‘lchamlari unga karrali va tanlov kamayadi: “14 yoki 15?” degan savol o‘rniga “16”.

## CSS’da

```css
:root {
  --s-1: 4px;
  --s-2: 8px;
  --s-4: 16px;
  --s-6: 24px;
  --s-8: 32px;
}

.karta {
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
  padding: var(--s-6);
}

.bolim {
  margin-bottom: var(--s-8);
}
```

Token nomlaridagi raqam ko‘pincha 4px ga ko‘paytiruvchi: `--s-6` = 6 × 4 = 24px. Tailwind kabi freymvorklar ham shu tizimdan foydalanadi (`p-6` = 24px).

## `rem` da yozish kerakmi?

Oraliqlarni `rem` da yozsangiz (`--s-4: 1rem`), foydalanuvchi shriftni kattalashtirganda oraliqlar ham kattalashadi — matn bilan mutanosiblik saqlanadi. Piksellar esa aniqroq hisoblanadi. Ikkalasi ham to‘g‘ri; muhimi — bitta loyihada bitta tanlov.

## `gap` — eng yaxshi do‘st

Elementlar orasidagi masofani har bir elementning `margin` i bilan emas, ota elementning `gap` i bilan bering. Oxirgi elementdagi ortiqcha chetni olib tashlash, `margin` larning qo‘shilib ketishi kabi muammolar yo‘qoladi.

## Ichkari tashqaridan kichik

Komponent ichidagi oraliq u bilan qo‘shnisi orasidagi oraliqdan kichik bo‘lishi kerak. Karta ichida 16px, kartalar orasida 24–32px. Aks holda ko‘z qaysi element qaysi kartaga tegishli ekanini ajrata olmaydi (keyingi dars — yaqinlik).

Mashqda tasodifiy oraliqlarni tokenlar bilan almashtirasiz.
