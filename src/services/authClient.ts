import { UserLocation, UserProfile, AgeGroup } from '../types';
import { DEFAULT_USER_LOCATION } from '../data/locations';
import { supabase, isSupabaseConfigured, SupabaseProfile } from '../lib/supabase';
import { recordSuccessfulLogin } from './loginActivityService';

export interface LocalAuthUser {
  id: string;
  name: string;
  contact: string;
  contactType: 'mobile' | 'email';
  mobile?: string;
  email?: string;
  password?: string;
  age: number;
  ageGroup: AgeGroup;
  location: UserLocation;
  createdAt: string;
}

const LOCAL_USERS_KEY = 'landsafe_local_users_v3';
const SESSION_AUTH_KEY = 'landsafe_auth_token_v3';

function getLocalUsers(): LocalAuthUser[] {
  try {
    const raw = localStorage.getItem(LOCAL_USERS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading local users:', e);
  }
  return [];
}

function saveLocalUsers(users: LocalAuthUser[]) {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('Error saving local users:', e);
  }
}

/**
 * Helper to convert identifier to Supabase email
 */
function toSupabaseEmail(identifier: string, contactType?: 'mobile' | 'email'): string {
  const clean = identifier.trim().toLowerCase();
  if (clean.includes('@')) {
    return clean;
  }
  const digits = clean.replace(/\D/g, '');
  const mobileDigits = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
  return `mobile_${mobileDigits}@landsafe.internal`;
}

/**
 * Unified Login with Supabase Auth + Fallback
 */
