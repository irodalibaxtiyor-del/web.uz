import type { ProjectFile } from '@webdizayn/shared';
import { site } from '../shared';

export const s03: Record<string, ProjectFile[]> = {
  borders: site(
    `<div class="karta">Kurs kartochkasi</div>
<p class="eslatma">Ertaga dars soat 10:00 da.</p>
<p class="xato">Parol noto‘g‘ri.</p>`,
    `.karta {
  border: 2px solid #0071dc;
}

.eslatma {
  border: 2px dashed #999999;
}

.xato {
  color: crimson;
  border: 2px solid;
}`,
  ),

  'border-sides': site(
    `<blockquote>Bilim — eng katta boylik.</blockquote>
<div class="tab">Faol tab</div>
<div class="quti">Quti</div>`,
    `blockquote {
  border-left: 4px solid #0071dc;
}

.tab {
  border: 1px solid #cccccc;
  border-bottom: none;
}

.quti {
  border-style: solid;
  border-width: 1px 4px;
}`,
  ),

  'rounded-borders': site(
    `<div class="karta">
  <div class="avatar"></div>
  <p>Aziza Karimova</p>
</div>
<div class="yorliq">Yangi</div>`,
    `.karta {
  padding: 16px;
  border: 1px solid #dddddd;
  border-radius: 12px;
}

.avatar {
  width: 64px;
  height: 64px;
  background-color: #0071dc;
  border-radius: 50%;
}

.yorliq {
  display: inline-block;
  padding: 4px 12px;
  background-color: #fec400;
  border-radius: 12px 12px 0 0;
}`,
  ),

  margins: site(
    `<div class="konteyner">
  <h2>Bo‘lim</h2>
  <p>Konteyner sahifa markazida bo‘lishi kerak.</p>
</div>`,
    `body {
  margin: 0;
}

.konteyner {
  max-width: 600px;
  margin: 0 auto;
  background-color: #f5faff;
}

h2 {
  margin-top: 32px;
  margin-bottom: 8px;
}`,
  ),

  'margin-collapse': site(
    `<div class="karta">
  <h2>Margin collapse</h2>
  <p>Birinchi paragraf.</p>
  <p>Ikkinchi paragraf.</p>
</div>`,
    `.karta {
  display: flow-root;
  background-color: #f5faff;
}

.karta h2 {
  margin-top: 40px;
}

p {
  margin-top: 0;
  margin-bottom: 16px;
}`,
  ),

  padding: site(
    `<a class="tugma" href="#">Yuborish</a>
<div class="quti">Bu quti ekranda 300px bo‘lishi kerak.</div>`,
    `.tugma {
  display: inline-block;
  padding: 12px 24px;
  background-color: #0071dc;
  color: white;
}

.quti {
  box-sizing: border-box;
  width: 300px;
  padding: 20px;
  margin-top: 16px;
  background-color: #f5faff;
}`,
  ),

  'height-width': site(
    `<section class="hero"><h1>O‘lchamlar</h1></section>
<article class="maqola"><p>Uzun maqola matni shu yerda bo‘ladi.</p></article>`,
    `body {
  margin: 0;
}

.hero {
  min-height: 300px;
  background-color: #0e1133;
  color: white;
}

.maqola {
  max-width: 720px;
  margin: 0 auto;
}`,
  ),

  'box-model': site(
    '<div class="quti">Quti modeli</div>',
    `* {
  box-sizing: border-box;
}

.quti {
  width: 300px;
  padding: 20px;
  border: 5px solid #0071dc;
  margin: 10px;
}`,
  ),

  outline: site(
    `<nav><a href="#kurslar">Kurslar</a> <a href="#aloqa">Aloqa</a></nav>
<div class="tanlangan">Tanlangan kartochka</div>`,
    `a:focus-visible {
  outline: 3px solid #0071dc;
  outline-offset: 2px;
}

.tanlangan {
  outline: 3px dashed #fec400;
}`,
  ),
};
