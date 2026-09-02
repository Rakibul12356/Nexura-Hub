import React from "react";

interface VideoPlayerProps {
  url?: string;
  title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url = "https://www.youtube.com/embed/666K4aizIu8",
  title = "Course Lesson Video",
}) => {
  return (
    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black shadow-xl border">
      <iframe
        className="w-full h-full"
        src={url}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};

export default VideoPlayer;
