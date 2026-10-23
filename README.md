# KHOWABI — Vercel + Supabase edition

Standard Next.js App Router website, prepared for GitHub and Vercel. Includes the existing responsive design, original project screenshots, hover cards, scroll drop animation, continuous ticker and WhatsApp link (+92 313 2244506).

## 1. Create the Supabase database
1. Create a project at https://supabase.com/dashboard and wait for it to become ready.
2. Open **SQL Editor**, create a query, paste all of `supabase/schema.sql`, and Run.
3. Copy your project URL from the project Connect/API settings.
4. In **Settings → API Keys**, create/copy a **secret key** (`sb_secret_...`). The server also supports the older service_role key. Do not use a publishable/anon key here.
5. Keep the Data API enabled. The `public.enquiries` table must be exposed through it. The supplied SQL enables Row Level Security and blocks direct public access.

No Supabase account/project is created by this ZIP. Existing enquiries in the earlier Cloudflare database are not migrated automatically. This version starts with the table in your Supabase project.

## 2. Run locally on Windows
Install a current supported Node.js LTS version (22.13 or higher). Extract this folder, open PowerShell inside it:

```powershell
npm.cmd install
Copy-Item .env.example .env.local
```
Edit `.env.local` in your editor. Set:

```dotenv
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SECRET_KEY=YOUR_PRIVATE_SECRET_KEY
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YOUR_UNIQUE_PASSWORD_AT_LEAST_16_CHARACTERS
NOTIFICATION_EMAIL=infosyedashja@gmail.com
```

Then:

```powershell
npm.cmd run dev
```

Open http://localhost:3000. Restart the server after changing environment variables. `npm.cmd` avoids PowerShell's npm.ps1 execution-policy error. You no longer need Wrangler, D1 migrations, or the old scripts/sites-env.mjs commands.

## 3. Upload to GitHub and deploy on Vercel
1. Create a GitHub repository (private is fine).
2. Upload this folder's source contents, including `app`, `lib`, `public`, `supabase`, `package.json`, and configuration files. `package.json` should be at the repository root.
3. Do not upload `.env.local`, `node_modules`, `.next`, or secret keys. `.gitignore` excludes them when using Git.
4. In Vercel, choose **Add New → Project**, connect GitHub, and import the repository.
5. Framework Preset: **Next.js**. Root Directory: repository root. Build Command: `npm run build`. Keep the default Next.js output directory.
6. Add the environment variables listed above to Production (and Preview if you want forms working in preview deployments). Set a strong, unique admin password of at least 16 characters.
7. Deploy. Vercel supplies a `*.vercel.app` address. If you change environment variables later, redeploy.

## 4. Gmail email activation — no custom domain needed
1. Sign in to the Google account infosyedashja@gmail.com.
2. Enable 2-Step Verification at https://myaccount.google.com/security.
3. Open https://myaccount.google.com/apppasswords and create an App Password named KHOWABI Website. This requires an eligible Google account with 2-Step Verification enabled. If the option is absent, account/admin restrictions may prevent it; do not disable security settings.
4. Copy the generated 16-character password directly into Vercel → Project → Settings → Environment Variables. Never share it in chat or commit it to GitHub.
5. Set these Production variables (Preview too if you need preview emails):

```dotenv
GMAIL_USER=infosyedashja@gmail.com
GMAIL_APP_PASSWORD=YOUR_GOOGLE_APP_PASSWORD
NOTIFICATION_EMAIL=infosyedashja@gmail.com
```

6. Upload the updated source to the connected GitHub repository, including package.json and package-lock.json. Vercel will install Nodemailer automatically. Ensure the new deployment uses the new environment variables; redeploy after any later environment changes.
7. For localhost, put the same values in the ignored .env.local file, run npm.cmd install, and restart npm.cmd run dev.

Gmail takes priority when both Gmail variables are present. RESEND_API_KEY and EMAIL_FROM can remain blank. The sender is always your authenticated Gmail account. Client confirmations reply to the owner; owner notifications reply to the client. If Gmail is not configured, the optional original Resend path remains supported with its API key and verified sender domain.

Each submission is saved to Supabase before email sending. Sending failures never discard it. Sends are independent and have SMTP timeouts. There is no automatic retry queue. Provider acceptance does not guarantee inbox delivery. Gmail has sending limits and may block unusual server sign-ins; it is intended here for low-volume enquiries, not bulk email campaigns.

