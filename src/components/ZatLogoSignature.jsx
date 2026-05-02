import { createPortal } from "react-dom";

export default function ZatLogoSignature() {
  return createPortal(
    <div className="zat-logo-signature">
      <img
        src="https://media.base44.com/images/public/69ccefebfea78b23498c66a8/6722a4c01_839284090_logo.png"
        alt="Zenith Apex Tech"
      />
      <span className="zat-label">ZENITH APEX TECH</span>
      <span className="zat-label" style={{ color: "rgba(0,200,255,0.7)", fontSize: 7 }}>
        TEST · ENGINEER · CONSTRUCT
      </span>
    </div>,
    document.body
  );
}