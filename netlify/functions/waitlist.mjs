// netlify/functions/waitlist.mjs — community waitlist signup.
//
// The API key stays in BEEHIIV_API_KEY and never reaches the browser.
//
// Waitlist signups are separated from ordinary newsletter signups by
// utm_source=waitlist-page, which beehiiv records as acquisition_source and
// which works on every plan. Subscriber tags are deliberately not used.
//
// custom_fields are sent optimistically: beehiiv discards names that do not
// exist on the publication, so this works whether or not community_waitlist,
// ai_job and first_name have been created in the beehiiv UI.
//
// Env vars: BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID

const API = 'https://api.beehiiv.com/v2';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const NEW_MSG = 'You are on the list. Check your inbox to confirm, and the newsletter starts this week.';
const EXISTING_MSG = 'You are on the list. You were already getting the newsletter, so nothing else changes.';

function json(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });
}

// No-JS fallback: the form posts urlencoded, so answer with a plain page.
function page(status, heading, body) {
  const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
  return new Response(`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(heading)} — Fight Back with AI</title>
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="stylesheet" href="/styles.css?v=2"></head>
<body><main class="wrap" style="padding-top:90px;padding-bottom:90px">
<div class="note"><h2>${esc(heading)}</h2><p>${esc(body)}</p>
<p><a class="link-ul-red" href="/">Back to the newsletter</a></p></div>
</main></body></html>`, {
    status,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }
  });
}

function fields({ first_name, ai_job }) {
  const out = [{ name: 'community_waitlist', value: true }];
  if (first_name) out.push({ name: 'first_name', value: first_name });
  if (ai_job) out.push({ name: 'ai_job', value: ai_job });
  return out;
}

export default async (request) => {
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed.' });

  const ctype = request.headers.get('content-type') || '';
  const wantsHtml = !ctype.includes('application/json');

  let data;
  try {
    if (wantsHtml) {
      data = Object.fromEntries(new URLSearchParams(await request.text()));
    } else {
      data = await request.json();
    }
  } catch {
    return wantsHtml ? page(400, 'That did not go through', 'Try again from the waitlist page.')
                     : json(400, { error: 'Send a JSON body with an email.' });
  }

  const email = String(data.email || '').trim();
  const first_name = String(data.first_name || '').trim().slice(0, 100);
  const ai_job = String(data.ai_job || '').trim().slice(0, 300);

  // Honeypot. Accept silently so a bot cannot tell, but write nothing.
  if (String(data.company_fax || '').trim()) {
    return wantsHtml ? page(200, 'You are on the list', NEW_MSG) : json(200, { ok: true, state: 'ignored', message: NEW_MSG });
  }

  if (!EMAIL.test(email) || email.length > 254) {
    return wantsHtml ? page(400, 'That address does not look right', 'Check the spelling and try again.')
                     : json(400, { error: 'That address does not look right.' });
  }

  const key = process.env.BEEHIIV_API_KEY;
  const pub = process.env.BEEHIIV_PUBLICATION_ID;
  if (!key || !pub) {
    console.error('BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID is not set');
    return wantsHtml ? page(503, 'Not configured yet', 'The waitlist is not accepting names right now.')
                     : json(503, { error: 'The waitlist is not configured yet.' });
  }

  const auth = { authorization: `Bearer ${key}`, 'content-type': 'application/json' };
  const enc = encodeURIComponent(email);

  try {
    // Already a subscriber? Then update only, so no duplicate and no second
    // welcome email.
    const look = await fetch(`${API}/publications/${pub}/subscriptions/by_email/${enc}`, { headers: auth });

    if (look.ok) {
      const res = await fetch(`${API}/publications/${pub}/subscriptions/by_email/${enc}`, {
        method: 'PUT',
        headers: auth,
        body: JSON.stringify({ custom_fields: fields({ first_name, ai_job }) })
      });
      if (!res.ok) throw new Error(`beehiiv PUT ${res.status} ${await res.text()}`);
      return wantsHtml ? page(200, 'You are on the list', EXISTING_MSG)
                       : json(200, { ok: true, state: 'existing', message: EXISTING_MSG });
    }

    // Anything other than a clean 200 is treated as "not subscribed" and falls
    // through to create. Create does not duplicate an existing address, so the
    // worst case is a second welcome email rather than a lost signup.
    if (look.status !== 404) {
      console.error(`beehiiv lookup returned ${look.status}; treating as new`);
    }

    const res = await fetch(`${API}/publications/${pub}/subscriptions`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({
        email,
        send_welcome_email: true,
        reactivate_existing: false,
        utm_source: 'waitlist-page',
        utm_medium: 'website',
        referring_site: request.headers.get('referer') || undefined,
        custom_fields: fields({ first_name, ai_job })
      })
    });
    if (!res.ok) throw new Error(`beehiiv POST ${res.status} ${await res.text()}`);

    return wantsHtml ? page(200, 'You are on the list', NEW_MSG)
                     : json(200, { ok: true, state: 'new', message: NEW_MSG });
  } catch (err) {
    console.error('Waitlist signup failed:', err.message);
    return wantsHtml ? page(502, 'That did not go through', 'Could not reach the list. Try again in a moment.')
                     : json(502, { error: 'Could not reach the list. Try again in a moment.' });
  }
};

export const config = { path: '/api/waitlist' };
