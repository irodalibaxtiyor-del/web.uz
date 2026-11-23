## “Men haqimda” bo‘limi

Bu bo‘lim — tashrif buyuruvchi siz bilan “tanishadigan” joy. U rezyume emas: bir-ikki paragrafda kimligingiz, nima bilan shug‘ullanishingiz va nima sizni qiziqtirishi.

Yaxshi matn:

- birinchi shaxsda va oddiy tilda yoziladi;
- aniq: “kichik bizneslar uchun saytlar yasayman” — “men ishtiyoqli va mas’uliyatli dasturchiman” dan yaxshiroq;
- qisqa: 60–120 so‘z.

## Maket

```css
.haqimda {
  display: grid;
  gap: 32px;
}

@media (min-width: 768px) {
  .haqimda {
    grid-template-columns: 240px 1fr;
    align-items: center;
  }
}
```

Telefonda surat matn ustida, kengroq ekranda chapda. Surat ustuni qotgan (240px), matn qolgan joyni oladi.

## Portret

```css
.surat {
  display: block;
  width: 100%;
  max-width: 240px;
  height: auto;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 24px;
}
```

Asl rasm tik (3:4) bo‘lsa ham, kvadrat ramkada chiqadi. Yuz qirqilib ketmasligi uchun `object-position: top` qo‘shish mumkin.

## `alt` matn

```html
<img src="aziza.jpg" alt="Aziza Karimova portreti" width="480" height="640" />
```

`alt` da “rasm” yoki “foto” so‘zi shart emas — ekran o‘quvchi buni o‘zi aytadi. Agar surat faqat bezak bo‘lsa (masalan, abstrakt naqsh), `alt=""`.

## Ko‘nikmalar va tajriba

Bu bo‘limga keyingi darslarda ko‘nikmalar paneli va tajriba vaqt chizig‘i qo‘shiladi. Ularni haddan tashqari uzaytirmang: tashrif buyuruvchi loyihalaringizni ko‘rishga keldi, bu bo‘lim qo‘shimcha kontekst.

## Rezyume havolasi

Ish qidirayotgan bo‘lsangiz, “Rezyumeni yuklab olish (PDF)” havolasini qo‘ying:

```html
<a href="/aziza-rezyume.pdf" download>Rezyume (PDF, 120 KB)</a>
```

Fayl turi va hajmini yozish — foydalanuvchi nima kutayotganini biladi.

Mashqda surat va matnni moslashuvchan ikki ustunli bo‘limga joylaysiz.

```tekshir
Portretning `alt` matni qanday bo‘lishi kerak?
+ qisqa va mazmunli: masalan, “Aziza Karimova, ish stolida”
- “rasm.jpg”
- bo‘sh qoldirish kerak
> Bezak bo‘lmagan rasmning `alt` i undagi muhim narsani aytadi.
```

```jonli
<style>
  .p { display: grid; gap: 16px; align-items: center; }
  .p img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; }
  @media (min-width: 500px) { .p { grid-template-columns: 120px 1fr; } }
</style>
<section class="p"><img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%27300%27%20height=%27300%27%3E%3Crect%20width=%27300%27%20height=%27300%27%20fill=%27%236c3483%27/%3E%3Ccircle%20cx=%27210%27%20cy=%27105%27%20r=%2745%27%20fill=%27%23fff%27/%3E%3C/svg%3E" width="120" height="120" alt="Aziza Karimova portreti"><div><h2 style="margin: 0">Men haqimda</h2><p>3 yildan beri interfeyslar yarataman.</p></div></section>
```
