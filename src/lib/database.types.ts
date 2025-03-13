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
      admin_profiles: {
        Row: {
          id: string
          user_id: string
          name: string | null
          email: string | null
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      teacher_profiles: {
        Row: {
          id: string
          user_id: string
          name: string | null
          email: string | null
          specialties: string[] | null
          on_vacation: boolean | null
          avatar_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name?: string | null
          email?: string | null
          specialties?: string[] | null
          on_vacation?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string | null
          email?: string | null
          specialties?: string[] | null
          on_vacation?: boolean | null
          avatar_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      student_profiles: {
        Row: {
          id: string
          user_id: string
          name: string | null
          email: string | null
          membership_type: string | null
          last_check_in: string | null
          avatar_url: string | null
          tax_number: string | null
          phone_number: string | null
          billing_address: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name?: string | null
          email?: string | null
          membership_type?: string | null
          last_check_in?: string | null
          avatar_url?: string | null
          tax_number?: string | null
          phone_number?: string | null
          billing_address?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string | null
          email?: string | null
          membership_type?: string | null
          last_check_in?: string | null
          avatar_url?: string | null
          tax_number?: string | null
          phone_number?: string | null
          billing_address?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      classes: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string | null
          teacher_id: string | null
          date: string
          start_time: string
          end_time: string
          max_capacity: number | null
          enrolled_count: number | null
          image_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category?: string | null
          teacher_id?: string | null
          date: string
          start_time: string
          end_time: string
          max_capacity?: number | null
          enrolled_count?: number | null
          image_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string | null
          teacher_id?: string | null
          date?: string
          start_time?: string
          end_time?: string
          max_capacity?: number | null
          enrolled_count?: number | null
          image_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            referencedRelation: "teacher_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      enrollments: {
        Row: {
          id: string
          class_id: string | null
          student_id: string | null
          enrolled_at: string | null
          attended: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          class_id?: string | null
          student_id?: string | null
          enrolled_at?: string | null
          attended?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          class_id?: string | null
          student_id?: string | null
          enrolled_at?: string | null
          attended?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_class_id_fkey"
            columns: ["class_id"]
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      vacations: {
        Row: {
          id: string
          teacher_id: string | null
          teacher_name: string | null
          start_date: string
          end_date: string
          approved: boolean | null
          reason: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          teacher_id?: string | null
          teacher_name?: string | null
          start_date: string
          end_date: string
          approved?: boolean | null
          reason?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          teacher_id?: string | null
          teacher_name?: string | null
          start_date?: string
          end_date?: string
          approved?: boolean | null
          reason?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vacations_teacher_id_fkey"
            columns: ["teacher_id"]
            referencedRelation: "teacher_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      student_payments: {
        Row: {
          id: string
          student_id: string | null
          amount: number
          payment_date: string
          due_date: string
          status: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          student_id?: string | null
          amount: number
          payment_date: string
          due_date: string
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          student_id?: string | null
          amount?: number
          payment_date?: string
          due_date?: string
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_payments_student_id_fkey"
            columns: ["student_id"]
            referencedRelation: "student_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      teacher_classes: {
        Row: {
          id: string
          teacher_id: string | null
          class_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          teacher_id?: string | null
          class_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          teacher_id?: string | null
          class_id?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teacher_classes_teacher_id_fkey"
            columns: ["teacher_id"]
            referencedRelation: "teacher_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_classes_class_id_fkey"
            columns: ["class_id"]
            referencedRelation: "classes"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          title: string
          message: string
          type: string
          read: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          message: string
          type: string
          read?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          message?: string
          type?: string
          read?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          user_id: string
          theme: string
          language: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          user_id: string
          theme?: string
          language?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          user_id?: string
          theme?: string
          language?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
