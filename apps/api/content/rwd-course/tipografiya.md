## Matn ham moslashadi

Telefonda 16px yetarli, katta ekranda esa 18px o‘qishga qulayroq. Sarlavhalar orasidagi farq yana ham katta: telefonda 32px, kompyuterda 56px. Har bir ekran uchun media so‘rov yozish o‘rniga `clamp()` ishlatiladi.

## Suyuq shrift

```css
body {
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
}

h1 {
  font-size: clamp(2rem, 1.5rem + 2vw, 3.5rem);
}
```

O‘rtadagi ifoda `rem + vw` ko‘rinishida bo‘lishi muhim:

- `vw` qismi ekranga qarab o‘sadi;
- `rem` qismi foydalanuvchi brauzerda shriftni kattalashtirsa, matn ham kattalashishini kafolatlaydi. Faqat `vw` dan iborat shrift (`font-size: 5vw`) kattalashtirishga javob bermaydi.

## Qator balandligi

```css
body {
  line-height: 1.6;
}

h1 {
  line-height: 1.15;
}
```

Birliksiz qiymat (`1.6`) elementning **o‘z** shriftiga ko‘paytiriladi: 16px matnda 25.6px. `line-height: 24px` kabi qotgan qiymat yozilsa, shrift kattalashganda qatorlar bir-biriga minib ketadi.

Katta sarlavhalarga kichikroq `line-height` kerak, oddiy matnga — kattaroq.

## Qator uzunligi

Eng qulay qator — taxminan **45–75 belgi**. Juda uzun qatorda ko‘z keyingi qator boshini yo‘qotadi.

```css
.matn {
  max-width: 65ch;
  margin-inline: auto;
}
```

`ch` — “0” raqamining kengligi; `65ch` taxminan 65 belgi.

## Masshtab (type scale)

Sarlavha o‘lchamlari tasodifiy bo‘lmasligi kerak. Odatda bitta koeffitsient tanlanadi (masalan, 1.25) va o‘lchamlar unga ko‘paytirib hosil qilinadi: 16, 20, 25, 31, 39… Moslashuvchan dizaynda telefonda kichikroq (1.2), kompyuterda kattaroq (1.333) koeffitsient olish mumkin. Bu haqda “UI asoslari” kursida batafsil.

## Uzun so‘zlar

Telefonda uzun URL yoki so‘z qatorni yorib chiqishi mumkin:

```css
.matn {
  overflow-wrap: anywhere;
  hyphens: auto; /* lang atributi kerak */
}
```

Mashqda matn va sarlavhaga suyuq o‘lcham, to‘g‘ri qator balandligi va qulay qator uzunligini berasiz.

```tekshir
O‘qish uchun qulay qator uzunligi taxminan qancha?
+ 45–75 belgi (`max-width: 65ch` kabi)
- 150 belgidan ortiq
- 10–15 belgi
> Juda uzun qatorda ko‘z keyingi qatorni yo‘qotadi.
```

```jonli
<style>
  p { max-width: 50ch; line-height: 1.6; font-size: clamp(1rem, 0.9rem + 0.5vw, 1.25rem); }
  h2 { font-size: clamp(1.4rem, 1rem + 2vw, 2.4rem); }
</style>
<h2>Suyuq sarlavha</h2>
<p>Bu paragraf 50 belgidan kengaymaydi va shrift o‘lchami ekran kengligiga qarab silliq o‘zgaradi, lekin chegaradan chiqmaydi.</p>
```
