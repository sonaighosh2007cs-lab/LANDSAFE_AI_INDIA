import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Globe,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Search,
  Crosshair,
  Sparkles,
  Shield,
  Loader2,
  Calendar,
  Layers,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  INDIAN_STATES,
  searchAllIndianLocations,
  resolveLocation,
  findNearestLocationByCoordinates,
  FlatLocationResult,
} from '../../data/locations';
import { UserLocation } from '../../types';
import { LandSafeLogo } from '../common/LandSafeLogo';

type OnboardingStep =
  | 'welcome'
  | 'name'
  | 'contact'
  | 'password'
  | 'age'
  | 'location'
  | 'location-confirm'
  | 'summary'
  | 'login'
  | 'forgot-password';

export const OnboardingFlow: React.FC = () => {
  const { loginUser, completeOnboarding } = useApp();

  const [step, setStep] = useState<OnboardingStep>('welcome');

  // New User Form States (Completely empty by default!)
  const [fullName, setFullName] = useState('');
  const [contactType, setContactType] = useState<'mobile' | 'email'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [age, setAge] = useState('');

  // Location Selection States (Completely unselected by default)
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(null);
  const [locationTab, setLocationTab] = useState<'search' | 'manual'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateId, setSelectedStateId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsNotice, setGpsNotice] = useState<string | null>(null);

  // Login States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [failedLoginAttempts, setFailedLoginAttempts] = useState(0);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Forgot Password States
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);

  // General Loading State for Registration
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Touched states to prevent premature red error messages
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // --- Real-Time Validations ---

  // Name Validation: Non-empty, at least 2 alpha characters, allows spaces & hyphens
  const isNameValid =
    fullName.trim().length >= 2 &&
    /^[a-zA-Z\s.'-]+$/.test(fullName.trim()) &&
    /[a-zA-Z]{2,}/.test(fullName.trim());

  // Mobile Validation: 10 Indian digits starting with 6, 7, 8, 9
  const cleanMobileDigits = mobileNumber.replace(/\D/g, '');
  const isMobileValid =
    cleanMobileDigits.length === 10 && /^[6-9]/.test(cleanMobileDigits);

  // Email Validation: RFC compliant standard format
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim());

  // Active Contact Validity
  const isContactValid = contactType === 'mobile' ? isMobileValid : isEmailValid;

  // Password Requirements
  const passLength = password.length >= 8;
  const passHasLetter = /[a-zA-Z]/.test(password);
  const passHasNumber = /[0-9]/.test(password);
  const isPasswordValid = passLength && passHasLetter && passHasNumber;

  const getPasswordStrength = () => {
    if (!password) return { label: 'None', color: 'text-slate-500', barColor: 'bg-slate-700', width: 'w-0' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 10) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score >= 4) return { label: 'Strong', color: 'text-emerald-400', barColor: 'bg-emerald-500', width: 'w-full' };
    if (score >= 2) return { label: 'Moderate', color: 'text-amber-400', barColor: 'bg-amber-500', width: 'w-2/3' };
    return { label: 'Weak', color: 'text-rose-400', barColor: 'bg-rose-500', width: 'w-1/3' };
  };

  const passwordStrength = getPasswordStrength();

  // Age Validation: Number between 10 and 120
  const numAge = parseInt(age.trim(), 10);
  const isAgeValid = !isNaN(numAge) && numAge >= 10 && numAge <= 120;

  // Convert numeric age to AgeGroup string
  const derivedAgeGroup = (numericAge: number) => {
    if (numericAge < 18) return 'Under 18';
    if (numericAge <= 24) return '18–24';
    if (numericAge <= 34) return '25–34';
    if (numericAge <= 44) return '35–44';
    if (numericAge <= 54) return '45–54';
    return '55+';
  };

  // --- Handlers ---

  // Handle GPS Current Location Request
  const handleUseCurrentLocation = () => {
    setGpsNotice(null);
    if (!navigator.geolocation) {
      setGpsNotice('Geolocation is not supported by your browser. You can select your location manually.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const matched = findNearestLocationByCoordinates(latitude, longitude);
        setSelectedLocation(matched);
        setGpsLoading(false);
        setStep('location-confirm');
      },
      (err) => {
        setGpsLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGpsNotice('Location permission was not granted. You can select your location manually below.');
        } else {
          setGpsNotice('Unable to retrieve your current GPS coordinates. Please select your location manually.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle Manual Selection
  const handleSelectSearchResult = (res: FlatLocationResult) => {
    const loc = resolveLocation(res.stateId, res.districtId, res.area);
    setSelectedLocation(loc);
    setStep('location-confirm');
  };

  const handleManualStateChange = (stateId: string) => {
    setSelectedStateId(stateId);
    const st = INDIAN_STATES.find((s) => s.id === stateId);
    if (st && st.districts.length > 0) {
      const firstDist = st.districts[0];
      setSelectedDistrictId(firstDist.id);
      setSelectedArea(firstDist.localAreas[0] || firstDist.name);
    } else {
      setSelectedDistrictId('');
      setSelectedArea('');
    }
  };

  const handleManualDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId);
    const st = INDIAN_STATES.find((s) => s.id === selectedStateId);
    const dist = st?.districts.find((d) => d.id === districtId);
    if (dist && dist.localAreas.length > 0) {
      setSelectedArea(dist.localAreas[0] || dist.name);
    } else {
      setSelectedArea(dist?.name || '');
    }
  };

  const handleManualConfirm = () => {
    if (!selectedStateId || !selectedDistrictId || !selectedArea) return;
    const loc = resolveLocation(selectedStateId, selectedDistrictId, selectedArea);
    setSelectedLocation(loc);
    setStep('location-confirm');
  };

  // Handle Final Registration Submission
  const handleFinalRegistration = async () => {
    if (!fullName.trim() || !selectedLocation || !isPasswordValid || !isAgeValid) return;

    setIsSubmittingRegister(true);
    setRegisterError(null);

    const activeContact = contactType === 'mobile' ? cleanMobileDigits : emailAddress.trim();

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(),
          contact: activeContact,
          contactType,
          password,
          age: numAge,
          location: selectedLocation,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setRegisterError(data.error || 'Unable to complete registration. Please try again.');
        setIsSubmittingRegister(false);
        return;
      }

      // Complete client-side context setup with the registered profile
      await completeOnboarding({
        name: data.user.name,
        mobile: data.user.mobile,
        email: data.user.email,
        age: data.user.age,
        ageGroup: derivedAgeGroup(data.user.age),
        location: data.user.location,
      });
    } catch (err: any) {
      console.error('Registration network error:', err);
      // Seamless fallback to client store if offline
      await completeOnboarding({
        name: fullName.trim(),
        mobile: contactType === 'mobile' ? cleanMobileDigits : '',
        email: contactType === 'email' ? emailAddress.trim() : '',
        age: numAge,
        ageGroup: derivedAgeGroup(numAge),
        location: selectedLocation,
      });
    }
  };

  // Handle Existing User Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword) {
      setLoginError('Please enter both identifier and password.');
      return;
    }

    setIsSubmittingLogin(true);
    setLoginError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setFailedLoginAttempts((prev) => prev + 1);
        setLoginError(data.error || 'Invalid login details.');
        setIsSubmittingLogin(false);
        return;
      }

      // Login successful! Restore profile and open Dashboard
      await loginUser({
        name: data.user.name,
        mobile: data.user.mobile || '',
        email: data.user.email || '',
        age: data.user.age,
        ageGroup: data.user.ageGroup || derivedAgeGroup(data.user.age || 25),
        location: data.user.location,
        onboarded: true,
        registeredAt: data.user.registeredAt,
      });
    } catch (err: any) {
      console.error('Login network error:', err);
      setFailedLoginAttempts((prev) => prev + 1);
      setLoginError('Unable to connect to authentication server. Please verify your details.');
      setIsSubmittingLogin(false);
    }
  };

  // Handle Forgot Password Reset
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetIdentifier.trim() || resetNewPassword.length < 8) {
      setResetError('Please enter your identifier and a valid password (8+ chars).');
      return;
    }

    setIsSubmittingReset(true);
    setResetError(null);
    setResetMessage(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: resetIdentifier.trim(),
          newPassword: resetNewPassword,
        }),
      });

      const data = await response.json();
      setIsSubmittingReset(false);

      if (!response.ok || !data.success) {
        setResetError(data.error || 'Failed to reset password. Please verify your details.');
        return;
      }

      setResetMessage(data.message || 'Password successfully updated. You can now log in.');
      setTimeout(() => {
        setLoginIdentifier(resetIdentifier);
        setLoginPassword('');
        setLoginError(null);
        setStep('login');
      }, 1500);
    } catch (err: any) {
      setIsSubmittingReset(false);
      setResetError('Unable to process password reset request.');
    }
  };

  const searchResults = searchAllIndianLocations(searchQuery);

  // Simple step progress mapping
  const stepOrder = ['welcome', 'name', 'contact', 'password', 'age', 'location', 'location-confirm', 'summary'];
  const currentStepIndex = stepOrder.indexOf(step);

  return (
    <div
      id="landsafe-onboarding-container"
      className="min-h-screen w-full text-slate-100 flex flex-col justify-between relative overflow-x-hidden font-sans select-none bg-cover bg-center bg-no-repeat bg-fixed"
      style={{
        backgroundImage: `url('/LandSafe_AI_Login_Background_07_2560x1440.png')`,
        backgroundColor: '#060c17',
      }}
    >
      {/* Background Overlay: Dark slate/navy semi-transparent overlay to ensure WCAG AA contrast and sharp readability */}
      <div className="absolute inset-0 bg-[#040914]/75 sm:bg-[#040914]/70 backdrop-blur-[1px] pointer-events-none z-0" />

      {/* Subtle atmospheric ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[320px] bg-blue-500/10 blur-[120px] pointer-events-none z-0" />

      {/* Top Simple Header */}
      <header className="w-full border-b border-[#142844]/80 bg-[#071322]/85 backdrop-blur-xl px-6 py-4 flex items-center justify-between z-20 shadow-lg">
        <div className="flex items-center gap-3">
          <LandSafeLogo size="sm" className="w-8 h-8" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-wider text-base text-white">
                LANDSAFE <span className="text-[#00d492]">AI</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 uppercase">
                India Early-Warning
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Geological Risk & Landslide Intelligence Network
            </p>
          </div>
        </div>

        {/* Minimal Step Indicator (when in onboarding steps) */}
        {currentStepIndex > 0 && currentStepIndex < 7 && (
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Step {currentStepIndex} of 6</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentStepIndex
                      ? 'w-6 bg-[#00d492]'
                      : i < currentStepIndex
                      ? 'w-2 bg-emerald-700'
                      : 'w-2 bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8 z-10">
        <AnimatePresence mode="wait">
          {/* ========================================================= */}
          {/* 1. FIRST SCREEN / WELCOME INTERFACE                       */}
          {/* ========================================================= */}
          {step === 'welcome' && (
            <motion.div
              key="step-welcome"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-xl bg-[#091524]/95 border border-[#182f4d] rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl text-center"
            >
              <div className="flex justify-center mb-5">
                <LandSafeLogo size="xl" className="w-20 h-20 sm:w-24 sm:h-24 hover:scale-105 transition-transform" />
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-medium text-[#00d492] bg-[#00d492]/10 border border-[#00d492]/30 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-[#00d492]" />
                Geological Hazard Intelligence
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                LandSafe <span className="text-[#00d492]">AI</span>
              </h1>

              <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto mb-8 font-normal">
                AI-Powered Landslide Risk Monitoring, Hyper-Local Telemetry, and Safe Corridor Routing for India.
              </p>

              {/* Continue Button to start onboarding */}
              <button
                id="welcome-continue-btn"
                onClick={() => setStep('name')}
                className="w-full py-3.5 px-6 rounded-xl bg-[#009e60] hover:bg-[#00b870] active:scale-[0.99] text-white font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all uppercase cursor-pointer"
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Already have an account? Log in */}
              <div className="mt-5 pt-4 border-t border-[#12243a]">
                <p className="text-xs text-slate-400">
                  Already have an account?{' '}
                  <button
                    id="welcome-login-btn"
                    onClick={() => {
                      setLoginError(null);
                      setStep('login');
                    }}
                    className="text-[#00d492] hover:underline font-semibold cursor-pointer ml-1"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 2. STEP 1: WHAT IS YOUR NAME?                             */}
          {/* ========================================================= */}
          {step === 'name' && (
            <motion.div
              key="step-name"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md bg-[#091524]/95 border border-[#182f4d] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setStep('welcome')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-[#00d492]">Step 1 of 6</span>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                What is your name?
              </h2>
              <p className="text-slate-400 text-xs mb-6">
                Please enter your full name to personalize your early-warning dashboard.
              </p>

              <div className="mb-6">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="input-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onBlur={() => markTouched('name')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && isNameValid) setStep('contact');
                    }}
                    placeholder="Enter your full name"
                    className={`w-full bg-[#08121f] border ${
                      isNameValid
                        ? 'border-emerald-500/70 focus:border-emerald-400'
                        : touched.name && fullName.trim().length > 0
                        ? 'border-rose-500/60 focus:border-rose-400'
                        : 'border-[#1c385c] focus:border-[#00d492]'
                    } rounded-xl pl-10 pr-10 py-3.5 text-sm text-white placeholder-slate-500 transition-all outline-none`}
                    autoFocus
                  />
                  {isNameValid && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-400">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {touched.name && !isNameValid && fullName.trim().length > 0 && (
                  <p className="text-rose-400 text-xs mt-1.5">
                    Please enter a valid full name (at least 2 letters).
                  </p>
                )}
              </div>

              {/* Continue Button */}
              <button
                id="name-continue-btn"
                disabled={!isNameValid}
                onClick={() => setStep('contact')}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all uppercase ${
                  isNameValid
                    ? 'bg-[#009e60] hover:bg-[#00b870] text-white shadow-lg shadow-emerald-950/60 cursor-pointer'
                    : 'bg-[#102338] text-slate-500 cursor-not-allowed border border-[#162d47]'
                }`}
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center mt-4">
                <span className="text-xs text-slate-400">Already registered? </span>
                <button
                  onClick={() => {
                    setLoginError(null);
                    setStep('login');
                  }}
                  className="text-xs text-[#00d492] hover:underline font-semibold cursor-pointer"
                >
                  Log In
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 3. STEP 2: CONTACT (MOBILE OR EMAIL)                      */}
          {/* ========================================================= */}
          {step === 'contact' && (
            <motion.div
              key="step-contact"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md bg-[#091524]/95 border border-[#182f4d] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setStep('name')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-[#00d492]">Step 2 of 6</span>
              </div>

              {/* Dynamic Welcome with Entered Name */}
              <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                Welcome, <span className="text-[#00d492]">{fullName.trim().split(' ')[0]}</span>
              </h2>
              <p className="text-slate-400 text-xs mb-5">
                Choose how you would like to receive critical hazard notifications.
              </p>

              {/* Contact Method Switcher */}
              <div className="flex rounded-xl bg-[#08121f] p-1 border border-[#1c385c] mb-5">
                <button
                  type="button"
                  onClick={() => setContactType('mobile')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    contactType === 'mobile'
                      ? 'bg-[#0f243c] text-emerald-400 shadow-sm border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Mobile Number</span>
                </button>
                <button
                  type="button"
                  onClick={() => setContactType('email')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    contactType === 'email'
                      ? 'bg-[#0f243c] text-emerald-400 shadow-sm border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email Address</span>
                </button>
              </div>

              {/* Mobile Input */}
              {contactType === 'mobile' ? (
                <div className="mb-6">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Indian Mobile Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative flex">
                    <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-[#1c385c] bg-[#0c1c30] text-slate-300 text-xs font-mono">
                      +91
                    </span>
                    <input
                      id="input-mobile"
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        setMobileNumber(val);
                      }}
                      onBlur={() => markTouched('mobile')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && isMobileValid) setStep('password');
                      }}
                      placeholder="10-digit mobile number"
                      className={`w-full bg-[#08121f] border ${
                        isMobileValid
                          ? 'border-emerald-500/70 focus:border-emerald-400'
                          : touched.mobile && mobileNumber.length > 0
                          ? 'border-rose-500/60 focus:border-rose-400'
                          : 'border-[#1c385c] focus:border-[#00d492]'
                      } rounded-r-xl px-3.5 py-3.5 text-sm text-white placeholder-slate-500 transition-all outline-none font-mono`}
                      autoFocus
                    />
                    {isMobileValid && (
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-400">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  {touched.mobile && !isMobileValid && mobileNumber.length > 0 && (
                    <p className="text-rose-400 text-xs mt-1.5">
                      Please enter a valid 10-digit mobile number.
                    </p>
                  )}
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="input-email"
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      onBlur={() => markTouched('email')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && isEmailValid) setStep('password');
                      }}
                      placeholder="name@example.com"
                      className={`w-full bg-[#08121f] border ${
                        isEmailValid
                          ? 'border-emerald-500/70 focus:border-emerald-400'
                          : touched.email && emailAddress.length > 0
                          ? 'border-rose-500/60 focus:border-rose-400'
                          : 'border-[#1c385c] focus:border-[#00d492]'
                      } rounded-xl pl-10 pr-10 py-3.5 text-sm text-white placeholder-slate-500 transition-all outline-none`}
                      autoFocus
                    />
                    {isEmailValid && (
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-400">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  {touched.email && !isEmailValid && emailAddress.length > 0 && (
                    <p className="text-rose-400 text-xs mt-1.5">
                      Please enter a valid email address.
                    </p>
                  )}
                </div>
              )}

              {/* Continue Button */}
              <button
                id="contact-continue-btn"
                disabled={!isContactValid}
                onClick={() => setStep('password')}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all uppercase ${
                  isContactValid
                    ? 'bg-[#009e60] hover:bg-[#00b870] text-white shadow-lg shadow-emerald-950/60 cursor-pointer'
                    : 'bg-[#102338] text-slate-500 cursor-not-allowed border border-[#162d47]'
                }`}
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 4. STEP 3: CREATE PASSWORD                                */}
          {/* ========================================================= */}
          {step === 'password' && (
            <motion.div
              key="step-password"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md bg-[#091524]/95 border border-[#182f4d] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setStep('contact')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-[#00d492]">Step 3 of 6</span>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                Create Password
              </h2>
              <p className="text-slate-400 text-xs mb-6">
                Protect your emergency contacts and local monitoring node.
              </p>

              <div className="mb-4">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Password <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="input-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => markTouched('password')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && isPasswordValid) setStep('age');
                    }}
                    placeholder="Create a secure password"
                    className={`w-full bg-[#08121f] border ${
                      isPasswordValid
                        ? 'border-emerald-500/70 focus:border-emerald-400'
                        : touched.password && password.length > 0
                        ? 'border-rose-500/60 focus:border-rose-400'
                        : 'border-[#1c385c] focus:border-[#00d492]'
                    } rounded-xl pl-10 pr-20 py-3.5 text-sm text-white placeholder-slate-500 transition-all outline-none`}
                    autoFocus
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
                    {isPasswordValid && (
                      <span className="text-emerald-400">
                        <Check className="w-4 h-4" />
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400">Password Strength:</span>
                    <span className={`font-semibold ${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0c1c30] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.barColor} transition-all duration-300 ${passwordStrength.width}`}
                    />
                  </div>
                </div>
              )}

              {/* Requirements Checklist */}
              <div className="bg-[#071322] border border-[#142840] rounded-xl p-3.5 mb-6 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      passLength ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className={passLength ? 'text-emerald-300 font-medium' : 'text-slate-400'}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      passHasLetter ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className={passHasLetter ? 'text-emerald-300 font-medium' : 'text-slate-400'}>
                    At least one letter (a-z, A-Z)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      passHasNumber ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className={passHasNumber ? 'text-emerald-300 font-medium' : 'text-slate-400'}>
                    At least one number (0-9)
                  </span>
                </div>
              </div>

              {/* Continue Button */}
              <button
                id="password-continue-btn"
                disabled={!isPasswordValid}
                onClick={() => setStep('age')}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all uppercase ${
                  isPasswordValid
                    ? 'bg-[#009e60] hover:bg-[#00b870] text-white shadow-lg shadow-emerald-950/60 cursor-pointer'
                    : 'bg-[#102338] text-slate-500 cursor-not-allowed border border-[#162d47]'
                }`}
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 5. STEP 4: WHAT IS YOUR AGE?                              */}
          {/* ========================================================= */}
          {step === 'age' && (
            <motion.div
              key="step-age"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md bg-[#091524]/95 border border-[#182f4d] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setStep('password')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-[#00d492]">Step 4 of 6</span>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                What is your age?
              </h2>
              <p className="text-slate-400 text-xs mb-6">
                Age helps tailor local emergency notifications and evacuation recommendations.
              </p>

              <div className="mb-6">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Age (in years) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    id="input-age"
                    type="number"
                    min={10}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    onBlur={() => markTouched('age')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && isAgeValid) setStep('location');
                    }}
                    placeholder="Enter your age (e.g. 24)"
                    className={`w-full bg-[#08121f] border ${
                      isAgeValid
                        ? 'border-emerald-500/70 focus:border-emerald-400'
                        : touched.age && age.length > 0
                        ? 'border-rose-500/60 focus:border-rose-400'
                        : 'border-[#1c385c] focus:border-[#00d492]'
                    } rounded-xl pl-10 pr-10 py-3.5 text-sm text-white placeholder-slate-500 transition-all outline-none font-mono`}
                    autoFocus
                  />
                  {isAgeValid && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-400">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {touched.age && !isAgeValid && age.length > 0 && (
                  <p className="text-rose-400 text-xs mt-1.5">
                    Please enter a reasonable numeric age (10–120).
                  </p>
                )}
              </div>

              {/* Continue Button */}
              <button
                id="age-continue-btn"
                disabled={!isAgeValid}
                onClick={() => setStep('location')}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all uppercase ${
                  isAgeValid
                    ? 'bg-[#009e60] hover:bg-[#00b870] text-white shadow-lg shadow-emerald-950/60 cursor-pointer'
                    : 'bg-[#102338] text-slate-500 cursor-not-allowed border border-[#162d47]'
                }`}
              >
                <span>CONTINUE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 6. STEP 5: SELECT LOCATION                                */}
          {/* ========================================================= */}
          {step === 'location' && (
            <motion.div
              key="step-location"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-xl bg-[#091524]/95 border border-[#182f4d] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setStep('age')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-[#00d492]">Step 5 of 6</span>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                Select Your Location
              </h2>
              <p className="text-slate-400 text-xs mb-4">
                Choose your primary monitoring area across India's geological hazard grid.
              </p>

              {/* Use My Current Location GPS button */}
              <div className="mb-5">
                <button
                  id="btn-use-current-location"
                  type="button"
                  disabled={gpsLoading}
                  onClick={handleUseCurrentLocation}
                  className="w-full py-3 px-4 rounded-xl bg-[#0f243c] hover:bg-[#143152] border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
                >
                  {gpsLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  ) : (
                    <Crosshair className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>{gpsLoading ? 'Acquiring GPS Position...' : 'Use My Current Location'}</span>
                </button>

                {gpsNotice && (
                  <p className="text-amber-400/90 text-xs mt-2 px-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{gpsNotice}</span>
                  </p>
                )}
              </div>

              {/* Location Tabs: Search vs Manual */}
              <div className="flex rounded-xl bg-[#08121f] p-1 border border-[#1c385c] mb-4">
                <button
                  type="button"
                  onClick={() => setLocationTab('search')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    locationTab === 'search'
                      ? 'bg-[#0f243c] text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search All India</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLocationTab('manual')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    locationTab === 'manual'
                      ? 'bg-[#0f243c] text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>State & District Filter</span>
                </button>
              </div>

              {/* Tab 1: Live Search */}
              {locationTab === 'search' ? (
                <div>
                  <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      id="input-location-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search city, district, or area (e.g. Darjeeling, Mumbai, Kolkata, Shimla)..."
                      className="w-full bg-[#08121f] border border-[#1c385c] focus:border-[#00d492] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-slate-500 transition-all outline-none"
                      autoFocus
                    />
                  </div>

                  {/* Results List */}
                  <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
                    {searchQuery.trim().length > 0 ? (
                      searchResults.length > 0 ? (
                        searchResults.map((res, idx) => (
                          <button
                            key={`${res.stateId}-${res.districtId}-${res.area}-${idx}`}
                            onClick={() => handleSelectSearchResult(res)}
                            className="w-full text-left p-3 rounded-xl bg-[#081322] hover:bg-[#0f253e] border border-[#162d47] hover:border-emerald-500/50 flex items-center justify-between transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-2.5">
                              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                              <div>
                                <p className="text-xs font-semibold text-white group-hover:text-emerald-300">
                                  {res.area}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  {res.district}, {res.state}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                  res.isMonitored
                                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {res.isMonitored ? 'Hazard Monitored' : 'Monitored'}
                              </span>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {res.elevation}m alt • {res.slopeAngle}°
                              </p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="text-center py-6 text-slate-400 text-xs">
                          No matching locations found for "{searchQuery}". Try searching by district name.
                        </div>
                      )
                    ) : (
                      <div className="text-center py-6 text-slate-400 text-xs">
                        Type any city, town, or district name across India to view telemetry.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Tab 2: Manual Hierarchy */
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                      1. State / Union Territory
                    </label>
                    <select
                      value={selectedStateId}
                      onChange={(e) => handleManualStateChange(e.target.value)}
                      className="w-full bg-[#08121f] border border-[#1c385c] focus:border-[#00d492] rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
                    >
                      <option value="">Select State / UT...</option>
                      {INDIAN_STATES.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.name.replace(' Δ (Hazard Monitored Sector)', '')}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedStateId && (
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                        2. District
                      </label>
                      <select
                        value={selectedDistrictId}
                        onChange={(e) => handleManualDistrictChange(e.target.value)}
                        className="w-full bg-[#08121f] border border-[#1c385c] focus:border-[#00d492] rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
                      >
                        {INDIAN_STATES.find((s) => s.id === selectedStateId)?.districts.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name.replace(/\([^)]*\)/g, '')}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedDistrictId && (
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-slate-300 mb-1">
                        3. Specific Locality / Ward
                      </label>
                      <select
                        value={selectedArea}
                        onChange={(e) => setSelectedArea(e.target.value)}
                        className="w-full bg-[#08121f] border border-[#1c385c] focus:border-[#00d492] rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
                      >
                        {INDIAN_STATES.find((s) => s.id === selectedStateId)
                          ?.districts.find((d) => d.id === selectedDistrictId)
                          ?.localAreas.map((a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  {selectedArea && (
                    <button
                      id="manual-location-confirm-btn"
                      onClick={handleManualConfirm}
                      className="w-full mt-2 py-3 rounded-xl bg-[#009e60] hover:bg-[#00b870] text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Confirm Location Selection
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 7. STEP 6: LOCATION CONFIRMATION SCREEN                   */}
          {/* ========================================================= */}
          {step === 'location-confirm' && selectedLocation && (
            <motion.div
              key="step-location-confirm"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md bg-[#091524]/95 border border-[#182f4d] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                <CheckCircle className="w-6 h-6" />
              </div>

              <span className="text-[11px] font-mono uppercase tracking-wider text-[#00d492] font-semibold">
                Your Area
              </span>

              <h2 className="text-2xl font-bold text-white tracking-tight mt-1 mb-1">
                {selectedLocation.area}
              </h2>
              <p className="text-slate-300 text-xs mb-6">
                {selectedLocation.district}, {selectedLocation.state}, India
              </p>

              {/* Location Telemetry Meta Card */}
              <div className="bg-[#071322] border border-[#162d47] rounded-xl p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Coordinates:</span>
                  <span className="font-mono text-slate-200">
                    {selectedLocation.coordinates.lat}° N, {selectedLocation.coordinates.lng}° E
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Terrain Elevation:</span>
                  <span className="font-mono text-slate-200">{selectedLocation.elevation} meters</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Hazard Tier:</span>
                  <span
                    className={`font-semibold text-xs ${
                      selectedLocation.riskScore >= 70
                        ? 'text-rose-400'
                        : selectedLocation.riskScore >= 40
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {selectedLocation.riskLevel} Hazard Zone ({selectedLocation.riskScore}/100)
                  </span>
                </div>
              </div>

              <div className="text-emerald-400 text-xs font-semibold mb-6 flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Location confirmed ✓</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  id="location-confirm-continue-btn"
                  onClick={() => setStep('summary')}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#009e60] hover:bg-[#00b870] text-white font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 uppercase cursor-pointer"
                >
                  <span>CONTINUE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setStep('location')}
                  className="w-full py-2.5 rounded-xl bg-[#0b1b2d] hover:bg-[#10243b] text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  Change Location
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 8. STEP 7: USER SUMMARY SCREEN                            */}
          {/* ========================================================= */}
          {step === 'summary' && selectedLocation && (
            <motion.div
              key="step-summary"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-lg bg-[#091524]/95 border border-[#182f4d] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                  <LandSafeLogo size="lg" className="w-14 h-14" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#00d492] bg-[#00d492]/10 border border-[#00d492]/30 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#00d492]" />
                  Final Verification
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome to LandSafe AI
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Your personalized early-warning configuration is ready to launch.
                </p>
              </div>

              {/* Dynamic Summary of User-Entered Data */}
              <div className="bg-[#071322] border border-[#162d47] rounded-xl p-4 sm:p-5 mb-6 divide-y divide-[#132943]">
                <div className="pb-3 flex justify-between items-center">
                  <span className="text-xs text-slate-400">Name</span>
                  <span className="text-sm font-semibold text-white">{fullName}</span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-xs text-slate-400">Contact</span>
                  <span className="text-sm font-mono text-emerald-400">
                    {contactType === 'mobile' ? `+91 ${cleanMobileDigits}` : emailAddress}
                  </span>
                </div>
                <div className="py-3 flex justify-between items-center">
                  <span className="text-xs text-slate-400">Age</span>
                  <span className="text-sm font-mono text-white">
                    {numAge} years ({derivedAgeGroup(numAge)})
                  </span>
                </div>
                <div className="pt-3 flex justify-between items-start">
                  <span className="text-xs text-slate-400">Location</span>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{selectedLocation.area}</p>
                    <p className="text-xs text-slate-400">
                      {selectedLocation.district}, {selectedLocation.state}
                    </p>
                  </div>
                </div>
              </div>

              {registerError && (
                <p className="text-rose-400 text-xs mb-4 text-center">{registerError}</p>
              )}

              {/* Final Continue Button */}
              <button
                id="summary-continue-btn"
                disabled={isSubmittingRegister}
                onClick={handleFinalRegistration}
                className="w-full py-4 px-6 rounded-xl bg-[#009e60] hover:bg-[#00b870] active:scale-[0.99] text-white font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 uppercase cursor-pointer"
              >
                {isSubmittingRegister ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>INITIALIZING TELEMETRY...</span>
                  </>
                ) : (
                  <>
                    <span>LAUNCH LANDSAFE AI DASHBOARD</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 9. RETURNING USER LOGIN SCREEN                            */}
          {/* ========================================================= */}
          {step === 'login' && (
            <motion.div
              key="step-login"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md bg-[#091524]/95 border border-[#182f4d] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setStep('welcome')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <LandSafeLogo size="xs" className="w-5 h-5" />
                  <span className="text-[11px] font-mono text-emerald-400 uppercase">Operator Login</span>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                Log in to LandSafe AI
              </h2>
              <p className="text-slate-400 text-xs mb-6">
                Access your saved monitoring district, early alerts, and sensor telemetry.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Mobile Number or Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="login-identifier"
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => {
                        setLoginIdentifier(e.target.value);
                        if (loginError) setLoginError(null);
                      }}
                      placeholder="Registered mobile or email"
                      className="w-full bg-[#08121f] border border-[#1c385c] focus:border-[#00d492] rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-slate-500 transition-all outline-none"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
                      Password
                    </label>
                    {failedLoginAttempts >= 2 && (
                      <button
                        type="button"
                        onClick={() => {
                          setResetIdentifier(loginIdentifier);
                          setResetError(null);
                          setResetMessage(null);
                          setStep('forgot-password');
                        }}
                        className="text-xs text-amber-400 hover:underline font-medium cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-password"
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (loginError) setLoginError(null);
                      }}
                      placeholder="Enter your password"
                      className="w-full bg-[#08121f] border border-[#1c385c] focus:border-[#00d492] rounded-xl pl-10 pr-10 py-3.5 text-sm text-white placeholder-slate-500 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isSubmittingLogin || !loginIdentifier.trim() || !loginPassword}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all uppercase ${
                    loginIdentifier.trim() && loginPassword && !isSubmittingLogin
                      ? 'bg-[#009e60] hover:bg-[#00b870] text-white shadow-lg shadow-emerald-950/60 cursor-pointer'
                      : 'bg-[#102338] text-slate-500 cursor-not-allowed border border-[#162d47]'
                  }`}
                >
                  {isSubmittingLogin ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AUTHENTICATING...</span>
                    </>
                  ) : (
                    <>
                      <span>LOG IN</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-6 pt-4 border-t border-[#12243a]">
                <span className="text-xs text-slate-400">Don't have an account? </span>
                <button
                  onClick={() => setStep('name')}
                  className="text-xs text-[#00d492] hover:underline font-semibold cursor-pointer ml-1"
                >
                  Create Account
                </button>
              </div>
            </motion.div>
          )}

          {/* ========================================================= */}
          {/* 10. FORGOT PASSWORD / PASSWORD RECOVERY                   */}
          {/* ========================================================= */}
          {step === 'forgot-password' && (
            <motion.div
              key="step-forgot-password"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-md bg-[#091524]/95 border border-[#182f4d] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setStep('login')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-[11px] font-mono text-amber-400 uppercase">Security Recovery</span>
              </div>

              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 text-amber-400">
                <KeyRound className="w-5 h-5" />
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-1">
                Reset Password
              </h2>
              <p className="text-slate-400 text-xs mb-6">
                Create a new secure password for your registered mobile or email account.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-2">
                    Registered Mobile or Email
                  </label>
                  <input
                    type="text"
                    value={resetIdentifier}
                    onChange={(e) => setResetIdentifier(e.target.value)}
                    placeholder="Enter registered mobile or email"
                    className="w-full bg-[#08121f] border border-[#1c385c] focus:border-[#00d492] rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 transition-all outline-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showResetPassword ? 'text' : 'password'}
                      value={resetNewPassword}
                      onChange={(e) => setResetNewPassword(e.target.value)}
                      placeholder="Enter at least 8 characters (letters + numbers)"
                      className="w-full bg-[#08121f] border border-[#1c385c] focus:border-[#00d492] rounded-xl pl-4 pr-10 py-3.5 text-sm text-white placeholder-slate-500 transition-all outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(!showResetPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {resetError && (
                  <p className="text-rose-400 text-xs flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {resetError}
                  </p>
                )}

                {resetMessage && (
                  <p className="text-emerald-400 text-xs flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {resetMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingReset || !resetIdentifier.trim() || resetNewPassword.length < 8}
                  className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wider flex items-center justify-center gap-2 transition-all uppercase ${
                    resetIdentifier.trim() && resetNewPassword.length >= 8 && !isSubmittingReset
                      ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg cursor-pointer'
                      : 'bg-[#102338] text-slate-500 cursor-not-allowed border border-[#162d47]'
                  }`}
                >
                  {isSubmittingReset ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>UPDATING PASSWORD...</span>
                    </>
                  ) : (
                    <span>RESET PASSWORD & LOG IN</span>
                  )}
                </button>
              </form>

              <div className="text-center mt-5">
                <button
                  onClick={() => setStep('login')}
                  className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Return to Log In
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Meta */}
      <footer className="w-full border-t border-[#122338] bg-[#07111e]/80 backdrop-blur-md px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 z-10 gap-2 font-mono">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[#00d492]" />
          <span>GSI • IMD • NDMA Geological Data Interface</span>
        </div>
        <div className="flex items-center gap-3">
          <span>End-to-End Encrypted Telemetry</span>
          <span>•</span>
          <span>National Geotechnical Mesh</span>
        </div>
      </footer>
    </div>
  );
};
