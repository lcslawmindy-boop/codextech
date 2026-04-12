import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, FileText, ZoomIn, X } from "lucide-react";

const BASE = "https://media.base44.com/images/public/69ccefebfea78b23498c66a8/";

const FIGURES = [
  { id: "1",  file: "f2bbcb46e_TRZPPAfigs1a.jpg",  caption: "Fig. 1 — Production of longitudinal EM waves from transverse EM waves, and time-density waves from longitudinal EM waves." },
  { id: "2",  file: "5bec18eed_TRZPPAfigs2a.jpg",  caption: "Fig. 2 — Time-charging of an electron: conventional spatial-energy-excited state vs. time-density-excited state." },
  { id: "3",  file: "7d591c36a_TRZPPAfigs3a.jpg",  caption: "Fig. 3 — Interference of time-density waves producing longitudinal EM waves; interference of LWs producing transverse EM waves." },
  { id: "4",  file: "131138e99_TRZPPAfigs4a.jpg",  caption: "Fig. 4A & 4B — Forming a time-density EM wave with controlled substructure; longitudinal EM wave pair with difference frequency." },
  { id: "5",  file: "a744bac3d_TRZPPAfigs5a.jpg",  caption: "Fig. 5 — Flowchart: forming a scalar potential with deterministic substructure." },
  { id: "6",  file: "1f521009a_TRZPPAfigs6a.jpg",  caption: "Fig. 6 — Flowchart: creating conditioned pseudo-longitudinal wave pairs and a quantum potential of infinite velocity." },
  { id: "7",  file: "79b2e8425_TRZPPAfigs7a.jpg",  caption: "Fig. 7 — Production of conventional transverse EM waves in a target zone by interference of two (conditioned) time-density EM waves." },
  { id: "8",  file: "b2f893ada_TRZPPAfigs8a.jpg",  caption: "Fig. 8A & 8B — Apparatus to condition a scalar potential using a coil (8A) and using a plasma (8B)." },
  { id: "9",  file: "707933aee_TRZPPAfigs9a.jpg",  caption: "Fig. 9A & 9B — Multi-stage mixing apparatus (9A); gas-breakdown apparatus for conditioning scalar potentials (9B)." },
  { id: "10", file: "ed06dbf66_TRZPPAfigs10a.jpg", caption: "Fig. 9C — Nonlinear optics principle of self-targeting (iterative phase conjugation)." },
  { id: "11", file: "dab33f132_TRZPPAfigs11a.jpg", caption: "Fig. 10 & 11A — Apparatus for converting transverse EM waves into longitudinal EM waves; augmentation apparatus." },
  { id: "12", file: "db788df17_TRZPPAfigs12a.jpg", caption: "Fig. 11B — Method for creating a time-density wave using 180-degree phase shift and nonlinear mixing." },
  { id: "13", file: "77ebc8711_TRZPPAfigs13a.jpg", caption: "Fig. 12 — Block diagram of data processing system (controller) used in embodiments of the invention." },
  { id: "14", file: "0d7d052d1_TRZPPAfigs14a.jpg", caption: "Fig. 13 — Detailed block diagram of data processing system; Fig. 14A — Codec for modulating conditioned scalar potential." },
  { id: "15", file: "b957ff609_TRZPPAfigs15a.jpg", caption: "Fig. 14B — Embodiment for conditioning a scalar potential onto a sine-wave carrier for conventional transmission." },
  { id: "16", file: "e41a9ae4c_TRZPPAfigs16a.jpg", caption: "Fig. 15 — System for interference of scalar potentials in a target zone using two transmitters." },
  { id: "17", file: "719fe24dd_TRZPPAfigs17a.jpg", caption: "Fig. 16 — Variant scalar potential interference system producing spacetime curvature engines from transverse waves." },
  { id: "18", file: "6b5d4ec4c_TRZPPAfigs18a.jpg", caption: "Fig. 17 — Single-transmitter scalar interference embodiment using timed pulses." },
  { id: "19", file: "fd57e16e9_TRZPPAfigs19a.jpg", caption: "Fig. 18 — Scalar interference apparatus for adding or removing spatial energy from a distant target." },
  { id: "20", file: "745837cf4_TRZPPAfigs20a.jpg", caption: "Fig. 19 — Apparatus for altering chemicals by creating a time-reversal zone within a reaction vessel." },
  { id: "21", file: "5ac5d525e_TRZPPAfigs21a.jpg", caption: "Fig. 20 — Mobile system for decontaminating buildings via interference of conditioned scalar potentials." },
  { id: "22", file: "95f420c27_TRZPPAfigs22a.jpg", caption: "Fig. 21 — Flowchart: process using database of spacetime curvature engines to act on specified disease-causing agents." },
  { id: "23", file: "6dfe50f23_TRZPPAfigs23a.jpg", caption: "Fig. 22 — Mobile biological decontamination system using database of spacetime curvature engines." },
  { id: "24", file: "d20a6e7cc_TRZPPAfigs24a.jpg", caption: "Fig. 23A & 23B — Interferometer system to alter nuclear reaction rates; instrument to detect time-density charging." },
  { id: "25", file: "bfde3b60b_TRZPPAfigs25a.jpg", caption: "Fig. 24 — Modified electrolysis apparatus using engineered time-reversal zones to form deuterium nuclides and/or alpha particles." },
  { id: "26", file: "e043d53c4_TRZPPAfigs26a.jpg", caption: "Fig. 25A & 25B — Ordinary mirror vs. phase-conjugate mirror; conventional method for creating an amplified phase-conjugate replica." },
  { id: "27", file: "28b8ed624_TRZPPAfigs27a.jpg", caption: "Fig. 26A & 26B — Time-reversal of a mass by an amplified vacuum anti-engine; application to alter matter to a desired state." },
  { id: "28", file: "929edd9a7_TRZPPAfigs28a.jpg", caption: "Fig. 27 — Schematic of portable treatment unit for treating a living body." },
  { id: "29", file: "1d64b48af_TRZPPAfigs29a.jpg", caption: "Fig. 28 — Illustration of the portable treatment unit (Fig. 27)." },
  { id: "30", file: "7fc1e2263_TRZPPAfigs30a.jpg", caption: "Fig. 29 — Non-portable hospital and research embodiment of the portable apparatus." },
  { id: "31", file: "79c4b6a46_TRZPPAfigs31a.jpg", caption: "Fig. 31 — Porthole Briefing slide: Complete system overview for mass casualty treatment." },
];

