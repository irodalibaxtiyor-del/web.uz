import { dars, natija, q, XATO, type ModuleDef } from '../shared';

// In-memory SQLite with four students; every output question starts from it.
const DB = `<?php
$pdo = new PDO('sqlite::memory:', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
$pdo->exec('CREATE TABLE talabalar (id INTEGER PRIMARY KEY AUTOINCREMENT, ism TEXT NOT NULL UNIQUE, guruh TEXT, ball INTEGER)');
$pdo->exec("INSERT INTO talabalar (ism, guruh, ball) VALUES ('Ali', 'W-12', 80), ('Vali', 'W-12', 55), ('Lola', 'W-14', 92), ('Anvar', 'W-14', 70)");
`;

export const m14: ModuleDef = {
  title: 'Ma’lumotlar bazasi (PDO)',
  lessons: [
    {
      slug: 'php-database',
      title: 'Ma’lumotlar bazasi va SQL',
      quiz: dars('Ma’lumotlar bazasi — test', [
        natija(
          'group-by',
          `${DB}echo json_encode($pdo->query('SELECT guruh, COUNT(*) AS n FROM talabalar GROUP BY guruh ORDER BY guruh')->fetchAll(PDO::FETCH_KEY_PAIR));`,
          ['{"W-12":2,"W-14":2}', '{"W-12":1,"W-14":1}', '{"W-12":135,"W-14":162}', XATO],
          0,
        ),
        natija(
          'order-limit',
          `${DB}echo implode(',', $pdo->query('SELECT ism FROM talabalar ORDER BY ball DESC LIMIT 2')->fetchAll(PDO::FETCH_COLUMN));`,
          ['Lola,Ali', 'Ali,Vali', 'Vali,Anvar', 'Lola,Ali,Anvar,Vali'],
          0,
        ),
        q(
          'crud',
          'CRUD amallariga mos SQL buyruqlari qaysi?',
          [
            '`INSERT`, `SELECT`, `UPDATE`, `DELETE`',
            '`CREATE`, `READ`, `UPDATE`, `DROP`',
            '`ADD`, `GET`, `SET`, `REMOVE`',
            '`INSERT`, `FETCH`, `CHANGE`, `ERASE`',
          ],
          [0],
        ),
        q(
          'where',
          '`DELETE FROM talabalar;` (`WHERE` siz) nima qiladi?',
          [
            'Jadvaldagi **barcha** qatorlarni o‘chiradi',
            'Hech narsa qilmaydi — `WHERE` majburiy',
            'Faqat oxirgi qatorni o‘chiradi',
            'Jadvalning o‘zini o‘chiradi',
          ],
          [0],
        ),
        q(
          'pk',
          'Birlamchi kalit (`PRIMARY KEY`) nima uchun kerak?',
          [
            'Har bir qatorni aniq, takrorlanmas qiymat bilan belgilash uchun',
            'Jadvalni parol bilan himoyalash uchun',
            'Qatorlarni alifbo tartibida saqlash uchun',
            'Ustunlar sonini cheklash uchun',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-pdo-connect',
      title: 'PDO bilan ulanish',
      quiz: dars('PDO bilan ulanish — test', [
        natija(
          'exec-count',
          `<?php\n$pdo = new PDO('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);\n$pdo->exec('CREATE TABLE k (id INTEGER PRIMARY KEY, nom TEXT)');\necho $pdo->exec("INSERT INTO k (nom) VALUES ('HTML'), ('CSS')");`,
          ['2', '1', 'true', XATO],
          0,
        ),
        natija(
          'exception',
          `<?php\n$pdo = new PDO('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);\ntry {\n    $pdo->query('SELECT * FROM yoq');\n    echo 'ok';\n} catch (PDOException $e) {\n    echo 'ushlandi';\n}`,
          ['ushlandi', 'ok', 'okushlandi', ''],
          0,
        ),
        q(
          'dsn',
          'MySQL uchun to‘g‘ri DSN qaysi?',
          [
            '`mysql:host=localhost;dbname=maktab;charset=utf8mb4`',
            '`http://localhost/maktab`',
            '`mysql://maktab@localhost`',
            '`localhost:maktab:utf8`',
          ],
          [0],
        ),
        q(
          'error-message',
          'Ulanish xatosida foydalanuvchiga nima ko‘rsatiladi?',
          [
            'Umumiy xabar; tafsilot (`$e->getMessage()`) faqat logga yoziladi',
            '`$e->getMessage()` to‘liq — foydalanuvchi muammoni tushunishi uchun',
            'DSN, login va parol — tekshirib ko‘rishi uchun',
            'Hech narsa — sahifa bo‘sh qoladi',
          ],
          [0],
        ),
        q(
          'config',
          'Bazaga ulanish paroli qayerda saqlanishi to‘g‘ri? (bir nechta javob)',
          [
            'Git’ga qo‘shilmaydigan alohida `config.php` faylda',
            'Muhit o‘zgaruvchilarida',
            'Har bir sahifaning kodida — Git’ga ham qo‘shiladi',
            'HTML sahifadagi yashirin maydonda',
          ],
          [0, 1],
        ),
      ]),
    },
    {
      slug: 'php-pdo-insert',
      title: 'Ma’lumot qo‘shish va SQL injection',
      quiz: dars('Ma’lumot qo‘shish — test', [
        natija(
          'injection',
          `${DB}$ism = "x' OR '1'='1";\n$a = count($pdo->query("SELECT * FROM talabalar WHERE ism = '$ism'")->fetchAll());\n$st = $pdo->prepare('SELECT * FROM talabalar WHERE ism = ?');\n$st->execute([$ism]);\necho $a, ' ', count($st->fetchAll());`,
          ['4 0', '0 0', '4 4', '0 4'],
          0,
        ),
        natija(
          'last-id',
          `${DB}$st = $pdo->prepare('INSERT INTO talabalar (ism, guruh, ball) VALUES (:ism, :guruh, :ball)');\n$st->execute(['ism' => 'Kamola', 'guruh' => 'W-12', 'ball' => 88]);\n$id = $pdo->lastInsertId();
echo gettype($id), ' ', $id;`,
          ['string 5', 'integer 5', 'integer 1', 'boolean 1'],
          0,
        ),
        natija(
          'unique',
          `${DB}$st = $pdo->prepare('INSERT INTO talabalar (ism, ball) VALUES (?, ?)');\ntry {\n    $st->execute(['Ali', 10]);\n    echo 'qo‘shildi';\n} catch (PDOException $e) {\n    echo $e->getCode();\n}`,
          ['23000', 'qo‘shildi', '0', 'HY000'],
          0,
        ),
        q(
          'why-prepare',
          'Tayyorlangan so‘rov (`prepare` + `execute`) SQL injection’dan nima uchun himoya qiladi?',
          [
            'SQL matni va qiymatlar alohida yuboriladi — qiymat hech qachon SQL kodi sifatida o‘qilmaydi',
            'U qiymatdagi barcha bo‘sh joylarni o‘chiradi',
            'U so‘rovni shifrlaydi',
            'U faqat raqamlarni qabul qiladi',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-pdo-select',
      title: 'Ma’lumotlarni o‘qish',
      quiz: dars('Ma’lumotlarni o‘qish — test', [
        natija(
          'fetch-false',
          `${DB}$st = $pdo->prepare('SELECT * FROM talabalar WHERE id = ?');\n$st->execute([99]);\necho var_export($st->fetch(), true);`,
          ['false', 'NULL', 'array ()', XATO],
          0,
        ),
        natija(
          'like',
          `${DB}$st = $pdo->prepare('SELECT ism FROM talabalar WHERE ism LIKE ? ORDER BY ism');\n$st->execute(['A%']);\necho implode(',', $st->fetchAll(PDO::FETCH_COLUMN));`,
          ['Ali,Anvar', 'Ali', 'Ali,Anvar,Vali', ''],
          0,
        ),
        natija(
          'in',
          `${DB}$ids = [2, 3];\n$ph = implode(',', array_fill(0, count($ids), '?'));\n$st = $pdo->prepare("SELECT ism FROM talabalar WHERE id IN ($ph) ORDER BY id");\n$st->execute($ids);\necho implode(',', $st->fetchAll(PDO::FETCH_COLUMN));`,
          ['Vali,Lola', 'Ali,Vali', 'Lola,Anvar', XATO],
          0,
        ),
        natija(
          'avg',
          `${DB}$st = $pdo->prepare('SELECT AVG(ball) FROM talabalar WHERE guruh = ?');\n$st->execute(['W-14']);\necho $st->fetchColumn();`,
          ['81', '162', '70', '92'],
          0,
        ),
        q(
          'order-column',
          'Foydalanuvchi tanlagan ustun bo‘yicha saralash (`ORDER BY`) qanday xavfsiz qilinadi?',
          [
            'Ruxsat etilgan ustunlar ro‘yxatidan (`in_array(..., true)`) tekshirib tanlanadi',
            '`ORDER BY ?` va `execute([$ustun])`',
            '`htmlspecialchars($ustun)` bilan tozalanadi',
            '`trim($ustun)` yetarli',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-pdo-update-delete',
      title: 'O‘zgartirish, o‘chirish va tranzaksiyalar',
      quiz: dars('O‘zgartirish va o‘chirish — modul testi', [
        natija(
          'rowcount',
          `${DB}$st = $pdo->prepare('UPDATE talabalar SET ball = ball + 5 WHERE guruh = ?');\n$st->execute(['W-12']);\n$d = $pdo->prepare('DELETE FROM talabalar WHERE id = ?');\n$d->execute([99]);\necho $st->rowCount(), ' ', $d->rowCount();`,
          ['2 0', '1 1', '2 1', '4 0'],
          0,
        ),
        natija(
          'rollback',
          `${DB}try {\n    $pdo->beginTransaction();\n    $pdo->exec('UPDATE talabalar SET ball = 0');\n    throw new RuntimeException('xato');\n    $pdo->commit();\n} catch (RuntimeException $e) {\n    $pdo->rollBack();\n}\necho $pdo->query('SELECT SUM(ball) FROM talabalar')->fetchColumn();`,
          ['297', '0', '92', XATO],
          0,
        ),
        natija(
          'owner',
          `${DB}$pdo->exec('ALTER TABLE talabalar ADD COLUMN egasi INTEGER DEFAULT 1');\n$pdo->exec('UPDATE talabalar SET egasi = 2 WHERE id = 3');\n$st = $pdo->prepare('DELETE FROM talabalar WHERE id = ? AND egasi = ?');\n$st->execute([3, 1]);\necho $st->rowCount(), ' ', $pdo->query('SELECT COUNT(*) FROM talabalar')->fetchColumn();`,
          ['0 4', '1 3', '1 4', '0 3'],
          0,
        ),
        q(
          'post',
          'Yozuvni o‘chirish tugmasi qanday bo‘lishi kerak?',
          [
            'POST forma, CSRF token bilan',
            'Oddiy havola: `ochir.php?id=5`',
            'GET forma — URL’da ko‘rinadi, qulay',
            'JavaScript `alert()` bilan tasdiqlansa, havola ham bo‘ladi',
          ],
          [0],
        ),
        q(
          'transaction',
          'Tranzaksiya qachon kerak?',
          [
            'Bir nechta o‘zgarish faqat **birga** saqlanishi kerak bo‘lganda (masalan, pul o‘tkazish)',
            'Har bir `SELECT` dan oldin',
            'Faqat jadval yaratishda',
            'Bazaga ulanishni tezlashtirish uchun',
          ],
          [0],
        ),
        q(
          'idor',
          '`DELETE FROM postlar WHERE id = ?` — bu so‘rovda nima yetishmaydi (foydalanuvchi faqat o‘z postini o‘chirishi kerak)?',
          [
            'Egasini tekshirish: `AND muallif_id = ?` (sessiyadagi foydalanuvchi)',
            '`LIMIT 1`',
            '`ORDER BY id`',
            'Hech narsa — `id` yetarli',
          ],
          [0],
        ),
      ]),
    },
  ],
};
