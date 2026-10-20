## Bir sahifa — bir nechta freym

Moslashuvchan sahifa uchun dizayner odatda bir nechta freym chizadi: **Mobile 360/375**, ba’zan **Tablet 768**, va **Desktop 1440**. Dasturchining vazifasi — ularni bitta HTML va CSS’ga birlashtirish.

## Farqlarni ro‘yxatga olish

Kod yozishdan oldin freymlarni yonma-yon qo‘yib, farqlarni yozib chiqing:

| Element        | Mobile 360        | Desktop 1440       |
| -------------- | ----------------- | ------------------ |
| Header padding | 16                | 24 / 72            |
| Sarlavha       | 24px              | 40px               |
| Menyu          | yashirin (burger) | gorizontal, Gap 32 |

Bu jadval — media so‘rovlaringizning tayyor rejasi.

## Kod: avval mobil

```css
.sarlavha {
  padding: 16px;
}
h1 {
  font-size: 24px;
}
.menyu {
  display: none;
}

@media (min-width: 1024px) {
  .sarlavha {
    padding: 24px 72px;
  }
  h1 {
    font-size: 40px;
  }
  .menyu {
    display: flex;
    gap: 32px;
  }
}
```

## Tanaffus nuqtasini qayerdan olish

Freym o‘lchami (1440) tanaffus nuqtasi emas! 1440 freymdagi maket 1024 da ham, 1280 da ham ishlashi kerak. Tanaffus nuqtasini o‘zingiz tanlaysiz: desktop maketi qayerdan boshlab sig‘ishini tekshiring. Ko‘pincha 1024 yoki 768.

## Freymlar orasidagi “bo‘shliq”

Dizayner 360 va 1440 ni chizdi, lekin 600 yoki 900 da nima bo‘ladi? Bu holatlar odatda maketda yo‘q. Variantlar:

- suyuq qiymatlar (`clamp()`) bilan oraliq holatni silliq qilish: sarlavha `clamp(1.5rem, 1rem + 2vw, 2.5rem)`;
- dizayner bilan kelishib, planshet uchun qo‘shimcha freym so‘rash;
- o‘z qaroringizni qabul qilib, dizaynerga ko‘rsatish.

## Komponent variantlari

Ba’zan farq butun sahifada emas, komponentda: kartaning Mobile va Desktop variantlari. Bunday hollarda konteyner so‘rovlari (`@container`) media so‘rovdan mosroq bo‘lishi mumkin.

## Sinash

Sahifani DevTools’da freym o‘lchamlariga (360, 1440) qo‘yib, maket skrinshoti bilan solishtiring. “Pixel Perfect” kabi brauzer kengaytmalari maket rasmini sahifa ustiga yarim shaffof qo‘yib beradi.

Mashqda ikki freymdagi header farqlarini media so‘rov bilan birlashtirasiz.
