-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------
-- CLEANUP (Reset for new schema)
-- ----------------------------
-- WARNING: This deletes existing data in these tables. 
-- Since we are restructuring the tables significantly, a full reset is recommended.
DROP TABLE IF EXISTS sales CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS transfers CASCADE;
DROP TABLE IF EXISTS uploads CASCADE;

-- ----------------------------
-- 1. Uploads Table
-- ----------------------------
create table uploads (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  status text check (status in ('pending', 'processing', 'processed', 'failed')) not null default 'pending',
  parser_version text,
  row_count integer,
  warnings jsonb,
  error_message text,
  filename text,
  sales_count integer,
  products_count integer,
  transfers_count integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table uploads enable row level security;

create policy "Users can view own uploads"
  on uploads for select
  using (auth.uid() = user_id);

create policy "Users can insert own uploads"
  on uploads for insert
  with check (auth.uid() = user_id);

create policy "Users can update own uploads"
  on uploads for update
  using (auth.uid() = user_id);

create policy "Users can delete own uploads"
  on uploads for delete
  using (auth.uid() = user_id);

-- ----------------------------
-- 2. Products Table (Updated)
-- ----------------------------
create table products (
  id uuid default uuid_generate_v4() primary key,
  upload_id uuid references uploads(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  
  -- Core Fields
  codigo_unico text not null, -- SKU
  
  -- Additional Fields from Req
  cantidad_pedida numeric,
  fecha_almacen date,
  tema text default 'Sin Tema',
  
  -- Common Fields
  pvp numeric,
  precio_coste numeric,
  familia text,
  talla text,
  color text,
  temporada text,
  
  -- Legacy/Optional
  name text, -- mapped to descripcionFamilia or similar? Req says "descripcionFamilia" is in Sales, but Products has common fields.
  category text, 

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table products enable row level security;

create policy "Users can view own products"
  on products for select
  using (auth.uid() = user_id);

create policy "Users can insert own products"
  on products for insert
  with check (auth.uid() = user_id);

-- ----------------------------
-- 3. Sales Table (Updated)
-- ----------------------------
create table sales (
  id uuid default uuid_generate_v4() primary key,
  upload_id uuid references uploads(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  
  -- Core fields
  act text, -- Data version/ID
  codigo_unico text, -- SKU
  cantidad numeric not null,
  pvp numeric,
  subtotal numeric,
  fecha_venta date,
  tienda text not null,
  codigo_tienda text,
  
  -- Product Details in Sales
  temporada text,
  familia text,
  descripcion_familia text,
  talla text,
  color text,
  precio_coste numeric,

  -- Computed/Normalized
  es_online boolean default false,
  mes text,

  -- Legacy mappings if needed
  sku text generated always as (codigo_unico) stored, -- alias for backward compat if app uses 'sku'
  sale_date date generated always as (fecha_venta) stored, -- alias
  net_revenue numeric generated always as (subtotal) stored, -- alias
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table sales enable row level security;

create policy "Users can view own sales"
  on sales for select
  using (auth.uid() = user_id);

create policy "Users can insert own sales"
  on sales for insert
  with check (auth.uid() = user_id);

-- ----------------------------
-- 4. Transfers Table (New)
-- ----------------------------
create table transfers (
  id uuid default uuid_generate_v4() primary key,
  upload_id uuid references uploads(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  
  codigo_unico text,
  enviado numeric,
  tienda text not null, -- Destination Store
  fecha_enviado date,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table transfers enable row level security;

create policy "Users can view own transfers"
  on transfers for select
  using (auth.uid() = user_id);

create policy "Users can insert own transfers"
  on transfers for insert
  with check (auth.uid() = user_id);

-- ----------------------------
-- Indexes
-- ----------------------------
create index idx_uploads_user on uploads(user_id);
create index idx_products_upload on products(upload_id);
create index idx_sales_upload on sales(upload_id);
create index idx_transfers_upload on transfers(upload_id);

create index idx_products_sku on products(codigo_unico);
create index idx_sales_date on sales(fecha_venta);
