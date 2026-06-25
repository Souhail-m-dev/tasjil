export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string | null
          email: string
          id: string
          role: string | null
          tenant: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          role?: string | null
          tenant?: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          role?: string | null
          tenant?: string
        }
        Relationships: []
      }
      tenants: {
        Row: {
          created_at: string
          email_from: string
          email_from_name: string
          email_reply_to: string | null
          resend_api_key: string | null
          slug: string
        }
        Insert: {
          created_at?: string
          email_from: string
          email_from_name: string
          email_reply_to?: string | null
          resend_api_key?: string | null
          slug: string
        }
        Update: {
          created_at?: string
          email_from?: string
          email_from_name?: string
          email_reply_to?: string | null
          resend_api_key?: string | null
          slug?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          agreed_attendance: boolean
          agreed_payment: boolean
          agreed_rules: boolean
          agreed_truth: boolean
          confirmation_email_message_id: string | null
          confirmation_email_sent_at: string | null
          created_at: string | null
          email: string
          first_name: string
          gender: string | null
          id: string
          installment_count: number | null
          installment_dates: Json | null
          installment_first_date: string | null
          last_name: string
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          seminar_id: string | null
          signature_text: string | null
          signed_at: string | null
          telegram_handle: string | null
          tenant: string
          zoom_email: string | null
        }
        Insert: {
          agreed_attendance?: boolean
          agreed_payment?: boolean
          agreed_rules?: boolean
          agreed_truth?: boolean
          confirmation_email_message_id?: string | null
          confirmation_email_sent_at?: string | null
          created_at?: string | null
          email: string
          first_name: string
          gender?: string | null
          id?: string
          installment_count?: number | null
          installment_dates?: Json | null
          installment_first_date?: string | null
          last_name: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          seminar_id?: string | null
          signature_text?: string | null
          signed_at?: string | null
          telegram_handle?: string | null
          tenant?: string
          zoom_email?: string | null
        }
        Update: {
          agreed_attendance?: boolean
          agreed_payment?: boolean
          agreed_rules?: boolean
          agreed_truth?: boolean
          confirmation_email_message_id?: string | null
          confirmation_email_sent_at?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          gender?: string | null
          id?: string
          installment_count?: number | null
          installment_dates?: Json | null
          installment_first_date?: string | null
          last_name?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          seminar_id?: string | null
          signature_text?: string | null
          signed_at?: string | null
          telegram_handle?: string | null
          tenant?: string
          zoom_email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "registrations_seminar_id_fkey"
            columns: ["seminar_id"]
            isOneToOne: false
            referencedRelation: "seminars"
            referencedColumns: ["id"]
          },
        ]
      }
      seminars: {
        Row: {
          author: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          has_notes: boolean | null
          has_pdf_support: boolean | null
          has_weekly_quiz: boolean | null
          id: string
          is_recorded: boolean | null
          location: string | null
          price_eur: number | null
          sessions_per_week: number | null
          slug: string
          start_date: string | null
          tenant: string
          title: string
          title_ar: string | null
          zoom: boolean | null
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          has_notes?: boolean | null
          has_pdf_support?: boolean | null
          has_weekly_quiz?: boolean | null
          id?: string
          is_recorded?: boolean | null
          location?: string | null
          price_eur?: number | null
          sessions_per_week?: number | null
          slug: string
          start_date?: string | null
          tenant?: string
          title: string
          title_ar?: string | null
          zoom?: boolean | null
        }
        Update: {
          author?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          has_notes?: boolean | null
          has_pdf_support?: boolean | null
          has_weekly_quiz?: boolean | null
          id?: string
          is_recorded?: boolean | null
          location?: string | null
          price_eur?: number | null
          sessions_per_week?: number | null
          slug?: string
          start_date?: string | null
          tenant?: string
          title?: string
          title_ar?: string | null
          zoom?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
