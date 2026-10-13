## `async` va `await`

`async`/`await` — Promise’lar bilan ishlashni **oddiy, ketma-ket** kod kabi yozish imkonini beradigan sintaksis.

```js
async function profilYukla(id) {
  const ism = await malumotOl(id);    // Promise tugashini kutadi
  const kurslar = await kurslarOl(id);
  return `${ism}: ${kurslar.join(', ')}`;
}
```

Xuddi shu narsa `then` bilan:

```js
function profilYukla(id) {
  return malumotOl(id).then((ism) =>
    kurslarOl(id).then((kurslar) => `${ism}: ${kurslar.join(', ')}`),
  );
}
```

## Qoidalar

- `await` faqat `async` funksiya ichida (yoki modulning yuqori darajasida) ishlaydi.
- `async` funksiya **doim Promise qaytaradi**. `return 5` → `Promise`, natijasi `5`.
- `await` funksiyani “to‘xtatib turadi”, lekin **sahifani emas** — boshqa kod va hodisalar ishlashda davom etadi.

## Xatolar: `try...catch`

Rad etilgan Promise `await` qatorida **xato tashlaydi**:

```js
document.getElementById('yukla').onclick = async function () {
  holat.textContent = 'Yuklanmoqda...';
  try {
    natija.textContent = await profilYukla(Number(idMaydon.value));
    xatoMatni.textContent = '';
  } catch (xato) {
    natija.textContent = '';
    xatoMatni.textContent = xato.message;
  } finally {
    holat.textContent = 'Tayyor';
  }
};
```

Sinxron koddagi kabi tanish `try...catch...finally`.

## Ketma-ket va parallel

```js
// Ketma-ket: 300 + 300 = ~600 ms
const a = await malumotOl(1);
const b = await malumotOl(2);

// Parallel: ~300 ms
const [x, y] = await Promise.all([malumotOl(1), malumotOl(2)]);
```

Ikkinchi so‘rov birinchisining natijasiga **bog‘liq bo‘lmasa** — parallel qiling.

## Sikl ichida `await`

```js
for (const id of [1, 2, 3]) {
  const ism = await malumotOl(id); // birin-ketin
}

// forEach await’ni kutmaydi — ishlatmang:
[1, 2, 3].forEach(async (id) => { await malumotOl(id); });
```

## Hodisa ishlovchisi `async` bo‘lishi mumkin

```js
tugma.addEventListener('click', async () => {
  tugma.disabled = true; // ikki marta bosilmasin
  try {
    await saqla();
  } finally {
    tugma.disabled = false;
  }
});
```

## Xulosa

| Uslub         | Afzalligi                       | Kamchiligi                  |
| ------------- | ------------------------------- | --------------------------- |
| Callback      | Oddiy holatlarda sodda          | Ichma-ich, xatolar tarqoq   |
| `then` zanjiri | Tekis, `catch` bitta           | Ko‘p qadamda o‘qish qiyin   |
| `async/await` | Sinxron kod kabi o‘qiladi       | `try/catch` ni unutmang     |

Zamonaviy kodda asosan `async/await` ishlatiladi.
