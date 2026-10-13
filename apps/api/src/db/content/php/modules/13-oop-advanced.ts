import { dars, natija, q, XATO, type ModuleDef } from '../shared';

export const m13: ModuleDef = {
  title: 'OOP chuqurroq',
  lessons: [
    {
      slug: 'php-abstract-interfaces',
      title: 'Abstrakt klasslar va interfeyslar',
      quiz: dars('Abstrakt klasslar va interfeyslar — test', [
        natija(
          'abstract-method',
          `<?php\nabstract class Shakl\n{\n    abstract public function maydon(): float;\n    public function malumot(): string\n    {\n        return static::class . ': ' . round($this->maydon(), 1);\n    }\n}\nclass Kvadrat extends Shakl\n{\n    public function __construct(private float $a) {}\n    public function maydon(): float\n    {\n        return $this->a * $this->a;\n    }\n}\necho (new Kvadrat(3))->malumot();`,
          ['Kvadrat: 9', 'Shakl: 9', 'Kvadrat: 3', XATO],
          0,
        ),
        natija(
          'abstract-new',
          `<?php\nabstract class Shakl\n{\n    abstract public function maydon(): float;\n}\ntry {\n    new Shakl();\n} catch (Error $e) {\n    echo $e->getMessage();\n}`,
          [
            'Cannot instantiate abstract class Shakl',
            'Shakl',
            '',
            'Call to undefined method Shakl::maydon()',
          ],
          0,
        ),
        natija(
          'interface-type',
          `<?php\ninterface Tolov\n{\n    public function tola(int $s): string;\n}\nclass Karta implements Tolov\n{\n    public function tola(int $s): string\n    {\n        return "Karta: $s";\n    }\n}\nclass Naqd implements Tolov\n{\n    public function tola(int $s): string\n    {\n        return "Naqd: $s";\n    }\n}\nfunction buyurtma(Tolov $u, int $s): string\n{\n    return $u->tola($s);\n}\necho buyurtma(new Naqd(), 500);`,
          ['Naqd: 500', 'Karta: 500', 'Tolov: 500', XATO],
          0,
        ),
        q(
          'how-many',
          'Klass nechta klassdan meros oladi va nechta interfeysni amalga oshiradi?',
          [
            'Bitta klassdan (`extends`), istalgancha interfeysni (`implements`)',
            'Istalgancha klassdan, bitta interfeysni',
            'Faqat bitta klass yoki bitta interfeys',
            'Ikkalasidan ham istalgancha',
          ],
          [0],
        ),
        q(
          'interface-content',
          'Interfeysda nima bo‘lishi **mumkin emas**?',
          [
            'Metodning tanasi (kodi) va oddiy xususiyatlar',
            'Metod imzolari',
            'Konstantalar',
            'Public metod e’lonlari',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-traits',
      title: 'Trait’lar',
      quiz: dars('Trait’lar — test', [
        natija(
          'trait-state',
          `<?php\ntrait Hisoblovchi\n{\n    private int $sanoq = 0;\n    public function oshir(): static\n    {\n        $this->sanoq++;\n        return $this;\n    }\n    public function sanoq(): int\n    {\n        return $this->sanoq;\n    }\n}\nclass Sahifa { use Hisoblovchi; }\nclass Tugma { use Hisoblovchi; }\n$s = new Sahifa();\n$t = new Tugma();\n$s->oshir()->oshir();\n$t->oshir();\necho $s->sanoq(), ' ', $t->sanoq();`,
          ['2 1', '3 3', '1 1', XATO],
          0,
        ),
        natija(
          'insteadof',
          `<?php\ntrait A { public function x(): string { return 'A'; } }\ntrait B { public function x(): string { return 'B'; } }\nclass C\n{\n    use A, B {\n        B::x insteadof A;\n        A::x as ax;\n    }\n}\n$c = new C();\necho $c->x(), $c->ax();`,
          ['BA', 'AB', 'AA', XATO],
          0,
        ),
        natija(
          'static-class',
          `<?php\ntrait Salom\n{\n    public function salom(): string\n    {\n        return 'Men ' . static::class;\n    }\n}\nclass Post { use Salom; }\necho (new Post())->salom();`,
          ['Men Post', 'Men Salom', 'Men static', XATO],
          0,
        ),
        q(
          'why',
          'Trait qachon kerak bo‘ladi?',
          [
            'Bir-biriga qarindosh bo‘lmagan klasslarga bir xil metodlarni qo‘shish uchun',
            'Klassdan obyekt yaratishni taqiqlash uchun',
            'Bir nechta ota klassdan meros olish uchun `extends A, B` o‘rniga',
            'Faqat konstantalarni saqlash uchun',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-static',
      title: 'Statik a’zolar va konstantalar',
      quiz: dars('Statik a’zolar — test', [
        natija(
          'counter',
          `<?php\nclass Hisoblagich\n{\n    public static int $soni = 0;\n    public function __construct()\n    {\n        self::$soni++;\n    }\n}\nnew Hisoblagich();\nnew Hisoblagich();\nnew Hisoblagich();\necho Hisoblagich::$soni;`,
          ['3', '1', '0', XATO],
          0,
        ),
        natija(
          'late-binding',
          `<?php\nclass Ota\n{\n    public static function yarat(): static\n    {\n        return new static();\n    }\n    public static function selfYarat(): self\n    {\n        return new self();\n    }\n}\nclass Bola extends Ota {}\necho get_class(Bola::yarat()), ' ', get_class(Bola::selfYarat());`,
          ['Bola Ota', 'Ota Ota', 'Bola Bola', 'Ota Bola'],
          0,
        ),
        natija(
          'const',
          `<?php\nclass Buyurtma\n{\n    public const MAKS = 10;\n    public function tekshir(int $n): string\n    {\n        return $n <= self::MAKS ? 'ha' : 'yo‘q';\n    }\n}\necho Buyurtma::MAKS, ' ', (new Buyurtma())->tekshir(12);`,
          ['10 yo‘q', '10 ha', 'MAKS yo‘q', XATO],
          0,
        ),
        natija(
          'pad',
          `<?php\nclass Id\n{\n    private static int $oxirgi = 0;\n    public static function keyingi(): string\n    {\n        self::$oxirgi++;\n        return 'B-' . str_pad((string) self::$oxirgi, 4, '0', STR_PAD_LEFT);\n    }\n}\nId::keyingi();\necho Id::keyingi();`,
          ['B-0002', 'B-0001', 'B-2000', 'B-2'],
          0,
        ),
        q(
          'this',
          'Statik metod ichida `$this` ishlatsa bo‘ladimi?',
          [
            'Yo‘q — statik metod obyektsiz chaqiriladi, `self::` yoki `static::` ishlatiladi',
            'Ha, `$this` doim mavjud',
            'Ha, lekin faqat konstruktorda',
            'Ha, u klassning o‘zini bildiradi',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-namespaces',
      title: 'Nomlar fazosi va Composer',
      quiz: dars('Nomlar fazosi — test', [
        natija(
          'class-name',
          `<?php\nnamespace App\\Models;\nclass User {}\necho User::class;`,
          ['App\\Models\\User', 'User', 'App/Models/User', XATO],
          0,
        ),
        natija(
          'alias',
          `<?php\nnamespace App\\Services {\n    class Tolov {}\n}\nnamespace App\\Controllers {\n    use App\\Services\\Tolov as TolovXizmati;\n    echo get_class(new TolovXizmati());\n}`,
          ['App\\Services\\Tolov', 'TolovXizmati', 'App\\Controllers\\TolovXizmati', XATO],
          0,
        ),
        q(
          'first',
          'Faylda `namespace` qayerda bo‘lishi kerak?',
          [
            'Eng boshida — `<?php` dan keyingi birinchi buyruq (faqat `declare(strict_types=1);` undan oldin bo‘lishi mumkin)',
            'Istalgan joyda',
            'Faylning oxirida',
            'Klass ichida',
          ],
          [0],
        ),
        q(
          'composer',
          'Composer nima qiladi? (bir nechta javob)',
          [
            'Kutubxonalarni o‘rnatadi (`composer require`)',
            'Klasslarni avtomatik yuklaydi (`vendor/autoload.php`)',
            'PHP kodini JavaScript’ga o‘giradi',
            'Ma’lumotlar bazasini yaratadi',
          ],
          [0, 1],
        ),
        q(
          'vendor',
          'Git repoga odatda nima qo‘shilmaydi?',
          ['`vendor/` papka', '`composer.json`', '`composer.lock`', '`src/` papka'],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-enums',
      title: 'Enum’lar',
      quiz: dars('Enum’lar — test', [
        natija(
          'value',
          `<?php\nenum Holat: string\n{\n    case Faol = 'faol';\n    case Bloklangan = 'bloklangan';\n}\n$h = Holat::from('bloklangan');\necho $h->name, ' ', $h->value;`,
          ['Bloklangan bloklangan', 'bloklangan Bloklangan', 'Holat bloklangan', XATO],
          0,
        ),
        natija(
          'tryfrom',
          `<?php\nenum Rol: string\n{\n    case Talaba = 'talaba';\n    case Admin = 'admin';\n}\n$r = Rol::tryFrom('mehmon') ?? Rol::Talaba;\necho $r->value, ' ', count(Rol::cases());`,
          ['talaba 2', 'mehmon 2', 'talaba 3', XATO],
          0,
        ),
        natija(
          'from-error',
          `<?php\nenum Holat: string\n{\n    case Faol = 'faol';\n}\ntry {\n    Holat::from('yoq');\n} catch (ValueError $e) {\n    echo $e->getMessage();\n}`,
          [
            '"yoq" is not a valid backing value for enum Holat',
            'NULL',
            '',
            'Undefined constant Holat::yoq',
          ],
          0,
        ),
        natija(
          'method',
          `<?php\nenum B: string\n{\n    case Yangi = 'yangi';\n    case Tolangan = 'tolangan';\n    case Yetkazildi = 'yetkazildi';\n    public function keyingi(): ?self\n    {\n        return match ($this) {\n            self::Yangi => self::Tolangan,\n            self::Tolangan => self::Yetkazildi,\n            self::Yetkazildi => null,\n        };\n    }\n}\necho B::Yangi->keyingi()->keyingi()->value;`,
          ['yetkazildi', 'tolangan', 'yangi', XATO],
          0,
        ),
        q(
          'why',
          'Holatni satr o‘rniga enum bilan saqlashning foydasi?',
          [
            'Faqat ruxsat etilgan qiymatlar bo‘ladi — imlo xatosi darhol aniqlanadi',
            'Enum satrdan tezroq chop etiladi',
            'Enum’ni bazaga saqlab bo‘lmaydi, shuning uchun xavfsiz',
            'Enum avtomatik tarjima qilinadi',
          ],
          [0],
        ),
      ]),
    },
  ],
};
