CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Link to the company user who owns this client
  name TEXT NOT NULL,
  contact_email TEXT,
  contact_person TEXT,
  status TEXT DEFAULT 'active', -- e.g., 'active', 'inactive', 'lead'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Policy for companies to view and manage their own clients
CREATE POLICY "Companies can view their own clients." ON clients FOR SELECT USING (auth.uid() = company_id);
CREATE POLICY "Companies can insert their own clients." ON clients FOR INSERT WITH CHECK (auth.uid() = company_id);
CREATE POLICY "Companies can update their own clients." ON clients FOR UPDATE USING (auth.uid() = company_id);
CREATE POLICY "Companies can delete their own clients." ON clients FOR DELETE USING (auth.uid() = company_id);

-- Policy for admins to manage all clients 
CREATE POLICY "Admins can manage all clients." ON clients FOR ALL TO authenticated USING (auth.role() = 'admin');
