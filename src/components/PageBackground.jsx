import { useState, useEffect } from "react";

const BACKGROUND_IMAGES = [
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/835f0d9af_6e9914fb6d6d4a305dd2fbe4c30e098d.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0adeb0359_1000_F_755228805_cGY4gZzDtaVC2GKBWaMzOtOPwnbV4ZIc.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3d6a56557_a8838d6e6380e3cc2ddff672d7c0883b-Copy-Copy.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/5cd4ccdac_a-long-row-of-bookshelves-in-a-library-free-photo.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2d9058ade_modern-office-space-with-empty-bookshelves-and-clean-decor-generated-by-ai-photo.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/026133330_pngtree-blurred-empty-library-interior-with-bookshelves-and-white-floor-image_17084947-Copy.jpg",
];

export default function PageBackground() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 8000); // Change every 8 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed inset-0 -z-10 bg-cover bg-center bg-fixed transition-all duration-1000"
      style={{
        backgroundImage: `url("${BACKGROUND_IMAGES[currentImageIndex]}")`,
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}