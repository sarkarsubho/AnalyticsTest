import React, { useEffect, useRef } from "react";

const VideoPlayer = ({ src, title, poster }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const videoTitle = title || src || "Unnamed Video";

    // Helper: push event to dataLayer
    const pushEvent = (action, currentTime) => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "video_event",
        video_action: action,
        video_title: videoTitle,
        video_current_time: Math.round(currentTime),
      });
    };

    // 1️⃣ Start Event
    const handlePlay = () => {
      if (!video.hasStarted) {
        video.hasStarted = true;
        pushEvent("start", video.currentTime);
      }
    };

    // 2️⃣ Progress Checkpoints
    const checkpoints = [0.25, 0.5, 0.75, 0.9];
    const handleTimeUpdate = () => {
      const progress = video.currentTime / video.duration;
      checkpoints.forEach((p) => {
        if (progress >= p && !video[`tracked_${p}`]) {
          video[`tracked_${p}`] = true;
          const action = p === 0.9 ? "watched" : `${p * 100}%`;
          pushEvent(action, video.currentTime);
        }
      });
    };

    // 3️⃣ Complete
    const handleEnded = () => {
      pushEvent("complete", video.duration);
    };

    // Add listeners
    video.addEventListener("play", handlePlay);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    // Cleanup listeners
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [src, title]);

  return (
    <div
      className="video-container"
      style={{ maxWidth: "800px", margin: "auto" }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls
        preload="metadata"
        style={{ width: "100%", borderRadius: "12px", outline: "none" }}
      />
      <p style={{ textAlign: "center", marginTop: "8px" }}>{title}</p>
    </div>
  );
};

export default VideoPlayer;
