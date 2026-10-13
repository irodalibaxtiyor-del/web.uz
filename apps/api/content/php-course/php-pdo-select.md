## Ma’lumotlarni o‘qish

## Ko‘p qator: `fetchAll()`

```php
<?php
$st = $pdo->query('SELECT ism, ball FROM talabalar ORDER BY ball DESC');
$talabalar = $st->fetchAll(); // FETCH_ASSOC sozlangan bo‘lsa — assotsiativ massivlar ro‘yxati

foreach ($talabalar as $t) {
    echo htmlspecialchars($t['ism']), ': ', $t['ball'], '<br>';
}
```

`query()` — belgisiz (o‘zgaruvchisiz) so‘rovlar uchun. Foydalanuvchidan kelgan qiymat bo‘lsa — **doim** `prepare()` + `execute()`.

> Bazadan kelgan matnni sahifaga chiqarishda ham `htmlspecialchars()` — kimdir ismiga `<script>` yozgan bo‘lishi mumkin (XSS).

## Bitta qator: `fetch()`

```php
<?php
$st = $pdo->prepare('SELECT * FROM talabalar WHERE id = ?');
$st->execute([$_GET['id'] ?? 0]);
$talaba = $st->fetch();

if ($talaba === false) {
    http_response_code(404);
    exit('Talaba topilmadi');
}
echo htmlspecialchars($talaba['ism']);
```

Qator topilmasa `fetch()` **`false`** qaytaradi — buni albatta tekshiring.

## Bitta qiymat: `fetchColumn()`

```php
<?php
$soni = $pdo->query('SELECT COUNT(*) FROM talabalar')->fetchColumn();

$st = $pdo->prepare('SELECT AVG(ball) FROM talabalar WHERE guruh = ?');
$st->execute(['W-12']);
$ortacha = $st->fetchColumn(); // masalan 67.5
```

## Foydali rejimlar

```php
<?php
// Faqat bitta ustun ro‘yxati
$ismlar = $pdo->query('SELECT ism FROM talabalar ORDER BY ism')
    ->fetchAll(PDO::FETCH_COLUMN);
// ['Ali', 'Anvar', 'Lola', 'Vali']

// kalit => qiymat juftliklari (ochiluvchi ro‘yxat uchun qulay)
$ballar = $pdo->query('SELECT ism, ball FROM talabalar')
    ->fetchAll(PDO::FETCH_KEY_PAIR);
// ['Ali' => 80, 'Vali' => 55, ...]
```

## Qidiruv: `LIKE`

`%` belgisi SQL ichida emas, **qiymatda** bo‘ladi:

```php
<?php
$st = $pdo->prepare('SELECT ism FROM talabalar WHERE ism LIKE ? ORDER BY ism');
$st->execute([$_GET['q'] . '%']);
```

## Bir nechta qiymat: `IN (...)`

Har qiymat uchun alohida `?` yasaladi:

```php
<?php
$idlar = [1, 3];
$belgilar = implode(',', array_fill(0, count($idlar), '?')); // "?,?"
$st = $pdo->prepare("SELECT ism FROM talabalar WHERE id IN ($belgilar)");
$st->execute($idlar);
```

SQL’ga faqat o‘zimiz yasagan `?,?` qo‘shildi — foydalanuvchi qiymati emas.

## Sahifalash: `LIMIT` va `OFFSET`

```php
<?php
$sahifa = max(1, (int) ($_GET['sahifa'] ?? 1));
$hajm = 10;

$st = $pdo->prepare('SELECT * FROM talabalar ORDER BY id LIMIT :hajm OFFSET :siljish');
$st->bindValue(':hajm', $hajm, PDO::PARAM_INT);
$st->bindValue(':siljish', ($sahifa - 1) * $hajm, PDO::PARAM_INT);
$st->execute();
```

`bindValue(..., PDO::PARAM_INT)` — qiymat son ekanini aniq aytadi (MySQL `LIMIT '10'` ni qabul qilmaydi).

## Ustun nomi va tartib — oq ro‘yxat bilan

Belgilar faqat **qiymatlar** uchun. Ustun nomi yoki `ASC/DESC` ni foydalanuvchidan olsangiz — ruxsat etilganlar ro‘yxatidan tanlang:

```php
<?php
$ruxsat = ['ism', 'ball'];
$ustun = in_array($_GET['tartib'] ?? '', $ruxsat, true) ? $_GET['tartib'] : 'ism';
$st = $pdo->query("SELECT * FROM talabalar ORDER BY $ustun");
```

## Mustaqil mashq

```php
<?php
$pdo = new PDO('sqlite::memory:', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
$pdo->exec('CREATE TABLE talabalar (id INTEGER PRIMARY KEY, ism TEXT, guruh TEXT, ball INTEGER)');
$pdo->exec("INSERT INTO talabalar (ism, guruh, ball) VALUES
    ('Ali', 'W-12', 80), ('Vali', 'W-12', 55), ('Lola', 'W-14', 92), ('Anvar', 'W-14', 70)");

// 1) W-14 guruhidagilar, ball bo‘yicha kamayish tartibida
$st = $pdo->prepare('SELECT ism FROM talabalar WHERE guruh = ? ORDER BY ball DESC');
$st->execute(['W-14']);
echo implode(',', $st->fetchAll(PDO::FETCH_COLUMN)), ' | ';

// 2) "A" bilan boshlanadiganlar soni
$st = $pdo->prepare('SELECT COUNT(*) FROM talabalar WHERE ism LIKE ?');
$st->execute(['A%']);
echo $st->fetchColumn(), ' | ';

// 3) Mavjud bo‘lmagan id
$st = $pdo->prepare('SELECT * FROM talabalar WHERE id = ?');
$st->execute([99]);
echo $st->fetch() === false ? 'topilmadi' : 'bor';
```

**Kutilgan natija:** `Lola,Anvar | 2 | topilmadi`
