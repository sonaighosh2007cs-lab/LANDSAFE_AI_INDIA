-- ==============================================================================
-- LandSafe AI: Comprehensive PostgreSQL Database Migration for Supabase
-- Target Project ID: vzaphfmwjjcoiaafmrbh
-- Application: LandSafe AI - National Geotechnical, Weather & Disaster Intelligence
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. User Profiles Table (Linked with Supabase Auth: auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    mobile TEXT,
    age INTEGER,
    age_group TEXT,
    active_location JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_mobile ON public.profiles(mobile);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- ==============================================================================
-- 3. Saved Locations Table (User Monitoring Sectors & Surveillance Zones)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.saved_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    area TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT DEFAULT 'India',
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    elevation DOUBLE PRECISION DEFAULT 250,
    slope_angle DOUBLE PRECISION DEFAULT 14.5,
    lithology TEXT DEFAULT 'Metamorphic Complex',
    risk_score INTEGER DEFAULT 35,
    risk_level TEXT DEFAULT 'LOW',
    is_hazard_monitored BOOLEAN DEFAULT true,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_locations_user ON public.saved_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_locations_coords ON public.saved_locations(latitude, longitude);

ALTER TABLE public.saved_locations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view saved locations" ON public.saved_locations;
CREATE POLICY "Users can view saved locations"
ON public.saved_locations FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can insert saved locations" ON public.saved_locations;
CREATE POLICY "Users can insert saved locations"
ON public.saved_locations FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can update their own saved locations" ON public.saved_locations;
CREATE POLICY "Users can update their own saved locations"
ON public.saved_locations FOR UPDATE
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their saved locations" ON public.saved_locations;
CREATE POLICY "Users can delete their saved locations"
ON public.saved_locations FOR DELETE
USING (auth.uid() = user_id);

-- ==============================================================================
-- 4. Geotechnical Site Appointments & Hazard Survey Bookings Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    contact_number TEXT,
    email TEXT,
    service_type TEXT NOT NULL,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    area TEXT NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    preferred_date DATE NOT NULL,
    preferred_time_slot TEXT NOT NULL,
    urgency_level TEXT DEFAULT 'STANDARD' CHECK (urgency_level IN ('STANDARD', 'EXPEDITED', 'EMERGENCY_DISASTER_RESPONSE')),
    site_notes TEXT,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(preferred_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_user ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_district ON public.appointments(district);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create an appointment" ON public.appointments;
CREATE POLICY "Anyone can create an appointment"
ON public.appointments FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view appointments" ON public.appointments;
CREATE POLICY "Users can view appointments"
ON public.appointments FOR SELECT
USING (auth.uid() = user_id OR auth.uid() IS NULL);

DROP POLICY IF EXISTS "Users can update appointments" ON public.appointments;
CREATE POLICY "Users can update appointments"
ON public.appointments FOR UPDATE
USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- ==============================================================================
-- 5. Weather Data Table (Current & Atmospheric Condition Snapshots)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.weather_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    temperature DOUBLE PRECISION NOT NULL,
    feels_like DOUBLE PRECISION,
    temp_max DOUBLE PRECISION,
    temp_min DOUBLE PRECISION,
    humidity DOUBLE PRECISION NOT NULL,
    dew_point DOUBLE PRECISION,
    pressure DOUBLE PRECISION,
    wind_speed DOUBLE PRECISION NOT NULL,
    wind_direction TEXT,
    wind_direction_degrees DOUBLE PRECISION,
    wind_gust DOUBLE PRECISION,
    cloud_cover DOUBLE PRECISION,
    uv_index DOUBLE PRECISION,
    visibility_km DOUBLE PRECISION,
    weather_condition TEXT,
    weather_type TEXT,
    weather_icon TEXT,
    is_daytime BOOLEAN DEFAULT true,
    sunrise TIMESTAMPTZ,
    sunset TIMESTAMPTZ,
    raw_json JSONB,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 hour')
);

CREATE INDEX IF NOT EXISTS idx_weather_coords ON public.weather_data(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_weather_recorded ON public.weather_data(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_weather_district ON public.weather_data(district, state);

ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for weather data" ON public.weather_data;
CREATE POLICY "Public read access for weather data"
ON public.weather_data FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow write access for weather data" ON public.weather_data;
CREATE POLICY "Allow write access for weather data"
ON public.weather_data FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update access for weather data" ON public.weather_data;
CREATE POLICY "Allow update access for weather data"
ON public.weather_data FOR UPDATE
USING (true);

-- ==============================================================================
-- 6. Rainfall Data Table (Precipitation Radar, Rain Windows & Surge Monitoring)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.rainfall_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    precipitation_rate_mm DOUBLE PRECISION NOT NULL DEFAULT 0,
    precipitation_probability DOUBLE PRECISION DEFAULT 0,
    precipitation_type TEXT DEFAULT 'Rain',
    thunderstorm_probability DOUBLE PRECISION DEFAULT 0,
    rainfall_24h_mm DOUBLE PRECISION DEFAULT 0,
    rain_status TEXT DEFAULT 'NO_RAIN' CHECK (rain_status IN ('NO_RAIN', 'RAIN_LIKELY', 'ACTIVE_RAIN', 'INTERMITTENT')),
    rain_window_headline TEXT,
    rain_window_details TEXT,
    expected_start_time TIMESTAMPTZ,
    expected_end_time TIMESTAMPTZ,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rainfall_coords ON public.rainfall_data(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_rainfall_status ON public.rainfall_data(rain_status);
CREATE INDEX IF NOT EXISTS idx_rainfall_recorded ON public.rainfall_data(recorded_at DESC);

ALTER TABLE public.rainfall_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for rainfall data" ON public.rainfall_data;
CREATE POLICY "Public read access for rainfall data"
ON public.rainfall_data FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow write access for rainfall data" ON public.rainfall_data;
CREATE POLICY "Allow write access for rainfall data"
ON public.rainfall_data FOR INSERT
WITH CHECK (true);

-- ==============================================================================
-- 7. Air Quality & AQI Environmental Sensor Data Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.air_quality_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    aqi INTEGER NOT NULL,
    aqi_category TEXT NOT NULL CHECK (aqi_category IN ('Good', 'Moderate', 'Poor', 'Very Poor', 'Severe')),
    pm25 DOUBLE PRECISION,
    pm10 DOUBLE PRECISION,
    no2 DOUBLE PRECISION,
    so2 DOUBLE PRECISION,
    co DOUBLE PRECISION,
    o3 DOUBLE PRECISION,
    dominant_pollutant TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_aqi_coords ON public.air_quality_data(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_aqi_category ON public.air_quality_data(aqi_category);
CREATE INDEX IF NOT EXISTS idx_aqi_recorded ON public.air_quality_data(recorded_at DESC);

ALTER TABLE public.air_quality_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for air quality data" ON public.air_quality_data;
CREATE POLICY "Public read access for air quality data"
ON public.air_quality_data FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow write access for air quality data" ON public.air_quality_data;
CREATE POLICY "Allow write access for air quality data"
ON public.air_quality_data FOR INSERT
WITH CHECK (true);

-- ==============================================================================
-- 8. Geological & Geotechnical Risk Assessment Records Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.risk_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    area TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    elevation DOUBLE PRECISION,
    slope_angle DOUBLE PRECISION,
    lithology TEXT,
    risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
    landslide_probability DOUBLE PRECISION,
    flood_probability DOUBLE PRECISION,
    soil_saturation DOUBLE PRECISION,
    ground_displacement_mm DOUBLE PRECISION,
    factor_of_safety DOUBLE PRECISION,
    scenario TEXT DEFAULT 'MONSOON_SURGE',
    advisory_headline TEXT,
    contributing_factors JSONB,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_risk_district ON public.risk_data(district, state);
CREATE INDEX IF NOT EXISTS idx_risk_score ON public.risk_data(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_risk_coords ON public.risk_data(latitude, longitude);

ALTER TABLE public.risk_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for risk data" ON public.risk_data;
CREATE POLICY "Public read access for risk data"
ON public.risk_data FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow write access for risk data" ON public.risk_data;
CREATE POLICY "Allow write access for risk data"
ON public.risk_data FOR INSERT
WITH CHECK (true);

-- ==============================================================================
-- 9. Active Disaster Events & Emergency Advisories Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.disaster_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    disaster_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
    state TEXT NOT NULL,
    district TEXT,
    area TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    threat_level TEXT DEFAULT 'HIGH',
    evacuation_status TEXT DEFAULT 'Normal' CHECK (evacuation_status IN ('Standby', 'Active Evacuation', 'Normal', 'High Vigilance')),
    shelters_available INTEGER DEFAULT 0,
    active_alerts_count INTEGER DEFAULT 1,
    protocol TEXT,
    issuing_authority TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    effective_time TIMESTAMPTZ DEFAULT NOW(),
    expires_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_disaster_events_active ON public.disaster_events(is_active);
CREATE INDEX IF NOT EXISTS idx_disaster_events_state ON public.disaster_events(state);
CREATE INDEX IF NOT EXISTS idx_disaster_events_severity ON public.disaster_events(severity);

ALTER TABLE public.disaster_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for disaster events" ON public.disaster_events;
CREATE POLICY "Public read access for disaster events"
ON public.disaster_events FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow write access for disaster events" ON public.disaster_events;
CREATE POLICY "Allow write access for disaster events"
ON public.disaster_events FOR ALL
USING (true);

-- ==============================================================================
-- 10. Disaster News & Extreme Weather Feed Cache Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.disaster_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT,
    source TEXT NOT NULL,
    source_url TEXT NOT NULL,
    image_url TEXT,
    disaster_category TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'MODERATE' CHECK (severity IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
    status_badge TEXT DEFAULT 'LIVE' CHECK (status_badge IN ('LIVE', 'BREAKING', 'UPDATED', 'ONGOING')),
    state TEXT,
    district TEXT,
    area TEXT,
    is_official_alert BOOLEAN DEFAULT false,
    official_authority TEXT,
    published_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_news_url UNIQUE (source_url)
);

CREATE INDEX IF NOT EXISTS idx_news_published ON public.disaster_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category ON public.disaster_news(disaster_category);
CREATE INDEX IF NOT EXISTS idx_news_state ON public.disaster_news(state);
CREATE INDEX IF NOT EXISTS idx_news_severity ON public.disaster_news(severity);

ALTER TABLE public.disaster_news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for disaster news" ON public.disaster_news;
CREATE POLICY "Public read access for disaster news"
ON public.disaster_news FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow write access for disaster news" ON public.disaster_news;
CREATE POLICY "Allow write access for disaster news"
ON public.disaster_news FOR INSERT
WITH CHECK (true);

-- ==============================================================================
-- 11. Historical Landslide & Telemetry Time Series Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.historical_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_name TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    elevation DOUBLE PRECISION,
    slope_angle DOUBLE PRECISION,
    lithology TEXT,
    record_timestamp TIMESTAMPTZ NOT NULL,
    time_range TEXT DEFAULT '24h' CHECK (time_range IN ('24h', '7d', '1m', '6m', '1y')),
    temperature DOUBLE PRECISION,
    temp_max DOUBLE PRECISION,
    temp_min DOUBLE PRECISION,
    humidity DOUBLE PRECISION,
    rainfall_mm DOUBLE PRECISION,
    wind_speed DOUBLE PRECISION,
    wind_direction TEXT,
    aqi INTEGER,
    aqi_category TEXT,
    pm25 DOUBLE PRECISION,
    pm10 DOUBLE PRECISION,
    risk_score INTEGER,
    risk_level TEXT,
    flood_risk TEXT,
    landslide_risk TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_history_coords ON public.historical_data(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_history_timestamp ON public.historical_data(record_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_history_range ON public.historical_data(time_range);

ALTER TABLE public.historical_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for historical data" ON public.historical_data;
CREATE POLICY "Public read access for historical data"
ON public.historical_data FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Allow write access for historical data" ON public.historical_data;
CREATE POLICY "Allow write access for historical data"
ON public.historical_data FOR INSERT
WITH CHECK (true);

-- ==============================================================================
-- 12. User Preferences & Alert Configurations Table
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    theme TEXT DEFAULT 'dark',
    default_scenario TEXT DEFAULT 'MONSOON_SURGE',
    alert_push_enabled BOOLEAN DEFAULT true,
    alert_sms_enabled BOOLEAN DEFAULT true,
    alert_email_enabled BOOLEAN DEFAULT true,
    risk_threshold_alert INTEGER DEFAULT 60,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their preferences" ON public.user_preferences;
CREATE POLICY "Users can manage their preferences"
ON public.user_preferences FOR ALL
USING (auth.uid() = user_id OR user_id IS NULL);

-- ==============================================================================
-- 13. Automatic Profile Creation Trigger from Supabase Auth (auth.users)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        mobile,
        age,
        age_group,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Operator'),
        NEW.email,
        NEW.raw_user_meta_data->>'mobile',
        (NEW.raw_user_meta_data->>'age')::INTEGER,
        NEW.raw_user_meta_data->>'age_group',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        email = EXCLUDED.email,
        updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 14. Realtime Publication Setup (Enables Supabase WebSocket Subscriptions)
-- ==============================================================================
DO $$
BEGIN
    -- Add tables to supabase_realtime publication if not already present
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'appointments'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'disaster_events'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.disaster_events;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'risk_data'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.risk_data;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        NULL; -- Realtime publication might already be configured
END $$;
