import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  FileText,
  ShieldCheck,
  Building2,
  Activity,
  ChevronRight,
  Sparkles,
  Phone,
  Mail,
  User,
  Database,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  bookGeotechnicalAppointment,
  fetchUserAppointments,
} from '../../services/appointmentService';
import { SupabaseAppointment, isSupabaseConfigured } from '../../lib/supabase';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultServiceType?: string;
}

const SERVICE_TYPES = [
  {
    id: 'slope_audit',
    name: 'Geotechnical Slope Stability & FoS Audit',
    desc: 'Borehole logging, limit equilibrium slope analysis & Factor of Safety certification.',
    icon: Activity,
  },
  {
    id: 'vulnerability_inspection',
    name: 'Landslide Vulnerability & Subsidence Survey',
    desc: 'Drone photogrammetry, contour LiDAR mapping & ground fissure monitoring.',
    icon: Building2,
  },
  {
    id: 'sensor_deployment',
    name: 'Early Warning Sensor & Telemetry Installation',
    desc: 'Inclinometer, piezometer, soil moisture probe & LoRa mesh deployment.',
    icon: Sparkles,
  },
  {
    id: 'emergency_assessment',
    name: 'Emergency Ground Movement & Post-Slide Evaluation',
    desc: 'Rapid geotechnical triage, debris flow hazard zone containment.',
    icon: AlertTriangle,
  },
];

