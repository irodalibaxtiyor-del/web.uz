## Maydon balandligi

Maydonlar uchun ham tugmalar kabi o‘lcham klasslari bor:

```html
<input class="form-control input-lg" type="text" placeholder="Katta">
<input class="form-control" type="text" placeholder="Oddiy">
<input class="form-control input-sm" type="text" placeholder="Kichik">
```

| Klass       | Balandlik | Shrift |
| ----------- | --------- | ------ |
| `.input-lg` | 46px      | 18px   |
| (oddiy)     | 34px      | 14px   |
| `.input-sm` | 30px      | 12px   |

`select` ga ham xuddi shu klasslar beriladi.

Gorizontal formada butun guruhni kattalashtirish uchun `.form-group-lg` yoki `.form-group-sm` — bunda yorliq ham mos o‘lchamda bo‘ladi:

```html
<form class="form-horizontal">
  <div class="form-group form-group-lg">
    <label class="col-sm-2 control-label" for="katta">Ism</label>
    <div class="col-sm-10"><input class="form-control" id="katta" type="text"></div>
  </div>
</form>
```

## Maydon kengligi

`.form-control` doim 100% kenglikda. Torroq maydon kerak bo‘lsa, uni setka ustuniga joylang:

```html
<div class="row">
  <div class="col-xs-3">
    <label for="kun">Kun</label>
    <input class="form-control" id="kun" type="number">
  </div>
  <div class="col-xs-4">
    <label for="oy">Oy</label>
    <input class="form-control" id="oy" type="text">
  </div>
  <div class="col-xs-5">
    <label for="yil">Yil</label>
    <input class="form-control" id="yil" type="number">
  </div>
</div>
```

## Input group: maydon oldi va ortidagi qo‘shimchalar

**Input group** maydon chetiga matn, ikonka yoki tugma yopishtiradi:

```html
<div class="input-group">
  <span class="input-group-addon">@</span>
  <input type="text" class="form-control" placeholder="foydalanuvchi" aria-label="Foydalanuvchi nomi">
</div>

<div class="input-group">
  <input type="number" class="form-control" aria-label="Narx (so‘m)">
  <span class="input-group-addon">so‘m</span>
</div>
```

Tugma bilan — `.input-group-btn`:

```html
<div class="input-group">
  <input type="text" class="form-control" placeholder="Kurs nomi" aria-label="Qidiruv">
  <span class="input-group-btn">
    <button class="btn btn-default" type="button">
      <span class="glyphicon glyphicon-search" aria-hidden="true"></span> Qidirish
    </button>
  </span>
</div>
```

Butun guruh o‘lchami: `.input-group-lg`, `.input-group-sm`.

## Xulosa

- Balandlik: `.input-lg`, `.input-sm`; guruh uchun `.form-group-lg|sm`.
- Kenglik: maydonni `.col-*` ichiga joylang.
- Input group: `.input-group` > `.input-group-addon` yoki `.input-group-btn` + `.form-control`.
