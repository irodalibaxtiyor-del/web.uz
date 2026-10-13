import type { ProjectFile } from '@webdizayn/shared';
import {
  BODY18,
  CALC_CSS,
  COURSES_DATA,
  FILTER_CSS,
  QUIZ_CSS,
  QUIZ_DATA,
  TODO_CSS,
} from '../modules/18-projects';
import { app } from '../shared';

export const s18: Record<string, ProjectFile[]> = {
  'project-todo': app(
    BODY18.todo,
    `const KALIT = 'vazifalar';
const royxat = document.getElementById('royxat');
const forma = document.getElementById('forma');
const filtrlar = document.getElementById('filtrlar');

let xotira = null;
let filtr = 'hammasi';
let keyingiId = 1;

function oqi() {
  try {
    return JSON.parse(localStorage.getItem(KALIT) ?? '[]');
  } catch {
    return xotira ?? [];
  }
}

let vazifalar = oqi();
keyingiId = vazifalar.reduce((m, v) => Math.max(m, v.id), 0) + 1;

function saqla() {
  xotira = vazifalar;
  try {
    localStorage.setItem(KALIT, JSON.stringify(vazifalar));
  } catch {
    // ombor yo‘q — xotirada qoladi
  }
}

function vazifaElementi(v) {
  const li = document.createElement('li');
  li.dataset.id = v.id;
  li.classList.toggle('bajarilgan', v.bajarildi);

  const belgi = document.createElement('input');
  belgi.type = 'checkbox';
  belgi.checked = v.bajarildi;

  const matn = document.createElement('span');
  matn.textContent = v.matn;

  const ochir = document.createElement('button');
  ochir.type = 'button';
  ochir.className = 'ochir';
  ochir.textContent = 'O‘chirish';

  li.append(belgi, ' ', matn, ' ', ochir);
  return li;
}

function chiz() {
  const korinadigan = vazifalar.filter((v) =>
    filtr === 'faol' ? !v.bajarildi : filtr === 'bajarilgan' ? v.bajarildi : true,
  );
  royxat.replaceChildren(...korinadigan.map(vazifaElementi));
  const qolgan = vazifalar.filter((v) => !v.bajarildi).length;
  document.getElementById('qolgan').textContent = \`\${qolgan} ta vazifa qoldi\`;
  for (const t of filtrlar.children) t.classList.toggle('faol', t.dataset.filtr === filtr);
}

forma.addEventListener('submit', (event) => {
  event.preventDefault();
  const maydon = document.getElementById('matn');
  const matn = maydon.value.trim();
  if (!matn) return;
  vazifalar.push({ id: keyingiId++, matn, bajarildi: false });
  maydon.value = '';
  saqla();
  chiz();
});

royxat.addEventListener('click', (event) => {
  const li = event.target.closest('li');
  if (!li) return;
  const id = Number(li.dataset.id);
  if (event.target.matches('input[type="checkbox"]')) {
    const v = vazifalar.find((x) => x.id === id);
    v.bajarildi = !v.bajarildi;
  } else if (event.target.matches('.ochir')) {
    vazifalar = vazifalar.filter((x) => x.id !== id);
  } else {
    return;
  }
  saqla();
  chiz();
});

filtrlar.addEventListener('click', (event) => {
  const t = event.target.closest('[data-filtr]');
  if (!t) return;
  filtr = t.dataset.filtr;
  chiz();
});

chiz();`,
    { css: TODO_CSS },
  ),

  'project-calculator': app(
    BODY18.calculator,
    `const holat = { ekran: '0', oldingi: null, amal: null, yangiSon: false };

function hisobla(a, amal, b) {
  switch (amal) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return b === 0 ? null : a / b;
  }
  return b;
}

function formatla(son) {
  return String(Number(son.toFixed(10)));
}

function tozala() {
  holat.ekran = '0';
  holat.oldingi = null;
  holat.amal = null;
  holat.yangiSon = false;
}

function raqam(r) {
  if (holat.yangiSon || holat.ekran === '0' || holat.ekran === 'Xato') {
    holat.ekran = r;
    holat.yangiSon = false;
  } else {
    holat.ekran += r;
  }
}

function nuqta() {
  if (holat.yangiSon || holat.ekran === 'Xato') {
    holat.ekran = '0.';
    holat.yangiSon = false;
  } else if (!holat.ekran.includes('.')) {
    holat.ekran += '.';
  }
}

// Kutayotgan amalni bajaradi; xato bo‘lsa false qaytaradi.
function bajar() {
  if (holat.amal === null || holat.yangiSon) return true;
  const natija = hisobla(holat.oldingi, holat.amal, Number(holat.ekran));
  if (natija === null) {
    tozala();
    holat.ekran = 'Xato';
    holat.yangiSon = true;
    return false;
  }
  holat.ekran = formatla(natija);
  return true;
}

function amalTanla(amal) {
  if (!bajar()) return;
  holat.oldingi = Number(holat.ekran);
  holat.amal = amal;
  holat.yangiSon = true;
}

function teng() {
  if (!bajar()) return;
  holat.oldingi = null;
  holat.amal = null;
  holat.yangiSon = true;
}

function bos(t) {
  if (/^[0-9]$/.test(t)) return raqam(t);
  if (t === '.') return nuqta();
  if (t === 'C') return tozala();
  if (t === '=') return teng();
  return amalTanla(t);
}

document.getElementById('tugmalar').addEventListener('click', (event) => {
  const t = event.target.closest('[data-tugma]');
  if (!t) return;
  bos(t.dataset.tugma);
  document.getElementById('ekran').textContent = holat.ekran;
});`,
    { css: CALC_CSS },
  ),

  'project-quiz': app(
    BODY18.quiz,
    `${QUIZ_DATA}

const holat = { joriy: 0, ball: 0, javobBerildi: false };
const variantlar = document.getElementById('variantlar');
const keyingi = document.getElementById('keyingi');
const natija = document.getElementById('natija');
const qaytadan = document.getElementById('qaytadan');

function savolniChiz() {
  const s = SAVOLLAR[holat.joriy];
  document.getElementById('raqam').textContent = \`\${holat.joriy + 1} / \${SAVOLLAR.length}\`;
  document.getElementById('savol').textContent = s.matn;
  variantlar.replaceChildren(
    ...s.variantlar.map((v, i) => {
      const tugma = document.createElement('button');
      tugma.type = 'button';
      tugma.className = 'variant';
      tugma.textContent = v;
      tugma.dataset.indeks = i;
      return tugma;
    }),
  );
  keyingi.disabled = true;
  keyingi.hidden = false;
}

function boshla() {
  holat.joriy = 0;
  holat.ball = 0;
  holat.javobBerildi = false;
  natija.textContent = '';
  qaytadan.hidden = true;
  savolniChiz();
}

variantlar.addEventListener('click', (event) => {
  const tugma = event.target.closest('.variant');
  if (!tugma || holat.javobBerildi) return;
  holat.javobBerildi = true;

  const togri = Number(tugma.dataset.indeks) === SAVOLLAR[holat.joriy].togri;
  if (togri) holat.ball++;
  tugma.classList.add(togri ? 'togri' : 'xato');
  tugma.textContent += togri ? ' ✓' : ' ✗';

  for (const t of variantlar.children) t.disabled = true;
  keyingi.disabled = false;
});

keyingi.addEventListener('click', () => {
  holat.joriy++;
  holat.javobBerildi = false;
  if (holat.joriy < SAVOLLAR.length) {
    savolniChiz();
    return;
  }
  variantlar.replaceChildren();
  document.getElementById('savol').textContent = '';
  keyingi.hidden = true;
  natija.textContent = \`Natija: \${holat.ball} / \${SAVOLLAR.length}\`;
  qaytadan.hidden = false;
});

qaytadan.addEventListener('click', boshla);

boshla();`,
    { css: QUIZ_CSS },
  ),

  'project-filter': app(
    BODY18.filter,
    `${COURSES_DATA}

const holat = { qidiruv: '', daraja: 'hammasi', tartib: null };
const katalog = document.getElementById('katalog');
const darajalar = document.getElementById('darajalar');

function korinadiganlar() {
  const q = holat.qidiruv.trim().toLowerCase();
  let natija = KURSLAR.filter(
    (k) =>
      k.nom.toLowerCase().includes(q) &&
      (holat.daraja === 'hammasi' || k.daraja === holat.daraja),
  );
  if (holat.tartib === 'osish') natija = natija.toSorted((a, b) => a.narx - b.narx);
  if (holat.tartib === 'kamayish') natija = natija.toSorted((a, b) => b.narx - a.narx);
  return natija;
}

function kartaYasa(k) {
  const karta = document.createElement('article');
  karta.className = 'karta';
  const nom = document.createElement('h3');
  nom.textContent = k.nom;
  const daraja = document.createElement('p');
  daraja.textContent = k.daraja;
  const narx = document.createElement('p');
  narx.textContent = \`\${k.narx} so‘m\`;
  karta.append(nom, daraja, narx);
  return karta;
}

function chiz() {
  const royxat = korinadiganlar();
  katalog.replaceChildren(...royxat.map(kartaYasa));
  document.getElementById('topildi').textContent = royxat.length
    ? \`Topildi: \${royxat.length} ta kurs\`
    : 'Hech narsa topilmadi';
}

document.getElementById('qidiruv').addEventListener('input', (event) => {
  holat.qidiruv = event.target.value;
  chiz();
});

darajalar.addEventListener('click', (event) => {
  const t = event.target.closest('[data-daraja]');
  if (!t) return;
  holat.daraja = t.dataset.daraja;
  for (const b of darajalar.children) b.classList.toggle('faol', b === t);
  chiz();
});

document.getElementById('arzon').addEventListener('click', () => {
  holat.tartib = 'osish';
  chiz();
});

document.getElementById('qimmat').addEventListener('click', () => {
  holat.tartib = 'kamayish';
  chiz();
});

chiz();`,
    { css: FILTER_CSS },
  ),
};
