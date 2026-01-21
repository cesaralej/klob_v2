create or replace function ingest_upload(
  p_user_id uuid,
  p_sales jsonb,
  p_products jsonb,
  p_transfers jsonb
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_upload_id uuid;
  v_row jsonb;
begin
  -- Security check
  if p_user_id != auth.uid() then
    raise exception 'Unauthorized';
  end if;

  -- 1. Create Upload Record
  -- We sum up the lengths for row_count
  insert into uploads (user_id, status, row_count)
  values (
    p_user_id, 
    'processing', 
    jsonb_array_length(p_sales) + jsonb_array_length(p_products) + jsonb_array_length(p_transfers)
  )
  returning id into v_upload_id;

  -- 2. Insert Sales
  if jsonb_array_length(p_sales) > 0 then
    insert into sales (
      upload_id, user_id, 
      act, codigo_unico, cantidad, pvp, subtotal, fecha_venta,
      tienda, codigo_tienda, temporada, familia, descripcion_familia,
      talla, color, precio_coste, es_online, mes
    )
    select 
      v_upload_id, p_user_id,
      r->>'act',
      r->>'codigoUnico',
      (r->>'cantidad')::numeric,
      (r->>'pvp')::numeric,
      (r->>'subtotal')::numeric,
      (r->>'fechaVenta')::date,
      r->>'tienda',
      r->>'codigoTienda',
      r->>'temporada',
      r->>'familia',
      r->>'descripcionFamilia',
      r->>'talla',
      r->>'color',
      (r->>'precioCoste')::numeric,
      (r->>'esOnline')::boolean,
      r->>'mes'
    from jsonb_array_elements(p_sales) as r;
  end if;

  -- 3. Insert Products
  if jsonb_array_length(p_products) > 0 then
    insert into products (
      upload_id, user_id,
      codigo_unico, cantidad_pedida, fecha_almacen, tema,
      pvp, precio_coste, familia, talla, color, temporada
    )
    select
      v_upload_id, p_user_id,
      r->>'codigoUnico',
      (r->>'cantidadPedida')::numeric,
      (r->>'fechaAlmacen')::date,
      r->>'tema',
      (r->>'pvp')::numeric,
      (r->>'precioCoste')::numeric,
      r->>'familia',
      r->>'talla',
      r->>'color',
      r->>'temporada'
    from jsonb_array_elements(p_products) as r;
  end if;

  -- 4. Insert Transfers
  if jsonb_array_length(p_transfers) > 0 then
    insert into transfers (
      upload_id, user_id,
      codigo_unico, enviado, tienda, fecha_enviado
    )
    select
      v_upload_id, p_user_id,
      r->>'codigoUnico',
      (r->>'enviado')::numeric,
      r->>'tienda',
      (r->>'fechaEnviado')::date
    from jsonb_array_elements(p_transfers) as r;
  end if;

  -- 5. Mark as Processed
  update uploads 
  set status = 'processed'
  where id = v_upload_id;

  return v_upload_id;

exception when others then
  raise;
end;
$$;
