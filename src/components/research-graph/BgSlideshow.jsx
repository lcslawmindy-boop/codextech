import { useEffect, useRef, useState } from "react";
import { GRAPH_BG_IMAGES } from "@/lib/graphScene3D";

// Displays images at full size (object-fit: cover, no distortion) rotating every 5s.
export default function BgSlideshow({ opacity = 0.7, images }) {
  const imgList = images && images.length > 0 ? images : GRAPH_BG_IMAGES;
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState(1);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  // Reset indices when image list changes
  useEffect(() => {
    setCurrent(0);
    setNext(1 % imgList.length);
    setFading(false);
  }, [images]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(c => (c + 1) % imgList.length);
        setNext(c => (c + 2) % imgList.length);
        setFading(false);
      }, 1000); // 1s cross-fade
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const imgStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    pointerEvents: "none",
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      {/* Current image */}
      <img
        key={current}
        src={imgList[current]}
        alt=""
        style={{
          ...imgStyle,
          opacity: fading ? 0 : opacity,
          transition: "opacity 1s ease-in-out",
        }}
        draggable={false}
      />
      {/* Next image (fades in) */}
      <img
        key={`n-${next}`}
        src={imgList[next]}
        alt=""
        style={{
          ...imgStyle,
          opacity: fading ? opacity : 0,
          transition: "opacity 1s ease-in-out",
        }}
        draggable={false}
      />
    </div>
  );
}