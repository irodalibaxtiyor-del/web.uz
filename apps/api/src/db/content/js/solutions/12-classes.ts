import type { ProjectFile } from '@webdizayn/shared';
import { BODY12, HISOB } from '../modules/12-classes';
import { app } from '../shared';

export const s12: Record<string, ProjectFile[]> = {
  classes: app(
    BODY12.classes,
    `class Talaba {
  constructor(ism, ball) {
    this.ism = ism;
    this.ball = ball;
  }

  baho() {
    return this.ball >= 60 ? 'o‘tdi' : 'o‘tmadi';
  }

  malumot() {
    return \`\${this.ism}: \${this.ball} ball (\${this.baho()})\`;
  }
}

const talabalar = [];

document.getElementById('yarat').onclick = function () {
  const t = new Talaba(
    document.getElementById('ism').value,
    Number(document.getElementById('ball').value),
  );
  talabalar.push(t);
  document.getElementById('karta').textContent = t.malumot();
  document.getElementById('soni').textContent = talabalar.length;
  document.getElementById('tekshir').textContent = talabalar[0] instanceof Talaba;
};`,
  ),

  'class-inheritance': app(
    BODY12.inheritance,
    `${HISOB}

class JamgarmaHisob extends Hisob {
  constructor(egasi, balans, foiz) {
    super(egasi, balans);
    this.foiz = foiz;
  }

  foizQosh() {
    this.balans += Math.round((this.balans * this.foiz) / 100);
  }

  malumot() {
    return \`\${super.malumot()} (\${this.foiz}%)\`;
  }
}

const jamgarma = new JamgarmaHisob('Dilnoza', 100000, 10);

function korsat() {
  document.getElementById('info').textContent = jamgarma.malumot();
}

document.getElementById('kirim').onclick = function () {
  jamgarma.kirim(Number(document.getElementById('summa').value));
  korsat();
};

document.getElementById('foiz').onclick = function () {
  jamgarma.foizQosh();
  korsat();
};

korsat();`,
  ),

  'class-static': app(
    BODY12.static,
    `class Buyurtma {
  static #oxirgi = 0;

  static formatla(raqam) {
    return 'B-' + String(raqam).padStart(4, '0');
  }

  static soni() {
    return Buyurtma.#oxirgi;
  }

  constructor(mahsulot) {
    Buyurtma.#oxirgi++;
    this.raqam = Buyurtma.formatla(Buyurtma.#oxirgi);
    this.mahsulot = mahsulot;
  }
}

document.getElementById('format').textContent = Buyurtma.formatla(42);

document.getElementById('yarat').onclick = function () {
  const b = new Buyurtma(document.getElementById('mahsulot').value);
  document.getElementById('oxirgi').textContent = \`\${b.raqam}: \${b.mahsulot}\`;
  document.getElementById('soni').textContent = Buyurtma.soni();
};`,
  ),

  json: app(
    BODY12.json,
    `document.getElementById('oqish').onclick = function () {
  const natija = document.getElementById('natija');
  const ixcham = document.getElementById('ixcham');
  const xato = document.getElementById('xato');

  try {
    const obj = JSON.parse(document.getElementById('json').value);
    natija.textContent = \`\${obj.ism}, \${obj.kurslar.length} ta kurs\`;
    ixcham.textContent = JSON.stringify(obj);
    xato.textContent = '';
  } catch {
    natija.textContent = '';
    ixcham.textContent = '';
    xato.textContent = 'Noto‘g‘ri JSON';
  }
};`,
  ),
};
