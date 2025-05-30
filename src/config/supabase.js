import { createClient } from '@supabase/supabase-js'

// These will come from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Multi-tenant support - each dealership gets their own "schema" via prefixed tables
export const getTenantPrefix = (dealerId) => {
  return dealerId ? `dealer_${dealerId}_` : ''
}

// Helper function to get tenant-specific table name
export const getTenantTable = (tableName, dealerId = null) => {
  // For now, we'll use a simpler approach with dealer_id column
  // Later we can implement true multi-tenant with separate schemas
  return tableName
}
