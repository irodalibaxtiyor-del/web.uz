## Jumbotron

**Jumbotron** — sahifaning eng muhim xabarini ko‘rsatadigan katta, kulrang fonli blok. Odatda bosh sahifaning yuqorisida turadi: sarlavha, qisqa tavsif va asosiy tugma.

```html
<div class="container">
  <div class="jumbotron">
    <h1>Veb-dizayn kursi</h1>
    <p>Uch oyda HTML, CSS va Bootstrap bilan birinchi saytingizni yarating.</p>
    <p><a class="btn btn-primary btn-lg" href="#">Boshlash</a></p>
  </div>
  <p>Qolgan kontent...</p>
</div>
```

`.jumbotron` beradi:

- kulrang fon (`#eee`);
- katta ichki bo‘shliq (keng ekranda 48px yuqori/past, 60px yon tomonlar);
- yumaloq burchaklar (konteyner ichida bo‘lsa);
- ichidagi `<p>` lar kattaroq (21px) shriftda.

## To‘liq kenglikdagi jumbotron

Jumbotron ekranning butun kengligini egallashi uchun uni konteynerdan **tashqariga** chiqaring, kontentni esa jumbotron **ichidagi** konteynerga joylang:

```html
<div class="jumbotron">
  <div class="container">
    <h1>Veb-dizayn kursi</h1>
    <p>Kontent markazda, fon esa butun ekran bo‘ylab.</p>
  </div>
</div>
```

Bunday holda burchaklar yumaloq bo‘lmaydi.

## Sahifa sarlavhasi (page header)

Bo‘lim sarlavhasini pastki chiziq bilan ajratish uchun `.page-header`:

```html
<div class="page-header">
  <h1>Kurslar <small>2026-yil kuzi</small></h1>
</div>
```

`.page-header` sarlavha ostida bo‘sh joy va ingichka kulrang chiziq qo‘shadi.

## Qachon ishlatiladi?

| Komponent      | Qayerda                                     |
| -------------- | ------------------------------------------- |
| `.jumbotron`   | Bosh sahifa, aksiya, kursga yozilish chaqirig‘i |
| `.page-header` | Ichki sahifalarda bo‘lim nomi               |

Bitta sahifada bittadan ortiq jumbotron qo‘ymang — u “eng muhim joy” bo‘lgani uchun ta’sirli.

## Xulosa

- `.jumbotron` — katta, kulrang, e’tiborni tortadigan blok.
- To‘liq kenglik: jumbotron tashqarida, `.container` uning ichida.
- `.page-header` — sarlavha ostida chiziq.
