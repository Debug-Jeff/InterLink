CREATE TABLE IF NOT EXISTS company_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- The company user associated with the activity
  type TEXT NOT NULL, -- e.g., 'client_feedback', 'project_update', 'new_inquiry'
  description TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE company_activities ENABLE ROW LEVEL SECURITY;

-- Policy for companies to view their own activities
CREATE POLICY "Companies can view their own activities." ON company_activities FOR SELECT USING (auth.uid() = company_id);

-- Policy for companies to insert their own activities (e.g., via server actions or triggers)
CREATE POLICY "Companies can insert their own activities." ON company_activities FOR INSERT WITH CHECK (auth.uid() = company_id);

-- Note: In a real application, these tables would often be populated by database triggers
-- or server-side logic reacting to changes in other tables (e.g., new client, project status change).
