// This module is used only by server routes. Never expose database keys in NEXT_PUBLIC_* variables.
// Storage: Cloudflare D1 (when CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_D1_DATABASE_ID and CLOUDFLARE_API_TOKEN
// are all set) or Supabase (SUPABASE_URL + SUPABASE_SECRET_KEY).
export type Enquiry = { id: string; name: string; email: string; phone: string; service: string; details: string; budget: string; timeline: string; company: string; created_at?: string; status?: string };

function d1Config() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim(), databaseId = process.env.CLOUDFLARE_D1_DATABASE_ID?.trim(), token = process.env.CLOUDFLARE_API_TOKEN?.trim();
  return accountId && databaseId && token ? { accountId, databaseId, token } : null;
}
export function databaseConfigured() {
  return Boolean(d1Config() || (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY));
}

// ---------------------------------------------------------------- Cloudflare D1 (REST API)
const D1_SCHEMA = [
  `CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    details TEXT NOT NULL,
    company TEXT NOT NULL DEFAULT '',
    budget TEXT NOT NULL DEFAULT 'Discuss with me',
    timeline TEXT NOT NULL DEFAULT 'Flexible',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    status TEXT NOT NULL DEFAULT 'New'
  )`,
  'CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries (created_at DESC)',
];
let d1Ready: Promise<void> | undefined;
async function d1(sql: string, params: unknown[] = []): Promise<any[]> {
  const c = d1Config();
  if (!c) throw new Error('Database is not configured');
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${c.accountId}/d1/database/${c.databaseId}/query`, {
    method: 'POST', cache: 'no-store', signal: AbortSignal.timeout(10000),
    headers: { Authorization: `Bearer ${c.token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql, params }),
  });
  const body: any = await response.json().catch(() => null);
  if (!response.ok || !body?.success) throw new Error(`Database request failed (${response.status})`);
  const result = Array.isArray(body.result) ? body.result[body.result.length - 1] : body.result;
  return result?.results ?? [];
}
async function d1Schema() {
  if (!d1Ready) d1Ready = (async () => { for (const sql of D1_SCHEMA) await d1(sql); })().catch(e => { d1Ready = undefined; throw e; });
  return d1Ready;
}

// ---------------------------------------------------------------- Supabase (REST API)
async function database(path: string, init: RequestInit = {}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('Database is not configured');
  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/${path}`, {
    ...init, cache: 'no-store', signal: AbortSignal.timeout(10000),
    headers: { apikey: key, ...(key.startsWith('sb_secret_') ? {} : { Authorization: `Bearer ${key}` }), 'Content-Type': 'application/json', ...init.headers },
  });
  if (!response.ok) throw new Error(`Database request failed (${response.status})`);
  return response;
}

export async function saveEnquiry(enquiry: Enquiry) {
  if (d1Config()) {
    await d1Schema();
    await d1('INSERT INTO enquiries (id,name,email,phone,service,details,company,budget,timeline) VALUES (?,?,?,?,?,?,?,?,?)',
      [enquiry.id, enquiry.name, enquiry.email, enquiry.phone, enquiry.service, enquiry.details, enquiry.company, enquiry.budget, enquiry.timeline]);
    return;
  }
  await database('enquiries', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(enquiry) });
}
export async function listEnquiries(): Promise<Enquiry[]> {
  if (d1Config()) {
    await d1Schema();
    return d1('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 200');
  }
  return (await database('enquiries?select=*&order=created_at.desc&limit=200')).json();
}
