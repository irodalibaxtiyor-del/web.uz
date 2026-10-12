import type { ProjectFile } from '@webdizayn/shared';
import { BODY07 } from '../modules/07-selectors';
import { site } from '../shared';

export const s07: Record<string, ProjectFile[]> = {
  combinators: site(
    BODY07.combinators,
    `.menyu > li {
  border-bottom: 1px solid #dddddd;
}

h2 + p {
  font-size: 1.125rem;
}

.royxat li + li {
  margin-top: 8px;
}`,
  ),

  'pseudo-classes': site(
    BODY07.pseudoClasses,
    `.royxat li {
  padding: 8px 0;
  border-bottom: 1px solid #dddddd;
}

.royxat li:last-child {
  border-bottom: none;
}

.tanlov {
  display: block;
  padding: 8px;
}

input:disabled {
  background-color: #eeeeee;
}

label:has(input:checked) {
  background-color: #e6f1fc;
}

.menyu a:not(.faol) {
  opacity: 0.7;
}`,
  ),

  'pseudo-elements': site(
    BODY07.pseudoElements,
    `.sarlavha::after {
  content: "";
  display: block;
  width: 48px;
  height: 4px;
  margin-top: 8px;
  background-color: #fec400;
}

.muhim::before {
  content: "⚠ ";
}

.maqola p:first-child::first-letter {
  font-size: 3em;
  color: #0071dc;
}

input::placeholder {
  color: #666666;
}`,
  ),

  'attribute-selectors': site(
    BODY07.attributes,
    `input[type="email"] {
  border: 2px solid #0071dc;
}

a[href$=".pdf"]::after {
  content: " (PDF)";
}

a[target="_blank"]::after {
  content: " ↗";
}

button[aria-expanded="true"] {
  background-color: #e6f1fc;
}

[data-holat="xato"] {
  color: crimson;
}`,
  ),

  specificity: site(
    BODY07.specificity.replace(' style="color: red"', ''),
    `:where(#asosiy) p {
  color: gray;
}

.matn {
  color: #0e1133;
}

:where(#asosiy) button {
  background-color: gray;
}

.tugma {
  background-color: #0071dc;
  color: white;
}

.belgi {
  color: #0071dc;
}`,
  ),

  important: site(
    BODY07.important,
    `#xabar {
  display: block;
}

.yashirin {
  display: none !important;
}

@layer asos {
  #menyu a {
    color: gray;
  }
}

.havola {
  color: #0071dc;
}`,
  ),
};
