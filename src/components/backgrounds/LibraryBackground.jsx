import { useState, useEffect } from "react";

const LIBRARY_IMAGES = [
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9ec1d60d0_Convert-One-of-the-Pre-existing-Hallways-into-a-Library.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/cc24aa9ee_1000_F_755228805_cGY4gZzDtaVC2GKBWaMzOtOPwnbV4ZIc.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/aefb1105a_modern-office-space-with-empty-bookshelves-and-clean-decor-generated-by-ai-photo.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f5bf13206_pngtree-blurred-empty-library-interior-with-bookshelves-and-white-floor-image_17084947.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/94e727492_6e9914fb6d6d4a305dd2fbe4c30e098d.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/77c322f4b_aa61576b6b55d0946fa8f12a5a85663c.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/437976860_a8838d6e6380e3cc2ddff672d7c0883b.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f1cd0b395_f3284b7e2cb15ec3924f493483bea9fd.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/960a03bab_istockphoto-1238314211-612x612.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/7e3cb4fd5_2b870fb1ca9d3e7d71c8fe87011dd168.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/1f8804016_free-photo-of-royal-portuguese-reading-room-in-rio-de-janeiro.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/965c6c09f_kvkunmfqs0x91.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/62100d52e_4d26575b4b01e6e9b9b3987a746f0f2c.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/1d0370740_9fe146a351ccd4bcd492f430436d858a.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/d795ac6bc_5dc56a24808825ced53dd437d28360ff.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/1a803a4c3_photo4jpg.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/87c398b44_R.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/5030186cd_131bb054d4261b4f22ec2403f271f06a.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4ee09cb39_OIP.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/dec2fe662_How-to-Access-and-Read-the-Akashic-Records.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/38badbc27_a-long-row-of-bookshelves-in-a-library-free-photo.jpg",
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
          background: "linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.78) 100%)",
        }}
      />
    </div>
  );
}