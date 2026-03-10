-- Create branding_settings table for enterprise branding persistence
CREATE TABLE public.branding_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text NOT NULL UNIQUE,
  setting_value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.branding_settings ENABLE ROW LEVEL SECURITY;

-- Admins can read branding settings
CREATE POLICY "Admins can read branding settings"
  ON public.branding_settings FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Admins can insert branding settings
CREATE POLICY "Admins can insert branding settings"
  ON public.branding_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- Admins can update branding settings
CREATE POLICY "Admins can update branding settings"
  ON public.branding_settings FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Seed default keys
INSERT INTO public.branding_settings (setting_key, setting_value) VALUES
  ('company_name', ''),
  ('tagline', ''),
  ('custom_domain', ''),
  ('primary_color', '#1a365d'),
  ('accent_color', '#e8590c'),
  ('certificate_title', 'Certificate of Completion'),
  ('signatory_name', ''),
  ('certificate_text', '')
ON CONFLICT (setting_key) DO NOTHING;