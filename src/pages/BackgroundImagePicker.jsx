import { useState } from "react";
import { Check, X, Eye, EyeOff, Copy } from "lucide-react";

const ALL_IMAGES = [
  // Classic Library Hallway
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9ec1d60d0_Convert-One-of-the-Pre-existing-Hallways-into-a-Library.jpg", label: "Library Hallway 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b6f662621_Convert-One-of-the-Pre-existing-Hallways-into-a-Library-Copy.jpg", label: "Library Hallway 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/cc24aa9ee_1000_F_755228805_cGY4gZzDtaVC2GKBWaMzOtOPwnbV4ZIc.jpg", label: "Classic Bookshelves 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/be158ee5a_1000_F_755228805_cGY4gZzDtaVC2GKBWaMzOtOPwnbV4ZIc.jpg", label: "Classic Bookshelves 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/7c9dcd558_1000_F_755228805_cGY4gZzDtaVC2GKBWaMzOtOPwnbV4ZIc-Copy.jpg", label: "Classic Bookshelves 3" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/df295be78_e0549c739b2dfa66cf1ab3c09421a0ba--literature-university.jpg", label: "University Literature Shelves 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/863f19ac0_e0549c739b2dfa66cf1ab3c09421a0ba--literature-university.jpg", label: "University Literature Shelves 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/adc58abfa_bookshelves-library-with-old-books_1131516-3.jpg", label: "Old Books Shelves 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/09578f880_bookshelves-library-with-old-books_1131516-3.jpg", label: "Old Books Shelves 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/bb43ae4ec_wonkhe-summer-library-2740x1541.jpg", label: "Summer Library 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/7940d5a4d_wonkhe-summer-library-2740x1541-Copy.jpg", label: "Summer Library 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/38badbc27_a-long-row-of-bookshelves-in-a-library-free-photo.jpg", label: "Long Row Bookshelves 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/005cbd380_a-long-row-of-bookshelves-in-a-library-free-photo.jpg", label: "Long Row Bookshelves 2" },
  // Modern / White Libraries
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/aefb1105a_modern-office-space-with-empty-bookshelves-and-clean-decor-generated-by-ai-photo.jpg", label: "Modern White Library 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/95e69bfed_modern-office-space-with-empty-bookshelves-and-clean-decor-generated-by-ai-photo.jpg", label: "Modern White Library 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/628f7b614_modern-office-space-with-empty-bookshelves-and-clean-decor-generated-by-ai-photo.jpg", label: "Modern White Library 3" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f5bf13206_pngtree-blurred-empty-library-interior-with-bookshelves-and-white-floor-image_17084947.jpg", label: "Blurred Library 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc1690189_pngtree-blurred-empty-library-interior-with-bookshelves-and-white-floor-image_17084947.jpg", label: "Blurred Library 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/904504196_pngtree-blurred-empty-library-interior-with-bookshelves-and-white-floor-image_17084947-Copy.jpg", label: "Blurred Library 3" },
  // Warm / Cozy Libraries
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/94e727492_6e9914fb6d6d4a305dd2fbe4c30e098d.jpg", label: "Warm Library 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/795966a39_6e9914fb6d6d4a305dd2fbe4c30e098d.jpg", label: "Warm Library 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/5477a5d96_6e9914fb6d6d4a305dd2fbe4c30e098d-Copy.jpg", label: "Warm Library 3" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/77c322f4b_aa61576b6b55d0946fa8f12a5a85663c.jpg", label: "Cozy Library 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/6d1ae6c45_aa61576b6b55d0946fa8f12a5a85663c-Copy.jpg", label: "Cozy Library 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/437976860_a8838d6e6380e3cc2ddff672d7c0883b.jpg", label: "Dark Library 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/ba2d8211f_a8838d6e6380e3cc2ddff672d7c0883b-Copy-Copy.jpg", label: "Dark Library 2" },
  // Royal Portuguese Reading Room
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f1cd0b395_f3284b7e2cb15ec3924f493483bea9fd.jpg", label: "Royal Portuguese Room 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/6db18eeec_f3284b7e2cb15ec3924f493483bea9fd.jpg", label: "Royal Portuguese Room 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/960a03bab_istockphoto-1238314211-612x612.jpg", label: "Grand Reading Room 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/07a97444a_istockphoto-1238314211-612x612.jpg", label: "Grand Reading Room 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/378d344f5_istockphoto-1238314211-612x612.jpg", label: "Grand Reading Room 3" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/7e3cb4fd5_2b870fb1ca9d3e7d71c8fe87011dd168.jpg", label: "Ornate Library 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3eae50428_2b870fb1ca9d3e7d71c8fe87011dd168.jpg", label: "Ornate Library 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4a0f4bacf_2b870fb1ca9d3e7d71c8fe87011dd168.jpg", label: "Ornate Library 3" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/1f8804016_free-photo-of-royal-portuguese-reading-room-in-rio-de-janeiro.jpg", label: "Rio Reading Room 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/59617e7f2_free-photo-of-royal-portuguese-reading-room-in-rio-de-janeiro.jpg", label: "Rio Reading Room 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/20d248442_free-photo-of-royal-portuguese-reading-room-in-rio-de-janeiro.jpg", label: "Rio Reading Room 3" },
  // Grand Ornate Libraries
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/965c6c09f_kvkunmfqs0x91.jpg", label: "Grand Library Atrium 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/7d7fa075d_kvkunmfqs0x91.jpg", label: "Grand Library Atrium 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/62100d52e_4d26575b4b01e6e9b9b3987a746f0f2c.jpg", label: "Spiral Library 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2f2537c48_4d26575b4b01e6e9b9b3987a746f0f2c.jpg", label: "Spiral Library 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/1d0370740_9fe146a351ccd4bcd492f430436d858a.jpg", label: "Multi-Tier Library 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/91de453a5_9fe146a351ccd4bcd492f430436d858a.jpg", label: "Multi-Tier Library 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2fd1a0ee9_9fe146a351ccd4bcd492f430436d858a.jpg", label: "Multi-Tier Library 3" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/d795ac6bc_5dc56a24808825ced53dd437d28360ff.jpg", label: "Historic Library 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/37943117a_5dc56a24808825ced53dd437d28360ff.jpg", label: "Historic Library 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b35343ab5_5dc56a24808825ced53dd437d28360ff.jpg", label: "Historic Library 3" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/1a803a4c3_photo4jpg.jpg", label: "Gothic Library 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3deefd236_photo4jpg.jpg", label: "Gothic Library 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4cf1cb9b9_photo4jpg.jpg", label: "Gothic Library 3" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/87c398b44_R.jpeg", label: "Warm Wood Library 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/c54901031_R.jpeg", label: "Warm Wood Library 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9d789bebc_R.jpeg", label: "Warm Wood Library 3" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/5030186cd_131bb054d4261b4f22ec2403f271f06a.jpg", label: "Arched Library 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/694a171fc_131bb054d4261b4f22ec2403f271f06a.jpg", label: "Arched Library 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/c5b0c4cb3_131bb054d4261b4f22ec2403f271f06a.jpg", label: "Arched Library 3" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4ee09cb39_OIP.jpeg", label: "Grand Hall Library 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9fc60e8d8_OIP.jpeg", label: "Grand Hall Library 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/407431505_OIP.jpeg", label: "Grand Hall Library 3" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/64a83cd64_maxresdefault2.jpg", label: "Maxresdefault 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/adee1b3e6_maxresdefault1.jpg", label: "Maxresdefault 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/822e46d05_maxresdefault.jpg", label: "Maxresdefault 3" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/163c6d198_WDggFNBBCjgKpzuFC2Txph-1200-80.jpg", label: "Cathedral Library" },
  // El Ateneo / Lello / Ornate Theater Libraries
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b74537c5f_OPHS3.jpeg", label: "Theater Library OPHS3" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/284c862da_OPHS2.jpeg", label: "Theater Library OPHS2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/01c249e45_OPHS1.jpeg", label: "Theater Library OPHS1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8beb313c9_OPHS.jpeg", label: "Theater Library OPHS" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8f50446c0_th4.jpeg", label: "El Ateneo / Lello 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8f83f2d5e_th3.jpeg", label: "El Ateneo / Lello 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/d9aa15432_th2.jpeg", label: "El Ateneo / Lello 3" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/6b01a61ac_th1.jpeg", label: "El Ateneo / Lello 4" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/87113fef8_th.jpeg", label: "El Ateneo / Lello 5" },
  // Fantasy / Mystical Libraries
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/d3cbc3046_the_spires_of_knowledge_by_anastasiasalmina_dk857qc-fullview.jpg", label: "Spires of Knowledge" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/363fa0f33_5a9efa54-1732-426f-9f15-2281d076e774.jpg", label: "Fantasy Library Tower" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/54df54018_cb8394d1082eab3883218dedcc1a0051.jpg", label: "Mystical Library 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/cba057f04_R1.jpg", label: "Mystical Library 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a8d5cbb50_tumblr_0fcd320944a2b490d437db0971025fd5_8128c890_1280.jpg", label: "Tumblr Fantasy Library 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a02df8c81_tumblr_p1svz43CdD1w4u27lo5_1280.jpg", label: "Tumblr Fantasy Library 2" },
  // Solomon's Temple / Gold Interiors
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0e90ebf0d_solomon-temple-inner.jpg", label: "Solomon's Temple Inner" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4b8e4bd44_Gold-in-Solomons-Temple-1-1024x585.jpg", label: "Solomon Gold Temple 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/ed9aa7874_Gold-in-Solomons-Temple-1-1024x585.jpg", label: "Solomon Gold Temple 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/b74c92a56_777f7d648de806a2714c768c9b438bea.jpg", label: "Gold Interior Temple 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3d3ecd562_777f7d648de806a2714c768c9b438bea.jpg", label: "Gold Interior Temple 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fcc19e773_29063b843e86cd58857bc3ce6b0c7c37.jpg", label: "Sacred Interior 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/41261b0fb_29063b843e86cd58857bc3ce6b0c7c37.jpg", label: "Sacred Interior 2" },
  // Mosque Interiors
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8b79dd457_istockphoto-1470806526-1024x1024.jpg", label: "Mosque 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/89706e8bf_istockphoto-2153270376-612x6121.jpg", label: "Mosque 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/fc96310a0_istockphoto-1415206430-1024x1024.jpg", label: "Mosque 3" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/647ca63ef_istockphoto-636498350-612x612.jpg", label: "Mosque 4" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/9935526d9_istockphoto-2218500353-1024x1024.jpg", label: "Mosque 5" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a1581071e_istockphoto-181065518-1024x1024.jpg", label: "Mosque 6" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/246ed5ae9_istockphoto-477907349-1024x1024.jpg", label: "Mosque 7" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/88e710347_istockphoto-483630985-1024x1024.jpg", label: "Mosque 8" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/ba6b716b1_istockphoto-1351999176-1024x1024.jpg", label: "Mosque 9" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/afe6a73f6_istockphoto-1219757617-1024x1024.jpg", label: "Mosque 10" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f589d3dc5_istockphoto-1264148870-1024x1024.jpg", label: "Mosque 11" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a4710199b_istockphoto-1297050281-1024x1024.jpg", label: "Mosque 12" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/ea42383b8_istockphoto-1311350502-1024x1024.jpg", label: "Mosque 13" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4835e4300_istockphoto-1304750440-1024x1024.jpg", label: "Mosque 14" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/aafb2b88e_istockphoto-2181844410-1024x1024.jpg", label: "Mosque 15" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/030815ef9_istockphoto-2181844477-1024x1024.jpg", label: "Mosque 16" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/e70da96a3_istockphoto-935955304-1024x1024.jpg", label: "Mosque 17" },
  // Tomb / Mausoleum
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/33a6dd671_the-extravagance-of-the-interior-of-the-family-tomb-of-habib-bourguiba-E7Y65E.jpg", label: "Bourguiba Tomb" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/06f8a566f_interior-of-the-tomb-of-the-reza-shah-of-iran-al-rifaii-mosque-royal-HR77EW.jpg", label: "Reza Shah Tomb" },
  // Palace / Royal
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/3499820b2_0502efa7900a15bf241a618154610d25.jpg", label: "Palace Interior 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/4c7ba952e_il_1588xN2075060493_83w4.jpg", label: "Palace Interior 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/e559ee0a9_il_1588xN7348955749_jmfr.jpg", label: "Palace Interior 3" },
  // Spiritual / Cosmic / Akashic
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/8d9f7b34b_ranjan-bera-img-20190727-wa0013.jpg", label: "Spiritual Cosmic 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/2a5fa300d_09-16-20_12-02-48AM.png", label: "Spiritual Cosmic 2" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/857201925_26-05-2023_19-57-29.png", label: "Spiritual Cosmic 3" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/dec2fe662_How-to-Access-and-Read-the-Akashic-Records.jpg", label: "Akashic Records 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/0aab30b73_How-to-Access-and-Read-the-Akashic-Records.jpg", label: "Akashic Records 2" },
  // Digital / Zero Point
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/024e96e90_1336-319x160.jpg", label: "Zero Point Digital 1" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/a5745fe29_1336-319x160.jpg", label: "Zero Point Digital 2" },
  // Science / Brain / Atom
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/f3fc38781_stock-photo-central-organ-of-human-nervous-system-brain-anatomy-d-1859779633.jpg", label: "Brain Anatomy 3D" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/84dc95843_1000_F_971892795_RX3cpf8xMUbbE4vJ2MnOerElgOeodidS.jpg", label: "Science Lab" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/48f4d2d97_istockphoto-1305107176-170667a.jpg", label: "Neural Network" },
  { url: "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/eba4e64a4_atom-big-crop-2048x1097.jpg", label: "Atom" },
];

