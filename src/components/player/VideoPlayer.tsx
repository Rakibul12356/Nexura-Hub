import React from "react";
import HlsPlayer from "./HlsPlayer";

interface VideoPlayerProps {
  url?: string;
  title?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  onTimeUpdate,
  onEnded,
}) => {
  return <HlsPlayer src={url} onTimeUpdate={onTimeUpdate} onEnded={onEnded} />;
};

export default VideoPlayer;
