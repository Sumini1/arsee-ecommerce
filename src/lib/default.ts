
import { environtment } from "@/configs/environtment";
import { createClient } from "@supabase/supabase-js";

export function createClientSupabase() {
  return createClient(
    environtment.SUPABASE_URL!,
    environtment.SUPABASE_ANON_KEY!
  );
}
