## Loyiha: test ilovasi

Savollar ma’lumotdan quriladigan, birma-bir ko‘rsatiladigan va oxirida natija chiqaradigan ilova.

## Talablar

1. Savollar `SAVOLLAR` massivida: matn, variantlar va to‘g‘ri javob indeksi.
2. Bir vaqtda **bitta** savol; yuqorida **1 / 3** ko‘rinishidagi progress.
3. Variant bosilganda: tanlov belgilanadi (to‘g‘ri — yashil, noto‘g‘ri — qizil), barcha variantlar **faolsizlanadi** (qayta tanlab bo‘lmaydi), **Keyingi** tugmasi faollashadi.
4. Oxirgi savoldan keyin — **Natija: 2 / 3** va **Qaytadan** tugmasi.
5. Qaytadan boshlanganda hammasi tozalanadi.

## Ma’lumot

```js
const SAVOLLAR = [
  {
    matn: 'Qaysi kalit so‘z qayta tayinlanmaydigan o‘zgaruvchi e’lon qiladi?',
    variantlar: ['let', 'const', 'var'],
    togri: 1,
  },
  // ...
];
```

Savollarni HTML’ga qattiq yozmang — interfeys ma’lumotdan **chiziladi**. Yangi savol qo‘shish uchun faqat massivga element qo‘shiladi.

## Holat

```js
const holat = {
  joriy: 0,      // qaysi savol
  ball: 0,
  javobBerildi: false,
};
```

## Chizish

```js
function savolniChiz() {
  const s = SAVOLLAR[holat.joriy];
  raqam.textContent = `${holat.joriy + 1} / ${SAVOLLAR.length}`;
  matn.textContent = s.matn;

  variantlar.replaceChildren();
  s.variantlar.forEach((v, i) => {
    const tugma = document.createElement('button');
    tugma.type = 'button';
    tugma.className = 'variant';
    tugma.textContent = v;
    tugma.dataset.indeks = i;
    variantlar.append(tugma);
  });

  keyingi.disabled = true;
}
```

## Javob

```js
variantlar.addEventListener('click', (event) => {
  const tugma = event.target.closest('.variant');
  if (!tugma || holat.javobBerildi) return;
  holat.javobBerildi = true;

  const togri = Number(tugma.dataset.indeks) === SAVOLLAR[holat.joriy].togri;
  if (togri) holat.ball++;
  tugma.classList.add(togri ? 'togri' : 'xato');

  for (const t of variantlar.children) t.disabled = true;
  keyingi.disabled = false;
});
```

`holat.javobBerildi` — ikki marta bosib ballni oshirishdan himoya. Faqat `disabled` ga tayanmang: holat ham buni bilsin.

## Keyingi va natija

```js
keyingi.addEventListener('click', () => {
  holat.joriy++;
  holat.javobBerildi = false;
  if (holat.joriy < SAVOLLAR.length) savolniChiz();
  else natijaniKorsat();
});
```

## Foydalanish qulayligi

- Variantlar — haqiqiy `<button>` lar: klaviatura bilan tanlash va fokus o‘z-o‘zidan ishlaydi.
- To‘g‘ri/noto‘g‘ri faqat **rang** bilan emas, belgi yoki matn bilan ham ko‘rsatilsin (✓ / ✗) — rangni ajrata olmaydiganlar uchun.
- Natija xabariga `role="status"` — ekran o‘quvchi uni o‘qiydi.

## Kengaytirish

- savollar va variantlarni aralashtirish (Fisher–Yates);
- vaqt chegarasi (`setInterval` bilan taymer);
- noto‘g‘ri javoblar ro‘yxatini oxirida ko‘rsatish.
