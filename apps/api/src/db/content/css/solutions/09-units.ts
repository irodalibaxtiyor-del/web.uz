import type { ProjectFile } from '@webdizayn/shared';
import { AT_PROPERTY_CSS, BODY09, UNITS_CSS } from '../modules/09-units';
import { site } from '../shared';

export const s09: Record<string, ProjectFile[]> = {
  units: site(
    BODY09.units,
    `${UNITS_CSS}

.karta {
  padding: 1em;
  margin-bottom: 1rem;
}

.tugma {
  padding: 0.5em 1em;
}

.matn {
  max-width: 65ch;
}

.ekran {
  min-height: 100dvh;
}`,
  ),

  'math-functions': site(
    BODY09.math,
    `body {
  margin: 0;
}

.maket {
  display: flex;
}

.asosiy {
  width: calc(100% - 280px);
}

.yon {
  width: 280px;
}

.konteyner {
  width: min(100% - 32px, 1100px);
  margin: 0 auto;
}

h1 {
  font-size: clamp(1.75rem, 4vw + 1rem, 3rem);
}`,
  ),

  variables: site(
    BODY09.variables,
    `:root {
  --rang-asosiy: #0071dc;
  --radius: 8px;
}

.tugma {
  padding: 8px 16px;
  border: 0;
  color: white;
  background-color: var(--tugma-fon, var(--rang-asosiy));
  border-radius: var(--radius);
}

.xavfli {
  --tugma-fon: crimson;
}`,
  ),

  'at-property': site(
    BODY09.atProperty,
    `@property --burchak {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

@property --qadam {
  syntax: "<length>";
  inherits: true;
  initial-value: 8px;
}

${AT_PROPERTY_CSS}

.karta {
  transition: --burchak 0.6s;
}

.karta:hover {
  --burchak: 180deg;
}`,
  ),
};
