import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserLocation } from '../types';

// Default Supabase project credentials provided
const DEFAULT_SUPABASE_URL = 'https://vzaphfmwjjcoiaafmrbh.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'sb_publishable_c4S1411CtcSRC20nbMnTdQ_CG45X-Wu';

export const SUPABASE_URL: string =
  (import.meta.env.VITE_SUPABASE_URL as string) || DEFAULT_SUPABASE_URL;

export const SUPABASE_ANON_KEY: string =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || DEFAULT_SUPABASE_ANON_KEY;

// Check if valid client-side configuration is available
export const isSupabaseConfigured = Boolean(
  SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL !== 'https://your-project.supabase.co'
);

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseInstance) {
    supabaseInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  }
  return supabaseInstance;
}

export const supabase = getSupabase();

// Types for Supabase Tables
export interface SupabaseProfile {
  id: string; // references auth.users.id
  full_name: string;
  email?: string | null;
  mobile?: string | null;
  age?: number | null;
  age_group?: string | null;
  active_location?: UserLocation | null;
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseSavedLocation {
  id?: string;
  user_id: string;
  area: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  slope_angle?: number;
  lithology?: string;
  is_primary?: boolean;
  created_at?: string;
}

export interface SupabaseAppointment {
  id?: string;
  user_id?: string | null;
  client_name: string;
  contact_number: string;
  email: string;
  service_type: string;
  state: string;
  district: string;
  area: string;
  latitude?: number | null;
  longitude?: number | null;
  preferred_date: string;
  preferred_time_slot: string;
  urgency_level: 'STANDARD' | 'EXPEDITED' | 'EMERGENCY_DISASTER_RESPONSE';
  site_notes?: string | null;
  status?: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  created_at?: string;
  updated_at?: string;
}

export interface SupabaseRiskRecord {
  id?: string;
  location_name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  risk_score: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  landslide_probability: number;
  soil_saturation: number;
  precipitation_mm: number;
  slope_angle: number;
  factor_of_safety: number;
  scenario: string;
  recorded_at?: string;
}
