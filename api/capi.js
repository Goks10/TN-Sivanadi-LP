const crypto = require('crypto');
const { META_ACCESS_TOKEN, META_DATASET_ID } = require('./lib/meta-config');

const CAPI_URL = `https://graph.facebook.com/v19.0/${META_DATASET_ID}/events`;

function sha256(value) {
  if (!value) return undefined;
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { event_name, event_id, event_source_url, fbp, fbc, em, ph } = req.body || {};

    if (!event_name || !event_id) {
      return res.status(400).json({ error: 'event_name and event_id are required' });
    }

    const clientIp =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      (req.socket && req.socket.remoteAddress) || '';
    const clientUserAgent = req.headers['user-agent'] || '';

    const userData = {
      client_ip_address: clientIp,
      client_user_agent: clientUserAgent,
    };
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;
    if (em)  userData.em  = sha256(em);
    if (ph)  userData.ph  = sha256(ph);

    const payload = {
      data: [{
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        event_source_url: event_source_url || '',
        action_source: 'website',
        user_data: userData,
      }],
      access_token: META_ACCESS_TOKEN,
    };

    if (process.env.NODE_ENV !== 'production') {
      console.log('[Meta CAPI] →', JSON.stringify({ ...payload, access_token: '[REDACTED]' }, null, 2));
    }

    const response = await fetch(CAPI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('[Meta CAPI] Error:', JSON.stringify(result));
      return res.status(502).json({ error: 'Meta API error', details: result });
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('[Meta CAPI] ✓ events_received:', result.events_received);
    }

    return res.status(200).json({ ok: true, events_received: result.events_received });

  } catch (err) {
    console.error('[Meta CAPI] Unexpected error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
