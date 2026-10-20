## Ko‘rinmas chiziqlar

Yaxshi dizaynda elementlar tasodifan emas, **ko‘rinmas chiziqlar** bo‘ylab turadi: sarlavha, matn va tugma bitta chap chetdan boshlanadi; ustunlar bir xil balandlikda; ikonka matnning o‘rtasida. Ko‘z bu tartibni sezmaydi, lekin u buzilsa, darhol sezadi.

## Matnni tekislash

- **Chapga** — ko‘p qatorli matn uchun deyarli har doim. Har bir qator bir joydan boshlanadi, ko‘z keyingi qatorni oson topadi.
- **Markazga** — faqat qisqa matn: sarlavha, bir-ikki qatorli kirish, tugma. Uch qatordan uzun markazlangan matn o‘qishni charchatadi.
- **Ikki tomonga** (`justify`) — veb’da kamdan-kam: so‘zlar orasida “daryolar” paydo bo‘ladi, ayniqsa tor ustunlarda.
- **O‘ngga** — raqamli ustunlar.

## Raqamlar

```css
.son {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
```

Raqamlar o‘ng tomondan tekislanganda birliklar, o‘nliklar, yuzliklar bir ustunda turadi — summalarni solishtirish oson. `tabular-nums` har bir raqamni bir xil kenglikda qiladi (“1” ham “8” kabi keng).

## Flexbox bilan tekislash

```css
.nav {
  display: flex;
  align-items: center; /* vertikal markaz */
  justify-content: space-between; /* chetlarga */
}
```

Logo 24px, havola 16px bo‘lsa ham, ikkalasi bir chiziqda turadi. Ikonka + matn juftliklarida ham `align-items: center` kerak, aks holda ikonka matndan biroz yuqori yoki past “sakrab” turadi.

## Optik tekislash

Ba’zan matematik to‘g‘ri tekislash ko‘zga noto‘g‘ri ko‘rinadi:

- uchburchakli “play” ikonkasi doira ichida markazda turganda chapga siljigandek ko‘rinadi — uni 1–2px o‘ngga siljitishadi;
- katta sarlavhaning birinchi harfi (masalan, “T”) chap chetdan biroz ichkarida ko‘rinadi.

Bular nozik sozlashlar; avval asosiy chiziqlarni to‘g‘rilang.

## To‘r

Sahifa darajasida tekislashni 12 ustunli to‘r yoki konteyner ta’minlaydi: hamma bo‘limlar bir xil `max-width` va chetlarga ega bo‘lsa, ular ostma-ost tekis turadi.

Mashqda navigatsiya, karta matni va narxlar jadvalini to‘g‘ri tekislaysiz.
