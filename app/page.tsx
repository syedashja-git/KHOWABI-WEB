'use client';
import {useState,useEffect} from 'react';
import {ArrowUpRight,ArrowRight,Code2,Smartphone,Layers,Check,Menu,X,MessageCircle,Plus,Monitor,ShoppingBag,Boxes,PhoneCall} from 'lucide-react';
const wa='https://wa.me/923132244506';
const services=[{name:'Web Development',icon:Monitor,desc:'A powerful first impression. Business websites and online stores designed to turn visitors into customers.',tags:'Business websites, E-commerce, Responsive design'},{name:'App Development',icon:Smartphone,desc:'Your business, a tap away. Thoughtfully designed mobile experiences built around your customers.',tags:'Mobile experiences, Customer apps, Business tools'},{name:'Custom Software',icon:Code2,desc:'Software that works your way. Purpose-built tools for the processes that keep your business moving.',tags:'ERP, Attendance, Inventory, Asset management'}];
const projects=[{name:'Smart Building Intercom',image:'/intercom.png',type:'Software',label:'Building communication',desc:'A reception panel and resident Android app for apartment buildings: one-tap voice calls to every flat, WhatsApp-style messaging, parent and child flats, Building Union announcements, a locked operator screen and call history export to PDF or Excel.',icon:PhoneCall,color:'blue'},{name:'Accounting ERP',image:'/alpha-erp.png',type:'Software',label:'Finance & operations',desc:'A central workspace for products, raw materials, purchases, invoices and inventory, with date-based reporting.',icon:Layers,color:'mint'},{name:'Live Attendance Software',image:'/attendance.png',type:'Software',label:'Workforce management',desc:'An employee check-in experience with a live clock, employee identification and location-enabled attendance.',icon:Boxes,color:'blue'},{name:'Construction Chemicals Website',image:'/alpha-website.png',type:'Websites',label:'Business presence',desc:'A corporate website for Alpha Construction Chemicals, presenting construction and waterproofing solutions.',icon:Monitor,color:'peach'},{name:'QuickServe',image:'/quickserve.png',type:'Software',label:'Digital platform',desc:'A local services platform designed to help customers find professionals and follow their bookings.',icon:ShoppingBag,color:'purple'},{name:'AssetTag',image:'/assettag.png',type:'Software',label:'Asset management',desc:'A QR asset maintenance system with a dedicated sign-in and registration experience.',icon:Boxes,color:'mint'}];
export default function Home(){const[menu,setMenu]=useState(false),[filter,setFilter]=useState('All projects'),[modal,setModal]=useState<any>(null),[form,setForm]=useState(false),[service,setService]=useState('Web Development'),[busy,setBusy]=useState(false),[result,setResult]=useState<any>(null),[error,setError]=useState('');
useEffect(()=>{
 const cards=Array.from(document.querySelectorAll<HTMLElement>('.process-card'));
 if(!('IntersectionObserver' in window))return;
 cards.forEach(card=>card.classList.add('drop-ready'));
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('drop-in');observer.unobserve(entry.target)}});
 },{threshold:0.15});
 cards.forEach(card=>observer.observe(card));
 return()=>observer.disconnect();
},[]);
useEffect(()=>{if(!form&&!modal)return;const previous=document.activeElement as HTMLElement;document.body.style.overflow='hidden';const dialog=document.querySelector('[role="dialog"]') as HTMLElement;const focusables=()=>Array.from(dialog?.querySelectorAll<HTMLElement>('button,a[href],input:not(.honeypot),select,textarea')||[]).filter(x=>!x.hasAttribute('disabled'));focusables()[0]?.focus();function key(e:KeyboardEvent){if(e.key==='Escape'&&!busy){setForm(false);setModal(null)}if(e.key==='Tab'){const all=focusables(),first=all[0],last=all[all.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}}document.addEventListener('keydown',key);return()=>{document.body.style.overflow='';document.removeEventListener('keydown',key);previous?.focus()}},[form,modal,busy]);
const start=()=>{setResult(null);setError('');setForm(true);setMenu(false)};
async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError('');const data=Object.fromEntries(new FormData(e.currentTarget));try{const r=await fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,service})});const j=await r.json();if(!r.ok)throw new Error(j.error);setResult({...j,name:data.name})}catch(e:any){setError(e.message||'Please try again.')}finally{setBusy(false)}}
const steps=[['Discover','We listen to your goals, understand your users and define what success looks like.'],['Design','We plan the experience and visual direction, so you can see your idea taking shape.'],['Develop','We build your solution and refine it with feedback, keeping you involved.'],['Launch','We test, prepare the handover and agree on the support your project needs.']];
const faqs=[['How much will my project cost?','Every project has a different scope. Share your requirements and budget preferences, and we will discuss a quotation before development begins.'],['Can you improve my existing website or software?','Yes. Share the current system and the changes you need. We will review what is practical before recommending the next steps.'],['Do you work with businesses outside Karachi?','We work with businesses across Pakistan. Requirements, design reviews and project updates can be discussed remotely.'],['How long does development take?','The timeline depends on the scope, integrations and feedback needed. We agree on milestones after reviewing your requirements.'],['Will I be able to add new projects to my website?','A content management dashboard can be included in your project scope so you can update projects, images and text.'],['What happens after I send an enquiry?','Your enquiry is saved with a reference number. We review your brief and contact you to discuss the scope, next steps and quotation.']];
return <>
<header className="site-head"><div className="container head-row">
<a href="#" className="brand" aria-label="KHOWABI home"><img src="/khowabi-logo.png" alt="KHOWABI" width={186} height={62}/></a>
<nav className={menu?'open':''} aria-label="Main">
<a onClick={()=>setMenu(false)} href="#services">Services</a>
<a onClick={()=>setMenu(false)} href="#work">Our work</a>
<a onClick={()=>setMenu(false)} href="#about">About us</a>
<a onClick={()=>setMenu(false)} href="#process">Our process</a>
</nav>
<button className="button nav-cta" onClick={start}>Start a project <ArrowUpRight size={16} aria-hidden="true"/></button>
<button className="menu" onClick={()=>setMenu(!menu)} aria-label="Toggle menu" aria-expanded={menu}>{menu?<X/>:<Menu/>}</button>
</div></header>
<main>
<section className="hero container">
<div className="hero-copy">
<h1>Big ideas, beautifully built.</h1>
<p className="lead">Websites, apps and software that move your business forward.</p>
<div className="actions">
<button className="button" onClick={start}>Let’s build something <ArrowUpRight size={18} aria-hidden="true"/></button>
<a className="text-link" href="#work">Explore our work <ArrowRight size={17} aria-hidden="true"/></a>
</div>
<p className="hero-note">Based in Pakistan. Building for your business.</p>
</div>
<figure className="hero-work">
<button className="hero-shot" onClick={()=>setModal(projects[0])} aria-label={'Open '+projects[0].name}>
<img src={projects[0].image} alt={projects[0].name+': reception gallery and resident app'} width={1400} height={650}/>
</button>
<figcaption>Latest work: {projects[0].name}, a reception panel with a resident Android app.</figcaption>
</figure>
</section>

