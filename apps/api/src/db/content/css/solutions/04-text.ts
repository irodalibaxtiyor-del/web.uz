import type { ProjectFile } from '@webdizayn/shared';
import { site } from '../shared';

const SVG_HOME =
  '<svg class="ikonka" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3z" /></svg>';
const SVG_SEARCH =
  '<svg class="ikonka" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z" /></svg>';

export const s04: Record<string, ProjectFile[]> = {
  text: site(
    `<span class="yorliq">Maqola</span>
<h1>Yaxshi matn qanday bo‘ladi?</h1>
<p>Qatorlar orasida yetarli joy bo‘lsa, ko‘z charchamaydi va matn tez o‘qiladi.</p>
<p>Matn rangi fon bilan yaxshi kontrast hosil qilishi kerak.</p>`,
    `body {
  color: #0e1133;
}

h1 {
  text-align: center;
}

p {
  line-height: 1.6;
}

.yorliq {
  letter-spacing: 2px;
}`,
  ),

  'text-decoration': site(
    `<nav><a href="#">Kurslar</a> <a href="#">Narxlar</a></nav>
<div class="maqola">
  <p>Batafsil ma’lumot <a href="#">qo‘llanmada</a> berilgan.</p>
  <p>Narx: <span class="eski-narx">300 000</span> 240 000 so‘m</p>
</div>`,
    `nav a {
  text-decoration: none;
}

.maqola a {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.eski-narx {
  text-decoration: line-through;
}`,
  ),

  'text-transform': site(
    `<span class="yorliq">Yangi</span>
<h2>Veb dizayn asoslari kursi</h2>
<p>Narxi: <span class="narx">240 000 so‘m</span></p>
<p class="izoh">Manba: https://misol.uz/juda/uzun/manzil/bolib/blokdan/chiqib/ketadigan/havola</p>`,
    `.yorliq {
  text-transform: uppercase;
}

h2 {
  text-transform: none;
}

.narx {
  white-space: nowrap;
}

.izoh {
  width: 200px;
  overflow-wrap: break-word;
}`,
  ),

  'text-shadow': site(
    `<div class="banner"><h1>Yozgi intensiv kurs</h1></div>
<p class="neon">Ochiq</p>
<p>Ro‘yxatdan o‘tish 1-iyungacha davom etadi.</p>`,
    `.banner {
  padding: 40px;
  background: linear-gradient(135deg, #0071dc, #00b4d8);
  color: white;
}

.banner h1 {
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
}

.neon {
  padding: 12px;
  background-color: #0e1133;
  color: white;
  text-shadow: 0 0 8px #00e5ff;
}

p {
  text-shadow: none;
}`,
  ),

  fonts: site(
    `<h1>Shriftlar</h1>
<p>Kod namunasi: <code>color: red;</code></p>
<h2>Tugma</h2>
<button>Saqlash</button>`,
    `body {
  font-family: Arial, sans-serif;
}

h1,
h2 {
  font-family: Georgia, serif;
}

code {
  font-family: Consolas, "Courier New", monospace;
}

button {
  font-family: inherit;
}`,
  ),

  'font-style': site(
    `<h1>Kurs narxi</h1>
<p class="narx">240 000 so‘m</p>
<p class="izoh">Narxga barcha mashqlar kiradi.</p>
<p class="kod">Teg: <em>&lt;em&gt;</em></p>
<small>Chegirmalar alohida e’lon qilinadi.</small>`,
    `h1 {
  font-size: 2rem;
}

.narx {
  font-weight: 700;
}

.izoh {
  font-style: italic;
}

.kod em {
  font-style: normal;
}

small {
  font-size: 0.875rem;
}`,
  ),

  'web-fonts': site(
    `<h1>Veb-shriftlar</h1>
<p>Shriftga o‘zimiz nom beramiz.</p>`,
    `@font-face {
  font-family: "Sarlavha";
  src: local("Georgia");
  font-display: swap;
}

body {
  font-family: system-ui, sans-serif;
}

h1 {
  font-family: "Sarlavha", Georgia, serif;
}`,
  ),

  'font-shorthand': site(
    `<blockquote class="iqtibos">O‘qish — fikrlashni o‘rganish.</blockquote>
<input placeholder="Ismingiz">
<button>Yuborish</button>`,
    `body {
  font: 16px/1.5 Arial, sans-serif;
}

.iqtibos {
  font: italic 1.125rem/1.6 Georgia, serif;
}

button,
input {
  font: inherit;
}`,
  ),

  icons: site(
    `<a class="tugma" href="#">${SVG_HOME} Bosh sahifa</a>
<button class="qidiruv" aria-label="Qidirish">${SVG_SEARCH}</button>`,
    `.tugma {
  font-size: 16px;
  color: #0071dc;
  text-decoration: none;
}

.tugma:hover {
  color: #0e1133;
}

.ikonka {
  width: 1.25em;
  height: 1.25em;
  fill: currentColor;
  vertical-align: -0.2em;
}`,
  ),
};
