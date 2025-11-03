import { createResource, For } from "solid-js";
import { supabase } from "~/lib/supabase";
import { VideoCard } from "~/components/VideoCard";
import { getCheckoutUrl } from "~/lib/stripe";
import { ArrowLeft, Loader2 } from "lucide-solid";
import { A } from "@solidjs/router";

interface Video {
  id: string;
  title: string;
  price: number;
  file_url: string;
  public_url?: string;
  created_at: string;
}

async function fetchVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching videos:", error);
    return [];
  }

  return (data || []).map((video) => ({
    ...video,
    public_url: video.public_url || supabase.storage.from("videos").getPublicUrl(video.file_url).data.publicUrl,
  }));
}

export default function Marketplace() {
  const [videos] = createResource(fetchVideos);

  return (
    <div class="min-h-screen py-12 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <A 
            href="/" 
            class="inline-flex items-center gap-2 text-accent hover:text-green-300 transition-colors"
          >
            <ArrowLeft class="w-5 h-5" />
            Back to Home
          </A>
        </div>

        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-center">
          <span class="neon-green">Marketplace</span>
        </h1>
        <p class="text-center opacity-70 mb-12 text-lg">
          Browse and purchase sports video datasets
        </p>

        {videos.loading && (
          <div class="flex justify-center items-center py-20">
            <Loader2 class="w-8 h-8 text-accent animate-spin" />
          </div>
        )}

        {videos.error && (
          <div class="text-center py-20">
            <p class="text-red-400 mb-4">Error loading videos</p>
            <p class="text-sm opacity-70">{videos.error.message}</p>
          </div>
        )}

        {videos() && videos()!.length === 0 && (
          <div class="text-center py-20">
            <p class="text-xl opacity-70 mb-4">No videos available yet</p>
            <A 
              href="/upload" 
              class="text-accent hover:text-green-300 transition-colors"
            >
              Be the first to upload!
            </A>
          </div>
        )}

        {videos() && videos()!.length > 0 && (
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <For each={videos()}>
              {(video) => (
                <VideoCard
                  videoUrl={video.public_url || ""}
                  title={video.title}
                  price={video.price}
                  checkoutUrl={getCheckoutUrl(video.id, video.price)}
                />
              )}
            </For>
          </div>
        )}
      </div>
    </div>
  );
}