export default function BackgroundImagePicker() {
  const [selected, setSelected] = useState(new Set(ALL_IMAGES.map(i => i.url)));
  const [preview, setPreview] = useState(null);
  const [copied, setCopied] = useState(false);

  const toggle = (url) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(url) ? next.delete(url) : next.add(url);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(ALL_IMAGES.map(i => i.url)));
  const clearAll = () => setSelected(new Set());

  const generateCode = () => {
    const urls = ALL_IMAGES.filter(i => selected.has(i.url)).map(i => `  "${i.url}",`).join("\n");
    return `const LIBRARY_IMAGES = [\n${urls}\n];`;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-2xl font-black mb-1">Background Image Picker</h1>
        <p className="text-gray-400 text-sm mb-4">Click images to toggle them on/off. Green border = included in slideshow.</p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-gray-400 text-sm">{selected.size} / {ALL_IMAGES.length} selected</span>
          <button onClick={selectAll} className="px-3 py-1.5 rounded-lg bg-green-900/40 border border-green-700 text-green-300 text-xs font-bold hover:bg-green-900/60 transition-colors">Select All</button>
          <button onClick={clearAll} className="px-3 py-1.5 rounded-lg bg-red-900/40 border border-red-700 text-red-300 text-xs font-bold hover:bg-red-900/60 transition-colors">Clear All</button>
          <button onClick={copyCode} className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-cyan-900/40 border border-cyan-700 text-cyan-300 text-xs font-bold hover:bg-cyan-900/60 transition-colors">
            <Copy size={12} /> {copied ? "Copied!" : "Copy Selected URLs"}
          </button>
          <span className="text-gray-600 text-xs">→ Paste the list to me and I'll update the slideshow</span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {ALL_IMAGES.map((img, idx) => {
          const isSelected = selected.has(img.url);
          return (
            <div key={idx} className="relative group cursor-pointer" onClick={() => toggle(img.url)}>
              <div
                className="relative rounded-xl overflow-hidden aspect-video transition-all"
                style={{
                  border: isSelected ? "3px solid #22c55e" : "3px solid rgba(255,255,255,0.08)",
                  boxShadow: isSelected ? "0 0 12px rgba(34,197,94,0.4)" : "none",
                }}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className={`absolute inset-0 transition-all ${isSelected ? "bg-black/10" : "bg-black/50"}`} />
                {/* Check / X */}
                <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? "bg-green-500" : "bg-gray-700"}`}>
                  {isSelected ? <Check size={12} className="text-white" /> : <X size={12} className="text-gray-400" />}
                </div>
                {/* Expand */}
                <button
                  onClick={e => { e.stopPropagation(); setPreview(img.url); }}
                  className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye size={12} className="text-white" />
                </button>
                {/* Number */}
                <div className="absolute top-2 left-2 bg-black/60 rounded px-1.5 py-0.5 text-xs text-gray-300 font-mono">{idx + 1}</div>
              </div>
              <p className="text-gray-400 text-xs mt-1 truncate px-1">{img.label}</p>
            </div>
          );
        })}
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-6 py-3 flex items-center justify-between z-50">
        <span className="text-gray-300 text-sm font-bold">{selected.size} images selected</span>
        <button onClick={copyCode} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-black text-sm transition-colors">
          <Copy size={14} /> {copied ? "Copied!" : "Copy Selection"}
        </button>
      </div>

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6" onClick={() => setPreview(null)}>
          <img src={preview} alt="Preview" className="max-w-full max-h-full rounded-xl object-contain" />
          <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700">
            <X size={18} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
}