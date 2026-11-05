import { hasRedis } from './_redis.js';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ sharing: hasRedis(), serverMapsKey: Boolean(process.env.GOOGLE_MAPS_API_KEY) });
}
