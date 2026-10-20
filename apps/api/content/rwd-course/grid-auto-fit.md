## Ustunlar sonini brauzer hisoblasin

Grid’da bitta qator bilan media so‘rovsiz moslashuvchan to‘r qurish mumkin:

```css
.galereya {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

O‘qilishi: “Har biri kamida 250px, ko‘pi bilan bo‘sh joyning bir ulushi bo‘lgan ustunlardan **qancha sig‘sa**, shuncha qo‘y.”

## Qismlar

- `repeat(n, ...)` — ustun ta’rifini takrorlash;
- `auto-fit` / `auto-fill` — sonni brauzer hisoblaydi;
- `minmax(250px, 1fr)` — ustunning eng kichik va eng katta o‘lchami;
- `1fr` — bo‘sh joyning bir ulushi.

## `auto-fit` va `auto-fill`

Elementlar kam bo‘lganda farq ko‘rinadi. 1100px konteynerda 4 ta ustun sig‘adi, lekin element 2 ta:

- `auto-fill` — 4 ta ustun qoladi, 2 tasi bo‘sh; elementlar 250px atrofida;
- `auto-fit` — bo‘sh ustunlar yig‘iladi, 2 ta element butun kenglikka cho‘ziladi.

Galereya va kartalar uchun ko‘pincha `auto-fit` olinadi; elementlar soni o‘zgarganda ham bir xil o‘lcham kerak bo‘lsa — `auto-fill`.

## Juda tor ekran muammosi

`minmax(250px, 1fr)` da ustun hech qachon 250px dan torroq bo‘lmaydi. 240px oynada blok ekrandan chiqib ketadi va gorizontal aylantirish paydo bo‘ladi. Yechim — minimumni ham cheklash:

```css
grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
```

Endi minimum “250px yoki konteyner kengligi — qaysi kichik bo‘lsa”.

## Hisob misoli

1100px, `gap: 20px`, minimum 250px: `(1100 + 20) / (250 + 20)` ≈ 4.1, ya’ni 4 ta ustun. Har biri `(1100 − 3 × 20) / 4 = 260px`.

560px da 2 ta ustun, har biri 270px; 375px da bitta ustun.

## Qachon media so‘rov baribir kerak

Agar telefonda 1, planshetda **aniq** 2, kompyuterda **aniq** 4 ta ustun bo‘lishi talab qilinsa — media so‘rov aniqroq. `auto-fit` esa “nechta sig‘sa” mantiqi bilan ishlaydi.

Mashqda qotgan 4 ustunli galereyani shu bitta qator bilan almashtirasiz.
