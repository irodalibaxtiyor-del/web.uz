## Ko‘z guruhlarni masofa bo‘yicha ko‘radi

Gestalt psixologiyasining **yaqinlik** qoidasi: bir-biriga yaqin turgan narsalarni miya bitta guruh deb qabul qiladi. Interfeysda bu eng kuchli va eng arzon vosita — chiziq yoki rang qo‘shmasdan, faqat masofa bilan tuzilma yaratish mumkin.

## Formadagi odatiy xato

```css
.forma {
  gap: 8px;
} /* maydonlar orasida */
.maydon {
  gap: 24px;
} /* yorliq va maydon orasida */
```

Natija: “Telefon” yorlig‘i o‘z maydonidan uzoqda, yuqoridagi “Ism” maydoniga yaqin turibdi. Foydalanuvchi qaysi yorliq qaysi maydonniki ekanini o‘ylab qoladi.

To‘g‘risi teskari:

```css
.maydon {
  gap: 6px;
} /* yorliq maydonga yopishgan */
.forma {
  gap: 24px;
} /* guruhlar aniq ajralgan */
```

## Sarlavhalar

Sarlavha **o‘zidan keyingi** matnga tegishli. Demak undan oldingi bo‘shliq katta, keyingisi kichik bo‘lishi kerak:

```css
h2 {
  margin-top: 24px;
  margin-bottom: 0;
}
```

Ko‘p sahifalarda brauzer standarti (`margin: 0.83em 0` — tepa va past teng) ishlatiladi va sarlavha ikki bo‘lim o‘rtasida “osilib” qoladi.

## Boshqa Gestalt qoidalari

| Qoida        | Ma’nosi                            | Interfeysda                |
| ------------ | ---------------------------------- | -------------------------- |
| Yaqinlik     | Yaqin — bir guruh                  | Oraliqlar                  |
| O‘xshashlik  | Bir xil ko‘rinish — bir xil vazifa | Hamma havolalar bir rangda |
| Umumiy hudud | Bir ramka ichida — bir guruh       | Karta, fon                 |
| Uzluksizlik  | Bir chiziqda — bog‘liq             | Tekislash, ro‘yxatlar      |

Avval yaqinlikdan foydalaning. Agar masofa yetmasa — umumiy fon yoki chegara. Har bir guruhni ramkaga solish sahifani “quti-quti” qilib, og‘irlashtiradi.

## Ichki va tashqi oraliq

Oddiy qoida: **ichki oraliq ≤ tashqi oraliq**. Tugma ichidagi matn va ikonka orasi < tugmaning chetlari < tugmalar orasi < bo‘limlar orasi. Har bir daraja oldingisidan kattaroq — shunda tuzilma o‘z-o‘zidan o‘qiladi.

Mashqda formadagi oraliqlarni yaqinlik qoidasi bo‘yicha qayta taqsimlaysiz.
