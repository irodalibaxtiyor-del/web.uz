import type { ProjectFile } from '@webdizayn/shared';
import { BODY06 } from '../modules/06-layout';
import { site } from '../shared';

export const s06: Record<string, ProjectFile[]> = {
  display: site(
    BODY06.display,
    `nav a {
  display: block;
}

li.qator {
  display: inline;
}

.yopiq {
  display: none;
}

.joy {
  visibility: hidden;
}`,
  ),

  'max-width': site(
    BODY06.maxWidth,
    `body {
  margin: 0;
}

.konteyner {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 16px;
}

img {
  max-width: 100%;
  height: auto;
}`,
  ),

  position: site(
    BODY06.position,
    `.karta {
  position: relative;
  max-width: 300px;
  padding: 16px;
  border: 1px solid #dddddd;
}

.yorliq {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #fec400;
}

.yuqoriga {
  position: fixed;
  right: 16px;
  bottom: 16px;
}`,
  ),

  'z-index': site(
    BODY06.zIndex,
    `.sarlavha {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
}

.belgi {
  position: relative;
  z-index: 5;
}

.modal-fon {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
}`,
  ),

  overflow: site(
    BODY06.overflow,
    `.nom,
.kod {
  max-width: 300px;
}

.chat {
  height: 120px;
  overflow-y: auto;
}

.nom {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.kod {
  overflow-x: auto;
}`,
  ),

  float: site(
    BODY06.float,
    `body {
  margin: 0;
}

.maqola img {
  float: left;
  margin-right: 16px;
}

.iqtibos {
  float: right;
  width: 40%;
  margin: 0 0 0 16px;
}`,
  ),

  clear: site(
    BODY06.clear,
    `img {
  float: left;
  margin-right: 16px;
}

.quti {
  display: flow-root;
  border: 2px solid #0071dc;
}

.maqola h2 {
  clear: both;
}`,
  ),

  'inline-block': site(
    BODY06.inlineBlock,
    `nav a {
  display: inline-block;
  padding: 12px 16px;
}

.teg {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  background-color: #e6f1fc;
}

.karta {
  display: inline-block;
  width: 120px;
  padding: 8px;
  border: 1px solid #dddddd;
  vertical-align: top;
}`,
  ),

  align: site(
    BODY06.align,
    `body {
  margin: 0;
}

h1 {
  text-align: center;
}

.konteyner {
  max-width: 600px;
  margin: 0 auto;
}

.qahramon {
  display: grid;
  place-items: center;
  min-height: 200px;
}

.ota {
  position: relative;
  height: 200px;
  background-color: #f5faff;
}

.bola {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 50px;
  background-color: #0071dc;
  color: white;
}`,
  ),
};
