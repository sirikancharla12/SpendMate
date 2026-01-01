"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TextHoverEffect({ text, duration = 0 }) {
  const svgRef = useRef(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const cx = ((cursor.x - rect.left) / rect.width) * 100;
    const cy = ((cursor.y - rect.top) / rect.height) * 100;

    setMaskPosition({ cx: `${cx}%`, cy: `${cy}%` });
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 300 100"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className="select-none"
    >
      <defs>
        <motion.radialGradient
          id="revealMask"
          r="20%"
          animate={maskPosition}
          transition={{ duration, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="textMask">
          <rect width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        mask="url(#textMask)"
        className="fill-transparent stroke-neutral-300 text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
}
