import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

/**
 * CopyProtection — mounts globally to block common data-theft vectors:
 * - Right-click context menu
 * - Keyboard shortcuts: Ctrl/Cmd + C, U, S, P, A, Shift+I, F12
 * - Text selection via CSS
 * - Drag-and-drop of content
 * - Print attempts
 */
export default function CopyProtection() {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => setIsAdmin(u?.role === 'admin')).catch(() => setIsAdmin(false));
  }, []);

  useEffect(() => {
    if (isAdmin === null || isAdmin === true) return; // skip protection for admins
    const blockContext = (e) => e.preventDefault();

    const blockKeys = (e) => {
      const blocked = [
        e.ctrlKey && e.key === "c",
        e.ctrlKey && e.key === "u",
        e.ctrlKey && e.key === "s",
        e.ctrlKey && e.key === "p",
        e.ctrlKey && e.key === "a",
        e.metaKey && e.key === "c",
        e.metaKey && e.key === "u",
        e.metaKey && e.key === "s",
        e.metaKey && e.key === "p",
        e.metaKey && e.key === "a",
        e.ctrlKey && e.shiftKey && e.key === "I",
        e.ctrlKey && e.shiftKey && e.key === "J",
        e.ctrlKey && e.shiftKey && e.key === "C",
        e.key === "F12",
        e.key === "PrintScreen",
      ];
      if (blocked.some(Boolean)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const blockDrag = (e) => e.preventDefault();

    const blockPrint = () => {
      // inject no-print style dynamically
    };

    document.addEventListener("contextmenu", blockContext);
    document.addEventListener("keydown", blockKeys, true);
    document.addEventListener("dragstart", blockDrag);
    window.addEventListener("beforeprint", blockPrint);

    // CSS-level protection injected into <head>
    const style = document.createElement("style");
    style.id = "copy-protection-style";
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
      }
      /* Allow selection in readable content */
      p, li, td, blockquote, span.selectable {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        user-select: text !important;
      }
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        user-select: text !important;
      }
      @media print {
        body { display: none !important; }
      }
    `;
    document.head.appendChild(style);

    // Watermark injected into body
    const watermark = document.createElement("div");
    watermark.id = "copy-protection-watermark";
    watermark.setAttribute("aria-hidden", "true");
    watermark.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;
    const wm = document.createElement("div");
    wm.style.cssText = `
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%) rotate(-35deg);
      font-size: 80px;
      font-weight: 900;
      color: rgba(255,255,255,0.025);
      white-space: nowrap;
      letter-spacing: 0.2em;
      pointer-events: none;
      user-select: none;
    `;
    wm.textContent = "CONFIDENTIAL";
    watermark.appendChild(wm);
    document.body.appendChild(watermark);

    return () => {
      document.removeEventListener("contextmenu", blockContext);
      document.removeEventListener("keydown", blockKeys, true);
      document.removeEventListener("dragstart", blockDrag);
      window.removeEventListener("beforeprint", blockPrint);
      document.getElementById("copy-protection-style")?.remove();
      document.getElementById("copy-protection-watermark")?.remove();
    };
  }, [isAdmin]);

  return null;
}