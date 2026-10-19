## Badge — son ko‘rsatkichi

**Badge** — yangi xabarlar, bildirishnomalar yoki elementlar sonini ko‘rsatadigan kichik yumaloq belgi:

```html
<a href="#">Xabarlar <span class="badge">4</span></a>

<button type="button" class="btn btn-primary">
  Bildirishnomalar <span class="badge">12</span>
</button>
```

Badge kulrang (`#777`) fonli bo‘ladi. Rangli tugma ichida ranglar teskari almashadi: oq fon va tugma rangidagi son.

Badge ichi bo‘sh bo‘lsa, u ko‘rinmaydi (`:empty` holatida yashiriladi) — son 0 bo‘lganda badge’ni bo‘sh qoldirish qulay.

Ro‘yxat yoki menyu bandida badge o‘ng tomonga suriladi:

```html
<ul class="nav nav-pills nav-stacked">
  <li class="active"><a href="#">Kiruvchi <span class="badge">7</span></a></li>
  <li><a href="#">Yuborilgan</a></li>
</ul>
```

## Label — yorliq

**Label** — matn yonidagi kichik rangli yorliq: “Yangi”, “Tez kunda”, “Chegirma”:

```html
<h3>Bootstrap kursi <span class="label label-success">Yangi</span></h3>
```

| Klass            | Rangi             |
| ---------------- | ----------------- |
| `.label-default` | Kulrang           |
| `.label-primary` | Ko‘k              |
| `.label-success` | Yashil            |
| `.label-info`    | Moviy             |
| `.label-warning` | To‘q sariq        |
| `.label-danger`  | Qizil             |

Label sarlavha ichida bo‘lsa, sarlavha o‘lchamiga mos ravishda kattalashadi (`font-size: 75%`).

## Badge yoki label?

| Belgi    | Ichida            | Shakli                 |
| -------- | ----------------- | ---------------------- |
| `.badge` | Odatda son        | Kuchli yumaloq (pill)  |
| `.label` | Qisqa so‘z        | Biroz yumaloq to‘rtburchak |

> Bootstrap 4 da `.label` yo‘q — u `.badge` ga birlashtirilgan (`.badge-success` kabi). Bootstrap 3 kodini ko‘chirishda buni almashtirish kerak bo‘ladi.

## Foydalanish imkoniyati

“Xabarlar 4” ni ekran o‘quvchi “Xabarlar to‘rt” deb o‘qiydi — ma’nosi tushunarsiz bo‘lishi mumkin. Aniqlik uchun yashirin matn qo‘shing:

```html
<a href="#">Xabarlar <span class="badge">4</span><span class="sr-only"> ta o‘qilmagan</span></a>
```

`.sr-only` matnni ekranda yashiradi, lekin ekran o‘quvchi uni o‘qiydi.

## Xulosa

- `.badge` — son ko‘rsatkichi, rangli tugma ichida ranglar teskari.
- `.label` + `.label-success | -danger | …` — rangli yorliq.
- Kerak bo‘lsa `.sr-only` bilan izoh qo‘shing.
