import { defineConfig } from "vite";
import solid from "solid-start/vite";
import vercel from "solid-start-vercel";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    solid({
      adapter: vercel(),
      ssr: {
        noExternal: ["@supabase/supabase-js"],
      },
    }),
  ],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
      "@": fileURLToPath(new URL("./src/components/ui", import.meta.url)),
    },
  },
});
