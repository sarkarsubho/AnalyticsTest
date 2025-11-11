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
        video_url: src,
        video_duration: Math.round(video.duration),
        video_percent: calculateVideoPercent(currentTime),
        video_current_time: Math.round(currentTime),
        video_player: "HTML5",
      });
    };

    dataLayer.push({
      event: "video_event",
      video_action: "start", // start | progress | complete (if  100% watched ) | pause | resume | watched (if 90%+ watched)
      video_title: `${videoTitle}`,
      video_url: `${src}`,
      video_duration: Math.round(video.duration),
      video_percent: calculateVideoPercent(currentTime),
      video_current_time: Math.round(currentTime),
      video_player: "HTML5",
    });

    // Calculate video percent for progress events
    const calculateVideoPercent = (currentTime) => {
      const percent = (currentTime / video.duration) * 100;
      if (percent >= 100) return 100;
      if (percent >= 75) return 75;
      if (percent >= 50) return 50;
      if (percent >= 25) return 25;
      return 0;
    };

    // 1️⃣ Start Event
    const handlePlay = () => {
      if (!video.hasStarted) {
        video.hasStarted = true;
        pushEvent("start", video.currentTime);
      }
    };

    // 2️⃣ Progress Checkpoints
    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      if (progress >= 90 && !video.tracked90) {
        video.tracked90 = true;
        pushEvent("watched", video.currentTime);
      } else if (progress >= 75 && !video.tracked75) {
        video.tracked75 = true;
        pushEvent("progress", video.currentTime);
      } else if (progress >= 50 && !video.tracked50) {
        video.tracked50 = true;
        pushEvent("progress", video.currentTime);
      } else if (progress >= 25 && !video.tracked25) {
        video.tracked25 = true;
        pushEvent("progress", video.currentTime);
      }
    };

    // 3️⃣ Pause Event
    const handlePause = () => {
      if (!video.ended) {
        pushEvent("pause", video.currentTime);
      }
    };

    // 4️⃣ Resume Event
    const handleResume = () => {
      if (!video.hasStarted) return; // Don't trigger resume on first play
      pushEvent("resume", video.currentTime);
    };

    // 5️⃣ Complete Event
    const handleEnded = () => {
      video.tracked100 = true;
      pushEvent("complete", video.duration);
    };

    // Add listeners
    video.addEventListener("play", handlePlay);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("pause", handlePause);
    video.addEventListener("play", handleResume);
    video.addEventListener("ended", handleEnded);

    // Cleanup listeners
    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("play", handleResume);
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
