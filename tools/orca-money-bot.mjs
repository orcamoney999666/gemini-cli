import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

function bridgePath() {
  const root = process.env.ORCA_MONEY_BOT_PATH;
  if (!root) {
    throw new Error('Set ORCA_MONEY_BOT_PATH to the ORCA-MONEY-BOT checkout');
  }
  return join(root, 'orca_bridge.py');
}

export function callOrca(command, fields = {}) {
  const input = `${JSON.stringify({ command, ...fields })}\n`;
  const result = spawnSync(process.env.ORCA_PYTHON || 'python3', [bridgePath()], {
    input,
    encoding: 'utf8',
    timeout: 30000,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr || `ORCA bridge exited ${result.status}`);
  }

  const response = JSON.parse(result.stdout.trim());
  if (!response.ok) throw new Error(response.error);
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
  const payload = symbol ? { symbol } : {};
  console.log(JSON.stringify(callOrca(command, payload), null, 2));
}
