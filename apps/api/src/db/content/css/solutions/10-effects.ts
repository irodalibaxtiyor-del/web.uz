import type { ProjectFile } from '@webdizayn/shared';
import { BG_SIZE_CSS, BODY10, COLOR_KEYWORDS_CSS } from '../modules/10-effects';
import { site } from '../shared';

export const s10: Record<string, ProjectFile[]> = {
  'border-images': site(
    BODY10.borderImages,
    `.gradient-chegara,
.yumaloq {
  padding: 16px;
  margin-bottom: 16px;
}

.gradient-chegara {
  border: 4px solid;
  border-image: linear-gradient(90deg, #0071dc, #fec400) 1;
}

.yumaloq {
  border: 4px solid transparent;
  border-radius: 12px;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(90deg, #0071dc, #fec400) border-box;
}`,
  ),

  'background-size': site(
    BODY10.backgroundSize,
    `${BG_SIZE_CSS}

.qahramon {
  background-size: cover;
  background-position: center;
}

.logo {
  background-size: contain;
  background-repeat: no-repeat;
}

.quti {
  background-clip: padding-box;
}`,
  ),

  'color-keywords': site(
    BODY10.colorKeywords,
    `${COLOR_KEYWORDS_CSS}

.tab {
  border-bottom: 3px solid transparent;
}

.tab:hover {
  border-bottom-color: #0071dc;
}

.ogohlantirish {
  border-color: currentColor;
}

.karta a {
  color: inherit;
}`,
  ),

  'linear-gradients': site(
    BODY10.linear,
    `.banner,
.bayroq,
.chiziq {
  height: 80px;
  margin-bottom: 12px;
}

.banner {
  background-image: linear-gradient(90deg, #0071dc, #00b4d8);
}

.bayroq {
  background-image: linear-gradient(#0099b5 0 33%, white 33% 67%, #1eb53a 67% 100%);
}

.chiziq {
  background-image: repeating-linear-gradient(45deg, #fec400 0 10px, #0e1133 10px 20px);
}`,
  ),

  'radial-gradients': site(
    BODY10.radial,
    `.nuqtalar {
  height: 120px;
  margin-bottom: 16px;
  background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
  background-size: 16px 16px;
}

.diagramma {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: conic-gradient(#0071dc 0 60%, #fec400 60% 85%, #e5e7eb 85% 100%);
}`,
  ),

  'box-shadow': site(
    BODY10.boxShadow,
    `.karta {
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.karta:hover {
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.maydon {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.08);
}

.tanlangan {
  box-shadow: 0 0 0 3px #fec400;
}`,
  ),

  'text-effects': site(
    BODY10.textEffects,
    `.gradient-matn {
  background-image: linear-gradient(90deg, #0071dc, #fec400);
  background-clip: text;
  color: transparent;
}

.kontur {
  color: transparent;
  -webkit-text-stroke: 2px #0071dc;
}

.vertikal {
  writing-mode: vertical-rl;
}

h2 {
  text-wrap: balance;
}`,
  ),
};
