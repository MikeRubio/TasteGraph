/*
  # TasteGraph.ai Database Schema Setup

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `job_role` (text)
      - `industry` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `cultural_domains` (text array)
      - `geographical_targets` (text array)
      - `industry` (text)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `insights`
      - `id` (uuid, primary key)
      - `project_id` (uuid, references projects)
      - `audience_personas` (jsonb)
      - `cultural_trends` (jsonb)
      - `content_suggestions` (jsonb)
      - `qloo_data` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Create indexes for performance optimization

  3. Functions
    - Create trigger function for updating timestamps
    - Set up automatic timestamp updates on record changes
*/

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text UNIQUE NOT NULL,
    job_role text,
    industry text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can read own profile"
    ON user_profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Create trigger for user_profiles updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text NOT NULL,
    cultural_domains text[],
    geographical_targets text[],
    industry text,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Users can read own projects"
    ON projects
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
    ON projects
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
    ON projects
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
    ON projects
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Create trigger for projects updated_at
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for projects
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Create insights table
CREATE TABLE IF NOT EXISTS insights (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    audience_personas jsonb DEFAULT '[]'::jsonb,
    cultural_trends jsonb DEFAULT '[]'::jsonb,
    content_suggestions jsonb DEFAULT '[]'::jsonb,
    qloo_data jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS on insights
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Create policies for insights
CREATE POLICY "Users can read insights for own projects"
    ON insights
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = insights.project_id 
            AND projects.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert insights for own projects"
    ON insights
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = insights.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- Create indexes for insights
CREATE INDEX IF NOT EXISTS idx_insights_project_id ON insights(project_id);
CREATE INDEX IF NOT EXISTS idx_insights_created_at ON insights(created_at DESC);

-- Insert some sample data for testing (optional)
-- This will only work after you have authenticated users
-- You can remove this section if you prefer to start with a clean database

-- Note: The following INSERT statements are commented out because they require
-- actual user IDs from auth.users table. Uncomment and modify after creating users.

/*
-- Example user profile (replace with actual user ID)
INSERT INTO user_profiles (id, email, job_role, industry) 
VALUES (
    'your-user-id-here',
    'demo@tastegraph.ai',
    'marketing-manager',
    'technology'
) ON CONFLICT (id) DO NOTHING;

-- Example project (replace with actual user ID)
INSERT INTO projects (title, description, cultural_domains, geographical_targets, industry, user_id)
VALUES (
    'Eco-Friendly Fashion Brand',
    'Sustainable fashion targeting environmentally conscious millennials',
    ARRAY['fashion', 'sustainability', 'lifestyle'],
    ARRAY['US', 'UK', 'Canada'],
    'retail',
    'your-user-id-here'
) ON CONFLICT DO NOTHING;
*/