import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qteeenrednnedkpnqnoi.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZWVlbnJlZG5uZWRrcG5xbm9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4Njk4MDYsImV4cCI6MjA5NDQ0NTgwNn0.Sib6MYgYt7IONgtzPLWPuty0rRD1lxRxlqrCYNx6QWQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
