/*
  # Dot Studio Landing Page - Database Schema

  ## Overview
  Creates the database structure for storing medical professional contact form submissions
  from Dot Studio's landing page, including WhatsApp verification status.

  ## New Tables
  
  ### `submissions`
  Stores all form submissions from doctors, clinics, and medical centers
  
  - `id` (uuid, primary key) - Unique identifier for each submission
  - `first_name` (text) - First name of the contact person
  - `last_name` (text) - Last name of the contact person
  - `whatsapp` (text) - WhatsApp phone number
  - `whatsapp_verified` (boolean) - Whether the WhatsApp number was verified via OTP
  - `email` (text) - Email address
  - `brand_name` (text) - Name of the medical brand/practice
  - `representative_type` (text) - Type: 'doctor', 'clinic', 'medical_center', 'other'
  - `medical_specialty` (text, nullable) - Medical specialty (shown for doctors/clinics)
  - `brand_field` (text, nullable) - Brand field description (shown for 'other' option)
  - `city` (text) - City name or 'all_ksa' or 'outside_ksa'
  - `country` (text) - Country name (defaults to 'السعودية' for KSA cities)
  - `website` (text, nullable) - Website URL
  - `instagram` (text, nullable) - Instagram handle/URL
  - `youtube` (text, nullable) - YouTube channel URL
  - `tiktok` (text, nullable) - TikTok handle/URL
  - `snapchat` (text, nullable) - Snapchat handle/URL
  - `message_to_management` (text, nullable) - Direct message to management (max 1000 chars)
  - `notes` (text, nullable) - Additional notes
  - `created_at` (timestamptz) - Submission timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  
  - Enable RLS on `submissions` table
  - Public users can INSERT their own submissions (for form submission)
  - Only authenticated admin users can SELECT/UPDATE/DELETE submissions
  
  ## Notes
  
  1. WhatsApp verification will be handled by Edge Function integration
  2. Country field auto-fills with 'السعودية' for KSA cities
  3. Conditional fields (medical_specialty, brand_field) are nullable
  4. All social media links are optional
  5. Message to management is limited to 1000 characters at application level
*/

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  whatsapp text NOT NULL,
  whatsapp_verified boolean DEFAULT false,
  email text NOT NULL,
  brand_name text NOT NULL,
  representative_type text NOT NULL CHECK (representative_type IN ('doctor', 'clinic', 'medical_center', 'other')),
  medical_specialty text,
  brand_field text,
  city text NOT NULL,
  country text NOT NULL DEFAULT 'السعودية',
  website text,
  instagram text,
  youtube text,
  tiktok text,
  snapchat text,
  message_to_management text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert submissions (for public form)
CREATE POLICY "Anyone can submit forms"
  ON submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Only authenticated users can view submissions (admin only)
CREATE POLICY "Authenticated users can view all submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can update submissions
CREATE POLICY "Authenticated users can update submissions"
  ON submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Only authenticated users can delete submissions
CREATE POLICY "Authenticated users can delete submissions"
  ON submissions
  FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_whatsapp ON submissions(whatsapp);
CREATE INDEX IF NOT EXISTS idx_submissions_email ON submissions(email);

GRANT INSERT ON submissions TO anon;
GRANT SELECT, UPDATE, DELETE ON submissions TO authenticated;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_submissions_updated_at ON submissions;
CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();