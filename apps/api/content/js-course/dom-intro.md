## DOM nima?

Brauzer HTML’ni o‘qib, uni xotirada **daraxt** ko‘rinishidagi obyektlarga aylantiradi. Bu daraxt **DOM** (Document Object Model) deyiladi. JavaScript sahifa bilan aynan DOM orqali ishlaydi.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Kurslar</title>
  </head>
  <body>
    <h1>Katalog</h1>
    <ul>
      <li>HTML</li>
      <li>CSS</li>
    </ul>
  </body>
</html>
```

```text
document
└── html
    ├── head
    │   └── title — "Kurslar"
    └── body
        ├── h1 — "Katalog"
        └── ul
            ├── li — "HTML"
            └── li — "CSS"
```

Har bir teg — **element** tuguni, matnlar — **matn** tugunlari. Elementlar o‘zaro **ota**, **bola** va **aka-uka** (sibling) munosabatida.

## `document` — kirish nuqtasi

```js
document.title                   // 'Kurslar'
document.body                    // <body> elementi
document.documentElement         // <html>
document.querySelector('h1')     // birinchi <h1>
document.querySelectorAll('li')  // barcha <li> lar
```

## DOM bilan nima qilish mumkin

- elementlarni **topish**;
- matn, HTML va atributlarni **o‘zgartirish**;
- uslub va klasslarni **o‘zgartirish**;
- elementlarni **yaratish** va **o‘chirish**;
- hodisalarga **javob berish**.

Bu modul va keyingisi aynan shular haqida.

## HTML va DOM farqi

HTML — fayldagi **matn**. DOM — undan qurilgan **jonli obyektlar**. JavaScript DOM’ni o‘zgartirsa, sahifa darhol yangilanadi, lekin HTML fayl o‘zgarmaydi. “Sahifa kodini ko‘rish” (`Ctrl + U`) asl HTML’ni ko‘rsatadi; DevTools’ning **Elements** paneli esa joriy DOM’ni.

## Elementning asosiy xususiyatlari

```js
const sarlavha = document.querySelector('h1');
sarlavha.tagName       // 'H1'
sarlavha.textContent   // 'Katalog'
sarlavha.id            // id atributi
sarlavha.className     // class atributi
sarlavha.children      // bola elementlar
sarlavha.parentElement // ota element
```

## Elementlarni sanash

```js
const soni = document.querySelectorAll('li').length;
document.querySelector('h1').textContent = `Katalog (${soni} ta kurs)`;
```

## DOM — standart

DOM HTML’ning bir qismi emas, alohida W3C/WHATWG standarti. U hamma brauzerlarda bir xil ishlaydi va JavaScript’dan boshqa tillardan ham foydalanish mumkin (masalan, serverda HTML tahlil qilishda).

## Skript qayerda turadi

Skript DOM elementlari **yaratilgandan keyin** ishlashi kerak: `<body>` oxirida yoki `defer` bilan. Aks holda `querySelector` `null` qaytaradi.
