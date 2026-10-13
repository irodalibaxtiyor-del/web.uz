## O‘zgartirish, o‘chirish va tranzaksiyalar

## UPDATE

```php
<?php
$st = $pdo->prepare('UPDATE talabalar SET ball = :ball WHERE id = :id');
$st->execute(['ball' => 75, 'id' => 2]);

echo $st->rowCount(); // nechta qator o‘zgardi
```

`rowCount()` — `UPDATE`/`DELETE` ta’sir qilgan qatorlar soni. `0` bo‘lsa — bunday `id` yo‘q (yoki MySQL’da qiymat o‘zi shunday edi).

## DELETE

```php
<?php
$st = $pdo->prepare('DELETE FROM talabalar WHERE id = ?');
$st->execute([$id]);

if ($st->rowCount() === 0) {
    http_response_code(404);
}
```

### O‘chirish faqat POST bilan

```html
<!-- Noto‘g‘ri: havola (GET) — brauzer yoki bot uni oldindan ochib yuborishi mumkin -->
<a href="ochir.php?id=5">O‘chirish</a>

<!-- To‘g‘ri: forma (POST) + CSRF token -->
<form method="post" action="ochir.php">
  <input type="hidden" name="id" value="5">
  <input type="hidden" name="csrf" value="<?= htmlspecialchars($_SESSION['csrf']) ?>">
  <button>O‘chirish</button>
</form>
```

Ma’lumotni o‘zgartiradigan har qanday amal — **POST** (yoki PUT/DELETE), hech qachon GET.

### Egasini tekshirish

Foydalanuvchi faqat **o‘zining** yozuvini o‘zgartira olsin. `id` ni URL’dan almashtirish oson:

```php
<?php
$st = $pdo->prepare('DELETE FROM postlar WHERE id = ? AND muallif_id = ?');
$st->execute([$_POST['id'], $_SESSION['user_id']]);
```

`AND muallif_id = ?` bo‘lmasa, istalgan foydalanuvchi boshqaning postini o‘chira oladi.

## Tranzaksiya — “hammasi yoki hech narsa”

Bir hisobdan ikkinchisiga pul o‘tkazish — ikki `UPDATE`. Birinchisidan keyin xato chiqsa, pul “yo‘qolmasligi” kerak:

```php
<?php
try {
    $pdo->beginTransaction();

    $chiq = $pdo->prepare('UPDATE hisoblar SET balans = balans - ? WHERE id = ? AND balans >= ?');
    $chiq->execute([$summa, $kimdan, $summa]);
    if ($chiq->rowCount() !== 1) {
        throw new RuntimeException('Mablag‘ yetarli emas');
    }

    $kir = $pdo->prepare('UPDATE hisoblar SET balans = balans + ? WHERE id = ?');
    $kir->execute([$summa, $kimga]);

    $pdo->commit();      // ikkala o‘zgarish birga saqlanadi
} catch (Throwable $e) {
    $pdo->rollBack();    // hech biri saqlanmaydi
    throw $e;
}
```

- `beginTransaction()` — boshlash;
- `commit()` — tasdiqlash;
- `rollBack()` — bekor qilish: tranzaksiya ichidagi barcha o‘zgarishlar qaytariladi.

## Yumshoq o‘chirish

Ko‘p tizimlarda qator haqiqatan o‘chirilmaydi, faqat belgilanadi — keyin tiklash yoki tarixni ko‘rish mumkin:

```sql
UPDATE postlar SET ochirilgan_vaqt = CURRENT_TIMESTAMP WHERE id = ?;
SELECT * FROM postlar WHERE ochirilgan_vaqt IS NULL;
```

## Mustaqil mashq

```php
<?php
$pdo = new PDO('sqlite::memory:', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);
$pdo->exec('CREATE TABLE hisoblar (id INTEGER PRIMARY KEY, egasi TEXT, balans INTEGER)');
$pdo->exec("INSERT INTO hisoblar (egasi, balans) VALUES ('Ali', 100), ('Vali', 20)");

function otkaz(PDO $pdo, int $kimdan, int $kimga, int $summa): string
{
    try {
        $pdo->beginTransaction();
        $kir = $pdo->prepare('UPDATE hisoblar SET balans = balans + ? WHERE id = ?');
        $kir->execute([$summa, $kimga]);
        $chiq = $pdo->prepare('UPDATE hisoblar SET balans = balans - ? WHERE id = ? AND balans >= ?');
        $chiq->execute([$summa, $kimdan, $summa]);
        if ($chiq->rowCount() !== 1) {
            throw new RuntimeException('yetarli emas');
        }
        $pdo->commit();
        return 'ok';
    } catch (RuntimeException $e) {
        $pdo->rollBack();
        return 'rad';
    }
}

echo otkaz($pdo, 1, 2, 30), ' ', otkaz($pdo, 2, 1, 500), ' ';
echo implode(',', $pdo->query('SELECT balans FROM hisoblar ORDER BY id')->fetchAll(PDO::FETCH_COLUMN));
```

**Kutilgan natija:** `ok rad 70,50` — ikkinchi o‘tkazmada Ali’ga qo‘shilgan 500 ham bekor qilindi.
