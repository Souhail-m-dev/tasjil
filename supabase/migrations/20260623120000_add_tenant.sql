-- Phase 0: multi-tenant discriminator + tenant-scoped RLS.
-- Existing rows backfill to 'seminaire' via the column default.

alter table public.seminars      add column if not exists tenant text not null default 'seminaire';
alter table public.registrations add column if not exists tenant text not null default 'seminaire';
alter table public.admins        add column if not exists tenant text not null default 'seminaire';

create index if not exists idx_seminars_tenant      on public.seminars (tenant);
create index if not exists idx_registrations_tenant on public.registrations (tenant);
create index if not exists idx_admins_tenant        on public.admins (tenant);

-- Per-tenant admin check. An admin only acts within the tenant of their admins row.
create or replace function private.is_admin_for(t text)
  returns boolean
  language sql stable security definer
  set search_path to 'public', 'pg_temp'
as $$
  select exists (
    select 1 from public.admins a
    where a.email = (auth.jwt() ->> 'email')
      and a.tenant = t
  );
$$;

-- registrations: admin policies scoped to the row's tenant
drop policy if exists registrations_admin_select on public.registrations;
create policy registrations_admin_select on public.registrations
  for select to authenticated using (private.is_admin_for(tenant));

drop policy if exists registrations_admin_update on public.registrations;
create policy registrations_admin_update on public.registrations
  for update to authenticated using (private.is_admin_for(tenant)) with check (private.is_admin_for(tenant));

drop policy if exists registrations_admin_delete on public.registrations;
create policy registrations_admin_delete on public.registrations
  for delete to authenticated using (private.is_admin_for(tenant));

drop policy if exists registrations_admin_insert on public.registrations;
create policy registrations_admin_insert on public.registrations
  for insert to authenticated with check (private.is_admin_for(tenant));

-- anon insert: tenant must match the referenced seminar's tenant
drop policy if exists registrations_anon_insert on public.registrations;
create policy registrations_anon_insert on public.registrations
  for insert to anon, authenticated
  with check (
    payment_status = 'pending'
    and seminar_id is not null
    and exists (
      select 1 from public.seminars s
      where s.id = registrations.seminar_id
        and s.tenant = registrations.tenant
    )
  );

-- seminars: admin writes scoped to tenant; public read stays open (app filters by tenant)
drop policy if exists seminars_admin_insert on public.seminars;
create policy seminars_admin_insert on public.seminars
  for insert to authenticated with check (private.is_admin_for(tenant));

drop policy if exists seminars_admin_update on public.seminars;
create policy seminars_admin_update on public.seminars
  for update to authenticated using (private.is_admin_for(tenant)) with check (private.is_admin_for(tenant));

drop policy if exists seminars_admin_delete on public.seminars;
create policy seminars_admin_delete on public.seminars
  for delete to authenticated using (private.is_admin_for(tenant));
