import type { ProjectFile } from '@webdizayn/shared';
import { BODY06, STUDENTS } from '../modules/06-arrays';
import { app } from '../shared';

export const s06: Record<string, ProjectFile[]> = {
  arrays: app(
    BODY06.arrays,
    `const xaridlar = ['non', 'sut', 'tuxum'];

function korsat() {
  document.getElementById('ruyxat').textContent = xaridlar.join(', ');
  document.getElementById('soni').textContent = xaridlar.length;
  document.getElementById('oxirgi').textContent = xaridlar.at(-1);
}

document.getElementById('qosh').onclick = function () {
  xaridlar.push(document.getElementById('narsa').value);
  korsat();
};

korsat();`,
  ),

  'array-methods': app(
    BODY06.methods,
    `const navbat = ['Ali', 'Vali'];

function korsat() {
  document.getElementById('navbat').textContent = navbat.join(' → ');
}

function ism() {
  return document.getElementById('ism').value;
}

document.getElementById('oxiriga').onclick = function () {
  navbat.push(ism());
  korsat();
};

document.getElementById('boshiga').onclick = function () {
  navbat.unshift(ism());
  korsat();
};

document.getElementById('chiqar').onclick = function () {
  document.getElementById('chaqirildi').textContent = navbat.shift() ?? 'Navbat bo‘sh';
  korsat();
};

document.getElementById('olib').onclick = function () {
  navbat.pop();
  korsat();
};

korsat();`,
  ),

  'array-search': app(
    BODY06.search,
    `const talabalar = [
  { ism: 'Ali', ball: 85 },
  { ism: 'Madina', ball: 92 },
  { ism: 'Jasur', ball: 67 },
];
const ismlar = ['Ali', 'Madina', 'Jasur'];

document.getElementById('top').onclick = function () {
  const ism = document.getElementById('ism').value;
  const topildi = talabalar.find(function (t) {
    return t.ism === ism;
  });
  document.getElementById('ball').textContent = topildi?.ball ?? 'Topilmadi';
  document.getElementById('bormi').textContent = ismlar.includes(ism);
};`,
  ),

  'array-sort': app(
    BODY06.sort,
    `function osish(a, b) {
  return a - b;
}

document.getElementById('sarala').onclick = function () {
  const sonlar = document.getElementById('sonlar').value.split(' ');
  document.getElementById('xato').textContent = sonlar.slice().sort().join(', ');
  document.getElementById('osish').textContent = sonlar.slice().sort(osish).join(', ');
  document.getElementById('kamayish').textContent = sonlar
    .slice()
    .sort(function (a, b) {
      return b - a;
    })
    .join(', ');
};`,
  ),

  'array-iteration': app(
    BODY06.iteration,
    `${STUDENTS}

function hisobla() {
  document.getElementById('otganlar').textContent = talabalar
    .filter(function (t) {
      return t.ball >= 60;
    })
    .map(function (t) {
      return t.ism;
    })
    .join(', ');

  const jami = talabalar.reduce(function (yigindi, t) {
    return yigindi + t.ball;
  }, 0);
  document.getElementById('ortacha').textContent = (jami / talabalar.length).toFixed(1);

  const balllar = talabalar.map(function (t) {
    return t.ball;
  });
  document.getElementById('eng').textContent = Math.max(...balllar);
}

document.getElementById('qosh').onclick = function () {
  talabalar.push({
    ism: document.getElementById('yangi-ism').value,
    ball: Number(document.getElementById('yangi-ball').value),
  });
  hisobla();
};

hisobla();`,
  ),
};
