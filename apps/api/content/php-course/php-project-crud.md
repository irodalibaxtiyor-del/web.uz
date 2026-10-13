## Loyiha 3: Vazifalar ro‘yxati (CRUD)

Yakuniy loyiha — har bir foydalanuvchining **shaxsiy** vazifalar ro‘yxati: qo‘shish, ko‘rish, tahrirlash, bajarildi deb belgilash, o‘chirish. Oldingi loyihadagi kirish tizimi ustiga quriladi.

## Tuzilma

```text
auth/                 — 2-loyiha (bootstrap.php, login.php ...)
  vazifalar.php       — ro‘yxat + qo‘shish
  tahrir.php          — bitta vazifani tahrirlash
  amal.php            — belgilash va o‘chirish (faqat POST)
  src/VazifaRepo.php  — baza bilan ishlash bitta joyda
```

## Jadval

`bootstrap.php` ga qo‘shing:

```php
<?php
$pdo->exec('CREATE TABLE IF NOT EXISTS vazifalar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    egasi_id INTEGER NOT NULL REFERENCES foydalanuvchilar(id),
    nom TEXT NOT NULL,
    bajarildi INTEGER NOT NULL DEFAULT 0,
    yaratildi TEXT NOT NULL
)');
```

`egasi_id` — vazifa kimga tegishli. Har bir so‘rovda shu ustun tekshiriladi.

## Repozitoriy klassi

SQL so‘rovlarni sahifalarga sochib yubormay, bitta klassga yig‘amiz. Har bir metod **egasi** bilan ishlaydi:

```php
<?php
final class VazifaRepo
{
    public function __construct(private PDO $pdo) {}

    public function royxat(int $egasi): array
    {
        $st = $this->pdo->prepare(
            'SELECT id, nom, bajarildi FROM vazifalar WHERE egasi_id = ? ORDER BY bajarildi, id DESC'
        );
        $st->execute([$egasi]);
        return $st->fetchAll();
    }

    public function topish(int $egasi, int $id): ?array
    {
        $st = $this->pdo->prepare('SELECT * FROM vazifalar WHERE id = ? AND egasi_id = ?');
        $st->execute([$id, $egasi]);
        return $st->fetch() ?: null;
    }

    public function qoshish(int $egasi, string $nom): int
    {
        $st = $this->pdo->prepare(
            'INSERT INTO vazifalar (egasi_id, nom, yaratildi) VALUES (?, ?, ?)'
        );
        $st->execute([$egasi, $nom, date('Y-m-d H:i')]);
        return (int) $this->pdo->lastInsertId();
    }

    public function nomlash(int $egasi, int $id, string $nom): bool
    {
        $st = $this->pdo->prepare('UPDATE vazifalar SET nom = ? WHERE id = ? AND egasi_id = ?');
        $st->execute([$nom, $id, $egasi]);
        return $st->rowCount() === 1;
    }

    public function almashtir(int $egasi, int $id): bool
    {
        $st = $this->pdo->prepare(
            'UPDATE vazifalar SET bajarildi = 1 - bajarildi WHERE id = ? AND egasi_id = ?'
        );
        $st->execute([$id, $egasi]);
        return $st->rowCount() === 1;
    }

    public function ochirish(int $egasi, int $id): bool
    {
        $st = $this->pdo->prepare('DELETE FROM vazifalar WHERE id = ? AND egasi_id = ?');
        $st->execute([$id, $egasi]);
        return $st->rowCount() === 1;
    }
}
```

`$egasi` **doim sessiyadan** olinadi (`kirgan()['id']`), hech qachon formadan yoki URL’dan emas.

## `vazifalar.php` — ro‘yxat va qo‘shish

```php
<?php
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/src/VazifaRepo.php';

$u = kirgan();
if ($u === null) {
    header('Location: login.php');
    exit;
}
$repo = new VazifaRepo($pdo);
$xato = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_tekshir();
    $nom = trim($_POST['nom'] ?? '');
    if ($nom === '' || mb_strlen($nom) > 200) {
        $xato = 'Vazifa nomi 1–200 belgi bo‘lsin';
    } else {
        $repo->qoshish($u['id'], $nom);
        header('Location: vazifalar.php');
        exit;
    }
}
$vazifalar = $repo->royxat($u['id']);
?>
<!doctype html>
<html lang="uz">
<head><meta charset="utf-8"><title>Vazifalarim</title></head>
<body>
  <h1>Vazifalarim (<?= count($vazifalar) ?>)</h1>

  <form method="post">
    <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
    <label>Yangi vazifa <input name="nom" maxlength="200" required></label>
    <button>Qo‘shish</button>
  </form>
  <?php if ($xato): ?><p role="alert"><?= e($xato) ?></p><?php endif; ?>

  <ul>
    <?php foreach ($vazifalar as $v): ?>
      <li>
        <?= $v['bajarildi'] ? '<s>' . e($v['nom']) . '</s>' : e($v['nom']) ?>
        <a href="tahrir.php?id=<?= (int) $v['id'] ?>">Tahrirlash</a>
        <form method="post" action="amal.php" style="display:inline">
          <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
          <input type="hidden" name="id" value="<?= (int) $v['id'] ?>">
          <button name="amal" value="almashtir"><?= $v['bajarildi'] ? 'Qaytarish' : 'Bajarildi' ?></button>
          <button name="amal" value="ochir">O‘chirish</button>
        </form>
      </li>
    <?php endforeach; ?>
  </ul>
</body>
</html>
```