export async function clientLogin(
  identifier: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: UserProfile; token?: string; canForgotPassword?: boolean }> {
  if (!identifier.trim() || !password) {
    return { success: false, error: 'Please enter both identifier and password.' };
  }

  const clean = identifier.trim().toLowerCase();
  const digitsOnly = clean.replace(/\D/g, '');
  const normalizedMobile = digitsOnly.length === 12 && digitsOnly.startsWith('91') ? digitsOnly.slice(2) : digitsOnly;
  const isEmail = clean.includes('@');
  const supaEmail = toSupabaseEmail(clean, isEmail ? 'email' : 'mobile');

  // 1. Try Supabase Auth First
  if (isSupabaseConfigured) {
    try {
      const { data: supaAuth, error: supaError } = await supabase.auth.signInWithPassword({
        email: supaEmail,
        password,
      });

      if (!supaError && supaAuth.user) {
        // Fetch profile from Supabase profiles table
        let userLocation = DEFAULT_USER_LOCATION;
        let userName = supaAuth.user.user_metadata?.full_name || supaAuth.user.user_metadata?.name || 'Operator';
        let userAge = supaAuth.user.user_metadata?.age;
        let userAgeGroup = supaAuth.user.user_metadata?.age_group || '18–24';

        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supaAuth.user.id)
            .single();

          if (profileData) {
            userName = profileData.full_name || userName;
            userAge = profileData.age || userAge;
            userAgeGroup = profileData.age_group || userAgeGroup;
            if (profileData.active_location) {
              userLocation = profileData.active_location;
            }
          }
        } catch (pErr) {
          console.warn('Profile fetch notice:', pErr);
        }

        // Fetch user's saved locations
        let savedLocs: UserLocation[] = [userLocation];
        try {
          const { data: savedData } = await supabase
            .from('saved_locations')
            .select('*')
            .eq('user_id', supaAuth.user.id);

          if (savedData && savedData.length > 0) {
            savedLocs = savedData.map((s) => ({
              area: s.area || 'Saved Area',
              district: s.district || '',
              state: s.state || '',
              country: 'India',
              latitude: Number(s.latitude) || 0,
              longitude: Number(s.longitude) || 0,
              coordinates: {
                lat: Number(s.latitude) || 0,
                lng: Number(s.longitude) || 0,
              },
              elevation: Number(s.elevation) || 350,
              slopeAngle: Number(s.slope_angle) || 15,
              lithology: s.lithology || 'Alluvium and Sedimentary Colluvium',
              riskScore: Number(s.risk_score) || 35,
              riskLevel: (s.risk_level || 'LOW') as any,
              isHazardMonitored: Boolean(s.is_hazard_monitored),
            }));
          }
        } catch (sErr) {
          console.warn('Saved locations fetch notice:', sErr);
        }

        const sessionToken = supaAuth.session?.access_token || `supa_${Date.now()}`;
        sessionStorage.setItem(SESSION_AUTH_KEY, sessionToken);

        // Record secure login activity in Supabase audit table
        recordSuccessfulLogin({
          userId: supaAuth.user.id,
          userName,
          phone: isEmail ? undefined : normalizedMobile,
          email: isEmail ? clean : supaAuth.user.email,
          loginMethod: isEmail ? 'EMAIL_AUTH' : 'PHONE_AUTH',
          location: userLocation,
        }).catch((err) => console.warn('Non-blocking login activity log notice:', err));

        return {
          success: true,
          user: {
            name: userName,
            mobile: isEmail ? '' : normalizedMobile,
            email: isEmail ? clean : '',
            age: userAge,
            ageGroup: userAgeGroup,
            location: userLocation,
            savedLocations: savedLocs,
            onboarded: true,
            registeredAt: supaAuth.user.created_at,
          },
          token: sessionToken,
        };
      }
    } catch (supaNetErr) {
      console.warn('Supabase Auth network attempt:', supaNetErr);
    }
  }

  // 2. Try server-side authentication
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: clean, password }),
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (response.ok && data.success && data.user) {
        if (data.token) {
          sessionStorage.setItem(SESSION_AUTH_KEY, data.token);
        }

        // Record login activity
        recordSuccessfulLogin({
          userId: data.user.id,
          userName: data.user.name,
          phone: data.user.mobile,
          email: data.user.email,
          loginMethod: isEmail ? 'EMAIL_AUTH' : 'PHONE_AUTH',
          location: data.user.location || DEFAULT_USER_LOCATION,
        }).catch((err) => console.warn('Non-blocking login activity log notice:', err));

        return {
          success: true,
          user: {
            name: data.user.name,
            mobile: data.user.mobile || '',
            email: data.user.email || '',
            age: data.user.age,
            ageGroup: data.user.ageGroup || '18–24',
            location: data.user.location || DEFAULT_USER_LOCATION,
            savedLocations: [data.user.location || DEFAULT_USER_LOCATION],
            onboarded: true,
            registeredAt: data.user.registeredAt || new Date().toISOString(),
          },
          token: data.token,
        };
      } else if (!data.success && data.canForgotPassword) {
        return {
          success: false,
          error: data.error || 'Invalid login details.',
          canForgotPassword: true,
        };
      }
    }
  } catch (netErr) {
    console.warn('Backend login endpoint unavailable, checking local user registry:', netErr);
  }

  // 3. Client-side local user registry fallback
  const localUsers = getLocalUsers();
  const found = localUsers.find((u) => {
    const uContact = u.contact.toLowerCase();
    const uDigits = uContact.replace(/\D/g, '');
    const uNormMobile = uDigits.length === 12 && uDigits.startsWith('91') ? uDigits.slice(2) : uDigits;

    return uContact === clean || (normalizedMobile.length === 10 && uNormMobile === normalizedMobile);
  });

  if (found) {
    if (found.password && found.password === password) {
      const sessionToken = `tok_${Date.now()}`;
      sessionStorage.setItem(SESSION_AUTH_KEY, sessionToken);

      // Record login activity
      recordSuccessfulLogin({
        userId: found.id,
        userName: found.name,
        phone: found.mobile,
        email: found.email,
        loginMethod: found.contactType === 'email' ? 'EMAIL_AUTH' : 'PHONE_AUTH',
        location: found.location || DEFAULT_USER_LOCATION,
      }).catch((err) => console.warn('Non-blocking login activity log notice:', err));

      return {
        success: true,
        user: {
          name: found.name,
          mobile: found.mobile || '',
          email: found.email || '',
          age: found.age,
          ageGroup: found.ageGroup,
          location: found.location || DEFAULT_USER_LOCATION,
          savedLocations: [found.location || DEFAULT_USER_LOCATION],
          onboarded: true,
          registeredAt: found.createdAt,
        },
        token: sessionToken,
      };
    } else {
      return {
        success: false,
        error: 'Invalid password. Please check your credentials.',
        canForgotPassword: true,
      };
    }
  }

  return {
    success: false,
    error: 'No account found with this identifier. Please verify your details or create an account.',
    canForgotPassword: false,
  };
}

