alter table public.registrations
  drop constraint if exists registrations_payment_status_check;

alter table public.registrations
  add constraint registrations_payment_status_check
  check (payment_status = any (array['pending','paid','installments','pay_later','offert','cancelled']));
