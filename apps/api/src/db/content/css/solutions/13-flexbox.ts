import type { ProjectFile } from '@webdizayn/shared';
import { BODY13, ITEMS_CSS, RESPONSIVE_CSS } from '../modules/13-flexbox';
import { site } from '../shared';

export const s13: Record<string, ProjectFile[]> = {
  flexbox: site(
    BODY13.flexbox,
    `.sarlavha {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.menyu {
  display: flex;
  gap: 16px;
}`,
  ),

  'flex-container': site(
    BODY13.container,
    `.teglar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.markaz {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.menyu {
  display: flex;
  flex-direction: column;
}`,
  ),

  'flex-items': site(
    BODY13.items,
    `${ITEMS_CSS}

.qator {
  display: flex;
  gap: 12px;
}

.logo {
  flex-shrink: 0;
}

.qidiruv {
  flex-grow: 1;
}

.ustun {
  flex: 1;
}

.pastda {
  align-self: flex-end;
}`,
  ),

  'flex-responsive': site(
    BODY13.responsive,
    `${RESPONSIVE_CSS}

.kartalar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.karta {
  flex: 1 1 240px;
  display: flex;
  flex-direction: column;
}

.karta .tugma {
  margin-top: auto;
}

.menyu {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .menyu {
    flex-direction: row;
  }
}`,
  ),
};
