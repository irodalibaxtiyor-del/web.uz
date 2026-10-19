## Glyphicons nima?

Bootstrap 3 tarkibida **Glyphicons Halflings** to‘plamidan 250 dan ortiq ikonka bor. Ular rasm emas, **shrift** ko‘rinishida: shuning uchun rangi `color` bilan, o‘lchami `font-size` bilan o‘zgaradi va istalgan o‘lchamda tiniq ko‘rinadi.

Ikonka bo‘sh `<span>` ga ikki klass berib chiziladi:

```html
<span class="glyphicon glyphicon-search" aria-hidden="true"></span>
```

- `.glyphicon` — asosiy klass (shrift, o‘lcham, joylashuv);
- `.glyphicon-search` — qaysi ikonka.

Shrift fayllari (`fonts/glyphicons-halflings-regular.*`) Bootstrap CSS bilan bir joyda turadi va CSS ularni o‘zi yuklaydi.

## Ko‘p ishlatiladigan ikonkalar

| Klass                      | Ma’nosi           |
| -------------------------- | ----------------- |
| `glyphicon-search`         | Qidirish          |
| `glyphicon-user`           | Foydalanuvchi     |
| `glyphicon-envelope`       | Xat               |
| `glyphicon-trash`          | O‘chirish         |
| `glyphicon-pencil`         | Tahrirlash        |
| `glyphicon-ok`             | Tasdiq (✓)        |
| `glyphicon-remove`         | Bekor qilish (✕)  |
| `glyphicon-star`           | Yulduzcha         |
| `glyphicon-shopping-cart`  | Savatcha          |
| `glyphicon-home`           | Bosh sahifa       |

## Tugma ichida

```html
<button type="button" class="btn btn-danger">
  <span class="glyphicon glyphicon-trash" aria-hidden="true"></span> O‘chirish
</button>
```

## Qoidalar

1. **Ikonka elementi bo‘sh bo‘ladi.** `<span class="glyphicon ...">matn</span>` noto‘g‘ri — ikonka va matn alohida.
2. **Bitta elementga ikkita ikonka klassi berilmaydi.**
3. **Boshqa klass bilan aralashtirmang.** Ikonkani `.btn` yoki `.label` ichiga qo‘ying, ularning o‘ziga emas.

## Foydalanish imkoniyati (accessibility)

Ekran o‘quvchi ikonkani tushunmaydi. Ikki holat bor:

**Ikonka yonida matn bor** — ikonkani yashiring:

```html
<span class="glyphicon glyphicon-envelope" aria-hidden="true"></span> Xabarlar
```

**Faqat ikonka** (masalan, kichik qidiruv tugmasi) — tugmaga nom bering:

```html
<button type="button" class="btn btn-default" aria-label="Qidirish">
  <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
</button>
```

## Bootstrap 4 va 5 da

Bootstrap 4 da Glyphicons olib tashlangan. Yangi loyihalarda **Bootstrap Icons** yoki boshqa ikonkalar to‘plami ishlatiladi. Bootstrap 3 dan ko‘chirishda shuni yodda tuting.

## Xulosa

- Ikonka: `<span class="glyphicon glyphicon-NOMI" aria-hidden="true"></span>`.
- Element bo‘sh, bitta ikonka klassi.
- Faqat ikonkali tugmaga `aria-label` bering.
