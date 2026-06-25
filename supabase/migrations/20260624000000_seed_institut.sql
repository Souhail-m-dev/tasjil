-- Phase 7: seed Institut Cheikh Dr Miloud tenant data.
-- Institut model = 2 niveaux (registration attaches to a niveau via seminar_id).
-- Idempotent: re-running is a no-op.

insert into public.seminars
  (slug, title, title_ar, author, description, location, price_eur,
   start_date, end_date, sessions_per_week, is_recorded, has_notes,
   has_pdf_support, has_weekly_quiz, zoom, tenant)
values
  (
    'institut-niveau-1',
    'Niveau 1',
    'المستوى الأول',
    'Dr. Miloud Lamri',
    'Première année du cursus : Tawhîd, Sîra, Fiqh, Hadîth. Cours le jeudi.',
    'Lyon (présentiel) & distanciel',
    350,
    '2026-09-10',
    '2027-05-28',
    1, true, true, true, false, false,
    'institut'
  ),
  (
    'institut-niveau-2',
    'Niveau 2',
    'المستوى الثاني',
    'Dr. Miloud Lamri',
    'Deuxième année du cursus : Tawhîd, Sîra, Fiqh, Hadîth. Cours le vendredi.',
    'Lyon (présentiel) & distanciel',
    350,
    '2026-09-10',
    '2027-05-28',
    1, true, true, true, false, false,
    'institut'
  )
on conflict (slug) do nothing;

-- Institut admin (gates is_admin_for('institut')). Auth user must be created
-- separately in Supabase Auth with this same email.
insert into public.admins (email, role, tenant)
values ('souhax69@gmail.com', 'admin', 'institut')
on conflict (email) do nothing;