const REFS = [
  'E. T. Whittaker, On the Partial Differential Equations of Mathematical Physics, Mathematische Annalen, Vol. 57, 1903, p. 333-355.',
  'E. T. Whittaker, On an Expression of the Electromagnetic Field Due to Electrons by Means of Two Scalar Potential Functions, Proc. London Mathematical Society, Series 2, Vol. 1, 1904, p. 367-372.',
  'T. E. Bearden, Giant Negentropy from the Common Dipole, Journal of New Energy, 5(1), Summer 2000, p. 11-23.',
  'F. Mandl and G. Shaw, Quantum Field Theory, Wiley, 1984, Chapter 5.',
  'Antoine Priore, French Patent 1,342,772, Oct. 7, 1963; U.S. Patent 3,280,816 (1966); U.S. Patent 3,368,155 (1968).',
  'Robert O. Becker et al., Papers on bioelectric potentials, bone fracture healing, and cell dedifferentiation (1963-1977).',
  'Fritz Albert Popp et al., Papers on biophoton emission and cellular coherence (1984-1988).',
  'Amnon Yariv, Optical Electronics, 3rd Edn., Holt, Rinehart and Winston, 1985, p. 500-501. (Distortion correction theorem.)',
  'W. A. Rodrigues Jr. and J.-Y. Lu, On the existence of undistorted progressive waves (UPWs) of arbitrary speeds, Foundations of Physics, 27(3), 1997.',
  'B. Lehnert and S. Roy, Extended Electromagnetic Theory: Space-Charge in Vacuo and the Rest Mass of the Photon, World Scientific, 1999.',
  'P. K. Anastasovski, T. E. Bearden et al., The New Maxwell Electrodynamic Equations: New Tools for New Technologies, Journal of New Energy, 4(3), Winter 1999.',
  'T. D. Lee, Particle Physics and Introduction to Field Theory, Harwood, 1981.',
  'David J. Bohm, A Suggested Interpretation of the Quantum Theory in Terms of Hidden Variables, Physical Review, 85(2), 1952.',
  'Myron W. Evans, B(3) electrodynamics and O(3) symmetry papers, Apeiron, 4(2-3), 1997.',
  'Patrick Cornille, Inhomogeneous Waves and Maxwell Equations, Essays on the Formal Aspects of Electromagnetic Theory, 1993.',
];

