import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function middleware(req) {
  const { nextUrl, headers } = req;
  const hostname = headers.get('host') || '';
  const [subdomain] = hostname.split('.');

   // Skip middleware for the login page or base domain
   if (nextUrl.pathname.startsWith('/auth') || subdomain === 'www' || hostname === 'company.com') {
    return NextResponse.next();
  }

  // Check if the user is authenticated
  const session = await supabase.auth.getSession();
  
  if (!session) {
    // If not authenticated, redirect to the login page
    return NextResponse.redirect(new URL('/auth/login', nextUrl));
  }


  // Handle the base domain and www subdomain
  if (subdomain === 'www' || hostname === 'company.com') {
    return NextResponse.next();
  }

  // Check if the subdomain exists in the database
  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('subdomain', subdomain)
    .single();

  if (!tenant) {
    return NextResponse.rewrite(new URL('/not-found', nextUrl));
  }

  // Rewrite to tenant-specific page
  nextUrl.pathname = `/${subdomain}${nextUrl.pathname}`;
  return NextResponse.rewrite(nextUrl);
}
