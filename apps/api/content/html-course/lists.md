## Ro‘yxat turlari

HTML’da uch xil ro‘yxat bor.

## 1. Tartibsiz ro‘yxat — `<ul>`

Tartib muhim bo‘lmaganda. Elementlar odatda nuqta bilan belgilanadi:

```html
<ul>
  <li>Non</li>
  <li>Sut</li>
  <li>Olma</li>
</ul>
```

## 2. Tartiblangan ro‘yxat — `<ol>`

Ketma-ketlik muhim bo‘lganda — yo‘riqnoma, reyting:

```html
<ol>
  <li>Choynakka suv quying</li>
  <li>Qaynating</li>
  <li>Choy damlang</li>
</ol>
```

Foydali atributlar:

```html
<ol type="A">
  ...
</ol>
<!-- A, B, C -->
<ol type="i">
  ...
</ol>
<!-- i, ii, iii -->
<ol start="5">
  ...
</ol>
<!-- 5 dan boshlanadi -->
<ol reversed>
  ...
</ol>
<!-- teskari tartibda -->
```

## 3. Ta’riflar ro‘yxati — `<dl>`

Atama va uning ta’rifi:

```html
<dl>
  <dt>HTML</dt>
  <dd>Sahifa tuzilmasini tasvirlovchi til</dd>
  <dt>CSS</dt>
  <dd>Sahifa ko‘rinishini tasvirlovchi til</dd>
</dl>
```

## Ichma-ich ro‘yxatlar

Ro‘yxat elementi ichida yangi ro‘yxat bo‘lishi mumkin — masalan, menyu yoki mundarija:

```html
<ul>
  <li>
    Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </li>
  <li>Backend</li>
</ul>
```

E’tibor bering: ichki `<ul>` aynan `<li>` ichida turadi.

## Navigatsiya menyusi ham ro‘yxat

Sayt menyulari ko‘pincha havolalar ro‘yxati sifatida yoziladi, keyin CSS bilan gorizontal qilinadi:

```html
<nav>
  <ul>
    <li><a href="index.html">Bosh sahifa</a></li>
    <li><a href="kurslar.html">Kurslar</a></li>
    <li><a href="aloqa.html">Aloqa</a></li>
  </ul>
</nav>
```

```css
nav ul {
  list-style: none;
  display: flex;
  gap: 16px;
  padding: 0;
}
```

## Xulosa

- `<ul>` — tartibsiz, `<ol>` — tartiblangan, `<dl>` — ta’riflar ro‘yxati.
- Har bir element `<li>` (yoki `<dt>`/`<dd>`) ichida bo‘ladi.
- Ichki ro‘yxat `<li>` ichiga joylashtiriladi; menyular ham ro‘yxatdan yasaladi.
