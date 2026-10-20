import type { ProjectFile } from '@webdizayn/shared';
import { md, pic, q, quiz, RESET, site, style, type ModuleDef } from '../../design/shared';

const BUTTON = `<button type="button" class="tugma">
  <svg class="ikonka" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
  Yangi vazifa
</button>`;

const BUTTON_CSS = `${RESET}

body {
  padding: 24px;
}

.tugma {
  border: 0;
  border-radius: 8px;
  font: inherit;
  font-weight: 600;
  color: white;
  background-color: #0071dc;
}`;

const TOOLBAR = `<header class="panel">
  <a class="logo" href="#">Kundalik</a>
  <input class="qidiruv" type="search" placeholder="Qidirish" aria-label="Qidirish">
  <button type="button" class="tugma">Yangi vazifa qo‘shish</button>
</header>`;

const TOOLBAR_CSS = `${RESET}

.panel {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.logo {
  font-weight: 700;
  width: 50%;
}

.qidiruv {
  min-height: 40px;
  padding: 0 12px;
  font: inherit;
}

.tugma {
  min-height: 40px;
  padding: 0 16px;
  font: inherit;
}`;

const ALIGN = `<article class="karta">
  <header class="karta-bosh">
    <h2>Topshiriqlar</h2>
    <a href="#">Hammasi</a>
  </header>
  <ul class="royxat">
    <li>Maketni o‘qish</li>
    <li>Header yasash</li>
  </ul>
</article>`;

const ALIGN_CSS = `${RESET}

.karta {
  max-width: 420px;
  margin: 24px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.karta-bosh {
  display: flex;
}

.karta h2 {
  margin: 0;
  font-size: 1.125rem;
}

.royxat {
  margin: 0;
  padding: 0;
  list-style: none;
}`;

const TAGS = `<ul class="teglar">
  <li class="teg">HTML</li>
  <li class="teg">CSS</li>
  <li class="teg">Flexbox</li>
  <li class="teg">Grid</li>
  <li class="teg">Figma</li>
  <li class="teg">Moslashuvchan dizayn</li>
  <li class="teg">Accessibility</li>
</ul>`;

const TAGS_CSS = `${RESET}

body {
  padding: 24px;
}

.teglar {
  display: flex;
  max-width: 320px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.teg {
  padding: 4px 12px;
  border-radius: 999px;
  background-color: #eef6ff;
  color: #005bb5;
  white-space: nowrap;
}`;

const BADGE = `<div class="avatar-quti">
  ${pic('0b3f76', 'Dilnoza', 56, 56, ' class="avatar"')}
  <span class="nishon" aria-label="3 ta yangi xabar">3</span>
</div>`;

const BADGE_CSS = `${RESET}

body {
  padding: 24px;
}

.avatar {
  display: block;
  border-radius: 50%;
}

.nishon {
  display: grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: white;
  background-color: #b91c1c;
}`;

