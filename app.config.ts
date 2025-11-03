import { defineConfig } from "solid-start/config";
import vercel from "solid-start-vercel";

export default defineConfig({
  adapter: vercel(),
  vite: {
    ssr: {
      noExternal: ["@supabase/supabase-js"],
    },
  },
});
