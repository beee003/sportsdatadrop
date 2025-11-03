import { A } from "@solidjs/router";

export default function Navbar() {
  return (
    <nav class="flex justify-between items-center p-4 glass-nav sticky top-0 z-50">
      <A href="/" class="text-2xl font-bold neon-green hover:opacity-80 transition">
        SportsDataDrop
      </A>
      <div class="space-x-6 flex items-center">
        <A 
          href="/marketplace" 
          class="text-text hover:text-accent transition-colors duration-200"
        >
          Marketplace
        </A>
        <A 
          href="/upload" 
          class="text-text hover:text-accent transition-colors duration-200"
        >
          Upload
        </A>
      </div>
    </nav>
  );
}
