import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/server.js';
let server, base;
before(async () => {
  server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise(resolve => server.close(resolve)));
test('health endpoint works and does not disclose runtime details', async () => {
  const response = await fetch(`${base}/healthz`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok' });
  assert.equal(response.headers.get('x-powered-by'), null);
});
test('all public assets have the correct type and security headers', async () => {
  for (const [path, type] of [['/', 'text/html'], ['/app.js', 'text/javascript'], ['/styles.css', 'text/css']]) {
    const response = await fetch(base + path);
    assert.equal(response.status, 200);
    assert.ok(response.headers.get('content-type').startsWith(type));
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.ok((await response.text()).length > 0);
  }
});
test('evidence API identifies lab mode and all security stages', async () => {
  const project = await (await fetch(`${base}/api/project`)).json();
  assert.equal(project.mode, 'portfolio-lab');
  assert.equal(project.stages.length, 7);
  assert.match(project.evidence, /no fabricated findings/);
});
test('only allowlisted assets can be read', async () => {
  for (const path of ['/package.json', '/.env', '/src/server.js', '/%2e%2e/package.json', '/unknown']) {
    assert.equal((await fetch(base + path)).status, 404);
  }
});
test('unsupported methods are rejected', async () => {
  const response = await fetch(base, { method: 'POST', body: 'test' });
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('allow'), 'GET, HEAD');
});
test('HEAD returns metadata without a response body', async () => {
  const response = await fetch(base, { method: 'HEAD' });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '');
});
