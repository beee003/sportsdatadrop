import UploadForm from "~/components/UploadForm";
import { ArrowLeft } from "lucide-solid";
import { A } from "@solidjs/router";

export default function Upload() {
  return (
    <div class="min-h-screen py-12 px-4">
      <div class="max-w-4xl mx-auto">
        <A 
          href="/" 
          class="inline-flex items-center gap-2 text-accent hover:text-green-300 mb-8 transition-colors"
        >
          <ArrowLeft class="w-5 h-5" />
          Back to Home
        </A>
        <UploadForm />
      </div>
    </div>
  );
}
