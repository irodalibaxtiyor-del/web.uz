import { and, eq, inArray, sql } from 'drizzle-orm';
import type { Db } from '../client';
import { courseDirections, courses, directions } from '../schema';
import { CONTENT_COURSES } from './registry';

/** A public catalogue direction ("yo'nalish"). Courses join it through their manifest. */
export interface DirectionDef {
  slug: string;
  title: string;
  /** One sentence for cards. */
  summary: string;
  /** Paragraphs separated by a blank line, shown on the direction page. */
  description: string;
  position: number;
}

export const DIRECTIONS: DirectionDef[] = [
  {
    slug: 'html',
    title: 'HTML',
    summary: 'Veb-sahifa tuzilishi: teglar, matn, havolalar, jadvallar va formalar.',
    description:
      'HTML — har bir veb-sahifaning skeleti. Bu yo‘nalishda sahifani to‘g‘ri tuzishni, ' +
      'matn, rasm, havola, jadval va formalarni joylashni hamda semantik teglar bilan ' +
      'sahifani qidiruv tizimlari va ekran o‘quvchilar uchun tushunarli qilishni o‘rganasiz.\n\n' +
      'Har bir darsdan keyin brauzerda mashq bajariladi va natija darhol tekshiriladi.',
    position: 10,
  },
  {
    slug: 'css',
    title: 'CSS va bezash',
    summary: 'Rang, shrift, oraliqlar, quti modeli, animatsiya va joylashuv.',
    description:
      'CSS sahifaga ko‘rinish beradi: ranglar, shriftlar, oraliqlar, chegaralar, soyalar va ' +
      'animatsiyalar. Selektorlar va kaskad qanday ishlashini, quti modelini va elementlarni ' +
      'joylashtirish usullarini amaliy mashqlar orqali o‘rganasiz.',
    position: 20,
  },
  {
    slug: 'javascript',
    title: 'JavaScript',
    summary: 'Sahifani jonlantirish: o‘zgaruvchilar, funksiyalar, DOM va hodisalar.',
    description:
      'JavaScript sahifani interaktiv qiladi: tugma bosilganda nimadir sodir bo‘lishi, forma ' +
      'tekshirilishi, ro‘yxatlar filtrlanishi. Til asoslaridan boshlab DOM, hodisalar va ' +
      'asinxron kodgacha o‘rganasiz, oxirida kichik ilovalar yasaysiz.',
    position: 30,
  },
  {
    slug: 'flexbox-va-grid',
    title: 'Flexbox va Grid',
    summary: 'Zamonaviy maketlar: qatorlar, ustunlar, to‘rlar va tekislash.',
    description:
      'Flexbox elementlarni bir qatorda yoki ustunda tekislaydi, Grid esa ikki o‘lchamli ' +
      'to‘r quradi. Ikkalasi bilan navigatsiya panellari, kartalar to‘ri va to‘liq sahifa ' +
      'maketlarini yasashni o‘rganasiz.\n\n' +
      'Bu mavzular CSS kursining alohida modullarida batafsil o‘tiladi, moslashuvchan dizayn ' +
      'kursida esa amalda qo‘llanadi.',
    position: 40,
  },
  {
    slug: 'moslashuvchan-dizayn',
    title: 'Moslashuvchan dizayn',
    summary: 'Telefon, planshet va kompyuterda birdek qulay sahifalar.',
    description:
      'Bitta sahifa 320 piksellik telefonda ham, katta monitorda ham qulay ko‘rinishi kerak. ' +
      'Viewport, media so‘rovlar, suyuq o‘lchamlar, moslashuvchan rasm va jadvallar, mobil ' +
      'navigatsiya hamda "avval mobil" yondashuvini o‘rganasiz.',
    position: 50,
  },
  {
    slug: 'ui-asoslari',
    title: 'UI asoslari',
    summary: 'Rang, tipografiya, oraliq, ikonka va tugma — interfeys qoidalari.',
    description:
      'Chiroyli va tushunarli interfeys tasodif emas. Rang modellari va rang sxemalari, ' +
      'kontrast, tipografiya shkalasi, oraliqlar tizimi, ikonkalar, tugma va forma holatlari ' +
      'kabi qoidalarni o‘rganib, ularni CSS bilan amalda qo‘llaysiz.',
    position: 60,
  },
  {
    slug: 'figmadan-kodga',
    title: 'Figma’dan kodga',
    summary: 'Dizayner maketini aniq o‘lchamlari bilan HTML va CSS’ga aylantirish.',
    description:
      'Dizayner Figma’da maket chizadi, dasturchi uni sahifaga aylantiradi. Maketdan ' +
      'o‘lcham, rang, shrift va oraliqlarni o‘qish, Auto Layout’ni Flexbox’ga, Layout Grid’ni ' +
      'CSS Grid’ga, komponentlarni qayta ishlatiladigan klasslarga o‘girishni o‘rganasiz.\n\n' +
      'Mashqlarda maket spetsifikatsiyasi beriladi va natija aynan o‘lchamlar bo‘yicha tekshiriladi.',
    position: 70,
  },
  {
    slug: 'portfolio',
    title: 'Portfolio',
    summary: 'O‘z ishlaringizni ko‘rsatadigan shaxsiy sayt yasash.',
    description:
      'Portfolio — ish beruvchi yoki mijoz sizni birinchi ko‘radigan joy. Bosh ekran, ' +
      'loyihalar galereyasi, filtrlar, "Men haqimda", aloqa formasi va yorug‘/qorong‘i rejimli ' +
      'to‘liq portfolio saytini bosqichma-bosqich yasaysiz.',
    position: 80,
  },
  {
    slug: 'bootstrap',
    title: 'Bootstrap',
    summary: 'Tayyor komponentlar va setka bilan tez sahifa yig‘ish.',
    description:
      'Bootstrap — eng mashhur CSS freymvorklaridan biri. Setka, tugmalar, navbar, kartalar, ' +
      'modal oynalar va formalar bilan sahifalarni tez yig‘ishni o‘rganasiz. Yangi loyihalar ' +
      'uchun Bootstrap 5 tavsiya etiladi; 3 va 4-versiyalar eski loyihalarni qo‘llab-quvvatlash uchun.',
    position: 90,
  },
  {
    slug: 'php',
    title: 'PHP',
    summary: 'Server tomonida dasturlash: formalar, sessiyalar va ma’lumotlar bazasi.',
    description:
      'PHP bilan sahifa serverda yaratiladi: formalarni qabul qilish, foydalanuvchini ' +
      'tizimga kiritish, ma’lumotlar bazasi bilan ishlash. Xavfsizlik (SQL injection, CSRF, ' +
      'parollarni xeshlash) ham alohida o‘rganiladi.',
    position: 100,
  },
];

