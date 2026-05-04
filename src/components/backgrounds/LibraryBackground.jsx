import { useState, useEffect } from "react";

const LIBRARY_IMAGES = [
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9ec1d60d0_Convert-One-of-the-Pre-existing-Hallways-into-a-Library.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/cc24aa9ee_1000_F_755228805_cGY4gZzDtaVC2GKBWaMzOtOPwnbV4ZIc.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/df295be78_e0549c739b2dfa66cf1ab3c09421a0ba--literature-university.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/adc58abfa_bookshelves-library-with-old-books_1131516-3.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bb43ae4ec_wonkhe-summer-library-2740x1541.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/7940d5a4d_wonkhe-summer-library-2740x1541-Copy.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/aefb1105a_modern-office-space-with-empty-bookshelves-and-clean-decor-generated-by-ai-photo.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f5bf13206_pngtree-blurred-empty-library-interior-with-bookshelves-and-white-floor-image_17084947.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/94e727492_6e9914fb6d6d4a305dd2fbe4c30e098d.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/77c322f4b_aa61576b6b55d0946fa8f12a5a85663c.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/437976860_a8838d6e6380e3cc2ddff672d7c0883b.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f1cd0b395_f3284b7e2cb15ec3924f493483bea9fd.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/1f8804016_free-photo-of-royal-portuguese-reading-room-in-rio-de-janeiro.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/965c6c09f_kvkunmfqs0x91.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4cf1cb9b9_photo4jpg.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/822e46d05_maxresdefault.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/163c6d198_WDggFNBBCjgKpzuFC2Txph-1200-80.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/d3cbc3046_the_spires_of_knowledge_by_anastasiasalmina_dk857qc-fullview.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/363fa0f33_5a9efa54-1732-426f-9f15-2281d076e774.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a8d5cbb50_tumblr_0fcd320944a2b490d437db0971025fd5_8128c890_1280.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0e90ebf0d_solomon-temple-inner.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4b8e4bd44_Gold-in-Solomons-Temple-1-1024x585.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3d3ecd562_777f7d648de806a2714c768c9b438bea.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/41261b0fb_29063b843e86cd58857bc3ce6b0c7c37.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/ea42383b8_istockphoto-1311350502-1024x1024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4835e4300_istockphoto-1304750440-1024x1024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2a5fa300d_09-16-20_12-02-48AM.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/dec2fe662_How-to-Access-and-Read-the-Akashic-Records.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/84dc95843_1000_F_971892795_RX3cpf8xMUbbE4vJ2MnOerElgOeodidS.jpg",
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