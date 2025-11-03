import { defineConfig } from "solid-start/config";
import vercel from "solid-start-vercel";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  adapter: vercel(),
  vite: {
    ssr: {
      noExternal: ["@supabase/supabase-js"],
    },
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("./src", import.meta.url)),
        "@": fileURLToPath(new URL("./src/components/ui", import.meta.url)),
      },
    },
  },
});
