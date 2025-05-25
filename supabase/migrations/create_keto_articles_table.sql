/*
  # Create keto articles table

  1. New Tables
    - `keto_articles`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `summary` (text)
      - `image_url` (text)
      - `author` (text)
      - `published_at` (timestamptz)
      - `tags` (text array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  2. Security
    - Enable RLS on `keto_articles` table
    - Add policies for public access to articles
*/

CREATE TABLE IF NOT EXISTS keto_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  image_url TEXT,
  author TEXT,
  published_at TIMESTAMPTZ DEFAULT now(),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE keto_articles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to keto articles
CREATE POLICY "Keto articles are viewable by everyone"
  ON keto_articles
  FOR SELECT
  TO public
  USING (true);

-- Create a trigger to set updated_at on update
CREATE TRIGGER update_keto_articles_updated_at
BEFORE UPDATE ON keto_articles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
