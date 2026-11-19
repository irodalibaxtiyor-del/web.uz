## Qatlamlar: `z-index`

Joylashtirilgan elementlar bir-birining ustiga tushishi mumkin. Qaysi biri **ustda** turishini `z-index` belgilaydi.

```css
.modal {
  position: fixed;
  z-index: 100;
}

.sarlavha {
  position: sticky;
  top: 0;
  z-index: 10;
}
```

Qiymati katta element ustda bo‘ladi. Manfiy qiymat ham mumkin: `z-index: -1` elementni otasining kontenti ostiga tushiradi.

## `z-index` qachon ishlaydi?

`z-index` faqat **joylashtirilgan** elementlarda (`position` qiymati `static` bo‘lmagan) hamda flex va grid bolalarida ishlaydi. Oddiy elementga `z-index: 999` yozsangiz, hech narsa o‘zgarmaydi.

## `z-index` bo‘lmasa

Elementlar HTML’dagi tartibda chiziladi: **keyingisi** oldingisining ustida bo‘ladi.

## Qatlam konteksti (stacking context)

Eng ko‘p chalkashtiradigan qoida: ba’zi elementlar o‘z bolalari uchun alohida “qatlam qutisi” yaratadi. Quti ichidagi `z-index` faqat shu quti ichida solishtiriladi.

```html
<div class="a" style="position: relative; z-index: 1">
  <div class="ichki" style="position: relative; z-index: 9999">…</div>
</div>
<div class="b" style="position: relative; z-index: 2">…</div>
```

`.ichki` ning `z-index` qiymati 9999 bo‘lsa ham, u `.b` ning **ostida** qoladi: chunki uning otasi `.a` (1) `.b` (2) dan pastda. Bola otasining qatlamidan chiqa olmaydi.

Qatlam kontekstini nimalar yaratadi:

- `position` + `z-index` (auto emas);
- `opacity` 1 dan kichik;
- `transform`, `filter`;
- `position: fixed` va `sticky`.

## Tartibli qiymatlar

Loyihada tasodifiy 999, 10000 kabi qiymatlar o‘rniga oz sonli darajalar ishlating:

| Daraja                 | `z-index` |
| ---------------------- | --------- |
| Oddiy kontent          | `auto`    |
| Yopishqoq sarlavha     | `10`      |
| Ochiladigan menyu      | `20`      |
| Modal fon va oyna      | `100`     |
| Bildirishnoma (toast)  | `200`     |

Bularni CSS o‘zgaruvchilarida saqlash qulay (9-modul).

```tekshir
`z-index: 999` bo‘lsa ham element ustga chiqmayapti. Eng ehtimolli sabab?
+ element joylashtirilmagan (`position: static`) yoki otasi o‘z qatlam kontekstini yaratgan
- `z-index` 1000 dan katta bo‘lishi kerak
- `z-index` faqat rasmlarda ishlaydi
> `z-index` joylashtirilgan va flex/grid elementlarda ishlaydi, bola esa otasining kontekstidan chiqa olmaydi.
```

```jonli
<style>
  div { position: absolute; width: 90px; height: 70px; color: white; padding: 4px; }
  .w { position: relative; height: 130px; }
</style>
<div class="w">
  <div style="background: teal; left: 0; top: 0; z-index: 2">z 2</div>
  <div style="background: crimson; left: 40px; top: 30px; z-index: 1">z 1</div>
  <div style="background: navy; left: 80px; top: 60px; z-index: 3">z 3</div>
</div>
```

## Xulosa

- `z-index` katta bo‘lsa, element ustda.
- Faqat joylashtirilgan (va flex/grid) elementlarda ishlaydi.
- Bola otasining qatlam kontekstidan chiqa olmaydi.
