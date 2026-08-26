import React from 'react';
import { AlertTriangle, ShieldAlert, BellRing } from 'lucide-react';
import { WeatherAlert } from '../../types/weather';

interface WeatherAlertsBannerProps {
  alerts: WeatherAlert[];
}

export const WeatherAlertsBanner: React.FC<WeatherAlertsBannerProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-3" id="weather-alerts-container">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="bg-[#1a0f16] border border-rose-500/60 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-start gap-4"
          id={`weather-alert-${alert.id}`}
        >
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center shrink-0 text-rose-400">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800 uppercase font-bold">
                {alert.severity}
              </span>
              <span className="text-xs font-mono text-slate-400">{alert.source}</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-rose-300">{alert.effectiveTime}</span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              {alert.title}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {alert.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
