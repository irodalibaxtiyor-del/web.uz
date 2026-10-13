import { dars, natija, q, type ModuleDef } from '../shared';

export const m01: ModuleDef = {
  title: 'PHP bilan tanishuv',
  lessons: [
    {
      slug: 'php-intro',
      title: 'PHP nima?',
      quiz: dars('PHP nima? — test', [
        q(
          'where',
          'PHP kodi qayerda bajariladi?',
          [
            'Serverda',
            'Foydalanuvchi brauzerida',
            'Ham serverda, ham brauzerda bir vaqtda',
            'Ma’lumotlar bazasida',
          ],
          [0],
        ),
        q(
          'source',
          'Foydalanuvchi brauzerda “Sahifa kodini ko‘rish” ni bossa, PHP kodini ko‘radimi?',
          [
            'Yo‘q — brauzerga faqat PHP yaratgan natija (HTML) keladi',
            'Ha, PHP kodi to‘liq ko‘rinadi',
            'Faqat izohlar ko‘rinadi',
            'Faqat `<?php` teglari ko‘rinadi',
          ],
          [0],
        ),
        q(
          'tasks',
          'Qaysi vazifalar serverda (PHP’da) bajarilishi kerak? (bir nechta javob)',
          [
            'Parolni tekshirish',
            'Buyurtmani bazaga yozish',
            'Tugma bosilganda menyuni ochish animatsiyasi',
            'Yuklangan faylni saqlash',
          ],
          [0, 1, 3],
        ),
        q(
          'version',
          'Bu kurs qaysi PHP versiyasiga mo‘ljallangan?',
          ['PHP 8', 'PHP 5', 'PHP 4', 'PHP 7.0 dan oldingi'],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-install',
      title: 'PHP’ni o‘rnatish',
      quiz: dars('PHP’ni o‘rnatish — test', [
        q(
          'server',
          '`php -S localhost:8000` buyrug‘i nima qiladi?',
          [
            'Joriy papkada o‘rnatilgan veb-serverni ishga tushiradi',
            'PHP’ni o‘rnatadi',
            'MySQL bazasini ochadi',
            'Faylni brauzerda ochadi',
          ],
          [0],
        ),
        q(
          'version',
          'O‘rnatilgan PHP versiyasini qaysi buyruq ko‘rsatadi?',
          ['`php -v`', '`php --server`', '`php -S`', '`php install`'],
          [0],
        ),
        q(
          'cli',
          '`php salom.php` buyrug‘i natijani qayerga chiqaradi?',
          ['Terminalga', 'Brauzerga', 'Faylga', 'Hech qayerga'],
          [0],
        ),
        q(
          'errors',
          'Haqiqiy (ishlab chiqarish) saytda xatolar bilan nima qilinadi?',
          [
            'Ekranga chiqarilmaydi, faqat log faylga yoziladi',
            'Foydalanuvchiga to‘liq ko‘rsatiladi',
            'Umuman qayd qilinmaydi',
            'Email orqali foydalanuvchiga yuboriladi',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-syntax',
      title: 'Sintaksis',
      quiz: dars('Sintaksis — test', [
        natija(
          'echo-two',
          `<?php\necho "Web";\necho "dizayn";`,
          ['Webdizayn', 'Web dizayn', 'Web; dizayn', 'dizaynWeb'],
          0,
        ),
        natija(
          'concat',
          `<?php\n$kurs = "PHP";\necho "Kurs: " . $kurs;`,
          ['Kurs: PHP', 'Kurs: $kurs', 'Kurs: . PHP', 'KursPHP'],
          0,
        ),
        q(
          'case',
          'Quyidagilardan qaysi biri katta-kichik harfga sezgir?',
          [
            'O‘zgaruvchi nomlari (`$ism` va `$Ism`)',
            'Kalit so‘zlar (`echo` va `ECHO`)',
            'Funksiya nomlari (`strlen` va `STRLEN`)',
          ],
          [0],
        ),
        q(
          'short-echo',
          '`<?= $narx ?>` qaysi yozuvning qisqa shakli?',
          [
            '`<?php echo $narx; ?>`',
            '`<?php print_r($narx); ?>`',
            '`<?php return $narx; ?>`',
            '`<?php $narx; ?>`',
          ],
          [0],
        ),
        q(
          'closing',
          'Faqat PHP koddan iborat faylda yopuvchi `?>` haqida qaysi tavsiya to‘g‘ri?',
          [
            'Yozilmaydi — tasodifiy bo‘sh joy chiqib qolmasligi uchun',
            'Har doim yozilishi shart',
            'Har bir qatordan keyin yoziladi',
            'Faqat izohlardan keyin yoziladi',
          ],
          [0],
        ),
      ]),
    },
    {
      slug: 'php-comments',
      title: 'Izohlar',
      quiz: dars('Izohlar va 1-modul yakuni — test', [
        natija('line', `<?php\necho "A";\n// echo "B";\necho "C";`, ['AC', 'ABC', 'A', 'C'], 0),
        natija(
          'block',
          `<?php\necho "1";\n/*\necho "2";\necho "3";\n*/\necho "4";`,
          ['14', '1234', '1', '4'],
          0,
        ),
        natija(
          'hash',
          `<?php\necho "X"; # echo "Y";\necho "Z";`,
          ['XZ', 'XYZ', 'X# echo "Y";Z', 'X'],
          0,
        ),
        natija('close', `<?php echo "A"; // izoh ?> B`, ['A B', 'A', 'A // izoh ?> B', 'B'], 0),
        q(
          'docblock',
          'Funksiya ustidagi `/** ... */` izohi nima uchun?',
          [
            'Hujjatlash: parametrlar va qaytariladigan qiymatni tasvirlaydi',
            'Funksiyani o‘chirib qo‘yadi',
            'Kodni tezlashtiradi',
            'Faqat HTML’da ishlaydi',
          ],
          [0],
        ),
        q(
          'good',
          'Yaxshi izoh nimani tushuntiradi?',
          [
            'Kod nega aynan shunday yozilganini',
            'Har bir qatorni so‘zma-so‘z takrorlab',
            'Faqat muallif ismini',
            'Fayl hajmini',
          ],
          [0],
        ),
      ]),
    },
  ],
};
