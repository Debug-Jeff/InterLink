CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- e.g., 'Internship', 'Company Profile', 'Blog Post'
  status TEXT DEFAULT 'Draft', -- e.g., 'Published', 'Draft', 'Pending Review', 'Archived'
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- User who created/owns the content
  content_body TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to view published content
CREATE POLICY "Authenticated users can view published content." ON content FOR SELECT USING (status = 'Published' AND auth.role() = 'authenticated');

-- Policy for content authors to manage their own content
CREATE POLICY "Content authors can manage their own content." ON content FOR ALL USING (auth.uid() = author_id);

-- Policy for admins to manage all content
CREATE POLICY "Admins can manage all content." ON content FOR ALL TO authenticated USING (auth.role() = 'admin');
