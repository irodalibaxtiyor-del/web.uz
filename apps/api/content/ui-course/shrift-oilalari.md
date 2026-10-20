## Shrift interfeysning ovozi

Interfeys matnining 90 foizi — matn. Shrift tanlovi sahifaning o‘qilishini, kayfiyatini va hatto tezligini belgilaydi.

## Umumiy oilalar

| Oila         | Belgisi                          | Qayerda                               |
| ------------ | -------------------------------- | ------------------------------------- |
| `sans-serif` | Harf uchlarida “oyoqcha” yo‘q    | Interfeys, ekran matni                |
| `serif`      | Uchlarida “oyoqcha” bor          | Uzun maqolalar, sarlavhalar, nashrlar |
| `monospace`  | Hamma belgi bir xil kenglikda    | Kod, raqamli jadvallar                |
| `system-ui`  | Operatsion tizimning o‘z shrifti | Ilovaga o‘xshash interfeys            |

## Zaxira ro‘yxati (font stack)

`font-family` da bir nechta shrift vergul bilan yoziladi. Brauzer birinchi mavjudini oladi:

```css
body {
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    sans-serif;
}

code {
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
}
```

- `system-ui` — Windows’da Segoe UI, macOS’da San Francisco, Android’da Roboto. Hech narsa yuklanmaydi — tez va “o‘ziniki” ko‘rinadi.
- Ichida bo‘sh joy bor nomlar qo‘shtirnoqda: `"Segoe UI"`.
- Oxirida doim **umumiy oila** (`sans-serif`, `serif`, `monospace`) — hech biri topilmasa ham matn mos ko‘rinishda chiqadi.

## O‘zbek harflari

Shrift tanlashda `o‘`, `g‘` va tutuq belgisini tekshiring. Ba’zi shriftlarda `‘` (U+2018) juda ingichka yoki noqulay ko‘rinadi. Kirill matni bo‘lsa, shriftda kirill harflari borligiga ham ishonch hosil qiling.

## Nechta shrift?

Bitta interfeysga odatda **bitta**, ko‘pi bilan **ikkita** shrift oilasi: biri sarlavhalar uchun, biri matn uchun. Uchinchi shrift faqat kod uchun. Ko‘p shrift sahifani tartibsiz qiladi va sekinlashtiradi.

Yaxshi juftliklar ko‘pincha **kontrastga** asoslanadi: serifli sarlavha + sans-serif matn yoki geometrik sarlavha + neytral matn. Bir-biriga juda o‘xshash ikki sans-serif — xato kabi ko‘rinadi.

## Shrift va ma’no

- Kod, buyruqlar, fayl nomlari — doim monospace.
- Iqtiboslar uchun kursiv yoki serif — matn oqimidan ajralib turadi.
- Faqat bezak uchun “chiroyli” qo‘lyozma shriftlarini oddiy matnda ishlatmang — o‘qish qiyinlashadi.

Mashqda sahifadagi “Comic Sans” ni to‘g‘ri zaxira ro‘yxatlari bilan almashtirasiz.
