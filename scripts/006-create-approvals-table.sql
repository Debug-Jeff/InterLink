CREATE TABLE IF NOT EXISTS approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- The client who needs to approve
  status TEXT DEFAULT 'pending', -- e.g., 'pending', 'approved', 'rejected'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;

-- Policy for clients to view and update their own approvals
CREATE POLICY "Clients can view their own approvals." ON approvals FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Clients can update their own approvals." ON approvals FOR UPDATE USING (auth.uid() = client_id);

-- Policy for companies to view approvals related to their projects
CREATE POLICY "Companies can view approvals for their projects." ON approvals FOR SELECT USING (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = approvals.project_id AND projects.company_id = auth.uid())
);

-- Policy for companies to create approvals for their projects
CREATE POLICY "Companies can create approvals for their projects." ON approvals FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM projects WHERE projects.id = approvals.project_id AND projects.company_id = auth.uid())
);

-- Optional: Policy for admins to manage all approvals
CREATE POLICY "Admins can manage all approvals." ON approvals FOR ALL TO authenticated USING (auth.role() = 'admin');
