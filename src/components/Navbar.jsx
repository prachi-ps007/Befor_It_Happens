import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { logout } = useAuth();
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, "0");
      const m = String(now.getUTCMinutes()).padStart(2, "0");
      const s = String(now.getUTCSeconds()).padStart(2, "0");
      setTime(`${h}:${m}:${s} UTC`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="relative h-16 flex items-center justify-between px-6 border-b border-[#2a2a2e] bg-[#0f1012] overflow-hidden"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.012) 2px, rgba(255,255,255,0.012) 4px)",
      }}
    >
      {/* Subtle orange glow line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F2994A33] to-transparent" />

      {/* LEFT — Brand */}
      <div className="flex items-center gap-3">
        <h1
          className="text-[18px] tracking-widest text-[#F2994A] leading-none"
          style={{
            fontFamily: '"Train One", cursive',
            textShadow: "0 0 18px #F2994A55",
          }}
        >
          BEFORE IT HAPPENS
        </h1>
        <div className="w-px h-7 bg-[#2a2a2e]" />
        <span
          className="text-[11px] tracking-[0.18em] text-[#555555]"
          style={{ fontFamily: '"Train One", cursive' }}
        >
          PREDICTIVE SAFETY SYSTEM
        </span>
      </div>

      {/* CENTER — System Status */}
      <div className="flex items-center gap-2 font-mono">
        {/* Pulsing green dot */}
        <span className="relative flex h-[7px] w-[7px]">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27AE60] opacity-50" />
          <span className="relative inline-flex rounded-full h-[7px] w-[7px] bg-[#27AE60]" />
        </span>
        <span className="text-[11px] tracking-widest text-[#27AE60]">
          ALL SYSTEMS NOMINAL
        </span>

        <div className="w-px h-4 bg-[#2a2a2e] mx-2" />

        {/* Blinking alert chip */}
        <div className="flex items-center gap-1.5 border border-[#F2994A44] bg-[#F2994A0f] px-2.5 py-1">
          <span className="w-1.5 h-1.5 bg-[#F2994A] animate-pulse"
            style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
          />
          <span className="text-[11px] tracking-[0.08em] text-[#F2994A]">
            2 ACTIVE ALERTS
          </span>
        </div>
      </div>

      {/* RIGHT — Time + Logout */}
      <div className="flex items-center gap-4 font-mono">
        <span className="text-[12px] tracking-[0.08em] text-[#444444] tabular-nums">
          {time}
        </span>
        <button
          onClick={logout}
          className="text-[11px] tracking-[0.1em] text-[#555555] border border-[#2a2a2e] px-3 py-1.5 transition-all duration-150 hover:text-[#EB5757] hover:border-[#EB575755] hover:bg-[#EB575710]"
        >
          ⏻ LOGOUT
        </button>
      </div>
    </div>
  );
}