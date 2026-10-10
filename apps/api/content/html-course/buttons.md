## Tugma: `<button>`

Tugma foydalanuvchi **harakat** bajarishi uchun: formani yuborish, oynani ochish, ma’lumotni saqlash.

```html
<button type="button">Bosing</button>
```

## `type` atributi

| Qiymat   | Vazifasi                                          |
| -------- | ------------------------------------------------- |
| `button` | Oddiy tugma; nima qilishini JavaScript belgilaydi |
| `submit` | Formani yuboradi (forma ichida standart qiymat)   |
| `reset`  | Forma maydonlarini tozalaydi                      |

Forma ichidagi tugmaga har doim `type` yozing — aks holda u `submit` bo‘lib, kutilmaganda formani yuborib yuborishi mumkin.

## Tugma bosilganda nimadir qilish

```html
<button type="button" id="salom-tugma">Salom ayt</button>
<p id="javob"></p>

<script>
  document.getElementById('salom-tugma').addEventListener('click', () => {
    document.getElementById('javob').textContent = 'Assalomu alaykum!';
  });
</script>
```

## Faolsiz tugma

```html
<button type="submit" disabled>Yuborish</button>
```

`disabled` atributli tugmani bosib bo‘lmaydi.

## Tugmani bezash

```html
<button type="button" class="tugma">Ro‘yxatdan o‘tish</button>

<style>
  .tugma {
    background-color: #0071dc;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  .tugma:hover {
    background-color: #005bb5;
  }
</style>
```

## Tugma yoki havola?

| Vazifa                                           | Element    |
| ------------------------------------------------ | ---------- |
| Boshqa sahifaga o‘tish                           | `<a href>` |
| Shu sahifada harakat (yuborish, ochish, saqlash) | `<button>` |

Havolani tugmaga o‘xshatib bezash mumkin, lekin ma’nosi bo‘yicha to‘g‘ri tegni tanlang — klaviatura va ekran o‘qiydigan dasturlar shunga qarab ishlaydi.

## Xulosa

- `<button>` — harakat uchun; `type` atributini (`button`, `submit`, `reset`) ko‘rsating.
- Bosilganda JavaScript bilan biror ish bajariladi.
- Sahifaga o‘tish uchun havola, harakat uchun tugma ishlating.
