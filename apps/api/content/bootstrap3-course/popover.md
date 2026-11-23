## Popover

**Popover** — tooltip’ning kattaroq ukasi: sarlavha va matndan iborat oq quti. Odatda element **bosilganda** ochiladi va ko‘proq tushuntirish sig‘adi.

```html
<button type="button" class="btn btn-info" data-toggle="popover"
        title="Sertifikat" data-content="Yakuniy loyihani topshirgandan keyin beriladi.">
  Sertifikat haqida
</button>
```

- `title` — popover sarlavhasi;
- `data-content` — asosiy matn.

## Yoqish

Tooltip kabi, popover ham JavaScript bilan yoqiladi:

```html
<script>
  $(function () {
    $('[data-toggle="popover"]').popover();
  });
</script>
```

Popover plagini tooltip plaginiga tayanadi — ikkalasi ham `bootstrap.min.js` ichida.

## Joylashuv va ochilish usuli

```html
<a href="#" data-toggle="popover" data-placement="right" title="Muddat"
   data-content="Topshiriqlar har juma 23:59 gacha qabul qilinadi.">Muddat</a>
```

| Atribut          | Qiymatlari                                                  |
| ---------------- | ----------------------------------------------------------- |
| `data-placement` | `top`, `bottom`, `left`, `right` (standart — `right`)       |
| `data-trigger`   | `click` (standart), `hover`, `focus`, `manual`              |

**Boshqa joyga bosilganda yopilishi** uchun `data-trigger="focus"` ishlatiladi. Bunda element fokus oladigan bo‘lishi kerak — `<a>` ga `tabindex="0"` va `role="button"` bering:

```html
<a tabindex="0" role="button" class="btn btn-default" data-toggle="popover"
   data-trigger="focus" title="Eslatma" data-content="Boshqa joyga bosing — yopiladi.">
  Eslatma
</a>
```

## JavaScript orqali

```js
$('#tugma').popover({ placement: 'bottom', trigger: 'click' });
$('#tugma').popover('show');
$('#tugma').popover('hide');
```

## Tooltip yoki popover?

| Komponent | Kontent                 | Ochilishi          |
| --------- | ----------------------- | ------------------ |
| Tooltip   | Bir necha so‘z          | Hover/fokus        |
| Popover   | Sarlavha + 1–2 gap      | Bosish (click)     |

Popover ichiga forma yoki uzun matn qo‘ymang — buning uchun modal bor.

```tekshir
Popover’ning tooltip’dan farqi nima?
+ sarlavha va kattaroq matnni ko‘rsatadi, odatda bosilganda ochiladi
- u hech qachon JavaScript talab qilmaydi
- u faqat formalarda ishlaydi
> Popover ham tooltip kabi JavaScript bilan yoqiladi.
```

```jonli
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
<div class="container" style="padding-top: 15px">
  <p style="margin-top: 20px"><button class="btn btn-info" data-toggle="popover" data-placement="right" title="Popover sarlavhasi" data-content="Bu yerda batafsil izoh turadi.">Bosing</button></p>
</div>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
<script>
  $('[data-toggle="popover"]').popover();
</script>
```

## Xulosa

- `data-toggle="popover"` + `title` + `data-content`.
- **Yoqish shart:** `$('[data-toggle="popover"]').popover();`.
- `data-placement`, `data-trigger` (`click`, `hover`, `focus`).
