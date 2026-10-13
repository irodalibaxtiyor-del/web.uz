import type { ProjectFile } from '@webdizayn/shared';
import { BODY02 } from '../modules/02-variables';
import { app } from '../shared';

export const s02: Record<string, ProjectFile[]> = {
  variables: app(
    BODY02.variables,
    `let kurs = 'JavaScript';
let modullar = 18;
document.getElementById('kurs').textContent = kurs + ' kursi: ' + modullar + ' modul';

document.getElementById('saqlash').onclick = function () {
  let ism = document.getElementById('ism').value;
  document.getElementById('salom').textContent = 'Salom, ' + ism + '!';
};`,
  ),

  let: app(
    BODY02.let,
    `let son = 0;

function korsat() {
  document.getElementById('son').textContent = son;
}

document.getElementById('plus').onclick = function () {
  son++;
  korsat();
};

document.getElementById('minus').onclick = function () {
  son--;
  korsat();
};

document.getElementById('nol').onclick = function () {
  son = 0;
  korsat();
};`,
  ),

  const: app(
    BODY02.const,
    `const NARX = 25000;
document.getElementById('narx').textContent = NARX;

const yangiNarx = NARX + 5000;
document.getElementById('yangi').textContent = yangiNarx;

document.getElementById('hisobla').onclick = function () {
  const soni = Number(document.getElementById('soni').value);
  document.getElementById('jami').textContent = soni * NARX;
};`,
  ),

  operators: app(
    BODY02.operators,
    `document.getElementById('hisobla').onclick = function () {
  const aMatn = document.getElementById('a').value;
  const bMatn = document.getElementById('b').value;
  const a = Number(aMatn);
  const b = Number(bMatn);

  document.getElementById('yigindi').textContent = a + b;
  document.getElementById('ulash').textContent = aMatn + bMatn;
  document.getElementById('katta').textContent = a > b;
};`,
  ),

  arithmetic: app(
    BODY02.arithmetic,
    `document.getElementById('aylantir').onclick = function () {
  const daqiqa = Number(document.getElementById('daqiqa').value);
  const qoldiq = daqiqa % 60;
  const soat = (daqiqa - qoldiq) / 60;
  document.getElementById('vaqt').textContent = soat + ' soat ' + qoldiq + ' daqiqa';
};

document.getElementById('ortacha').onclick = function () {
  const x = Number(document.getElementById('x').value);
  const y = Number(document.getElementById('y').value);
  const z = Number(document.getElementById('z').value);
  document.getElementById('natija').textContent = (x + y + z) / 3;
};`,
  ),

  assignment: app(
    BODY02.assignment,
    `let balans = 100000;
let tarix = '';

function korsat() {
  document.getElementById('balans').textContent = balans;
  document.getElementById('tarix').textContent = tarix;
}

function summa() {
  return Number(document.getElementById('summa').value);
}

document.getElementById('kirim').onclick = function () {
  const s = summa();
  balans += s;
  tarix += '+' + s + '; ';
  korsat();
};

document.getElementById('chiqim').onclick = function () {
  const s = summa();
  balans -= s;
  tarix += '-' + s + '; ';
  korsat();
};

document.getElementById('ikki').onclick = function () {
  balans *= 2;
  korsat();
};

korsat();`,
  ),

  'data-types': app(
    BODY02.dataTypes,
    `let qiymatsiz;
document.getElementById('t-null').textContent = typeof null;
document.getElementById('t-und').textContent = typeof qiymatsiz;

document.getElementById('aniqla').onclick = function () {
  const value = document.getElementById('son').value;
  document.getElementById('kiritma').textContent = typeof value;
  document.getElementById('raqam').textContent = typeof Number(value);
};`,
  ),
};
