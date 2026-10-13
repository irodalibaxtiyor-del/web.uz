## Nomlar fazosi va Composer

## Muammo: nomlar to‘qnashuvi

Loyihangizda `User` klassi bor, ulangan kutubxonada ham `User`. PHP ikkalasini ajrata olmaydi — `Cannot declare class User, because the name is already in use`.

## `namespace`

Nomlar fazosi klass nomiga “familiya” qo‘shadi:

```php
<?php
namespace App\Models;

class User
{
}

echo User::class; // App\Models\User
```

- `namespace` faylning **birinchi** buyrug‘i bo‘lishi shart (faqat `declare(strict_types=1);` undan oldin bo‘lishi mumkin). Aks holda: `Namespace declaration statement has to be the very first statement`.
- Ajratgich — teskari chiziq `\`.
- Bitta fayl — bitta klass, bitta nomlar fazosi.

## `use` — qisqa nom bilan ishlatish

```php
<?php
namespace App\Controllers;

use App\Models\User;
use App\Services\Tolov as TolovXizmati;

$u = new User();             // App\Models\User
$t = new TolovXizmati();     // taxallus (alias)
```

`use` bo‘lmasa, to‘liq nom: `new \App\Models\User()`.

## Global funksiyalar va klasslar

Nomlar fazosi ichida PHP’ning o‘z klasslari uchun boshiga `\` yoki `use`:

```php
<?php
namespace App;

$d = new \DateTime();   // global DateTime
echo strlen('abc');      // funksiyalar avtomatik global’dan topiladi
```

## Papka tuzilishi (PSR-4)

Umumqabul qilingan kelishuv: nomlar fazosi **papkalarga** mos keladi.

```text
src/
  Models/
    User.php          → App\Models\User
  Services/
    Tolov.php         → App\Services\Tolov
```

## Composer

**Composer** — PHP paket menejeri (JavaScript’dagi npm kabi). U ikki ish qiladi:

1. Kutubxonalarni o‘rnatadi: `composer require monolog/monolog`.
2. Klasslarni **avtomatik yuklaydi** — `require` larni qo‘lda yozish shart emas.

`composer.json`:

```json
{
  "autoload": {
    "psr-4": { "App\\": "src/" }
  }
}
```

```bash
composer dump-autoload
```

`public/index.php`:

```php
<?php
require __DIR__ . '/../vendor/autoload.php';

use App\Models\User;

$u = new User(); // Composer src/Models/User.php ni o‘zi topib yukladi
```

Laravel, Symfony va deyarli barcha zamonaviy PHP loyihalari shunday tuzilgan.

> `vendor/` papka repoga qo‘shilmaydi (`.gitignore`), `composer.lock` esa qo‘shiladi — hamma bir xil versiyalarni oladi.

## Mustaqil mashq

Kompyuteringizda:

1. Papka yarating, `composer init` (savollarga Enter), `composer.json` ga yuqoridagi `autoload` ni qo‘shing.
2. `src/Models/Kurs.php`:

```php
<?php
namespace App\Models;

class Kurs
{
    public function __construct(public string $nom) {}
}
```

3. `index.php`:

```php
<?php
require __DIR__ . '/vendor/autoload.php';

use App\Models\Kurs;

$k = new Kurs('PHP');
echo get_class($k), ': ', $k->nom;
```

4. `composer dump-autoload`, keyin `php index.php`.

**Kutilgan natija:** `App\Models\Kurs: PHP` — hech qanday `require 'src/...'` yozmasdan.
