## 60-30-10 qoidasi

Ichki dizayndan kelgan oddiy qoida interfeysda ham yaxshi ishlaydi:

- **60%** — asosiy (dominant) rang: sahifa foni, odatda neytral (oq, och kulrang);
- **30%** — ikkinchi darajali: kartalar, panellar, sarlavha qismi;
- **10%** — urg‘u: tugmalar, havolalar, muhim belgilar.

Urg‘u rangi kam bo‘lgani uchun ko‘z darhol unga tushadi. Agar har narsa yorqin bo‘lsa, hech narsa ajralib turmaydi.

## Ranglarga vazifa berish

Rangni nomi bilan emas, **vazifasi** bilan nomlang:

```css
:root {
  --fon: #f8fafc; /* 60% — sahifa foni */
  --sirt: #ffffff; /* 30% — kartalar */
  --urg: #0071dc; /* 10% — asosiy harakat */
  --matn: #0f172a;
  --matn-xira: #475569;
  --chegara: #e2e8f0;
}

body {
  background-color: var(--fon);
  color: var(--matn);
}
.karta {
  background-color: var(--sirt);
  border: 1px solid var(--chegara);
}
.tugma {
  background-color: var(--urg);
  color: white;
}
```

Ertaga brend rangi o‘zgarsa, faqat `--urg` qatori o‘zgaradi.

## Neytrallar — eng ko‘p ishlatiladigan ranglar

Yaxshi palitrada asosiy rangdan ko‘ra kulranglar ko‘proq: matn, ikkinchi darajali matn, chegaralar, ajratuvchilar, o‘chirilgan elementlar. Odatda 8–10 ta kulrang soya yetarli.

Sof qora (`#000`) matn oq fonda juda keskin; `#0f172a` kabi juda to‘q ko‘k-kulrang ko‘zni kamroq charchatadi.

## Holat ranglari

| Holat         | Rang               | Misol                   |
| ------------- | ------------------ | ----------------------- |
| Muvaffaqiyat  | Yashil             | “To‘lov qabul qilindi”  |
| Ogohlantirish | Sariq / to‘q sariq | “Muddat ertaga tugaydi” |
| Xato          | Qizil              | “Parol noto‘g‘ri”       |
| Ma’lumot      | Ko‘k               | “Yangi dars qo‘shildi”  |

Har biriga och fon va to‘q matn soyasi kerak bo‘ladi.

## Ko‘p uchraydigan xatolar

- Har bo‘lim uchun boshqa yorqin rang — sahifa “karnaval”ga aylanadi.
- Urg‘u rangini matnga ham, fonga ham, chegaraga ham ishlatish — u o‘z kuchini yo‘qotadi.
- Juda och kulrang matn — chiroyli ko‘rinadi, lekin o‘qib bo‘lmaydi (keyingi dars).

Mashqda qo‘pol ranglarni olib tashlab, uch rolli palitrani tokenlar orqali berasiz.
