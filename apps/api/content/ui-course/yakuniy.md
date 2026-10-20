## Hammasini bir joyda

Kursning oxirgi mashqi — profil kartasi. Unda o‘rganilgan deyarli hamma narsa kerak bo‘ladi. Avval kodga emas, kartaga qarang va savollarga javob bering:

1. **Eng muhim narsa nima?** Ism va asosiy harakat (“Bog‘lanish”).
2. **Ikkinchi darajali nima?** Kasbi, joylashuvi, statistika.
3. **Qanday guruhlar bor?** Profil boshi, statistika, harakat.

## Qadamlar

**Sirt.** Kulrang fonda oq karta, ingichka chegara, katta radius (16px — karta asosiy element).

**Avatar.** Doira, `object-fit: cover` va ikki qavatli halqa:

```css
.avatar {
  border-radius: 50%;
  object-fit: cover;
  box-shadow:
    0 0 0 3px white,
    0 0 0 5px #0071dc;
}
```

**Ierarxiya.** Ism — katta va qalin; kasb — oddiy o‘lcham, xira rang (kontrast 4.5:1 dan kam emas).

**Raqamlar.** Statistikadagi raqamlar katta, qalin va `tabular-nums` bilan; yorliq — kichik matn. Uchta ustun `justify-content: space-between` bilan tekis taqsimlangan.

**Harakat.** Faqat bitta to‘ldirilgan tugma, kamida 44px, aniq fe’l bilan.

## O‘zingizni tekshiring

- Ko‘zni qisib qarang — ism va tugma birinchi ko‘rinyaptimi?
- Tab bilan yuring — tugmada fokus ko‘rinadimi?
- 320px kenglikda — hech narsa chiqib ketmayaptimi?
- Qorong‘i mavzuda — tokenlar ishlatilgan bo‘lsa, bir necha qator bilan tayyor.
- Juda uzun ism qo‘ying (“Abdurahmonova Shahnozaxon Muhammadaliyevna”) — maket buzilmayaptimi?

## Keyingi qadamlar

UI asoslarini bildingiz. Endi:

- **Figma’dan kodga** kursida dizayner maketini aniq o‘lchamlari bilan sahifaga aylantirishni;
- **Portfolio** kursida shu qoidalar asosida o‘z saytingizni yasashni o‘rganasiz.

Eng yaxshi mashq — sevimli ilovangizdagi bitta ekranni ko‘chirib chizish va nega aynan shunday qilinganini tushunishga harakat qilish.

Mashqda profil kartasini kursda o‘rganilgan qoidalar bilan bezaysiz.
