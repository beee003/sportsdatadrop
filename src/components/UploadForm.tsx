import { createSignal } from "solid-js";
import { supabase } from "~/lib/supabase";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Upload } from "lucide-solid";

export default function UploadForm() {
  const [file, setFile] = createSignal<File | null>(null);
  const [title, setTitle] = createSignal("");
  const [price, setPrice] = createSignal("20");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal(false);

  async function handleUpload() {
    setLoading(true);
    setError("");
    setSuccess(false);

    const f = file();
    if (!f) {
      setError("Please select a file");
      setLoading(false);
      return;
    }

    if (!title().trim()) {
      setError("Please enter a title");
      setLoading(false);
      return;
    }

    try {
      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${f.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("videos")
        .upload(fileName, f, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setError(uploadError.message);
        setLoading(false);
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("videos")
        .getPublicUrl(uploadData.path);

      // Insert metadata into database
      const { error: dbError } = await supabase.from("videos").insert({
        title: title(),
        price: parseFloat(price()),
        file_url: uploadData.path,
        public_url: urlData.publicUrl,
        created_at: new Date().toISOString(),
      });

      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFile(null);
      setTitle("");
      setPrice("20");
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div class="glass-card p-8 shadow-xl max-w-lg mx-auto text-text">
      <h2 class="text-2xl font-semibold mb-6 text-center">Upload your sports clip</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2 opacity-80">Title</label>
          <Input 
            placeholder="Enter video title" 
            value={title()}
            onInput={(e) => setTitle(e.currentTarget.value)} 
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2 opacity-80">Price ($)</label>
          <Input 
            type="number" 
            placeholder="20.00" 
            value={price()}
            onInput={(e) => setPrice(e.currentTarget.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label class="block text-sm font-medium mb-2 opacity-80">Video File</label>
          <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload class="w-8 h-8 mb-2 text-accent" />
              <p class="text-sm text-gray-400">
                {file() ? file()!.name : "Click to upload or drag and drop"}
              </p>
            </div>
            <input 
              type="file" 
              accept="video/*" 
              class="hidden"
              onChange={(e) => setFile(e.currentTarget.files?.[0] || null)} 
            />
          </label>
        </div>

        {error() && (
          <div class="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
            {error()}
          </div>
        )}

        {success() && (
          <div class="bg-accent/20 border border-accent/50 text-accent px-4 py-3 rounded-lg text-sm">
            Upload successful! Your video is now available in the marketplace.
          </div>
        )}

        <Button 
          disabled={loading()} 
          onClick={handleUpload}
          class="w-full flex items-center justify-center gap-2"
        >
          {loading() ? (
            <>
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <Upload class="w-5 h-5" />
              Upload
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
