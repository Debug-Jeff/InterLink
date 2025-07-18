-- InterLink Database Fixes
-- Run this in your Supabase SQL Editor to fix the user registration issue

-- 1. Add INSERT policy for users table to allow service role (admin) to create users
CREATE POLICY "Service role can create users" ON users FOR INSERT WITH CHECK (true);

-- 2. Update the trigger function to use the correct metadata field names
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, first_name, last_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'firstName', 'New'),
    COALESCE(NEW.raw_user_meta_data->>'lastName', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

SELECT 'Database fixes applied successfully!' as message;