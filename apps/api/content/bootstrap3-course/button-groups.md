## Tugmalar guruhi

Bir-biriga bog‘liq tugmalarni bitta qatorga yopishtirib qo‘yish uchun ularni `.btn-group` ichiga oling:

```html
<div class="btn-group" role="group" aria-label="Matn tekislash">
  <button type="button" class="btn btn-default">Chap</button>
  <button type="button" class="btn btn-default">Markaz</button>
  <button type="button" class="btn btn-default">O‘ng</button>
</div>
```

Natijada tugmalar orasidagi bo‘sh joy yo‘qoladi, faqat chetki tugmalarning tashqi burchaklari yumaloq qoladi. `role="group"` va `aria-label` ekran o‘quvchiga bu tugmalar bitta guruh ekanini aytadi.

## Guruh o‘lchami

Har bir tugmaga alohida `.btn-lg` yozish o‘rniga guruhga bitta klass beriladi:

| Klass           | O‘lcham     |
| --------------- | ----------- |
| `.btn-group-lg` | Katta       |
| (oddiy)         | O‘rtacha    |
| `.btn-group-sm` | Kichik      |
| `.btn-group-xs` | Juda kichik |

```html
<div class="btn-group btn-group-lg">...</div>
```

## Vertikal guruh

```html
<div class="btn-group-vertical" role="group" aria-label="Bo‘limlar">
  <button type="button" class="btn btn-primary">Profil</button>
  <button type="button" class="btn btn-primary">Kurslar</button>
  <button type="button" class="btn btn-primary">Sozlamalar</button>
</div>
```

## To‘liq kenglikdagi guruh

`.btn-group-justified` tugmalarni teng bo‘lib, guruhni to‘liq kenglikka cho‘zadi. `<a>` tugmalar bilan to‘g‘ridan-to‘g‘ri ishlaydi; `<button>` bo‘lsa, har birini alohida `.btn-group` ichiga olish kerak:

```html
<div class="btn-group btn-group-justified" role="group">
  <div class="btn-group"><button type="button" class="btn btn-default">Kun</button></div>
  <div class="btn-group"><button type="button" class="btn btn-default">Hafta</button></div>
  <div class="btn-group"><button type="button" class="btn btn-default">Oy</button></div>
</div>
```

## Toolbar va ichma-ich guruh

Bir nechta guruhni `.btn-toolbar` ichida yonma-yon joylashtirish mumkin:

```html
<div class="btn-toolbar" role="toolbar" aria-label="Sahifalar">
  <div class="btn-group">
    <button class="btn btn-default">1</button>
    <button class="btn btn-default">2</button>
  </div>
  <div class="btn-group">
    <button class="btn btn-default">Keyingi</button>
  </div>
</div>
```

Guruh ichida ochiladigan menyu (dropdown) ham bo‘lishi mumkin — buni “Dropdown” darsida ko‘ramiz.

## Xulosa

- `.btn-group` — tugmalarni bir qatorga yopishtiradi; `role="group"` va `aria-label` qo‘shing.
- O‘lcham: `.btn-group-lg | -sm | -xs`.
- `.btn-group-vertical` — ustun, `.btn-group-justified` — to‘liq kenglik.
- `.btn-toolbar` — bir nechta guruhni birlashtiradi.
