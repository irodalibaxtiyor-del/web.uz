## Brauzer xatoga qanday munosabatda bo‘ladi?

CSS juda “kechirimli” til: xato bo‘lsa, brauzer sahifani to‘xtatmaydi va ogohlantirish ham chiqarmaydi. U shunchaki **tushunmagan qismini e’tiborsiz qoldiradi** va qolganini qo‘llaydi.

Bu qulay, lekin xavfli: xato ko‘zga tashlanmaydi, uslub esa “negadir ishlamaydi”.

## Ko‘p uchraydigan xatolar

| Xato                              | Misol                         | Natija                                |
| --------------------------------- | ----------------------------- | ------------------------------------- |
| Xususiyat nomi noto‘g‘ri          | `colr: red;`                  | Shu e’lon e’tiborsiz qoladi           |
| Qiymat noto‘g‘ri                  | `color: qizil;`               | Shu e’lon e’tiborsiz qoladi           |
| Birlik yo‘q                       | `width: 300;`                 | E’tiborsiz qoladi (`0` dan tashqari)  |
| `;` tushib qolgan                 | `color: red font-size: 2em;`  | Ikki e’lon ham buziladi               |
| `}` yopilmagan                    | `p { color: red;`             | Keyingi qoidalar ham buzilishi mumkin |
| Selektor xato                     | `.karta` o‘rniga `karta`      | Hech qaysi element tanlanmaydi        |

## Birlikni unutmang

```css
.quti {
  width: 300;   /* ishlamaydi */
  width: 300px; /* to‘g‘ri */
  margin: 0;    /* 0 uchun birlik shart emas */
}
```

## Xatoni qanday topish mumkin?

1. **Brauzer ishlab chiquvchi vositalari** (DevTools). Elementni o‘ng tugma bilan bosib “Tekshirish” (Inspect) ni tanlang. “Styles” bo‘limida:
   - ustidan chizilgan e’lon — boshqa qoida uni bosib ketgan;
   - sariq ogohlantirish belgisi — brauzer e’lonni tushunmagan.
2. **Qoidani izohga olib ko‘ring.** Muammo yo‘qolsa, sababini topdingiz.
3. **Selektorni tekshiring.** Vaqtincha `outline: 2px solid red;` qo‘shib, element haqiqatan tanlanayotganini ko‘ring.
4. **Fayl ulanganini tekshiring.** `<link>` dagi yo‘l noto‘g‘ri bo‘lsa, butun CSS yuklanmaydi.

## Bir xatoning domino ta’siri

Yopilmagan qavs eng xavfli xato:

```css
.karta {
  padding: 16px;
/* } yo‘q! */

.tugma {
  color: white;
}
```

Brauzer `.tugma` qoidasini `.karta` ning ichida deb o‘ylaydi va uni noto‘g‘ri tushunadi. Natijada fayl oxirigacha uslublar buzilishi mumkin.

> **Maslahat:** Har bir `{` yozganingizda darhol `}` ni ham yozing, keyin ichini to‘ldiring. Kod muharrirlari bunda yordam beradi.

## Validator

W3C CSS Validator kabi xizmatlar faylni tekshirib, xatolarni qator raqami bilan ko‘rsatadi.

## Xulosa

- Brauzer tushunmagan e’lonni jimgina tashlab yuboradi.
- Ko‘p uchraydigan xatolar: noto‘g‘ri nom, birliksiz son, `;` yoki `}` tushib qolishi.
- DevTools’dagi “Styles” bo‘limi — xato qidirishning asosiy vositasi.
