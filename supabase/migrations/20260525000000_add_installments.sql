alter table public.registrations
  add column if not exists installment_count integer,
  add column if not exists installment_first_date date,
  add column if not exists installment_dates jsonb;
