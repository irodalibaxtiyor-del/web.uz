## Elementni yashirishning to‘rt usuli

| Usul | Ko‘rinadimi | Joy egallaydimi | Ekran o‘quvchi o‘qiydimi |
| --- | --- | --- | --- |
| `display: none` | Yo‘q | Yo‘q | Yo‘q |
| `visibility: hidden` | Yo‘q | Ha | Yo‘q |
| `opacity: 0` | Yo‘q | Ha | Ha (va bosish mumkin!) |
| `.sr-only` | Yo‘q | Yo‘q | Ha |

## Ekranga qarab ko‘rsatish

Telefonda burger tugmasi, kompyuterda to‘liq menyu — klassik misol:

```css
.faqat-kompyuter { display: none; }

@media (min-width: 768px) {
  .faqat-kompyuter { display: flex; }
  .faqat-telefon { display: none; }
}
```

Avval mobil yondashuvida standart holat telefon uchun, shu sababli kompyuter menyusi boshida yashirin.

## Kontentni yashirish — ehtiyot bo‘ling

Telefonda “sig‘madi” deb muhim matnni yashirish yomon odat: telefondan kirgan odam ham shu ma’lumotga muhtoj bo‘lishi mumkin. Yaxshiroq yo‘llar:

- matnni qisqartirish yoki qatorlarni o‘rash;
- ochiladigan blok (`<details>`);
- boshqa joyga — masalan, sahifa pastiga ko‘chirish.

Yashirish faqat **takrorlangan** yoki boshqa ko‘rinishda allaqachon bor narsa uchun (masalan, menyuning ikki xil ko‘rinishi).

## Faqat ekran o‘quvchi uchun matn

Ikonkali tugmada ko‘zga ko‘rinadigan yozuv yo‘q, lekin ko‘zi ojiz foydalanuvchi tugma nima qilishini bilishi kerak. Buning uchun matn “ko‘rinmas” qilinadi, lekin DOMda qoladi:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
```

```html
<button type="button">
  <span class="sr-only">Menyuni ochish</span>
  <svg aria-hidden="true">…</svg>
</button>
```

Ikonka `aria-hidden="true"` — ekran o‘quvchi uni o‘qimaydi, tugmaning nomi esa “Menyuni ochish” bo‘ladi. Xuddi shu natijani `aria-label="Menyuni ochish"` bilan ham olish mumkin.

## `hidden` atributi

HTML’da `hidden` atributi ham elementni yashiradi (`display: none` kabi). Lekin CSS’da `display: flex` yozilgan bo‘lsa, u `hidden` ni yengib qo‘yadi. Shu sabab ko‘p loyihalarda `[hidden] { display: none !important; }` qoidasi qo‘shiladi.

Mashqda telefon va kompyuter uchun navigatsiyani ajratasiz va `.sr-only` klassini yozasiz.
