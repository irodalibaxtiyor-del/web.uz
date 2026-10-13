## Loyiha: kalkulyator

Oddiy, lekin ichida qiziqarli **holat mashinasi** bo‘lgan loyiha. `eval` siz yozamiz.

## Talablar

1. Raqam tugmalari `0–9` va `.`, amallar `+ − × ÷`, `=` va `C`.
2. Ekranda joriy son ko‘rinadi; boshida `0`.
3. Amallar **chapdan o‘ngga** bajariladi (oddiy kalkulyator kabi): `2 + 3 × 4 =` → `20`.
4. Nolga bo‘lish — ekranda **Xato**.
5. Kasr natijalar chiroyli ko‘rinsin: `0.1 + 0.2` → `0.3`.

## Nega `eval` emas?

```js
eval('2+3*4'); // 14
```

`eval` istalgan satrni **kod sifatida** bajaradi — foydalanuvchi matni bilan bu xavfli. Bundan tashqari mashq preview’ining xavfsizlik siyosati (CSP) `eval` ni umuman taqiqlaydi. Haqiqiy loyihalarda ham ko‘pincha shunday.

## Holat

Kalkulyator har doim quyidagilarni eslab turadi:

```js
const holat = {
  ekran: '0',        // ko‘rsatilayotgan matn
  oldingi: null,     // birinchi operand (son)
  amal: null,        // '+', '-', '*', '/'
  yangiSon: false,   // keyingi raqam ekranni almashtirsinmi?
};
```

## Hodisalar

Barcha tugmalar bitta konteynerda, `data-tugma` atributi bilan:

```html
<div id="tugmalar">
  <button type="button" data-tugma="7">7</button>
  <button type="button" data-tugma="+">+</button>
  <button type="button" data-tugma="=">=</button>
</div>
```

```js
tugmalar.addEventListener('click', (event) => {
  const t = event.target.closest('[data-tugma]');
  if (!t) return;
  bos(t.dataset.tugma);
  chiz();
});
```

## Mantiq

```js
function bos(t) {
  if (/^[0-9]$/.test(t)) return raqam(t);
  if (t === '.') return nuqta();
  if (t === 'C') return tozala();
  if (t === '=') return teng();
  return amalTanla(t);
}
```

- **raqam** — `yangiSon` bo‘lsa ekranni almashtiradi, aks holda oxiriga qo‘shadi (`'0'` dan keyin `'7'` → `'7'`, `'07'` emas).
- **amalTanla** — oldingi amal kutayotgan bo‘lsa, avval uni hisoblaydi (chapdan o‘ngga), keyin yangi amalni eslab qoladi.
- **teng** — kutayotgan amalni hisoblaydi.

## Hisoblash va formatlash

```js
function hisobla(a, amal, b) {
  switch (amal) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b === 0 ? null : a / b;
  }
}

function formatla(son) {
  return String(Number(son.toFixed(10))); // 0.30000000000000004 → '0.3'
}
```

`null` — xato belgisi: ekranga **Xato** chiqadi va holat tozalanadi.

## Sinash ro‘yxati

| Bosish                 | Ekran   |
| ---------------------- | ------- |
| `1 2 + 3 =`            | `15`    |
| `2 + 3 × 4 =`          | `20`    |
| `7 ÷ 0 =`              | `Xato`  |
| `1 . 5 × 2 =`          | `3`     |
| `0 . 1 + 0 . 2 =`      | `0.3`   |
| `9 C`                  | `0`     |

## Kengaytirish

- klaviaturadan kiritish (`keydown`: raqamlar, `Enter`, `Backspace`);
- `%` va `±` tugmalari;
- hisoblar tarixi.