/**
 * Unified Registration with Supabase Auth + Supabase Tables + Fallbacks
 */
export async function clientRegister(data: {
  name: string;
  contact: string;
  contactType: 'mobile' | 'email';
  password: string;
  age: number;
  location: UserLocation;
}): Promise<{ success: boolean; error?: string; user?: UserProfile; token?: string }> {
  const { name, contact, contactType, password, age, location } = data;

  const cleanContact = contact.trim().toLowerCase();
  const ageGroup: AgeGroup =
    age < 18
      ? 'Under 18'
      : age <= 24
      ? '18–24'
      : age <= 34
      ? '25–34'
      : age <= 44
      ? '35–44'
      : age <= 54
      ? '45–54'
      : '55+';

  const supaEmail = toSupabaseEmail(cleanContact, contactType);

  // 1. Register with Supabase Auth
  let supaUserId: string | null = null;
  if (isSupabaseConfigured) {
    try {
      const { data: supaAuth, error: supaError } = await supabase.auth.signUp({
        email: supaEmail,
        password,
        options: {
          data: {
            full_name: name.trim(),
            mobile: contactType === 'mobile' ? cleanContact : undefined,
            age,
            age_group: ageGroup,
            location,
          },
        },
      });

      if (supaAuth?.user) {
        supaUserId = supaAuth.user.id;

        // Upsert to Supabase profiles table
        try {
          await supabase.from('profiles').upsert({
            id: supaUserId,
            full_name: name.trim(),
            email: contactType === 'email' ? cleanContact : supaEmail,
            mobile: contactType === 'mobile' ? cleanContact : null,
            age,
            age_group: ageGroup,
            active_location: location,
            updated_at: new Date().toISOString(),
          });

          // Insert into saved_locations table
          if (location && location.coordinates) {
            await supabase.from('saved_locations').insert({
              user_id: supaUserId,
              area: location.area,
              district: location.district,
              state: location.state,
              latitude: location.coordinates[0],
              longitude: location.coordinates[1],
              elevation: location.elevation || 250,
              slope_angle: location.slopeAngle || 14.5,
              lithology: location.lithology || 'Metamorphic Complex',
              is_primary: true,
            });
          }
        } catch (dbErr) {
          console.warn('Supabase profile/location sync notice:', dbErr);
        }
      }
    } catch (supaErr) {
      console.warn('Supabase sign-up notice (continuing with local & server resilience):', supaErr);
    }
  }

  // 2. Save to client-side store
  const localUsers = getLocalUsers();
  const existingIdx = localUsers.findIndex((u) => u.contact.toLowerCase() === cleanContact);
  const newUserRecord: LocalAuthUser = {
    id: supaUserId || `local_user_${Date.now()}`,
    name: name.trim(),
    contact: cleanContact,
    contactType,
    mobile: contactType === 'mobile' ? cleanContact : undefined,
    email: contactType === 'email' ? cleanContact : undefined,
    password,
    age,
    ageGroup,
    location,
    createdAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    localUsers[existingIdx] = newUserRecord;
  } else {
    localUsers.push(newUserRecord);
  }
  saveLocalUsers(localUsers);

  // 3. Sync with server
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const sData = await response.json();
      if (response.ok && sData.success && sData.user) {
        if (sData.token) {
          sessionStorage.setItem(SESSION_AUTH_KEY, sData.token);
        }

        // Record initial registration login activity
        recordSuccessfulLogin({
          userId: sData.user.id || supaUserId,
          userName: sData.user.name,
          phone: sData.user.mobile,
          email: sData.user.email,
          loginMethod: 'NEW_REGISTRATION',
          location: sData.user.location || location,
        }).catch((err) => console.warn('Non-blocking registration activity log notice:', err));

        return {
          success: true,
          user: {
            name: sData.user.name,
            mobile: sData.user.mobile || '',
            email: sData.user.email || '',
            age: sData.user.age,
            ageGroup: sData.user.ageGroup || ageGroup,
            location: sData.user.location || location,
            savedLocations: [sData.user.location || location],
            onboarded: true,
            registeredAt: sData.user.registeredAt || newUserRecord.createdAt,
          },
          token: sData.token,
        };
      }
    }
  } catch (err) {
    console.warn('Backend registration endpoint notice:', err);
  }

  const localToken = `tok_${Date.now()}`;
  sessionStorage.setItem(SESSION_AUTH_KEY, localToken);

  // Record initial registration login activity
  recordSuccessfulLogin({
    userId: newUserRecord.id,
    userName: newUserRecord.name,
    phone: newUserRecord.mobile,
    email: newUserRecord.email,
    loginMethod: 'NEW_REGISTRATION',
    location: newUserRecord.location,
  }).catch((err) => console.warn('Non-blocking registration activity log notice:', err));

  return {
    success: true,
    user: {
      name: newUserRecord.name,
      mobile: newUserRecord.mobile || '',
      email: newUserRecord.email || '',
      age: newUserRecord.age,
      ageGroup: newUserRecord.ageGroup,
      location: newUserRecord.location,
      savedLocations: [newUserRecord.location],
      onboarded: true,
      registeredAt: newUserRecord.createdAt,
    },
    token: localToken,
  };
}

