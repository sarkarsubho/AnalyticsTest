import React from "react";
import video from "../assets/demo.mp4";
import VideoPlayer from "../components/VideoPlayer.jsx";

const Video = () => {
  return (
    <div>
      <h1>Product Demo</h1>
      <VideoPlayer
        src={video}
        title="Demo Video"
        poster="/images/demo-thumbnail.jpg"
      />
    </div>
  );
};

export default Video;
