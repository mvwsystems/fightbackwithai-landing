// Server-side proxy for beehiiv signups.
// The API key stays in the BEEHIIV_API_KEY env var and never reaches the browser.

const PUBLICATION_ID = 'pub_ab0ae18a-6a08-4684-8df9-308da38d5d04';
const ENDPOINT = `https://api.beehiiv.com/v2/publications/${PUBLICATION_ID}/subscriptions`;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });
}

export default async (request) => {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed.' });

  const key = process.env.BEEHIIV_API_KEY;
  if (!key) {
    console.error('BEEHIIV_API_KEY is not set');
    return json(503, { error: 'Signup is not configured yet.' });
  }

  let email;
  try {
    const body = await request.json();
    email = String(body && body.email ? body.email : '').trim();
  } catch {
    return json(400, { error: 'Send a JSON body with an email.' });
  }

  if (!EMAIL.test(email) || email.length > 254) {
    return json(400, { error: 'That address does not look right.' });
  }

  let res, data;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: 'fightbackwithai.com',
        utm_medium: 'landing_page',
        referring_site: request.headers.get('referer') || undefined
      })
    });
    data = await res.json().catch(() => ({}));
  } catch (err) {
    console.error('beehiiv request failed', err);
    return json(502, { error: 'Could not reach the list. Try again in a moment.' });
  }

  if (!res.ok) {
    // Log the detail, hand the visitor something plain.
    console.error('beehiiv responded', res.status, JSON.stringify(data));
    return json(502, { error: 'Could not add you right now. Try again in a moment.' });
  }

  // status is 'active' when the address is live, 'validating'/'pending' under double opt-in.
  const status = (data && data.data && data.data.status) || 'active';
  return json(200, { ok: true, status });
};

export const config = { path: '/api/subscribe' };
