import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Sparkles, Activity, ShieldCheck, Maximize2, Compass } from 'lucide-react';

const VIDEO_FEEDS = [
  {
    id: 'forest',
    title: 'Feed 01 // Primeval Forest Stream',
    category: 'BIOSPHERE CANOPY',
    coords: '24°18\'N 93°44\'E • ASSAM',
    co2Offset: '-48.6 kg/day',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4',
    poster: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Continuous canopy telemetry measuring real-time transpiration and oxygen release index.'
  },
  {
    id: 'ocean',
    title: 'Feed 02 // Oceanic Tide Barrier',
    category: 'HYDROSPHERE REEF',
    coords: '08°12\'N 73°02\'E • LAKSHADWEEP',
    co2Offset: '-62.1 kg/day',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4',
    poster: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    caption: 'Coral restoration and plastic micro-fragment interceptor telemetry monitored at 60Hz.'
  },
  {
    id: 'plateau',
    title: 'Feed 03 // High-Altitude Sunlit Ridge',
    category: 'ATMOSPHERIC BOUNDARY',
    coords: '32°14\'N 77°11\'E • HIMACHAL',
    co2Offset: '-31.8 kg/day',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4',
    poster: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    caption: 'Solar radiation absorption and mountain watershed purity indexed for circular production.'
  }
];

export default function CinematicVideoShowcase() {
  const [activeFeedIndex, setActiveFeedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const currentFeed = VIDEO_FEEDS[activeFeedIndex];

  // Procedural canvas wave fallback / overlay
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let t = 0;

    const render = () => {
      t += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle futuristic oscilloscope wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(168, 199, 250, 0.4)';
      ctx.lineWidth = 1.5;

      const width = canvas.width;
      const height = canvas.height;
      const mid = height / 2;

      for (let x = 0; x < width; x += 4) {
        const y = mid + Math.sin(x * 0.04 + t) * 12 + Math.cos(x * 0.015 - t * 0.8) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A8C7FA]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Editorial Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-white/10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#A8C7FA] animate-ping" />
            <span className="text-[10px] font-space-mono uppercase tracking-[0.25em] text-[#A8C7FA]">
              CINEMATIC OBSERVATORY // SATELLITE & SENSOR FEEDS
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-newsreader italic font-light tracking-tight text-white">
            Live Earth Biosphere Telemetry
          </h2>
        </div>
        <p className="text-xs font-space-mono text-neutral-400 max-w-md leading-relaxed">
          High-definition environmental observation feeds verifying zero-carbon circular sourcing across active Indian biosphere reserves.
        </p>
      </div>

      {/* Main Video Viewfinder Container */}
      <div className="editorial-card rounded-md overflow-hidden p-2 sm:p-4 relative bg-[#050505]">
        {/* Viewfinder Corner Brackets */}
        <span className="bracket bracket-tl !border-white/60 !w-5 !h-5" />
        <span className="bracket bracket-tr !border-white/60 !w-5 !h-5" />
        <span className="bracket bracket-bl !border-white/60 !w-5 !h-5" />
        <span className="bracket bracket-br !border-white/60 !w-5 !h-5" />

        {/* Video Player Display Frame */}
        <div className="relative aspect-video sm:aspect-[21/9] w-full rounded-xs overflow-hidden bg-black border border-white/10 group">
          {/* Animated Scanline Overlay */}
          <div className="scanline-widget z-20" />

          {/* HTML5 Video Element */}
          <video
            ref={videoRef}
            key={currentFeed.id}
            src={currentFeed.src}
            poster={currentFeed.poster}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover filter contrast-[1.08] saturate-[1.1] transition-transform duration-700 group-hover:scale-[1.01]"
          />

          {/* Fallback Bioluminescent Graphic if Video Blocked */}
          {videoError && (
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-[#030303] to-sky-950 flex items-center justify-center">
              <img
                src={currentFeed.poster}
                alt={currentFeed.title}
                className="w-full h-full object-cover opacity-60 mix-blend-screen"
              />
            </div>
          )}

          {/* Top HUD Telemetry Overlay */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between text-[10px] font-space-mono text-white/90 z-20 pointer-events-none drop-shadow-md">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-black/75 backdrop-blur-md rounded-xs border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 font-bold">REC ● LIVE 60 FPS</span>
              <span className="text-white/40">|</span>
              <span className="text-white/80">{currentFeed.coords}</span>
            </div>

            <div className="hidden sm:flex items-center gap-3 px-2.5 py-1 bg-black/75 backdrop-blur-md rounded-xs border border-white/20">
              <span className="text-[#A8C7FA]">CO₂ SINK: {currentFeed.co2Offset}</span>
              <span className="text-white/40">|</span>
              <span className="text-[#E2D3B6]">TRANSPIRATION: OPTIMAL</span>
            </div>
          </div>

          {/* Radar Sweep HUD in Top Right Corner */}
          <div className="absolute bottom-4 right-4 z-20 flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-full border border-white/20 bg-black/60 backdrop-blur-sm p-0.5 overflow-hidden hidden sm:block">
              <div className="radar-sweep absolute inset-0 w-full h-full" />
              <div className="absolute inset-0 flex items-center justify-center font-space-mono text-[8px] text-[#A8C7FA]">
                RADAR
              </div>
            </div>

            {/* Audio & Playback Controls */}
            <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-white/20 p-1 rounded-xs">
              <button
                type="button"
                onClick={togglePlay}
                className="p-1.5 rounded-2xs hover:bg-white/20 text-white transition cursor-pointer"
                title={isPlaying ? 'Pause Feed' : 'Play Feed'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="p-1.5 rounded-2xs hover:bg-white/20 text-white transition cursor-pointer"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Bottom Oscilloscope Mini-Wave Overlay */}
          <div className="absolute bottom-4 left-4 z-20 hidden md:block">
            <div className="bg-black/75 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xs flex items-center gap-3">
              <div className="text-[9px] font-space-mono text-neutral-400 uppercase">
                Biosphere Waveform:
              </div>
              <canvas ref={canvasRef} width="160" height="24" className="w-40 h-6" />
            </div>
          </div>
        </div>

        {/* Channel Selection Deck - Editorial Wireframe Strip */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {VIDEO_FEEDS.map((feed, idx) => {
            const isSelected = idx === activeFeedIndex;

            return (
              <div
                key={feed.id}
                onClick={() => {
                  setActiveFeedIndex(idx);
                  setVideoError(false);
                  setIsPlaying(true);
                }}
                className={`relative p-3.5 rounded-xs border transition-all cursor-pointer font-space-mono ${
                  isSelected
                    ? 'bg-[#111] border-[#A8C7FA] shadow-[0_0_20px_rgba(168,199,250,0.15)]'
                    : 'bg-[#0a0a0a] border-white/10 hover:border-white/25 hover:bg-[#0f0f0f]'
                }`}
              >
                {isSelected && (
                  <>
                    <span className="bracket bracket-tl !border-[#A8C7FA] !w-2.5 !h-2.5" />
                    <span className="bracket bracket-br !border-[#A8C7FA] !w-2.5 !h-2.5" />
                  </>
                )}

                <div className="flex items-center justify-between text-[10px] mb-1.5">
                  <span className={isSelected ? 'text-[#A8C7FA] font-bold' : 'text-neutral-400'}>
                    0{idx + 1} // {feed.category}
                  </span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A8C7FA] animate-pulse" />
                  )}
                </div>

                <div className="text-xs text-white font-medium tracking-tight font-sans">
                  {feed.title.split('//')[1]}
                </div>

                <div className="text-[10px] text-neutral-500 mt-1 line-clamp-1">
                  {feed.coords}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
