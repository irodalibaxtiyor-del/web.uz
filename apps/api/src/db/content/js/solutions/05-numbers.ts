import type { ProjectFile } from '@webdizayn/shared';
import { BODY05 } from '../modules/05-numbers';
import { app } from '../shared';

export const s05: Record<string, ProjectFile[]> = {
  numbers: app(
    BODY05.numbers,
    `document.getElementById('oddiy').textContent = 0.1 + 0.2;
document.getElementById('tuzatilgan').textContent = (0.1 * 10 + 0.2 * 10) / 10;

document.getElementById('tekshir').onclick = function () {
  const son = Number(document.getElementById('kiritma').value);
  document.getElementById('son-emas').textContent = isNaN(son);
};`,
  ),

  'number-methods': app(
    BODY05.methods,
    `const KURS = 12650;

function somga(dollar) {
  return (dollar * KURS).toFixed(2);
}

document.getElementById('aylantir').onclick = function () {
  const dollar = Number(document.getElementById('dollar').value);
  document.getElementById('som').textContent = somga(dollar);
};

document.getElementById('ajrat').onclick = function () {
  const vazn = document.getElementById('vazn').value;
  document.getElementById('float').textContent = parseFloat(vazn);
  document.getElementById('int').textContent = parseInt(vazn);
};`,
  ),

  math: app(
    BODY05.math,
    `document.getElementById('doira').onclick = function () {
  const r = Number(document.getElementById('radius').value);
  document.getElementById('maydon').textContent = (Math.PI * r ** 2).toFixed(2);
};

document.getElementById('avtobus').onclick = function () {
  const odam = Number(document.getElementById('odam').value);
  document.getElementById('soni').textContent = Math.ceil(odam / 45);
};`,
  ),

  random: app(
    BODY05.random,
    `function tasodifiy(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.getElementById('tanla').onclick = function () {
  const min = Number(document.getElementById('min').value);
  const max = Number(document.getElementById('max').value);
  document.getElementById('son').textContent = tasodifiy(min, max);
};

document.getElementById('zar').onclick = function () {
  document.getElementById('zar-natija').textContent = tasodifiy(1, 6);
};`,
  ),
};
