## Well nima?

**Well** — kontentni ichiga botgandek ko‘rsatadigan kulrang quti. U yumaloq burchaklar, ingichka chegara, och kulrang fon (`#f5f5f5`) va ichkariga tushgan soya (`inset box-shadow`) bilan chiziladi.

```html
<div class="well">Bu oddiy well. Ichida istalgan kontent bo‘lishi mumkin.</div>
```

Well’ni qisqa eslatma, yon panel yoki ajratilgan ma’lumot bloki uchun ishlatish qulay.

## O‘lchamlar

| Klass              | Ichki bo‘shliq | Burchak radiusi |
| ------------------ | -------------- | --------------- |
| `.well.well-sm`    | 9px            | 3px             |
| `.well`            | 19px           | 4px             |
| `.well.well-lg`    | 24px           | 6px             |

```html
<div class="well well-sm">Kichik well</div>
<div class="well">Oddiy well</div>
<div class="well well-lg">Katta well</div>
```

## Misol: yon panelda eslatma

```html
<div class="row">
  <div class="col-sm-8">
    <h2>Dars rejasi</h2>
    <p>Bugun setka tizimini o‘rganamiz.</p>
  </div>
  <div class="col-sm-4">
    <div class="well well-sm">
      <strong>Eslatma:</strong> uy vazifasini juma kunigacha topshiring.
    </div>
  </div>
</div>
```

## Well, panel yoki alert?

| Komponent | Qachon                                                  |
| --------- | ------------------------------------------------------- |
| `.well`   | Neytral, ajratilgan kontent (rangsiz)                   |
| `.panel`  | Sarlavha, tana va pastki qismga ega quti (keyingi modul) |
| `.alert`  | Foydalanuvchiga holat haqida xabar (yashil, qizil…)     |

> Bootstrap 4 da `.well` olib tashlangan — uning o‘rniga `.card` ishlatiladi. Bootstrap 3 loyihalarida esa u juda ko‘p uchraydi.

## Xulosa

- `.well` — kulrang, ichkariga botgan quti.
- O‘lcham: `.well-sm` va `.well-lg`.
- Rangli xabar uchun well emas, `.alert` ishlating.
