## Bir ekran — bitta asosiy harakat

Foydalanuvchi sahifada nima qilishi kerakligini bir qarashda tushunishi lozim. Agar uchta tugma bir xil yorqin bo‘lsa, u to‘xtab o‘ylaydi — va ba’zan hech birini bosmaydi.

## Harakatlar darajasi

| Daraja            | Ko‘rinish                                       | Misol              |
| ----------------- | ----------------------------------------------- | ------------------ |
| Asosiy            | To‘ldirilgan, urg‘u rangi                       | “Buyurtma berish”  |
| Ikkinchi darajali | Chegarali, foni shaffof                         | “Savatga qo‘shish” |
| Uchinchi darajali | Havola ko‘rinishida                             | “Keyinroq”         |
| Xavfli            | Qizil (ko‘pincha ikkinchi darajali ko‘rinishda) | “O‘chirish”        |

```css
.tugma-ikkinchi {
  background-color: transparent;
  color: #005bb5;
}

.tugma-uchinchi {
  background-color: transparent;
  border-color: transparent;
  color: #005bb5;
  text-decoration: underline;
}
```

Barcha tugmalarning o‘lchami va shakli bir xil qoladi — faqat “ovozi” farq qiladi.

## Sahifa darajasida ierarxiya

Ko‘z sahifani odatda “F” yoki “Z” shaklida ko‘zdan kechiradi: yuqori chapdan boshlab o‘ngga, keyin pastga. Shuning uchun:

1. Eng muhim xabar — yuqorida va chapda (yoki markazda).
2. Asosiy tugma — xabar yonida yoki ostida.
3. Ikkinchi darajali ma’lumot — pastroqda va xiraroq.

## Ierarxiyani tekshirish usullari

- **Ko‘zni qisib qarash** (_squint test_): ekranga ko‘zni qisib qarang. Xira ko‘rinishda qaysi element birinchi ajralib turadi? U asosiy harakat bo‘lishi kerak.
- **Kulrang rejim**: sahifani rangsiz qilib ko‘ring (DevTools → Rendering → “Emulate vision deficiency: achromatopsia”). Ierarxiya faqat rangga tayangan bo‘lsa, u yo‘qoladi.
- **5 soniya testi**: kimgadir sahifani 5 soniya ko‘rsatib, nima haqida ekanini va nima qilish kerakligini so‘rang.

## Xavfli harakatlar

“O‘chirish” kabi qaytarib bo‘lmaydigan amal asosiy tugmadek yorqin bo‘lmasin — tasodifan bosilishi mumkin. U ko‘pincha qizil matnli ikkinchi darajali tugma va tasdiqlash oynasi bilan beriladi.

Mashqda uchta bir xil tugmani uch darajali harakatga aylantirasiz.
