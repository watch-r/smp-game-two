// supabase.js
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://vgozjohzjxjutnyuymve.supabase.co";
const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnb3pqb2h6anhqdXRueXV5bXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NTI4NzIsImV4cCI6MjA2OTAyODg3Mn0.HILE2MHCPtGctr1nMt-bX_ZD3fZsFwcF2ZlbVnYzCj0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
