## `class` atributi

`class` elementlarga **guruh nomi** beradi. Bir xil klassdagi barcha elementlarga bitta CSS qoidasi bilan uslub berish mumkin.

```html
<p class="eslatma">Darslar soat 18:00 da boshlanadi.</p>
<p>Oddiy paragraf.</p>
<p class="eslatma">Uyga vazifani unutmang!</p>
```

```css
.eslatma {
  background-color: #fff7d6;
  border-left: 4px solid #fec400;
  padding: 8px 12px;
}
```

CSS’da klass nomi oldiga **nuqta** qo‘yiladi: `.eslatma`.

## Bir nechta klass

Bitta elementga bo‘sh joy bilan ajratib bir nechta klass berish mumkin:

```html
<button class="tugma tugma-asosiy">Saqlash</button>
<button class="tugma tugma-xavfli">O‘chirish</button>
```

```css
.tugma {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
}
.tugma-asosiy {
  background: #0071dc;
  color: white;
}
.tugma-xavfli {
  background: #dc2626;
  color: white;
}
```

Shunday qilib umumiy uslub `.tugma`’da, farqlar esa qo‘shimcha klasslarda saqlanadi.

## Turli teglar bir klassda

Klass teg turiga bog‘liq emas:

```html
<h2 class="markaz">Sarlavha</h2>
<p class="markaz">Matn ham markazda</p>
```

## JavaScript va klasslar

JavaScript ham klass orqali elementlarni topadi:

```html
<script>
  const eslatmalar = document.querySelectorAll('.eslatma');
  console.log(eslatmalar.length); // nechta eslatma borligi
</script>
```

## Nomlash bo‘yicha maslahatlar

- Klass nomi elementning **vazifasini** aytsin, ko‘rinishini emas: `.xato-xabari` yaxshi, `.qizil-matn` yomon (keyin rang o‘zgarsa nomi yolg‘on bo‘lib qoladi).
- Kichik harflar va chiziqcha ishlating: `.mahsulot-kartochkasi`.
- Klass nomi registrga sezgir: `.Eslatma` va `.eslatma` — boshqa-boshqa klasslar.

## Xulosa

- `class` — elementlar guruhi uchun nom; bitta klass ko‘p elementda ishlatiladi.
- CSS’da `.klass-nomi` bilan tanlanadi.
- Bitta elementda bir nechta klass bo‘lishi mumkin.
