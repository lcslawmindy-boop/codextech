import { useEffect, useRef } from "react";

const LOGO_URLS = [
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/1fa64f29d_5e416fe39_logo.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/50ee36bac_550172ad7_logo.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/eda4112bd_c36c756e3_logo.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/5d556946e_c5bb763a8_logo.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b0d819a9e_839284090_logo.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2de9ca1be_13427a463_logo-Copy.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/14d4c994b_7e20287f0_logo-Copy.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/99df85146_c5bb763a8_logo-Copy.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/7c953cb0d_839284090_logo-Copy.png",
];

export default function FloatingLogos() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Load images
    const images = LOGO_URLS.map((url, i) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      return img;
    });

    // Orbital parameters for each logo
    const orbits = LOGO_URLS.map((_, i) => ({
      angle: (Math.PI * 2 / LOGO_URLS.length) * i,
      radius: 120 + i * 35,
      speed: 0.3 + (i % 3) * 0.15,
      size: 60 + (i % 4) * 15,
      layer: i % 2, // alternate front/back
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw back layer logos
      for (let i = 0; i < LOGO_URLS.length; i++) {
        if (orbits[i].layer !== 0) continue;
        const orb = orbits[i];
        const angle = orb.angle + t * orb.speed;
        const x = cx + Math.cos(angle) * orb.radius;
        const y = cy + Math.sin(angle) * orb.radius;

        if (images[i]?.complete && images[i].naturalWidth > 0) {
          ctx.save();
          ctx.globalAlpha = 0.12 + 0.08 * Math.sin(t * 0.8 + i);
          ctx.drawImage(images[i], x - orb.size / 2, y - orb.size / 2, orb.size, orb.size);
          ctx.restore();
        }
      }

      // Draw front layer logos
      for (let i = 0; i < LOGO_URLS.length; i++) {
        if (orbits[i].layer !== 1) continue;
        const orb = orbits[i];
        const angle = orb.angle + t * orb.speed;
        const x = cx + Math.cos(angle) * orb.radius;
        const y = cy + Math.sin(angle) * orb.radius;

        if (images[i]?.complete && images[i].naturalWidth > 0) {
          ctx.save();
          ctx.globalAlpha = 0.15 + 0.12 * Math.sin(t * 0.8 + i);
          ctx.shadowColor = "rgba(0,220,255,0.8)";
          ctx.shadowBlur = 12;
          ctx.drawImage(images[i], x - orb.size / 2, y - orb.size / 2, orb.size, orb.size);
          ctx.restore();
        }
      }

      t += 0.005;
      requestAnimationFrame(draw);
    };

    draw();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}