<section id="services" className="section container services">
<div className="section-head">
<h2>What we do</h2>
<p className="lead">From your first business website to a system that runs your operations, we bring the right ideas to life.</p>
</div>
<ol className="service-list">{services.map((s,i)=><li key={s.name}>
<span className="service-num">0{i+1}</span>
<s.icon size={28} aria-hidden="true" className="service-icon"/>
<div className="service-body"><h3>{s.name}</h3><p>{s.desc}</p><small>{s.tags}</small></div>
<button className="service-card text-link" onClick={()=>{setService(s.name);start()}}>Discuss your project <ArrowUpRight size={18} aria-hidden="true"/></button>
</li>)}</ol>
</section>

<section id="work" className="section work">
<div className="container work-grid">
<div className="work-pane">
<h2>Selected work</h2>
<p className="lead">A look at our project portfolio, from business websites to software for everyday operations.</p>
<div className="filters" role="group" aria-label="Filter projects">{['All projects','Websites','Software'].map(x=><button key={x} aria-pressed={filter===x} className={filter===x?'active':''} onClick={()=>setFilter(x)}>{x}</button>)}</div>
<p className="work-note">Want a closer look? Ask us for a guided project walkthrough.</p>
</div>
<div className="project-list">{projects.filter(p=>filter==='All projects'||p.type===filter).map(p=><article key={p.name} className={'project tone-'+p.color}>
<button className="project-shot" onClick={()=>setModal(p)} aria-label={'Open '+p.name}><img src={p.image} alt={p.name+': project screens on desktop and phone'} loading="lazy" width={1400} height={650}/></button>
<div className="project-info">
<div><h3>{p.name}</h3><span className="project-meta">{p.type} / {p.label}</span></div>
<p>{p.desc}</p>
<button className="text-link" onClick={()=>setModal(p)}>View project <ArrowUpRight size={17} aria-hidden="true"/></button>
</div>
</article>)}</div>
</div>
</section>

