/*
  # Add Taste Intersections and Cross-Domain Recommendations to Insights

  1. Schema Updates
    - Add `taste_intersections` column to `insights` table (jsonb)
    - Add `cross_domain_recommendations` column to `insights` table (jsonb)
    
  2. Data Structure
    - `taste_intersections`: Array of intersection objects showing persona overlaps
    - `cross_domain_recommendations`: Array of cross-domain expansion opportunities
    
  3. Backward Compatibility
    - New columns have default empty arrays
    - Existing insights remain unchanged
*/

-- Add new columns to insights table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'insights' AND column_name = 'taste_intersections'
  ) THEN
    ALTER TABLE insights ADD COLUMN taste_intersections jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'insights' AND column_name = 'cross_domain_recommendations'
  ) THEN
    ALTER TABLE insights ADD COLUMN cross_domain_recommendations jsonb DEFAULT '[]'::jsonb;
  END IF;
END $$;