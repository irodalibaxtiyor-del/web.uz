import type { ProjectFile } from '@webdizayn/shared';
import { BAZA_ASYNC, BAZA_CB, BAZA_PROMISE, BODY14, SOXTA_FETCH } from '../modules/14-async';
import { app } from '../shared';

export const s14: Record<string, ProjectFile[]> = {
  timing: app(
    BODY14.timing,
    `const xabar = document.getElementById('xabar');
let taymer = null;

document.getElementById('yubor').onclick = function () {
  clearTimeout(taymer);
  xabar.textContent = 'Yuborilmoqda...';
  taymer = setTimeout(() => {
    xabar.textContent = 'Yuborildi';
  }, 500);
};

document.getElementById('bekor').onclick = function () {
  clearTimeout(taymer);
  xabar.textContent = 'Bekor qilindi';
};

document.getElementById('ortga').onclick = function () {
  const sanoq = document.getElementById('sanoq');
  let qolgan = 3;
  const id = setInterval(() => {
    if (qolgan > 0) {
      sanoq.textContent = qolgan;
      qolgan--;
    } else {
      sanoq.textContent = 'Boshlandi!';
      clearInterval(id);
    }
  }, 200);
};`,
  ),

  callbacks: app(
    BODY14.callbacks,
    `${BAZA_CB}

function qollash(sonlar, fn) {
  const natija = [];
  for (const son of sonlar) {
    natija.push(fn(son));
  }
  return natija;
}

document.getElementById('kvadrat').textContent = qollash([1, 2, 3, 4], (x) => x * x).join(', ');

document.getElementById('yukla').onclick = function () {
  const holat = document.getElementById('holat');
  holat.textContent = 'Yuklanmoqda...';
  malumotOl(Number(document.getElementById('id').value), function (xato, foydalanuvchi) {
    holat.textContent = '';
    if (xato) {
      document.getElementById('xato').textContent = xato.message;
      document.getElementById('natija').textContent = '';
      return;
    }
    document.getElementById('xato').textContent = '';
    document.getElementById('natija').textContent = foydalanuvchi.ism;
  });
};`,
  ),

  promises: app(
    BODY14.promises,
    `${BAZA_PROMISE}

function malumotOl(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (BAZA[id]) resolve(BAZA[id]);
      else reject(new Error('Topilmadi'));
    }, 300);
  });
}

document.getElementById('yukla').onclick = function () {
  const holat = document.getElementById('holat');
  holat.textContent = 'Yuklanmoqda...';
  malumotOl(Number(document.getElementById('id').value))
    .then((ism) => {
      document.getElementById('natija').textContent = ism;
      document.getElementById('xato').textContent = '';
    })
    .catch((xato) => {
      document.getElementById('natija').textContent = '';
      document.getElementById('xato').textContent = xato.message;
    })
    .finally(() => {
      holat.textContent = 'Tayyor';
    });
};

Promise.all([malumotOl(1), malumotOl(2)]).then((ismlar) => {
  document.getElementById('hammasi').textContent = ismlar.join(', ');
});`,
  ),

  'async-await': app(
    BODY14.asyncAwait,
    `${BAZA_ASYNC}

async function profilYukla(id) {
  const ism = await malumotOl(id);
  const kurslar = await kurslarOl(id);
  return \`\${ism}: \${kurslar.join(', ')}\`;
}

document.getElementById('yukla').onclick = async function () {
  const holat = document.getElementById('holat');
  const profil = document.getElementById('profil');
  const xato = document.getElementById('xato');
  holat.textContent = 'Yuklanmoqda...';
  try {
    profil.textContent = await profilYukla(Number(document.getElementById('id').value));
    xato.textContent = '';
  } catch (e) {
    profil.textContent = '';
    xato.textContent = e.message;
  } finally {
    holat.textContent = '';
  }
};`,
  ),

  fetch: app(
    BODY14.fetch,
    `${SOXTA_FETCH}

async function kurslarniYukla(url) {
  const javob = await soxtaFetch(url);
  if (!javob.ok) {
    throw new Error('HTTP ' + javob.status);
  }
  return javob.json();
}

document.getElementById('yukla').onclick = async function () {
  const holat = document.getElementById('holat');
  const royxat = document.getElementById('royxat');
  const xato = document.getElementById('xato');
  holat.textContent = 'Yuklanmoqda...';
  xato.textContent = '';
  try {
    const kurslar = await kurslarniYukla(document.getElementById('manzil').value);
    royxat.textContent = kurslar.map((k) => k.nom).join(', ');
  } catch (e) {
    royxat.textContent = '';
    xato.textContent = e.message;
  } finally {
    holat.textContent = '';
  }
};`,
  ),
};
