## Loyiha: vazifalar menejeri

Kurs davomida o‘rganilgan deyarli hamma narsani bitta ilovada birlashtiramiz: massiv va obyektlar, DOM’da element yaratish, hodisalar delegatsiyasi, formalar va `localStorage`.

## Talablar

1. Formadan yangi vazifa qo‘shish (`Enter` bilan ham), bo‘sh vazifa qo‘shilmaydi.
2. Har bir vazifada **checkbox** (bajarildi) va **O‘chirish** tugmasi.
3. Filtr tugmalari: **Hammasi**, **Faol**, **Bajarilgan**.
4. Hisoblagich: **2 ta vazifa qoldi**.
5. Sahifa yangilanganda vazifalar saqlanib qoladi (`localStorage`, ombor ishlamasa — xotirada).
6. Foydalanuvchi matni hech qachon HTML sifatida o‘qilmaydi.

## Arxitektura: holat → chizish

Katta xatolar manbai — ma’lumotni **DOM’da** saqlash va har joyda DOM’ni qo‘lda o‘zgartirish. Buning o‘rniga:

```text
holat (massiv)  ──chiz()──▶  DOM
     ▲                        │
     └──── hodisalar ◀────────┘
```

1. **Holat** — yagona haqiqat manbai:

```js
let vazifalar = []; // [{ id, matn, bajarildi }]
let filtr = 'hammasi';
```

2. **`chiz()`** — holatdan DOM’ni **to‘liq** qayta quradi. U hech narsani o‘zgartirmaydi, faqat ko‘rsatadi.

3. **Hodisalar** — holatni o‘zgartiradi, keyin `saqla()` va `chiz()` ni chaqiradi.

```js
function qosh(matn) {
  vazifalar.push({ id: Date.now(), matn, bajarildi: false });
  saqla();
  chiz();
}
```

Shunda hisoblagich, filtr va ro‘yxat **hech qachon** bir-biriga zid bo‘lmaydi.

> `Date.now()` bir millisoniyada ikki marta chaqirilsa, bir xil ID beradi. Ishonchli ID uchun hisoblagich (`let keyingiId = 1`) yoki `crypto.randomUUID()` ishlating.

## Elementni yaratish

```js
function vazifaElementi(v) {
  const li = document.createElement('li');
  li.dataset.id = v.id;
  li.classList.toggle('bajarilgan', v.bajarildi);

  const belgi = document.createElement('input');
  belgi.type = 'checkbox';
  belgi.checked = v.bajarildi;

  const matn = document.createElement('span');
  matn.textContent = v.matn;

  const ochir = document.createElement('button');
  ochir.type = 'button';
  ochir.className = 'ochir';
  ochir.textContent = 'O‘chirish';

  li.append(belgi, matn, ochir);
  return li;
}
```

## Delegatsiya

Har bir checkbox va tugmaga alohida ishlovchi o‘rniga — ro‘yxatga bitta:

```js
royxat.addEventListener('click', (event) => {
  const li = event.target.closest('li');
  if (!li) return;
  const id = Number(li.dataset.id);
  if (event.target.matches('input[type="checkbox"]')) belgila(id);
  if (event.target.matches('.ochir')) ochir(id);
});
```

## Filtr

```js
const korinadigan = vazifalar.filter((v) =>
  filtr === 'faol' ? !v.bajarildi : filtr === 'bajarilgan' ? v.bajarildi : true,
);
```

## Saqlash

“localStorage” darsidagi `oqi()`/`yoz()` naqshidan foydalaning: `try...catch` va xotiradagi zaxira.

## Kengaytirish g‘oyalari

- vazifani ikki marta bosib tahrirlash;
- muddat (sana) va muddati o‘tganlarni qizil ko‘rsatish;
- “Bajarilganlarni tozalash” tugmasi;
- sudrab tartiblash (`dragstart`, `drop`).
