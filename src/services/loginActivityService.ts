import { supabase, isSupabaseConfigured, SupabaseLoginActivity } from '../lib/supabase';
import { UserLocation } from '../types';

const LOCAL_LOGIN_ACTIVITY_KEY = 'landsafe_login_activity_log_v1';
const DEBOUNCE_WINDOW_MS = 6000; // Prevent duplicate records within 6s

let lastRecordedTimestamp = 0;
let lastRecordedKey = '';

export interface RecordLoginParams {
  userId?: string | null;
  userName: string;
  phone?: string | null;
  email?: string | null;
  loginMethod: 'EMAIL_AUTH' | 'PHONE_AUTH' | 'MOBILE_CREDENTIALS' | 'SESSION_RESTORE' | 'NEW_REGISTRATION' | string;
  location?: UserLocation | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface ActivityFilterOptions {
  searchQuery?: string;
  loginMethod?: string;
  page?: number;
  limit?: number;
}

export interface LoginActivityStats {
  totalCount: number;
  emailLogins: number;
  phoneLogins: number;
  uniqueUsers: number;
  latestLoginTime?: string;
}

/**
 * Get local cached login activities for offline resiliency
 */
export function getLocalLoginActivity(): SupabaseLoginActivity[] {
  try {
    const raw = localStorage.getItem(LOCAL_LOGIN_ACTIVITY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Failed to parse local login activities:', e);
    return [];
  }
}

/**
 * Save to local cache
 */
function saveLocalLoginActivity(item: SupabaseLoginActivity) {
  try {
    const current = getLocalLoginActivity();
    // Prepend latest record
    const updated = [item, ...current.filter((c) => c.id !== item.id)].slice(0, 100);
    localStorage.setItem(LOCAL_LOGIN_ACTIVITY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to cache login activity locally:', e);
  }
}

/**
 * Securely records a successful user login event into Supabase and local cache.
 * STRICT SECURITY: Never stores passwords, tokens, or sensitive auth credentials.
 */
export async function recordSuccessfulLogin(
  params: RecordLoginParams
): Promise<{ success: boolean; record?: SupabaseLoginActivity; error?: string }> {
  const now = Date.now();
  const dedupKey = `${params.userId || ''}_${params.email || params.phone || params.userName}_${params.loginMethod}`;

  // Debounce check to prevent multiple rapid logs on React component remounts
  if (dedupKey === lastRecordedKey && now - lastRecordedTimestamp < DEBOUNCE_WINDOW_MS) {
    console.debug('Login activity debounced (already recorded recently)');
    return { success: true };
  }

  lastRecordedKey = dedupKey;
  lastRecordedTimestamp = now;

  const nowIso = new Date().toISOString();

  // Create clean audit record without any sensitive secrets
  const newActivityRecord: SupabaseLoginActivity = {
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    user_id: params.userId || null,
    user_name: (params.userName || 'Operator').trim(),
    phone: params.phone ? params.phone.trim() : null,
    email: params.email ? params.email.trim().toLowerCase() : null,
    login_method: params.loginMethod || 'EMAIL_AUTH',
    selected_area: params.location?.area || 'National Overview',
    district: params.location?.district || 'Central District',
    state: params.location?.state || 'India',
    status: 'SUCCESS',
    ip_address: params.ipAddress || null,
    user_agent: params.userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 200) : null),
    login_at: nowIso,
    created_at: nowIso,
  };

  // Always cache locally first so admin can see instant activity
  saveLocalLoginActivity(newActivityRecord);

  // Push to Supabase if connected
  if (isSupabaseConfigured) {
    try {
      const payload: Record<string, any> = {
        user_name: newActivityRecord.user_name,
        phone: newActivityRecord.phone,
        email: newActivityRecord.email,
        login_method: newActivityRecord.login_method,
        selected_area: newActivityRecord.selected_area,
        district: newActivityRecord.district,
        state: newActivityRecord.state,
        status: newActivityRecord.status,
        login_at: newActivityRecord.login_at,
        user_agent: newActivityRecord.user_agent,
      };

      // Only pass user_id if valid UUID format to avoid foreign key type errors
      if (
        params.userId &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.userId)
      ) {
        payload.user_id = params.userId;
      }

      const { data, error } = await supabase
        .from('login_activity')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.warn(
          'Supabase login_activity insert notice (table might need migration script):',
          error.message
        );
      } else if (data) {
        newActivityRecord.id = data.id || newActivityRecord.id;
        saveLocalLoginActivity(newActivityRecord);
      }
    } catch (dbErr: any) {
      console.warn('Supabase network error while recording login activity:', dbErr);
    }
  }

  return { success: true, record: newActivityRecord };
}