/**
 * Unified Password Reset
 */
export async function clientResetPassword(
  identifier: string,
  newPassword: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  const clean = identifier.trim().toLowerCase();

  // Try Supabase Auth password reset if email
  if (isSupabaseConfigured && clean.includes('@')) {
    try {
      await supabase.auth.resetPasswordForEmail(clean);
    } catch (supaResetErr) {
      console.warn('Supabase reset password notice:', supaResetErr);
    }
  }

  // Try server
  try {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: clean, newPassword }),
    });
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      if (response.ok && data.success) {
        // Update local copy
        const localUsers = getLocalUsers();
        const found = localUsers.find((u) => u.contact.toLowerCase() === clean);
        if (found) {
          found.password = newPassword;
          saveLocalUsers(localUsers);
        }
        return { success: true, message: data.message };
      } else if (!data.success) {
        return { success: false, error: data.error };
      }
    }
  } catch (e) {
    console.warn('Backend reset password notice:', e);
  }

  // Update local
  const localUsers = getLocalUsers();
  const found = localUsers.find((u) => u.contact.toLowerCase() === clean);
  if (found) {
    found.password = newPassword;
    saveLocalUsers(localUsers);
    return {
      success: true,
      message: 'Password updated successfully. You can now log in with your new password.',
    };
  }

  return {
    success: true,
    message: 'If an account matches those details, the password has been reset. You can now log in.',
  };
}

export function clearClientSession() {
  try {
    sessionStorage.removeItem(SESSION_AUTH_KEY);
    sessionStorage.clear();
    if (isSupabaseConfigured) {
      supabase.auth.signOut().catch(() => {});
    }
  } catch (e) {
    console.error('Error clearing session:', e);
  }
}
