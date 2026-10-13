## Izohlar

**Izoh** — brauzer bajarmaydigan matn. U kodni tushuntirish yoki vaqtincha o‘chirib qo‘yish uchun yoziladi.

## Bir qatorli izoh

`//` dan keyin qator oxirigacha bo‘lgan hamma narsa izoh:

```js
// Kurs narxini hisoblaymiz
let narx = 450000;
let chegirma = 0.1; // 10 foiz
```

## Ko‘p qatorli izoh

`/*` va `*/` orasidagi hamma narsa:

```js
/*
  Bu fayl kurs sahifasidagi tugmalarni boshqaradi.
  Muallif: WEBDIZAYN.UZ jamoasi
*/
```

## Kodni vaqtincha o‘chirish

Izoh xatolikni qidirishda juda foydali: shubhali qatorni o‘chirmasdan, izohga aylantirib ko‘rasiz:

```js
document.getElementById('rang').textContent = 'qizil';
// document.getElementById('rang').textContent = 'yashil';
```

Ikkinchi qator bajarilmaydi. Muammo yo‘qolsa — sabab o‘sha qatorda.

Muharrirda qatorni tanlab `Ctrl + /` bossangiz, u izohga aylanadi (yoki aksincha).

## Xato skriptni to‘xtatadi

Agar bir qatorda xato bo‘lsa, skript **o‘sha joyda to‘xtaydi** — undan keyingi qatorlar bajarilmaydi:

```js
document.getElementById('a').textContent = '1'; // bajariladi
nomaLumFunksiya();                              // ReferenceError — skript shu yerda to‘xtaydi
document.getElementById('b').textContent = '2'; // bajarilmaydi!
```

Shuning uchun bitta xato sahifadagi boshqa funksiyalarni ham “o‘chirib” qo‘yishi mumkin.

## Yaxshi izoh qanday bo‘ladi

Izoh kod **nima** qilayotganini emas, **nega** shunday qilinganini tushuntirsin:

```js
// Yomon: ko‘rinib turgan narsani takrorlaydi
let soni = 0; // soni ga 0 beramiz

// Yaxshi: sababni tushuntiradi
let soni = 0; // savat har safar sahifa ochilganda bo‘shdan boshlanadi
```

Eskirgan izoh izohsiz koddan ham yomon: kodni o‘zgartirsangiz, izohni ham yangilang.
