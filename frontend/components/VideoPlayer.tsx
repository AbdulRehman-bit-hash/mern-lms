"use client";

import { getYouTubeId, getVimeoId, isDirectVideoFile } from "@/lib/videoEmbed";

interface VideoPlayerProps {
  url: string;
  title?: string;
}

export default function VideoPlayer({ url, title = "Course video" }: VideoPlayerProps) {
  if (!url) {
    return (
      <div className="aspect-video bg-surface-2 rounded-sm flex items-center justify-center">
        <p className="text-ink/40 text-sm">No video attached to this lesson.</p>
      </div>
    );
  }

  const youTubeId = getYouTubeId(url);
  if (youTubeId) {
    return (
      <div className="aspect-video rounded-sm overflow-hidden bg-black">
        <iframe
          key={youTubeId}
          src={`https://www.youtube-nocookie.com/embed/${youTubeId}`}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    return (
      <div className="aspect-video rounded-sm overflow-hidden bg-black">
        <iframe
          key={vimeoId}
          src={`https://player.vimeo.com/video/${vimeoId}`}
          title={title}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (isDirectVideoFile(url)) {
    return (
      <div className="aspect-video rounded-sm overflow-hidden bg-black">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video key={url} src={url} controls className="w-full h-full" />
      </div>
    );
  }

  // Unrecognized URL format — don't guess at an embed, just link out.
  return (
    <div className="aspect-video bg-surface-2 rounded-sm flex flex-col items-center justify-center gap-3 px-6 text-center">
      <p className="text-ink/50 text-sm">
        This video can't be embedded automatically.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ledger hover:underline text-sm"
      >
        Open video in a new tab &rarr;
      </a>
    </div>
  );
}
