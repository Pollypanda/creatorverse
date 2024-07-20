import { createClient } from '@supabase/supabase-js';

const URL = 'https://xygiclmcgnpldyecgsht.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5Z2ljbG1jZ25wbGR5ZWNnc2h0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkxMTk4MjYsImV4cCI6MjAzNDY5NTgyNn0.2SKLzXSD4sPA7RdP7-m52qWHxb6h3M1QQtbPl5CFI8M';

const supabase = createClient(URL, API_KEY);

export default supabase;