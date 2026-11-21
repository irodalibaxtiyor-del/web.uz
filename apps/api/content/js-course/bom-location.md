## `location` va `history`

## `location` — joriy manzil

```text
https://webdizayn.uz:443/kurslar/js?kurs=dom&dars=3#mashq
```

| Xususiyat           | Qiymat                          |
| ------------------- | ------------------------------- |
| `location.href`     | To‘liq manzil                   |
| `location.protocol` | `'https:'`                      |
| `location.hostname` | `'webdizayn.uz'`                |
| `location.pathname` | `'/kurslar/js'`                 |
| `location.search`   | `'?kurs=dom&dars=3'`            |
| `location.hash`     | `'#mashq'`                      |
| `location.origin`   | `'https://webdizayn.uz'`        |

```js
location.href = '/kirish';  // boshqa sahifaga o‘tish
location.reload();          // qayta yuklash
location.replace('/kirish'); // tarixda qoldirmasdan o‘tish
```

## `URL` obyekti

Istalgan manzilni tahlil qilish uchun — faqat joriy sahifa emas:

```js
const url = new URL('https://webdizayn.uz/kurslar/js?kurs=dom&dars=3#mashq');
url.hostname                 // 'webdizayn.uz'
url.pathname                 // '/kurslar/js'
url.searchParams.get('kurs') // 'dom'
url.hash                     // '#mashq'
```

Noto‘g‘ri manzil berilsa — `TypeError`:

```js
try {
  new URL('bu manzil emas');
} catch {
  console.log('Noto‘g‘ri URL');
}
```

## `URLSearchParams` — so‘rov parametrlari

O‘qish:

```js
const p = new URLSearchParams(location.search);
p.get('kurs')   // 'dom'
p.has('dars')   // true
```

Yasash — maxsus belgilarni o‘zi **kodlaydi**:

```js
const p = new URLSearchParams({ q: 'flex box', daraja: 'orta' });
p.toString() // 'q=flex+box&daraja=orta'

const url = new URL('https://webdizayn.uz/qidiruv');
url.search = p;
url.href // 'https://webdizayn.uz/qidiruv?q=flex+box&daraja=orta'
```

Qo‘lda `'?q=' + matn` yozsangiz, `&` yoki `#` belgisi bor matn manzilni buzadi.

## `history` — tarix

```js
history.back();     // orqaga
history.forward();  // oldinga
history.go(-2);     // ikki qadam orqaga
```

### Sahifani qayta yuklamasdan manzilni o‘zgartirish

```js
history.pushState({ tab: 'css' }, '', '?tab=css');
```

Manzil satri o‘zgaradi, lekin sahifa **yuklanmaydi**. “Orqaga” bosilganda:

```js
window.addEventListener('popstate', (event) => {
  tabniKorsat(event.state?.tab ?? 'html');
});
```

Bitta sahifali ilovalar (React, Vue routerlari) aynan shu mexanizmda ishlaydi.

## `navigator`

```js
navigator.language   // 'uz-UZ', 'ru-RU'
navigator.onLine     // internet bormi
navigator.userAgent  // brauzer haqida matn (ishonchsiz, oson soxtalashtiriladi)
```

## Mashq sahifasida

Preview alohida, izolyatsiya qilingan muhitda ishlaydi: undagi `location` sizning sahifangiz manzili emas. Shuning uchun mashqda `new URL(...)` bilan berilgan manzillar tahlil qilinadi.

```tekshir
`new URLSearchParams('?kurs=js&bet=2').get('bet')` nima qaytaradi?
+ satr `'2'`
- son `2`
- `null`
> So‘rov parametrlari har doim satr.
```

```jonli
<pre id="out"></pre>
<script>
  // log() natijani shu oynaga chiqaradi (console.log o‘rniga)
  const log = (...a) => (document.getElementById('out').textContent += a.map((x) => (typeof x === 'object' && x !== null ? JSON.stringify(x) : String(x))).join(' ') + '\n');
  const url = new URL('https://webdizayn.uz/kurslar?kurs=js&bet=2#top');
  log(url.hostname, url.pathname, url.hash);
  log(url.searchParams.get('kurs'), typeof url.searchParams.get('bet'));
  url.searchParams.set('bet', '3');
  log(url.href);
</script>
```
