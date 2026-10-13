import type { ProjectFile } from '@webdizayn/shared';
import { BODY07, SANA_OQI } from '../modules/07-dates';
import { app } from '../shared';

export const s07: Record<string, ProjectFile[]> = {
  dates: app(
    BODY07.dates,
    `const boshlanish = new Date(2026, 8, 1);
const yilOxiri = new Date(2026, 11, 31);
const KUN_MS = 1000 * 60 * 60 * 24;

document.getElementById('sana').textContent = boshlanish.toDateString();
document.getElementById('kunlar').textContent = Math.round((yilOxiri - boshlanish) / KUN_MS);

document.getElementById('qosh').onclick = function () {
  const n = Number(document.getElementById('n').value);
  document.getElementById('keyin').textContent = new Date(2026, 8, 1 + n).toDateString();
};`,
  ),

  'date-formats': app(
    BODY07.formats,
    `const OYLAR = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
];

document.getElementById('formatla').onclick = function () {
  const q = document.getElementById('sana').value.split('-');
  document.getElementById('uzbek').textContent = q[2] + '.' + q[1] + '.' + q[0];
  document.getElementById('oy-nomi').textContent = OYLAR[Number(q[1]) - 1];
};`,
  ),

  'date-get': app(
    BODY07.get,
    `${SANA_OQI}

const HAFTA = ['yakshanba', 'dushanba', 'seshanba', 'chorshanba', 'payshanba', 'juma', 'shanba'];
const YIL_MS = 365.25 * 24 * 60 * 60 * 1000;

document.getElementById('kun-btn').onclick = function () {
  const d = sanaOqi(document.getElementById('sana').value);
  document.getElementById('kun').textContent = HAFTA[d.getDay()];
};

document.getElementById('yosh-btn').onclick = function () {
  const tugilgan = sanaOqi(document.getElementById('tugilgan').value);
  document.getElementById('yosh').textContent = Math.floor((BUGUN - tugilgan) / YIL_MS);
};`,
  ),

  'date-set': app(
    BODY07.set,
    `${SANA_OQI}

function kunQosh(sana, n) {
  const natija = new Date(sana);
  natija.setDate(natija.getDate() + n);
  return natija;
}

function formatla(d) {
  const kun = String(d.getDate()).padStart(2, '0');
  const oy = String(d.getMonth() + 1).padStart(2, '0');
  return \`\${kun}.\${oy}.\${d.getFullYear()}\`;
}

document.getElementById('hisobla').onclick = function () {
  const berilgan = sanaOqi(document.getElementById('berilgan').value);
  const muddat = kunQosh(berilgan, Number(document.getElementById('kunlar').value));
  document.getElementById('muddat').textContent = formatla(muddat);
  document.getElementById('otdimi').textContent = muddat < BUGUN;
};`,
  ),
};
