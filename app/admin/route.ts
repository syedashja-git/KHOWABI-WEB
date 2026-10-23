import {createHash, timingSafeEqual} from 'node:crypto';
import {listEnquiries} from '../../lib/supabase';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const escape=(value: unknown)=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export async function GET(request: Request) {
  const password=process.env.ADMIN_PASSWORD;
  if (!password || password.length<16) return new Response('Admin access is disabled until a password of at least 16 characters is configured.',{status:503});
  const expected=`${process.env.ADMIN_USERNAME||'admin'}:${password}`;
  const auth=request.headers.get('authorization')||'';
  const provided=auth.startsWith('Basic ')?Buffer.from(auth.slice(6),'base64').toString('utf8'):'';
  const hash=(s:string)=>createHash('sha256').update(s).digest();
  if (!timingSafeEqual(hash(expected),hash(provided))) return new Response('Owner login required.',{status:401,headers:{'WWW-Authenticate':'Basic realm="KHOWABI Admin", charset="UTF-8"','Cache-Control':'no-store'}});
  try {
    const rows=await listEnquiries();
    const cards=rows.map(r=>`<article><small>${escape(r.id)} · ${escape(r.status)}</small><h2>${escape(r.name)} — ${escape(r.service)}</h2><p>${escape(r.email)} · ${escape(r.phone)}</p><p>${escape(r.company)}</p><p class="brief">${escape(r.details)}</p><p>${escape(r.budget)} / ${escape(r.timeline)}</p><small>${escape(r.created_at)}</small></article>`).join('');
    return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>KHOWABI — Enquiries</title><style>body{font:16px system-ui;background:#f5f8f7;color:#102c36;margin:0}main{max-width:1000px;margin:auto;padding:32px 20px}article{background:white;border:1px solid #dce5e3;border-radius:12px;padding:24px;margin:20px 0;overflow-wrap:anywhere}.brief{white-space:pre-wrap}a{color:#087f73}small{color:#52706c}</style></head><body><main><a href="/">← KHOWABI website</a><h1>Project enquiries</h1><p>${rows.length} recent enquiries</p>${cards||'<p>New project enquiries will appear here.</p>'}</main></body></html>`,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'"}});
  } catch { return new Response('Unable to load enquiries. Check Supabase configuration.',{status:503,headers:{'Cache-Control':'no-store'}}); }
}