const SECTIONS = [
  {
    id: "abstract",
    title: "Abstract / Field of the Invention",
    content: `This invention pertains to the treatment of matter with electromagnetic energy to cause specified changes in the matter. More particularly, this invention deals with methods, systems and apparatus for the creation and application of conditioned electromagnetic potentials, fields, and waves, wherein the conditioning comprises the selection and combination of identified constituent electromagnetic waves, in order to produce desired interactions with matter.

The matter may be chemicals, nuclear materials, living cells, and the like, and the results of the interactions may be the time-reversal of the matter to a previous state, or the application of a chosen delta to the matter's current state, so as to effect desired chemical reactions, nuclear reactions, or biological changes, respectively.

The invention covers two versions of the conditioning process:
(1) The formation of the conditioning of the electromagnetic potentials, fields, and waves outside the body, and then irradiating the body with EM radiation carrying the desired conditioning.
(2) The irradiation of the body dielectric with the same EM waves, fields, and potentials emitted by the body dielectric, but amplified. In this latter process, the formation of the desired conditioning is accomplished by the highly nonlinear characteristics of the body and cellular material at every level, in every location in the body dielectric.`
  },
  {
    id: "summary",
    title: "Summary of the Invention",
    content: `The present invention exploits the fact that all electromagnetic fields, potentials, and waves are composed of more fundamental electromagnetic structures. To directly engineer spacetime and induce desired changes in matter -- specifically the mass-energy of the body dielectric, in all parts and dynamics -- the invention uses and applies these more fundamental electromagnetic structures, which constitute curvatures of spacetime capable of directly affecting and changing matter according to the exact pattern and dynamics of the internal structures.

A scalar potential is just a bundle of bidirectional longitudinal electromagnetic waves, in pairs, where each pair consists of an incoming time-polarized EM wave (EM energy moving along the time-axis) and an outgoing longitudinal EM wave in 3-space. Any electromagnetic field or wave may be decomposed into two scalar potentials, as shown by Whittaker in 1904, thus initiating that branch of electrodynamics known as superpotential theory.

The invention addresses all the steps in such a process:
- Methods to convert transverse electromagnetic waves into longitudinal waves, always accompanied by one-to-one correlated time-polarized EM waves.
- Techniques to combine collections of input waves into a conditioned scalar potential with desired modification to its internal structure.
- Means to transmit the conditioning over a distance and reconstitute input transverse waves in a target zone through interference therein.
- Recording, digital processing, and synthesis of engineered waveforms for use in conjunction with these embodiments.

Most centrally, the invention provides a practical means to treat living cells and living bodies to reverse disease and damage, by irradiating a body with longitudinal EM waves (always accompanied by correlated time-polarized EM waves). The accompanying time-polarized EM waves pump the mass-energy of the body in the time domain rather than the spatial domain -- an extension of nonlinear phase conjugate optics to time-domain EM pumping.

The result is that, analogous to normal reversal of a 2-D planar EM wave in 3-space, the pumped 3-D mass-energy and its exact dynamics are reversed back along the time axis to a previous 3-D physical mass-energy state and dynamics. This is in fact the normal healing mechanism used by the cellular regenerative system of the human body.`
  },
  {
    id: "background",
    title: "Background of the Invention",
    content: `In initiating superpotential theory, in 1904 E. T. Whittaker showed that any electromagnetic field or wave could be considered as two scalar potential functions, and in 1903 he had previously shown that any scalar potential has an internal composition of harmonic bidirectional EM longitudinal wavepairs. It follows that any EM field or wave or potential can be decomposed into a more primary structure of harmonic bidirectional EM waves and their dynamics.

F. Mandl and G. Shaw recognize four possible polarizations of the photon:
1. Two spatial transverse polarizations (common transverse EM waves) -- well known
2. Spatially longitudinal polarization (third type) -- less well known; vibration along axis of travel in 3-D space
3. Time-polarization (fourth type) -- vibration along the axis of travel in the time-axis (Minkowski spacetime); also called time-density wave, electrogravitic wave, or scalar potential wave

Since time-polarized waves associate with longitudinal EM waves in 3-space on a 1:1 correlation basis, the time-polarized EM wave always accompanies the longitudinal EM wave whenever any observable effects are apparent.

Present electrodynamics erroneously omits the transport by electromagnetic waves of time-domain dynamics. That EM waves do indeed transport time energy can be seen by considering that each photon carries angular momentum = energy x time. Thus every photon carries not only an increment of energy but also an increment of time. A dynamic assembly of photons -- such as an EM wave -- carries both a dynamic spatial energy density structuring (via dynamics of energy components) and a time density structuring (via dynamics of time components).

A scalar potential carries hidden variables in the precise frequency, phase angle, and magnitude composition of its constituent longitudinal EM wave parts. When additional internal information has been deliberately placed there, the scalar potential is said to be conditioned. This conditioning is sometimes called a spacetime curvature engine or vacuum engine.

The invention makes heavy use of principles of nonlinear optics as a means of creating and conditioning longitudinal EM waves. Conventional nonlinear optics only addresses pumping by means of transverse electromagnetic waves, providing rhythmic squeezes of the energy density in the spatial domain only. To time-reverse a 3-dimensional mass, as contemplated by the present invention, it is necessary to create a 3-D wavefront -- a longitudinally-polarized wave in the time domain accompanying a longitudinally-polarized EM wave in 3-space. Such methods did not exist prior to the present invention.`
  },
  {
    id: "priorart",
    title: "Prior Art",
    content: `1. THE WORK OF ANTOINE PRIORE

The closest known prior art is the magnetic-field treatment of living cells and bodies by Antoine Priore in France in the 1950s through about 1973. Priore's electromagnetic devices dramatically time-reversed diseased and damaged cells in laboratory animals.

Into a tube containing a plasma of mercury and neon gas, a pulsed 9.4 GHz wave modulated upon a 17 MHz carrier frequency was introduced. These waves were produced by radio emitters and magnetrons in the presence of a 1,000 gauss magnetic field. Experimental animals were placed into this magnetic field and the modulations passed through their bodies. In the 1960s, Priore's machines demonstrated a nearly 100% cure of various kinds of terminal cancers and leukemias, in thousands of rigorous laboratory tests with animals.

However, Priore did not truly understand the nature of his apparatus or how it produced its effects. His trial-and-error approach could not produce a very good longitudinal wave, requiring very long periods of irradiation (2-3 hours) to obtain only a mild, intermittent, statistical time-charging effect. Priore's machine was also bulky (four stories high), expensive (millions of 1970 dollars), fragile, and consumed a great deal of power.

2. THE WORK OF ROBERT BECKER

Robert Becker proved that cells could be dedifferentiated and redifferentiated with very weak (picoamperes) DC current and weak voltages, obtaining a weak time-reversal of living cells. He demonstrated that dedifferentiated red blood cells could then be redifferentiated into cells that make cartilage, then further into cells that make bone, healing intractable bone fractures. Like Priore, he did not understand the mechanism -- specifically that longitudinal waves and time-polarized waves were responsible, nor that an extended form of optical pumping in the time-domain was involved.

3. THE WORK OF FRITZ ALBERT POPP

Fritz Albert Popp used quantum electrodynamics to show that cellular systems have some kind of master cellular control system, and that mitogenetic photon emission is correlated to cellular condition. Popp did not suggest to use the observed emissions to cause specified changes in living cells, or by what mechanisms, as disclosed in the present invention.`
  },
  {
    id: "objects",
    title: "Objects of the Invention",
    content: `- Produce a longitudinal electromagnetic wave (along with its accompanying time-polarized electromagnetic wave) from transverse EM waves, and a conditioned time-density wave with deterministic substructure from longitudinal waves.

- Provide methods and apparatus: using a coil, plasma, multi-stage mixer, gas breakdown, 180-degree phase shift, phase-conjugate mirror, and digital-signal-processing means.

- Synthesize a conditioned scalar potential from its calculated mathematical constituents.

- Amplify a phase conjugate replica wave so that a time-reversal zone or a vacuum anti-engine may be created.

- Charge matter with a time-charge carrying a predetermined spacetime curvature set (an engine), and produce specified changes in the matter by the operation of said curvature set and engine upon said matter.

- Produce predetermined conventional transverse EM waves in a target zone by interference of conditioned time-density waves, wherein energy can be added or removed from the target zone.

- Provide an instrument that can detect time-density charging and the initiation of time-charge excitation decay.

- Propagate conditioned time-density waves by modulating them upon a standard carrier wave for conventional transmission.

- Produce a time-reversal zone via iterative phase conjugation; alter chemicals and nuclear reactions within the zone; form deuterium nuclides and/or alpha particles.

- Decontaminate places or specimens contaminated with specified substances including disease-causing agents.

- Degrade harmful nuclear wastes into less-harmful or short-lived isotopes by induced quark-flipping in nucleons.

- Time-reverse a living or inert mass to a state in which the mass previously existed, by producing an amplified vacuum anti-engine and applying the engine to the mass.

- Provide a treatment unit to treat living cells and bodies to reverse disease and damage, including a portable unit suitable for treating mass casualties.`
  },
  {
    id: "description",
    title: "Detailed Description of the Preferred Embodiments",
    content: `TRANSDUCTION BETWEEN EM WAVE FORMS (Fig. 1):

At step 100, a transverse EM wave (120) and its phase-conjugate replica (130) combine in mixing operation (140) to produce a spatially longitudinal wave (150). At step 110, a longitudinal wave (150) and its phase-conjugate replica (170) combine at mixing operation (180) to yield a time-density wave (190). These transductions are key elements used throughout the invention.

CONDITIONED SCALAR POTENTIAL (Figs. 4A, 5):

By selecting and mixing constituent transverse wave pairs (Fig. 4A), a time-density EM wave with controlled substructure is formed. The flowchart (Fig. 5) shows: (1) Select constituent transverse waves; (2) Control each individually for frequency, amplitude, phase; (3) Interact with nonlinear phase-conjugating medium -- longitudinal waves formed; (4) Interact longitudinal waves with nonlinear medium -- scalar potential with deterministic substructure formed.

QUANTUM POTENTIAL PRODUCTION (Fig. 6):

By introducing waves between two phase-conjugate mirrors, iterative retroreflection reduces the transverse magnitude toward zero until the wave pair becomes entirely longitudinal. The operating region where longitudinal polarization emerges but transverse magnitude has not reached zero is the pseudo-longitudinal wave pair region, where wave velocity v exceeds c but remains finite. Continued reconvergence produces a pure longitudinal wave with infinite spatial velocity -- a quantum potential.

SCALAR POTENTIAL INTERFEROMETRY (Fig. 7):

When two conditioned scalar potential beams (phi-1 and phi-2) are focused on the same interference zone (320), conventional transverse EM waves are produced in that zone by the interfering longitudinal EM wave pairs. By conditioning the potentials appropriately, any desired EM field or wave pattern can be produced at the interference zone -- even at remote distances, inside Faraday cages, or inside solid matter.

TIME-REVERSAL ZONE (Fig. 10 / Phase Conjugate Mirrors):

Two phase-conjugate mirrors (1010) face each other. Input EM pump waves (1030) and a time-density wave generator (1110) supply energy. Iterative ping-pong phase conjugation (1040) between the mirrors builds a time-reversal zone (800) in the space between them. Particles, suspensions, or lattices (1040, 1050, 1060) in the zone can be treated. This is applied to induce nuclear transmutation, chemical alteration, or biological time-reversal.

PORTABLE TREATMENT UNIT (Figs. 27-28):

The portable treatment unit (2800) consists of: (a) Equipment case (2810) containing all electronics; (b) EM wave conditioning unit (2700) with controller (1200), frequency generators (2720), plasma mixing unit (2730), magnetic pulse generator (2740), field sensor (2750); (c) Antenna pad (2760) placed under or near the individual under treatment (2805).

The EM wave conditioning unit records EM signals emitted from the body, amplifies them, and reapplies them to the body. The nonlinear body medium decomposes normal EM potentials into their Whittaker longitudinal EM wavepair constituents, inducing time-domain pumping throughout all cells and their constituents.

TREATMENT PROTOCOL:
- Emergency/mass casualty: 1 minute at high amplification (some discomfort)
- Urgent: 2-3 minutes (reduced discomfort)
- Normal: 15-30 minutes at reduced amplification (no discomfort)
- Three treatments one week apart are indicated in all cases.

HOSPITAL UNIT (Fig. 29):

The larger non-portable unit (Fig. 29) adds: Alterations Database (reference states), Recorders & Broadband Amplifiers, Broadband Antenna Unit (cylindrical array surrounding patient), and a Receiver-Transmitter array with adjustable bandwidth and amplification. Time-density charge is structured to contain the precise spacetime curvature engines for time-reversal and steering. Charging occurs quickly; engines continue to work for an extended period after charging ceases.`
  }
];

