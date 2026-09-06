import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";

export const DynamicWatermark: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [position, setPosition] = useState({ top: 15, left: 15 });

  const watermarkText = user
    ? `${user.email} • ID: ${String(user.id).slice(0, 8)}`
    : "Protected Content • Nexura Hub";

  useEffect(() => {
    const interval = setInterval(() => {
      // Random coordinates between 10% and 80% to keep inside bounds
      const randomTop = Math.floor(Math.random() * 70) + 10;
      const randomLeft = Math.floor(Math.random() * 70) + 10;
      setPosition({ top: randomTop, left: randomLeft });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute z-30 pointer-events-none select-none transition-all duration-1000 ease-in-out px-3 py-1 rounded-full bg-black/40 backdrop-blur-xs text-[11px] font-mono text-white/40 border border-white/10 shadow-sm"
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
      }}
    >
      {watermarkText}
    </div>
  );
};

export default DynamicWatermark;