export const m02: ModuleDef = {
  title: 'Auto Layout → Flexbox',
  lessons: [
    {
      slug: 'auto-layout',
      title: 'Auto Layout asoslari',
      exercise: {
        title: 'Auto Layout tugma',
        description: 'Yo‘nalish, oraliq, padding va tekislash.',
        instructions: md(
          '**Maket: `Button/Primary`** — Auto layout: Horizontal → · Gap 8 · Padding 10 (tepa/past) 16 (chap/o‘ng) · Align: Center · Ikonka 20 × 20.',
          '',
          'Yozing: `.tugma` — `display: inline-flex`, `flex-direction: row`, `align-items: center`, `gap: 8px`, `padding: 10px 16px`.',
        ),
        expectedBehavior:
          'Ikonka va matn bir chiziqda, orasida 8px, tugma kontentga qarab o‘lchanadi.',
        difficulty: 'EASY',
        starterFiles: site(BUTTON, BUTTON_CSS),
        checks: [
          style('flex', 'Auto layout → inline-flex', '.tugma', 'display', 'inline-flex'),
          style('align', 'Align: Center', '.tugma', 'align-items', 'center'),
          style('gap', 'Gap 8', '.tugma', 'column-gap', '8px'),
          style('pad-y', 'Padding tepa 10', '.tugma', 'padding-top', '10px'),
          style('pad-x', 'Padding chap 16', '.tugma', 'padding-left', '16px'),
        ],
      },
    },
    {
      slug: 'hug-fill-fixed',
      title: 'Hug, Fill va Fixed',
      exercise: {
        title: 'Uch xil o‘lcham rejimi',
        description: 'Fixed — aniq kenglik, Fill — qolgan joy, Hug — kontent kengligi.',
        instructions: md(
          '**Maket: `Toolbar`** — Logo: W **Fixed 120** · Qidiruv: W **Fill container** · Tugma: W **Hug contents**.',
          '',
          '1. `.logo`: `width: 120px`, `flex-shrink: 0` (o‘rniga turgan `width: 50%` ni olib tashlang).',
          '2. `.qidiruv`: `flex: 1` (`flex-grow: 1`), `min-width: 0`.',
          '3. `.tugma`: `flex: none`, `white-space: nowrap` — matn hech qachon sinmaydi.',
        ),
        expectedBehavior:
          'Logo doim 120px, tugma matni bir qatorda, qidiruv maydoni qolgan barcha joyni egallaydi.',
        difficulty: 'MEDIUM',
        starterFiles: site(TOOLBAR, TOOLBAR_CSS),
        checks: [
          style('fixed', 'Logo Fixed 120', '.logo', 'width', '120px'),
          style('fixed-shrink', 'Logo siqilmaydi', '.logo', 'flex-shrink', '0'),
          style('fill', 'Qidiruv Fill container', '.qidiruv', 'flex-grow', '1'),
          style('hug', 'Tugma Hug: siqilmaydi', '.tugma', 'flex-shrink', '0'),
          style('nowrap', 'Tugma matni bir qatorda', '.tugma', 'white-space', 'nowrap'),
        ],
      },
    },
    {
      slug: 'al-tekislash',
      title: 'Auto Layout tekislash',
      exercise: {
        title: 'Space between va vertikal stek',
        description: 'Justify va align qiymatlarini o‘girish.',
        instructions: md(
          '**Maket: `Card/Tasks`** — Auto layout Vertical ↓, Gap 12. Ichida `Header`: Horizontal, **Space between**, Align **Center**. `List`: Vertical, Gap 8.',
          '',
          '1. `.karta`: `display: flex`, `flex-direction: column`, `gap: 12px`.',
          '2. `.karta-bosh`: `justify-content: space-between`, `align-items: center`.',
          '3. `.royxat`: `display: flex`, `flex-direction: column`, `gap: 8px`.',
        ),
        expectedBehavior:
          'Sarlavha chapda, “Hammasi” o‘ngda bir chiziqda; ro‘yxat bandlari orasida 8px.',
        difficulty: 'EASY',
        starterFiles: site(ALIGN, ALIGN_CSS),
        checks: [
          style('col', 'Karta — vertikal', '.karta', 'flex-direction', 'column'),
          style('gap', 'Karta Gap 12', '.karta', 'row-gap', '12px'),
          style(
            'between',
            'Header — Space between',
            '.karta-bosh',
            'justify-content',
            'space-between',
          ),
          style('center', 'Header — Align center', '.karta-bosh', 'align-items', 'center'),
          style('list', 'Ro‘yxat Gap 8', '.royxat', 'row-gap', '8px'),
        ],
      },
    },
    {
      slug: 'al-wrap',
      title: 'Wrap va ikki xil oraliq',
      exercise: {
        title: 'O‘raladigan teglar',
        description: 'Auto layout Wrap → `flex-wrap`, gorizontal va vertikal gap.',
        instructions: md(
          '**Maket: `Tags`** — Auto layout Horizontal, **Wrap**, Gap (gorizontal) 8, Gap (qatorlar) 12.',
          '',
          '`.teglar`: `flex-wrap: wrap`, `gap: 12px 8px` (avval qatorlar orasidagi, keyin ustunlar orasidagi).',
        ),
        expectedBehavior:
          'Teglar 320px kenglikka sig‘magach keyingi qatorga o‘tadi; qatorlar orasida 12px, teglar orasida 8px.',
        difficulty: 'EASY',
        starterFiles: site(TAGS, TAGS_CSS),
        checks: [
          style('wrap', 'Wrap yoqilgan', '.teglar', 'flex-wrap', 'wrap'),
          style('row-gap', 'Qatorlar orasida 12', '.teglar', 'row-gap', '12px'),
          style('col-gap', 'Teglar orasida 8', '.teglar', 'column-gap', '8px'),
        ],
      },
    },
    {
      slug: 'absolyut',
      title: 'Auto Layout ichida absolyut element',
      exercise: {
        title: 'Avatar ustidagi nishon',
        description: '“Ignore auto layout” va absolyut joylashuv.',
        instructions: md(
          '**Maket: `Avatar/WithBadge`** — Avatar 56 × 56. Nishon: **Absolute position**, Constraints: Top + Right, X/Y: −4 (o‘ng yuqori burchakdan chiqib turadi). Nishonda Stroke 2 Outside `#FFFFFF`.',
          '',
          '1. `.avatar-quti`: `position: relative`, `display: inline-block`.',
          '2. `.nishon`: `position: absolute`, `top: -4px`, `right: -4px`, `box-shadow: 0 0 0 2px white` (tashqi stroke).',
        ),
        expectedBehavior:
          'Qizil nishon avatarning o‘ng yuqori burchagida, oq halqa bilan ajralgan.',
        difficulty: 'MEDIUM',
        starterFiles: site(BADGE, BADGE_CSS),
        checks: [
          style('rel', 'Ota element — relative', '.avatar-quti', 'position', 'relative'),
          style('abs', 'Nishon — absolute', '.nishon', 'position', 'absolute'),
          style('top', 'Tepadan −4', '.nishon', 'top', '-4px'),
          style('right', 'O‘ngdan −4', '.nishon', 'right', '-4px'),
          style('ring', 'Tashqi oq stroke', '.nishon', 'box-shadow', '0 0 0 2px white'),
        ],
      },
      quiz: quiz('2-modul testi: Auto Layout → Flexbox', [
        q(
          'f2-al',
          'Figma’dagi Auto Layout CSS’da nimaga eng yaqin?',
          ['Flexbox', 'Float', '`position: absolute`', 'Jadval'],
          [0],
        ),
        q(
          'f2-fill',
          '“Fill container” ga mos CSS?',
          ['`flex: 1` (yoki `flex-grow: 1`)', '`width: auto`', '`flex: none`', '`position: fixed`'],
          [0],
        ),
        q(
          'f2-hug',
          '“Hug contents” nimani bildiradi?',
          [
            'O‘lcham kontentga qarab — CSS’da odatda kenglik berilmaydi',
            'Element qolgan joyni to‘ldiradi',
            'Kenglik doim 100%',
            'Element yashiriladi',
          ],
          [0],
        ),
        q(
          'f2-gap',
          '`gap: 12px 8px` qaysi tartibda o‘qiladi?',
          [
            'Avval qatorlar orasidagi (row-gap), keyin ustunlar orasidagi (column-gap)',
            'Avval ustunlar, keyin qatorlar',
            'Tepa va past padding',
            'Faqat 12px ishlatiladi',
          ],
          [0],
        ),
        q(
          'f2-abs',
          'Auto Layout ichidagi “Absolute position” elementni CSS’da yasash uchun nima kerak? (bir nechta javob)',
          [
            'Ota elementga `position: relative`',
            'Elementga `position: absolute` va `top`/`right` kabi qiymatlar',
            'Ota elementga `display: none`',
            'Elementga `float: right`',
          ],
          [0, 1],
        ),
      ]),
    },
  ],
};

export const s02: Record<string, ProjectFile[]> = {
  'auto-layout': site(
    BUTTON,
    `${BUTTON_CSS}

.tugma {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
}`,
  ),
  'hug-fill-fixed': site(
    TOOLBAR,
    `${TOOLBAR_CSS.replace('  width: 50%;\n', '  width: 120px;\n  flex-shrink: 0;\n')}

.qidiruv {
  flex: 1;
  min-width: 0;
}

.tugma {
  flex: none;
  white-space: nowrap;
}`,
  ),
  'al-tekislash': site(
    ALIGN,
    `${ALIGN_CSS}

.karta {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.karta-bosh {
  justify-content: space-between;
  align-items: center;
}

.royxat {
  display: flex;
  flex-direction: column;
  gap: 8px;
}`,
  ),
  'al-wrap': site(
    TAGS,
    `${TAGS_CSS}

.teglar {
  flex-wrap: wrap;
  gap: 12px 8px;
}`,
  ),
  absolyut: site(
    BADGE,
    `${BADGE_CSS}

.avatar-quti {
  position: relative;
  display: inline-block;
}

.nishon {
  position: absolute;
  top: -4px;
  right: -4px;
  box-shadow: 0 0 0 2px white;
}`,
  ),
};
