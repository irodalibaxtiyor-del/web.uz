## O‘lchov birliklari

CSS’da uzunlikni ko‘p usulda yozish mumkin. Moslashuvchan dizaynda **nisbiy** birliklar asosiy vosita: ular boshqa bir narsaga — shrift o‘lchamiga, ota elementga yoki ekranga qarab hisoblanadi.

## Mutlaq birlik: `px`

`px` — CSS piksel. Chegaralar, soyalar, kichik chiziqlar uchun qulay. Lekin shrift va maket kengliklarini faqat `px` da yozish foydalanuvchi sozlamalarini e’tiborsiz qoldiradi.

## Shriftga nisbiy: `rem` va `em`

| Birlik | Nimaga nisbatan | Misol (asos 16px) |
| --- | --- | --- |
| `rem` | `html` elementining shrift o‘lchami | `2rem` = 32px |
| `em` | O‘sha elementning (yoki otasining) shrift o‘lchami | ota 16px bo‘lsa, `0.875em` = 14px |

```css
h1 { font-size: 2rem; }          /* har doim asosga nisbatan */
.izoh { font-size: 0.875em; }    /* ota matndan biroz kichik */
.tugma { padding: 0.5em 1em; }   /* tugma matni kattalashsa, bo‘shliq ham kattalashadi */
```

Agar foydalanuvchi brauzerda standart shriftni 20px qilsa, `rem` dagi hamma narsa proporsional kattalashadi. `px` dagi shrift esa o‘zgarmaydi — shuning uchun matn uchun `rem` tavsiya etiladi.

`em` ichma-ich kattalashib ketishi mumkin: `1.2em` ichida yana `1.2em` — 1.44 marta. Bu chalkashlik bermasligi uchun shriftlarda ko‘proq `rem`, bo‘shliqlarda esa ba’zan `em` ishlatiladi.

## Ota elementga nisbiy: `%`

`width: 25%` — ota element kengligining choragi. 800px konteynerda bu 200px.

Diqqat: `padding` va `margin` dagi foiz ham ota **kengligidan** hisoblanadi (hatto vertikal yo‘nalishda ham).

## Ekranga nisbiy: `vw`, `vh`, `dvh`

- `1vw` — viewport kengligining 1%;
- `1vh` — viewport balandligining 1%;
- `100dvh` — **dinamik** balandlik: mobil brauzerda manzil paneli yashirinsa yoki ko‘rinsa, qiymat shunga moslashadi.

Telefonda `100vh` ko‘pincha ekrandan biroz baland chiqadi (manzil paneli hisobga olinmaydi), shu sabab to‘liq ekranli bo‘limlar uchun `100dvh` yaxshiroq. Eski brauzerlar uchun ikkalasini yozish mumkin:

```css
.ekran {
  min-height: 100vh;  /* zaxira */
  min-height: 100dvh; /* tushunadigan brauzer shuni oladi */
}
```

## Qaysi birlik qachon

- Shrift o‘lchami — `rem`.
- Komponent ichidagi bo‘shliq — `rem` yoki `em`.
- Maket kengliklari — `%`, `fr`, `min()`.
- To‘liq ekranli bo‘limlar — `dvh`.
- Ingichka chegara — `px`.

Mashqda piksellarda yozilgan sahifani nisbiy birliklarga o‘tkazasiz.
