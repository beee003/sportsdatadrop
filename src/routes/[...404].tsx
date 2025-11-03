import { A } from "@solidjs/router";

export default function NotFound() {
  return (
    <div class="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div class="max-w-2xl mx-auto space-y-8">
        <h1 class="text-6xl md:text-7xl font-bold mb-4">
          <span class="neon-green">404</span>
        </h1>
        <p class="text-xl opacity-80 mb-8">
          Page not found
        </p>
        <A 
          href="/" 
          class="bg-accent text-black px-8 py-4 rounded-lg font-semibold hover:bg-green-300 transition-all duration-200"
        >
          Go Home
        </A>
      </div>
    </div>
  );
}
