## 2D transformatsiyalar

`transform` elementni **suradi, aylantiradi, kattalashtiradi yoki qiyshaytiradi** — boshqa elementlarni joyidan qo‘zg‘atmasdan. Element maketdagi asl joyini saqlab qoladi, faqat chizilishi o‘zgaradi.

## Asosiy funksiyalar

| Funksiya             | Vazifasi                       | Misol                     |
| -------------------- | ------------------------------ | ------------------------- |
| `translate(x, y)`    | Surish                         | `translate(20px, -10px)`  |
| `translateX()` / `translateY()` | Bir o‘q bo‘ylab surish | `translateY(-4px)`    |
| `rotate()`           | Aylantirish                    | `rotate(45deg)`           |
| `scale()`            | Kattalashtirish/kichraytirish  | `scale(1.2)`, `scale(1, 0.5)` |
| `skew()`             | Qiyshaytirish                  | `skew(10deg)`             |

```css
.karta:hover {
  transform: translateY(-4px);
}

.yangi-belgi {
  transform: rotate(-5deg);
}

.ikonka:hover {
  transform: scale(1.2);
}
```

## Bir nechta funksiya

Funksiyalar bo‘sh joy bilan yoziladi. Ularni chapdan o‘ngga o‘qing: har bir funksiya oldingisi o‘zgartirgan koordinatalar tizimida ishlaydi. Shuning uchun tartib muhim:

```css
transform: translateX(100px) rotate(45deg); /* surib, keyin aylantiradi */
transform: rotate(45deg) translateX(100px); /* aylangan o‘q bo‘ylab suradi — boshqa natija */
```

## Alohida xususiyatlar

Zamonaviy CSS’da `translate`, `rotate`, `scale` alohida xususiyat sifatida ham bor:

```css
.ikonka {
  rotate: 15deg;
  scale: 1.1;
}
```

Ularning qulayligi: hover’da faqat bittasini o‘zgartirsangiz, qolganlari saqlanib qoladi.

## Aylanish nuqtasi: `transform-origin`

Standart holda element **markazi** atrofida aylanadi va kattalashadi:

```css
.eshik {
  transform-origin: left center;
  transform: rotate(-20deg); /* chap cheti atrofida ochiladi */
}
```

Qiymatlar: `left`, `right`, `top`, `bottom`, `center`, foiz yoki piksel.

## Foizli `translate`

`translate` dagi foiz elementning **o‘z** o‘lchamidan hisoblanadi. Shuning uchun `translate(-50%, -50%)` elementni o‘z markaziga suradi (6-moduldagi markazlash usuli).

## Nega `transform` yaxshi?

`top`/`left` yoki `margin` ni o‘zgartirish butun sahifa maketini qayta hisoblatadi. `transform` esa faqat chizishga ta’sir qiladi va videokarta yordamida bajariladi — animatsiyalar silliq bo‘ladi.

## Xulosa

- `translate`, `rotate`, `scale`, `skew` — joyni o‘zgartirmasdan chizishni o‘zgartiradi.
- Funksiyalar tartibi natijaga ta’sir qiladi.
- `transform-origin` — aylanish va kattalashish nuqtasi.
