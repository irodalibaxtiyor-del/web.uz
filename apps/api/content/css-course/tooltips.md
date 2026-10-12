## Maslahat oynasi (tooltip)

Tooltip — element ustiga kelinganda yoki fokuslanganda chiqadigan kichik izoh.

## Oddiy CSS tooltip

```html
<button class="maslahat" aria-describedby="m1">
  Saqlash
  <span class="maslahat-matn" role="tooltip" id="m1">Ctrl + S</span>
</button>
```

```css
.maslahat {
  position: relative;
}

.maslahat-matn {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #0e1133;
  color: white;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}

.maslahat:hover .maslahat-matn,
.maslahat:focus-visible .maslahat-matn {
  opacity: 1;
}
```

- Ota `relative`, tooltip `absolute`.
- `bottom: calc(100% + 8px)` — tugmaning ustida, 8px oraliq bilan.
- `left: 50%` + `translateX(-50%)` — gorizontal markazda.
- `pointer-events: none` — ko‘rinmas tooltip sichqonchaga xalaqit bermaydi.
- `:focus-visible` — klaviatura foydalanuvchilari ham ko‘radi.

## Strelka

```css
.maslahat-matn::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #0e1133;
}
```

Bo‘sh elementning to‘rtta shaffof chegarasidan faqat yuqorisi rangli — u uchburchak shaklida chiziladi.

## Boshqa tomonlar

| Joy   | Asosiy qatorlar                                   |
| ----- | ------------------------------------------------- |
| Yuqori | `bottom: calc(100% + 8px)`                       |
| Pastki | `top: calc(100% + 8px)`                          |
| O‘ng   | `left: calc(100% + 8px); top: 50%; translateY(-50%)` |

## Foydalanish qulayligi

- `aria-describedby` tooltip matnini tugmaning **tavsifi** sifatida bog‘laydi — ekran o‘quvchi uni o‘qiydi.
- Tooltipda faqat **qo‘shimcha** ma’lumot bo‘lsin. Muhim ma’lumot telefonda (hover yo‘q) ko‘rinmay qolishi mumkin.
- `title` atributi ham tooltip chiqaradi, lekin uni bezab bo‘lmaydi va klaviaturada ishlamaydi.

## Xulosa

- `relative` ota + `absolute` tooltip.
- `opacity` va `pointer-events: none` bilan yashirish.
- `:hover` va `:focus-visible` da ko‘rsatish, `aria-describedby` bilan bog‘lash.
