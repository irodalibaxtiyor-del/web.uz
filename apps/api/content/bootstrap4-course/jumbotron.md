## Jumbotron

**Jumbotron** — sahifadagi eng muhim xabarni ko‘rsatadigan katta blok: sarlavha, qisqa tavsif va asosiy tugma.

```html
<div class="container">
  <div class="jumbotron">
    <h1 class="display-4">Veb-dizayn maktabi</h1>
    <p class="lead">Uch oyda Bootstrap bilan birinchi saytingizni yarating.</p>
    <hr class="my-4">
    <p>Darslar haftasiga uch marta, onlayn.</p>
    <a class="btn btn-primary btn-lg" href="#" role="button">Kursga yozilish</a>
  </div>
</div>
```

Bootstrap 4 da jumbotron:

- och kulrang fon (`#e9ecef`);
- yumaloq burchaklar (`.3rem`);
- ichki bo‘shliq: telefonda `2rem 1rem`, 576px dan `4rem 2rem`;
- pastida `2rem` margin.

Ichidagi `h1` ga `.display-4`, paragrafga `.lead` berish odat bo‘lib qolgan — bu kattaroq va yengilroq ko‘rinish beradi.

## To‘liq kenglikdagi jumbotron

```html
<div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">Veb-dizayn maktabi</h1>
    <p class="lead">Fon butun ekran bo‘ylab, kontent markazda.</p>
  </div>
</div>
```

`.jumbotron-fluid` burchaklarni olib tashlaydi va yon padding’ni nolga tushiradi; kontent ichidagi `.container` da turadi.

## Rangli jumbotron

Utilitalar bilan:

```html
<div class="jumbotron bg-primary text-white">
  <h1 class="display-4">Kuzgi chegirma</h1>
  <p class="lead">Barcha kurslar -20%</p>
</div>
```

## Bootstrap 5 da

> Bootstrap 5 da `.jumbotron` komponenti olib tashlangan. U yerda xuddi shu ko‘rinish utilitalar bilan yig‘iladi: `p-5 mb-4 bg-light rounded-3`. Bootstrap 4 loyihalarida esa jumbotron juda keng tarqalgan.

## Qachon ishlatiladi?

- Bosh sahifa yoki aksiya sahifasining yuqorisida;
- Bitta sahifada bitta — u “eng muhim joy” bo‘lgani uchun ta’sirli;
- Tugma matni amalni aniq aytsin: “Kursga yozilish”, “Batafsil” emas.

## Xulosa

- `.jumbotron` — kulrang, yumaloq, katta padding’li blok.
- To‘liq kenglik: `.jumbotron.jumbotron-fluid` + ichida `.container`.
- Ichida odatda `.display-4`, `.lead`, `hr.my-4` va `.btn-lg`.
