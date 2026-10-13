## PHP sintaksisi

## PHP bloki

PHP kodi `<?php` va `?>` orasida yoziladi:

```php
<?php
echo "Salom!";
?>
```

Fayl faqat PHP koddan iborat bo‘lsa, yopuvchi `?>` **yozilmaydi** — bu tasodifiy bo‘sh joy chiqib qolishining oldini oladi. Bu PHP jamoasining rasmiy tavsiyasi.

## HTML bilan aralash

`.php` fayl ichida oddiy HTML bo‘lishi mumkin; PHP faqat kerakli joyda:

```php
<!DOCTYPE html>
<html lang="uz">
<body>
  <h1><?php echo "WEBDIZAYN.UZ"; ?></h1>
  <p>Kurslar soni: <?= 4 ?></p>
</body>
</html>
```

`<?= ... ?>` — `<?php echo ...; ?>` ning qisqa yozuvi. Shablonlarda juda qulay.

## Buyruqlar va nuqta-vergul

Har bir buyruq `;` bilan **tugashi shart** (JavaScript’dagidan farqli, PHP uni o‘zi qo‘ymaydi):

```php
<?php
echo "Bir";
echo "Ikki";
```

`;` unutilsa — `Parse error: syntax error, unexpected ...`.

## Bo‘sh joylar

```php
<?php
echo "A"; echo "B";   // bitta qatorda ikki buyruq
echo
  "C";                // bitta buyruq ikki qatorda
```

Natija: `ABC`. Qatorlar va bo‘sh joylar natijaga ta’sir qilmaydi — faqat `echo` qilingan narsa chiqadi.

## Katta-kichik harf

PHP’da ikki xil qoida:

| Nima | Katta-kichik harf |
| --- | --- |
| Kalit so‘zlar (`echo`, `if`, `while`) | **farq qilmaydi** — `ECHO` ham ishlaydi |
| Funksiya va klass nomlari | **farq qilmaydi** — `strlen` = `STRLEN` |
| O‘zgaruvchilar (`$ism`) | **farq qiladi** — `$ism` ≠ `$Ism` |

```php
<?php
$rang = "qizil";
echo $rang;   // qizil
echo $RANG;   // Warning: Undefined variable $RANG
```

Amalda hammasini kichik harf bilan yozing — bu umumqabul qilingan uslub.

## O‘zgaruvchilar `$` bilan

PHP’da o‘zgaruvchi nomi doim `$` bilan boshlanadi:

```php
<?php
$kurs = "PHP";
echo "Kurs: " . $kurs;
```

Nuqta (`.`) — satrlarni ulash operatori (JavaScript’dagi `+` emas!). Batafsil — keyingi modulda.

## Xato turlari

| Xato | Ma’nosi |
| --- | --- |
| `Parse error` | Sintaksis xatosi — kod umuman bajarilmaydi |
| `Fatal error` | Bajarilish to‘xtadi (masalan, yo‘q funksiya) |
| `Warning` | Ogohlantirish — kod davom etadi |

## Mustaqil mashq

`sana.php` faylini yarating:

```php
<!DOCTYPE html>
<html lang="uz">
<body>
  <h1><?= "Mening sahifam" ?></h1>
  <p>Hozirgi yil: <?php echo date('Y'); ?></p>
</body>
</html>
```

Brauzerda oching, keyin **Sahifa kodini ko‘ring** (`Ctrl + U`).

**Kutilgan natija:** sahifada sarlavha va joriy yil; sahifa kodida PHP yo‘q — faqat tayyor HTML (`<p>Hozirgi yil: 2026</p>`).
