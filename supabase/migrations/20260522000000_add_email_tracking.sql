-- Migration to add email tracking columns to registrations table

ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS confirmation_email_sent_at timestamptz DEFAULT NULL;

ALTER TABLE public.registrations 
ADD COLUMN IF NOT EXISTS confirmation_email_message_id text DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_registrations_confirmation_email_sent_at 
ON public.registrations (confirmation_email_sent_at);
