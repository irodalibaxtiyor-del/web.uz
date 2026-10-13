import type { ProjectFile } from '@webdizayn/shared';
import { BODY11, PRICES11 } from '../modules/11-quality';
import { app } from '../shared';

export const s11: Record<string, ProjectFile[]> = {
  errors: app(
    BODY11.errors,
    `function bol(a, b) {
  if (isNaN(a) || isNaN(b)) throw new TypeError('Son kiriting');
  if (b === 0) throw new Error('Nolga bo‘lib bo‘lmaydi');
  return a / b;
}

document.getElementById('bol').onclick = function () {
  const a = Number(document.getElementById('a').value);
  const b = Number(document.getElementById('b').value);
  const natija = document.getElementById('natija');
  const xato = document.getElementById('xato');

  try {
    natija.textContent = bol(a, b);
    xato.textContent = '';
  } catch (e) {
    natija.textContent = '';
    xato.textContent = e.message;
  } finally {
    document.getElementById('holat').textContent = 'Tekshirildi';
  }
};`,
  ),

  scope: app(
    BODY11.scope,
    `let jami = 0;

function qosh(narx) {
  jami = jami + narx;
  korsat();
}

function korsat() {
  let chegirma = 0;
  if (jami > 100000) {
    chegirma = 0.1;
  }
  const tolov = jami * (1 - chegirma);
  document.getElementById('jami').textContent = jami;
  document.getElementById('tolov').textContent = tolov;
}

document.getElementById('qosh').onclick = function () {
  qosh(50000);
};

korsat();`,
  ),

  hoisting: app(
    BODY11.hoisting,
    `let kursNomi = 'JavaScript';

document.getElementById('salom').textContent = salomlash('Ali');
document.getElementById('kurs').textContent = kursNomi;
document.getElementById('var-qiymat').textContent = String(eski);

document.getElementById('salomlash').onclick = function () {
  document.getElementById('salom').textContent = salomlash(document.getElementById('ism').value);
};

function salomlash(ism) {
  return 'Salom, ' + ism + '!';
}

var eski = 5;`,
  ),

  'strict-mode': app(
    BODY11.strict,
    `'use strict';

let natija = 0;

document.getElementById('rejim').textContent = (function () {
  return this === undefined;
})();

document.getElementById('hisobla').onclick = function () {
  const narx = Number(document.getElementById('narx').value);
  const soni = Number(document.getElementById('soni').value);
  natija = narx * soni;
  document.getElementById('natija').textContent = natija;
};`,
  ),

  this: app(
    BODY11.this,
    `function tanla() {
  document.getElementById('tanlangan').textContent = this.textContent;
}

for (const tugma of document.getElementsByClassName('rang')) {
  tugma.onclick = tanla;
}

const hamyon = {
  balans: 0,
  qosh() {
    this.balans += 1000;
    document.getElementById('balans').textContent = this.balans;
  },
};

document.getElementById('qosh').onclick = hamyon.qosh.bind(hamyon);`,
  ),

  'arrow-functions': app(
    BODY11.arrow,
    `${PRICES11}

function korsat() {
  document.getElementById('arzon').textContent = narxlar.filter((n) => n < 10000).join(', ');
  document.getElementById('qqs').textContent = narxlar.map((n) => Math.round(n * 1.12)).join(', ');
  document.getElementById('jami').textContent = narxlar.reduce((s, n) => s + n, 0);
}

document.getElementById('qosh').onclick = () => {
  narxlar.push(Number(document.getElementById('yangi').value));
  korsat();
};

korsat();`,
  ),

  debugging: app(
    BODY11.debugging,
    `document.getElementById('hisobla').onclick = function () {
  const sonlar = document.getElementById('sonlar').value.split(' ').map(Number);

  let yigindi = 0;
  for (let i = 0; i < sonlar.length; i++) {
    yigindi += sonlar[i];
  }

  let eng = sonlar[0];
  for (const s of sonlar) {
    if (s > eng) eng = s;
  }

  document.getElementById('yigindi').textContent = yigindi;
  document.getElementById('ortacha').textContent = yigindi / sonlar.length;
  document.getElementById('eng').textContent = eng;
};`,
  ),

  'style-guide': app(
    BODY11.style,
    `const PROMOKOD = 'WEB10';
const CHEGIRMA = 0.1;

document.getElementById('hisobla').onclick = function () {
  const summa = Number(document.getElementById('summa').value);
  const kod = document.getElementById('kod').value.trim();

  let tolov = summa;
  if (kod === PROMOKOD) {
    tolov = summa * (1 - CHEGIRMA);
  }
  document.getElementById('tolov').textContent = tolov;
};`,
  ),

  mistakes: app(
    BODY11.mistakes,
    `function kirish(parol) {
  if (parol === 'Web2026') {
    return 'Xush kelibsiz';
  }
  return 'Parol noto‘g‘ri';
}

function jami(narx, qqs) {
  return narx + qqs;
}

function kunNomi(n) {
  let natija;
  switch (n) {
    case 6:
      natija = 'shanba';
      break;
    case 7:
      natija = 'yakshanba';
      break;
    default:
      natija = 'ish kuni';
  }
  return natija;
}

document.getElementById('kirish').onclick = function () {
  document.getElementById('kirish-natija').textContent = kirish(document.getElementById('parol').value);
};

document.getElementById('jami-btn').onclick = function () {
  const narx = Number(document.getElementById('narx').value);
  const qqs = Number(document.getElementById('qqs').value);
  document.getElementById('jami').textContent = jami(narx, qqs);
};

document.getElementById('kun-btn').onclick = function () {
  document.getElementById('kun-nomi').textContent = kunNomi(Number(document.getElementById('kun').value));
};`,
  ),
};
