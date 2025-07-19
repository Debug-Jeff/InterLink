CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to the company user who owns this project
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL, -- Link to the client associated with this project
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending', -- e.g., 'pending', 'in_progress', 'completed', 'on_hold'
  start_date DATE,
  end_date DATE,
  budget NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy for companies to view and manage their own projects
CREATE POLICY "Companies can view their own projects." ON projects FOR SELECT USING (auth.uid() = company_id);
CREATE POLICY "Companies can insert their own projects." ON projects FOR INSERT WITH CHECK (auth.uid() = company_id);
CREATE POLICY "Companies can update their own projects." ON projects FOR UPDATE USING (auth.uid() = company_id);
CREATE POLICY "Companies can delete their own projects." ON projects FOR DELETE USING (auth.uid() = company_id);

-- Optional: Policy for admins to manage all projects
CREATE POLICY "Admins can manage all projects." ON projects FOR ALL TO authenticated USING (auth.role() = 'admin');
