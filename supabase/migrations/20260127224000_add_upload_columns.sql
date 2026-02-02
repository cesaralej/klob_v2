-- Add missing columns to uploads table
ALTER TABLE uploads 
ADD COLUMN IF NOT EXISTS filename text,
ADD COLUMN IF NOT EXISTS sales_count integer,
ADD COLUMN IF NOT EXISTS products_count integer,
ADD COLUMN IF NOT EXISTS transfers_count integer;
