import { UserLocation, UserProfile, AgeGroup } from '../types';
import { DEFAULT_USER_LOCATION } from '../data/locations';

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

  // 1. Try server-side authentication first
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
      } else if (!data.success) {
        return {
          success: false,
          error: data.error || 'Invalid login details.',
          canForgotPassword: Boolean(data.canForgotPassword),
        };
      }
    }
  } catch (netErr) {
    console.warn('Backend login endpoint unavailable, checking local user registry:', netErr);
  }

  // 2. Client-side local user registry fallback
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

  // Save to client-side store
  const localUsers = getLocalUsers();
  const existingIdx = localUsers.findIndex((u) => u.contact.toLowerCase() === cleanContact);
  const newUserRecord: LocalAuthUser = {
    id: `local_user_${Date.now()}`,
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

  // Sync with server if available
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
    console.warn('Backend registration endpoint offline, using local registry:', err);
  }

  const localToken = `tok_${Date.now()}`;
  sessionStorage.setItem(SESSION_AUTH_KEY, localToken);
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

export async function clientResetPassword(
  identifier: string,
  newPassword: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  const clean = identifier.trim().toLowerCase();

  // Try server first
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
        // Also update local copy
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
    console.warn('Backend reset password unavailable, updating local user:', e);
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
  } catch (e) {
    console.error('Error clearing session:', e);
  }
}
