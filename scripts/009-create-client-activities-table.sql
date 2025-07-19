CREATE TABLE IF NOT EXISTS client_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- The client user associated with the activity
  type TEXT NOT NULL, -- e.g., 'project_assigned', 'approval_needed', 'message_received'
  description TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE client_activities ENABLE ROW LEVEL SECURITY;

-- Policy for clients to view their own activities
CREATE POLICY "Clients can view their own activities." ON client_activities FOR SELECT USING (auth.uid() = client_id);

-- Policy for clients to insert their own activities (e.g., via server actions or triggers)
CREATE POLICY "Clients can insert their own activities." ON client_activities FOR INSERT WITH CHECK (auth.uid() = client_id);

-- Note: Similar to company_activities, this table would typically be populated by database triggers
-- or server-side logic.
