## Bo‘sh joy — dizayn elementi

**Oq joy** (_whitespace_, _negative space_) — elementlar orasidagi va atrofidagi bo‘sh maydon. U rang emas, shunchaki “hech narsa yo‘q” joy. Yangi boshlovchilar uni isrof deb biladi va har bir burchakni to‘ldirishga harakat qiladi. Aslida oq joy:

- elementlarni guruhlaydi va ajratadi;
- muhim narsaga e’tiborni qaratadi;
- matnni o‘qishni osonlashtiradi;
- sahifaga “qimmat”, tinch taassurot beradi.

## Ikki turi

- **Mikro** — qatorlar, harflar, tugma ichidagi kichik oraliqlar.
- **Makro** — bo‘limlar orasidagi, sahifa chetidagi katta maydonlar.

## Bo‘limlar orasida

```css
.bolim {
  padding-block: clamp(3rem, 8vw, 6rem);
}
```

Telefonda 48px, katta ekranda 96px. Bo‘limlar bir-biriga yopishib qolmaydi, har biri o‘z “sahnasiga” ega.

## Konteyner

```css
.konteyner {
  max-width: 72rem; /* 1152px */
  margin-inline: auto;
  padding-inline: 16px;
}
```

1920px ekranda kontent butun kenglikka cho‘zilmaydi — chetlarda oq joy qoladi va ko‘z markazga yo‘naladi.

## Matn kengligi

```css
.kirish {
  max-width: 36rem;
}
```

Kirish matni kontent konteyneridan ham torroq — qisqa qatorlar tez o‘qiladi va sarlavha bilan birga ixcham blok hosil qiladi.

## Qancha bo‘sh joy yetarli?

Qoida yo‘q, lekin yo‘l-yo‘riq bor:

- Elementni olib tashlab ko‘ring — sahifa yomonlashdimi? Yo‘q bo‘lsa, u kerak emas edi.
- Har bir ekranda **bitta asosiy narsa** bo‘lsin; qolganlari unga joy bersin.
- Shubha bo‘lsa — oraliqni bir pog‘ona kattalashtiring (24 → 32). Interfeyslar ko‘pincha tor, kamdan-kam “juda keng” bo‘ladi.

## Zichlik

Har qanday interfeys ham havodor bo‘lishi shart emas. Jadvallar, admin panellar, kod muharrirlari — ko‘p ma’lumotni bir ekranda ko‘rsatish uchun **zich**. Lending va maqola sahifalari esa havodor. Zichlikni foydalanuvchi vazifasiga qarab tanlang.

Mashqda bo‘limga ekranga moslashuvchan oq joy, konteyner va qulay matn kengligi berasiz.
