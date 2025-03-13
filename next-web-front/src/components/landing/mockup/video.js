import React, { useState } from "react";

const Video = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoId = "GsPH_GagYSY";

  const PlayButton = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="101"
      height="101"
      viewBox="0 0 101 101"
      fill="none"
    >
      <circle
        cx="50"
        cy="50"
        r="50"
        transform="matrix(1 0 0 -1 0.5 100.5)"
        fill="#B3D4FC"
      />
      <path
        d="M74.5 53.9641C77.1667 52.4245 77.1667 48.5755 74.5 47.0359L41.5 27.9833C38.8333 26.4437 35.5 28.3682 35.5 31.4474L35.5 69.5526C35.5 72.6318 38.8333 74.5563 41.5 73.0167L74.5 53.9641Z"
        fill="white"
      />
    </svg>
  );

  return (
    <div
      className="absolute -top-[100px] -right-[400px] z-20"
      data-aos="fade-left"
    >
      <div
        style={{
          width: "445px",
          height: "287px",
          position: "relative",
          overflow: "hidden",
          borderRadius: "32px",
          maxWidth: "445px",
          maxHeight: "287px",
        }}
      >
        {!isPlaying ? (
          <div
            className="w-full h-full flex justify-center items-center cursor-pointer"
            style={{
              borderRadius: "32px",
              border: "0.3px solid #B3D4FC",
              background: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: "0.5",
            }}
            onClick={() => setIsPlaying(true)}
          >
            <div className="w-[100px] h-[100px] flex-shrink-0 flex items-center justify-center">
              <PlayButton />
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                borderRadius: "32px",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Video;