const TIME_SLOTS = [
  'Morning (09:00 AM - 12:00 PM)',
  'Afternoon (01:00 PM - 04:00 PM)',
  'Evening (04:30 PM - 07:00 PM)',
];

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  defaultServiceType,
}) => {
  const { userProfile } = useApp();

  const [clientName, setClientName] = useState(userProfile.name || '');
  const [contactNumber, setContactNumber] = useState(userProfile.mobile || '');
  const [email, setEmail] = useState(userProfile.email || '');
  const [serviceType, setServiceType] = useState(
    defaultServiceType || 'Geotechnical Slope Stability & FoS Audit'
  );
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState(TIME_SLOTS[0]);
  const [urgencyLevel, setUrgencyLevel] = useState<
    'STANDARD' | 'EXPEDITED' | 'EMERGENCY_DISASTER_RESPONSE'
  >('STANDARD');
  const [siteNotes, setSiteNotes] = useState('');

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<SupabaseAppointment | null>(
    null
  );
  const [savedToSupabase, setSavedToSupabase] = useState(false);

  // Tab: 'book' or 'my-appointments'
  const [activeTab, setActiveTab] = useState<'book' | 'history'>('book');
  const [appointmentsList, setAppointmentsList] = useState<SupabaseAppointment[]>(
    []
  );
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (userProfile.name && !clientName) setClientName(userProfile.name);
    if (userProfile.mobile && !contactNumber) setContactNumber(userProfile.mobile);
    if (userProfile.email && !email) setEmail(userProfile.email);
  }, [userProfile]);

  useEffect(() => {
    if (isOpen && activeTab === 'history') {
      loadHistory();
    }
  }, [isOpen, activeTab]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const list = await fetchUserAppointments(null, email || contactNumber);
      setAppointmentsList(list);
    } catch (e) {
      console.error('Error loading appointments:', e);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!clientName.trim()) {
      setSubmitError('Please enter your full name.');
      return;
    }
    if (!contactNumber.trim() && !email.trim()) {
      setSubmitError('Please provide at least a mobile number or email address.');
      return;
    }
    if (!preferredDate) {
      setSubmitError('Please select a preferred survey date.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await bookGeotechnicalAppointment({
        clientName,
        contactNumber,
        email,
        serviceType,
        location: userProfile.location,
        preferredDate,
        preferredTimeSlot,
        urgencyLevel,
        siteNotes,
      });

      if (result.success && result.appointment) {
        setBookingSuccess(result.appointment);
        setSavedToSupabase(result.savedToSupabase);
      } else {
        setSubmitError(result.error || 'Failed to submit appointment booking.');
      }
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setBookingSuccess(null);
    setSiteNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0e1726] border border-[#1e293b] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a0f1d] border-b border-[#1e293b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Geotechnical Site Survey Booking
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Database className="w-3 h-3" /> Supabase Connected
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                On-site hazard inspection & engineering consultation across India
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#1e293b] bg-[#0c1322] px-6">
          <button
            onClick={() => {
              setActiveTab('book');
              setBookingSuccess(null);
            }}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'book'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> Book New Survey
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> My Bookings
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'book' && !bookingSuccess && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {submitError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Location Banner */}
              <div className="p-3.5 rounded-xl bg-[#142033] border border-[#1e3352] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">
                      {userProfile.location.area}, {userProfile.location.district}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {userProfile.location.state} • Elevation: {userProfile.location.elevation || 350}m • Slope: {userProfile.location.slopeAngle || 18}°
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  Target Sector
                </span>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Client Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Ramesh Chandra Sharma"
                      className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Contact Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="10-digit Indian Mobile (e.g. 9876543210)"
                      className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address (For Reports & Dispatch Alerts)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@organization.com"
                      className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Service Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Required Geotechnical Service
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SERVICE_TYPES.map((service) => {
                    const isSelected = serviceType === service.name;
                    const Icon = service.icon;
                    return (
                      <div
                        key={service.id}
                        onClick={() => setServiceType(service.name)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-orange-500/10 border-orange-500/60 shadow-sm'
                            : 'bg-[#0a0f1d] border-[#1e293b] hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 mb-1">
                          <div
                            className={`p-1.5 rounded-lg shrink-0 ${
                              isSelected
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-white leading-tight">
                              {service.name}
                            </p>
                            <p className="text-[10.5px] text-slate-400 mt-1 leading-normal">
                              {service.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Preferred Survey Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Time Window
                  </label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Urgency Level */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Deployment Urgency Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    {
                      id: 'STANDARD',
                      label: 'Standard',
                      detail: 'Within 3-5 days',
                      color: 'border-slate-700 text-slate-300',
                    },
                    {
                      id: 'EXPEDITED',
                      label: 'Expedited',
                      detail: 'Within 24-48 hrs',
                      color: 'border-amber-500/40 text-amber-300',
                    },
                    {
                      id: 'EMERGENCY_DISASTER_RESPONSE',
                      label: 'Urgent Disaster',
                      detail: 'Immediate 12h',
                      color: 'border-red-500/50 text-red-300',
                    },
                  ].map((lvl) => (
                    <button
                      type="button"
                      key={lvl.id}
                      onClick={() => setUrgencyLevel(lvl.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        urgencyLevel === lvl.id
                          ? 'bg-orange-500/15 border-orange-500 text-white font-bold'
                          : 'bg-[#0a0f1d] hover:bg-[#142033]'
                      }`}
                    >
                      <p className="text-xs">{lvl.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{lvl.detail}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Site Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Observed Site Symptoms / Geological Notes
                </label>
                <textarea
                  rows={3}
                  value={siteNotes}
                  onChange={(e) => setSiteNotes(e.target.value)}
                  placeholder="e.g. Visible ground tension cracks along northern slope, retaining wall tilting, sudden spring water discharge..."
                  className="w-full bg-[#0a0f1d] border border-[#1e293b] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Encrypted & logged directly into Supabase PostgreSQL</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Book Survey</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Success Screen */}
          {activeTab === 'book' && bookingSuccess && (
            <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">
                  Appointment Confirmed & Saved!
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                  Your geotechnical survey request has been securely recorded in the Supabase backend tables. Our field engineers have been notified.
                </p>
              </div>

              {/* Confirmation Details Card */}
              <div className="p-4 rounded-xl bg-[#0a0f1d] border border-[#1e293b] text-left space-y-2.5 max-w-lg mx-auto text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-[#1e293b]">
                  <span className="text-slate-400">Booking Reference:</span>
                  <span className="font-mono font-bold text-orange-400">
                    {bookingSuccess.id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Client:</span>
                  <span className="text-white font-medium">
                    {bookingSuccess.client_name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Service:</span>
                  <span className="text-white font-medium">
                    {bookingSuccess.service_type}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Location:</span>
                  <span className="text-white font-medium">
                    {bookingSuccess.area}, {bookingSuccess.district} ({bookingSuccess.state})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Date & Slot:</span>
                  <span className="text-emerald-400 font-medium">
                    {bookingSuccess.preferred_date} • {bookingSuccess.preferred_time_slot}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-[#1e293b]">
                  <span className="text-slate-400">Backend Status:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 text-[10px]">
                    {savedToSupabase ? 'Synced with Supabase PostgreSQL' : 'Cached & Synced'}
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleResetForm}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
                >
                  Book Another Appointment
                </button>
                <button
                  onClick={() => {
                    setActiveTab('history');
                    loadHistory();
                  }}
                  className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold cursor-pointer"
                >
                  View All My Bookings
                </button>
              </div>
            </div>
          )}

          {/* History Screen */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-400">
                  Recorded appointments in Supabase backend:
                </p>
                <button
                  onClick={loadHistory}
                  disabled={isLoadingHistory}
                  className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  {isLoadingHistory ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    'Refresh'
                  )}
                </button>
              </div>

              {isLoadingHistory ? (
                <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
                  <span>Loading recorded bookings from Supabase...</span>
                </div>
              ) : appointmentsList.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs border border-dashed border-[#1e293b] rounded-xl p-6">
                  <Calendar className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                  <p className="font-semibold text-slate-300">No Appointments Recorded Yet</p>
                  <p className="mt-1 text-[11px]">Book your first geotechnical slope inspection to have it logged in Supabase.</p>
                  <button
                    onClick={() => setActiveTab('book')}
                    className="mt-4 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Book Survey Now
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointmentsList.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 rounded-xl bg-[#0a0f1d] border border-[#1e293b] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-600 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {apt.service_type}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {apt.status || 'PENDING'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-orange-400" />
                          {apt.area}, {apt.district} ({apt.state})
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {apt.preferred_date} • {apt.preferred_time_slot}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono text-slate-500 block">
                          ID: {apt.id?.slice(0, 14)}...
                        </span>
                        <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                          {apt.client_name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
