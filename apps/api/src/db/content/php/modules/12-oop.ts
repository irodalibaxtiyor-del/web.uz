import { dars, natija, q, XATO, type ModuleDef } from '../shared';

const HISOB = `class Hisob
{
    private int $balans = 0;

    public function kirim(int $s): void
    {
        if ($s <= 0) {
            throw new InvalidArgumentException('Summa musbat bo‘lsin');
        }
        $this->balans += $s;
    }

    public function balans(): int
    {
        return $this->balans;
    }
}`;

export const m12: ModuleDef = {
  title: 'OOP asoslari',
  lessons: [
    {
      slug: 'php-oop',
      title: 'OOP nima?',
      quiz: dars('OOP nima? — test', [
        natija(
          'encapsulation',
          `<?php\n${HISOB}\n$h = new Hisob();\n$h->kirim(50000);\ntry {\n    $h->kirim(-100);\n} catch (InvalidArgumentException $e) {\n    echo 'rad; ';\n}\necho $h->balans();`,
          ['rad; 50000', '49900', 'rad; 49900', XATO],
          0,
        ),
        q(
          'terms',
          'Klass va obyekt farqi?',
          [
            'Klass — qolip (tavsif), obyekt — undan `new` bilan yaratilgan nusxa',
            'Ular bir xil narsa',
            'Obyekt — qolip, klass — nusxa',
            'Klass faqat ma’lumot, obyekt faqat funksiya',
          ],
          [0],
        ),
        q(
          'this',
          'Metod ichida `$this` nimani bildiradi?',
          [
            'Metodni chaqirgan obyektning o‘zini',
            'Klassning o‘zini',
            'Global o‘zgaruvchilarni',
            'Ota klassni',
          ],
          [0],
        ),
        q(
          'principles',
          'Qaysilari OOP tamoyillari? (bir nechta javob)',
          ['Inkapsulyatsiya', 'Meros', 'Polimorfizm', 'Rekursiya'],
          [0, 1, 2],
        ),
      ]),
    },
    {
      slug: 'php-classes',
      title: 'Klasslar va obyektlar',
      quiz: dars('Klasslar — test', [
        natija(
          'method',
          `<?php\nclass Talaba\n{\n    public int $ball = 0;\n    public function baho(): string\n    {\n        return $this->ball >= 60 ? 'o‘tdi' : 'o‘tmadi';\n    }\n}\n$t = new Talaba();\n$t->ball = 85;\necho $t->baho();`,
          ['o‘tdi', 'o‘tmadi', '85', XATO],
          0,
        ),
        natija(
          'handle',
          `<?php\nclass T\n{\n    public int $ball = 0;\n}\nfunction ozgartir(T $t): void\n{\n    $t->ball = 100;\n}\n$t = new T();\nozgartir($t);\necho $t->ball;`,
          ['100', '0', '', XATO],
          0,
        ),
        natija(
          'alias-clone',
          `<?php\nclass T\n{\n    public int $ball = 0;\n}\n$a = new T();\n$b = $a;\n$c = clone $a;\n$b->ball = 50;\n$c->ball = 10;\necho $a->ball;`,
          ['50', '0', '10', '60'],
          0,
        ),
        natija(
          'uninit',
          `<?php\nclass T\n{\n    public string $ism;\n}\ntry {\n    echo (new T())->ism;\n} catch (Error $e) {\n    echo 'Error';\n}`,
          ['Error', '', 'null', 'ism'],
          0,
        ),
      ]),
    },
    {
      slug: 'php-constructor',
      title: 'Konstruktor va destruktor',
      quiz: dars('Konstruktor — test', [
        natija(
          'promotion',
          `<?php\nclass Kurs\n{\n    public function __construct(public string $nom, private int $narx = 0) {}\n    public function narx(): int\n    {\n        return $this->narx;\n    }\n}\n$k = new Kurs('PHP', 450000);\necho $k->nom, ' ', $k->narx();`,
          ['PHP 450000', 'PHP 0', ' 450000', XATO],
          0,
        ),
        natija(
          'readonly',
          `<?php\nclass Pul\n{\n    public function __construct(public readonly int $summa) {}\n}\n$p = new Pul(5);\ntry {\n    $p->summa = 6;\n} catch (Error $e) {\n    echo 'Error ';\n}\necho $p->summa;`,
          ['Error 5', '6', 'Error 6', '5'],
          0,
        ),
        natija(
          'destruct',
          `<?php\nclass Log\n{\n    public function __construct(public string $n)\n    {\n        echo "ochildi ";\n    }\n    public function __destruct()\n    {\n        echo "yopildi ";\n    }\n}\nfunction ish(): void\n{\n    $l = new Log('A');\n    echo 'ish ';\n}\nish();\necho 'tamom';`,
          [
            'ochildi ish yopildi tamom',
            'ochildi ish tamom yopildi ',
            'ish ochildi yopildi tamom',
            'ochildi yopildi ish tamom',
          ],
          0,
        ),
        natija(
          'tostring',
          `<?php\nclass Kurs\n{\n    public function __construct(public string $nom, public int $narx) {}\n    public function __toString(): string\n    {\n        return "$this->nom ($this->narx so‘m)";\n    }\n}\necho new Kurs('PHP', 450000);`,
          ['PHP (450000 so‘m)', 'Kurs', 'Object', XATO],
          0,
        ),
      ]),
    },
    {
      slug: 'php-access',
      title: 'Kirish modifikatorlari',
      quiz: dars('Kirish modifikatorlari — test', [
        natija(
          'private',
          `<?php\nclass Kurs\n{\n    private int $narx = 450000;\n}\ntry {\n    echo (new Kurs())->narx;\n} catch (Error $e) {\n    echo 'Error';\n}`,
          ['Error', '450000', '', '0'],
          0,
        ),
        natija(
          'json-public',
          `<?php\nclass Kurs\n{\n    public function __construct(public string $nom, private int $narx) {}\n}\necho json_encode(new Kurs('Go', 100));`,
          ['{"nom":"Go"}', '{"nom":"Go","narx":100}', '{}', XATO],
          0,
        ),
        q(
          'protected',
          '`protected` xususiyatga qayerdan murojaat qilish mumkin?',
          [
            'Klassning o‘zi va undan meros olgan klasslardan',
            'Hamma joydan',
            'Faqat klassning o‘zidan',
            'Faqat bola klassdan',
          ],
          [0],
        ),
        q(
          'rule',
          'Inkapsulyatsiyaning to‘g‘ri amaliyoti?',
          [
            'Xususiyatlar `private`, o‘zgartirish — qoidani tekshiradigan metodlar orqali',
            'Barcha xususiyatlar `public`',
            'Barcha metodlar `private`',
            'Xususiyatlar o‘rniga global o‘zgaruvchilar',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-inheritance',
      title: 'Meros',
      quiz: dars('Meros va 12-modul yakuni — test', [
        natija(
          'parent',
          `<?php\nclass A\n{\n    public function salom(): string\n    {\n        return 'A';\n    }\n}\nclass B extends A\n{\n    public function salom(): string\n    {\n        return parent::salom() . 'B';\n    }\n}\necho (new B())->salom();`,
          ['AB', 'B', 'A', 'BA'],
          0,
        ),
        natija(
          'instanceof',
          `<?php\nclass Hisob {}\nclass Jamgarma extends Hisob {}\n$j = new Jamgarma();\nvar_dump($j instanceof Hisob, new Hisob() instanceof Jamgarma);`,
          [
            'bool(true)\nbool(false)\n',
            'bool(true)\nbool(true)\n',
            'bool(false)\nbool(false)\n',
            'bool(false)\nbool(true)\n',
          ],
          0,
        ),
        natija(
          'polymorphism',
          `<?php\nclass Shakl\n{\n    public function nom(): string\n    {\n        return 'shakl';\n    }\n}\nclass Doira extends Shakl\n{\n    public function nom(): string\n    {\n        return 'doira';\n    }\n}\nforeach ([new Shakl(), new Doira()] as $s) {\n    echo $s->nom(), ' ';\n}`,
          ['shakl doira ', 'shakl shakl ', 'doira doira ', XATO],
          0,
        ),
        natija(
          'chain',
          `<?php\nclass Hisob\n{\n    protected int $balans = 0;\n    public function kirim(int $s): static\n    {\n        $this->balans += $s;\n        return $this;\n    }\n    public function balans(): int\n    {\n        return $this->balans;\n    }\n}\necho (new Hisob())->kirim(100)->kirim(50)->balans();`,
          ['150', '100', '50', XATO],
          0,
        ),
        q(
          'parent-ctor',
          'Bola klassda `__construct` yozildi. Ota klass konstruktori nima bo‘ladi?',
          [
            'Avtomatik chaqirilmaydi — `parent::__construct(...)` ni o‘zingiz chaqirasiz',
            'Har doim avtomatik chaqiriladi',
            'O‘chirib tashlanadi',
            'Xato beradi',
          ],
          [0],
        ),
        q(
          'final',
          '`final class Pul {}` nimani bildiradi?',
          [
            'Undan meros olib bo‘lmaydi',
            'Undan obyekt yaratib bo‘lmaydi',
            'Uning xususiyatlari o‘zgarmaydi',
            'U oxirgi yuklanadi',
          ],
          [0],
        ),
      ]),
    },
  ],
};
