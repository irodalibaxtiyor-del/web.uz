## Satrlarni formatlash

## `printf` va `sprintf`

Shablon va qiymatlar alohida beriladi:

```php
<?php
printf("%s: %d ta, %.2f so‘m", "Non", 3, 4000);
// Non: 3 ta, 4000.00 so‘m

$matn = sprintf("%s: %d ta", "Sut", 2); // chiqarmaydi, satr qaytaradi
```

| Belgi | Ma’nosi | Misol | Natija |
| --- | --- | --- | --- |
| `%s` | Satr | `sprintf("%s", "PHP")` | `PHP` |
| `%d` | Butun son | `sprintf("%d", 42.9)` | `42` |
| `%.2f` | Kasr, 2 xona | `sprintf("%.2f", 3.14159)` | `3.14` |
| `%05d` | 5 xonagacha nol bilan | `sprintf("%05d", 42)` | `00042` |
| `%-6s` | 6 belgiga, chapga tekislab | `sprintf("%-6s|", "ab")` | `ab    \|` |
| `%%` | Foiz belgisi | `sprintf("%d%%", 20)` | `20%` |

Qachon `sprintf` qulay:

- son formatini aniq boshqarish kerak (nol bilan to‘ldirish, xonalar);
- shablon bir joyda, qiymatlar boshqa joyda (tarjimalar).

## Sonni chiroyli ko‘rsatish: `number_format`

```php
<?php
echo number_format(1234567);                 // 1,234,567
echo number_format(1234567.891, 2, '.', ' '); // 1 234 567.89
```

Argumentlar: son, kasr xonalari, kasr ajratgich, minglik ajratgich. O‘zbekistonda odatda minglar bo‘sh joy bilan ajratiladi.

## Interpolatsiya, `.` yoki `sprintf`?

```php
<?php
$ism = "Ali";
$ball = 92.456;

echo "Salom, $ism!";                         // oddiy holatda — interpolatsiya
echo "Ball: " . round($ball, 1);             // ifoda bo‘lsa — ulash
echo sprintf("%s: %.1f ball", $ism, $ball);  // format kerak bo‘lsa — sprintf
```

Uchalasi ham `Ali` va `92.5` ni chiqaradi — vaziyatga qarab o‘qilishi osonini tanlang.

## HTML uchun xavfsiz chiqarish

```php
<?php
$izoh = '<b>"salom"</b>';
echo htmlspecialchars($izoh); // &lt;b&gt;&quot;salom&quot;&lt;/b&gt;
```

Foydalanuvchi matnini HTML’ga qo‘yishdan oldin **doim** `htmlspecialchars`. Teglar matn bo‘lib ko‘rinadi, kod sifatida ishlamaydi.

## Qator ko‘chirishlarni `<br>` ga

```php
<?php
echo nl2br(htmlspecialchars("Birinchi qator\nIkkinchi qator"));
```

Avval `htmlspecialchars`, keyin `nl2br` — tartib muhim: aks holda `<br>` ham kodlanib ketadi.

## Heredoc bilan shablon

```php
<?php
$ism = "Ali";
$narx = number_format(450000, 0, '.', ' ');
echo <<<HTML
<div class="karta">
  <h3>{$ism}</h3>
  <p>Narx: {$narx} so‘m</p>
</div>
HTML;
```

## Mustaqil mashq

Chek satrlarini bir xil kenglikda chiqaring:

```php
<?php
printf("%-8s%5d so‘m\n", "Non", 4000);
printf("%-8s%5d so‘m\n", "Sut", 12000);
printf("Jami: %s so‘m\n", number_format(16000, 0, '.', ' '));
```

**Kutilgan natija** (terminalda):

```text
Non      4000 so‘m
Sut     12000 so‘m
Jami: 16 000 so‘m
```
