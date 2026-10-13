## PHP’ni o‘rnatish

PHP kodini bajarish uchun kompyuteringizda **PHP interpretatori** kerak. Ikki yo‘l bor.

## 1-yo‘l: tayyor to‘plam (eng oson)

**XAMPP** (Windows, macOS, Linux) yoki **Laragon** (Windows) — bitta o‘rnatuvchida PHP, Apache veb-serveri va MySQL bazasi.

1. Rasmiy saytdan yuklab, o‘rnating.
2. Boshqaruv panelida **Apache** ni ishga tushiring (keyinroq **MySQL** ham kerak bo‘ladi).
3. Fayllaringizni `htdocs` (XAMPP) yoki `www` (Laragon) papkasiga qo‘ying.
4. Brauzerda `http://localhost/salom.php` ni oching.

## 2-yo‘l: faqat PHP + o‘rnatilgan server

PHP’ni alohida o‘rnatsangiz (Windows: php.net dan arxiv; macOS: `brew install php`; Linux: `sudo apt install php`), terminalda tekshiring:

```bash
php -v
```

```text
PHP 8.3.x (cli) ...
```

PHP’ning o‘zida kichik veb-server bor. Loyiha papkasida:

```bash
php -S localhost:8000
```

Brauzerda `http://localhost:8000/salom.php` ni oching. Server oynasini yopsangiz, sayt to‘xtaydi.

> O‘rnatilgan server faqat **o‘rganish va sinash** uchun. Haqiqiy saytlar Nginx yoki Apache’da ishlaydi.

## Birinchi fayl

`salom.php`:

```php
<?php
echo "Salom, PHP!";
```

Brauzerda: `Salom, PHP!`

## Terminalda bajarish

Veb-serversiz ham bo‘ladi — natija terminalga chiqadi:

```bash
php salom.php
```

Testlardagi “bu kod nimani chiqaradi?” savollarini tekshirish uchun shu usul qulay.

## Muharrir

**VS Code** + **PHP Intelephense** kengaytmasi: xatolarni ko‘rsatadi, funksiyalarni taklif qiladi.

## Xatolarni ko‘rish

O‘rganish paytida xatolar ekranda ko‘rinsin. Faylning boshiga vaqtincha yozing:

```php
<?php
ini_set('display_errors', '1');
error_reporting(E_ALL);
```

> Haqiqiy saytda xatolarni ekranga **chiqarmang** — ular fayl yo‘llari va boshqa ichki ma’lumotlarni oshkor qiladi. Ishlab chiqarishda xatolar faqat log faylga yoziladi.

## Mustaqil mashq

1. PHP’ni yuqoridagi yo‘llardan biri bilan o‘rnating va `php -v` ni bajaring.
2. `salom.php` faylini yarating va uni brauzerda ham, terminalda (`php salom.php`) ham ishga tushiring.
3. Matnni o‘z ismingizga o‘zgartiring.

**Kutilgan natija:** `Salom, PHP!` (keyin — `Salom, <ismingiz>!`), terminal va brauzerda bir xil.
