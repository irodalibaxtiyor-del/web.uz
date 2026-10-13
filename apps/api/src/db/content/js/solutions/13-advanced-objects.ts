import type { ProjectFile } from '@webdizayn/shared';
import { BODY13, MAHSULOT, TANISHTIR } from '../modules/13-advanced-objects';
import { app } from '../shared';

export const s13: Record<string, ProjectFile[]> = {
  'object-constructors': app(
    BODY13.constructors,
    `${MAHSULOT}

function mahsulotYarat(nom, narx) {
  return { nom, narx };
}

document.getElementById('yarat').onclick = function () {
  const nom = document.getElementById('nom').value;
  const narx = Number(document.getElementById('narx').value);
  const m = new Mahsulot(nom, narx);

  document.getElementById('natija').textContent = \`\${m.nom} — \${m.narx} so‘m\`;
  document.getElementById('konstruktor').textContent = m.constructor.name;
  document.getElementById('zavod').textContent = mahsulotYarat(nom, narx) instanceof Mahsulot;
};`,
  ),

  'object-prototypes': app(
    BODY13.prototypes,
    `${MAHSULOT}

Mahsulot.prototype.qqsBilan = function () {
  return Math.round(this.narx * 1.12);
};

Mahsulot.prototype.malumot = function () {
  return \`\${this.nom}: \${this.qqsBilan()} so‘m (QQS bilan)\`;
};

const non = new Mahsulot('Non', 4000);
const sut = new Mahsulot('Sut', 12000);
document.getElementById('umumiy').textContent = non.malumot === sut.malumot;
document.getElementById('oziniki').textContent = non.hasOwnProperty('malumot');

document.getElementById('yarat').onclick = function () {
  const m = new Mahsulot(
    document.getElementById('nom').value,
    Number(document.getElementById('narx').value),
  );
  document.getElementById('malumot').textContent = m.malumot();
};`,
  ),

  'object-accessors': app(
    BODY13.accessors,
    `const harorat = {
  _c: 0,

  get celsiy() {
    return this._c;
  },

  set celsiy(qiymat) {
    if (qiymat < -273.15) {
      throw new RangeError('Absolyut noldan past bo‘lmaydi');
    }
    this._c = qiymat;
  },

  get farengeyt() {
    return (this._c * 9) / 5 + 32;
  },

  set farengeyt(f) {
    this.celsiy = ((f - 32) * 5) / 9;
  },
};

function korsat() {
  document.getElementById('selsiy').textContent = harorat.celsiy;
  document.getElementById('farengeyt').textContent = harorat.farengeyt;
}

function ornat(fn) {
  const xato = document.getElementById('xato');
  try {
    fn();
    xato.textContent = '';
  } catch (e) {
    xato.textContent = e.message;
  }
  korsat();
}

document.getElementById('c-btn').onclick = function () {
  ornat(() => {
    harorat.celsiy = Number(document.getElementById('c').value);
  });
};

document.getElementById('f-btn').onclick = function () {
  ornat(() => {
    harorat.farengeyt = Number(document.getElementById('f').value);
  });
};

korsat();`,
  ),

  'object-protection': app(
    BODY13.protection,
    `'use strict';

const SOZLAMALAR = Object.freeze({ til: 'uz', mavzu: 'yorug‘' });
const profil = Object.seal({ ism: 'Ali', yosh: 20 });
const xabar = document.getElementById('xabar');

function korsat() {
  document.getElementById('til').textContent = SOZLAMALAR.til;
  document.getElementById('muzlatilgan').textContent = Object.isFrozen(SOZLAMALAR);
  document.getElementById('ism').textContent = profil.ism;
  document.getElementById('maydonlar').textContent = Object.keys(profil).length;
}

document.getElementById('ozgartir').onclick = function () {
  try {
    SOZLAMALAR.til = 'en';
  } catch {
    xabar.textContent = 'O‘zgartirib bo‘lmaydi';
  }
  korsat();
};

document.getElementById('ism-ozgartir').onclick = function () {
  profil.ism = document.getElementById('yangi-ism').value;
  korsat();
};

document.getElementById('qosh-maydon').onclick = function () {
  try {
    profil.telefon = '+998';
  } catch {
    xabar.textContent = 'Yangi maydon qo‘shib bo‘lmaydi';
  }
  korsat();
};

korsat();`,
  ),

  'call-apply-bind': app(
    BODY13.callApplyBind,
    `${TANISHTIR}

document.getElementById('call').textContent = tanishtir.call(ali, 'Salom', '!');
document.getElementById('apply').textContent = tanishtir.apply(madina, ['Assalomu alaykum', '.']);

const qqsQosh = foizQosh.bind(null, 0.12);

document.getElementById('hisobla').onclick = function () {
  document.getElementById('natija').textContent = qqsQosh(Number(document.getElementById('narx').value));
};`,
  ),

  closures: app(
    BODY13.closures,
    `function hisoblagichYasa(qadam) {
  let qiymat = 0;
  return {
    oshir() {
      qiymat += qadam;
      return qiymat;
    },
  };
}

function kopaytiruvchi(n) {
  return (x) => x * n;
}

const birlik = hisoblagichYasa(1);
const beshlik = hisoblagichYasa(5);
const ikkiBaravar = kopaytiruvchi(2);

document.getElementById('a-btn').onclick = function () {
  document.getElementById('a').textContent = birlik.oshir();
};

document.getElementById('b-btn').onclick = function () {
  document.getElementById('b').textContent = beshlik.oshir();
};

document.getElementById('ikki-btn').onclick = function () {
  document.getElementById('ikki').textContent = ikkiBaravar(Number(document.getElementById('son').value));
};`,
  ),
};
