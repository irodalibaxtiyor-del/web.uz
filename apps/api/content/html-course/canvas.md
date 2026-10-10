## `<canvas>` nima?

`<canvas>` — JavaScript yordamida chiziladigan **rasm maydoni**. Unda grafiklar, diagrammalar, o‘yinlar va animatsiyalar yaratiladi. HTML’ning o‘zi faqat bo‘sh “mato” beradi, chizishni JavaScript bajaradi.

```html
<canvas id="mato" width="300" height="150" style="border: 1px solid #ccc;">
  Brauzeringiz canvas’ni qo‘llab-quvvatlamaydi.
</canvas>
```

- `width` va `height` — piksellardagi o‘lcham (standart: 300×150);
- teglar orasidagi matn faqat canvas ishlamasa ko‘rinadi.

## Chizishni boshlash

```html
<script>
  const mato = document.getElementById('mato');
  const ctx = mato.getContext('2d'); // 2D chizish konteksti
</script>
```

`ctx` — “mo‘yqalam”: barcha chizish buyruqlari u orqali beriladi.

## To‘rtburchak

```js
ctx.fillStyle = '#0071dc';
ctx.fillRect(20, 20, 120, 80); // x, y, kenglik, balandlik — to‘ldirilgan

ctx.strokeStyle = 'crimson';
ctx.lineWidth = 3;
ctx.strokeRect(160, 20, 120, 80); // faqat chegara
```

Koordinatalar chap yuqori burchakdan boshlanadi: `x` o‘ngga, `y` pastga oshadi.

## Chiziq

```js
ctx.beginPath();
ctx.moveTo(10, 140);
ctx.lineTo(290, 10);
ctx.stroke();
```

## Aylana

```js
ctx.beginPath();
ctx.arc(150, 75, 40, 0, 2 * Math.PI); // markaz x, y, radius, boshlanish, tugash burchagi
ctx.fillStyle = '#fec400';
ctx.fill();
```

## Matn

```js
ctx.font = '20px sans-serif';
ctx.fillStyle = '#0e1133';
ctx.fillText('Salom, canvas!', 70, 140);
```

## Gradient

```js
const g = ctx.createLinearGradient(0, 0, 300, 0);
g.addColorStop(0, '#0071dc');
g.addColorStop(1, '#fec400');
ctx.fillStyle = g;
ctx.fillRect(0, 0, 300, 150);
```

## Canvas va qulaylik

Canvas ichidagi chizma ekran o‘qiydigan dasturlar uchun ko‘rinmaydi. Muhim ma’lumotni (masalan, diagramma qiymatlarini) matn yoki jadval sifatida ham bering.

## Xulosa

- `<canvas width height>` — JavaScript bilan chiziladigan maydon.
- `getContext('2d')` orqali to‘rtburchak, chiziq, aylana, matn va gradient chiziladi.
- Koordinatalar chap yuqori burchakdan hisoblanadi.
