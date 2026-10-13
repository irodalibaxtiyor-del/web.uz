## Web Storage: `localStorage` va `sessionStorage`

Brauzerda **kalit-qiymat** juftliklarini saqlash. Cookie’dan farqli, serverga yuborilmaydi va hajmi kattaroq (odatda ~5 MB).

| Ombor             | Qancha yashaydi                       |
| ----------------- | ------------------------------------- |
| `localStorage`    | O‘chirilmaguncha (brauzer yopilsa ham) |
| `sessionStorage`  | Tab yopilguncha                       |

## Asosiy metodlar

```js
localStorage.setItem('mavzu', 'qorongi');
localStorage.getItem('mavzu');    // 'qorongi'
localStorage.getItem('yoq');      // null
localStorage.removeItem('mavzu');
localStorage.clear();             // hammasini o‘chirish
localStorage.length;              // nechta kalit
```

## Faqat satrlar

Ombor faqat **satr** saqlaydi. Son, massiv yoki obyektni JSON’ga aylantiring:

```js
const eslatmalar = ['Birinchi', 'Ikkinchi'];
localStorage.setItem('eslatmalar', JSON.stringify(eslatmalar));

const oqilgan = JSON.parse(localStorage.getItem('eslatmalar') ?? '[]');
```

`?? '[]'` — hali hech narsa saqlanmagan bo‘lsa, bo‘sh massiv.

## Ombor ishlamasligi mumkin

`localStorage` quyidagi holatlarda xato beradi:

- maxfiy rejimning ba’zi variantlari;
- foydalanuvchi sayt ma’lumotlarini bloklagan;
- joy tugagan (`QuotaExceededError`);
- izolyatsiyalangan iframe — masalan, **mashq sahifasidagi preview**.

Shuning uchun omborni doim `try...catch` bilan o‘rang va **xotiradagi zaxira** bilan ishlang:

```js
const KALIT = 'eslatmalar';
let xotira = null; // ombor ishlamasa

function oqi() {
  try {
    return JSON.parse(localStorage.getItem(KALIT) ?? '[]');
  } catch {
    return xotira ?? [];
  }
}

function yoz(royxat) {
  xotira = royxat;
  try {
    localStorage.setItem(KALIT, JSON.stringify(royxat));
  } catch {
    // ombor yo‘q — xotirada qoladi, sahifa baribir ishlaydi
  }
}
```

Sahifa ombor bo‘lmasa ham ishlaydi, faqat yangilanganda ma’lumot saqlanmaydi.

## Boshqa tablar bilan

Boshqa tabda `localStorage` o‘zgarsa, joriy tabda `storage` hodisasi sodir bo‘ladi:

```js
window.addEventListener('storage', (event) => {
  if (event.key === 'mavzu') mavzuniQoy(event.newValue);
});
```

## Nimani saqlamaslik kerak

- **Parol, token, shaxsiy ma’lumot** — sahifadagi har qanday skript (shu jumladan XSS orqali kiritilgani) `localStorage` ni o‘qiy oladi.
- Faqat foydalanuvchi qulayligi uchun narsalar: mavzu, til, qoralama, oxirgi ochilgan tab.

## Sozlamani eslab qolish

```js
const mavzu = (() => {
  try {
    return localStorage.getItem('mavzu') ?? 'yorug‘';
  } catch {
    return 'yorug‘';
  }
})();
document.body.classList.toggle('qorongi', mavzu === 'qorongi');
```
