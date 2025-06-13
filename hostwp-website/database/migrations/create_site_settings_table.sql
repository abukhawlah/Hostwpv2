-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  favicon_enabled BOOLEAN DEFAULT FALSE,
  favicon_url TEXT,
  site_title TEXT DEFAULT 'HostWP - Premium Web Hosting Services',
  site_description TEXT DEFAULT 'Professional WordPress Hosting Solutions',
  meta_keywords TEXT DEFAULT 'wordpress hosting, web hosting, domain registration',
  contact_email TEXT DEFAULT 'support@hostwp.com',
  support_phone TEXT DEFAULT '1-800-HOST-WP',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraint to ensure only one settings record
  CONSTRAINT single_settings_row CHECK (id = 1)
);

-- Create or replace function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS site_settings_updated_at ON site_settings;
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();

-- Insert default settings
INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Enable RLS (Row Level Security)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
-- In production, you might want to restrict this to admin users only
CREATE POLICY "Allow all operations for authenticated users" ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow read access for anon users (for public website)
CREATE POLICY "Allow read access for anon users" ON site_settings
  FOR SELECT
  TO anon
  USING (true); 