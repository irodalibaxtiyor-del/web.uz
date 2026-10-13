## Animatsiyalar

Animatsiyaning ikki yo‘li bor: **CSS** (transition, animation) va **JavaScript** (`requestAnimationFrame`).

## 1. CSS + klass (tavsiya etiladi)

Ko‘p hollarda JavaScript faqat **klassni almashtiradi**, harakatni CSS bajaradi:

```css
.panel {
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.3s, transform 0.3s;
}
.panel.korinadi {
  opacity: 1;
  transform: none;
}
```

```js
tugma.onclick = () => panel.classList.toggle('korinadi');
```

Brauzer bunday animatsiyani juda samarali bajaradi (ko‘pincha videokarta orqali).

## 2. `requestAnimationFrame`

Harakat JavaScript’da **hisoblanishi** kerak bo‘lsa (o‘yin, grafik, fizika):

```js
function harakatlantir(el, masofa, davomiylik, tugaganda) {
  const boshlanish = performance.now();

  function qadam(hozir) {
    const t = Math.min((hozir - boshlanish) / davomiylik, 1); // 0 → 1
    el.style.left = Math.round(masofa * t) + 'px';
    if (t < 1) {
      requestAnimationFrame(qadam);
    } else {
      tugaganda();
    }
  }

  requestAnimationFrame(qadam);
}

harakatlantir(quti, 200, 500, () => {
  holat.textContent = 'Tugadi';
});
```

- `requestAnimationFrame(fn)` — brauzer **keyingi kadr**dan oldin `fn` ni chaqiradi (odatda sekundiga 60 marta).
- `hozir` — yuqori aniqlikdagi vaqt. Holatni **o‘tgan vaqtga** qarab hisoblang, kadrlar soniga emas — aks holda sekin kompyuterda animatsiya sekinlashadi.
- `t` — 0 dan 1 gacha bo‘lgan **jarayon**. `Math.min(..., 1)` oxirgi kadrda aniq maqsadga yetkazadi.

## Nega `setInterval` emas?

- `requestAnimationFrame` ekran yangilanishi bilan sinxron — silliqroq;
- tab fonda bo‘lsa, to‘xtaydi — batareya tejaladi;
- `setInterval(fn, 16)` kadrlar bilan mos tushmay, “sakrashlar” beradi.

## Silliqlash (easing)

Bir tekis harakat sun’iy ko‘rinadi. Oddiy yumshatish:

```js
const yumshoq = 1 - (1 - t) ** 3; // tez boshlanib, sekin tugaydi
el.style.left = masofa * yumshoq + 'px';
```

## Qaysi xususiyatlarni animatsiya qilish

`transform` va `opacity` — eng arzon: brauzer sahifani qayta joylashtirmaydi. `left`, `width`, `top` qimmatroq — oddiy misollar uchun mayli, murakkab interfeyslarda `transform: translateX()` ishlating.

## Harakatni kamaytirish

Ba’zi foydalanuvchilar tizimda animatsiyani o‘chirib qo‘ygan (bosh aylanishi va boshqa sabablar bilan):

```js
const kamroq = matchMedia('(prefers-reduced-motion: reduce)').matches;
```

Bunday holatda animatsiyani o‘tkazib yuborib, darhol yakuniy holatni ko‘rsating.
