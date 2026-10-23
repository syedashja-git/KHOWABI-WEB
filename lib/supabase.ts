// This module is used only by server routes. Never expose the secret key in NEXT_PUBLIC_* variables.
export type Enquiry = { id: string; name: string; email: string; phone: string; service: string; details: string; budget: string; timeline: string; company: string; created_at?: string; status?: string };
export function databaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY);
}
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
  await database('enquiries', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(enquiry) });
}
export async function listEnquiries(): Promise<Enquiry[]> {
  return (await database('enquiries?select=*&order=created_at.desc&limit=200')).json();
}
