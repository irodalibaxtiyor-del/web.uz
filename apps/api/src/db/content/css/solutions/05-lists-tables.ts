import type { ProjectFile } from '@webdizayn/shared';
import { BODY05, TABLE_BASE } from '../modules/05-lists-tables';
import { site } from '../shared';

export const s05: Record<string, ProjectFile[]> = {
  links: site(
    BODY05.links,
    `a {
  color: #0071dc;
}

a:hover {
  color: #0e1133;
}

a:focus-visible {
  outline: 3px solid #0071dc;
  outline-offset: 2px;
}

.tugma {
  display: inline-block;
  padding: 10px 20px;
  background-color: #0071dc;
  color: white;
  text-decoration: none;
  border-radius: 8px;
}`,
  ),

  lists: site(
    BODY05.lists,
    `nav ul {
  list-style: none;
  padding-left: 0;
}

.afzalliklar {
  list-style-type: square;
}

.afzalliklar li::marker {
  color: #0071dc;
}

.bosqichlar {
  list-style-type: upper-roman;
}`,
  ),

  tables: site(
    BODY05.table,
    `body {
  margin: 0;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px 12px;
  text-align: left;
}

th {
  border-bottom: 2px solid #0e1133;
}

td.raqam {
  text-align: right;
}`,
  ),

  'table-styling': site(
    BODY05.tableStyling,
    `${TABLE_BASE}

.jadval-quti {
  overflow-x: auto;
}

caption {
  caption-side: bottom;
}

tbody tr:nth-child(even) {
  background-color: #f5faff;
}

tbody tr:hover {
  background-color: #e6f1fc;
}`,
  ),
};
