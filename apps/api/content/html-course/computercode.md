## Kodni sahifada ko‘rsatish

Dasturlash haqidagi maqola, yo‘riqnoma yoki dokumentatsiyada kod, klaviatura tugmalari va dastur natijasini to‘g‘ri belgilash kerak. Brauzer ularni odatda **bir xil kenglikdagi (monospace)** shriftda ko‘rsatadi.

## `<code>` — kod bo‘lagi

```html
<p>Sarlavha qo‘shish uchun <code>&lt;h1&gt;</code> tegidan foydalaning.</p>
```

Kod ichida `<` va `>` belgilarini `&lt;` va `&gt;` bilan yozish kerak — aks holda brauzer ularni haqiqiy teg deb o‘ylaydi. Bu haqda “HTML belgilar” darsida batafsil gaplashamiz.

## `<pre>` + `<code>` — kod bloki

Bir necha qatorli kod uchun bo‘sh joylar va qatorlarni saqlovchi `<pre>` ishlatiladi:

```html
<pre><code>function salom(ism) {
  return 'Salom, ' + ism;
}</code></pre>
```

## `<kbd>` — klaviatura tugmasi

```html
<p>Saqlash uchun <kbd>Ctrl</kbd> + <kbd>S</kbd> ni bosing.</p>
```

## `<samp>` — dastur natijasi

```html
<p>Terminal javobi: <samp>Fayl topilmadi</samp></p>
```

## `<var>` — o‘zgaruvchi

Matematik yoki dasturiy o‘zgaruvchi:

```html
<p>To‘g‘ri to‘rtburchak yuzasi: <var>S</var> = <var>a</var> × <var>b</var></p>
```

## Barchasi birga

```html
<p>
  Terminalda <kbd>node app.js</kbd> buyrug‘ini kiriting. Agar <code>PORT</code> o‘zgaruvchisi
  berilmagan bo‘lsa, dastur <samp>Server 3000-portda ishga tushdi</samp> deb javob beradi.
</p>
```

## Xulosa

- `<code>` — kod, `<pre>` — formatni saqlovchi blok, `<kbd>` — klaviatura tugmasi.
- `<samp>` — dastur natijasi, `<var>` — o‘zgaruvchi.
- Kod ichidagi `<` va `>` belgilarini `&lt;` va `&gt;` bilan yozing.
