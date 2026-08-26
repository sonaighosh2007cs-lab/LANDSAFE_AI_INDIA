import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { UserLocation } from '../src/types';

export interface StoredUser {
  id: string;
  name: string;
  contact: string; // normalized mobile or email
  contactType: 'mobile' | 'email';
  mobile?: string;
  email?: string;
  passwordHash: string;
  salt: string;
  age: number;
  ageGroup: string;
  location: UserLocation;
  failedAttempts: number;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), '.data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
      console.warn('Could not create .data directory, will use in-memory store:', e);
    }
  }
}

// In-memory fallback
let inMemoryUsers: Map<string, StoredUser> = new Map();

function loadUsers(): Map<string, StoredUser> {
  ensureDataDir();
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      const list: StoredUser[] = JSON.parse(data);
      const map = new Map<string, StoredUser>();
      for (const u of list) {
        map.set(u.contact.toLowerCase(), u);
      }
      inMemoryUsers = map;
      return map;
    }
  } catch (err) {
    console.error('Error loading users file:', err);
  }
  return inMemoryUsers;
}

function saveUsers(usersMap: Map<string, StoredUser>) {
  inMemoryUsers = usersMap;
  ensureDataDir();
  try {
    const list = Array.from(usersMap.values());
    fs.writeFileSync(USERS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving users file:', err);
  }
}

// Password hashing with scrypt
function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(checkHash, 'hex'), Buffer.from(hash, 'hex'));
}

// Convert age number to AgeGroup
function getAgeGroup(age: number): string {
  if (age < 18) return 'Under 18';
  if (age <= 24) return '18–24';
  if (age <= 34) return '25–34';
  if (age <= 44) return '35–44';
  if (age <= 54) return '45–54';
  return '55+';
}

