import { A } from "@solidjs/router";
import { Play } from "lucide-solid";

export default function Home() {
  return (
    <div class="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div class="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 class="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-accent to-green-300 bg-clip-text text-transparent">
          Monetize Your Sports Videos
        </h1>
        <p class="text-xl md:text-2xl mb-8 opacity-80 max-w-2xl mx-auto">
          Upload your training or match footage. AI companies pay for your data.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <A 
            href="/upload" 
            class="bg-accent text-black px-8 py-4 rounded-lg font-semibold hover:bg-green-300 transition-all duration-200 neon-glow flex items-center gap-2 text-lg"
          >
            <Play class="w-5 h-5" />
            Start Uploading
          </A>
          <A 
            href="/marketplace" 
            class="border border-accent text-accent px-8 py-4 rounded-lg font-semibold hover:bg-accent/10 transition-all duration-200"
          >
            Browse Marketplace
          </A>
        </div>
        
        <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div class="glass-card p-6">
            <div class="text-3xl mb-3">📹</div>
            <h3 class="text-lg font-semibold mb-2">Upload Videos</h3>
            <p class="text-sm opacity-70">Share your sports footage with the AI community</p>
          </div>
          <div class="glass-card p-6">
            <div class="text-3xl mb-3">💰</div>
            <h3 class="text-lg font-semibold mb-2">Get Paid</h3>
            <p class="text-sm opacity-70">Set your price and earn from every sale</p>
          </div>
          <div class="glass-card p-6">
            <div class="text-3xl mb-3">🚀</div>
            <h3 class="text-lg font-semibold mb-2">Help AI Grow</h3>
            <p class="text-sm opacity-70">Your data powers the next generation of AI models</p>
          </div>
        </div>
      </div>
    </div>
  );
}
