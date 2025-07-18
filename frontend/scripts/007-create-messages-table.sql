CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL, -- Optional: link to a project
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW SECURITY;

-- Policy for users to send messages
CREATE POLICY "Users can send messages." ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Policy for users to view messages where they are sender or recipient
CREATE POLICY "Users can view their own messages." ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Policy for users to mark their received messages as read
CREATE POLICY "Users can mark their received messages as read." ON messages FOR UPDATE USING (auth.uid() = recipient_id);

-- Optional: Policy for admins to manage all messages
CREATE POLICY "Admins can manage all messages." ON messages FOR ALL TO authenticated USING (auth.role() = 'admin');
