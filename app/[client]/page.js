import { supabase } from '@/lib/supabase';

export default async function ClientPage({ params }) {
  const { client } = params;

  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('subdomain', client)
    .single();

  if (error || !tenant) {
    return <h1>Client not found</h1>;
  }

  return (
    <div style={{ backgroundColor: tenant.theme_color }}>
      <h1>{tenant.name}s Site</h1>
      <p>{tenant.description}</p>
    </div>
  );
}
