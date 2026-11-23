## Tugma “gapirishi” kerak

Foydalanuvchi har bir harakatiga javob kutadi. Tugmaning holatlari unga “seni ko‘ryapman”, “bosish mumkin” yoki “hozir mumkin emas” deydi.

| Holat                | Psevdoklass          | Ko‘rinish                          |
| -------------------- | -------------------- | ---------------------------------- |
| Oddiy                | —                    | asosiy rang                        |
| Ustiga olib borilgan | `:hover`             | biroz to‘qroq                      |
| Klaviatura fokusi    | `:focus-visible`     | aniq halqa                         |
| Bosilmoqda           | `:active`            | yana to‘qroq yoki biroz kichrayadi |
| O‘chirilgan          | `:disabled`          | xira, kursor taqiq                 |
| Yuklanmoqda          | `[aria-busy="true"]` | spinner, matn “Yuborilmoqda…”      |

## Hover

```css
.tugma:hover {
  background-color: #005bb5;
}
```

Telefonda hover yo‘q — shuning uchun hover hech qachon yagona ma’lumot manbai bo‘lmasin. Telefonda “yopishib qolmasligi” uchun `@media (hover: hover)` ichida yozish mumkin.

## Fokus

```css
.tugma:focus-visible {
  outline: 3px solid #59a2ff;
  outline-offset: 2px;
}
```

`:focus-visible` brauzer “klaviatura bilan kelindi” deb hisoblaganda ishlaydi. Sichqoncha bilan bosganda halqa chiqmaydi, Tab bilan kelganda chiqadi. Shu sababli `:focus` o‘rniga `:focus-visible` qulay.

`outline: none` ni o‘ylamasdan yozish — accessibility’dagi eng ko‘p uchraydigan xato. Klaviatura foydalanuvchisi qayerda turganini ko‘rmay qoladi. Agar standart halqa yoqmasa — uni o‘chirmang, **o‘zingiznikiga almashtiring**.

`outline` maketni siljitmaydi va `outline-offset` bilan elementdan biroz uzoqroq chiziladi — fokus aniq ko‘rinadi.

## O‘chirilgan holat

```css
.tugma:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

Ehtiyot bo‘ling: o‘chirilgan tugma **nima uchun** o‘chirilganini aytmaydi. Ko‘p hollarda tugmani faol qoldirib, bosilganda xatoni ko‘rsatish yaxshiroq (“Parol kiritilmagan”). `disabled` tugma klaviatura bilan ham fokus olmaydi — ekran o‘quvchi foydalanuvchisi uni umuman topmasligi mumkin.

## O‘tish (transition)

```css
.tugma {
  transition: background-color 150ms ease;
}
```

Rang almashinuvi silliq bo‘ladi. Lekin 300 ms dan uzun animatsiya sekin tuyuladi.

Mashqda hover, fokus va o‘chirilgan holatlarni yozasiz.

```tekshir
Tugmaning klaviatura fokusini ko‘rsatish uchun qaysi psevdoklass tavsiya etiladi?
+ `:focus-visible`
- `:hover`
- `:active`
> `:focus-visible` sichqoncha bilan bosilganda emas, klaviatura bilan kelganda kontur chiqaradi.
```

```jonli
<style>
  .b { font: inherit; padding: 10px 16px; border: 0; border-radius: 8px; background: #0071dc; color: #fff; cursor: pointer; transition: background-color .15s, transform .15s; }
  .b:hover { background: #005bb0; }
  .b:active { transform: translateY(1px); }
  .b:focus-visible { outline: 3px solid #f5a623; outline-offset: 2px; }
  .b:disabled { opacity: .5; cursor: not-allowed; }
</style>
<button class="b">Tab bilan keling</button> <button class="b" disabled>O‘chirilgan</button>
```
