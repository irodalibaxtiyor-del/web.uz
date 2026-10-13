## `fetch` — server bilan ishlash

`fetch` — brauzerdan serverga HTTP so‘rov yuboradigan funksiya. U **Promise** qaytaradi.

```js
async function kurslarniYukla() {
  const javob = await fetch('/api/kurslar');
  if (!javob.ok) {
    throw new Error(`HTTP ${javob.status}`);
  }
  const kurslar = await javob.json();
  return kurslar;
}
```

## Ikki bosqich

1. `await fetch(url)` — server **sarlavhalari** kelguncha kutadi va `Response` obyektini beradi.
2. `await javob.json()` — tanani o‘qib, JSON sifatida parse qiladi (yoki `javob.text()`).

## `ok` ni tekshirish shart

`fetch` faqat **tarmoq** xatosida (internet yo‘q, server topilmadi) rad etiladi. Server `404` yoki `500` qaytarsa ham, Promise **muvaffaqiyatli** tugaydi!

```js
const javob = await fetch('/api/yoq');
javob.ok      // false
javob.status  // 404
```

Shuning uchun `if (!javob.ok) throw ...` qatori deyarli har doim kerak.

| `status`    | Ma’nosi                       |
| ----------- | ----------------------------- |
| 200–299     | Muvaffaqiyat (`ok` = `true`)  |
| 400         | Noto‘g‘ri so‘rov              |
| 401 / 403   | Kirilmagan / ruxsat yo‘q      |
| 404         | Topilmadi                     |
| 500         | Server xatosi                 |

## Ma’lumot yuborish (POST)

```js
const javob = await fetch('/api/izohlar', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ matn: 'Ajoyib dars!' }),
});
```

## To‘liq namuna: holatlar bilan

```js
document.getElementById('yukla').onclick = async function () {
  holat.textContent = 'Yuklanmoqda...';
  xatoMatni.textContent = '';
  try {
    const kurslar = await kurslarniYukla();
    royxat.textContent = kurslar.map((k) => k.nom).join(', ');
  } catch (xato) {
    xatoMatni.textContent = xato.message;
  } finally {
    holat.textContent = '';
  }
};
```

Foydalanuvchi uchta holatni ko‘rishi kerak: **yuklanmoqda**, **natija**, **xato**.

## Xavfsizlik cheklovlari

- **CORS**: brauzer boshqa domendagi serverga so‘rovni faqat o‘sha server ruxsat bersa bajaradi.
- Kalit va parollarni frontend kodiga yozmang — sahifa kodini har kim ko‘ra oladi.

## Mashq sahifasida tarmoq yopiq

Xavfsizlik uchun mashqlar preview’i va serverdagi tekshiruv **tashqi so‘rovlarni bloklaydi** — `fetch` u yerda xato beradi. Shuning uchun mashqda `soxtaFetch` beriladi. U haqiqiy `fetch` bilan **bir xil interfeysga** ega: `ok`, `status`, `json()`. Kodingizni keyin `fetch` ga almashtirsangiz, u haqiqiy server bilan ishlaydi.

```js
const javob = await soxtaFetch('/api/kurslar'); // mashqda
const javob = await fetch('/api/kurslar');      // haqiqiy loyihada
```
