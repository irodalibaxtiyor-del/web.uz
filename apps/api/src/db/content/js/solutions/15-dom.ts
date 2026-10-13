import type { ProjectFile } from '@webdizayn/shared';
import { ANIM_CSS, BODY15, CSS15 } from '../modules/15-dom';
import { app } from '../shared';

export const s15: Record<string, ProjectFile[]> = {
  'dom-intro': app(
    BODY15.intro,
    `const kurslar = document.querySelectorAll('li');
const birinchi = document.querySelector('li');

document.getElementById('sahifa-nomi').textContent = document.title;
document.querySelector('h1').textContent = \`Katalog (\${kurslar.length} ta kurs)\`;
document.getElementById('birinchi').textContent = birinchi.textContent;
document.getElementById('ota').textContent = birinchi.parentElement.tagName;`,
    { title: 'Kurslar katalogi' },
  ),

  'dom-methods': app(
    BODY15.methods,
    `document.getElementById('saqlash').onclick = function () {
  const karta = document.querySelector('.karta');
  karta.querySelector('.ism').textContent = document.getElementById('ism').value;
  document.getElementById('izoh-chiqish').textContent = document.getElementById('izoh').value;
};`,
  ),

  'dom-elements': app(
    BODY15.elements,
    `document.getElementById('jami').textContent = document.getElementsByTagName('li').length;

document.getElementById('filtr').onclick = function () {
  const daraja = document.getElementById('daraja').value.trim();
  const nomlar = [...document.querySelectorAll('.kurs')]
    .filter((li) => li.classList.contains(daraja))
    .map((li) => li.textContent);
  document.getElementById('topilgan').textContent = nomlar.length ? nomlar.join(', ') : 'Topilmadi';
};`,
  ),

  'dom-html': app(
    BODY15.html,
    `const havola = document.getElementById('havola');

function tanla() {
  havola.setAttribute('href', \`/kurslar/\${this.dataset.kurs}\`);
  havola.textContent = \`\${this.textContent} kursiga o‘tish\`;
  document.getElementById('narx').textContent = this.dataset.narx;
  document.getElementById('sotib-ol').disabled = false;
}

for (const tugma of document.querySelectorAll('.kurs')) {
  tugma.onclick = tanla;
}`,
  ),

  'dom-css': app(
    BODY15.css,
    `const tablar = document.querySelectorAll('.tab');

for (const tab of tablar) {
  tab.onclick = function () {
    for (const t of tablar) t.classList.remove('faol');
    this.classList.add('faol');
  };
}

const qiymat = document.getElementById('qiymat');
qiymat.oninput = function () {
  document.getElementById('chiziq').style.width = qiymat.value + '%';
  document.getElementById('foiz').textContent = qiymat.value + '%';
};`,
    { css: CSS15 },
  ),

  'dom-forms': app(
    BODY15.forms,
    `const forma = document.getElementById('forma');

function tekshir({ ism, email, parol, parol2 }) {
  if (!ism) return 'Ism kiriting';
  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return 'Email noto‘g‘ri';
  if (parol.length < 8) return 'Parol kamida 8 belgi';
  if (parol !== parol2) return 'Parollar mos emas';
  return null;
}

forma.addEventListener('submit', function (event) {
  event.preventDefault();
  const qiymatlar = {
    ism: forma.elements.ism.value.trim(),
    email: forma.elements.email.value.trim(),
    parol: forma.elements.parol.value,
    parol2: forma.elements.parol2.value,
  };
  const xato = tekshir(qiymatlar);
  document.getElementById('xato').textContent = xato ?? '';
  if (xato) return;

  document.getElementById('xabar').textContent = \`Xush kelibsiz, \${qiymatlar.ism}!\`;
  forma.reset();
});`,
  ),

  'dom-animations': app(
    BODY15.animations,
    `function harakatlantir(el, masofa, davomiylik, tugaganda) {
  const boshlanish = performance.now();

  function qadam(hozir) {
    const t = Math.min((hozir - boshlanish) / davomiylik, 1);
    el.style.left = Math.round(masofa * t) + 'px';
    if (t < 1) requestAnimationFrame(qadam);
    else tugaganda();
  }

  requestAnimationFrame(qadam);
}

document.getElementById('boshla').onclick = function () {
  harakatlantir(document.getElementById('quti'), 200, 500, () => {
    document.getElementById('holat').textContent = 'Tugadi';
  });
};

document.getElementById('korsat').onclick = function () {
  document.getElementById('panel').classList.toggle('korinadi');
};`,
    { css: ANIM_CSS },
  ),
};
