import type { ProjectFile } from '@webdizayn/shared';
import { ANIMATIONS_CSS, BODY11, T2D_CSS, T3D_CSS, TRANSITIONS_CSS } from '../modules/11-motion';
import { site } from '../shared';

export const s11: Record<string, ProjectFile[]> = {
  'transforms-2d': site(
    BODY11.t2d,
    `${T2D_CSS}

.belgi {
  transform: rotate(-5deg);
  transform-origin: left top;
}

.karta:hover {
  transform: translateY(-4px);
}

.ikonka {
  transform: scale(1.5);
}`,
  ),

  'transforms-3d': site(
    BODY11.t3d,
    `${T3D_CSS}

.sahna {
  perspective: 800px;
}

.karta {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.sahna:hover .karta {
  transform: rotateY(180deg);
}

.old,
.orqa {
  backface-visibility: hidden;
}

.orqa {
  transform: rotateY(180deg);
}`,
  ),

  transitions: site(
    BODY11.transitions,
    `${TRANSITIONS_CSS}

.tugma {
  transition: background-color 0.3s ease;
}

.tugma:hover {
  background-color: #005bb0;
}

.karta {
  transition: transform 0.2s ease-out;
}

.karta:hover {
  transform: translateY(-4px);
}`,
  ),

  animations: site(
    BODY11.animations,
    `${ANIMATIONS_CSS}

@keyframes aylanish {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes paydo {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

.yuklash {
  animation: aylanish 1s linear infinite;
}

.xabar {
  animation: paydo 0.4s ease-out;
}`,
  ),
};
