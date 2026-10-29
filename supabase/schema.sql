-- Eco Sense: Supabase Products Table & Contact Messages Schema
-- Run this in your Supabase Dashboard -> SQL Editor

CREATE TABLE IF NOT EXISTS public.products (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "price" NUMERIC NOT NULL,
  "icon" TEXT,
  "badge" TEXT,
  "description" TEXT,
  "material" TEXT,
  "packaging" TEXT,
  "carbonKg" NUMERIC,
  "waterLitres" NUMERIC,
  "plasticGrams" NUMERIC,
  "certifications" JSONB DEFAULT '[]'::jsonb,
  "madeInKm" NUMERIC,
  "isEcoFriendly" BOOLEAN DEFAULT false,
  "conventionalAlternativeId" TEXT,
  "ecoHighlights" JSONB DEFAULT '[]'::jsonb,
  "imageQuery" TEXT,
  "photographer" TEXT,
  "image" TEXT,
  "images" JSONB DEFAULT '[]'::jsonb,
  "photoId" TEXT,
  "alt" TEXT,
  "lqip" TEXT,
  "imageCredit" JSONB DEFAULT '{}'::jsonb,
  "barcode" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure barcode column exists if products table was created earlier
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "barcode" TEXT;

-- Enable Row Level Security (RLS) on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for anon key and authenticated users)
DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
CREATE POLICY "Allow public read access on products"
  ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow public insert/upsert for seeding
DROP POLICY IF EXISTS "Allow anon upsert on products" ON public.products;
CREATE POLICY "Allow anon upsert on products"
  ON public.products
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- =========================================================
-- Contact Messages Table (for /contact submissions)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) on contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anon and authenticated users to submit contact messages (insert-only)
DROP POLICY IF EXISTS "Allow anon insert on contact_messages" ON public.contact_messages;
CREATE POLICY "Allow anon insert on contact_messages"
  ON public.contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
