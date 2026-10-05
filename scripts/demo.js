import { createServer } from '../src/server.js';
const server = createServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
try {
  const base = `http://127.0.0.1:${server.address().port}`;
  console.log('CloudShield reproducible smoke demo');
  for (const path of ['/', '/healthz', '/api/project']) {
    const response = await fetch(base + path);
    if (!response.ok) throw new Error(`${path}: HTTP ${response.status}`);
    console.log(`${path}: HTTP ${response.status}`);
    if (path === '/api/project') {
      const data = await response.json();
      for (const stage of data.stages) console.log(`${stage.name}: ${stage.tool} — ${stage.policy}`);
    }
  }
  console.log('HTTP smoke checks passed. Security scanners have not been run by this demo.');
} finally {
  await new Promise(resolve => server.close(resolve));
}
