## DOM to‘plamlari

DOM elementlar guruhini ikki turdagi to‘plamda qaytaradi: `HTMLCollection` va `NodeList`. Ular massivga o‘xshaydi, lekin massiv **emas**.

## Qaysi metod nima qaytaradi

| Qayerdan                         | Turi             | Jonli? |
| -------------------------------- | ---------------- | ------ |
| `getElementsByClassName`         | `HTMLCollection` | Ha     |
| `getElementsByTagName`           | `HTMLCollection` | Ha     |
| `el.children`                    | `HTMLCollection` | Ha     |
| `querySelectorAll`               | `NodeList`       | Yo‘q   |
| `el.childNodes`                  | `NodeList`       | Ha     |

## Jonli va statik

**Jonli** to‘plam DOM o‘zgarishini darhol aks ettiradi. **Statik** — chaqirilgan paytdagi surat:

```js
const jonli = document.getElementsByClassName('mahsulot');
const statik = document.querySelectorAll('.mahsulot');

jonli.length;  // 3
statik.length; // 3

const yangi = document.createElement('li');
yangi.className = 'mahsulot';
royxat.append(yangi);

jonli.length;  // 4 — o‘zi yangilandi
statik.length; // 3 — o‘zgarmadi
```

Qachon bu muhim:

- holatni har safar yangidan bilish kerak bo‘lsa — jonli to‘plam yoki `querySelectorAll` ni **qayta** chaqirish;
- sikl ichida elementlarni o‘chirsangiz — **jonli** to‘plam bilan ehtiyot bo‘ling: uzunlik aylanish davomida kamayadi va elementlar o‘tkazib yuboriladi.

```js
// Xavfli: jonli to‘plam qisqarib boradi
const el = document.getElementsByClassName('eski');
for (let i = 0; i < el.length; i++) el[i].remove(); // yarmi qoladi!

// Xavfsiz: statik nusxa
for (const x of [...el]) x.remove();
```

## Massiv metodlari

Ikkalasida `length` va indeks bor. `NodeList` da `forEach` ham bor. Lekin `map`, `filter`, `reduce` — **yo‘q**:

```js
document.querySelectorAll('.mahsulot').map(...) // TypeError
```

Massivga aylantiring:

```js
const massiv = Array.from(toplam);
const massiv2 = [...toplam];
```

### Narxlar yig‘indisi

```js
const jami = Array.from(document.getElementsByClassName('mahsulot')).reduce(
  (s, el) => s + Number(el.dataset.narx),
  0,
);
```

Jonli to‘plamdan har safar hisoblasangiz, yangi qo‘shilgan mahsulotlar ham avtomatik kiradi.

## Nom bo‘yicha murojaat

`HTMLCollection` elementlarni `id` yoki `name` bo‘yicha ham beradi:

```js
document.forms.royxat;            // name="royxat" forma
forma.elements.email;             // name="email" maydon
```

## Qaysi birini ishlatish?

- Odatiy holat — `querySelectorAll` + spread (`[...]`): bashorat qilinadigan, massiv metodlari bilan.
- Ro‘yxat doim **hozirgi** holatni ko‘rsatishi kerak bo‘lsa — jonli to‘plam (yoki har safar qayta so‘rash).
