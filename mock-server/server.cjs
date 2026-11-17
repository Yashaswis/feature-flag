/*
 * Mock equivalent of feature-flag-service's FlagEvaluationController.
 * Dependency-free (Node 18+):  node mock-server/server.js
 *
 * Endpoints (same wire contract as the real service):
 *   POST /v1/flags/:key/evaluate   body {subjectId, environment, attributes} -> {"value": <boolean|object>}
 *   POST /v1/flags/evaluate-all    same body                                 -> {"values": {"<flagKey>": <value>, ...}}
 *   GET  /health
 *
 * Auth: X-API-Key header, looked up in API_KEYS (key -> namespaceId), like ApiKeyAuthenticationFilter.
 * Missing/unknown key -> 401. OPTIONS preflight is exempt.
 *
 * Values are re-rolled on EVERY call (no stickiness): the same flag key can return true, then false,
 * then a different JSON shape.
 *
 * Env: PORT (default 9099), API_KEYS_JSON (e.g. '{"my-key":"ns-a"}') overrides the default keys.
 */
const http = require('node:http');

const PORT = Number(process.env.PORT) || 9099;

// key -> namespaceId
const API_KEYS = process.env.API_KEYS_JSON
  ? JSON.parse(process.env.API_KEYS_JSON)
  : { 'dev-api-key': 'ns-dev', 'other-api-key': 'ns-other' };

// namespaceId -> { flagKey: 'boolean' | 'json' }. Used by evaluate-all, and to pin a flag's type
// in evaluate. Flags not listed here still work in evaluate (type is random per call).
const FLAG_OVERRIDES = {
  'ns-dev': {
    'new-portal-access': 'boolean',
    'loan-application-flow-v2': 'boolean',
    'new-portal-config': 'json',
    'checkout-config': 'json',
  },
  'ns-other': {
    'other-flag': 'boolean',
    'other-config': 'json',
  },
};

const rnd = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rnd(arr.length)];
const word = () => Math.random().toString(36).slice(2, 8);

const JSON_TEMPLATES = [
  () => ({ enabled: Math.random() < 0.5, url: `https://example.com/${word()}` }),
  () => ({ variant: pick(['control', 'treatment-a', 'treatment-b']), percentage: rnd(101) }),
  () => ({ items: Array.from({ length: 1 + rnd(4) }, () => ({ id: word(), weight: rnd(10) })) }),
  () => ({ theme: pick(['light', 'dark']), maxRetries: rnd(6), labels: [word(), word()] }),
];

const randomBoolean = () => Math.random() < 0.5;
const randomObject = () => pick(JSON_TEMPLATES)();

function randomValue(type) {
  const t = type || pick(['boolean', 'json']);
  return t === 'boolean' ? randomBoolean() : randomObject();
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
};

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json', ...CORS });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => {
      data += c;
      if (data.length > 1e6) {
        reject(new Error('body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');

  if (req.method === 'OPTIONS') return send(res, 204);
  if (req.method === 'GET' && pathname === '/health') return send(res, 200, { status: 'UP' });

  const evalMatch = pathname.match(/^\/v1\/flags\/([^/]+)\/evaluate$/);
  const isEvalAll = pathname === '/v1/flags/evaluate-all';
  if (req.method !== 'POST' || (!evalMatch && !isEvalAll)) {
    return send(res, 404, { error: 'Not Found' });
  }

  // Auth (mirrors ApiKeyAuthenticationFilter: namespace derived from the key, never the body)
  const apiKey = req.headers['x-api-key'];
  const namespaceId = apiKey ? API_KEYS[apiKey] : undefined;
  if (!namespaceId) {
    console.log(`401 ${req.method} ${pathname} (${apiKey ? 'unknown' : 'missing'} X-API-Key)`);
    return send(res, 401, { error: 'Unauthorized' });
  }

  let body;
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { error: 'Invalid JSON body' });
  }

  console.log(`200 ${req.method} ${pathname} namespace=${namespaceId} subject=${body.subjectId}`);
  const flags = FLAG_OVERRIDES[namespaceId] || {};

  if (evalMatch) {
    const key = decodeURIComponent(evalMatch[1]);
    return send(res, 200, { value: randomValue(flags[key]) });
  }

  const values = {};
  for (const [flagKey, type] of Object.entries(flags)) values[flagKey] = randomValue(type);
  return send(res, 200, { values });
});

server.listen(PORT, () => console.log(`mock feature-flag-service listening on :${PORT}`));
