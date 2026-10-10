## `id` atributi

`id` elementga **yagona** nom beradi. Bitta sahifada bir xil `id` faqat **bitta** elementda bo‘lishi mumkin.

```html
<h1 id="asosiy-sarlavha">Kurs haqida</h1>
```

## CSS’da `id`

CSS’da `id` oldiga **panjara** (`#`) qo‘yiladi:

```css
#asosiy-sarlavha {
  color: #0071dc;
  text-align: center;
}
```

## `class` va `id` farqi

|               | `class`         | `id`                                      |
| ------------- | --------------- | ----------------------------------------- |
| Takrorlanishi | Ko‘p elementda  | Sahifada faqat bitta                      |
| CSS selektori | `.nom`          | `#nom`                                    |
| Odatiy vazifa | Uslub guruhlari | Yagona element: langar, JS, forma maydoni |

Uslub berish uchun odatda `class` afzal — u qayta ishlatiladi. `id` esa quyidagi hollarda kerak bo‘ladi.

## 1. Sahifa ichidagi havola (xatcho‘p)

```html
<a href="#savollar">Ko‘p beriladigan savollarga o‘tish</a>

<!-- ...uzun matn... -->

<h2 id="savollar">Ko‘p beriladigan savollar</h2>
```

Boshqa sahifadagi bo‘limga ham havola qilish mumkin: `kurs.html#savollar`.

## 2. JavaScript’da elementni topish

```html
<p id="soat">--:--</p>
<script>
  document.getElementById('soat').textContent = new Date().toLocaleTimeString();
</script>
```

## 3. Forma maydonini yorliq bilan bog‘lash

```html
<label for="ism">Ismingiz</label> <input id="ism" type="text">
```

`label` ning `for` atributi `input` ning `id`siga mos keladi — yorliq bosilganda maydon faollashadi.

## Nomlash qoidalari

- `id` kamida bitta belgidan iborat bo‘lsin va **bo‘sh joy** bo‘lmasin.
- Raqam bilan boshlamang (CSS’da noqulay).
- Registrga sezgir: `Menu` va `menu` — har xil.

## Xulosa

- `id` — sahifada yagona nom; CSS’da `#nom`.
- Sahifa ichidagi havolalar, JavaScript va forma yorliqlari uchun ishlatiladi.
- Bir xil `id` ni ikki marta ishlatmang.
