import { useState, useEffect } from "react";

const LIBRARY_IMAGES = [
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/005cbd380_a-long-row-of-bookshelves-in-a-library-free-photo.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/aefb1105a_modern-office-space-with-empty-bookshelves-and-clean-decor-generated-by-ai-photo.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/904504196_pngtree-blurred-empty-library-interior-with-bookshelves-and-white-floor-image_17084947-Copy.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/94e727492_6e9914fb6d6d4a305dd2fbe4c30e098d.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/822e46d05_maxresdefault.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/163c6d198_WDggFNBBCjgKpzuFC2Txph-1200-80.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0e90ebf0d_solomon-temple-inner.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4b8e4bd44_Gold-in-Solomons-Temple-1-1024x585.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0aab30b73_How-to-Access-and-Read-the-Akashic-Records.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/84dc95843_1000_F_971892795_RX3cpf8xMUbbE4vJ2MnOerElgOeodidS.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/eba4e64a4_atom-big-crop-2048x1097.jpg",
];

export default function LibraryBackground() {
  const [currentIdx, setCurrentIdx] = useState(() => Math.floor(Math.random() * LIBRARY_IMAGES.length));
  const [nextIdx, setNextIdx] = useState(null);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (currentIdx + 1) % LIBRARY_IMAGES.length;
      setNextIdx(next);
      setFading(true);
      setTimeout(() => {
        setCurrentIdx(next);
        setNextIdx(null);
        setFading(false);
      }, 1500);
    }, 12000);
    return () => clearInterval(timer);
  }, [currentIdx]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* Current image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${LIBRARY_IMAGES[currentIdx]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "opacity 1.5s ease-in-out",
          opacity: fading ? 0 : 1,
        }}
      />

      {/* Next image (fades in) */}
      {nextIdx !== null && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${LIBRARY_IMAGES[nextIdx]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "opacity 1.5s ease-in-out",
            opacity: fading ? 1 : 0,
          }}
        />
      )}

      {/* Dark overlay to keep text readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.82) 100%)",
        }}
      />
    </div>
  );
}