export function registerUser(data: {
  name: string;
  contact: string;
  contactType: 'mobile' | 'email';
  password: string;
  age: number;
  location: UserLocation;
}): { success: boolean; error?: string; user?: any; token?: string } {
  const { name, contact, contactType, password, age, location } = data;

  if (!name || name.trim().length < 2) {
    return { success: false, error: 'Please enter a valid full name.' };
  }

  const cleanContact = contact.trim().toLowerCase();
  if (contactType === 'mobile') {
    const digits = cleanContact.replace(/\D/g, '');
    const mobileDigits = digits.length === 12 && digits.startsWith('91') ? digits.slice(2) : digits;
    if (mobileDigits.length !== 10 || !/^[6-9]/.test(mobileDigits)) {
      return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
    }
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanContact)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }
  }

  if (!password || password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters long.' };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return { success: false, error: 'Password must contain at least one letter and one number.' };
  }

  const numAge = Number(age);
  if (isNaN(numAge) || numAge < 10 || numAge > 120) {
    return { success: false, error: 'Please enter a reasonable numeric age.' };
  }

  if (!location || !location.district || !location.coordinates) {
    return { success: false, error: 'Please select a valid location in India.' };
  }

  const users = loadUsers();
  const normalizedKey = cleanContact;

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);

  const newUser: StoredUser = {
    id: `user_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
    name: name.trim(),
    contact: normalizedKey,
    contactType,
    mobile: contactType === 'mobile' ? cleanContact : undefined,
    email: contactType === 'email' ? cleanContact : undefined,
    passwordHash,
    salt,
    age: numAge,
    ageGroup: getAgeGroup(numAge),
    location,
    failedAttempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.set(normalizedKey, newUser);
  saveUsers(users);

  const token = crypto.randomBytes(32).toString('hex');

  return {
    success: true,
    user: {
      id: newUser.id,
      name: newUser.name,
      mobile: newUser.mobile || '',
      email: newUser.email || '',
      age: newUser.age,
      ageGroup: newUser.ageGroup,
      location: newUser.location,
      onboarded: true,
      registeredAt: newUser.createdAt,
    },
    token,
  };
}

export function loginUser(identifier: string, password: string): {
  success: boolean;
  error?: string;
  user?: any;
  token?: string;
  failedAttempts?: number;
  canForgotPassword?: boolean;
} {
  if (!identifier || !identifier.trim() || !password) {
    return {
      success: false,
      error: 'Please enter both login identifier and password.',
    };
  }

  const clean = identifier.trim().toLowerCase();
  // Strip non-digits if mobile number format
  const digitsOnly = clean.replace(/\D/g, '');
  const normalizedMobile = digitsOnly.length === 12 && digitsOnly.startsWith('91') ? digitsOnly.slice(2) : digitsOnly;

  const users = loadUsers();

  // Find user by exact contact or normalized mobile
  let foundUser: StoredUser | undefined = users.get(clean);
  if (!foundUser && normalizedMobile.length === 10) {
    for (const u of users.values()) {
      const uDigits = u.contact.replace(/\D/g, '');
      const uMobile = uDigits.length === 12 && uDigits.startsWith('91') ? uDigits.slice(2) : uDigits;
      if (uMobile === normalizedMobile) {
        foundUser = u;
        break;
      }
    }
  }

  if (!foundUser) {
    // Constant time dummy check to prevent timing attacks
    const dummySalt = '00000000000000000000000000000000';
    hashPassword(password, dummySalt);
    return {
      success: false,
      error: 'Invalid login details.',
      failedAttempts: 1,
      canForgotPassword: false,
    };
  }

  const isValid = verifyPassword(password, foundUser.passwordHash, foundUser.salt);

  if (!isValid) {
    foundUser.failedAttempts = (foundUser.failedAttempts || 0) + 1;
    foundUser.updatedAt = new Date().toISOString();
    users.set(foundUser.contact.toLowerCase(), foundUser);
    saveUsers(users);

    const attempts = foundUser.failedAttempts;
    return {
      success: false,
      error: 'Invalid login details.',
      failedAttempts: attempts,
      canForgotPassword: attempts >= 2,
    };
  }

  // Reset failed attempts on success
  foundUser.failedAttempts = 0;
  foundUser.updatedAt = new Date().toISOString();
  users.set(foundUser.contact.toLowerCase(), foundUser);
  saveUsers(users);

  const token = crypto.randomBytes(32).toString('hex');

  return {
    success: true,
    user: {
      id: foundUser.id,
      name: foundUser.name,
      mobile: foundUser.mobile || '',
      email: foundUser.email || '',
      age: foundUser.age,
      ageGroup: foundUser.ageGroup,
      location: foundUser.location,
      onboarded: true,
      registeredAt: foundUser.createdAt,
    },
    token,
  };
}

export function resetPassword(
  identifier: string,
  newPassword: string
): { success: boolean; error?: string; message?: string } {
  if (!identifier || !identifier.trim()) {
    return { success: false, error: 'Please provide your registered mobile number or email.' };
  }

  if (!newPassword || newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters long.' };
  }

  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  if (!hasLetter || !hasNumber) {
    return { success: false, error: 'Password must contain at least one letter and one number.' };
  }

  const clean = identifier.trim().toLowerCase();
  const digitsOnly = clean.replace(/\D/g, '');
  const normalizedMobile = digitsOnly.length === 12 && digitsOnly.startsWith('91') ? digitsOnly.slice(2) : digitsOnly;

  const users = loadUsers();

  let foundUser: StoredUser | undefined = users.get(clean);
  if (!foundUser && normalizedMobile.length === 10) {
    for (const u of users.values()) {
      const uDigits = u.contact.replace(/\D/g, '');
      const uMobile = uDigits.length === 12 && uDigits.startsWith('91') ? uDigits.slice(2) : uDigits;
      if (uMobile === normalizedMobile) {
        foundUser = u;
        break;
      }
    }
  }

  if (!foundUser) {
    // For security, don't confirm if account exists, but return success message or general error
    return {
      success: true,
      message: 'If an account matches those details, the password has been reset. You can now log in.',
    };
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(newPassword, salt);

  foundUser.passwordHash = passwordHash;
  foundUser.salt = salt;
  foundUser.failedAttempts = 0;
  foundUser.updatedAt = new Date().toISOString();

  users.set(foundUser.contact.toLowerCase(), foundUser);
  saveUsers(users);

  return {
    success: true,
    message: 'Password successfully updated. You can now log in with your new password.',
  };
}
