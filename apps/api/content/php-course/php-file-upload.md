## Fayl yuklash

Fayl yuklash — eng xavfli vazifalardan biri: noto‘g‘ri qilinsa, hujumchi serverga **PHP skript** yuklab, uni ishga tushirishi mumkin. Shuning uchun har bir qadam muhim.

## Forma

```html
<form method="post" enctype="multipart/form-data">
  <input type="file" name="rasm" accept="image/png, image/jpeg">
  <button type="submit">Yuklash</button>
</form>
```

`enctype="multipart/form-data"` **shart** — usiz fayl yuborilmaydi.

## `$_FILES`

```php
<?php
// $_FILES['rasm'] = [
//   'name'     => 'avatar.png',       // foydalanuvchi kompyuteridagi nom — ISHONMANG
//   'type'     => 'image/png',        // brauzer aytgan tur — ISHONMANG
//   'tmp_name' => '/tmp/phpA1b2',     // serverdagi vaqtinchalik fayl
//   'error'    => 0,                  // UPLOAD_ERR_OK
//   'size'     => 120000,             // baytlar
// ]
```

`name` va `type` ni foydalanuvchi istalgancha o‘zgartira oladi.

## Xavfsiz yuklash — qadamma-qadam

```php
<?php
const MAKS_HAJM = 2 * 1024 * 1024; // 2 MB
const RUXSAT = ['image/png' => 'png', 'image/jpeg' => 'jpg'];

$f = $_FILES['rasm'] ?? null;

// 1. Yuklash xatosi
if ($f === null || $f['error'] !== UPLOAD_ERR_OK) {
    exit('Fayl yuklanmadi');
}

// 2. Hajm
if ($f['size'] > MAKS_HAJM) {
    exit('Fayl 2 MB dan katta');
}

// 3. Haqiqiy turini SERVERDA aniqlash (mazmun bo‘yicha)
$tur = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
if (!isset(RUXSAT[$tur])) {
    exit('Faqat PNG yoki JPEG');
}

// 4. Nomni O‘ZIMIZ yaratamiz
$nom = bin2hex(random_bytes(16)) . '.' . RUXSAT[$tur];

// 5. Veb-papkadan tashqariga ko‘chirish
$manzil = __DIR__ . '/../yuklar/' . $nom;
if (!move_uploaded_file($f['tmp_name'], $manzil)) {
    exit('Saqlab bo‘lmadi');
}
echo 'Yuklandi';
```

Har bir qadam nega kerak:

1. `error` — fayl umuman kelganmi (`UPLOAD_ERR_INI_SIZE` — juda katta, `UPLOAD_ERR_NO_FILE` — tanlanmagan).
2. Hajm — disk to‘lib qolmasin.
3. **Tur mazmun bo‘yicha** — `rasm.php` faylini `image/png` deb yuborish oson; `finfo` faylning ichiga qaraydi.
4. **Yangi nom** — foydalanuvchi nomi `../../index.php` yoki `rasm.php.jpg` bo‘lishi mumkin. Kengaytmani ham aniqlangan turdan olamiz.
5. **Veb-papkadan tashqarida** saqlash — yuklangan fayl to‘g‘ridan-to‘g‘ri URL orqali bajarilmasin. Rasmni ko‘rsatish uchun alohida skript (`rasm.php?id=...`) o‘qib beradi.

`move_uploaded_file` — faqat haqiqatan yuklangan faylni ko‘chiradi (boshqa server fayllarini emas).

## Server limitlari

`php.ini` da:

```ini
upload_max_filesize = 2M
post_max_size = 8M
```

`post_max_size` dan katta so‘rovda `$_POST` va `$_FILES` **bo‘sh** keladi — buni ham tekshiring.

## Kengaytmani tekshirish (yordamchi)

Kengaytma — xavfsizlik emas, lekin qo‘shimcha filtr:

```php
<?php
$ext = strtolower(pathinfo('Avatar.JPG', PATHINFO_EXTENSION)); // jpg
var_dump(in_array($ext, ['png', 'jpg', 'jpeg'], true));        // bool(true)
```

## Mustaqil mashq

Yuqoridagi formani va skriptni kompyuteringizda ishga tushiring (`yuklar` papkasini loyiha papkasidan **tashqarida** yarating). Uch xil fayl yuklab ko‘ring: PNG rasm, 3 MB rasm va nomini `test.png` ga o‘zgartirilgan matn fayli.

**Kutilgan natija:** 1 — `Yuklandi` (papkada tasodifiy nomli `.png`); 2 — `Fayl 2 MB dan katta`; 3 — `Faqat PNG yoki JPEG` (nom `.png` bo‘lsa ham).
