## Server-Sent Events nima?

Odatda brauzer serverdan ma’lumotni **so‘raydi**. Lekin ba’zan yangilik paydo bo‘lishi bilan serverning o‘zi xabar yuborishi kerak: yangi xabar, sport hisobi, valyuta kursi, buyurtma holati.

**Server-Sent Events (SSE)** — server brauzerga **bir tomonlama** doimiy oqim orqali xabar yuboradigan texnologiya.

## Brauzer tomoni: `EventSource`

```html
<h2>Jonli yangiliklar</h2>
<ul id="lenta"></ul>

<script>
  const lenta = document.getElementById('lenta');

  if ('EventSource' in window) {
    const manba = new EventSource('/yangiliklar');

    manba.onmessage = (e) => {
      const li = document.createElement('li');
      li.textContent = e.data;
      lenta.appendChild(li);
    };

    manba.onerror = () => {
      console.log('Ulanish uzildi, brauzer qayta urinib ko‘radi');
    };
  }
</script>
```

Ulanish uzilsa, brauzer **avtomatik qayta ulanadi**.

## Server tomoni

Server javobni `Content-Type: text/event-stream` bilan yuboradi. Har bir xabar `data:` bilan boshlanadi va bo‘sh qator bilan tugaydi:

```text
data: Toshkentda havo +24°C

data: Yangi dars qo‘shildi: SVG

```

Server istalgan dasturlash tilida (Node.js, PHP, Python) yozilishi mumkin — bu HTML kursi doirasidan tashqarida.

## Hodisalar

| Hodisa      | Qachon                   |
| ----------- | ------------------------ |
| `open`      | Ulanish o‘rnatildi       |
| `message`   | Yangi xabar keldi        |
| `error`     | Xato yoki ulanish uzildi |

Ulanishni yopish: `manba.close()`.

## SSE yoki WebSocket?

| SSE                                 | WebSocket                        |
| ----------------------------------- | -------------------------------- |
| Faqat server → brauzer              | Ikki tomonlama                   |
| Oddiy HTTP, avtomatik qayta ulanish | Alohida protokol                 |
| Bildirishnoma, lenta uchun qulay    | Chat, o‘yin uchun qulay          |

> **Platformada:** Ishga tushirish oynasi tarmoqqa ulanmaydi, shuning uchun SSE u yerda ishlamaydi. Uni sinab ko‘rish uchun `text/event-stream` qaytaradigan server kerak.

## Xulosa

- SSE — serverdan brauzerga bir tomonlama xabarlar oqimi.
- `new EventSource(url)` va `onmessage` — brauzer tomoni.
- Uzilsa, brauzer avtomatik qayta ulanadi; ikki tomonlama aloqa uchun WebSocket ishlatiladi.
