import type { ProjectFile } from '@webdizayn/shared';
import { site } from '../shared';

export const s02: Record<string, ProjectFile[]> = {
  colors: site(
    `<p class="xabar">Buyurtmangiz qabul qilindi.</p>
<p class="xato">To‘lov amalga oshmadi.</p>
<a class="tugma" href="#">Qayta urinish</a>`,
    `.xabar {
  color: navy;
  background-color: whitesmoke;
}

.xato {
  border: 2px solid crimson;
}

.tugma {
  color: #0071dc;
  border: 2px solid currentcolor;
}`,
  ),

  rgb: site(
    `<h1 class="sarlavha">RGB</h1>
<p class="kulrang">Qizil, yashil va ko‘k yorug‘lik aralashmasi.</p>
<div class="qoplama">Shaffof qatlam</div>`,
    `.sarlavha {
  color: rgb(0, 113, 220);
}

.kulrang {
  color: rgb(128, 128, 128);
}

.qoplama {
  background-color: rgb(0 0 0 / 0.5);
}`,
  ),

  hex: site(
    `<h1>HEX ranglar</h1>
<p><span class="urgu">Muhim:</span> HEX — RGB’ning qisqa yozuvi.</p>
<div class="soya">Shaffof blok</div>`,
    `h1 {
  color: #0e1133;
}

.urgu {
  background-color: #fc0;
}

.soya {
  background-color: #00000080;
}`,
  ),

  hsl: site(
    `<div class="och">
  <h2 class="toq">HSL palitra</h2>
  <a class="asosiy" href="#">Asosiy tugma</a>
</div>`,
    `.asosiy {
  background-color: hsl(210, 100%, 43%);
}

.och {
  background-color: hsl(210, 100%, 95%);
}

.toq {
  color: hsl(210, 100%, 20%);
}`,
  ),

  backgrounds: site(
    `<h2>Fon rangi</h2>
<div class="qoplama">
  <p>Bu matn xira bo‘lmasligi kerak.</p>
</div>`,
    `body {
  background-color: #f5faff;
}

h2 {
  background-color: #0071dc;
  color: white;
}

.qoplama {
  padding: 16px;
  background-color: rgb(0 113 220 / 0.2);
}`,
  ),

  'background-image': site(
    `<section class="hero">
  <h1>Toshkent bo‘ylab sayohat</h1>
</section>
<div class="belgi">Yangi yo‘nalish</div>`,
    `.hero {
  min-height: 200px;
  color: white;
  background-color: #0e1133;
  background-image: linear-gradient(#0071dc, #0e1133);
  background-size: cover;
}

.belgi {
  padding: 16px 48px 16px 16px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Ccircle cx='12' cy='12' r='10' fill='%23fec400'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right top;
}`,
  ),

  'background-attachment': site(
    `<section class="parallaks"><h2>Parallaks</h2></section>
<ul class="royxat">
  <li>Andijon</li><li>Buxoro</li><li>Farg‘ona</li><li>Jizzax</li>
  <li>Namangan</li><li>Navoiy</li><li>Qarshi</li><li>Samarqand</li>
</ul>`,
    `.parallaks {
  min-height: 300px;
  background-image: linear-gradient(135deg, #0071dc, #0e1133);
  background-attachment: fixed;
  color: white;
}

.royxat {
  height: 120px;
  overflow: auto;
  background-image: linear-gradient(white, #dbeafe);
  background-attachment: local;
}`,
  ),

  'background-shorthand': site(
    '<section class="hero"><h1>Qisqa yozuv</h1></section>\n<section class="banner"><h2>Qatlamlar</h2></section>',
    `.hero {
  min-height: 160px;
  color: white;
  background: #0e1133 linear-gradient(#0071dc, #0e1133) no-repeat;
}

.banner {
  min-height: 120px;
  color: white;
  background:
    linear-gradient(rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.5)),
    linear-gradient(90deg, #0071dc, #fec400);
}`,
  ),
};
