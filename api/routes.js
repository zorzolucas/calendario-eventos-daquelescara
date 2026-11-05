// Repassa o cálculo de distâncias para a Routes API usando a chave guardada na Vercel,
// assim quem abre o link não precisa ter uma chave própria.
const MODES = new Set(['DRIVE', 'WALK', 'TRANSIT']);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) return res.status(503).json({ error: { message: 'Chave do Google Maps não configurada no servidor' } });
  if (req.method !== 'POST') return res.status(405).json({ error: { message: 'method_not_allowed' } });

  const b = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  if (!b || !Array.isArray(b.origins) || !Array.isArray(b.destinations) || !MODES.has(b.travelMode)
      || b.origins.length !== 1 || b.destinations.length < 1 || b.destinations.length > 25) {
    return res.status(400).json({ error: { message: 'Pedido inválido' } });
  }
  const body = {
    origins: b.origins, destinations: b.destinations, travelMode: b.travelMode,
    languageCode: 'pt-BR', units: 'METRIC',
  };
  if (b.travelMode === 'DRIVE') body.routingPreference = 'TRAFFIC_AWARE';
  if (b.departureTime) body.departureTime = b.departureTime;

  const r = await fetch('https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': key,
      'X-Goog-FieldMask': 'originIndex,destinationIndex,duration,distanceMeters,status,condition',
    },
    body: JSON.stringify(body),
  });
  const data = await r.json();
  return res.status(r.status).json(data);
}
