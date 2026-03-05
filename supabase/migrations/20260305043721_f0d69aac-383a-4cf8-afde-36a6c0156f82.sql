CREATE TABLE public.processing_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type text NOT NULL DEFAULT 'video_search',
  status text NOT NULL DEFAULT 'processing',
  progress integer DEFAULT 0,
  total integer DEFAULT 0,
  result jsonb,
  error text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.processing_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read jobs"
  ON public.processing_jobs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role can manage jobs"
  ON public.processing_jobs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);