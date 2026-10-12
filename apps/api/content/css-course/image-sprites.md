## Rasm spraytlari

Sprayt — ko‘p kichik rasmlar (ikonkalar) **bitta faylga** joylashtirilgan katta rasm. Kerakli ikonka `background-position` bilan “oyna” orqali ko‘rsatiladi.

```text
sprite.png (96 × 32):
┌────────┬────────┬────────┐
│  uy    │ qidiruv│ savat  │
│ 0..32  │ 32..64 │ 64..96 │
└────────┴────────┴────────┘
```

```css
.ikonka {
  display: inline-block;
  width: 32px;
  height: 32px;
  background-image: url("sprite.png");
}

.ikonka-uy {
  background-position: 0 0;
}

.ikonka-qidiruv {
  background-position: -32px 0;
}

.ikonka-savat {
  background-position: -64px 0;
}
```

Element 32×32 o‘lchamli “oyna”. Fon rasmi chapga surilsa (`-32px`), oynada ikkinchi ikonka ko‘rinadi.

## Nega ishlatilgan?

Ilgari har bir fayl uchun brauzer serverga alohida so‘rov yuborardi va bu sekin edi. 50 ta ikonka — 50 ta so‘rov. Sprayt bilan — bitta.

## Bugun kerakmi?

Zamonaviy HTTP/2 va HTTP/3 ko‘p fayllarni bir ulanish orqali yuboradi, shuning uchun spraytning afzalligi kamaygan. Ikonkalar uchun ko‘pincha **SVG** ishlatiladi (4-modul). Lekin spraytlar hali ham uchraydi:

- eski loyihalarda;
- o‘yinlarda (personaj harakatining kadrlari);
- `steps()` animatsiyasi bilan “kadrma-kadr” animatsiyalarda (11-modul).

Shuning uchun `background-position` qanday ishlashini tushunish foydali.

## `background-position` eslatma

| Qiymat          | Ma’nosi                                     |
| --------------- | ------------------------------------------- |
| `0 0`           | Rasmning chap yuqori burchagi               |
| `-32px 0`       | Rasm 32px chapga surilgan                   |
| `0 -32px`       | Rasm 32px yuqoriga surilgan (ikkinchi qator) |
| `right bottom`  | O‘ng pastki burchak                         |

Birinchi qiymat — gorizontal, ikkinchisi — vertikal.

## Foydalanish qulayligi

Sprayt fon rasmi bo‘lgani uchun ekran o‘quvchi uni ko‘rmaydi. Ikonka ma’no tashisa, yoniga matn yoki `aria-label` qo‘shing.

## Xulosa

- Sprayt — bir faylda ko‘p rasm, kerakli qism `background-position` bilan ko‘rsatiladi.
- Element o‘lchami “oyna”, manfiy pozitsiya rasmni suradi.
- Bugun ikonkalar uchun SVG afzalroq.
