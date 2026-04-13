/**
 * AttributionFooter — comprehensive third-party inventor attribution
 * Displayed on any page referencing suppressed / historical inventor research.
 * Provides legal cover by explicitly crediting all original authors.
 */
export default function AttributionFooter({ compact = false }) {
  const inventors = [
    { name: "Lt. Col. Thomas E. Bearden (US Army, Ret.)", works: "Gravitobiology (1991), Excalibur Briefing (1980/1988), Toward a New Electromagnetics Parts 1–4 (1983), Energy from the Vacuum (2002), AIDS: Biological Warfare (1988). Published in Foundations of Physics Letters, Explore!, Tesla Book Company, Cheniere Press." },
    { name: "Nikola Tesla", works: "Colorado Springs Diary (1899), Wardenclyffe Tower patents (1897–1904), US Patents 645,576 & 649,621. All Tesla works are in the public domain. Referenced under fair use." },
    { name: "Antoine Priore", works: "French Patent No. 1,342,772 (1962). US ONR London Branch Report R-5-78 (Bateman, 1978). Referenced as public government document." },
    { name: "Royal Raymond Rife", works: "Universal Microscope (1933), Rife frequency therapy research. Referenced via Christopher Bird documentation. All works referenced under fair use for research purposes." },
    { name: "T.H. Moray", works: "The Sea of Energy in Which the Earth Floats (1960, Cosray Research Institute). Referenced under fair use." },
    { name: "Wilhelm Reich", works: "The Function of the Orgasm (1942), Cancer Biopathy (1948), Contact with Space (1957). Referenced under fair use. All books in public domain or legally republished." },
    { name: "Viktor Schauberger", works: "Living Energies (documented by Callum Coats, 1996, Gateway Books). Austrian patents. Referenced under fair use." },
    { name: "Walter Russell", works: "The Universal One (1926), The Secret of Light (1947), Atomic Suicide? (1957). University of Science and Philosophy, Waynesboro, VA. Referenced under fair use." },
    { name: "Dr. Evgeny Podkletnov", works: "Physica C (1992), Modanese & Podkletnov impulse gravity generator (2001). Referenced as peer-reviewed publications." },
    { name: "John Hutchison", works: "Hutchison Effect experiments (1979–present). Documented by independent military and laboratory witnesses. Referenced under fair use." },
    { name: "Dr. Paul LaViolette", works: "Subquantum Kinetics (1985 PhD thesis, Portland State; published 1994, Starlane Publications), Earth Under Fire (1997). Referenced under fair use." },
    { name: "Dr. Randell Mills", works: "Grand Unified Theory of Classical Physics (GUT-CP, Brilliant Light Power). International Journal of Hydrogen Energy publications. Referenced under fair use." },
    { name: "Craig F. Bohren", works: "Bohren, Am. J. Phys. 51(4), April 1983 — referenced as peer-reviewed open literature." },
    { name: "Dr. Hartmut Müller (IREF)", works: "Global Scaling Theory (1982), G-Com® demonstration (2001). Referenced under fair use." },
    { name: "Sid Hurwich", works: "EM field disabler device (1969). Documented in Weekend Magazine (Dec 17, 1977) and Foreign Report (Economist). Referenced under fair use." },
    { name: "C.H. Waddington", works: "The Strategy of the Genes (1957, Allen & Unwin). Epigenetic landscape model. Referenced under fair use." },
    { name: "John Bedini", works: "Environmental EM Conditioning research (2002, private communication to Bearden). Referenced under fair use." },
    { name: "M.W. Evans et al.", works: "O(3) Electrodynamics, Foundations of Physics Letters 14(1) (2001). 15 authors from 12 international institutions. Referenced as peer-reviewed publication." },
    { name: "Felix Finster", works: "Adv. Theor. Math. Phys. 2 (1998). Harvard/MIT. Referenced as peer-reviewed publication." },
    { name: "A.V. Nikulov (Russian Academy of Sciences)", works: "Quantum power source paper (2002). Referenced as peer-reviewed publication." },
    { name: "R.J. Radus (Westinghouse)", works: "Engineers' Digest 24(1–6), Jan–Jun 1963. Referenced as prior art cited in US Patent 6,362,718 B1." },
    { name: "J.C. Maxwell", works: "Philosophical Magazine (1861): On Physical Lines of Force. All Maxwell works are in the public domain." },
    { name: "V.P. Kaznacheyev", works: "Cytopathogenic effect research, Soviet Academy of Sciences. Referenced via Bearden documentation under fair use." },
    { name: "Lisitsyn (Soviet Academy of Sciences)", works: "Classified EM biological trigger window frequency tables. Referenced via Bearden documentation under fair use." },
    { name: "Charles F. Brush", works: "J. Franklin Inst., Vol. 206, No. 2 (1928). All works in public domain." },
    { name: "Charles Muses", works: "Cybernetics of Nature, Foreword to Rothstein (1958). Referenced under fair use." },
  ];

  if (compact) {
    return (
      <div className="text-xs text-gray-600 leading-relaxed px-2 py-2 border-t border-gray-800 mt-4">
        <span className="text-gray-500 font-semibold">© Attribution: </span>
        All concepts, theories, and source fragments are derived from the published works of the inventors and researchers listed on this platform. Third-party works remain copyright of their respective authors. Referenced under fair use for educational and research purposes. Zenith Apex LLC claims no ownership of any third-party source material.
      </div>
    );
  }

  return (
    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5 mt-6">
      <div className="mb-4">
        <h3 className="text-white font-bold text-sm mb-1">Third-Party Research Attribution & Copyright Notice</h3>
        <p className="text-gray-500 text-xs leading-relaxed">
          Zenith Apex Research Platform references, indexes, and synthesizes the published works of the following researchers and inventors.
          <span className="text-yellow-400 font-semibold"> All third-party works remain the exclusive intellectual property of their original authors or estates.</span> Content is referenced under the Fair Use doctrine (17 U.S.C. § 107) for educational, research, commentary, and criticism purposes. Zenith Apex LLC claims no ownership of any third-party source material, invention, patent, or publication listed below. No endorsement by any listed author or estate is implied.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {inventors.map((inv, i) => (
          <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-3">
            <p className="text-white font-semibold text-xs mb-1">{inv.name}</p>
            <p className="text-gray-500 text-xs leading-relaxed">{inv.works}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <p className="text-gray-600 text-xs leading-relaxed">
          <span className="font-semibold text-gray-500">Patent Notice: </span>
          US Patent 6,362,718 B1 (MEG — Bearden, Patrick, et al.) is referenced for educational analysis of the prior art landscape. No claim of ownership is made by Zenith Apex LLC. All patent references are cited as public record per 35 U.S.C. and international patent law.
        </p>
        <p className="text-gray-600 text-xs leading-relaxed mt-2">
          <span className="font-semibold text-gray-500">Government Documents: </span>
          ONR London Branch Report R-5-78 (1978), TACOM IOP FSO-3 memorandum (2003), and other government documents are cited as unclassified public records under the Freedom of Information Act and public domain status.
        </p>
        <p className="text-gray-600 text-xs leading-relaxed mt-2">
          <span className="font-semibold text-gray-500">Disclaimer: </span>
          References to suppression, classified research, or government actions reflect the documented claims and allegations of the cited researchers. Zenith Apex LLC makes no independent claim regarding the accuracy of these allegations. All content is presented for historical, educational, and research documentation purposes only.
        </p>
      </div>
    </div>
  );
}