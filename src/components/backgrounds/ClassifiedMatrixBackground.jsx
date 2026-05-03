export default function ClassifiedMatrixBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* Library background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3f88a5697_a-long-row-of-bookshelves-in-a-library-free-photo.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "contrast(1.3) saturate(1.2) brightness(0.85)",
        }}
      />
      {/* Deep vignette — very dark edges, lighter center for 3D depth */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.92) 100%)",
        }}
      />
      {/* Bottom dark fade */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      {/* Subtle warm amber depth glow from center */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 40% 35% at 50% 48%, rgba(180,120,40,0.08) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}