/**
 * BOOMSIDE demo challenge entries (2026-11-20).
 *
 * The Steam demo's clear screen sends { code, email } here. This function hands
 * them to the challenge's Google Form, so every entry - from the game or from
 * the form itself - lands in one response sheet with Google's own timestamp,
 * which decides the first three.
 *
 * It exists so players in mainland China can enter: Google is blocked there,
 * this domain is not. It checks only the shape of the code (BS1-, the right
 * length); the signature is checked offline with ms-extreme's
 * tools/steam/clear-code.mjs, the same as for codes typed into the form.
 *
 * The form opens and closes the event (accepting responses), so this function
 * needs no dates of its own. Each challenge round gets a new form: change FORM.
 */
const FORM = {
  // BOOMSIDE Challenge #1 (2026-11-25 to 12-15 23:59 Beijing time)
  id: '1FAIpQLSfCG80E_zsk13nKiyB5dI6H_dqIuGB-U3XWxyYLyCijB4U2AA',
  code: 'entry.489924890',
  email: 'entry.1732356815',
  consent: 'entry.480696173',
  consentText: 'We use your email only to contact winners and send keys, and delete it within 30 days after the event. I agree.',
  // Shown on the form's own pages; how the reply is told apart.
  doneText: 'Your entry is in.',
  closedText: 'not accepting entries',
};

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
/** Payload + 10-byte MAC, per code version (ms-extreme electron/clearCode.cjs). */
const CODE_BYTES = { 1: 26, 2: 29 };

/** Whether the text is a BS1 code of a known version and length (not whether it is genuine). */
const codeShapeOk = (code) => {
  const m = /^BS1-([0-9A-Z-]+)$/.exec(code);
  if (!m) return false;
  const chars = m[1].replace(/-/g, '');
  let bits = 0, value = 0;
  const bytes = [];
  for (const ch of chars) {
    const v = ALPHABET.indexOf(ch);
    if (v < 0) return false;
    value = (value << 5) | v; bits += 5;
    if (bits >= 8) { bytes.push((value >> (bits - 8)) & 255); bits -= 8; }
  }
  return bytes.length > 0 && CODE_BYTES[bytes[0]] === bytes.length;
};

const emailOk = (email) => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const readBody = async (req) => {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  return {};
};

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.status(405).json({ ok: false, reason: 'method' }); return; }

  const body = await readBody(req);
  const code = String(body.code ?? '').trim().toUpperCase();
  const email = String(body.email ?? '').trim();
  if (!codeShapeOk(code)) { res.status(400).json({ ok: false, reason: 'bad-code' }); return; }
  if (!emailOk(email)) { res.status(400).json({ ok: false, reason: 'bad-email' }); return; }

  const form = new URLSearchParams();
  form.set(FORM.code, code);
  form.set(FORM.email, email);
  form.set(FORM.consent, FORM.consentText);
  try {
    const reply = await fetch(`https://docs.google.com/forms/d/e/${FORM.id}/formResponse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
      signal: AbortSignal.timeout(10000),
    });
    const page = await reply.text();
    if (page.includes(FORM.doneText)) { res.status(200).json({ ok: true }); return; }
    if (reply.url.includes('closedform') || page.includes(FORM.closedText)) {
      res.status(409).json({ ok: false, reason: 'closed' }); return;
    }
    console.error('[challenge] unexpected form reply', reply.status, reply.url);
    res.status(502).json({ ok: false, reason: 'upstream' });
  } catch (error) {
    console.error('[challenge] form request failed', error);
    res.status(502).json({ ok: false, reason: 'upstream' });
  }
};
