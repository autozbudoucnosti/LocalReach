"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryTemplate } from "@/lib/template-gallery";

type TemplatePreviewProps = {
  template: GalleryTemplate;
  sizes?: string;
};

export function TemplatePreview({
  template,
  sizes = "(max-width: 1024px) 100vw, (max-width: 1536px) 50vw, 33vw",
}: TemplatePreviewProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (template.previewImagePath && !imageFailed) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
        <Image
          src={template.previewImagePath}
          alt={`Mockup sablony ${template.title}`}
          fill
          sizes={sizes}
          className="object-cover"
          onError={() => setImageFailed(true)}
        />
      </div>
    );
  }

  return (
    <div className="rounded-[1.4rem] border border-white/70 bg-[linear-gradient(145deg,_#e7f1fb,_#f7efe2)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <div className="rounded-[1.1rem] border border-slate-200/70 bg-white/85 p-3 backdrop-blur">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
        </div>
        <div className="mt-4 space-y-3">
          <div className="space-y-2">
            <div className="h-4 w-2/3 rounded-full bg-slate-900/10" />
            <div className="h-3 w-1/2 rounded-full bg-slate-900/6" />
          </div>
          <div className="grid gap-2 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-2">
              <div className="h-20 rounded-2xl bg-white/90 shadow-sm" />
              <div className="h-10 rounded-2xl bg-white/90 shadow-sm" />
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-2xl bg-white/90 shadow-sm" />
              <div className="h-16 rounded-2xl bg-white/90 shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
