## Loyiha: shaxsiy sahifa

Bu darsda rezyume (portfolio) uslubidagi bir sahifali sayt yig‘amiz. U uch qismdan iborat:

1. **Bosh qism** — ism, kasb va qisqa ta’rif, doira shaklidagi rasm;
2. **Ko‘nikmalar** — uchta ustun;
3. **Footer** — aloqa ma’lumotlari.

## 1. Rangli bosh qism

To‘liq kenglikdagi rangli blok va ichida markazlashtirilgan kontent:

```html
<header class="bosh text-center">
  <div class="container">
    <img src="avatar.png" class="img-circle" alt="Aziza Karimova" width="200" height="200">
    <h1>Aziza Karimova</h1>
    <p class="lead">Frontend dasturchi</p>
  </div>
</header>
```

```css
.bosh {
  background-color: #0071dc;
  color: #fff;
  padding: 60px 0;
}
```

`.text-center` — matnni ham, `inline` element bo‘lgan rasmni ham markazga oladi.

## 2. Ko‘nikmalar bo‘limi

```html
<section class="container text-center">
  <h2>Ko‘nikmalarim</h2>
  <div class="row">
    <div class="col-sm-4">
      <span class="glyphicon glyphicon-console" aria-hidden="true"></span>
      <h3>HTML va CSS</h3>
      <p>Semantik va moslashuvchan sahifalar.</p>
    </div>
    <div class="col-sm-4">…</div>
    <div class="col-sm-4">…</div>
  </div>
</section>
```

Ikonkalarni kattalashtirish uchun:

```css
.konikma .glyphicon {
  font-size: 48px;
  color: #0071dc;
}
```

## 3. Footer

```html
<footer class="container-fluid text-center pastki">
  <p>Bog‘lanish: aziza@misol.uz</p>
</footer>
```

```css
.pastki {
  background-color: #0e1133;
  color: #fff;
  padding: 30px 0;
}
```

## Ranglar va ritm

- Butun saytda 2–3 asosiy rang yetarli: biri fon/aksent uchun, biri matn uchun.
- Bo‘limlar orasida bir xil vertikal bo‘shliq (masalan, 60px) sahifani tartibli ko‘rsatadi.
- Oq matn ko‘k fonda o‘qilishi uchun kontrast yetarli bo‘lsin (ko‘k to‘qroq bo‘lgani ma’qul).

## Moslashuvchanlikni tekshiring

- Telefonda: rasm, ism va ko‘nikmalar bitta ustunda, ustma-ust.
- Planshetdan boshlab: ko‘nikmalar uch ustunda.

## Xulosa

- To‘liq kenglikdagi rangli bo‘lim — o‘z klassingiz + ichida `.container`.
- `.text-center`, `.img-circle`, `.lead` — bosh qism uchun.
- Ko‘nikmalar — `.row` + `.col-sm-4` × 3, ikonkalar Glyphicons bilan.
