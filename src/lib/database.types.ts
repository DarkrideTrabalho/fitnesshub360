
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
          name: string
          email: string
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          created_at?: string
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
          name: string
          email: string
          specialties: string[]
          on_vacation: boolean
          vacation_start_date: string | null
          vacation_end_date: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          specialties?: string[]
          on_vacation?: boolean
          vacation_start_date?: string | null
          vacation_end_date?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          specialties?: string[]
          on_vacation?: boolean
          vacation_start_date?: string | null
          vacation_end_date?: string | null
          avatar_url?: string | null
          created_at?: string
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
          name: string
          email: string
          membership_type: string
          last_check_in: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          membership_type?: string
          last_check_in?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          membership_type?: string
          last_check_in?: string | null
          avatar_url?: string | null
          created_at?: string
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
          description: string
          category: string
          teacher_id: string
          date: string
          start_time: string
          end_time: string
          max_capacity: number
          enrolled_count: number
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          teacher_id: string
          date: string
          start_time: string
          end_time: string
          max_capacity: number
          enrolled_count?: number
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          teacher_id?: string
          date?: string
          start_time?: string
          end_time?: string
          max_capacity?: number
          enrolled_count?: number
          image_url?: string | null
          created_at?: string
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
          class_id: string
          student_id: string
          enrolled_at: string
          attended: boolean
          created_at: string
        }
        Insert: {
          id?: string
          class_id: string
          student_id: string
          enrolled_at?: string
          attended?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          student_id?: string
          enrolled_at?: string
          attended?: boolean
          created_at?: string
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
          teacher_id: string
          start_date: string
          end_date: string
          approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          start_date: string
          end_date: string
          approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          start_date?: string
          end_date?: string
          approved?: boolean
          created_at?: string
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
