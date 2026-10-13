import { PHP_MODULES } from './manifest';
import { PHP_OUTPUTS } from './shared';

/**
 * Prints the PHP course's output-prediction questions as JSON, so their answers can be checked
 * with a real PHP interpreter (the API itself never runs PHP):
 *   node -r @swc-node/register src/db/content/php/outputs.ts > outputs.json
 */
void PHP_MODULES; // importing the manifest registers every question
process.stdout.write(JSON.stringify(PHP_OUTPUTS, null, 2));
