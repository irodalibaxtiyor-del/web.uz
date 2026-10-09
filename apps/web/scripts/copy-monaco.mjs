// Copies Monaco's AMD build into public/ so the editor loads from our own origin (no CDN).
import { cpSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const root = join(import.meta.dirname, '..');
const src = join(root, 'node_modules', 'monaco-editor', 'min', 'vs');
const dest = join(root, 'public', 'monaco', 'vs');

if (!existsSync(src)) throw new Error(`Monaco build not found at ${src}`);
if (existsSync(dest)) rmSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
console.warn(`Monaco copied to ${dest}`);
