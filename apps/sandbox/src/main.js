// @ts-check
import { createSandboxServer, parseParents } from './server.js';

const port = Number(process.env.SANDBOX_PORT ?? 3100);
const host = process.env.SANDBOX_HOST ?? '127.0.0.1';
const parents = parseParents(process.env.SANDBOX_PARENT_ORIGINS);

createSandboxServer({ parents }).listen(port, host, () => {
  console.warn(`Sandbox listening on http://${host}:${port} (parents: ${parents.join(', ')})`);
});
