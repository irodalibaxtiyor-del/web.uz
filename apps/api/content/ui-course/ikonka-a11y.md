## Ikonka ekran o‘quvchi uchun

Ko‘zi ojiz foydalanuvchi sahifani ekran o‘quvchi dastur (NVDA, VoiceOver, TalkBack) bilan “eshitadi”. Ikonka uning uchun yo **bo‘sh joy**, yo **tushunarsiz shovqin**. Ikki holatni ajrating.

## 1. Bezak ikonka — yashiring

Yonida matn bor ikonka qo‘shimcha ma’lumot bermaydi:

```html
<button type="button">
  <svg aria-hidden="true" focusable="false">…</svg>
  Saqlash
</button>
```

- `aria-hidden="true"` — ekran o‘quvchi ikonkani o‘tkazib yuboradi va faqat “Saqlash, tugma” deydi;
- `focusable="false"` — eski brauzerlarda SVG Tab bilan alohida fokus olmasligi uchun.

## 2. Yolg‘iz ikonka — nom bering

Tugmada faqat ikonka bo‘lsa, unga nom kerak:

```html
<button type="button" aria-label="Yopish">
  <svg aria-hidden="true" focusable="false">…</svg>
</button>
```

Nomsiz bunday tugmani ekran o‘quvchi shunchaki “tugma” deb o‘qiydi — foydalanuvchi u nima qilishini bilmaydi. Ikkinchi usul — yashirin matn:

```html
<button type="button">
  <span class="sr-only">Yopish</span>
  <svg aria-hidden="true">…</svg>
</button>
```

`title` atributi yetarli emas: u hamma joyda o‘qilmaydi va sensorli ekranda ko‘rinmaydi.

## 3. Ma’no beruvchi rasm-ikonka

Agar ikonka mustaqil ma’no bersa (masalan, jadvalda “✓ o‘tdi” o‘rniga faqat yashil belgi), unga matn muqobili kerak:

```html
<svg role="img" aria-label="O‘tdi">…</svg>
```

Lekin yaxshisi — ikonka **va** ko‘rinadigan matn birga: “Saqlandi”. Holatni faqat rang va ikonka bilan ko‘rsatish rangni ajratmaydiganlar uchun ham muammo.

## Bosish maydoni

Ikonka 20px bo‘lsa ham, tugma kamida 44×44px bo‘lsin. Kichik ikonka atrofiga `padding` qo‘shib, bosish maydonini kattalashtiring.

## Tekshirish

- Chrome DevTools → **Accessibility** paneli: tanlangan elementning “Name” maydoni. Ikonkali tugmada u bo‘sh bo‘lmasligi kerak.
- Lighthouse “Buttons do not have an accessible name” deb ogohlantiradi.
- Eng yaxshi tekshiruv — ekran o‘quvchini yoqib, sahifani Tab bilan aylanib chiqish.

Mashqda ikonkali tugmalarga nom berasiz va bezak SVG’larni yashirasiz.
