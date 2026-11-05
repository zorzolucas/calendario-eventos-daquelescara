import { hasRedis, redis } from './_redis.js';

const ID_RE = /^[a-z0-9]{8,32}$/;
const MAX_BYTES = 800_000;
const TTL = 60 * 60 * 24 * 365; // 1 ano sem mexer e o evento expira

// Grava só se a revisão no servidor ainda for a que o cliente conhece (evita sobrescrever edições de outra pessoa).
const CAS = `
local cur = redis.call('GET', KEYS[1])
local rev = 0
if cur then rev = cjson.decode(cur)['rev'] end
if tonumber(ARGV[2]) ~= rev then return cur end
redis.call('SET', KEYS[1], ARGV[1], 'EX', ARGV[3])
return 'OK'`;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!hasRedis()) return res.status(503).json({ error: 'storage_not_configured' });
  const id = String(req.query.id || '');
  if (!ID_RE.test(id)) return res.status(400).json({ error: 'invalid_id' });
  const key = `event:${id}`;

  try {
    if (req.method === 'GET') {
      const cur = await redis('GET', key);
      if (!cur) return res.status(404).json({ error: 'not_found' });
      return res.status(200).json(JSON.parse(cur));
    }

    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { event, baseRev } = body || {};
      if (!event || typeof event !== 'object' || typeof event.days !== 'object' || !Number.isInteger(baseRev)) {
        return res.status(400).json({ error: 'invalid_body' });
      }
      const doc = {
        rev: baseRev + 1,
        updatedAt: new Date().toISOString(),
        event: { name: String(event.name || '').slice(0, 200), meeting: String(event.meeting || '').slice(0, 500), days: event.days },
      };
      const json = JSON.stringify(doc);
      if (json.length > MAX_BYTES) return res.status(413).json({ error: 'too_large' });
      const out = await redis('EVAL', CAS, '1', key, json, String(baseRev), String(TTL));
      if (out === 'OK') return res.status(200).json({ rev: doc.rev, updatedAt: doc.updatedAt });
      return res.status(409).json(JSON.parse(out));
    }

    res.setHeader('Allow', 'GET, PUT');
    return res.status(405).json({ error: 'method_not_allowed' });
  } catch (err) {
    return res.status(500).json({ error: String(err.message || err) });
  }
}
