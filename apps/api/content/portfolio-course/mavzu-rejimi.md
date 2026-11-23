## Foydalanuvchi tanlaydi

Ba’zilar qorong‘i mavzuni yaxshi ko‘radi, ba’zilar yorug‘ini. Yaxshi portfolio ikkalasini taklif qiladi va tanlovni eslab qoladi.

## Tokenlar

```css
:root {
  color-scheme: light;
  --fon: #fafaf9;
  --matn: #1c1917;
  --urg: #c2410c;
}

[data-theme='dark'] {
  color-scheme: dark;
  --fon: #1c1917;
  --matn: #fafaf9;
  --urg: #fb923c; /* qorong‘ida ochroq — kontrast yetarli bo‘lsin */
}
```

1-moduldan beri hamma narsa tokenlarda yozilgani uchun butun sayt shu bir necha qator bilan o‘zgaradi.

`color-scheme` brauzerga forma maydonlari, aylantirish chizig‘i va standart ranglarni ham mos rejimda chizishni aytadi.

## Almashtirish va saqlash

```js
const tugma = document.querySelector('.mavzu');

function qollash(mavzu) {
  const qorongi = mavzu === 'dark';
  if (qorongi) document.documentElement.dataset.theme = 'dark';
  else delete document.documentElement.dataset.theme;
  tugma.setAttribute('aria-pressed', String(qorongi));
}

try {
  qollash(localStorage.getItem('mavzu'));
} catch {
  // saqlash imkoni yo‘q — standart mavzu
}

tugma.addEventListener('click', () => {
  const yangi = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  qollash(yangi);
  try {
    localStorage.setItem('mavzu', yangi);
  } catch {
    // tanlov faqat shu tashrifda amal qiladi
  }
});
```

`localStorage` yashirin rejimda, ba’zi brauzer sozlamalarida va iframe/sandbox ichida xato tashlashi mumkin — shuning uchun `try…catch`. Platformadagi RUN oynasi ham shunday muhit: u yerda tanlov saqlanmaydi, lekin sahifa buzilmaydi.

## Tizim sozlamasi

Foydalanuvchi hali tanlamagan bo‘lsa, tizimdagi sozlamaga amal qilish yaxshi:

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    /* qorong‘i tokenlar */
  }
}
```

## “Miltillash” muammosi

Skript sahifa oxirida yuklansa, qorong‘i mavzuni tanlagan foydalanuvchi bir lahza yorug‘ sahifani ko‘radi. Yechim — mavzuni qo‘llaydigan kichik skriptni `<head>` ichida, CSS’dan oldin ishga tushirish.

Mashqda saqlanadigan mavzu almashtirgichni yasaysiz.

```tekshir
Sahifa ochilganda mavzu “miltillashi”ning (avval yorug‘, keyin qorong‘i) oldini qanday olish mumkin?
+ `<head>` dagi kichik skript saqlangan mavzuni CSS yuklanmasdan oldin qo‘llaydi
- mavzuni `DOMContentLoaded` dan keyin qo‘llash
- rasmlarni kechiktirib yuklash
> Mavzu birinchi chizishdan oldin qo‘llanishi kerak.
```

```jonli
<style>
  :root { --fon: #ffffff; --matn: #1b2430; }
  :root[data-mavzu="qorongi"] { --fon: #101820; --matn: #e8eef5; }
  body { background: var(--fon); color: var(--matn); }
</style>
<p>Mavzu almashtirgichi</p>
<button id="t" aria-pressed="false">Qorong‘i mavzu</button>
<script>
  const t = document.getElementById('t');
  t.onclick = () => {
    const q = t.getAttribute('aria-pressed') !== 'true';
    t.setAttribute('aria-pressed', String(q));
    document.documentElement.dataset.mavzu = q ? 'qorongi' : '';
  };
</script>
```
