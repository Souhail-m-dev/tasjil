alter table public.registrations
  add column if not exists signature_text text,
  add column if not exists signed_at timestamptz,
  add column if not exists agreed_rules boolean not null default false,
  add column if not exists agreed_attendance boolean not null default false,
  add column if not exists agreed_payment boolean not null default false,
  add column if not exists agreed_truth boolean not null default false;
