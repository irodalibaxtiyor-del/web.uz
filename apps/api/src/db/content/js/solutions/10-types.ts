import type { ProjectFile } from '@webdizayn/shared';
import { BODY10, PROFILE, SAMPLES } from '../modules/10-types';
import { app } from '../shared';

export const s10: Record<string, ProjectFile[]> = {
  sets: app(
    BODY10.sets,
    `function teglar(matn) {
  const natija = new Set();
  for (const qism of matn.split(',')) {
    const teg = qism.trim().toLowerCase();
    if (teg) natija.add(teg);
  }
  return natija;
}

document.getElementById('hisobla').onclick = function () {
  const noyob = teglar(document.getElementById('teglar').value);
  document.getElementById('noyob').textContent = [...noyob].join(', ');
  document.getElementById('soni').textContent = noyob.size;

  const a = teglar(document.getElementById('a').value);
  const b = teglar(document.getElementById('b').value);
  const umumiy = [...a].filter(function (x) {
    return b.has(x);
  });
  document.getElementById('umumiy').textContent = umumiy.join(', ');
};`,
  ),

  maps: app(
    BODY10.maps,
    `document.getElementById('sana').onclick = function () {
  const sozlar = document.getElementById('matn').value.toLowerCase().split(/\\s+/);
  const sanoq = new Map();
  for (const soz of sozlar) {
    if (!soz) continue;
    sanoq.set(soz, (sanoq.get(soz) ?? 0) + 1);
  }

  let engKop = '';
  let eng = 0;
  for (const [soz, soni] of sanoq) {
    if (soni > eng) {
      engKop = soz;
      eng = soni;
    }
  }

  document.getElementById('eng-kop').textContent = \`\${engKop} (\${eng})\`;
  document.getElementById('turli').textContent = sanoq.size;
};`,
  ),

  typeof: app(
    BODY10.typeof,
    `${SAMPLES}

function turi(x) {
  if (x === null) return 'null';
  if (Array.isArray(x)) return 'array';
  return typeof x;
}

function kiritmaTuri(value) {
  if (value.trim() === '') return 'bo‘sh';
  if (!isNaN(value)) return 'son';
  return 'matn';
}

document.getElementById('natijalar').textContent = NAMUNALAR.map(turi).join(', ');

document.getElementById('aniqla').onclick = function () {
  const value = document.getElementById('kiritma').value;
  document.getElementById('kiritma-turi').textContent = kiritmaTuri(value);
};`,
  ),

  'type-conversion': app(
    BODY10.conversion,
    `document.getElementById('tozala').onclick = function () {
  const matn = document.getElementById('narx').value;
  const toza = parseInt(matn.replaceAll(' ', ''));
  document.getElementById('toza').textContent = toza;
  document.getElementById('qqs').textContent = Math.round(toza * 1.12);
};`,
  ),

  destructuring: app(
    BODY10.destructuring,
    `${PROFILE}

const {
  ism,
  familiya,
  manzil: { shahar },
  telefon = 'ko‘rsatilmagan',
} = foydalanuvchi;
const [asosiy, ...qolgan] = foydalanuvchi.tillar;

document.getElementById('toliq').textContent = \`\${ism} \${familiya}\`;
document.getElementById('manzil').textContent = \`\${shahar}, \${telefon}\`;
document.getElementById('qolgan').textContent = qolgan.join(', ');
console.log('Asosiy til:', asosiy);

document.getElementById('almashtir').onclick = function () {
  let a = document.getElementById('x').value;
  let b = document.getElementById('y').value;
  [a, b] = [b, a];
  document.getElementById('natija').textContent = \`\${a} \${b}\`;
};`,
  ),

  regexp: app(
    BODY10.regexp,
    `const TEL = /^\\+998 \\d{2} \\d{3} \\d{2} \\d{2}$/;

document.getElementById('tekshir').onclick = function () {
  const tel = document.getElementById('tel').value;
  const matn = document.getElementById('matn').value;
  const bosh = document.getElementById('bosh').value;

  document.getElementById('tel-holat').textContent = TEL.test(tel);
  document.getElementById('raqamlar').textContent = (matn.match(/\\d+/g) ?? []).join(', ');
  document.getElementById('toza').textContent = bosh.replace(/\\s+/g, ' ').trim();
};`,
  ),
};
