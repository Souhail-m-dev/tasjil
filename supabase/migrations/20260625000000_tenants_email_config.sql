-- Per-tenant email config table (SaaS-oriented).
-- Holds Resend sender fields + secret API key per tenant.
-- Read only via service-role: RLS enabled with NO policies, so anon/authenticated
-- cannot read resend_api_key. supabaseAdmin (service-role) bypasses RLS.

create table if not exists public.tenants (
  slug            text primary key,
  resend_api_key  text,
  email_from      text not null,
  email_reply_to  text,
  email_from_name text not null,
  created_at      timestamptz not null default now()
);

alter table public.tenants enable row level security;

insert into public.tenants (slug, email_from, email_reply_to, email_from_name)
values
  ('seminaire', 'noreply@abouabdelwahab.com', 'dr.abdelrahman.abou.abdelwahab@gmail.com', 'Inscription Séminaire'),
  ('institut',  'noreply@drmiloud.com',       'noreply@drmiloud.com',                     'Institut Cheikh Dr Miloud')
on conflict (slug) do nothing;

-- resend_api_key left NULL (secrets do not live in git).
-- Set institut key via SQL editor:
--   update public.tenants set resend_api_key = 're_xxx' where slug = 'institut';
-- seminaire stays NULL -> app falls back to env RESEND_API_KEY.
