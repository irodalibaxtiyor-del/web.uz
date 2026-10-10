## Selektor nima?

**Selektor** qaysi HTML elementlarga uslub berilishini aytadi. CSS’ni yaxshi bilishning yarmi — kerakli elementni aniq tanlay olishdir.

## Element selektori

Teg nomi bo‘yicha **barcha** shunday elementlarni tanlaydi:

```css
p {
  color: #333;
}
```

Sahifadagi har bir `<p>` to‘q kulrang bo‘ladi.

## Klass selektori: `.`

`class` atributi bo‘yicha tanlaydi. Nomdan oldin nuqta qo‘yiladi:

```html
<p class="eslatma">Ertaga dars yo‘q.</p>
```

```css
.eslatma {
  background-color: #fff8db;
}
```

Klassni istalgan elementga va istalgancha elementga berish mumkin. Bu — eng ko‘p ishlatiladigan selektor.

Faqat ma’lum tegdagi klassni tanlash ham mumkin:

```css
p.eslatma {
  font-weight: bold;
}
```

## Id selektori: `#`

`id` atributi bo‘yicha tanlaydi. Id sahifada **yagona** bo‘ladi:

```html
<header id="sarlavha">...</header>
```

```css
#sarlavha {
  padding: 24px;
}
```

> **Maslahat:** Bezak uchun klasslardan foydalaning. Id’lar xatcho‘p havolalar va JavaScript uchun qulayroq; ularning “og‘irligi” katta bo‘lgani uchun keyinroq uslubni o‘zgartirish qiyinlashadi.

## Universal selektor: `*`

Sahifadagi **barcha** elementlarni tanlaydi:

```css
* {
  box-sizing: border-box;
}
```

## Guruhlash

Vergul bilan bir nechta selektorga bitta uslub beriladi:

```css
h1,
.sarlavha,
#asosiy-sarlavha {
  color: #0071dc;
}
```

## Qisqacha jadval

| Selektor     | Misol       | Nimani tanlaydi                        |
| ------------ | ----------- | -------------------------------------- |
| Element      | `p`         | Barcha `<p>` lar                       |
| Klass        | `.karta`    | `class="karta"` bo‘lgan elementlar     |
| Id           | `#menyu`    | `id="menyu"` bo‘lgan bitta element     |
| Universal    | `*`         | Hamma elementlar                       |
| Guruh        | `h1, h2`    | Barcha `<h1>` va `<h2>` lar            |

Murakkabroq selektorlar (ichki elementlar, holatlar, atributlar) alohida modulda o‘rganiladi.

## Xulosa

- Element selektori — teg nomi, klass — `.nom`, id — `#nom`.
- Bezak uchun asosan klasslardan foydalaning.
- Vergul bilan bir nechta selektorga bitta uslub beriladi.
