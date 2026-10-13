import type { ProjectFile } from '@webdizayn/shared';
import { BODY04 } from '../modules/04-strings';
import { app } from '../shared';

export const s04: Record<string, ProjectFile[]> = {
  strings: app(
    BODY04.strings,
    `document.getElementById('iqtibos').textContent = 'Ustoz: "Bilim — kuch" dedi.';

document.getElementById('tahlil').onclick = function () {
  const matn = document.getElementById('matn').value;
  document.getElementById('uzunlik').textContent = matn.length;
  document.getElementById('chetlar').textContent = matn[0] + '...' + matn.at(-1);
};`,
  ),

  'string-methods': app(
    BODY04.methods,
    `function chiroyli(soz) {
  const toza = soz.trim().toLowerCase();
  return toza[0].toUpperCase() + toza.slice(1);
}

document.getElementById('formatla').onclick = function () {
  const ism = document.getElementById('ism').value;
  const familiya = document.getElementById('familiya').value;
  const karta = document.getElementById('karta').value.trim();

  document.getElementById('toliq').textContent = chiroyli(ism) + ' ' + chiroyli(familiya);
  document.getElementById('login').textContent = (ism.trim() + '.' + familiya.trim()).toLowerCase();
  document.getElementById('yashirin').textContent = '**** **** **** ' + karta.slice(-4);
};`,
  ),

  'string-search': app(
    BODY04.search,
    `document.getElementById('tekshir').onclick = function () {
  const email = document.getElementById('email').value.trim();
  const tel = document.getElementById('tel').value.trim();
  const belgi = email.indexOf('@');

  document.getElementById('nom').textContent = email.slice(0, belgi);
  document.getElementById('domen').textContent = email.slice(belgi + 1);
  document.getElementById('uzmi').textContent = email.endsWith('.uz');
  document.getElementById('uzbek').textContent = tel.startsWith('+998');
};`,
  ),

  'string-templates': app(
    BODY04.templates,
    `document.getElementById('hisobla').onclick = function () {
  const mahsulot = document.getElementById('mahsulot').value;
  const narx = Number(document.getElementById('narx').value);
  const soni = Number(document.getElementById('soni').value);
  document.getElementById('chek').textContent = \`\${mahsulot} × \${soni} = \${narx * soni} so‘m\`;
};

const kurs = { nom: 'JavaScript', narx: 450000 };
document.getElementById('karta').innerHTML = \`
  <h3>\${kurs.nom}</h3>
  <p>\${kurs.narx} so‘m</p>
\`;`,
  ),
};
