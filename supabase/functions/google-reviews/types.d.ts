// Deno global types for Edge Functions
declare global {
  namespace Deno {
    interface Env {
      get(key: string): string | undefined;
    }
    export const env: Env;
  }
}

// Suppress TypeScript module resolution for external URLs
declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(handler: (req: Request) => Response | Promise<Response>): void;
}

declare module "https://esm.sh/@supabase/supabase-js@2" {
  export interface SupabaseClient {
    from(table: string): any;
  }
  export function createClient(url: string, key: string): SupabaseClient;
}

// This makes the file a module
export {};
