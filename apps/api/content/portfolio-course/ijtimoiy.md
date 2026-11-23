## Bog‘lanish yo‘llari

Portfolio oxirida (va ko‘pincha header’da ham) foydalanuvchi siz bilan qanday bog‘lanishini ko‘rsating: GitHub (kod), Telegram, email, LinkedIn. Ikkita-to‘rtta havola yetarli — hamma ijtimoiy tarmoqni qo‘ymang.

## Ikonkali havola

```html
<a href="https://github.com/aziza" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
  <svg aria-hidden="true">…</svg>
</a>
```

- `aria-label` — havolada matn yo‘q, nom shart;
- `svg aria-hidden="true"` — ikonka bezak;
- `target="_blank"` — tashqi sayt yangi oynada.

## `rel="noopener noreferrer"`

`target="_blank"` bilan ochilgan sahifa `window.opener` orqali sizning sahifangizni boshqarishi mumkin edi (masalan, uni soxta sahifaga yo‘naltirish). `noopener` bu aloqani uzadi. Zamonaviy brauzerlar buni standart qiladi, lekin aniq yozib qo‘yish yaxshi odat. `noreferrer` esa qaysi saytdan kelganingizni yubormaydi.

Yangi oynada ochish haqida foydalanuvchini ogohlantirish ham mumkin: yashirin matn “(yangi oynada)” yoki kichik ikonka.

## Ko‘rinish

```css
.ijtimoiy a {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--chegara);
  border-radius: 50%;
  color: var(--matn);
}

.ijtimoiy a:hover,
.ijtimoiy a:focus-visible {
  color: var(--urg);
  border-color: var(--urg);
}
```

44px — barmoq bilan bosishga qulay. Ikonka 20px, atrofidagi bo‘shliq bosish maydonini kattalashtiradi.

## Email

`mailto:` havolasi foydalanuvchining email dasturini ochadi. Lekin hammaning kompyuterida email dasturi sozlanmagan — manzilni matn sifatida ham yozib qo‘ying, nusxa olish oson bo‘lsin. Spam botlardan himoya uchun aloqa formasi (5-modul) yaxshiroq.

## Brend ikonkalari

GitHub, Telegram kabi logotiplar ularning brend qoidalariga bo‘ysunadi: rangini va shaklini o‘zgartirmaslik so‘raladi. Bir rangli (monoxrom) variantlar odatda ruxsat etilgan.

Mashqda ijtimoiy havolalarni accessible va xavfsiz qilasiz.

```tekshir
Yangi tabda ochiladigan tashqi havolaga qaysi `rel` qiymati qo‘shiladi?
+ `rel="noopener noreferrer"`
- `rel="external-only"`
- `rel="stylesheet"`
> `noopener` yangi sahifaning sizning sahifangizni boshqarishiga yo‘l qo‘ymaydi.
```

```jonli
<style>
  .s { display: flex; gap: 8px; }
  .s a { display: inline-grid; place-items: center; width: 44px; height: 44px; border-radius: 50%; background: #6c3483; color: #fff; text-decoration: none; font-weight: 700; }
</style>
<div class="s"><a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub (yangi tabda)">GH</a><a href="mailto:aziza@misol.uz" aria-label="Email yozish">@</a></div>
```
