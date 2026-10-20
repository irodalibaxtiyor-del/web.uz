## Karta — ma’lumot quti

Karta bitta mavzuga tegishli ma’lumotni bir joyga yig‘adi: hisobot, mahsulot, profil. U sahifa fonidan ajralib turuvchi **sirt**.

## Sirt va chegara

```css
body {
  background-color: #f1f5f9;
}

.karta {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}
```

Kulrang fonda oq karta — ajralish uchun soya ham shart emas. Ingichka chegara yorug‘ mavzuda ham, qorong‘i mavzuda ham yaxshi ishlaydi (qorong‘ida soya ko‘rinmaydi).

`overflow: hidden` ichki bo‘limlar (rasm, rangli pastki qism) burchaklardan chiqib ketmasligi uchun.

## Uch qism

```html
<article class="karta">
  <header class="karta-bosh">…</header>
  <div class="karta-tana">…</div>
  <footer class="karta-oyoq">…</footer>
</article>
```

```css
.karta-oyoq {
  background-color: #f8fafc;
  border-top: 1px solid #e2e8f0;
}
```

Pastki qism harakatlar uchun (havola, tugmalar). Biroz boshqa fon uni tanadan ajratadi.

Hamma kartaga uch qism kerak emas — oddiy kartada bitta `padding` yetarli. Muhimi, bitta loyihadagi kartalar bir xil “tilda” gapirsin.

## Soya

```css
.karta:hover {
  box-shadow: 0 8px 24px -8px rgb(15 23 42 / 0.2);
}
```

Yaxshi soya:

- yumshoq (katta xiralik, kichik shaffoflik);
- pastga yo‘nalgan (yorug‘lik tepadan);
- manfiy _spread_ bilan karta ostidan “chiqmaydi”.

Qora va qattiq soya (`0 0 10px black`) eskicha ko‘rinadi. Rangli “nur” (glow) soyalar ham ko‘pincha ortiqcha.

## Hover faqat bosiladigan kartaga

Agar karta bosilmasa, hover effekti foydalanuvchini aldaydi — u bosib ko‘radi va hech narsa bo‘lmaydi. Ko‘tarilish va soya faqat butunlay bosiladigan kartalarga.

## Burchak radiusi tizimi

Interfeysda 2–3 ta radius yetarli: kichik (6–8px — tugma, maydon), o‘rta (12px — karta), katta (16–24px — modal oyna). Ular ham tokenga aylanadi: `--r-sm`, `--r-md`, `--r-lg`.

Mashqda uch qismli karta yasaysiz.