/**
 * Fetch login activity logs with search, method filtering, and pagination
 */
export async function fetchLoginActivity(
  options: ActivityFilterOptions = {}
): Promise<{
  records: SupabaseLoginActivity[];
  totalCount: number;
  stats: LoginActivityStats;
  source: 'supabase' | 'cache';
}> {
  const { searchQuery = '', loginMethod = 'ALL', page = 1, limit = 20 } = options;
  const localList = getLocalLoginActivity();

  let records: SupabaseLoginActivity[] = [];
  let source: 'supabase' | 'cache' = 'cache';

  if (isSupabaseConfigured) {
    try {
      let query = supabase
        .from('login_activity')
        .select('*', { count: 'exact' })
        .order('login_at', { ascending: false });

      if (loginMethod && loginMethod !== 'ALL') {
        query = query.eq('login_method', loginMethod);
      }

      if (searchQuery.trim()) {
        const q = `%${searchQuery.trim()}%`;
        query = query.or(
          `user_name.ilike.${q},email.ilike.${q},phone.ilike.${q},selected_area.ilike.${q},state.ilike.${q},district.ilike.${q}`
        );
      }

      const offset = (page - 1) * limit;
      query = query.range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        records = data;
        source = 'supabase';
      }
    } catch (err) {
      console.warn('Error fetching login activity from Supabase:', err);
    }
  }

  // If Supabase query returned no records or failed, use local cache
  if (records.length === 0) {
    let filtered = [...localList];

    if (loginMethod && loginMethod !== 'ALL') {
      filtered = filtered.filter((r) => r.login_method === loginMethod);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.user_name?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.phone?.toLowerCase().includes(q) ||
          r.selected_area?.toLowerCase().includes(q) ||
          r.state?.toLowerCase().includes(q) ||
          r.district?.toLowerCase().includes(q)
      );
    }

    const start = (page - 1) * limit;
    records = filtered.slice(start, start + limit);
  }

  // Calculate statistics across all available records
  const allForStats = source === 'supabase' && records.length > 0 ? records : localList;
  const uniqueUserMap = new Set<string>();
  let emailCount = 0;
  let phoneCount = 0;

  for (const item of allForStats) {
    const identifier = item.email || item.phone || item.user_id || item.user_name;
    if (identifier) uniqueUserMap.add(identifier);

    if (
      item.login_method === 'EMAIL_AUTH' ||
      item.login_method === 'EMAIL_PASSWORD' ||
      Boolean(item.email)
    ) {
      emailCount++;
    } else if (
      item.login_method === 'PHONE_AUTH' ||
      item.login_method === 'MOBILE_CREDENTIALS' ||
      Boolean(item.phone)
    ) {
      phoneCount++;
    }
  }

  const stats: LoginActivityStats = {
    totalCount: allForStats.length,
    emailLogins: emailCount,
    phoneLogins: phoneCount,
    uniqueUsers: uniqueUserMap.size,
    latestLoginTime: allForStats[0]?.login_at || undefined,
  };

  return {
    records,
    totalCount: allForStats.length,
    stats,
    source,
  };
}

/**
 * Real-time Supabase subscription for Admin Login Activity monitoring
 */
export function subscribeToLoginActivity(
  onNewActivity: (activity: SupabaseLoginActivity) => void
): () => void {
  if (!isSupabaseConfigured) {
    return () => {};
  }

  try {
    const channel = supabase
      .channel('realtime_login_activity_feed')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'login_activity',
        },
        (payload) => {
          if (payload.new) {
            onNewActivity(payload.new as SupabaseLoginActivity);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Realtime subscription to login_activity notice:', err);
    return () => {};
  }
}
