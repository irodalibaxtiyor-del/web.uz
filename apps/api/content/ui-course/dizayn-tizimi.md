## Dizayn tizimi nima?

**Dizayn tizimi** — loyiha uchun umumiy “til”: tokenlar, komponentlar va ularni ishlatish qoidalari. Material Design (Google), Fluent (Microsoft), Carbon (IBM) — katta tizimlar. Lekin kichik loyihaga ham mini tizim foydali: yangi sahifa qo‘shilganda qarorlar qayta-qayta qabul qilinmaydi.

## Uch qatlam

1. **Tokenlar** — eng kichik qarorlar:

```css
:root {
  --rang-urg: #0071dc;
  --rang-chegara: #e2e8f0;
  --s-4: 16px;
  --s-6: 24px;
  --r-sm: 8px;
  --r-md: 12px;
  --t-base: 1rem;
}
```

2. **Komponentlar** — tokenlardan yig‘ilgan:

```css
.karta {
  padding: var(--s-6);
  border: 1px solid var(--rang-chegara);
  border-radius: var(--r-md);
}

.tugma {
  border-radius: var(--r-sm);
  background-color: var(--rang-urg);
}
```

3. **Qoidalar** — qachon nima ishlatiladi: “bir ekranda bitta asosiy tugma”, “xato matni maydon ostida”.

## Qattiq qiymatlarni topish

Kodda `#0071dc`, `12px`, `24px` qayta-qayta uchrasa — bu token bo‘lishi kerak. Muharrirda qidirib ko‘ring: bitta rang 30 joyda bo‘lsa, uni o‘zgartirish og‘riqli. Token bilan — bitta qator.

## Nomlash

- Palitra tokenlari — qiymati bo‘yicha: `--kok-600`.
- Semantik tokenlar — vazifasi bo‘yicha: `--rang-urg`, `--rang-xato`, `--fon-sirt`.
- Komponentlar semantik tokenlarni ishlatadi.

“Ko‘k tugma” emas, “asosiy tugma” — ertaga brend yashil bo‘lsa ham nom to‘g‘ri qoladi.

## Hujjat

Tizim faqat kodda emas, ko‘rinadigan sahifada ham bo‘lsin: barcha ranglar, shriftlar, tugma va forma holatlari bitta “katalog” sahifasida. Storybook kabi vositalar shu uchun. Yangi jamoa a’zosi u yerdan boshlaydi.

## Tizim — cheklov emas

Tizim ijodni o‘ldirmaydi: u asosiy qarorlarni hal qiladi va sizga haqiqatan yangi muammolarga vaqt qoldiradi. Agar tizimda yo‘q narsa kerak bo‘lsa — tizimga qo‘shing, bir sahifada “qo‘lda” yozmang.

Mashqda komponentdagi qattiq qiymatlarni tokenlarga almashtirib, urg‘u rangini bitta qatordan o‘zgartirasiz.
