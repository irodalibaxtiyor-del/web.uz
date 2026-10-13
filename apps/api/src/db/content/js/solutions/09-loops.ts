import type { ProjectFile } from '@webdizayn/shared';
import { BODY09, PRICES } from '../modules/09-loops';
import { app } from '../shared';

export const s09: Record<string, ProjectFile[]> = {
  'loop-for': app(
    BODY09.for,
    `document.getElementById('jadval-btn').onclick = function () {
  const n = Number(document.getElementById('n').value);
  let html = '';
  for (let i = 1; i <= 10; i++) {
    html += \`<li>\${n} × \${i} = \${n * i}</li>\`;
  }
  document.getElementById('jadval').innerHTML = html;
};

document.getElementById('yigindi-btn').onclick = function () {
  const oxiri = Number(document.getElementById('oxiri').value);
  let yigindi = 0;
  for (let i = 1; i <= oxiri; i++) {
    yigindi += i;
  }
  document.getElementById('yigindi').textContent = yigindi;
};`,
  ),

  'loop-for-in': app(
    BODY09.forIn,
    `${PRICES}

function korsat() {
  const qismlar = [];
  let jami = 0;
  for (const nom in narxlar) {
    qismlar.push(\`\${nom}: \${narxlar[nom]}\`);
    jami += narxlar[nom];
  }
  document.getElementById('royxat').textContent = qismlar.join('; ');
  document.getElementById('jami').textContent = jami;
}

document.getElementById('qosh').onclick = function () {
  const nom = document.getElementById('nom').value.trim();
  narxlar[nom] = Number(document.getElementById('narx').value);
  korsat();
};

korsat();`,
  ),

  'loop-for-of': app(
    BODY09.forOf,
    `document.getElementById('tahlil').onclick = function () {
  const matn = document.getElementById('matn').value;

  let unlilar = 0;
  for (const harf of matn.toLowerCase()) {
    if ('aeiou'.includes(harf)) unlilar++;
  }

  let teskari = '';
  for (const harf of matn) {
    teskari = harf + teskari;
  }

  let engUzun = '';
  for (const soz of matn.split(' ')) {
    if (soz.length > engUzun.length) engUzun = soz;
  }

  document.getElementById('unlilar').textContent = unlilar;
  document.getElementById('teskari').textContent = teskari;
  document.getElementById('eng-uzun').textContent = engUzun;
};`,
  ),

  'loop-while': app(
    BODY09.while,
    `document.getElementById('hisobla').onclick = function () {
  let summa = Number(document.getElementById('summa').value);
  const maqsad = Number(document.getElementById('maqsad').value);
  const foiz = Number(document.getElementById('foiz').value);
  const natija = document.getElementById('yillar');

  if (foiz <= 0) {
    natija.textContent = 'Hech qachon';
    return;
  }

  let yillar = 0;
  while (summa < maqsad) {
    summa += (summa * foiz) / 100;
    yillar++;
  }
  natija.textContent = yillar;
};

document.getElementById('raqamlar').onclick = function () {
  let son = Number(document.getElementById('son').value);
  let yigindi = 0;
  do {
    yigindi += son % 10;
    son = Math.floor(son / 10);
  } while (son > 0);
  document.getElementById('yigindi').textContent = yigindi;
};`,
  ),

  'break-continue': app(
    BODY09.breakContinue,
    `document.getElementById('hisobla').onclick = function () {
  const sonlar = document.getElementById('sonlar').value.split(' ');

  let yigindi = 0;
  for (const q of sonlar) {
    const son = Number(q);
    if (son === 0) break;
    if (son < 0) continue;
    yigindi += son;
  }

  let yettilik = 'Topilmadi';
  for (const q of sonlar) {
    const son = Number(q);
    if (son > 0 && son % 7 === 0) {
      yettilik = son;
      break;
    }
  }

  document.getElementById('yigindi').textContent = yigindi;
  document.getElementById('yettilik').textContent = yettilik;
};`,
  ),

  iterables: app(
    BODY09.iterables,
    `document.getElementById('tuz').onclick = function () {
  const sozlar = document.getElementById('sozlar').value.split(',');

  const qatorlar = [];
  let bosh = '';
  for (const [i, soz] of sozlar.entries()) {
    const toza = soz.trim();
    qatorlar.push(\`\${i + 1}. \${toza}\`);
    bosh += toza[0].toUpperCase();
  }

  document.getElementById('raqamli').textContent = qatorlar.join(' ');
  document.getElementById('bosh').textContent = bosh;
};`,
  ),
};
