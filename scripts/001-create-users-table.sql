CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user', -- 'user', 'client', 'company', 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies for RLS
CREATE POLICY "Users can view their own profile." ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON users FOR UPDATE USING (auth.uid() = id);

-- Function to insert new user into public.users table after auth.users creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on new auth.users creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Policy for admins to manage all users (uncomment if you have an admin role)
CREATE POLICY "Admins can view all user profiles." ON users FOR SELECT TO authenticated USING (auth.role() = 'admin');
CREATE POLICY "Admins can update all user profiles." ON users FOR UPDATE TO authenticated USING (auth.role() = 'admin');
CREATE POLICY "Admins can delete user profiles." ON users FOR DELETE TO authenticated USING (auth.role() = 'admin');
