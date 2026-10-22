
interface ArticleVideoProps {
  url: string;
  poster?: string | null;
}

export function ArticleVideo({ url, poster }: ArticleVideoProps) {
  // Función para transformar la URL normal en una URL incrustable (embed)
  const getEmbedUrl = (videoUrl: string) => {
    try {
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        // Extrae el ID del vídeo de YouTube
        const videoId = videoUrl.includes('youtu.be')
          ? videoUrl.split('youtu.be/')[1]?.split('?')[0]
          : videoUrl.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (videoUrl.includes('vimeo.com')) {
        // Extrae el ID del vídeo de Vimeo
        const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
        return `https://player.vimeo.com/video/${videoId}`;
      }
    } catch {
      return videoUrl;
    }
    return videoUrl;
  };

  const isMp4 = url.match(/\.(mp4|webm|ogg)$/i);
  const embedUrl = getEmbedUrl(url);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
      {isMp4 ? (
        <video
          src={url}
          controls
          poster={poster || undefined}
          className="absolute top-0 left-0 h-full w-full object-cover"
        />
      ) : (
        <iframe
          src={embedUrl}
          title="Video Player"
          className="absolute top-0 left-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      )}
    </div>
  );
}