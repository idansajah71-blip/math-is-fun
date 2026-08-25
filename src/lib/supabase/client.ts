import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes("your-project") || key.includes("your-anon")) {
    // Return a dummy client that won't crash — auth features will be disabled
    if (!client) {
      client = createBrowserClient(
        "https://placeholder.supabase.co",
        "placeholder-key"
      );
    }
    return client;
  }

  return createBrowserClient(url, key);
}
