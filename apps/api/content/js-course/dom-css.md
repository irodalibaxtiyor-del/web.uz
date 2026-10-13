## Uslublarni o‘zgartirish

Ikki yo‘l bor: **klasslarni** almashtirish (tavsiya etiladi) va **inline uslub** yozish.

## `classList` — asosiy usul

Uslublar CSS faylida, JavaScript faqat klassni yoqadi/o‘chiradi:

```css
.tab.faol {
  background-color: #0071dc;
  color: white;
}
```

```js
el.classList.add('faol');
el.classList.remove('faol');
el.classList.toggle('faol');          // bor bo‘lsa o‘chiradi, yo‘q bo‘lsa qo‘shadi
el.classList.toggle('faol', shart);   // shart true — qo‘shadi, false — o‘chiradi
el.classList.contains('faol');        // tekshirish
el.classList.replace('eski', 'yangi');
```

Afzalliklari: dizayn bir joyda (CSS), media so‘rovlar va hover ishlaydi, dark mode oson.

### Tablar: faqat bittasi faol

```js
const tablar = document.querySelectorAll('.tab');

for (const tab of tablar) {
  tab.onclick = function () {
    for (const t of tablar) t.classList.remove('faol');
    this.classList.add('faol');
  };
}
```

## `style` — inline uslub

Qiymati JavaScript’da **hisoblanadigan** uslublar uchun (o‘lcham, pozitsiya, progress):

```js
chiziq.style.width = foiz + '%';
quti.style.transform = `translateX(${x}px)`;
el.style.backgroundColor = 'gold'; // camelCase
el.style.setProperty('--rang', '#0071dc'); // CSS o‘zgaruvchi
el.style.width = ''; // inline uslubni olib tashlash
```

Birlikni unutmang: `style.width = 50` ishlamaydi, `'50%'` yoki `'50px'` kerak.

## Hisoblangan uslubni o‘qish

`el.style` faqat **inline** uslubni ko‘rsatadi. CSS fayldagi yakuniy qiymat uchun:

```js
getComputedStyle(el).width            // '100px'
getComputedStyle(el).backgroundColor  // 'rgb(0, 113, 220)'
```

## Ko‘rsatish va yashirish

```js
el.hidden = true;               // eng sodda, ARIA uchun ham to‘g‘ri
el.classList.toggle('yopiq');   // CSS’da .yopiq { display: none; }
el.style.display = 'none';      // inline — kamroq tavsiya
```

## Progress chizig‘i

```html
<div class="trek"><div id="chiziq"></div></div>
<input id="qiymat" type="range" min="0" max="100">
```

```js
qiymat.oninput = function () {
  chiziq.style.width = qiymat.value + '%';
  foiz.textContent = qiymat.value + '%';
};
```

## Qachon qaysi?

| Holat                                          | Usul                 |
| ---------------------------------------------- | -------------------- |
| Holat o‘zgardi (faol, ochiq, xato)             | `classList`          |
| Qiymat hisoblanadi (kenglik, koordinata)       | `style`              |
| Mavzu yoki rang to‘plami                       | CSS o‘zgaruvchilari (`style.setProperty`) |
