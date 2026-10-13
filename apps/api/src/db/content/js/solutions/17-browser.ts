import type { ProjectFile } from '@webdizayn/shared';
import { BODY17 } from '../modules/17-browser';
import { app } from '../shared';

export const s17: Record<string, ProjectFile[]> = {
  'bom-window': app(
    BODY17.window,
    `const mobil = window.matchMedia('(max-width: 599px)');

function korsat() {
  document.getElementById('olcham').textContent = \`\${innerWidth}×\${innerHeight}\`;
  document.getElementById('turi').textContent = mobil.matches ? 'mobil' : 'kompyuter';
}

window.addEventListener('resize', korsat);
korsat();`,
  ),

  'bom-location': app(
    BODY17.location,
    `document.getElementById('tahlil').addEventListener('click', () => {
  const domen = document.getElementById('domen');
  const yol = document.getElementById('yol');
  const param = document.getElementById('param');
  const xato = document.getElementById('xato');
  try {
    const url = new URL(document.getElementById('url').value);
    domen.textContent = url.hostname;
    yol.textContent = url.pathname;
    param.textContent = url.searchParams.get('kurs') ?? 'yo‘q';
    xato.textContent = '';
  } catch {
    domen.textContent = '';
    yol.textContent = '';
    param.textContent = '';
    xato.textContent = 'Noto‘g‘ri URL';
  }
});

document.getElementById('yasa').addEventListener('click', () => {
  const url = new URL('https://webdizayn.uz/qidiruv');
  url.search = new URLSearchParams({
    q: document.getElementById('q').value,
    daraja: document.getElementById('daraja').value,
  });
  document.getElementById('havola').textContent = url.href;
});`,
  ),

  cookies: app(
    BODY17.cookies,
    `let zaxira = null; // cookie ishlamaydigan joyda (masalan, preview’da)

function cookieOl(nom) {
  try {
    for (const qism of document.cookie.split('; ')) {
      const [kalit, qiymat] = qism.split('=');
      if (kalit === nom) return decodeURIComponent(qiymat);
    }
    return null;
  } catch {
    return zaxira;
  }
}

function tilYoz(til) {
  zaxira = til;
  try {
    document.cookie = \`til=\${encodeURIComponent(til)}; max-age=31536000; path=/; SameSite=Lax\`;
  } catch {
    // cookie yo‘q — zaxirada qoladi
  }
}

function tilOchir() {
  zaxira = null;
  try {
    document.cookie = 'til=; max-age=0; path=/';
  } catch {
    // e’tiborsiz
  }
}

function korsat() {
  document.getElementById('joriy').textContent = cookieOl('til') ?? 'tanlanmagan';
  let xom = '';
  try {
    xom = document.cookie;
  } catch {
    xom = '(cookie mavjud emas)';
  }
  document.getElementById('xom').textContent = xom;
}

for (const tugma of document.querySelectorAll('.til')) {
  tugma.addEventListener('click', function () {
    tilYoz(this.dataset.til);
    korsat();
  });
}

document.getElementById('ochir').addEventListener('click', () => {
  tilOchir();
  korsat();
});

korsat();`,
  ),

  'web-storage': app(
    BODY17.storage,
    `const KALIT = 'eslatmalar';
let xotira = null;

function oqi() {
  try {
    return JSON.parse(localStorage.getItem(KALIT) ?? '[]');
  } catch {
    return xotira ?? [];
  }
}

function yoz(royxat) {
  xotira = royxat;
  try {
    localStorage.setItem(KALIT, JSON.stringify(royxat));
  } catch {
    // ombor yo‘q
  }
}

function chiz() {
  const ul = document.getElementById('royxat');
  ul.replaceChildren();
  for (const matn of oqi()) {
    const li = document.createElement('li');
    li.textContent = matn;
    ul.append(li);
  }
  let xom = null;
  try {
    xom = localStorage.getItem(KALIT);
  } catch {
    xom = null;
  }
  document.getElementById('saqlangan').textContent = xom ?? 'bo‘sh';
}

document.getElementById('qosh').addEventListener('click', () => {
  const maydon = document.getElementById('matn');
  const matn = maydon.value.trim();
  if (!matn) return;
  yoz([...oqi(), matn]);
  maydon.value = '';
  chiz();
});

document.getElementById('tozala').addEventListener('click', () => {
  xotira = [];
  try {
    localStorage.removeItem(KALIT);
  } catch {
    // ombor yo‘q
  }
  chiz();
});

chiz();`,
  ),

  'web-apis': app(
    BODY17.apis,
    `function xabarMatni(maydon) {
  const v = maydon.validity;
  if (v.valueMissing) return 'Maydon to‘ldirilmagan';
  if (v.typeMismatch) return 'Email formati noto‘g‘ri';
  if (v.rangeUnderflow) return 'Juda kichik';
  if (v.rangeOverflow) return 'Juda katta';
  return '';
}

document.getElementById('forma').addEventListener('submit', (event) => {
  event.preventDefault();
  const maydonlar = [document.getElementById('email'), document.getElementById('yosh')];
  const xato = maydonlar.map(xabarMatni).find(Boolean);
  document.getElementById('xabar').textContent = xato ?? 'Hammasi to‘g‘ri';
});

const DOLLAR = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

document.getElementById('formatla').addEventListener('click', () => {
  document.getElementById('valyuta').textContent = DOLLAR.format(Number(document.getElementById('summa').value));
});`,
  ),
};
