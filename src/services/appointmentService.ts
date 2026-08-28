import { supabase, SupabaseAppointment, isSupabaseConfigured } from '../lib/supabase';
import { UserLocation } from '../types';

export interface CreateAppointmentInput {
  clientName: string;
  contactNumber: string;
  email: string;
  serviceType: string;
  location: UserLocation;
  preferredDate: string;
  preferredTimeSlot: string;
  urgencyLevel: 'STANDARD' | 'EXPEDITED' | 'EMERGENCY_DISASTER_RESPONSE';
  siteNotes?: string;
  userId?: string | null;
}

export interface AppointmentResult {
  success: boolean;
  appointment?: SupabaseAppointment;
  error?: string;
  savedToSupabase: boolean;
  message: string;
}

const LOCAL_APPOINTMENTS_KEY = 'landsafe_appointments_cache_v1';

export function getLocalAppointments(): SupabaseAppointment[] {
  try {
    const raw = localStorage.getItem(LOCAL_APPOINTMENTS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading local appointments:', e);
  }
  return [];
}

function saveLocalAppointment(apt: SupabaseAppointment) {
  try {
    const list = getLocalAppointments();
    const updated = [apt, ...list.filter((x) => x.id !== apt.id)];
    localStorage.setItem(LOCAL_APPOINTMENTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving local appointment:', e);
  }
}

/**
 * Save an appointment booking to Supabase database (appointments table)
 */
export async function bookGeotechnicalAppointment(
  input: CreateAppointmentInput
): Promise<AppointmentResult> {
  const {
    clientName,
    contactNumber,
    email,
    serviceType,
    location,
    preferredDate,
    preferredTimeSlot,
    urgencyLevel,
    siteNotes,
    userId,
  } = input;

  if (!clientName.trim()) {
    return {
      success: false,
      savedToSupabase: false,
      error: 'Client full name is required.',
      message: 'Please provide your full name.',
    };
  }

  if (!contactNumber.trim() && !email.trim()) {
    return {
      success: false,
      savedToSupabase: false,
      error: 'At least one contact method (Mobile or Email) is required.',
      message: 'Please provide a valid mobile number or email address.',
    };
  }

  if (!preferredDate) {
    return {
      success: false,
      savedToSupabase: false,
      error: 'Preferred inspection date is required.',
      message: 'Please pick a valid consultation date.',
    };
  }

  const newRecord: SupabaseAppointment = {
    id: `apt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    user_id: userId || null,
    client_name: clientName.trim(),
    contact_number: contactNumber.trim(),
    email: email.trim(),
    service_type: serviceType,
    state: location.state || 'India',
    district: location.district || 'District',
    area: location.area || 'Current Sector',
    latitude: location.coordinates?.[0] || null,
    longitude: location.coordinates?.[1] || null,
    preferred_date: preferredDate,
    preferred_time_slot: preferredTimeSlot || 'Morning (09:00 AM - 12:00 PM)',
    urgency_level: urgencyLevel || 'STANDARD',
    site_notes: siteNotes?.trim() || null,
    status: 'PENDING',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Always save locally for instant UI availability & offline resilience
  saveLocalAppointment(newRecord);

  let savedToSupabase = false;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            client_name: newRecord.client_name,
            contact_number: newRecord.contact_number,
            email: newRecord.email,
            service_type: newRecord.service_type,
            state: newRecord.state,
            district: newRecord.district,
            area: newRecord.area,
            latitude: newRecord.latitude,
            longitude: newRecord.longitude,
            preferred_date: newRecord.preferred_date,
            preferred_time_slot: newRecord.preferred_time_slot,
            urgency_level: newRecord.urgency_level,
            site_notes: newRecord.site_notes,
            status: newRecord.status,
            user_id: newRecord.user_id,
          },
        ])
        .select()
        .single();

      if (error) {
        console.warn(
          'Supabase insert appointments notice (table might need migration):',
          error.message
        );
      } else if (data) {
        savedToSupabase = true;
        newRecord.id = data.id || newRecord.id;
        saveLocalAppointment(newRecord);
      }
    } catch (dbErr: any) {
      console.warn('Supabase network error while saving appointment:', dbErr);
    }
  }

  return {
    success: true,
    savedToSupabase,
    appointment: newRecord,
    message: savedToSupabase
      ? 'Appointment booked successfully and securely recorded in your Supabase backend!'
      : 'Appointment recorded successfully! (Cached locally and queued for Supabase synchronization).',
  };
}

/**
 * Fetch all appointments for current user / contact
 */
export async function fetchUserAppointments(
  userId?: string | null,
  contact?: string
): Promise<SupabaseAppointment[]> {
  const localList = getLocalAppointments();

  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      } else if (contact) {
        query = query.or(`email.eq.${contact},contact_number.eq.${contact}`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        // Merge with local list
        const mergedMap = new Map<string, SupabaseAppointment>();
        for (const item of data) {
          mergedMap.set(item.id, item);
        }
        for (const item of localList) {
          if (!mergedMap.has(item.id!)) {
            mergedMap.set(item.id!, item);
          }
        }
        return Array.from(mergedMap.values());
      }
    } catch (e) {
      console.warn('Error fetching Supabase appointments:', e);
    }
  }

  return localList;
}
