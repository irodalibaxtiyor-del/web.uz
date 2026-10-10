## Muammo: sahifa “qotib qoladi”

JavaScript sahifada **bitta oqimda** ishlaydi. Agar og‘ir hisob (masalan, millionlab sonni saralash) bajarilsa, shu vaqt davomida tugmalar bosilmaydi, sahifa aylantirilmaydi — foydalanuvchiga “sayt osilib qoldi” bo‘lib ko‘rinadi.

## Web Worker nima?

**Web Worker** — JavaScript’ni **fonda**, alohida oqimda bajaradi. Sahifa esa javob berishda davom etadi.

Cheklovlari:

- worker DOM’ga (`document`, `window`) kira olmaydi;
- sahifa bilan faqat **xabarlar** (`postMessage`) orqali gaplashadi;
- alohida JS faylda yoziladi.

## Worker fayli: `hisob.js`

```js
// hisob.js — fonda ishlaydi
onmessage = (e) => {
  const n = e.data;
  let yigindi = 0;
  for (let i = 1; i <= n; i++) yigindi += i;
  postMessage(yigindi); // natijani sahifaga qaytarish
};
```

## Sahifa: `index.html`

```html
<button onclick="boshlash()">Hisoblash</button>
<p id="natija">Kutilmoqda…</p>

<script>
  let worker;

  function boshlash() {
    if (!window.Worker) {
      document.getElementById('natija').textContent = 'Brauzer worker’ni qo‘llab-quvvatlamaydi';
      return;
    }
    worker = new Worker('hisob.js');
    worker.onmessage = (e) => {
      document.getElementById('natija').textContent = 'Natija: ' + e.data;
      worker.terminate(); // ish tugadi — workerni yopamiz
    };
    worker.postMessage(1000000000);
  }
</script>
```

Hisob davom etayotganda ham sahifadagi boshqa tugmalar ishlayveradi.

## Asosiy imkoniyatlar

| Kod                       | Vazifasi                          |
| ------------------------- | --------------------------------- |
| `new Worker('fayl.js')`   | Worker yaratish                   |
| `worker.postMessage(x)`   | Workerga ma’lumot yuborish        |
| `worker.onmessage`        | Workerdan javob olish             |
| `worker.terminate()`      | Workerni to‘xtatish               |
| `postMessage(x)` (ichida) | Sahifaga javob yuborish           |

## Qachon kerak?

- katta hajmdagi ma’lumotni qayta ishlash;
- rasm filtrlari;
- murakkab matematik hisob.

Oddiy sahifalarda worker deyarli kerak bo‘lmaydi.

> **Platformada:** Ishga tushirish oynasida Web Worker’lar o‘chirilgan. Ikki faylni (`index.html` va `hisob.js`) kompyuteringizda bitta papkaga qo‘yib, mahalliy server (`localhost`) orqali sinab ko‘ring — fayl to‘g‘ridan-to‘g‘ri ochilsa, brauzer workerni yuklamasligi mumkin.

## Xulosa

- Worker og‘ir JavaScript’ni fonda bajaradi, sahifa qotmaydi.
- DOM’ga kira olmaydi; faqat `postMessage` / `onmessage` orqali gaplashadi.
- Ish tugagach `terminate()` bilan yoping.
