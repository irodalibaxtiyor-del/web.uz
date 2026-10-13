## Loyiha: kurslar katalogi

Real saytlardagi eng ko‘p uchraydigan interfeys: ma’lumotlar ro‘yxati + qidiruv + filtr + saralash.

## Talablar

1. `KURSLAR` massividan kartalar chiziladi (nom, daraja, narx).
2. **Qidiruv** — har bir harf yozilganda (`input`), nom bo‘yicha, katta-kichik harfsiz.
3. **Daraja** tugmalari: Hammasi / Boshlang‘ich / O‘rta / Yuqori. Faol tugma ajralib tursin.
4. **Saralash**: narx bo‘yicha o‘sish yoki kamayish.
5. Yuqorida: **Topildi: 3 ta kurs**. Hech narsa topilmasa — **Hech narsa topilmadi**.
6. Qidiruv, filtr va saralash **birgalikda** ishlaydi.

## Asosiy g‘oya: hosila ma’lumot

Asl massiv **o‘zgarmaydi**. Har safar holatdan yangi ro‘yxat **hisoblanadi**:

```js
const holat = { qidiruv: '', daraja: 'hammasi', tartib: null };

function korinadiganlar() {
  const q = holat.qidiruv.trim().toLowerCase();
  let natija = KURSLAR.filter(
    (k) =>
      k.nom.toLowerCase().includes(q) &&
      (holat.daraja === 'hammasi' || k.daraja === holat.daraja),
  );
  if (holat.tartib === 'osish') natija = natija.toSorted((a, b) => a.narx - b.narx);
  if (holat.tartib === 'kamayish') natija = natija.toSorted((a, b) => b.narx - a.narx);
  return natija;
}
```

`filter` va `toSorted` yangi massiv qaytaradi — `KURSLAR` buzilmaydi. Shuning uchun filtrni olib tashlaganingizda barcha kurslar qaytadi.

## Chizish

```js
function chiz() {
  const royxat = korinadiganlar();
  katalog.replaceChildren(...royxat.map(kartaYasa));
  topildi.textContent = royxat.length
    ? `Topildi: ${royxat.length} ta kurs`
    : 'Hech narsa topilmadi';
}
```

`replaceChildren(...elementlar)` — eski kartalarni o‘chirib, yangilarini bir amalda qo‘yadi.

## Hodisalar

```js
qidiruvMaydon.addEventListener('input', () => {
  holat.qidiruv = qidiruvMaydon.value;
  chiz();
});

darajalar.addEventListener('click', (event) => {
  const t = event.target.closest('[data-daraja]');
  if (!t) return;
  holat.daraja = t.dataset.daraja;
  for (const b of darajalar.children) b.classList.toggle('faol', b === t);
  chiz();
});
```

## Tezlik

8 ta kurs uchun har harfda qayta chizish — muammo emas. Minglab element bo‘lsa:

- **debounce** — foydalanuvchi yozishni to‘xtatgandan 200 ms keyin qidirish;
- natijalarni sahifalarga bo‘lish (pagination) yoki “yana ko‘rsatish”.

```js
function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}
```

Bu — yopilma (closure) va taymerning amaliy birikmasi.

## Holatni URL’da saqlash

Filtrlangan sahifani havola orqali ulashish uchun holatni `URLSearchParams` ga yozing (`history.replaceState`) va sahifa ochilganda o‘qing. Bu “location va history” darsidagi bilimlarni qo‘llash uchun yaxshi qo‘shimcha vazifa.
