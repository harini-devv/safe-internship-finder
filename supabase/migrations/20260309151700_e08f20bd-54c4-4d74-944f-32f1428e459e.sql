
-- Create scam_reports table
CREATE TABLE public.scam_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  internship_title TEXT NOT NULL,
  description TEXT NOT NULL,
  contact_email TEXT,
  website_url TEXT,
  scam_type TEXT NOT NULL DEFAULT 'other',
  risk_level TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scam_reports ENABLE ROW LEVEL SECURITY;

-- Anyone can read reports
CREATE POLICY "Anyone can view scam reports" ON public.scam_reports FOR SELECT USING (true);

-- Authenticated users can create reports
CREATE POLICY "Authenticated users can create reports" ON public.scam_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reports
CREATE POLICY "Users can update own reports" ON public.scam_reports FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own reports
CREATE POLICY "Users can delete own reports" ON public.scam_reports FOR DELETE USING (auth.uid() = user_id);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_scam_reports_updated_at
  BEFORE UPDATE ON public.scam_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
