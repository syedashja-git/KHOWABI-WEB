import type { Metadata } from 'next';
import './globals.css';
const siteUrl = process.env.SITE_URL || 'https://khowabi.com';
export const metadata:Metadata={metadataBase:new URL(siteUrl),alternates:{canonical:'/'},openGraph:{type:'website',siteName:'KHOWABI',url:siteUrl,title:'KHOWABI — Digital craft. Real business impact.'},icons:{icon:'/favicon.svg'},title:'KHOWABI — Digital craft. Real business impact.',description:'Websites, mobile apps and custom software for businesses in Pakistan. Explore KHOWABI and start your next project.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
