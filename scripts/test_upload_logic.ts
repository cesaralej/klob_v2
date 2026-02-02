
import { validateAndNormalize } from '../src/lib/validator'

// Mock Data
const mockRaw = {
  sales: [
    {
      'Fecha Documento': '01/01/2024',
      'Articulo': 'SKU123',
      'Cantidad': 5,
      'P.V.P.': '1.200,50 €',
      'NombreTPV': 'Tienda Madrid',
      'Subtotal': '6002,50' 
    },
    {
       'fechaVenta': 45321, // Excel serial
       'codigoUnico': 'SKU456',
       'cantidad': 0,
       'tienda': 'COMODIN', // Should be excluded
       'subtotal': 0
    },
    {
       // ZERO QUANTITY SKIPPED TEST
       'codigoUnico': 'SKU_ZERO',
       'cantidad': 0,
       'subtotal': 0,
       'tienda': 'Tienda Test'
    },
    {
        // EMPTY ROW TEST
    },
    {
        // ALMOST EMPTY ROW TEST (all nulls/empty strings)
        'Articulo': '',
        'Cantidad': null
    },
    {
       // Heuristic scan test for family
       'Descripcion Familia': 'Camisetas',
       'Articulo': 'SKU789',
       'Tienda': 'Tienda Sevilla',
       'Cantidad': 1,
       'Subtotal': 10
    }
  ],
  products: [
    {
      'Artículo': 'SKU123',
      'Fecha REAL entrada en almacen': '2024-02-01',
      'Tema': 'Verano'
    },
    {
       'codigoUnico': 'SKU999',
       'tema': 'sin tema' // Should become 'Sin Tema'
    }
  ],
  transfers: [
    {
        'Articulo': 'SKU123',
        'Enviado': 10,
        'NombreTpvDestino': 'Tienda Barcelona',
        'Fecha': '05-05-2024'
    }
  ]
}

console.log('--- RUNNING VALIDATION TEST ---')
const result = validateAndNormalize(mockRaw)

console.log('--- ERRORS ---')
console.log(result.errors)

console.log('--- SALES (First 3) ---')
console.log(JSON.stringify(result.sales.slice(0, 3) || [], null, 2))

console.log('--- PRODUCTS ---')
console.log(JSON.stringify(result.products || [], null, 2))

console.log('--- TRANSFERS ---')
console.log(JSON.stringify(result.transfers || [], null, 2))

// Simple assert
if (result.sales.length > 0) {
    // Check first sale
    const s = result.sales[0]
    if (s.codigo_unico === 'SKU123' && s.subtotal === 6002.5) {
        console.log('✅ Basic Sales Check Passed')
    } else {
        console.error('❌ Basic Sales Check Failed')
    }
} else {
    console.warn('⚠️ No sales found')
}
