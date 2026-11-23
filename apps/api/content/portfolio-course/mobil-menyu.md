## Portfolio uchun mobil menyu

“Moslashuvchan dizayn” kursida burger menyu ochilishini yasagan edik. Bir sahifali portfolioda yana ikki narsa muhim:

1. **Havola tanlanganda menyu yopilsin.** Foydalanuvchi “Ishlarim” ni bosdi — sahifa bo‘limga aylandi, lekin ochiq menyu ekranni to‘sib turibdi. U menyuni qo‘lda yopishi kerak bo‘ladi.
2. **Esc menyuni yopsin** va fokus burgerga qaytsin — klaviatura foydalanuvchisi uchun.

## Kod

```js
const burger = document.querySelector('.burger');
const menyu = document.querySelector('#menyu');

function yopish() {
  menyu.classList.remove('ochiq');
  burger.setAttribute('aria-expanded', 'false');
}

burger.addEventListener('click', () => {
  const ochiq = burger.getAttribute('aria-expanded') === 'true';
  if (ochiq) {
    yopish();
  } else {
    menyu.classList.add('ochiq');
    burger.setAttribute('aria-expanded', 'true');
  }
});

menyu.addEventListener('click', (e) => {
  if (e.target.closest('a')) yopish();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menyu.classList.contains('ochiq')) {
    yopish();
    burger.focus();
  }
});
```

## Hodisani delegatsiya qilish

Har bir havolaga alohida tinglovchi qo‘yish o‘rniga bitta tinglovchi menyuning o‘ziga qo‘yildi. `e.target.closest('a')` — bosilgan element havolami yoki havola ichidami. Bu **hodisa delegatsiyasi** deyiladi: menyuga yangi havola qo‘shilsa ham kod o‘zgarmaydi.

## Bitta funksiya — bitta holat

`yopish()` funksiyasi uch joyda chaqiriladi. Holatni (klass va `aria-expanded`) bir joyda o‘zgartirish ular hech qachon bir-biridan ajralib qolmasligini kafolatlaydi. Agar klassni bir joyda, atributni boshqa joyda o‘zgartirsangiz, ertami-kechmi ular mos kelmay qoladi.

## Kompyuterda

CSS’da `@media (min-width: 768px)` ichida menyu doim `display: flex` — `.ochiq` klassi bor-yo‘qligi ahamiyatsiz. JavaScript faqat telefonda kerakli holatni boshqaradi.

Mashqda menyuni havola tanlanganda va Esc bosilganda yopiladigan qilasiz.

```tekshir
Mobil menyu ochilganda tugmaning qaysi atributi yangilanadi?
+ `aria-expanded`
- `aria-label`
- `tabindex`
> Holat bitta funksiyada o‘zgarsa, atribut va ko‘rinish har doim mos bo‘ladi.
```

```jonli
<style>
  #m { display: none; list-style: none; padding: 0; }
  #m.ochiq { display: block; }
</style>
<button id="b" aria-expanded="false" aria-controls="m">☰ Menyu</button>
<ul id="m"><li><a href="#">Men haqimda</a></li><li><a href="#">Ishlar</a></li><li><a href="#">Aloqa</a></li></ul>
<script>
  const b = document.getElementById('b');
  function belgila(ochiq) {
    b.setAttribute('aria-expanded', String(ochiq));
    document.getElementById('m').classList.toggle('ochiq', ochiq);
  }
  b.onclick = () => belgila(b.getAttribute('aria-expanded') !== 'true');
</script>
```
