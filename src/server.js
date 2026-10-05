import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const publicDir = fileURLToPath(new URL('../public/', import.meta.url));
const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']]
]);
export const headers = {
  'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cache-Control': 'no-store'
};

export function createServer() {
  return http.createServer(async (req, res) => {
    const reply = (status, type, body) => {
      res.writeHead(status, { ...headers, 'Content-Type': type });
      res.end(req.method === 'HEAD' ? undefined : body);
    };
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.setHeader('Allow', 'GET, HEAD');
      return reply(405, 'application/json', JSON.stringify({ error: 'Method not allowed' }));
    }
    let path;
    try { path = new URL(req.url, 'http://localhost').pathname; }
    catch { return reply(400, 'application/json', '{"error":"Bad request"}'); }
    if (path === '/healthz') return reply(200, 'application/json', '{"status":"ok"}');
    if (path === '/api/project') {
      return reply(200, 'application/json', JSON.stringify({
        name: 'CloudShield', version: '1.0.0', mode: 'portfolio-lab',
        evidence: 'Run GitHub Actions to obtain scanner results. This portal displays no fabricated findings.',
        stages: [
          { name: 'Tests', tool: 'Node.js test runner', policy: 'Blocking', scope: 'HTTP behavior and security headers' },
          { name: 'SAST', tool: 'Semgrep', policy: 'Blocking', scope: 'First-party JavaScript' },
          { name: 'SCA', tool: 'npm audit / optional Snyk', policy: 'Blocking', scope: 'Application dependency lockfile' },
          { name: 'IaC', tool: 'Checkov', policy: 'Blocking', scope: 'Terraform and Kubernetes manifests' },
          { name: 'Image', tool: 'Trivy', policy: 'Blocking', scope: 'HIGH / CRITICAL image vulnerabilities' },
          { name: 'SBOM', tool: 'Syft', policy: 'Required artifact', scope: 'CycloneDX image inventory' },
          { name: 'DAST', tool: 'OWASP ZAP', policy: 'Blocking', scope: 'Passive baseline scan of the portal' }
        ]
      }));
    }
    const asset = assets.get(path);
    if (!asset) return reply(404, 'application/json', '{"error":"Not found"}');
    try { reply(200, asset[1], await readFile(resolve(publicDir, asset[0]))); }
    catch { reply(500, 'application/json', '{"error":"Internal server error"}'); }
  });
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be 1..65535');
  const server = createServer();
  server.requestTimeout = 10000;
  server.headersTimeout = 15000;
  server.listen(port, process.env.HOST || '127.0.0.1', () => console.log(`CloudShield listening on port ${port}`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
  });
}
