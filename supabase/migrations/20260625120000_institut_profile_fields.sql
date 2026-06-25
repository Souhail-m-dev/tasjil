-- Institut registration extra fields (per inscription.docx).
-- All nullable: seminaire registrations leave them NULL.

alter table public.registrations
  add column if not exists birth_date     date,
  add column if not exists phone          text,
  add column if not exists address        text,
  add column if not exists postal_code    text,
  add column if not exists city           text,
  add column if not exists country        text,
  add column if not exists available_days jsonb,
  add column if not exists previous_group text;
