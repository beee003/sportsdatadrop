-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  file_url TEXT NOT NULL,
  public_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT
USING (bucket_id = 'videos');

-- Create storage policy for public upload (allows anyone to upload to videos bucket)
CREATE POLICY "Public upload videos" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'videos');

-- Enable Row Level Security (optional, adjust based on your needs)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read videos
CREATE POLICY "Public read access" ON videos
FOR SELECT
USING (true);

-- Policy to allow anyone to insert videos (for public uploads)
CREATE POLICY "Public insert access" ON videos
FOR INSERT
WITH CHECK (true);
