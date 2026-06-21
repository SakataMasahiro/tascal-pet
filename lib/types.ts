export type PlanType = 'starter' | 'standard' | 'pro'

export interface Hospital {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  plan: PlanType
  trial_ends_at: string
  created_at: string
}

export interface Pet {
  id: string
  hospital_id: string
  name: string
  species: 'dog' | 'cat' | 'other'
  breed?: string
  birth_date?: string
  weight?: number
  owner_name: string
  owner_phone?: string
  owner_email?: string
  allergies?: string
  medical_history?: string
  personality_memo?: string
  is_deceased: boolean
  deceased_date?: string
  memorial_message?: string
  created_at: string
}

export interface Appointment {
  id: string
  hospital_id: string
  pet_id: string
  pet?: Pet
  title: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
  created_at: string
}

export interface MedicalRecord {
  id: string
  pet_id: string
  hospital_id: string
  visit_date: string
  diagnosis?: string
  treatment?: string
  prescription?: string
  notes?: string
  vet_name?: string
  created_at: string
}

export interface Vaccine {
  id: string
  pet_id: string
  hospital_id: string
  vaccine_name: string
  administered_date: string
  next_due_date?: string
  notes?: string
  created_at: string
}

export interface CommunityEvent {
  id: string
  hospital_id: string
  title: string
  description?: string
  event_date: string
  location?: string
  max_participants?: number
  created_at: string
}

export interface Partner {
  id: string
  name: string
  email: string
  partner_code: string
  commission_rate: number
  created_at: string
}

export interface StaffMember {
  id: string
  hospital_id: string
  name: string
  email: string
  role: string
  created_at: string
}

export interface LuckyIndexLog {
  id: string
  hospital_id: string
  date: string
  score: number
  breakdown: {
    vet_notes_count?: number
    gratitude_count?: number
    new_pets_count?: number
  }
  created_at: string
}

export interface VetNote {
  id: string
  hospital_id: string
  pet_id: string
  mode: 'breakthrough' | 'steady' | 'concern'
  content: string
  created_at: string
}

export interface GratitudeMessage {
  id: string
  hospital_id: string
  pet_id?: string
  pet_name?: string
  owner_name?: string
  message: string
  created_at: string
}

export interface AdversityRecord {
  id: string
  hospital_id: string
  pet_id?: string
  pet_name?: string
  content: string
  recorded_at: string
  ai_reflection?: string
  reflection_sent_at?: string
}
