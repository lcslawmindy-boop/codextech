export default function PageBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 bg-no-repeat bg-center bg-fixed"
      style={{
        backgroundImage: `url("https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bce328987_a6e3bd669_logo.png")`,
        backgroundSize: "500px 500px",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}