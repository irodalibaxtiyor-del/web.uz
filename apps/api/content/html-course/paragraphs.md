## Paragraf

Paragraf `<p>` tegi bilan yoziladi. Brauzer har bir paragrafni yangi qatordan boshlaydi va atrofiga bo‘sh joy qo‘shadi.

```html
<p>Toshkent — O‘zbekistonning poytaxti.</p>
<p>Shahar aholisi uch milliondan oshadi.</p>
```

## Bo‘sh joylar e’tiborga olinmaydi

Kodda qancha bo‘sh joy yoki yangi qator qoldirmang, brauzer ularni **bitta bo‘sh joyga** aylantiradi:

```html
<p>
  Bu      matn
  bir     necha qatorda
  yozilgan.
</p>
```

Natijada matn bitta qatorda, oddiy bo‘sh joylar bilan chiqadi. Sahifa ko‘rinishini kod formatlash emas, teglar va CSS belgilaydi.

## Qator tashlash: `<br>`

Paragraf ichida yangi qatordan davom etish kerak bo‘lsa (masalan, manzil yoki she’r), `<br>` ishlatiladi:

```html
<p>
  Toshkent shahri,<br>
  Amir Temur ko‘chasi, 1-uy
</p>
```

> `<br>` ni paragraflar orasida bo‘sh joy hosil qilish uchun ishlatmang — buning uchun alohida `<p>` va CSS’dan foydalaning.

## Formatlangan matn: `<pre>`

`<pre>` ichidagi matn yozilganidek — bo‘sh joylar va qatorlar bilan — ko‘rsatiladi. Odatda bir xil kenglikdagi shriftda chiqadi:

```html
<pre>
  Yulduzcha uchburchak:
      *
     ***
    *****
</pre>
```

## Gorizontal chiziq: `<hr>`

`<hr>` mavzu almashganini bildiradi:

```html
<p>Birinchi mavzu tugadi.</p>
<hr>
<p>Endi ikkinchi mavzu.</p>
```

## Xulosa

- Matn bloklari `<p>` bilan yoziladi.
- Koddagi ortiqcha bo‘sh joy va qatorlar ko‘rinishga ta’sir qilmaydi.
- Qator tashlash — `<br>`, matnni aynan saqlash — `<pre>`, mavzu ajratish — `<hr>`.
