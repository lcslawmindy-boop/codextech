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
        }}
      />
      {/* Dark overlay to keep text readable */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0, 0, 0, 0.72)" }}
      />
      {/* Subtle green tint overlay for classified aesthetic */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0, 20, 0, 0.25)" }}
      />
    </div>
  );
}