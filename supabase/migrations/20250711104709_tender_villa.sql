/*
  # Add taste intersections and cross-domain recommendations to insights

  1. New Columns
    - `taste_intersections` (jsonb) - Array of taste intersection objects
    - `cross_domain_recommendations` (jsonb) - Array of cross-domain recommendation objects
  
  2. Changes
    - Add new columns to insights table with default empty arrays
    - Maintain backward compatibility with existing insights
*/

-- Add new columns to insights table
ALTER TABLE insights 
ADD COLUMN IF NOT EXISTS taste_intersections jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS cross_domain_recommendations jsonb DEFAULT '[]'::jsonb;