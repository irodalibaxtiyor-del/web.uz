## Qat’iy rejim (`'use strict'`)

JavaScript eski kodlar buzilmasligi uchun ko‘p xatolarga “ko‘z yumadi”. **Qat’iy rejim** bu yumshoqlikni o‘chiradi: jim xatolar haqiqiy xatoga aylanadi.

```js
'use strict';

// fayldagi butun kod qat’iy rejimda
```

Qator fayl yoki funksiyaning **eng boshida** bo‘lishi kerak. Funksiya ichida yozilsa — faqat o‘sha funksiya uchun.

## Nima o‘zgaradi

### 1. E’lonsiz o‘zgaruvchi — xato

```js
'use strict';
let natija = 0;
natjia = 5; // ReferenceError: natjia is not defined
```

Qat’iy rejimsiz bu qator jimgina yangi global `natjia` yaratardi, `natija` esa 0 bo‘lib qolardi — harf xatosini topish uchun soatlab vaqt ketishi mumkin.

### 2. Funksiyadagi `this` — `undefined`

```js
'use strict';
function f() {
  return this;
}
f(); // undefined (qat’iy rejimsiz — window)
```

Bu tasodifan global obyektni o‘zgartirib qo‘yishdan saqlaydi.

### 3. O‘zgartirib bo‘lmaydigan narsaga yozish — xato

```js
'use strict';
const obj = Object.freeze({ a: 1 });
obj.a = 2; // TypeError (qat’iy rejimsiz — jimgina e’tiborsiz)
```

### 4. Takroriy parametr nomlari — xato

```js
'use strict';
function f(a, a) {} // SyntaxError
```

### 5. Ba’zi kelajak kalit so‘zlari band

`implements`, `interface`, `package`, `private`, `protected`, `public`, `static` — nom bo‘la olmaydi.

## Qat’iy rejim yoqilganini qanday bilish mumkin

```js
const qatiy = (function () {
  return this === undefined;
})();
// true — qat’iy rejim
```

## Avtomatik qat’iy rejim

**Modullar** (`<script type="module">`) va **klasslar** ichidagi kod doim qat’iy rejimda — `'use strict'` yozish shart emas. Zamonaviy loyihalarning ko‘pi shuning uchun allaqachon qat’iy rejimda ishlaydi.

## Tavsiya

Oddiy `<script>` fayllari boshiga doim `'use strict';` yozing. Bu “bepul” xato qidiruvchi: harf xatolari va noto‘g‘ri `this` darhol ko‘rinadi.
