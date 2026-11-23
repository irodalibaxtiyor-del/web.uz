## Modal oyna telefonda

Kompyuterda modal oyna sahifa markazida kichik panel. Telefonda esa bunday panel ekranning yarmini egallaydi, chetlarida befoyda joy qoladi, ichidagi forma siqiladi. Odatda telefonda modal **butun ekranni** egallaydi.

## `<dialog>` elementi

```html
<button type="button" class="och">Fikr qoldirish</button>

<dialog class="oyna">
  <form method="dialog">
    <h2>Fikringiz</h2>
    <textarea></textarea>
    <button>Yopish</button>
  </form>
</dialog>
```

```js
document.querySelector('.och').addEventListener('click', () => {
  document.querySelector('.oyna').showModal();
});
```

`showModal()` bilan ochilgan oyna:

- sahifaning qolgan qismini “o‘lik” qiladi — orqadagi tugmalar bosilmaydi;
- fokusni ichida ushlaydi va yopilganda tugmaga qaytaradi;
- **Esc** bilan yopiladi;
- `method="dialog"` li forma tugmasi oynani yopadi.

Bularni qo‘lda yozish uchun avval o‘nlab qator JavaScript kerak edi.

## CSS

```css
.oyna {
  width: min(100% - 2rem, 32rem);
  padding: 24px;
  border: 0;
  border-radius: 12px;
}

.oyna::backdrop {
  background-color: rgb(15 23 42 / 0.6);
}

@media (max-width: 599px) {
  .oyna {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    margin: 0;
    border-radius: 0;
  }
}
```

Brauzer modal oynaga `max-width` va `max-height` cheklovini standart holda beradi — to‘liq ekran uchun ularni `none` qilish kerak.

`::backdrop` — oyna ortidagi qatlam. Uni xiralashtirish foydalanuvchiga “hozir faqat shu oyna bilan ishlayapsiz” degan signal beradi.

## Telefondagi nozikliklar

- Pastki chetdagi tugmalar iPhone’ning “uy chizig‘i” ostida qolmasligi uchun `padding-bottom: env(safe-area-inset-bottom)` qo‘shing (viewport tegida `viewport-fit=cover` bo‘lsa).
- Uzun kontent oynaning **ichida** aylansin: `overflow-y: auto`.
- Yopish tugmasi doim ko‘rinib tursin — tepada yoki pastda qotirilgan.

## Qachon modal kerak emas

Modal ishni to‘xtatadi. Uzun formalar, ko‘p qadamli jarayonlar uchun alohida sahifa yaxshiroq. Modal — tasdiqlash, qisqa forma, rasmni kattalashtirish uchun.

Mashqda modal oynani telefonda to‘liq ekranli, kompyuterda markazdagi panel qilasiz.

```tekshir
`<dialog>` elementini modal sifatida ochadigan metod qaysi?
+ `showModal()`
- `open()`
- `show()` (u modal emas)
> `showModal()` fonni bloklaydi, Esc bilan yopiladi va fokusni ichkarida ushlaydi.
```

```jonli
<style>
  dialog { width: min(90vw, 360px); border: 0; border-radius: 12px; }
  dialog::backdrop { background: rgb(0 0 0 / .5); }
</style>
<button id="o">Oynani ochish</button>
<dialog id="d"><p>Bu modal oyna. Esc yoki tugma bilan yoping.</p><form method="dialog"><button>Yopish</button></form></dialog>
<script>document.getElementById('o').onclick = () => document.getElementById('d').showModal();</script>
```
