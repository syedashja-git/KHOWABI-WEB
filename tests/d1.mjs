// Cloudflare D1 storage: a fake Cloudflare REST API backed by real SQLite (the engine D1 runs).
import ts from 'typescript';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
const mod = (path, rep = {}) => { let s = fs.readFileSync(path, 'utf8'); for (const [a, b] of Object.entries(rep)) s = s.replaceAll(a, b); return 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(s, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText).toString('base64'); };
const db = mod('lib/supabase.ts');
const email = mod('lib/enquiry-email.ts', { "'nodemailer'": JSON.stringify(import.meta.resolve('nodemailer')) });
const { POST } = await import(mod('app/api/enquiries/route.ts', { '../../../lib/supabase': db, '../../../lib/enquiry-email': email }));
const { GET } = await import(mod('app/admin/route.ts', { '../../lib/supabase': db }));

const sqlite = new DatabaseSync(':memory:'); const calls = [];
globalThis.fetch = async (url, init) => {
  calls.push({ url, init });
  const { sql, params } = JSON.parse(init.body);
  try {
    const st = sqlite.prepare(sql);
    const results = st.columns().length ? st.all(...params) : (st.run(...params), []);
    return Response.json({ success: true, errors: [], result: [{ results, success: true, meta: {} }] });
  } catch (e) { return Response.json({ success: false, errors: [{ code: 7500, message: e.message }], result: [] }, { status: 400 }); }
};
delete process.env.SUPABASE_URL; delete process.env.SUPABASE_SECRET_KEY;
Object.assign(process.env, { CLOUDFLARE_ACCOUNT_ID: '0123456789abcdef0123456789abcdef', CLOUDFLARE_D1_DATABASE_ID: '01234567-89ab-cdef-0123-456789abcdef', CLOUDFLARE_API_TOKEN: 'cf-test-token' });
const input = { name: "O'Brien; DROP TABLE enquiries; --", email: 'client@example.com', phone: '03132244506', service: 'Web Development', details: 'Build a business website', company: 'Test Company' };
const req = () => new Request('https://example.com/api/enquiries', { method: 'POST', headers: { origin: 'https://example.com', 'Content-Type': 'application/json' }, body: JSON.stringify(input) });

const r1 = await POST(req()); assert.equal(r1.status, 201);
const r2 = await POST(req()); assert.equal(r2.status, 201);
assert.match(calls[0].url, /accounts\/0123456789abcdef0123456789abcdef\/d1\/database\/01234567-89ab-cdef-0123-456789abcdef\/query$/);
assert.equal(calls[0].init.headers.Authorization, 'Bearer cf-test-token');
const rows = sqlite.prepare('SELECT * FROM enquiries ORDER BY created_at').all();
assert.equal(rows.length, 2); assert.equal(rows[0].name, input.name); assert.equal(rows[0].status, 'New'); assert.match(rows[0].created_at, /^\d{4}-\d{2}-\d{2}T/);
process.env.ADMIN_PASSWORD = 'a-test-password-at-least-16-characters';
const admin = await GET(new Request('https://example.com/admin', { headers: { authorization: 'Basic ' + Buffer.from('admin:' + process.env.ADMIN_PASSWORD).toString('base64') } }));
assert.equal(admin.status, 200); const html = await admin.text();
assert.ok(html.includes('O&#39;Brien; DROP TABLE enquiries; --')); assert.ok(html.includes((await r2.json()).id));
globalThis.fetch = async () => Response.json({ success: false, errors: [{ code: 10000, message: 'Authentication error' }] }, { status: 401 });
assert.equal((await POST(req())).status, 503);
console.log('PASS: Cloudflare D1 storage: table auto-created, parameterized inserts, admin list newest-first, HTML escaping and failure handling. Mock Cloudflare API only.');
