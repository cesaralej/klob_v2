-- Create a type for the sales item to match JSON structure
create type sales_item_input as (
  sale_date date,
  sku text,
  quantity integer,
  net_revenue numeric,
  size text,
  product_name text,
  category text
);

create or replace function ingest_upload(
  p_user_id uuid,
  p_rows jsonb
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_upload_id uuid;
  v_row jsonb;
  v_product_id uuid;
begin
  -- Security check: ensure user can only ingest for themselves
  if p_user_id != auth.uid() then
    raise exception 'Unauthorized';
  end if;
  -- 1. Create Upload Record
  insert into uploads (user_id, status, row_count)
  values (p_user_id, 'processing', jsonb_array_length(p_rows))
  returning id into v_upload_id;

  -- 2. Loop through rows
  for v_row in select * from jsonb_array_elements(p_rows)
  loop
    -- A. Upsert Product (Naive approach: if same SKU+User exists from previous uploads)
    -- Requirement: "No aggregated tables at ingestion time... Products table: upload_id, user_id, sku, name..."
    -- This implies products are scoped to the upload?? "All rows reference upload_id". 
    -- If so, we just INSERT new products for this upload.
    -- However, real products usually span uploads. 
    -- User said: "products... [cols]... upload_id". This strongly implies creating products PER upload (snapshot) or just linking.
    -- "All rows reference upload_id" -> Yes.
    -- So we will Insert into Products specific to this upload.
    
    insert into products (upload_id, user_id, sku, name, category)
    values (
      v_upload_id, 
      p_user_id, 
      v_row->>'sku', 
      v_row->>'product_name', 
      v_row->>'category'
    )
    returning id into v_product_id;

    -- B. Insert Sale
    insert into sales (
      upload_id, 
      user_id, 
      sale_date, 
      sku, 
      product_id, 
      size, 
      quantity, 
      net_revenue
    )
    values (
      v_upload_id,
      p_user_id,
      (v_row->>'sale_date')::date,
      v_row->>'sku',
      v_product_id,
      v_row->>'size',
      (v_row->>'quantity')::integer,
      (v_row->>'net_revenue')::numeric
    );
  end loop;

  -- 3. Mark as Processed
  update uploads 
  set status = 'processed'
  where id = v_upload_id;

  return v_upload_id;

exception when others then
  -- If anything fails, we mark upload as failed. 
  -- Note: The ROLLBACK will happen automatically for the transaction if called via RPC?
  -- Postgres functions are atomic. If exception raises, it rolls back everything in the function.
  -- But we want to persist the "Failed" status if possible?
  -- Actually, best practice: Let it roll back, catching error in API, and then insert a "Failed" record (or just rely on client to know it failed).
  -- OR: Use a block with specific exception handling if we want to save the partial state (we don't).
  -- "Either all rows are written or none". So default rollback is good.
  
  raise; -- Propagate error to caller
end;
$$;
