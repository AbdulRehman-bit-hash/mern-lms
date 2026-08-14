// Pulls a YouTube or Vimeo video ID out of the various URL formats people
// tend to paste in (watch?v=, youtu.be short links, embed links, links with
// timestamp params, etc.). Returns null if the URL doesn't match either.

export function getYouTubeId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export function getVimeoId(url: string): string | null {
  if (!url) return null;

  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
}

// Direct video file links (mp4, webm, ogg) can go straight into a native
// <video> element rather than needing an iframe embed.
export function isDirectVideoFile(url: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}
