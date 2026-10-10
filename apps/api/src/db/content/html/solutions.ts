import type { ProjectFile } from '@webdizayn/shared';
import { files, html, page } from '../helpers';

/**
 * Reference solutions, keyed by lesson slug. Used only to verify the CHECK rules in a real
 * browser (`pnpm --filter @webdizayn/api content:verify html`); never seeded or sent to students.
 */
export const HTML_SOLUTIONS: Record<string, ProjectFile[]> = {
  introduction: html(
    page(`<h1>Salom, dunyo!</h1>
<p>Men veb-dizaynni o‘rganyapman.</p>`),
  ),

  basic: html(
    page(`<h1>Mening sahifam</h1>
<p>Bu mening birinchi sahifam.</p>
<a href="https://example.uz">Batafsil</a>
<img src="rasm.png" alt="Mening rasmim">
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>`),
  ),

  elements: html(
    page(`<h1>Kafe “Bahor”</h1>
<p>Bizda eng <strong>mazali</strong> somsa.</p>
<p>Toshkent sh.,<br>Chilonzor t.,<br>5-uy</p>`),
  ),

  attributes: html(
    page(`<p title="Har soatda yangilanadi">Bugungi ob-havo</p>
<a href="havo.html" title="Ob-havo sahifasi">Batafsil</a>
<img src="quyosh.png" alt="Quyoshli kun" width="64" height="64">`),
  ),

  headings: html(
    page(`<h1>Toshkent haqida</h1>
<h2>Tarixi</h2>
<p>Shahar ikki ming yildan ortiq tarixga ega.</p>
<hr>
<h2>Diqqatga sazovor joylar</h2>
<p>Amir Temur xiyoboni, Chorsu bozori va boshqalar.</p>`),
  ),

  paragraphs: html(
    page(`<h1>Bahor</h1>
<p>Kelding bahor, ochildi gul,<br>
Qushlar sayrar bog‘ ichra,<br>
Quyosh kulib boqadi,<br>
Yashil dalalar ichra.</p>

<pre>
   *
  ***
 *****
   |
</pre>`),
  ),

  styles: html(
    page(`<div class="karta" style="text-align: center; background-color: #f5faff;">
  <h2 style="color: #0071dc;">Ingliz tili kursi</h2>
  <p style="font-size: 18px;">Har dushanba va payshanba, soat 18:00 da.</p>
</div>`),
  ),

  formatting: html(
    page(`<h1>Mineral suv</h1>
<p>Narxi: <del>6 000 so‘m</del> <strong>4 500 so‘m</strong></p>
<p><mark>Faqat bugun!</mark></p>
<p>Tarkibi: H<sub>2</sub>O va foydali minerallar.</p>`),
  ),

  quotations: html(
    page(`<h1>Kitobxonlik haqida</h1>
<blockquote cite="https://example.uz/maqola">
  <p>Bilim — eng katta boylikdir. Kitob o‘qigan inson hech qachon yolg‘iz qolmaydi.</p>
</blockquote>
<p>Ustozimiz aytganidek, <q>Har kuni 20 bet o‘qing.</q></p>
<p>Bu sahifa <abbr title="HyperText Markup Language">HTML</abbr> yordamida yaratilgan.</p>
<address>Muallif: Kutubxona jamoasi, kitob@example.uz</address>`),
  ),

  comments: html(
    page(`<h1>Aksiyalar</h1>
<!-- Eski aksiya tugadi, kelgusi yil uchun saqlab qo‘yildi -->
<!-- <p class="eski-aksiya">Yozgi chegirma: 30%</p> -->
<p class="yangi-aksiya">Kuzgi chegirma: 20%</p>`),
  ),

  colors: html(
    page(
      `<h1>Ranglar bilan tanishuv</h1>
<p class="eslatma">Eslatma: kontrastli ranglar matnni o‘qishni osonlashtiradi.</p>`,
      {
        head: `<style>
  body { background-color: #f5faff; }
  h1 { color: rgb(0, 113, 220); }
  .eslatma { background-color: hsl(48, 100%, 50%); border: 2px solid #0e1133; }
</style>`,
      },
    ),
  ),

  css: files({
    'index.html': page(
      `<h1>Mening blogim</h1>
<p>Bugun CSS’ni o‘rganishni boshladim.</p>`,
      { head: '<link rel="stylesheet" href="style.css">' },
    ),
    'style.css': 'h1 {\n  color: #0071dc;\n}\n\np {\n  color: #333333;\n}\n',
  }),

  links: html(
    page(`<h1>Dizayn studiyasi</h1>
<nav>
  <a href="https://example.uz" target="_blank">Portfolio</a>
  <a href="mailto:salom@example.uz">Email</a>
  <a href="tel:+998710000000">Qo‘ng‘iroq</a>
  <a href="#aloqa">Aloqa</a>
</nav>
<p>Biz sayt va logotiplar yaratamiz.</p>
<section id="aloqa"><h2>Aloqa</h2><p>Toshkent sh.</p></section>`),
  ),

  images: html(
    page(`<h1>Samarqand</h1>
<figure>
  <img src="registon.jpg" alt="Registon maydonidagi uchta madrasa" width="600" height="400">
  <figcaption>Registon maydoni, Samarqand.</figcaption>
</figure>`),
  ),

  project: files({
    'index.html': page(
      `<h1>Aziza Karimova</h1>
<img src="men.jpg" alt="Aziza Karimova surati" width="160" height="160">
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>Figma</li>
</ul>
<p><a href="mailto:aziza@example.uz">aziza@example.uz</a></p>`,
      { title: 'Vizitka', head: '<link rel="stylesheet" href="css/style.css">' },
    ),
    'css/style.css': 'h1 {\n  color: #0071dc;\n}\n',
  }),

  favicon: html(page('<h1>Kafe “Bahor”</h1>', { head: '<link rel="icon" href="favicon.png">' })),

  'page-title': html(
    page(
      `<h1>Menyu</h1>
<ul>
  <li>Palov</li>
  <li>Lag‘mon</li>
  <li>Ko‘k choy</li>
</ul>`,
      { title: 'Bahor choyxonasi — Menyu' },
    ),
  ),

  tables: html(
    page(`<h1>Haftalik jadval</h1>
<table>
  <caption>Dars jadvali</caption>
  <thead>
    <tr><th scope="col">Kun</th><th scope="col">Fan</th><th scope="col">Vaqt</th></tr>
  </thead>
  <tbody>
    <tr><td>Dushanba</td><td>HTML</td><td>10:00</td></tr>
    <tr><td>Chorshanba</td><td>CSS</td><td>10:00</td></tr>
    <tr><td>Juma</td><td>JavaScript</td><td>12:00</td></tr>
  </tbody>
</table>`),
  ),

  lists: html(
    page(`<h1>Palov</h1>
<ul>
  <li>Guruch</li>
  <li>Sabzi</li>
  <li>Go‘sht</li>
  <li>Ziravorlar
    <ul>
      <li>Zira</li>
      <li>Qora murch</li>
    </ul>
  </li>
</ul>
<ol>
  <li>Go‘shtni qovuring.</li>
  <li>Sabzini qo‘shing.</li>
  <li>Guruchni soling va dimlang.</li>
</ol>
<dl>
  <dt>Zirvak</dt>
  <dd>Palovning guruchdan oldingi qismi.</dd>
</dl>`),
  ),

  'block-inline': html(
    page(
      `<nav>
  <ul>
    <li>Bosh sahifa</li>
    <li>Kurslar</li>
    <li>Aloqa</li>
  </ul>
</nav>
<p>Bu oy <span class="belgi">yangi</span> kurslar qo‘shildi.</p>`,
      {
        head: '<style>\n  .belgi { color: crimson; }\n  nav li { display: inline-block; }\n</style>',
      },
    ),
  ),

  div: html(
    page(
      `<div class="qator">
  <div class="karta"><h3>HTML</h3><p>Sahifa tuzilmasi</p></div>
  <div class="karta"><h3>CSS</h3><p>Sahifa bezagi</p></div>
  <div class="karta"><h3>JavaScript</h3><p>Sahifa harakati</p></div>
</div>`,
      {
        head: '<style>\n  .qator { display: flex; gap: 16px; }\n  .karta { max-width: 250px; }\n</style>',
      },
    ),
  ),

  classes: html(
    page(
      `<h2 class="muhim">Imtihon haqida</h2>
<p>Imtihon 15-iyun kuni bo‘ladi.</p>
<p>O‘zingiz bilan <span class="muhim katta">pasport</span> olib keling.</p>
<p class="muhim">Kechikkanlar kiritilmaydi.</p>`,
      { head: '<style>\n  .muhim { color: crimson; }\n  .katta { font-size: 24px; }\n</style>' },
    ),
  ),

  id: html(
    page(`<a href="#narxlar">Narxlarga o‘tish</a>
<h2>Biz haqimizda</h2>
<p>Biz 2015-yildan beri ishlaymiz.</p>
<h2 id="narxlar">Narxlar</h2>
<p>Oylik obuna: 99 000 so‘m.</p>
<label for="ism">Ism</label>
<input type="text" id="ism">`),
  ),

  buttons: html(
    page(`<h1>Tugmalar</h1>
<p id="natija">Tugmani bosing</p>
<button type="button" id="salom" onclick="document.getElementById('natija').textContent = 'Salom!'">Salomlash</button>
<button type="button" disabled>Tez kunda</button>`),
  ),

  iframes: html(
    page(`<h1>Ofisimiz</h1>
<iframe src="https://example.uz/xarita" title="Ofis joylashgan xarita" width="600" height="400" loading="lazy" sandbox></iframe>`),
  ),

  javascript: files({
    'index.html': page(
      `<h1>Skriptlar</h1>
<p id="xabar">...</p>`,
      { head: '<script src="app.js" defer></script>' },
    ),
    'app.js': "document.getElementById('xabar').textContent = 'JavaScript ishlayapti';\n",
  }),

  'file-paths': files({
    'index.html': page(
      '<h1>Bosh sahifa</h1>\n<p>Xush kelibsiz!</p>\n<a href="sahifalar/aloqa.html">Aloqa</a>',
      { head: '<link rel="stylesheet" href="css/style.css">' },
    ),
    'css/style.css': 'h1 {\n  color: #0071dc;\n}\n',
    'sahifalar/aloqa.html': page(
      '<h1>Aloqa</h1>\n<p>Telefon: +998 71 000 00 00</p>\n<a href="../index.html">Bosh sahifa</a>',
      { head: '<link rel="stylesheet" href="../css/style.css">' },
    ),
  }),

  head: html(
    page('<h1>Bahor choyxonasi</h1>', {
      title: 'Bahor choyxonasi',
      head: `<meta name="description" content="Toshkentdagi milliy taomlar choyxonasi.">
<meta property="og:title" content="Bahor choyxonasi">`,
    }),
  ),

  layout: html(
    page(`<header><h1>Yangiliklar</h1></header>
<nav><a href="#">Bosh sahifa</a> | <a href="#">Sport</a></nav>
<main>
  <h2>Bugungi asosiy yangilik</h2>
  <p>Toshkentda yangi bog‘ ochildi.</p>
</main>
<aside><p>Ob-havo: +24°C</p></aside>
<footer><p>© 2026 Yangiliklar</p></footer>`),
  ),

  responsive: html(
    page(
      `<div class="ustunlar">
  <section><h2>Kurslar</h2><p>60 dan ortiq dars.</p></section>
  <section><h2>Mashqlar</h2><p>Har darsda amaliyot.</p></section>
  <section><h2>Testlar</h2><p>Bilimingizni sinang.</p></section>
</div>
<img src="banner.png" alt="Kurs banneri" width="1200" height="300">`,
      {
        head: `<style>
  .ustunlar { display: flex; gap: 16px; }
  img { max-width: 100%; height: auto; }
  @media (max-width: 600px) {
    .ustunlar { flex-direction: column; }
  }
</style>`,
      },
    ),
  ),

  computercode: html(
    page(`<h1>Faylni saqlash</h1>
<p>Saqlash uchun <kbd>Ctrl</kbd> + <kbd>S</kbd> ni bosing.</p>
<pre><code>console.log("Saqlandi");</code></pre>
<p>Natija: <samp>Saqlandi</samp></p>`),
  ),

  semantics: html(
    page(`<article>
  <h2>HTML’ni qanday o‘rgandim</h2>
  <section><p>Avval teglar bilan tanishdim.</p></section>
  <section><p>Keyin kichik loyihalar qildim.</p></section>
</article>
<h3>Ko‘p so‘raladigan savollar</h3>
<details>
  <summary>Kurs qancha davom etadi?</summary>
  <p>Taxminan 2 oy.</p>
</details>`),
  ),

  'style-guide': html(`<!DOCTYPE html>
<html lang="uz">
  <head>
    <meta charset="UTF-8">
    <title>Galereya</title>
  </head>
  <body>
    <h1>Galereya</h1>
    <img src="tog.jpg" alt="Qor bilan qoplangan Chimyon tog‘lari" width="800" height="533">
    <p>Chimyon tog‘lari, qishda.</p>
  </body>
</html>
`),

  entities: html(
    page(`<p id="teg">Sarlavha uchun &lt;h1&gt; tegi ishlatiladi.</p>
<p id="taqqos">Masalan: 5 &lt; 10</p>
<footer>&copy; 2026 Webdizayn</footer>`),
  ),

  symbols: html(
    page(`<p id="formula">Aylana yuzi: &pi; · r²; yig‘indi belgisi: &sum;</p>
<p id="yonalish">Toshkent &rarr; Samarqand</p>
<p id="narx">Narxi: 10 &euro;</p>`),
  ),

  emojis: html(
    page(`<h1>Startap kuni &#128640;</h1>
<p>Barcha ishtirokchilarga <span role="img" aria-label="yurak">❤</span> bilan rahmat!</p>`),
  ),

  forms: html(
    page(`<h1>Kursga yozilish</h1>
<form>
  <label for="ism">Ism</label>
  <input type="text" id="ism" name="ism">
  <label for="email">Email</label>
  <input type="email" id="email" name="email">
  <button type="submit">Yuborish</button>
</form>`),
  ),

  'form-attributes': html(
    page(`<form action="/royxat" method="post" autocomplete="off">
  <label for="kod">Promo-kod</label>
  <input id="kod" name="kod">
  <button type="submit">Yuborish</button>
</form>`),
  ),

  'form-elements': html(
    page(`<h1>Pitsa buyurtmasi</h1>
<form>
  <label for="olcham">O‘lcham</label>
  <select id="olcham" name="olcham">
    <option>Kichik</option>
    <option>O‘rta</option>
    <option>Katta</option>
  </select>
  <fieldset>
    <legend>Yetkazish</legend>
    <label for="shahar">Shahar</label>
    <input id="shahar" name="shahar" list="shaharlar">
    <datalist id="shaharlar">
      <option value="Toshkent">
      <option value="Samarqand">
      <option value="Buxoro">
    </datalist>
  </fieldset>
  <label for="izoh">Izoh</label>
  <textarea id="izoh" name="izoh" rows="3"></textarea>
</form>`),
  ),

  'input-types': html(
    page(`<h1>Anketa</h1>
<form>
  <label for="tel">Telefon</label> <input type="tel" id="tel" name="tel">
  <label for="yosh">Yosh</label> <input type="number" id="yosh" name="yosh">
  <label for="sana">Tug‘ilgan sana</label> <input type="date" id="sana" name="sana">
  <label for="rang">Sevimli rang</label> <input type="color" id="rang" name="rang">
  <input type="radio" id="erkak" name="jins" value="erkak"> <label for="erkak">Erkak</label>
  <input type="radio" id="ayol" name="jins" value="ayol"> <label for="ayol">Ayol</label>
  <input type="checkbox" id="obuna" name="obuna"> <label for="obuna">Yangiliklarga obuna</label>
</form>`),
  ),

  'input-attributes': html(
    page(`<form>
  <label for="ism">Ism</label>
  <input id="ism" name="ism" required placeholder="Masalan, Aziza" maxlength="30">
  <label for="yosh">Yosh</label>
  <input id="yosh" name="yosh" type="number" min="7" max="99">
  <label for="kod">SMS kod</label>
  <input id="kod" name="kod" pattern="[0-9]{4}">
  <button type="submit">Yuborish</button>
</form>`),
  ),

  'input-form-attributes': html(
    page(`<form id="anketa" action="/yuborish" method="post">
  <label for="mavzu">Mavzu</label>
  <input id="mavzu" name="mavzu" required>
  <button type="submit">Yuborish</button>
  <button type="submit" formaction="/qoralama" formnovalidate>Qoralama</button>
</form>

<label for="izoh">Izoh</label>
<textarea id="izoh" name="izoh" form="anketa"></textarea>`),
  ),

  canvas: html(
    page(`<h1>Chizma</h1>
<canvas id="mato" width="300" height="150" aria-label="Ko‘k to‘rtburchak va sariq aylana"></canvas>
<script>
  const ctx = document.getElementById('mato').getContext('2d');
  ctx.fillStyle = '#0071dc';
  ctx.fillRect(20, 20, 120, 80);
  ctx.beginPath();
  ctx.arc(220, 75, 40, 0, 2 * Math.PI);
  ctx.fillStyle = '#fec400';
  ctx.fill();
</script>`),
  ),

  svg: html(
    page(`<h1>Logotip</h1>
<svg viewBox="0 0 120 120" width="120" height="120" role="img" aria-label="Ko‘k kvadrat ichida sariq doira">
  <rect x="10" y="10" width="100" height="100" rx="16" fill="#0071dc"></rect>
  <circle cx="60" cy="60" r="30" fill="#fec400"></circle>
</svg>`),
  ),

  video: html(
    page(`<h1>Dars videosi</h1>
<video controls poster="muqova.jpg" width="480" height="270">
  <source src="dars.mp4" type="video/mp4">
  <source src="dars.webm" type="video/webm">
  <track src="dars-uz.vtt" kind="subtitles" srclang="uz" label="O‘zbekcha" default>
</video>`),
  ),

  audio: html(
    page(`<h2>3-qism: Veb-dizayn tarixi</h2>
<audio controls preload="metadata">
  <source src="podkast-3.mp3" type="audio/mpeg">
</audio>
<p><a href="podkast-3.mp3" download>Yuklab olish</a></p>`),
  ),

  youtube: html(
    page(`<h1>Dars videosi</h1>
<iframe src="https://www.youtube.com/embed/abc123?mute=1" title="HTML darsi" width="560" height="315" allowfullscreen></iframe>`),
  ),

  'drag-drop': html(
    page(
      `<div class="ustun" id="rejada">
  <h2>Rejada</h2>
  <p class="vazifa" id="v1" draggable="true">HTML darsini o‘qish</p>
  <p class="vazifa" id="v2" draggable="true">Mashqni bajarish</p>
</div>
<div class="ustun" id="bajarildi">
  <h2>Bajarildi</h2>
</div>
<script>
  document.querySelectorAll('.vazifa').forEach((v) => {
    v.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', v.id));
  });
  const quti = document.getElementById('bajarildi');
  quti.addEventListener('dragover', (e) => e.preventDefault());
  quti.addEventListener('drop', (e) => {
    e.preventDefault();
    quti.appendChild(document.getElementById(e.dataTransfer.getData('text/plain')));
  });
</script>`,
      {
        head: '<style>\n  .ustun { min-height: 120px; border: 2px dashed #0071dc; padding: 8px; margin: 8px 0; }\n</style>',
      },
    ),
  ),

  popover: html(
    page(`<label for="parol">Parol</label>
<input id="parol" type="password">
<button type="button" popovertarget="yordam">Yordam</button>

<div id="yordam" popover>
  <p>Parol kamida 8 belgidan iborat bo‘lsin.</p>
  <button type="button" popovertarget="yordam" popovertargetaction="hide">Yopish</button>
</div>`),
  ),
};
