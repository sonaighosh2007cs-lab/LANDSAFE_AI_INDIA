import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  CloudSnow,
  Wind,
} from 'lucide-react';

interface WeatherIconProps {
  name: string;
  isDaytime?: boolean;
  className?: string;
  size?: number;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  name,
  isDaytime = true,
  className = 'w-6 h-6',
  size,
}) => {
  const iconProps = {
    className,
    ...(size ? { size } : {}),
  };

  const normalized = (name || '').toLowerCase();

  if (normalized.includes('lightning') || normalized.includes('thunder')) {
    return <CloudLightning {...iconProps} className={`${className} text-amber-400`} />;
  }
  if (normalized.includes('rain') || normalized.includes('shower')) {
    return <CloudRain {...iconProps} className={`${className} text-sky-400`} />;
  }
  if (normalized.includes('drizzle')) {
    return <CloudDrizzle {...iconProps} className={`${className} text-cyan-400`} />;
  }
  if (normalized.includes('snow') || normalized.includes('ice')) {
    return <CloudSnow {...iconProps} className={`${className} text-indigo-300`} />;
  }
  if (normalized.includes('fog') || normalized.includes('mist') || normalized.includes('haze')) {
    return <CloudFog {...iconProps} className={`${className} text-slate-300`} />;
  }
  if (normalized.includes('cloudsun') || (normalized.includes('partly') && isDaytime)) {
    return <CloudSun {...iconProps} className={`${className} text-amber-300`} />;
  }
  if (normalized.includes('cloudmoon') || (normalized.includes('partly') && !isDaytime)) {
    return <CloudMoon {...iconProps} className={`${className} text-indigo-300`} />;
  }
  if (normalized.includes('cloud') || normalized.includes('overcast')) {
    return <Cloud {...iconProps} className={`${className} text-slate-300`} />;
  }
  if (normalized.includes('sun') || (normalized.includes('clear') && isDaytime)) {
    return <Sun {...iconProps} className={`${className} text-amber-400`} />;
  }
  if (normalized.includes('moon') || (normalized.includes('clear') && !isDaytime)) {
    return <Moon {...iconProps} className={`${className} text-cyan-200`} />;
  }
  if (normalized.includes('wind')) {
    return <Wind {...iconProps} className={`${className} text-teal-300`} />;
  }

  return isDaytime ? (
    <Sun {...iconProps} className={`${className} text-amber-400`} />
  ) : (
    <Moon {...iconProps} className={`${className} text-cyan-200`} />
  );
};
