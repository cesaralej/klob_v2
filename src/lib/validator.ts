
export interface SalesData {
  act?: string
  codigoUnico?: string
  cantidad: number
  pvp?: number
  subtotal?: number
  fechaVenta?: string // ISO
  tienda: string
  codigoTienda?: string
  temporada?: string
  familia?: string
  descripcionFamilia?: string
  talla?: string
  color?: string
  precioCoste?: number
  esOnline: boolean
  mes?: string
}

export interface ProductsData {
  codigoUnico: string
  cantidadPedida?: number
  fechaAlmacen?: string // ISO
  tema: string
  pvp?: number
  precioCoste?: number
  familia?: string
  talla?: string
  color?: string
  temporada?: string
}

export interface TransfersData {
  codigoUnico?: string
  enviado?: number
  tienda: string
  fechaEnviado?: string
}

export interface ValidationResult {
  sales: SalesData[]
  products: ProductsData[]
  transfers: TransfersData[]
  errors: string[]
}

// --- Helpers ---

// Normalize string: trim, lowercase, remove accents
const normKey = (s: string) => s.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

// Dictionary
const DICT = {
  STORE_NAME: ['nombretpv', 'nombretpvdestino', 'tienda'],
  STORE_CODE: ['tpv', 'codigotienda'],
  SKU: ['articulo', 'codigounico', 'sku'],
  DATE: ['fecha documento', 'fecha almacen', 'fecha real entrada', 'fechapago'], 
  PRICE: ['p.v.p.', 'precio venta', 'pvp'],
  COST: ['precio coste', 'coste'],
  SUBTOTAL: ['subtotal', 'importe'],
  QTY: ['cantidad', 'unidades'],
}

// Header Mapper
function mapHeaders(row: any): Record<string, any> {
  const mapped: Record<string, any> = {}
  
  // Create a fast lookup of the row keys
  const keys = Object.keys(row)
  const normalizedKeys = keys.reduce((acc, k) => {
    acc[normKey(k)] = k // map normalized -> original
    return acc
  }, {} as Record<string, string>)
  
  // Helper to find value by dict or heuristic
  const findVal = (possibleKeys: string[], heuristic?: (k: string) => boolean) => {
    // 1. Dict match
    for (const pk of possibleKeys) {
      const nk = normKey(pk)
      if (normalizedKeys[nk]) return row[normalizedKeys[nk]] // exact match
    }
    
    // 2. Iterate all keys for substring/heuristic
    for (const k of keys) {
      const nk = normKey(k)
      // Check dict substring matches
      for (const pk of possibleKeys) {
          if (nk === normKey(pk)) return row[k]
      }
      
      // Heuristics
      if (heuristic && heuristic(nk)) return row[k]
    }
    return undefined
  }
 
  return {
    raw: row, // keep raw for specific lookups
    find: findVal
  }
}

// Parse Number (Euro format support)
// "1.200,50" -> 1200.50
// 1200.50 -> 1200.50
function parseNumber(val: any): number {
  if (val === null || val === undefined || val === '') return NaN
  if (typeof val === 'number') return val
  
  let s = String(val).trim()
  // Check if euro format: contains ',' and maybe '.' as thousands?
  // 1.200,50
  if (s.includes(',') && s.includes('.')) {
     // Assume . is thousands, , is decimal
     s = s.replace(/\./g, '').replace(',', '.')
  } else if (s.includes(',')) {
     // , is decimal - but wait! 
     // What if "1,200" is US format (1200)? 
     // Prompt says "Must handle Euro-format decimals (comma , as separator)."
     // So we assume comma is decimal.
     s = s.replace(',', '.')
  }
  // Remove currency symbols if any
  s = s.replace(/[€$]/g, '')
  
  return parseFloat(s)
}

function parseDate(val: any): string | undefined {
  if (!val) return undefined
  try {
    let d: Date | undefined
    
    // Excel Serial
    if (typeof val === 'number') {
       // Excel serial date from 1900
       // 25569 is offset for 1970-01-01
       d = new Date(Math.round((val - 25569) * 86400 * 1000))
    }
    else if (val instanceof Date) {
        d = val
    }
    else {
        // String formats
        const s = String(val).trim()
        
        // DD/MM/YYYY or DD-MM-YYYY or D-M-YYYY
        // Check regex ^\d{1,2}[/-]\d{1,2}[/-]\d{4}
        if (/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/.test(s)) {
            const parts = s.split(/[/-]/)
            // parts[0] = Day, parts[1] = Month, parts[2] = Year
            // Construct UTC date
            // Month is 0-indexed in JS Date? Yes. 
            // new Date(Date.UTC(2024, 0, 1)) -> 2024-01-01T00:00:00.000Z
            const day = Number(parts[0])
            const month = Number(parts[1]) - 1
            const year = Number(parts[2])
            d = new Date(Date.UTC(year, month, day))
        } else {
            // ISO or other?
            // "2024-01-01" -> Date.parse assumes UTC if ISO, but depends on browser/node version?
            // Safer to split if ISO-like YYYY-MM-DD
             if (/^(\d{4})-(\d{2})-(\d{2})/.test(s)) {
                 const [_, y, m, day] = s.match(/^(\d{4})-(\d{2})-(\d{2})/)!
                 d = new Date(Date.UTC(Number(y), Number(m)-1, Number(day)))
             } else {
                 d = new Date(s)
             }
        }
    }
    
    if (d && !isNaN(d.getTime())) {
        return d.toISOString().split('T')[0]
    }
  } catch (e) {
      return undefined
  }
  return undefined
}

