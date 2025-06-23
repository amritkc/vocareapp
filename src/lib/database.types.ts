export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          id: string
          created_at: string
          created_by: string
          appointment: string
          type: string
          content: string
        }
        Insert: {
          id?: string
          created_at?: string
          created_by: string
          appointment: string
          type: string
          content: string
        }
        Update: {
          id?: string
          created_at?: string
          created_by?: string
          appointment?: string
          type?: string
          content?: string
        }
      }
      appointments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          start: string
          end: string
          location: string
          patient: string
          attachments: string[] | null
          category: string
          notes: string
          title: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          start: string
          end: string
          location: string
          patient: string
          attachments?: string[] | null
          category: string
          notes: string
          title: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          start?: string
          end?: string
          location?: string
          patient?: string
          attachments?: string[] | null
          category?: string
          notes?: string
          title?: string
        }
      }
      appointment_assignee: {
        Row: {
          id: string
          created_at: string
          appointment: string
          user: string
          user_type: string
        }
        Insert: {
          id?: string
          created_at?: string
          appointment: string
          user: string
          user_type: string
        }
        Update: {
          id?: string
          created_at?: string
          appointment?: string
          user?: string
          user_type?: string
        }
      }
      categories: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          label: string
          description: string
          color: string
          icon: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          label: string
          description: string
          color?: string
          icon: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          label?: string
          description?: string
          color?: string
          icon?: string
        }
      }
      patients: {
        Row: {
          id: string
          created_at: string
          firstname: string
          lastname: string
          birth_date: string
          care_level: number
          pronoun: string
          email: string
          active: boolean
          active_since: string
        }
        Insert: {
          id?: string
          created_at?: string
          firstname: string
          lastname: string
          birth_date: string
          care_level: number
          pronoun: string
          email: string
          active: boolean
          active_since: string
        }
        Update: {
          id?: string
          created_at?: string
          firstname?: string
          lastname?: string
          birth_date?: string
          care_level?: number
          pronoun?: string
          email?: string
          active?: boolean
          active_since?: string
        }
      }
      relatives: {
        Row: {
          id: string
          created_at: string
          pronoun: string
          firstname: string
          lastname: string
          notes: string
          patient_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          pronoun: string
          firstname: string
          lastname: string
          notes: string
          patient_id: string
        }
        Update: {
          id?: string
          created_at?: string
          pronoun?: string
          firstname?: string
          lastname?: string
          notes?: string
          patient_id?: string
        }
      }
    }
  }
}