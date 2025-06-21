import { useEffect, useMemo, useState } from "react";
import AuthModal from "./Auth/AuthModal";

const HeroSection = () => {
  // List of video paths stored in /public/videos/
  const videos = [
    "/videos/bg1.mp4",
    "/videos/bg2.mp4",
    "/videos/bg3.mp4",
    "/videos/bg4.mp4",
    "/videos/bg5.mp4",
  ];

  // Pick one random video on each page load (memoized so it doesn't change on re-renders)
  const randomVideo = useMemo(() => {
    return videos[Math.floor(Math.random() * videos.length)];
  }, []);

  // Track if the video is fully loaded and ready to play
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [authMode, setAuthMode] = useState("signup"); // or 'login'
  const [isModalOpen, setIsModalOpen] = useState(false);


  // Preload the selected video and update state once it's ready
  useEffect(() => {
    const video = document.createElement("video");
    video.src = randomVideo;
    video.oncanplaythrough = () => {
      setVideoLoaded(true); // mark as ready once it can play through
    };
  }, [randomVideo]);

    const openModal = (mode) => {
    setAuthMode(mode);
    setIsModalOpen(true);
  };


  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background content: fallback image or video */}
      {!videoLoaded ? (
        // Show fallback image while video loads
        <img
          src="/videos/fallback.jpg"
          alt="Loading background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        // Show the background video once it’s loaded
        <video
          key={randomVideo}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          onCanPlayThrough={() => setVideoLoaded(true)} // redundant but safe
        >
          <source src={randomVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Overlay content: site title, subtitle, and buttons */}
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Plan Smarter with Travana
        </h1>
        <p className="text-lg md:text-xl max-w-xl mb-6">
          Your intelligent travel planner for personalized, AI-powered
          adventures.
        </p>

        {/* Action buttons */}
        <div className="flex gap-4">
           <button className="btn btn-primary" onClick={() => openModal("signup")}>Sign Up</button>
           <button className="btn btn-outline btn-accent" onClick={() => openModal("login")}>Login</button>
        </div>
      </div>

      {/* Optional: spinner shown while video is still loading */}
      {!videoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="loading loading-spinner loading-lg text-white"></span>
        </div>
      )}
      {isModalOpen && <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mode={authMode} />}
    </div>
  );
};

export default HeroSection;
