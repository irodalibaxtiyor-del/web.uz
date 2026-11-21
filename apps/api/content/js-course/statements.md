## Buyruqlar (statements)

Dastur — kompyuter bajaradigan **buyruqlar ro‘yxati**. JavaScript’da har bir buyruq odatda alohida qatorga yoziladi va **nuqta-vergul** (`;`) bilan tugaydi:

```js
let narx = 12000;
let soni = 3;
let jami = narx * soni;
document.getElementById('jami').textContent = jami;
```

Buyruqlar **yozilgan tartibda**, yuqoridan pastga bajariladi. `jami` ni hisoblashdan oldin `narx` va `soni` tayyor bo‘lishi shart.

## Buyruq nimalardan iborat

Buyruq quyidagilarni o‘z ichiga oladi:

- **qiymatlar** — `12000`, `'Salom'`;
- **operatorlar** — `=`, `*`, `+`;
- **ifodalar** — `narx * soni`;
- **kalit so‘zlar** — `let`, `if`, `function`;
- **izohlar** — `// ...`.

## Nuqta-vergul

```js
let a = 5; let b = 6; let c = a + b;
```

Bir qatorda bir nechta buyruq bo‘lsa, ular `;` bilan ajratiladi. Qator oxirida `;` ni JavaScript ko‘pincha o‘zi qo‘yadi, lekin bunga tayanmang — **doim yozing**. Bu kurs shu uslubda.

## Bo‘sh joylar va qatorlar

JavaScript ortiqcha bo‘sh joylarga e’tibor bermaydi. Bu ikki qator bir xil:

```js
let ism='Ali';
let ism = 'Ali';
```

Lekin ikkinchisini o‘qish osonroq. Operatorlar atrofiga bo‘sh joy qo‘ying, uzun qatorlarni (80 belgidan ko‘p) operatordan keyin bo‘ling:

```js
document.getElementById('xabar').textContent =
  'Buyurtmangiz qabul qilindi. Tez orada bog‘lanamiz.';
```

## Kod bloklari

Jingalak qavslar `{ ... }` ichidagi buyruqlar **bitta guruh** — blok. Blok birga bajariladi, masalan tugma bosilganda:

```js
document.getElementById('tozalash').onclick = function () {
  document.getElementById('holat').textContent = 'Tozalandi';
  document.getElementById('soni').textContent = '0';
};
```

Blok ichidagi buyruqlar faqat tugma **bosilganda** ishlaydi, sahifa ochilganda emas.

## Kalit so‘zlar

Ba’zi so‘zlar til uchun band qilingan va ularni nom sifatida ishlatib bo‘lmaydi:

| Kalit so‘z  | Ma’nosi                                   |
| ----------- | ----------------------------------------- |
| `let`       | O‘zgaruvchi e’lon qilish                   |
| `const`     | O‘zgarmas e’lon qilish                     |
| `if`        | Shartga qarab bajarish                    |
| `for`       | Takrorlash                                |
| `function`  | Funksiya e’lon qilish                      |
| `return`    | Funksiyadan qiymat qaytarish              |

Ularning har birini keyingi darslarda batafsil o‘rganamiz.

```tekshir
JavaScript’da buyruqlar odatda nima bilan ajratiladi?
+ nuqtali vergul `;`
- vergul `,`
- ikki nuqta `:`
> Nuqtali vergul ko‘pincha avtomatik qo‘yiladi, lekin uni har doim yozish xatolardan saqlaydi.
```

```jonli
<pre id="out"></pre>
<script>
  // log() natijani shu oynaga chiqaradi (console.log o‘rniga)
  const log = (...a) => (document.getElementById('out').textContent += a.map((x) => (typeof x === 'object' && x !== null ? JSON.stringify(x) : String(x))).join(' ') + '\n');
  let a = 5;
  let b = 7;
  let c = a + b;
  log('Natija:', c);
</script>
```
