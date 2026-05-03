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
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b6f662621_Convert-One-of-the-Pre-existing-Hallways-into-a-Library-Copy.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/be158ee5a_1000_F_755228805_cGY4gZzDtaVC2GKBWaMzOtOPwnbV4ZIc.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/95e69bfed_modern-office-space-with-empty-bookshelves-and-clean-decor-generated-by-ai-photo.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc1690189_pngtree-blurred-empty-library-interior-with-bookshelves-and-white-floor-image_17084947.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/795966a39_6e9914fb6d6d4a305dd2fbe4c30e098d.jpg",
  // Royal Portuguese Reading Room (Rio de Janeiro)
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/07a97444a_istockphoto-1238314211-612x612.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3eae50428_2b870fb1ca9d3e7d71c8fe87011dd168.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/59617e7f2_free-photo-of-royal-portuguese-reading-room-in-rio-de-janeiro.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/7d7fa075d_kvkunmfqs0x91.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2f2537c48_4d26575b4b01e6e9b9b3987a746f0f2c.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/91de453a5_9fe146a351ccd4bcd492f430436d858a.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/37943117a_5dc56a24808825ced53dd437d28360ff.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3deefd236_photo4jpg.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/c54901031_R.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/694a171fc_131bb054d4261b4f22ec2403f271f06a.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9fc60e8d8_OIP.jpeg",
  // Ornate Grand Libraries
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/64a83cd64_maxresdefault2.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/adee1b3e6_maxresdefault1.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/163c6d198_WDggFNBBCjgKpzuFC2Txph-1200-80.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b74537c5f_OPHS3.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/284c862da_OPHS2.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/01c249e45_OPHS1.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8beb313c9_OPHS.jpeg",
  // Fantasy / Mystical Libraries
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/d3cbc3046_the_spires_of_knowledge_by_anastasiasalmina_dk857qc-fullview.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/363fa0f33_5a9efa54-1732-426f-9f15-2281d076e774.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/54df54018_cb8394d1082eab3883218dedcc1a0051.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/cba057f04_R1.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a8d5cbb50_tumblr_0fcd320944a2b490d437db0971025fd5_8128c890_1280.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a02df8c81_tumblr_p1svz43CdD1w4u27lo5_1280.jpg",
  // Sacred / Temple Interiors
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0e90ebf0d_solomon-temple-inner.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4b8e4bd44_Gold-in-Solomons-Temple-1-1024x585.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b74c92a56_777f7d648de806a2714c768c9b438bea.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fcc19e773_29063b843e86cd58857bc3ce6b0c7c37.jpg",
  // Mosque Interiors
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8b79dd457_istockphoto-1470806526-1024x1024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/89706e8bf_istockphoto-2153270376-612x6121.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc96310a0_istockphoto-1415206430-1024x1024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/647ca63ef_istockphoto-636498350-612x612.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9935526d9_istockphoto-2218500353-1024x1024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a1581071e_istockphoto-181065518-1024x1024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/246ed5ae9_istockphoto-477907349-1024x1024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/88e710347_istockphoto-483630985-1024x1024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/ba6b716b1_istockphoto-1351999176-1024x1024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afe6a73f6_istockphoto-1219757617-1024x1024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f589d3dc5_istockphoto-1264148870-1024x1024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a4710199b_istockphoto-1297050281-1024x1024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/ea42383b8_istockphoto-1311350502-1024x1024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4835e4300_istockphoto-1304750440-1024x1024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/aafb2b88e_istockphoto-2181844410-1024x1024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/030815ef9_istockphoto-2181844477-1024x1024.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/e70da96a3_istockphoto-935955304-1024x1024.jpg",
  // Tomb / Mausoleum interiors
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/33a6dd671_the-extravagance-of-the-interior-of-the-family-tomb-of-habib-bourguiba-E7Y65E.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/06f8a566f_interior-of-the-tomb-of-the-reza-shah-of-iran-al-rifaii-mosque-royal-HR77EW.jpg",
  // Spiritual / Cosmic
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8d9f7b34b_ranjan-bera-img-20190727-wa0013.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2a5fa300d_09-16-20_12-02-48AM.png",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/857201925_26-05-2023_19-57-29.png",
  // Science / Brain
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f3fc38781_stock-photo-central-organ-of-human-nervous-system-brain-anatomy-d-1859779633.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/84dc95843_1000_F_971892795_RX3cpf8xMUbbE4vJ2MnOerElgOeodidS.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/48f4d2d97_istockphoto-1305107176-170667a.jpg",
  // Classic library shelves
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/df295be78_e0549c739b2dfa66cf1ab3c09421a0ba--literature-university.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/adc58abfa_bookshelves-library-with-old-books_1131516-3.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bb43ae4ec_wonkhe-summer-library-2740x1541.jpg",
  // Digital / Zero Point
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/024e96e90_1336-319x160.jpg",
  // Palace / Royal interiors
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3499820b2_0502efa7900a15bf241a618154610d25.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4c7ba952e_il_1588xN2075060493_83w4.jpg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/e559ee0a9_il_1588xN7348955749_jmfr.jpg",
  // El Ateneo / Lello Bookstore
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8f50446c0_th4.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8f83f2d5e_th3.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/d9aa15432_th2.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/6b01a61ac_th1.jpeg",
  "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/87113fef8_th.jpeg",
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