<section className="section container about" id="about">
<p className="about-statement">Good technology. Better possibilities.</p>
<div className="about-copy">
<h2>The people behind the build</h2>
<p>We’re KHOWABI. We develop websites, mobile applications and custom software for businesses across Pakistan.</p>
<p>We start by understanding how your business works, then shape a digital solution around what you actually need.</p>
<ul className="checks">
<li><Check aria-hidden="true"/> Clear communication, from day one</li>
<li><Check aria-hidden="true"/> Design with your customers in mind</li>
<li><Check aria-hidden="true"/> A practical approach to your business needs</li>
</ul>
<a className="text-link" href={wa} target="_blank" rel="noreferrer">Let’s get to know your business <ArrowUpRight size={18} aria-hidden="true"/></a>
</div>
</section>

<section className="section process" id="process"><div className="container">
<div className="section-head">
<h2>How we work</h2>
<p className="lead">You bring the idea. We work through the details together, with clear next steps along the way.</p>
</div>
<ol className="process-grid">{steps.map(([n,d],i)=><li className="process-card" tabIndex={0} key={n}>
<span className="step-num">0{i+1}</span><h3>{n}</h3><p>{d}</p>
</li>)}</ol>
</div></section>

<section className="section container faq">
<div className="faq-head">
<h2>Good questions</h2>
<a href={wa} className="text-link" target="_blank" rel="noreferrer">Ask us on WhatsApp <ArrowUpRight size={18} aria-hidden="true"/></a>
</div>
<div className="faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}<Plus size={18} aria-hidden="true"/></summary><p>{a}</p></details>)}</div>
</section>

<section className="cta"><div className="container cta-row">
<div>
<h2>Let’s build your next big thing.</h2>
<p className="lead">A new website? A smarter system? An idea you can’t stop thinking about?</p>
</div>
<div className="cta-actions">
<button className="button light" onClick={start}>Start your project <ArrowUpRight size={19} aria-hidden="true"/></button>
<a className="cta-phone" href={wa} target="_blank" rel="noreferrer">WhatsApp +92 313 2244506</a>
</div>
</div></section>
</main>

<footer className="site-foot"><div className="container foot-row">
<img src="/khowabi-logo.png" alt="KHOWABI" width={150} height={50}/>
<p className="colophon">KHOWABI makes thoughtful digital solutions for businesses in Pakistan. See our <a href="#services">services</a>, <a href="#work">our work</a> and <a href="#about">about us</a>, or reach us on WhatsApp at <a href={wa} target="_blank" rel="noreferrer">+92 313 2244506</a>.</p>
<div className="foot-links">
<button onClick={start}>Start a project</button>
<button onClick={()=>setModal({privacy:true})}>Privacy policy</button>
<a href="#">Back to top</a>
</div>
<p className="legal">© {new Date().getFullYear()} Khowabi.</p>
</div></footer>

<a className="whatsapp" href={wa+'?text=Hello%20KHOWABI!%20I%20would%20like%20to%20discuss%20a%20project.'} target="_blank" rel="noreferrer" aria-label="Chat with KHOWABI on WhatsApp"><MessageCircle size={24} aria-hidden="true"/><span>Let’s chat</span></a>

