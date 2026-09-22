import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';

const MAX_OUTPUT = 1024 * 1024;

function bridgePath() {
  const root = process.env.ORCA_MONEY_BOT_PATH;
  if (!root) throw new Error('Set ORCA_MONEY_BOT_PATH to the ORCA-MONEY-BOT checkout');
  return join(resolve(root), 'orca_bridge.py');
}

export function callOrca(command, fields = {}) {
  const result = spawnSync(process.env.ORCA_PYTHON || 'python3', [bridgePath()], {
    input: `${JSON.stringify({ command, ...fields })}\n`,
    encoding: 'utf8', timeout: 30000, maxBuffer: MAX_OUTPUT,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr || `ORCA bridge exited ${result.status}`);
  if (!result.stdout.trim()) throw new Error('ORCA bridge returned no response');
  let response;
  try { response = JSON.parse(result.stdout.trim()); }
  catch (error) { throw new Error(`Invalid ORCA bridge response: ${error.message}`); }
  if (!response.ok) throw new Error(response.error || 'ORCA bridge request failed');
  return response.result;
}

export const orcaTools = {
  health: () => callOrca('health'),
  config: () => callOrca('config'),
  marketData: (symbol, interval = '1h', limit = 50) => callOrca('market_data', { symbol, interval, limit }),
  signal: (symbol) => callOrca('signal', { symbol }),
};

if (import.meta.url === `file://${process.argv[1]}`) {
  const [command = 'health', symbol] = process.argv.slice(2);
  console.log(JSON.stringify(callOrca(command, symbol ? { symbol } : {}), null, 2));
}
