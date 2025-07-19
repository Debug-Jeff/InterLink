CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new', -- e.g., 'new', 'in_progress', 'resolved'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Policy for companies to view and manage their own inquiries
CREATE POLICY "Companies can view their own inquiries." ON inquiries FOR SELECT USING (auth.uid() = company_id);
CREATE POLICY "Companies can insert inquiries." ON inquiries FOR INSERT WITH CHECK (auth.uid() = company_id);
CREATE POLICY "Companies can update their own inquiries." ON inquiries FOR UPDATE USING (auth.uid() = company_id);
CREATE POLICY "Companies can delete their own inquiries." ON inquiries FOR DELETE USING (auth.uid() = company_id);

-- Optional: Policy for admins to manage all inquiries
CREATE POLICY "Admins can manage all inquiries." ON inquiries FOR ALL TO authenticated USING (auth.role() = 'admin');
