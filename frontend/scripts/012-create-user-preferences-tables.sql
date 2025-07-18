-- Table for general user preferences (e.g., client portal users)
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_project_updates BOOLEAN DEFAULT TRUE,
  email_new_messages BOOLEAN DEFAULT TRUE,
  email_approvals BOOLEAN DEFAULT FALSE,
  inapp_project_updates BOOLEAN DEFAULT TRUE,
  inapp_new_messages BOOLEAN DEFAULT TRUE,
  theme TEXT DEFAULT 'system', -- 'light', 'dark', 'system'
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own preferences
CREATE POLICY "Users can manage their own preferences." ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- Table for company-specific preferences
CREATE TABLE IF NOT EXISTS company_preferences (
  company_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email_client_inquiries BOOLEAN DEFAULT TRUE,
  email_project_updates BOOLEAN DEFAULT TRUE,
  email_reports_ready BOOLEAN DEFAULT FALSE,
  theme TEXT DEFAULT 'system',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE company_preferences ENABLE ROW LEVEL SECURITY;

-- Policy for companies to manage their own preferences
CREATE POLICY "Companies can manage their own preferences." ON company_preferences FOR ALL USING (auth.uid() = company_id);

-- Table for admin-specific preferences
CREATE TABLE IF NOT EXISTS admin_preferences (
  admin_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  admin_new_user BOOLEAN DEFAULT TRUE,
  admin_content_review BOOLEAN DEFAULT TRUE,
  admin_system_alerts BOOLEAN DEFAULT FALSE,
  theme TEXT DEFAULT 'system',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE admin_preferences ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage their own preferences
CREATE POLICY "Admins can manage their own preferences." ON admin_preferences FOR ALL USING (auth.uid() = admin_id);