### Diagnose email failures
Check Vercel runtime logs for `Enquiry email unavailable`:
- EAUTH / SMTP 535: verify the Gmail address and App Password, not your normal Google password. Changing your Google account password can revoke existing App Passwords.
- ETIMEDOUT / ESOCKET: Gmail connection/network issue; inspect your Google account security activity.
- SMTP 4xx/5xx: check account limits or restrictions.
The logs record only reference, recipient category and error codes, never credentials or message content. Do not paste your App Password in support messages.

## 5. Read enquiries
- Visit `/admin`. Your browser requests the ADMIN_USERNAME and ADMIN_PASSWORD configured on the server.
- This route is disabled when the password is missing or shorter than 16 characters. Use HTTPS in production. Close the private browser window to clear a browser-cached Basic Auth login.
- Alternatively use Supabase → Table Editor → enquiries.
- There is no public database read policy. Secret keys remain server-side; never name them `NEXT_PUBLIC_*`.

## 6. Verify after deployment
1. Submit one real test enquiry with an inbox you control.
2. Confirm the on-site reference and matching row in Supabase.
3. Check `/admin` rejects access without the password and displays the saved enquiry after login.
4. After email activation, verify both inboxes/spam folders and Gmail Sent; inspect Vercel logs if either send fails.

Development checks:
```powershell
npm.cmd test
npm.cmd run build
```
Tests use mocked requests: they do not send emails or write to a real database. Live database/email verification requires your project credentials. Honeypot and input validation are included; configure additional abuse protection for a high-traffic public campaign.

Official documentation:
- https://vercel.com/docs/frameworks/full-stack/nextjs
- https://supabase.com/docs/guides/getting-started/api-keys
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://resend.com/docs/knowledge-base/403-error-resend-dev-domain

## Applying the KHOWABI brand update
Replace source files in your existing GitHub repository with this release (including public/khowabi-logo.png). Keep your local .env.local and Vercel environment settings. Run npm.cmd install after updating package files. Commit and push to deploy. No Supabase schema changes are needed. Existing enquiry references remain unchanged; new ones start with KHOWABI-. The Gmail display name and email content now use KHOWABI. If using Resend, update the display name in EMAIL_FROM to KHOWABI while retaining your verified sender address.
The repository name and existing Vercel URL are independent of website branding and are not renamed by uploading these files.

## Custom domain: khowabi.com
The custom domain for this release is khowabi.com.

1. Own/register the domain first. In Vercel Project → Settings → Domains, add khowabi.com and www.khowabi.com. Connect the apex to Production and redirect www to the apex.
2. At the DNS provider managing your domain, add the exact A/CNAME/TXT records Vercel displays. Do not guess IP addresses or replace email MX records.
3. Wait for Valid Configuration and HTTPS. Set SITE_URL=https://khowabi.com in Vercel and redeploy. This sets canonical metadata and the email footer link.

### Keep Gmail working now
Keep GMAIL_USER and GMAIL_APP_PASSWORD. Set EMAIL_PROVIDER=gmail, NOTIFICATION_EMAIL=infosyedashja@gmail.com, REPLY_TO_EMAIL=infosyedashja@gmail.com. The sender display name is KHOWABI; the actual sender address remains Gmail.

### Send from the custom domain after verification
In Resend add/verify your owned domain khowabi.com and add exactly its required DNS records. Once verified, configure Vercel:

```dotenv
SITE_URL=https://khowabi.com
EMAIL_PROVIDER=resend
RESEND_API_KEY=YOUR_PRIVATE_RESEND_API_KEY
EMAIL_FROM="KHOWABI <hello@khowabi.com>"
NOTIFICATION_EMAIL=infosyedashja@gmail.com
REPLY_TO_EMAIL=infosyedashja@gmail.com
```

In the Vercel value field enter KHOWABI <hello@khowabi.com> without surrounding quotes. The hello address is a proposed sending identity, not a mailbox created by this code. Selecting resend explicitly overrides any existing Gmail credentials. Save and redeploy. Never activate this mode before verification.

Vercel hosting and Resend sending do not create an email inbox. To receive mail at hello@khowabi.com, provision an inbox or forwarding with an email provider and configure its DNS records. Until then replies and notifications deliberately go to your existing Gmail address. After confirming the inbox works, you may change REPLY_TO_EMAIL and NOTIFICATION_EMAIL.

No DNS, Vercel settings, mailboxes or live provider credentials are configured by extracting this ZIP.
