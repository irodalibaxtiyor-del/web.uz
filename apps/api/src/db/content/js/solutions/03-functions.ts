import type { ProjectFile } from '@webdizayn/shared';
import { BODY03, EVENTS_CSS } from '../modules/03-functions';
import { app } from '../shared';

export const s03: Record<string, ProjectFile[]> = {
  functions: app(
    BODY03.functions,
    `function celsiy(f) {
  return ((f - 32) * 5) / 9;
}

function maydon(en, boy) {
  return en * boy;
}

document.getElementById('aylantir').onclick = function () {
  const f = Number(document.getElementById('f').value);
  document.getElementById('c').textContent = celsiy(f);
};

document.getElementById('hisobla').onclick = function () {
  const en = Number(document.getElementById('en').value);
  const boy = Number(document.getElementById('boy').value);
  document.getElementById('maydon').textContent = maydon(en, boy);
};`,
  ),

  objects: app(
    BODY03.objects,
    `const kurs = {
  nom: 'JavaScript asoslari',
  narx: 450000,
};

document.getElementById('nom').textContent = kurs.nom;
document.getElementById('narx').textContent = kurs.narx;

document.getElementById('chegirma').onclick = function () {
  kurs.narx = kurs.narx * 0.8;
  document.getElementById('narx').textContent = kurs.narx;
};

document.getElementById('yarat').onclick = function () {
  const talaba = {
    ism: document.getElementById('ism').value,
    yosh: Number(document.getElementById('yosh').value),
    shahar: document.getElementById('shahar').value,
  };
  document.getElementById('karta').textContent =
    talaba.ism + ', ' + talaba.yosh + ' yosh, ' + talaba.shahar;
};`,
  ),

  'object-properties': app(
    BODY03.properties,
    `const lugat = {
  olma: 'apple',
  non: 'bread',
  suv: 'water',
};

function soniniKorsat() {
  document.getElementById('soni').textContent = Object.keys(lugat).length;
}

document.getElementById('tarjima').onclick = function () {
  const soz = document.getElementById('soz').value;
  document.getElementById('natija').textContent = lugat[soz] ?? 'Topilmadi';
};

document.getElementById('qosh').onclick = function () {
  const soz = document.getElementById('yangi-soz').value;
  lugat[soz] = document.getElementById('yangi-tarjima').value;
  soniniKorsat();
};

soniniKorsat();`,
  ),

  'object-methods': app(
    BODY03.methods,
    `const hisob = {
  egasi: 'Dilnoza',
  balans: 50000,
  kirim(summa) {
    this.balans += summa;
  },
  chiqim(summa) {
    this.balans -= summa;
  },
  malumot() {
    return this.egasi + ': ' + this.balans + ' so‘m';
  },
};

function korsat() {
  document.getElementById('info').textContent = hisob.malumot();
}

function summa() {
  return Number(document.getElementById('summa').value);
}

document.getElementById('kirim').onclick = function () {
  hisob.kirim(summa());
  korsat();
};

document.getElementById('chiqim').onclick = function () {
  hisob.chiqim(summa());
  korsat();
};

document.getElementById('json').textContent = JSON.stringify(hisob);
korsat();`,
  ),

  events: app(
    BODY03.events,
    `const maydon = document.getElementById('maydon');
const kvadrat = document.getElementById('kvadrat');
const holat = document.getElementById('holat');

maydon.oninput = function () {
  document.getElementById('uzunlik').textContent = maydon.value.length;
};

maydon.onkeydown = function (event) {
  document.getElementById('tugma-nomi').textContent = event.key;
};

kvadrat.onmouseover = function () {
  holat.textContent = 'Sichqoncha ustida';
};

kvadrat.onmouseout = function () {
  holat.textContent = 'Sichqoncha tashqarida';
};`,
    { css: EVENTS_CSS },
  ),
};
