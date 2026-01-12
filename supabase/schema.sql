-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
-- 2. Products Table
-- ----------------------------
create table products (
  id uuid default uuid_generate_v4() primary key,
  upload_id uuid references uploads(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  sku text not null,
  name text,
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
-- 3. Sales Table
-- ----------------------------
create table sales (
  id uuid default uuid_generate_v4() primary key,
  upload_id uuid references uploads(id) on delete cascade not null,
  user_id uuid references auth.users not null,
  sale_date date not null,
  sku text not null,
  product_id uuid references products(id), -- optional link if products are guaranteed
  size text,
  quantity integer not null,
  net_revenue numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table sales enable row level security;

create policy "Users can view own sales"
  on sales for select
  using (auth.uid() = user_id);

create policy "Users can insert own sales"
  on sales for insert
  with check (auth.uid() = user_id);

-- Indexes for performance
create index idx_uploads_user on uploads(user_id);
create index idx_products_upload on products(upload_id);
create index idx_sales_upload on sales(upload_id);
create index idx_sales_date on sales(sale_date);
