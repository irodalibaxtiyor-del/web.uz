## Foydalanuvchi qayerda?

Menyudagi joriy bo‘limni belgilash foydalanuvchiga sahifaning qaysi qismida ekanini ko‘rsatadi. Ko‘p saytlarda bu faqat rang bilan qilinadi — ekran o‘quvchi uchun esa hech narsa o‘zgarmaydi.

## `aria-current`

```html
<a href="#haqimda" aria-current="true">Men haqimda</a>
```

`aria-current` — “bu element hozirgi joy”. Ekran o‘quvchi “Men haqimda, joriy” deb o‘qiydi. Qiymatlar: `page` (ko‘p sahifali saytda joriy sahifa), `location`, `step`, `true`.

CSS’da holatni atributdan olamiz — alohida klass kerak emas:

```css
.menyu a[aria-current='true'] {
  color: var(--urg);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 6px;
}
```

Rangdan tashqari qalinlik va chiziq ham — rangni ajratmaydigan foydalanuvchi uchun.

## Bosilganda

```js
const havolalar = document.querySelectorAll('.menyu a');

havolalar.forEach((havola) => {
  havola.addEventListener('click', () => {
    havolalar.forEach((h) => h.removeAttribute('aria-current'));
    havola.setAttribute('aria-current', 'true');
  });
});
```

## Aylantirganda (qo‘shimcha)

Foydalanuvchi menyuni bosmasdan, shunchaki aylantirib ham bo‘limlar orasida yuradi. Joriy bo‘limni avtomatik aniqlash uchun **IntersectionObserver** ishlatiladi:

```js
const kuzatuvchi = new IntersectionObserver(
  (yozuvlar) => {
    for (const y of yozuvlar) {
      if (!y.isIntersecting) continue;
      havolalar.forEach((h) =>
        h.toggleAttribute('aria-current', h.getAttribute('href') === `#${y.target.id}`),
      );
    }
  },
  { rootMargin: '-50% 0px -50% 0px' },
);

document.querySelectorAll('main section').forEach((s) => kuzatuvchi.observe(s));
```

`rootMargin` bilan “ekran o‘rtasidan o‘tayotgan bo‘lim” joriy hisoblanadi. `toggleAttribute` atributni qo‘shadi yoki olib tashlaydi (qiymati bo‘sh satr — CSS’da `[aria-current]` selektori bilan ushlash kerak bo‘ladi).

Platformadagi tekshiruv aylantirishni taqlid qilmaydi, shuning uchun mashq bosish holati haqida; kuzatuvchini o‘z portfolioingizda sinab ko‘ring.

Mashqda bosilgan havolani `aria-current` bilan belgilaysiz.
