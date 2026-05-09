export default function PageBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url("https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2e995a79b_e81fda6df_logo-Copy2.png")`,
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}