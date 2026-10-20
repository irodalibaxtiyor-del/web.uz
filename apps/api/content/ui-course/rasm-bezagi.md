## Rasm — interfeysning bir qismi

Mahsulot rasmlari, avatarlar, muqovalar har xil o‘lcham va nisbatda yuklanadi. Agar ularni o‘z holicha qo‘ysak, to‘r notekis va tartibsiz ko‘rinadi. Bezashdan maqsad — har xil rasmlarni **bir xil ramkaga** solish.

## Bir xil nisbat

```css
.galereya img {
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
```

Keng va tik rasmlar ham bir xil 4:3 ramkada; ortiqcha qismi qirqiladi. Mahsulot (masalan, kitob muqovasi) to‘liq ko‘rinishi kerak bo‘lsa — `object-fit: contain` va neytral fon.

## Burchaklar

```css
.galereya img {
  border-radius: 12px;
}
```

Rasm burchaklari interfeysdagi boshqa elementlar (kartalar, tugmalar) bilan bir xil radiusda bo‘lsin. Rasm karta ichida bo‘lsa, ichki radius tashqi radiusdan biroz kichik: tashqi 16px, ichkarida 8px chetlar bilan — rasm 8px.

## Izoh

```css
figcaption {
  margin-top: 8px;
  font-size: 0.875rem;
  color: #475569;
}
```

`<figure>` va `<figcaption>` semantik juftlik: izoh aynan shu rasmga tegishli.

## Avatar halqasi

```css
.avatar {
  border-radius: 50%;
  object-fit: cover;
  box-shadow:
    0 0 0 2px white,
    0 0 0 4px #0071dc;
}
```

`box-shadow` ning tarqalish (_spread_) qiymati bilan soya o‘rniga halqa chiziladi. Ikki qavat: ichki oq (rasmni ajratadi) va tashqi rangli. Bu `border` dan farqli o‘laroq rasm o‘lchamini o‘zgartirmaydi.

## Rasm ustidagi matn

Banner rasm ustiga matn qo‘yilsa, rasmning qaysi qismi matn ostida bo‘lishini oldindan bilmaymiz. Kontrastni kafolatlash uchun:

```css
.banner {
  background-image: linear-gradient(rgb(0 0 0 / 0.55), rgb(0 0 0 / 0.55)), url('banner.jpg');
  background-size: cover;
  color: white;
}
```

Yarim shaffof qatlam istalgan rasmda oq matnni o‘qiladigan qiladi.

## Yuklanish holati

Rasm yuklanguncha joyi bo‘sh qolmasin: `aspect-ratio` joy ajratadi, ozgina kulrang fon (`background-color: #e2e8f0`) esa “bu yerda rasm bor” deydi.

Mashqda galereya rasmlarini bir xil ramkaga solib, avatar halqasini yasaysiz.