// --- Main Validator ---

export function validateAndNormalize(raw: { sales: any[], products: any[], transfers: any[] }): ValidationResult {
  const result: ValidationResult = { sales: [], products: [], transfers: [], errors: [] }
  
  // 1. Sales
  raw.sales.forEach((row, i) => {
    const rowNum = i + 2 // approx
    
    // Helpers
    const keys = Object.keys(row)
    const normKeys = keys.map(k => normKey(k))
    
    const find = (keywords: string[]) => {
        for (const k of keys) {
            const nk = normKey(k)
            if (keywords.some(kw => nk === kw || nk.includes(kw))) return row[k]
        }
    }
    
    // Map Fields
    // act -> "act"
    const act = row['act'] || row['ACT']
    
    // codigoUnico -> "articulo" (excl "modelo"), "codigoUnico"
    // Heuristic: "articulo" but not "modelo"
    let codigoUnico = row['codigoUnico']
    if (!codigoUnico) {
        const artKey = keys.find(k => {
            const nk = normKey(k)
            return nk.includes('articulo') && !nk.includes('modelo')
        })
        if (artKey) codigoUnico = row[artKey]
    }
    // Fallback dict
    if (!codigoUnico) codigoUnico = find(DICT.SKU)
    
    const quantity = parseNumber(row['cantidad'] || find(DICT.QTY)) || 0
    const pvp = parseNumber(row['pvp'] || find(DICT.PRICE)) || 0
    const subtotal = parseNumber(row['subtotal'] || find(DICT.SUBTOTAL)) || 0
    
    const fechaVentaRaw = row['fechaVenta'] || find(DICT.DATE)
    const fechaVenta = parseDate(fechaVentaRaw)
    
    const tienda = row['tienda'] || find(DICT.STORE_NAME)
    const codigoTienda = row['codigoTienda'] || find(DICT.STORE_CODE)
    
    const temporada = row['temporada'] || find(['temporada'])
    
    // Familia: heuristic *descripcion* + *familia*
    let descripcionFamilia = row['descripcionFamilia']
    if (!descripcionFamilia) {
        const descFamKey = keys.find(k => {
            const nk = normKey(k)
            return nk.includes('descripcion') && nk.includes('familia')
        })
        if (descFamKey) descripcionFamilia = row[descFamKey]
    }
    const familia = row['familia'] || find(['familia']) // Code
    
    const talla = row['talla'] || find(['talla'])
    const color = row['color'] || find(['color', 'descripcion color'])
    const precioCoste = parseNumber(row['precioCoste'] || find(DICT.COST)) || 0
    
    // Business Rules
    // 1. Exclude Stores
    if (tienda && typeof tienda === 'string') {
        const t = tienda.toUpperCase()
        if (t.includes('COMODIN') || t.includes('R998') || t.includes('ECI ONLINE') || t.includes('DEVOLUCIONES WEB')) {
            return // Drop
        }
    }
    
    // 2. Min Viable
    // Valid tienda AND (qty != 0 OR subtotal > 0)? 
    // "Yes (or Subtotal > 0)" for Cantidad. "Mandatory? Yes" for Tienda.
    if (!tienda) {
       // Only log error if it looks like a real row (has sku?)
       if (codigoUnico) result.errors.push(`Sales Row ${rowNum}: Missing Store`)
       return
    }
    
    const validQty = (quantity !== 0 && !isNaN(quantity))
    const validSub = (subtotal !== 0 && !isNaN(subtotal)) // subtotal can be negative? "Subtotal > 0" in prompt text might just mean "exists"
    // Prompt: "cantidad ... Mandatory? Yes (or Subtotal > 0)"
    if (!validQty && !(subtotal > 0)) {
        // result.errors.push(`Sales Row ${rowNum}: Invalid Quantity/Subtotal`)
        // Drop? Or Report? 
        // "Excel reads often include trailing rows..." -> Drop if empty-ish.
        if (!codigoUnico) return 
        // If has SKU but no qty/rev, treat as 0? or Error?
        // Prompt says mandatory. We will drop/error.
        // Let's drop silently if SKU is missing too; error if SKU exists.
        result.errors.push(`Sales Row ${rowNum}: Invalid Quantity/Subtotal for SKU ${codigoUnico}`)
        return 
    }
    
    // Computed
    const esOnline = tienda.toLowerCase().includes('online')
    let mes = undefined
    if (fechaVenta) {
       // "enero 2024"
       const d = new Date(fechaVenta)
       const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
       mes = `${months[d.getMonth()]} ${d.getFullYear()}`
    }

    result.sales.push({
        act,
        codigoUnico: String(codigoUnico || '').trim(),
        cantidad: quantity,
        pvp,
        subtotal,
        fechaVenta,
        tienda: String(tienda).trim(),
        codigoTienda,
        temporada,
        familia,
        descripcionFamilia: String(descripcionFamilia || '').trim(),
        talla,
        color,
        precioCoste,
        esOnline,
        mes
    })
  })
  
  // 2. Products
  raw.products.forEach((row, i) => {
     const rowNum = i + 2
     const keys = Object.keys(row)
     const find = (keywords: string[], heuristic?: any) => {
        for (const k of keys) {
            const nk = normKey(k)
            if (keywords.some(kw => nk === kw || nk.includes(kw))) return row[k]
        }
        if (heuristic) {
             for (const k of keys) {
                 if (heuristic(normKey(k))) return row[k]
             }
        }
    }
    
    // codigoUnico
    let codigoUnico = row['codigoUnico']
    if (!codigoUnico) {
         // "articulo" excluding "modelo"
         const k = keys.find(key => {
             const nk = normKey(key)
             return nk.includes('articulo') && !nk.includes('modelo')
         })
         if (k) codigoUnico = row[k]
    }
    if (!codigoUnico) codigoUnico = find(DICT.SKU)
    
    if (!codigoUnico) {
        // result.errors.push(`Product Row ${rowNum}: Missing SKU`)
        return // skip
    }
    
    const cantidadPedida = parseNumber(row['cantidadPedida'] || find(['cantidad', 'pedida']))
    
    // fechaAlmacen: fuzzy "fecha" + "almac"
    let fechaAlmacenRaw = row['fechaAlmacen']
    if (!fechaAlmacenRaw) {
        fechaAlmacenRaw = find([], (nk: string) => nk.includes('fecha') && nk.includes('almac'))
    }
    const fechaAlmacen = parseDate(fechaAlmacenRaw)
    
    let tema = row['tema'] || find(['tema'])
    if (!tema || String(tema).toLowerCase() === 'sin tema' || String(tema) === 'null') { // check strict null?
        tema = 'Sin Tema'
    } else {
        tema = String(tema).trim()
        if (tema === '') tema = 'Sin Tema'
    }
    
    const pvp = parseNumber(row['pvp'] || find(DICT.PRICE))
    const precioCoste = parseNumber(row['precioCoste'] || find(DICT.COST))
    const familia = row['familia'] || find(['familia'])
    const talla = row['talla'] || find(['talla'])
    const color = row['color'] || find(['color'])
    const temporada = row['temporada'] || find(['temporada'])
    
    result.products.push({
        codigoUnico: String(codigoUnico).trim(),
        cantidadPedida,
        fechaAlmacen,
        tema,
        pvp,
        precioCoste,
        familia,
        talla,
        color,
        temporada
    })
  })
  
  // 3. Transfers
  raw.transfers.forEach((row, i) => {
      const rowNum = i + 2
      const keys = Object.keys(row)
      const find = (keywords: string[]) => {
        for (const k of keys) {
            const nk = normKey(k)
            if (keywords.some(kw => nk === kw || nk.includes(kw))) return row[k]
        }
      }
      
      const codigoUnico = row['codigoUnico'] || find(DICT.SKU)
      const enviado = parseNumber(row['enviado'] || find(['enviado', 'cantidad']))
      const tienda = row['tienda'] || find(DICT.STORE_NAME)
      const fechaEnviado = parseDate(row['fechaEnviado'] || find(['fecha enviado', 'fecha']))
      
      if (!tienda) {
          // Skip if empty row
          if (codigoUnico) result.errors.push(`Transfer Row ${rowNum}: Missing Destination Store`)
          return
      }
      
      result.transfers.push({
          codigoUnico: codigoUnico ? String(codigoUnico).trim() : undefined,
          enviado,
          tienda: String(tienda).trim(),
          fechaEnviado
      })
  })

  // Deduping?
  // Not requested, but implicit in SQL "insert ... values" -> Postgres will insert all rows.
  // Validation seems robust enough.
  
  return result
}
