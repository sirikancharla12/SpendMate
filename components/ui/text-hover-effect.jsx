"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function TextHoverEffect({ text }) {
  const svgRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ cx: "50%", cy: "50%" });

  /* ✅ absolutely required */
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  function handleMove(e) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setPos({
      cx: `${((e.clientX - rect.left) / rect.width) * 100}%`,
      cy: `${((e.clientY - rect.top) / rect.height) * 100}%`,
    });
  }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 300 100"
      className="w-full h-24 select-none"
      onMouseMove={handleMove}
    >
      <defs>
        <motion.radialGradient
          id="mask"
          r="20%"
          animate={pos}
          transition={{ duration: 0.15 }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="reveal">
          <rect width="100%" height="100%" fill="url(#mask)" />
        </mask>
      </defs>

      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="fill-transparent stroke-neutral-400 text-6xl font-bold"
      >
        {text}
      </text>

      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        mask="url(#reveal)"
        className="fill-transparent stroke-purple-500 text-6xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
}
