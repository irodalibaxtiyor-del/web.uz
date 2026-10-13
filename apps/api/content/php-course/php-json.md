## JSON

JSON — dasturlar orasida ma’lumot almashishning standart formati: PHP API JavaScript’ga, mobil ilovaga, boshqa serverga JSON yuboradi.

## `json_encode` — PHP’dan JSON’ga

```php
<?php
echo json_encode(['ism' => 'Ali', 'ball' => 85, 'otdi' => true, 'izoh' => null]);
// {"ism":"Ali","ball":85,"otdi":true,"izoh":null}
```

| PHP | JSON |
| --- | --- |
| Ro‘yxat `[1, 2]` | Massiv `[1,2]` |
| Assotsiativ `['a' => 1]` | Obyekt `{"a":1}` |
| Bo‘sh `[]` | `[]` |
| Indekslari 0 dan boshlanmagan `[1 => 'a']` | Obyekt `{"1":"a"}` |

Oxirgi qator tuzog‘i: `array_filter` dan keyingi “teshikli” massiv JSON’da **obyekt** bo‘lib qoladi. Ro‘yxat kerak bo‘lsa — `array_values()`.

### Foydali bayroqlar

```php
<?php
json_encode($d, JSON_UNESCAPED_UNICODE);   // o‘zbekcha harflar ‘ emas
json_encode($d, JSON_UNESCAPED_SLASHES);   // "a/b", "a\/b" emas
json_encode($d, JSON_PRETTY_PRINT);        // o‘qish uchun chiroyli
json_encode($d, JSON_THROW_ON_ERROR);      // xatoda istisno
```

Bir nechtasini birga: `JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT`.

## `json_decode` — JSON’dan PHP’ga

```php
<?php
$o = json_decode('{"ism":"Ali","kurslar":["HTML","CSS"]}');
echo $o->ism;           // Ali — obyekt (stdClass)

$a = json_decode('{"ism":"Ali"}', true);
echo $a['ism'];         // Ali — assotsiativ massiv
```

Ikkinchi argument `true` — odatda qulayroq (massiv funksiyalari ishlaydi).

## Buzilgan JSON

```php
<?php
var_dump(json_decode('{yomon}')); // NULL — xato jimgina
echo json_last_error_msg();       // Syntax error
```

`null` ham to‘g‘ri JSON qiymati (`"null"`) bo‘lishi mumkin, shuning uchun ishonchli usul — istisno:

```php
<?php
try {
    $d = json_decode($matn, true, flags: JSON_THROW_ON_ERROR);
} catch (JsonException $e) {
    http_response_code(400);
    exit('Noto‘g‘ri JSON');
}
```

## JSON API

```php
<?php
header('Content-Type: application/json; charset=utf-8');

$kurslar = [
    ['id' => 1, 'nom' => 'HTML'],
    ['id' => 2, 'nom' => 'PHP'],
];
echo json_encode(['data' => $kurslar], JSON_UNESCAPED_UNICODE);
```

JavaScript’dan:

```js
const javob = await fetch('/api/kurslar.php');
const { data } = await javob.json();
```

### So‘rov tanasidagi JSON’ni o‘qish

JavaScript `fetch` JSON yuborsa, u `$_POST` da **bo‘lmaydi**:

```php
<?php
$kiritma = json_decode(file_get_contents('php://input'), true, flags: JSON_THROW_ON_ERROR);
```

## Mustaqil mashq

```php
<?php
$talabalar = [['ism' => 'Ali', 'ball' => 85], ['ism' => 'Jasur', 'ball' => 44]];
$otganlar = array_values(array_filter($talabalar, fn($t) => $t['ball'] >= 60));
echo json_encode(['soni' => count($otganlar), 'royxat' => $otganlar], JSON_UNESCAPED_UNICODE);
```

**Kutilgan natija:** `{"soni":1,"royxat":[{"ism":"Ali","ball":85}]}`
