import type { ProjectFile } from '@webdizayn/shared';
import { BODY16, LISTENER_CSS, LISTENER_HELPER } from '../modules/16-dom-events';
import { app } from '../shared';

export const s16: Record<string, ProjectFile[]> = {
  'dom-events': app(
    BODY16.events,
    `for (const li of document.querySelectorAll('#royxat li')) {
  li.addEventListener('click', function () {
    this.classList.toggle('tanlangan');
  });
}

for (const tugma of document.querySelectorAll('.ochir')) {
  tugma.addEventListener('click', function (event) {
    event.stopPropagation();
    const nom = this.closest('li').querySelector('span').textContent;
    document.getElementById('oxirgi').textContent = 'O‘chirish: ' + nom;
  });
}

document.getElementById('havola').addEventListener('click', function (event) {
  event.preventDefault();
  document.getElementById('xabar').textContent = 'Havola bloklandi';
});`,
    { css: '.tanlangan { background-color: #eef6ff; }' },
  ),

  'dom-event-listener': app(
    BODY16.listener,
    `${LISTENER_HELPER}

document.getElementById('vazifalar').addEventListener('click', function (event) {
  const tugma = event.target.closest('.bajarildi');
  if (!tugma) return;
  tugma.closest('li').classList.toggle('tugagan');
});

let sanoq = 0;
document.getElementById('bir-marta').addEventListener(
  'click',
  () => {
    sanoq++;
    document.getElementById('sanoq').textContent = sanoq;
  },
  { once: true },
);

const log = document.getElementById('log');
const ikki = document.getElementById('ikki');
ikki.addEventListener('click', () => {
  log.textContent = 'A';
});
ikki.addEventListener('click', () => {
  log.textContent += ' B';
});`,
    { css: LISTENER_CSS },
  ),

  'dom-navigation': app(
    BODY16.navigation,
    `const kartalar = document.getElementById('kartalar');

function soniniKorsat() {
  document.getElementById('soni').textContent = kartalar.children.length;
}

for (const savol of document.querySelectorAll('.savol')) {
  savol.addEventListener('click', function () {
    const javob = this.nextElementSibling;
    javob.hidden = !javob.hidden;
    this.setAttribute('aria-expanded', String(!javob.hidden));
  });
}

for (const tugma of document.querySelectorAll('.karta .ochir')) {
  tugma.addEventListener('click', function () {
    this.closest('.karta').remove();
    soniniKorsat();
  });
}

soniniKorsat();`,
  ),

  'dom-nodes': app(
    BODY16.nodes,
    `const royxat = document.getElementById('royxat');

function soniniYangila() {
  document.getElementById('soni').textContent = royxat.children.length;
}

function vazifaQosh(matn) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = matn;

  const tugma = document.createElement('button');
  tugma.type = 'button';
  tugma.textContent = 'O‘chirish';
  tugma.addEventListener('click', () => {
    li.remove();
    soniniYangila();
  });

  li.append(span, ' ', tugma);
  royxat.append(li);
  soniniYangila();
}

document.getElementById('qosh').addEventListener('click', () => {
  const maydon = document.getElementById('matn');
  const matn = maydon.value.trim();
  if (!matn) return;
  vazifaQosh(matn);
  maydon.value = '';
});`,
  ),

  'dom-collections': app(
    BODY16.collections,
    `const jonli = document.getElementsByClassName('mahsulot');
const statik = document.querySelectorAll('.mahsulot');

function korsat() {
  document.getElementById('jonli').textContent = jonli.length;
  document.getElementById('statik').textContent = statik.length;
  document.getElementById('jami').textContent = Array.from(jonli).reduce(
    (s, el) => s + Number(el.dataset.narx),
    0,
  );
}

document.getElementById('qosh').addEventListener('click', () => {
  const li = document.createElement('li');
  li.className = 'mahsulot';
  li.dataset.narx = document.getElementById('narx').value;
  li.textContent = document.getElementById('nom').value;
  document.getElementById('savat').append(li);
  korsat();
});

korsat();`,
  ),
};
