import React from "react";
import HlsPlayer from "./HlsPlayer";

interface VideoPlayerProps {
  url?: string;
  title?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  onTimeUpdate,
  onEnded,
}) => {
  if (!url) {
    return (
      <div className="aspect-video w-full rounded-2xl border border-dashed bg-muted/30 flex items-center justify-center text-sm text-muted-foreground">
        No video attached to this lesson yet.
      </div>
    );
  }
  return <HlsPlayer src={url} onTimeUpdate={onTimeUpdate} onEnded={onEnded} />;
};

export default VideoPlayer;
