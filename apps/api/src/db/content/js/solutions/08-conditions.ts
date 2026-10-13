import type { ProjectFile } from '@webdizayn/shared';
import { BODY08 } from '../modules/08-conditions';
import { app } from '../shared';

export const s08: Record<string, ProjectFile[]> = {
  booleans: app(
    BODY08.booleans,
    `document.getElementById('tekshir').onclick = function () {
  const value = document.getElementById('qiymat').value;
  document.getElementById('matn').textContent = Boolean(value);
  document.getElementById('son').textContent = Boolean(Number(value));
};`,
  ),

  comparisons: app(
    BODY08.comparisons,
    `document.getElementById('kirish').onclick = function () {
  const yosh = Number(document.getElementById('yosh').value);
  const parol = document.getElementById('parol').value;

  document.getElementById('ruxsat').textContent = yosh >= 18 && parol === 'Web2026';
  document.getElementById('turi').textContent = yosh < 7 || yosh >= 65 ? 'imtiyozli' : 'oddiy';
};`,
  ),

  'if-else': app(
    BODY08.ifElse,
    `function baho(ball) {
  if (isNaN(ball) || ball < 0 || ball > 100) return 'Noto‘g‘ri ball';
  if (ball >= 86) return '5 (a’lo)';
  if (ball >= 71) return '4 (yaxshi)';
  if (ball >= 56) return '3 (qoniqarli)';
  return '2 (qoniqarsiz)';
}

document.getElementById('baholash').onclick = function () {
  const matn = document.getElementById('ball').value.trim();
  const ball = matn === '' ? NaN : Number(matn);
  document.getElementById('baho').textContent = baho(ball);
};`,
  ),

  switch: app(
    BODY08.switch,
    `function hisobla(a, amal, b) {
  switch (amal) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) return 'Nolga bo‘lib bo‘lmaydi';
      return a / b;
    default:
      return 'Noma’lum amal';
  }
}

document.getElementById('hisobla').onclick = function () {
  const a = Number(document.getElementById('a').value);
  const b = Number(document.getElementById('b').value);
  const amal = document.getElementById('amal').value.trim();
  document.getElementById('natija').textContent = hisobla(a, amal, b);
};`,
  ),
};
