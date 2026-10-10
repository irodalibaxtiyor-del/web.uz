## Web Storage nima?

Web Storage brauzerda **kalit–qiymat** ko‘rinishida ma’lumot saqlaydi. Masalan: tanlangan til, tungi rejim, yozilayotgan xat qoralamasi. Ma’lumot serverga yuborilmaydi va har bir sayt faqat o‘z ma’lumotini ko‘radi.

Ikki turi bor:

| Obyekt           | Qancha saqlanadi                               |
| ---------------- | ---------------------------------------------- |
| `localStorage`   | O‘chirilmaguncha (brauzer yopilsa ham qoladi)  |
| `sessionStorage` | Faqat shu tab yopilguncha                      |

Hajmi odatda sayt uchun taxminan 5 MB.

## Asosiy metodlar

```js
localStorage.setItem('tema', 'tungi');      // saqlash
const tema = localStorage.getItem('tema');  // o‘qish → 'tungi'
localStorage.removeItem('tema');            // bittasini o‘chirish
localStorage.clear();                       // hammasini o‘chirish
```

Kalit topilmasa, `getItem()` `null` qaytaradi.

## Faqat matn saqlanadi

Web Storage faqat **satr** saqlaydi. Son yoki obyektni saqlash uchun JSON’ga aylantiring:

```js
const sozlama = { til: 'uz', shrift: 18 };
localStorage.setItem('sozlama', JSON.stringify(sozlama));

const oqilgan = JSON.parse(localStorage.getItem('sozlama'));
console.log(oqilgan.shrift); // 18
```

## Misol: tashriflar hisoblagichi

```html
<p id="soni"></p>

<script>
  const soni = Number(localStorage.getItem('tashrif') || 0) + 1;
  localStorage.setItem('tashrif', soni);
  document.getElementById('soni').textContent = `Siz bu sahifani ${soni}-marta ochdingiz.`;
</script>
```

## Nimani saqlamaslik kerak

- **Parol, token va shaxsiy ma’lumotni saqlamang.** Sahifadagi istalgan skript `localStorage` ni o‘qiy oladi.
- Muhim ma’lumotni faqat brauzerga ishonmang: foydalanuvchi uni istalgan vaqtda tozalashi mumkin.

> **Platformada:** Ishga tushirish oynasi xavfsizlik uchun alohida izolyatsiya qilingan muhitda ishlaydi va u yerda `localStorage` mavjud emas (xato beradi). Misollarni kompyuteringizda `index.html` sifatida sinab ko‘ring.

## Xulosa

- `localStorage` — doimiy, `sessionStorage` — tab yopilguncha.
- `setItem`, `getItem`, `removeItem`, `clear`.
- Faqat satr saqlanadi: obyektlar uchun `JSON.stringify` / `JSON.parse`. Maxfiy ma’lumot saqlanmaydi.
