/*
  # Create Qloo Cache Table

  1. New Tables
    - `qloo_cache`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `request_hash` (text, unique index for deduplication)
      - `industry` (text)
      - `description` (text)
      - `cultural_domains` (text array)
      - `geographical_targets` (text array)
      - `qloo_response` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `qloo_cache` table
    - Add policy for service role access

  3. Indexes
    - Index on project_id for fast lookups
    - Index on created_at for TTL queries
    - Unique index on request_hash for deduplication
*/

CREATE TABLE IF NOT EXISTS qloo_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  request_hash text UNIQUE NOT NULL,
  industry text,
  description text NOT NULL,
  cultural_domains text[],
  geographical_targets text[],
  qloo_response jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_qloo_cache_project_id ON qloo_cache(project_id);
CREATE INDEX IF NOT EXISTS idx_qloo_cache_created_at ON qloo_cache(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_qloo_cache_request_hash ON qloo_cache(request_hash);

-- Enable RLS
ALTER TABLE qloo_cache ENABLE ROW LEVEL SECURITY;

-- Service role can access all cache entries (for server-side operations)
CREATE POLICY "Service role can manage qloo_cache"
  ON qloo_cache
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Users can read cache entries for their own projects
CREATE POLICY "Users can read cache for own projects"
  ON qloo_cache
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = qloo_cache.project_id 
      AND projects.user_id = auth.uid()
    )
  );