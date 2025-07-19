CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL, -- Store settings as JSONB for flexibility
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage app settings
CREATE POLICY "Admins can manage app settings." ON app_settings FOR ALL TO authenticated USING (auth.role() = 'admin');

-- Optional: Policy for authenticated users to read certain public settings
CREATE POLICY "Authenticated users can read public app settings." ON app_settings FOR SELECT TO authenticated USING (key IN ('platform_name', 'contact_email'));
