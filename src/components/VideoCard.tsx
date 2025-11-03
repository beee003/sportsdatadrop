import { createSignal, Component } from "solid-js";

interface VideoCardProps {
  videoUrl: string;
  title: string;
  price: number;
  checkoutUrl: string;
  thumbnail?: string;
}

export const VideoCard: Component<VideoCardProps> = (props) => {
  const [hover, setHover] = createSignal(false);

  return (
    <div
      class="rounded-xl glass-card p-4 hover:bg-white/10 transition-all duration-300 relative cursor-pointer overflow-hidden group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div class="relative mb-3 rounded-lg overflow-hidden bg-black/20">
        {props.thumbnail ? (
          <img src={props.thumbnail} alt={props.title} class="w-full aspect-video object-cover" />
        ) : (
          <video 
            src={props.videoUrl} 
            class="w-full aspect-video object-cover" 
            muted 
            preload="metadata"
          />
        )}
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      <h3 class="text-lg font-semibold mb-1 text-text">{props.title}</h3>
      <p class="text-sm opacity-70 text-accent font-medium">${props.price}</p>
      
      {hover() && (
        <a
          href={props.checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="absolute inset-0 flex items-center justify-center text-accent bg-black/80 backdrop-blur-sm rounded-lg font-semibold text-lg neon-glow animate-in fade-in duration-200"
          onClick={(e) => {
            // Prevent event bubbling
            e.stopPropagation();
          }}
        >
          Buy Dataset
        </a>
      )}
    </div>
  );
};