export const DIRECTION_SLUGS = new Set(DIRECTIONS.map((d) => d.slug));

/**
 * Upserts every direction and makes the direction links of the bundled courses in
 * `organizationId` match their manifests. Courses that are not bundled keep their links.
 * Idempotent; safe to run inside the seed transaction.
 */
export async function syncDirections(db: Db, organizationId: string) {
  const ids = new Map<string, string>();
  for (const d of DIRECTIONS) {
    const [row] = await db
      .insert(directions)
      .values(d)
      .onConflictDoUpdate({
        target: directions.slug,
        set: {
          title: d.title,
          summary: d.summary,
          description: d.description,
          position: d.position,
          updatedAt: sql`now()`,
        },
      })
      .returning({ id: directions.id });
    ids.set(d.slug, row!.id);
  }

  const bundled = CONTENT_COURSES.map((c) => c.slug);
  const present = await db
    .select({ id: courses.id, slug: courses.slug })
    .from(courses)
    .where(and(eq(courses.organizationId, organizationId), inArray(courses.slug, bundled)));
  let links = 0;
  for (const c of present) {
    const wanted = CONTENT_COURSES.find((x) => x.slug === c.slug)?.directions ?? [];
    await db.delete(courseDirections).where(eq(courseDirections.courseId, c.id));
    for (const slug of wanted) {
      await db.insert(courseDirections).values({ courseId: c.id, directionId: ids.get(slug)! });
      links++;
    }
  }
  return { directions: DIRECTIONS.length, courses: present.length, links };
}