## `amal.php` — belgilash va o‘chirish

```php
<?php
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/src/VazifaRepo.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}
csrf_tekshir();
$u = kirgan();
if ($u === null) {
    header('Location: login.php');
    exit;
}

$repo = new VazifaRepo($pdo);
$id = filter_var($_POST['id'] ?? '', FILTER_VALIDATE_INT) ?: 0;

$ok = match ($_POST['amal'] ?? '') {
    'almashtir' => $repo->almashtir($u['id'], $id),
    'ochir' => $repo->ochirish($u['id'], $id),
    default => false,
};

if (!$ok) {
    http_response_code(404);
    exit('Vazifa topilmadi');
}
header('Location: vazifalar.php');
exit;
```

Begona vazifaning `id` sini yuborish **404** beradi — xuddi u umuman yo‘qdek. “Bu sizniki emas” (403) desak, bunday `id` mavjudligini oshkor qilgan bo‘lamiz.

## `tahrir.php`

```php
<?php
require __DIR__ . '/bootstrap.php';
require __DIR__ . '/src/VazifaRepo.php';

$u = kirgan();
if ($u === null) {
    header('Location: login.php');
    exit;
}
$repo = new VazifaRepo($pdo);
$id = filter_var($_GET['id'] ?? '', FILTER_VALIDATE_INT) ?: 0;

$v = $repo->topish($u['id'], $id);
if ($v === null) {
    http_response_code(404);
    exit('Vazifa topilmadi');
}

$xato = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_tekshir();
    $nom = trim($_POST['nom'] ?? '');
    if ($nom === '' || mb_strlen($nom) > 200) {
        $xato = 'Vazifa nomi 1–200 belgi bo‘lsin';
        $v['nom'] = $nom;
    } else {
        $repo->nomlash($u['id'], $id, $nom);
        header('Location: vazifalar.php');
        exit;
    }
}
?>
<h1>Vazifani tahrirlash</h1>
<?php if ($xato): ?><p role="alert"><?= e($xato) ?></p><?php endif; ?>
<form method="post">
  <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">
  <input name="nom" value="<?= e($v['nom']) ?>" maxlength="200" required>
  <button>Saqlash</button>
  <a href="vazifalar.php">Bekor qilish</a>
</form>
```

## Xavfsizlik ro‘yxati

| Tekshiruv                                      | Qayerda                               |
| ---------------------------------------------- | ------------------------------------- |
| Faqat kirgan foydalanuvchi                     | har sahifada `kirgan()`               |
| Faqat o‘z vazifasi (IDOR himoyasi)             | har SQL’da `AND egasi_id = ?`         |
| SQL injection                                  | faqat tayyorlangan so‘rovlar          |
| XSS                                            | har chiqishda `e()`, `id` lar `(int)` |
| CSRF                                           | har POST’da `csrf_tekshir()`          |
| O‘zgartirish faqat POST                        | `amal.php` boshida 405                |
| Begona/yo‘q `id`                               | bir xil 404                           |

## Mustaqil mashq

1. Loyihani 2-loyiha ustiga quring va ishga tushiring.
2. Ikki xil foydalanuvchi bilan ro‘yxatdan o‘ting (ikkinchisini boshqa brauzerda yoki “inkognito” oynada).
3. Birinchi foydalanuvchida vazifa yarating va uning `id` sini eslab qoling (tahrirlash havolasida ko‘rinadi).
4. Ikkinchi foydalanuvchi sifatida `tahrir.php?id=<o‘sha id>` ni oching.
5. **Qo‘shimcha:** “Faqat bajarilmaganlar” filtri (`?filtr=ochiq`) va har vazifaga muddat (`DATE` ustun, muddati o‘tganlari qizil).

**Kutilgan natija:** 4-qadamda “Vazifa topilmadi” (404) — ikkinchi foydalanuvchi birinchisining vazifasini ko‘rmaydi, tahrirlay olmaydi va o‘chira olmaydi.

Tabriklaymiz — siz PHP’da xavfsiz, ma’lumotlar bazali to‘liq veb-ilova yozdingiz! Keyingi qadam: **Laravel** freymvorki — u marshrutlash, ORM, CSRF va autentifikatsiyani tayyor holda beradi, lekin ichida aynan shu kursdagi g‘oyalar ishlaydi.
