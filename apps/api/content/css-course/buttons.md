## Tugmalar

Tugma — foydalanuvchi eng ko‘p bosadigan element. U tushunarli, bosish oson va har holatda ko‘rinadigan bo‘lishi kerak.

## Asosiy tugma

```css
.tugma {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: 2px solid transparent;
  border-radius: 8px;
  background-color: #0071dc;
  color: white;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
```

- `inline-flex` + `gap` — ikonka va matn chiroyli tekislanadi.
- Shaffof chegara — keyingi variantlarda o‘lcham sakramaydi.
- `font: inherit` — tugma sahifa shriftida.

## Holatlar

```css
.tugma:hover {
  background-color: #005bb0;
}

.tugma:active {
  transform: translateY(1px);
}

.tugma:focus-visible {
  outline: 3px solid #93c5fd;
  outline-offset: 2px;
}

.tugma:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

Har bir holat ko‘rinib turishi kerak — ayniqsa **fokus**.

## Variantlar

```css
.tugma-ikkinchi {
  background-color: transparent;
  border-color: #0071dc;
  color: #0071dc;
}

.tugma-xavfli {
  background-color: #dc2626;
}

.tugma-kichik {
  padding: 6px 12px;
  font-size: 0.875rem;
}
```

Sahifada **bitta asosiy** (to‘ldirilgan) tugma bo‘lsin — eng muhim amal. Qolganlari ikkinchi darajali.

## Bosish maydoni

Telefonda barmoq bilan bosish uchun tugma kamida **44×44px** bo‘lishi tavsiya etiladi:

```css
.tugma {
  min-height: 44px;
}
```

## Tugmalar guruhi

```css
.guruh {
  display: inline-flex;
}

.guruh .tugma {
  border-radius: 0;
}

.guruh .tugma:first-child {
  border-radius: 8px 0 0 8px;
}

.guruh .tugma:last-child {
  border-radius: 0 8px 8px 0;
}
```

## `<button>` yoki `<a>`?

- Amal bajaradi (yuborish, ochish, o‘chirish) — `<button>`.
- Boshqa sahifaga olib boradi — `<a>`.

Ko‘rinishi bir xil bo‘lishi mumkin, lekin HTML teg to‘g‘ri tanlansa, klaviatura va ekran o‘quvchi to‘g‘ri ishlaydi.

## Xulosa

- `inline-flex`, padding, shaffof chegara, `font: inherit`.
- Hover, active, fokus va disabled holatlari.
- Bitta asosiy tugma, qolganlari ikkinchi darajali; kamida 44px.