{modal&&<div className="overlay" onClick={()=>setModal(null)}><div role="dialog" aria-modal="true" aria-label={modal.privacy?'Privacy policy':modal.name} className="dialog" onClick={e=>e.stopPropagation()}>
<button className="close" aria-label="Close" onClick={()=>setModal(null)}><X/></button>
{modal.privacy?<>
<h2>Privacy policy</h2>
<p>We collect the contact information and project details you submit to respond to your enquiry and discuss our services. Please do not submit passwords or sensitive client information.</p>
<p>Enquiries are stored in our website database. If email confirmation is enabled, your email address and enquiry details are processed by our email provider. WhatsApp links open WhatsApp, where its own privacy policy applies.</p>
<p>To request access to or deletion of your enquiry, contact us on WhatsApp at +92 313 2244506 with your enquiry reference. We do not sell your enquiry information.</p>
</>:<>
<h2>{modal.name}</h2>
<p className="dialog-meta">{modal.type} project</p>
<img className="detail-screen" src={modal.image} alt={modal.name+' screenshot'}/>
<p>{modal.desc}</p>
<p>Interested in a similar solution? Tell us about your business, or request a walkthrough to explore this project with our team.</p>
<div className="dialog-actions">
<a className="button" href={wa+'?text='+encodeURIComponent('Hello KHOWABI, I would like a walkthrough of '+modal.name)} target="_blank" rel="noreferrer">Request a walkthrough <ArrowUpRight size={18} aria-hidden="true"/></a>
<button className="text-link" onClick={()=>{setModal(null);start()}}>Discuss a similar project <ArrowRight size={18} aria-hidden="true"/></button>
</div>
</>}
</div></div>}

{form&&<div className="overlay"><div className="dialog form-dialog" role="dialog" aria-modal="true" aria-label="Start a project">
<button className="close" aria-label="Close form" onClick={()=>!busy&&setForm(false)}><X/></button>
{result?<div className="success">
<span className="success-icon"><Check size={28} aria-hidden="true"/></span>
<h2>Thank you, {result.name}.</h2>
<p>Your project enquiry has been received. We’ll review your requirements and get in touch.</p>
<div className="reference">Your reference <strong>{result.id}</strong></div>
{result.emailSent?<p>A confirmation email is on its way. Please check your inbox and spam folder.</p>:<p>Your enquiry is saved. Email confirmation is currently unavailable; please keep your reference number.</p>}
<a className="button" href={wa+'?text='+encodeURIComponent('Hello KHOWABI! I submitted project enquiry '+result.id)} target="_blank" rel="noreferrer">Continue on WhatsApp <ArrowUpRight size={18} aria-hidden="true"/></a>
</div>:<>
<h2>Tell us about your project.</h2>
<p>A few details are all we need to start the conversation.</p>
<form onSubmit={submit}>
<p className="field-label" id="svc-label">What can we help you build?</p>
<div className="service-options" role="group" aria-labelledby="svc-label">{['Web Development','E-commerce','App Development','Custom Software','Improve Existing System','Help Me Decide'].map(s=><button type="button" aria-pressed={service===s} className={service===s?'selected':''} key={s} onClick={()=>setService(s)}>{s}</button>)}</div>
<div className="form-grid">
<label>Your name *<input name="name" required maxLength={100} autoComplete="name" placeholder="Full name"/></label>
<label>Email address *<input name="email" type="email" required autoComplete="email" placeholder="you@company.com"/></label>
<label>WhatsApp number *<input name="phone" type="tel" required pattern="\+?[0-9 ()-]{10,18}" autoComplete="tel" placeholder="03XX XXXXXXX"/></label>
<label>Company / business<input name="company" maxLength={200} placeholder="Your business name"/></label>
</div>
<label>{service==='Improve Existing System'?'What would you like to improve? *':'Tell us about your idea *'}<textarea name="details" required minLength={10} maxLength={4000} rows={4} placeholder="What does your business do, and what would you like to build? You can include reference links here."/></label>
<div className="form-grid">
<label>Budget preference<select name="budget"><option>Discuss with me</option><option>Under PKR 100,000</option><option>PKR 100,000 to 300,000</option><option>PKR 300,000 to 500,000</option><option>PKR 500,000+</option></select></label>
<label>When would you like to start?<select name="timeline"><option>Flexible / exploring</option><option>As soon as possible</option><option>Within a month</option><option>In 1 to 3 months</option></select></label>
</div>
<input name="website" className="honeypot" tabIndex={-1} autoComplete="off" aria-hidden="true"/>
<p className="form-note">Your details will only be used to respond to your enquiry. Final pricing is agreed after reviewing your requirements.</p>
{error&&<p role="alert" className="error">{error}</p>}
<button className="button" disabled={busy} type="submit">{busy?'Sending your enquiry…':'Send project enquiry'}</button>
</form>
</>}
</div></div>}
</>}
