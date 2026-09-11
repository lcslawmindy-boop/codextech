import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";

const VIDEOS = [
  {
    url: "https://media.base44.com/videos/public/69ccefebfea78b23498c66a8/f01b19f10_collectivelyseekhealingZARPdatabase.MOV",
    title: "Collectively Seek Healing",
    desc: "ZARP Database — the mission to unite healing technology for humanity.",
    color: "#06b6d4",
  },
  {
    url: "https://media.base44.com/videos/public/69ccefebfea78b23498c66a8/aad318424_M3infinitynarratedcomic.mov",
    title: "M3 Infinity — Narrated Comic",
    desc: "A narrated journey through the M3 infinity framework and scalar concepts.",
    color: "#a855f7",
  },
  {
    url: "https://media.base44.com/videos/public/69ccefebfea78b23498c66a8/ad9be8256_M3infintiycomicvideo.mov",
    title: "M3 Infinity — Comic Video",
    desc: "Visual storytelling of the M3 infinity concept and its applications.",
    color: "#f97316",
  },
];

function VideoCard({ video, featured }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const ref = useRef(null);

  const togglePlay = () => {
    if (!ref.current) return;
    if (playing) { ref.current.pause(); } else { ref.current.play(); }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!ref.current) return;
    ref.current.muted = !muted;
    setMuted(!muted);
  };

  const fullscreen = () => {
    if (ref.current?.requestFullscreen) ref.current.requestFullscreen();
  };

  return (
    <div
      className={`relative group rounded-2xl overflow-hidden border bg-black ${featured ? "md:col-span-2 md:row-span-2" : ""}`}
      style={{ borderColor: video.color + "40" }}
    >
      <video
        ref={ref}
        src={video.url}
        muted={muted}
        loop
        playsInline
        preload="metadata"
        onClick={togglePlay}
        className={`w-full ${featured ? "h-full min-h-[300px] md:min-h-[400px]" : "h-48"} object-cover cursor-pointer`}
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

      {/* Controls bar */}
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          <button onClick={togglePlay} className="w-8 h-8 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white hover:bg-black/80 transition-colors">
            {playing ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <button onClick={toggleMute} className="w-8 h-8 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white hover:bg-black/80 transition-colors">
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
        <button onClick={fullscreen} className="w-8 h-8 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white hover:bg-black/80 transition-colors">
          <Maximize2 size={14} />
        </button>
      </div>

      {/* Title overlay */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: video.color }} />
          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: video.color }}>Video</span>
        </div>
        <h3 className={`text-white font-black ${featured ? "text-lg" : "text-sm"} leading-tight`}>{video.title}</h3>
      </div>
      <p className="absolute bottom-3 left-3 right-3 text-slate-300 text-[11px] leading-snug opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {video.desc}
      </p>
    </div>
  );
}

import { useRef } from "react";

export default function VideoShowcase() {
  return (
    <section className="px-6 py-20 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Watch & Learn</p>
        <h2 className="text-3xl font-black text-white mb-3">The Mission in Motion</h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Explore the vision behind the ZARP Database, the M3 Infinity framework, and the healing technology revolution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
        <VideoCard video={VIDEOS[0]} featured />
        <VideoCard video={VIDEOS[1]} />
        <VideoCard video={VIDEOS[2]} />
      </div>
    </section>
  );
}