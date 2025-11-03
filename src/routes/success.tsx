import { A } from "@solidjs/router";
import { CheckCircle2 } from "lucide-solid";

export default function Success() {
  return (
    <div class="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div class="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div class="flex justify-center">
          <div class="rounded-full bg-accent/20 p-6 neon-glow">
            <CheckCircle2 class="w-16 h-16 text-accent" />
          </div>
        </div>
        
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          <span class="neon-green">Payment Successful!</span>
        </h1>
        
        <p class="text-xl opacity-80 mb-8">
          Thank you for your purchase. Your download link will be sent to your email shortly.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <A 
            href="/marketplace" 
            class="bg-accent text-black px-8 py-4 rounded-lg font-semibold hover:bg-green-300 transition-all duration-200 neon-glow"
          >
            Browse More
          </A>
          <A 
            href="/" 
            class="border border-accent text-accent px-8 py-4 rounded-lg font-semibold hover:bg-accent/10 transition-all duration-200"
          >
            Go Home
          </A>
        </div>
      </div>
    </div>
  );
}
