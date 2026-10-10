## Sudrab tashlash (Drag and Drop)

HTML elementni sichqoncha bilan ushlab, boshqa joyga **sudrab tashlash** imkonini beradi. Masalan, vazifalar taxtasi (Kanban) yoki fayl yuklash maydoni.

## 1-qadam: elementni sudraladigan qilish

```html
<p id="karta" draggable="true">Meni sudrang</p>
```

`draggable="true"` — elementni ushlab sudrash mumkin. Rasm va havolalar odatiy holda sudraladi.

## 2-qadam: nimani sudrayotganimizni saqlash

```js
const karta = document.getElementById('karta');
karta.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', karta.id);
});
```

`dataTransfer` — sudrash davomida ma’lumot olib yuradigan “cho‘ntak”.

## 3-qadam: tashlash maydoni

```html
<div id="quti" style="min-height: 80px; border: 2px dashed #0071dc; padding: 8px;">
  Bu yerga tashlang
</div>
```

```js
const quti = document.getElementById('quti');

quti.addEventListener('dragover', (e) => {
  e.preventDefault(); // tashlashga ruxsat beradi
});

quti.addEventListener('drop', (e) => {
  e.preventDefault();
  const id = e.dataTransfer.getData('text/plain');
  quti.appendChild(document.getElementById(id));
});
```

> **Muhim:** `dragover` da `preventDefault()` chaqirilmasa, brauzer tashlashga ruxsat bermaydi va `drop` hodisasi umuman ishlamaydi.

## Hodisalar

| Hodisa      | Qachon                                  |
| ----------- | --------------------------------------- |
| `dragstart` | Sudrash boshlandi                       |
| `dragover`  | Element maydon ustida harakatlanmoqda   |
| `dragenter` / `dragleave` | Maydonga kirdi / chiqdi   |
| `drop`      | Tashlandi                               |
| `dragend`   | Sudrash tugadi (muvaffaqiyatli yoki yo‘q) |

`dragenter` va `dragleave` maydonni yoritish uchun qulay:

```js
quti.addEventListener('dragenter', () => quti.classList.add('faol'));
quti.addEventListener('dragleave', () => quti.classList.remove('faol'));
```

## Qulaylik

Sudrash faqat sichqoncha bilan qulay. Klaviatura va ekran o‘qiydigan dastur foydalanuvchilari uchun **muqobil yo‘l** qoldiring — masalan, “Ko‘chirish” tugmasi.

## Xulosa

- `draggable="true"` + `dragstart` da `dataTransfer.setData()`.
- Maydonda `dragover` da `preventDefault()`, `drop` da `getData()`.
- Sichqonchasiz foydalanuvchilar uchun muqobil tugma qoldiring.
