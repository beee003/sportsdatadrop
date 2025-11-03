import { defineConfig } from "solid-start/config";

export default defineConfig({
  vite: {
    ssr: {
      noExternal: ["@supabase/supabase-js"],
    },
  },
});