function FigureModal({ figure, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-w-5xl w-full bg-gray-900 rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
          <p className="text-white font-bold text-sm">Fig. {figure.id}</p>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-4 bg-white flex items-center justify-center min-h-64">
          <img src={BASE + figure.file} alt={"Figure " + figure.id} className="max-w-full max-h-[75vh] object-contain" />
        </div>
        <div className="px-5 py-3">
          <p className="text-gray-300 text-xs leading-relaxed">{figure.caption}</p>
        </div>
      </div>
    </div>
  );
}

function FigureGrid() {
  const [active, setActive] = useState(null);
  return (
    <div>
      {active && <FigureModal figure={active} onClose={() => setActive(null)} />}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {FIGURES.map(fig => (
          <button key={fig.id} onClick={() => setActive(fig)}
            className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-900/20 transition-all text-left">
            <div className="relative overflow-hidden">
              <img src={BASE + fig.file} alt={"Fig " + fig.id}
                className="w-full h-36 object-contain bg-white p-2 group-hover:scale-105 transition-transform" />
              <div className="absolute top-2 right-2 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={12} className="text-white" />
              </div>
            </div>
            <div className="bg-gray-950 px-3 py-2">
              <p className="text-yellow-400 font-bold text-xs">Fig. {fig.id}</p>
              <p className="text-gray-500 text-xs leading-tight mt-0.5 line-clamp-2">{fig.caption.replace(/^Fig\. \d+[A-Z]?[^-]*-- /, '').replace(/^Fig\. \d+[A-Z]? & \d+[A-Z]? -- /, '')}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Section({ section }) {
  const [open, setOpen] = useState(section.id === "abstract");
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-800/50 transition-colors text-left">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 rounded-full bg-yellow-500" />
          <h2 className="text-white font-bold text-base">{section.title}</h2>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-6">
          <div className="h-px bg-gray-800 mb-5" />
          <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{section.content}</div>
        </div>
      )}
    </div>
  );
}

export default function TRZPatent() {
  const [figuresOpen, setFiguresOpen] = useState(false);

  return (
    <div className="w-screen min-h-screen bg-gray-950 flex flex-col">
      <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between flex-shrink-0 bg-gray-950/95 sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <div className="w-px h-5 bg-gray-700" />
          <div>
            <h1 className="text-white font-bold text-base tracking-tight">TRZ Provisional Patent Application</h1>
            <p className="text-yellow-600 text-xs font-semibold">Thomas E. Bearden, Ph.D. -- Filed by Anthony J. Craddock</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-yellow-900/40 border border-yellow-800 text-yellow-400 font-bold">PPA</span>
          <span className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-gray-400">{FIGURES.length} Figures</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-4xl mx-auto px-6 py-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-900/30 border border-yellow-800 text-yellow-400 text-xs font-bold mb-6">
              <FileText size={12} /> PROVISIONAL PATENT APPLICATION
            </div>
            <h1 className="text-white font-black text-2xl md:text-3xl leading-tight mb-4">
              Method, System and Apparatus for Conditioning Electromagnetic Potentials, Fields, and Waves to Treat and Alter Matter
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-6">
              <span><span className="text-gray-400 font-semibold">Inventor:</span> Thomas E. Bearden, Ph.D.</span>
              <span className="hidden md:block">·</span>
              <span><span className="text-gray-400 font-semibold">Prepared by:</span> T. E. Bearden &amp; Marcia Peters</span>
              <span className="hidden md:block">·</span>
              <span><span className="text-gray-400 font-semibold">Filed by:</span> Anthony J. Craddock</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8 text-left">
              {[
                { label: "Total Figures", value: "31" },
                { label: "Key References", value: "60+" },
                { label: "Embodiments", value: "Fig. 8-29" },
                { label: "Application", value: "TRZ / MEG / Priore" },
              ].map(s => (
                <div key={s.label} className="bg-gray-800/60 rounded-xl p-3 border border-gray-700/50">
                  <p className="text-white font-bold text-lg">{s.value}</p>
                  <p className="text-gray-500 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-4">
          {SECTIONS.map(s => <Section key={s.id} section={s} />)}

          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <button onClick={() => setFiguresOpen(o => !o)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-800/50 transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 rounded-full bg-cyan-500" />
                <h2 className="text-white font-bold text-base">All 31 Figures -- Patent Drawings Gallery</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-900/40 border border-cyan-800 text-cyan-400 font-bold">Click to Zoom</span>
              </div>
              {figuresOpen ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
            </button>
            {figuresOpen && (
              <div className="px-6 pb-6">
                <div className="h-px bg-gray-800 mb-5" />
                <FigureGrid />
              </div>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4">
              <div className="w-1 h-5 rounded-full bg-purple-500" />
              <h2 className="text-white font-bold text-base">Key References Cited</h2>
            </div>
            <div className="px-6 pb-6">
              <div className="h-px bg-gray-800 mb-5" />
              <div className="space-y-3 text-xs text-gray-400 leading-relaxed">
                {REFS.map((ref, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-yellow-600 font-bold flex-shrink-0">[{i + 1}]</span>
                    <span>{ref}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center py-8 text-gray-700 text-xs">
            Zenith Apex Research Platform · Bearden TRZ PPA · Primary Source Archive · NDA Applies
          </div>
        </div>
      </div>
    </div>
  );
}