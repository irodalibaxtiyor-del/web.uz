import type { ProjectFile } from '@webdizayn/shared';
import { BODY01, INTRO_CSS, whereTo } from '../modules/01-intro';
import { app } from '../shared';

export const s01: Record<string, ProjectFile[]> = {
  intro: app(
    BODY01.intro,
    `document.getElementById('salom').onclick = function () {
  document.getElementById('xabar').textContent = 'Salom, JavaScript!';
};

document.getElementById('yoq').onclick = function () {
  const chiroq = document.getElementById('chiroq');
  chiroq.textContent = 'Yoniq';
  chiroq.style.backgroundColor = 'gold';
};`,
    { css: INTRO_CSS },
  ),

  'where-to': whereTo({
    head: '<script src="ilova.js" defer></script>',
    script: "document.getElementById('holat').textContent = 'Skript ishladi';",
  }),

  output: app(
    BODY01.output,
    `document.getElementById('yigindi').textContent = 125 + 375;
document.getElementById('muhim').innerHTML = '<strong>Muhim!</strong> Darsni oxirigacha o‘qing.';
document.getElementById('izoh').textContent = '<b>Bu teg emas</b>';

document.getElementById('hisob').onclick = function () {
  document.getElementById('jami').textContent = 'Jami: ' + 15000 * 3;
};

console.log('Tayyor');`,
  ),

  statements: app(
    BODY01.statements,
    `let narx = 12000;
let soni = 3;
let jami = narx * soni;

document.getElementById('narx').textContent = narx;
document.getElementById('soni').textContent = soni;
document.getElementById('jami').textContent = jami;

document.getElementById('bekor').onclick = function () {
  document.getElementById('holat').textContent = 'Bekor qilindi';
  document.getElementById('soni').textContent = '0';
};`,
  ),

  syntax: app(
    BODY01.syntax,
    `let ism = 'Ali';
let familiya = 'Valiyev';
let tugilganYil = 2006;

document.getElementById('toliq').textContent = ism + ' ' + familiya;
document.getElementById('yosh').textContent = 2026 - tugilganYil;`,
  ),

  comments: app(
    BODY01.comments,
    `/*
  Rang yozuvini o‘rnatadi va oxirida holatni “Tayyor” qiladi.
  Eskirgan qatorlar o‘chirilmagan, izohga aylantirilgan.
*/
document.getElementById('rang').textContent = 'qizil';
document.getElementById('rang').textContent = 'yashil';
// document.getElementById('rang').textContent = 'ko‘k';
// eskiFunksiya();
document.getElementById('holat').textContent = 'Tayyor';`,
  ),
};
