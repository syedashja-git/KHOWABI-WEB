import {databaseConfigured, saveEnquiry} from '../../../lib/supabase';
import {sendEnquiryEmails} from '../../../lib/enquiry-email';
export const runtime = 'nodejs';
export const maxDuration = 60;
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({error:'Invalid request origin.'}, {status:403});
  if (!databaseConfigured()) return Response.json({error:'The enquiry form is temporarily unavailable. Please contact us on WhatsApp.'}, {status:503});
  let b;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 16000) return Response.json({error:'Please shorten your enquiry.'}, {status:413});
    b = JSON.parse(raw);
  } catch { return Response.json({error:'Invalid request.'}, {status:400}); }
  if (!b || typeof b !== 'object' || Array.isArray(b) || b.website) return Response.json({error:'Invalid request.'}, {status:400});
  const limits: Record<string,number> = {name:100,email:254,phone:30,service:100,details:4000};
  if (Object.entries(limits).some(([key,max])=>typeof b[key] !== 'string' || !b[key].trim() || b[key].length > max)
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) || !/^\+?[\d\s()-]{10,18}$/.test(b.phone) || b.details.trim().length < 10) {
    return Response.json({error:'Please enter valid contact details and a project description of at least 10 characters.'}, {status:400});
  }
  const enquiry = {id:'KHOWABI-'+crypto.randomUUID().toUpperCase(),name:b.name.trim(),email:b.email.trim(),phone:b.phone.trim(),service:b.service.trim(),details:b.details.trim(),company:String(b.company||'').slice(0,200),budget:String(b.budget||'Discuss with me').slice(0,100),timeline:String(b.timeline||'Flexible').slice(0,100)};
  try { await saveEnquiry(enquiry); }
  catch { console.error('Unable to save enquiry'); return Response.json({error:'We could not save your enquiry. Please try again or contact us on WhatsApp.'}, {status:503}); }
  const {emailSent} = await sendEnquiryEmails(enquiry, {EMAIL_PROVIDER:process.env.EMAIL_PROVIDER,SITE_URL:process.env.SITE_URL,REPLY_TO_EMAIL:process.env.REPLY_TO_EMAIL,GMAIL_USER:process.env.GMAIL_USER,GMAIL_APP_PASSWORD:process.env.GMAIL_APP_PASSWORD,RESEND_API_KEY:process.env.RESEND_API_KEY,EMAIL_FROM:process.env.EMAIL_FROM,NOTIFICATION_EMAIL:process.env.NOTIFICATION_EMAIL});
  return Response.json({id:enquiry.id,emailSent}, {status:201});
}
