CREATE TABLE IF NOT EXISTS engagement_metrics (
  month TEXT PRIMARY KEY, -- e.g., 'Jan 2025', 'Feb 2025'
  month_order INTEGER UNIQUE, -- For proper sorting (e.g., 1 for Jan, 2 for Feb)
  clients INTEGER DEFAULT 0,
  projects INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE engagement_metrics ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users (e.g., admins, companies) to view engagement metrics
CREATE POLICY "Authenticated users can view engagement metrics." ON engagement_metrics FOR SELECT TO authenticated USING (TRUE);

-- Policy for admins to manage engagement metrics (e.g., for manual updates or data seeding)
CREATE POLICY "Admins can manage engagement metrics." ON engagement_metrics FOR ALL TO authenticated USING (auth.role() = 'admin');

-- Note: This table would typically be populated by a periodic job or a complex SQL view
-- that aggregates data from your 'clients' and 'projects' tables.
