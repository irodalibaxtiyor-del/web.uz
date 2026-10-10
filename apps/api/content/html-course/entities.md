## Muammo: maxsus belgilar

`<` va `>` belgilari HTML’da teglar uchun band. Agar matnda “3 < 5” deb yozsangiz, brauzer `<` dan keyin teg boshlanyapti deb o‘ylashi mumkin. Bunday belgilarni **HTML entity** (belgi kodi) bilan yozish kerak.

## Entity yozilishi

```text
&nom;      — nomli
&#raqam;   — o‘nlik kod
&#xHEX;    — o‘n oltilik kod
```

## Eng kerakli entity’lar

| Belgi       | Nomi     | Kod      | Tavsif                 |
| ----------- | -------- | -------- | ---------------------- |
| `<`         | `&lt;`   | `&#60;`  | kichik                 |
| `>`         | `&gt;`   | `&#62;`  | katta                  |
| `&`         | `&amp;`  | `&#38;`  | ampersand              |
| `"`         | `&quot;` | `&#34;`  | qo‘shtirnoq            |
| `'`         | `&apos;` | `&#39;`  | apostrof               |
| (bo‘sh joy) | `&nbsp;` | `&#160;` | uzilmaydigan bo‘sh joy |
| ©           | `&copy;` | `&#169;` | mualliflik belgisi     |

## Misollar

```html
<p>Shart: 3 &lt; 5 va 7 &gt; 2</p>
<p>Teg yozilishi: &lt;p&gt;Matn&lt;/p&gt;</p>
<p>Kompaniya: Aka &amp; Uka</p>
<p>&copy; 2026 WEBDIZAYN.UZ</p>
```

## Uzilmaydigan bo‘sh joy

Oddiy bo‘sh joyda brauzer qatorni uzishi mumkin. `&nbsp;` esa ikki so‘zni bir qatorda ushlab turadi — raqam va birlik orasida qulay:

```html
<p>Masofa: 10&nbsp;km, narxi: 50&nbsp;000&nbsp;so‘m</p>
```

## Diakritik belgilar

Harfga qo‘shiladigan belgilar ham kod bilan yozilishi mumkin:

```html
<p>a&#769; → á</p>
```

Amalda UTF-8 kodirovkasi ishlatilsa, ko‘p belgilarni (o‘, g‘, ñ, é) to‘g‘ridan-to‘g‘ri yozish mumkin. Entity faqat `<`, `>`, `&` kabi maxsus belgilar va klaviaturada yo‘q belgilar uchun kerak.

## Xulosa

- `<`, `>` va `&` matnda `&lt;`, `&gt;`, `&amp;` bo‘lib yoziladi.
- `&nbsp;` — qatorga bo‘linmaydigan bo‘sh joy.
- UTF-8 bilan ko‘pchilik belgilar to‘g‘ridan-to‘g‘ri yoziladi.
