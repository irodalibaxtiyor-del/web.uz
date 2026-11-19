## HSL nima?

**HSL** rangni insonga tushunarli uchta qiymat bilan tasvirlaydi:

| Harf | Nomi            | Qiymati                       |
| ---- | --------------- | ----------------------------- |
| H    | Hue — tus       | 0–360 (rang g‘ildiragida burchak) |
| S    | Saturation — to‘yinganlik | 0% (kulrang) – 100% (yorqin) |
| L    | Lightness — yorqinlik     | 0% (qora) – 100% (oq)         |

```css
.tugma {
  background-color: hsl(210, 100%, 43%);
}
```

## Rang g‘ildiragi

Tus — rang g‘ildiragidagi burchak:

| Burchak | Rang     |
| ------- | -------- |
| 0       | Qizil    |
| 60      | Sariq    |
| 120     | Yashil   |
| 180     | Moviy    |
| 240     | Ko‘k     |
| 300     | Binafsha |

## HSL’ning afzalligi

RGB yoki HEX’da rangni biroz ochroq qilish uchun uchala qiymatni ham hisoblash kerak. HSL’da esa faqat **yorqinlikni** o‘zgartirasiz:

```css
.tugma {
  background-color: hsl(210, 100%, 43%);
}

.tugma:hover {
  background-color: hsl(210, 100%, 35%); /* xuddi shu ko‘k, biroz to‘qroq */
}

.tugma-och {
  background-color: hsl(210, 100%, 95%); /* juda och ko‘k fon */
}
```

Bitta tusdan butun palitra yasash oson: to‘q matn, asosiy rang, och fon.

## To‘yinganlik

```css
.yorqin { color: hsl(0, 100%, 50%); } /* yorqin qizil */
.xira   { color: hsl(0, 30%, 50%); }  /* xira, kulrangga moyil qizil */
.kul    { color: hsl(0, 0%, 50%); }   /* sof kulrang */
```

## Shaffoflik

Alfa qiymati `/` dan keyin yoziladi (yoki eski `hsla()`):

```css
.qoplama {
  background-color: hsl(210 100% 43% / 0.2);
}
```

```tekshir
`hsl()` da qaysi qiymatni o‘zgartirsangiz, bitta rangning och yoki to‘q varianti chiqadi?
- tus (hue)
- to‘yinganlik (saturation)
+ yorqinlik (lightness)
> Tus o‘zgarmasa, rang o‘sha bo‘lib qoladi; yorqinlik uni ochroq yoki to‘qroq qiladi.
```

```jonli
<style>
  div { padding: 8px; color: white; }
</style>
<div style="background: hsl(210 100% 25%)">yorqinlik 25%</div>
<div style="background: hsl(210 100% 43%)">yorqinlik 43%</div>
<div style="background: hsl(210 100% 65%)">yorqinlik 65%</div>
<div style="background: hsl(210 100% 85%); color: black">yorqinlik 85%</div>
```

## Xulosa

- `hsl(tus, to‘yinganlik, yorqinlik)`: tus 0–360, qolganlari foizda.
- Yorqinlikni o‘zgartirib, bitta rangning och va to‘q variantlarini olish oson.
- Shaffoflik: `hsl(210 100% 43% / 0.2)`.
