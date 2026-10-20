## Ko‘z qayerga qaraydi?

Foydalanuvchi sahifani o‘qimaydi — **ko‘zdan kechiradi**. Ierarxiya unga nima muhimligini bir qarashda ko‘rsatadi. Kitob kartasida bu: nomi va narxi birinchi, muallif va yil ikkinchi, toifa — kichik yorliq.

## Ierarxiya vositalari

| Vosita   | Kuchliroq                | Kuchsizroq       |
| -------- | ------------------------ | ---------------- |
| O‘lcham  | 20px                     | 14px             |
| Qalinlik | 600–700                  | 400              |
| Rang     | to‘q (`#0f172a`)         | xira (`#64748b`) |
| Holat    | bosh harf, rangli yorliq | oddiy matn       |
| Joy      | tepada, chapda           | pastda           |

Bitta element uchun bir-ikki vosita yetarli. Har narsani bir vaqtda katta, qalin va rangli qilsangiz, hech narsa ajralib turmaydi.

## Misol

```css
.toifa {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #005bb5;
}

.nomi {
  font-size: 1.25rem;
  font-weight: 600;
}
.meta {
  font-size: 0.875rem;
  color: #64748b;
}
.narx {
  font-size: 1.25rem;
  font-weight: 700;
}
```

## Qalinlik shkalasi

Ko‘p shriftlarda 100 dan 900 gacha qalinlik bor. Interfeys uchun odatda uchtasi yetarli:

- **400** — oddiy matn;
- **600** — sarlavhalar, tugmalar, muhim so‘zlar;
- **700** — raqamlar, narx, juda kuchli urg‘u.

Juda ingichka (100–300) shriftlar kichik o‘lchamda va past kontrastda o‘qilmaydi — ularni faqat katta sarlavhalarda ishlating.

## Xira rang — kichik matn emas

Ikkinchi darajali matnni bir vaqtda kichik **va** xira **va** ingichka qilish — o‘qilmaydigan matnning odatiy sababi. Bittasini tanlang: yo kichikroq, yo xiraroq (lekin kontrast 4.5:1 dan kam emas).

## Raqamlar

Narx va statistika uchun `font-variant-numeric: tabular-nums` — raqamlar bir xil kenglikda, ustunlarda tekis turadi. Ming xonalarini bo‘sh joy bilan ajratish (`45 000`) o‘qishni osonlashtiradi.

Mashqda kitob kartasidagi matnlarga to‘g‘ri darajalar berasiz.
