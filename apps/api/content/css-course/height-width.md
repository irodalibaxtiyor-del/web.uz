## Kenglik va balandlik

`width` va `height` elementning kontent qismining o‘lchamini belgilaydi:

```css
.rasm-quti {
  width: 300px;
  height: 200px;
}
```

Qiymatlar:

| Qiymat     | Ma’nosi                                     |
| ---------- | ------------------------------------------- |
| `auto`     | Brauzer o‘zi hisoblaydi (standart)          |
| `300px`    | Aniq o‘lcham                                |
| `50%`      | Ota elementning kengligi/balandligiga nisbatan |
| `20rem`, `30vw` | Boshqa birliklar (keyingi darslarda)   |

## Blok elementlarning kengligi

Blok element (`div`, `p`, `section`) standart holda ota elementning **butun kengligini** egallaydi. Balandligi esa kontentiga qarab o‘zgaradi.

> **Maslahat:** Balandlikni qat’iy bermaslikka harakat qiling. Matn ko‘paysa yoki shrift kattalashsa, kontent blokdan chiqib ketadi.

## Cheklovlar: `min-*` va `max-*`

| Xususiyat    | Vazifasi                        |
| ------------ | ------------------------------- |
| `max-width`  | Bundan kengroq bo‘lmasin        |
| `min-width`  | Bundan torroq bo‘lmasin         |
| `max-height` | Bundan balandroq bo‘lmasin      |
| `min-height` | Bundan pastroq bo‘lmasin        |

```css
.maqola {
  max-width: 720px;   /* katta ekranda ham o‘qish qulay */
  margin: 0 auto;
}

.hero {
  min-height: 300px;  /* kamida 300px, kontent ko‘p bo‘lsa — kattaroq */
}
```

`max-width` `width` dan kuchliroq: agar `width: 900px; max-width: 600px;` bo‘lsa, element 600px bo‘ladi.

## `width` va `max-width` farqi

```css
.a { width: 600px; }
.b { max-width: 600px; }
```

Ekran 400px bo‘lsa:

- `.a` — 600px bo‘lib qoladi va ekrandan chiqib ketadi (gorizontal aylantirish paydo bo‘ladi);
- `.b` — 400px ga qisqaradi.

Shuning uchun moslashuvchan sahifalarda `max-width` afzal.

## Foizli balandlik

`height: 50%` faqat ota elementning balandligi aniq berilgan bo‘lsa ishlaydi. Aks holda `auto` kabi bo‘ladi. Ekran balandligiga nisbatan o‘lcham uchun `vh` birligi qulay:

```css
.toliq-ekran {
  min-height: 100vh;
}
```

## Xulosa

- `width`/`height` — kontent o‘lchami; blok elementlar standart holda to‘liq kenglikda.
- `max-width` va `min-height` — moslashuvchan dizaynning asosiy vositalari.
- Balandlikni qat’iy bermang; foizli balandlik ota balandligi aniq bo‘lsagina ishlaydi.
