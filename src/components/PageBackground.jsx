export default function PageBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url("https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2d9058ade_modern-office-space-with-empty-bookshelves-and-clean-decor-generated-by-ai-photo.jpg")`,
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}