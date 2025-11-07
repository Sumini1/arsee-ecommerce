import { environtment } from "@/configs/environtment";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type createClientOptions = {
  isAdmin?: boolean;
};

export async function createClient({ isAdmin = false }: createClientOptions = {}) {
  const cookieStore = await cookies();
  const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } =
    environtment;

  return createServerClient(
    SUPABASE_URL!,
    isAdmin ? SUPABASE_SERVICE_ROLE_KEY! : SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            console.error("Error setting cookies", cookiesToSet);
          }
        },
      },
    }
  );
}
