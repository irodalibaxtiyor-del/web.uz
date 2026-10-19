## Setka namunalari

O‘rganganlarimizni bitta sahifada birlashtiramiz.

## 1. Kurslar katalogi (`row-cols` + card)

```html
<div class="row row-cols-1 row-cols-sm-2 row-cols-lg-4">
  <div class="col mb-4">
    <div class="card h-100">
      <img src="html.png" class="card-img-top" alt="HTML kursi">
      <div class="card-body">
        <h5 class="card-title">HTML</h5>
        <p class="card-text">Sahifa tuzilishi.</p>
      </div>
    </div>
  </div>
  <!-- … -->
</div>
```

## 2. Blog: kontent + yon panel

```html
<div class="row">
  <main class="col-lg-8">
    <article>…</article>
  </main>
  <aside class="col-lg-4">
    <div class="card card-body bg-light">Mashhur maqolalar</div>
  </aside>
</div>
```

## 3. Markazdagi kirish formasi

```html
<div class="row justify-content-center">
  <div class="col-sm-10 col-md-8 col-lg-5">
    <form class="card card-body">…</form>
  </div>
</div>
```

## 4. Dashboard: statistika kartalari

```html
<div class="row">
  <div class="col-6 col-lg-3 mb-3"><div class="card card-body text-center">12<br>Kurs</div></div>
  <div class="col-6 col-lg-3 mb-3"><div class="card card-body text-center">340<br>Talaba</div></div>
  <div class="col-6 col-lg-3 mb-3"><div class="card card-body text-center">58<br>Topshiriq</div></div>
  <div class="col-6 col-lg-3 mb-3"><div class="card card-body text-center">4.8<br>Reyting</div></div>
</div>
```

Telefonda 2 × 2, noutbukda bir qatorda 4 ta.

## 5. Teng balandlikdagi ikki ustun

```html
<div class="row">
  <div class="col-md-6 d-flex">
    <div class="card card-body flex-fill">Qisqa matn</div>
  </div>
  <div class="col-md-6 d-flex">
    <div class="card card-body flex-fill">Uzun matn…</div>
  </div>
</div>
```

## Ko‘rinish klasslari

| Kerak                                 | Klass                       |
| ------------------------------------- | --------------------------- |
| Faqat telefonda                       | `d-sm-none` (yoki `d-md-none`) |
| Telefonda yashirin                    | `d-none d-sm-block`         |
| Faqat noutbuk va kattada               | `d-none d-lg-block`         |
| Chop etishda yashirin                  | `d-print-none`              |

## Tez-tez uchraydigan xatolar

1. Ustunlarni `.row` siz yozish — ular flex element bo‘lmaydi.
2. Kontentni `.row` ga to‘g‘ridan-to‘g‘ri yozish.
3. `col-xs-*` yozish — Bootstrap 4 da bunday klass yo‘q (`col-*`).
4. Bootstrap 3 dan ko‘chirganda sinflarni siljitmaslik (`md` → `lg`).
5. `offset-md-*` o‘rniga eski `col-md-offset-*` yozish.

## Xulosa

- Katalog: `row-cols-*` + `.col` + `.card.h-100`.
- Markazlash: `justify-content-center`.
- Ko‘rinish: `d-none d-lg-block` kabi kombinatsiyalar.
