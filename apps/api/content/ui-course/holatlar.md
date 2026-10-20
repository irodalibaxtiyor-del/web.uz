## Interfeys faqat “to‘liq” holatda emas

Dizaynerlar ko‘pincha ekranni ma’lumot bilan to‘la holatda chizadi. Lekin foydalanuvchi ko‘pincha boshqa holatlarni ko‘radi:

| Holat       | Qachon                                     |
| ----------- | ------------------------------------------ |
| Yuklanmoqda | Ma’lumot serverdan kelmoqda                |
| Bo‘sh       | Hali hech narsa yo‘q (yangi foydalanuvchi) |
| Xato        | Server javob bermadi, internet uzildi      |
| Qisman      | Bir qismi yuklandi                         |
| Juda ko‘p   | 10 000 qator, juda uzun nom                |

Har birini oldindan o‘ylash — professional interfeysning belgisi.

## Yuklanish: skelet

```css
.skeleton {
  background-color: #e2e8f0;
  border-radius: 6px;
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  50% {
    opacity: 0.45;
  }
}
```

**Skelet** — kontent joylashadigan joyda kulrang qutilar. Spinnerga nisbatan afzalliklari:

- foydalanuvchi nima kelishini oldindan ko‘radi;
- kontent kelganda sahifa “sakramaydi”;
- yuklanish tezroq tuyuladi.

Ekran o‘quvchi uchun yashirin “Yuklanmoqda…” matnini `role="status"` bilan qo‘shing.

## Harakatni kamaytirish

```css
@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}
```

Ba’zi odamlarda miltillash va harakat bosh aylanishi yoki bosh og‘rig‘iga sabab bo‘ladi. Tizim sozlamasini hurmat qiling.

## Bo‘sh holat

Yomon: “Ma’lumot yo‘q”. Yaxshi:

1. Nima uchun bo‘sh — “Hali vazifa yo‘q”.
2. Nima qilish kerak — “Birinchi vazifani qo‘shing”.
3. Harakat — tugma.

Bo‘sh holat — foydalanuvchini o‘rgatish uchun eng yaxshi joy.

## Xato holati

- Nima bo‘lganini oddiy tilda ayting (texnik kodlarsiz).
- Foydalanuvchi nima qila olishini taklif qiling: “Qayta urinish”.
- Uning yozgan ma’lumotini yo‘qotmang.
- Ekran o‘quvchiga `role="alert"` bilan e’lon qiling.

“500 Internal Server Error” — dasturchi uchun; foydalanuvchiga “Serverda xatolik. Birozdan keyin qayta urinib ko‘ring.”

## Chegara holatlari

Dizaynni sinash uchun ataylab “yomon” ma’lumot qo‘ying: juda uzun ism, nolta element, 1000 ta element, rasmsiz karta. Agar interfeys bunda buzilsa — `text-overflow: ellipsis`, `overflow-wrap: anywhere`, sahifalash yoki zaxira rasm kerak.

Mashqda yuklanish, bo‘sh va xato holatlarini bezaysiz.
