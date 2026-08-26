"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?@#$%^&*()-_+=<>/:;,. ";

interface SplitFlapTextProps {
  text: string;
  speed?: number; // Delay in ms before stopping on the right char
}

export function SplitFlapText({ text, speed = 100 }: SplitFlapTextProps) {
  return (
    <div className="flex gap-1">
      {text.split("").map((char, index) => (
        <SplitFlapChar key={index} targetChar={char.toUpperCase()} delay={index * speed} />
      ))}
    </div>
  );
}

function SplitFlapChar({ targetChar, delay }: { targetChar: string; delay: number }) {
  const [char, setChar] = useState(CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (targetChar === " ") {
      setChar(" ");
      setDone(true);
      return;
    }

    const startTime = Date.now();
    const duration = 500 + delay; // How long it flips before stopping

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        setChar(targetChar);
        setDone(true);
        clearInterval(interval);
      } else {
        setChar(CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [targetChar, delay]);

  return (
    <div className="relative w-8 h-12 bg-neutral-900 text-white font-mono font-bold text-2xl flex items-center justify-center rounded-sm overflow-hidden shadow-lg border border-neutral-700">
      <div className="absolute w-full h-[1px] bg-neutral-950 top-1/2 z-10 opacity-50" />
      {char}
      {!done && (
        <motion.div
          animate={{ rotateX: [0, -90, -180] }}
          transition={{ repeat: Infinity, duration: 0.1, ease: "linear" }}
          className="absolute inset-0 bg-neutral-900 flex items-center justify-center origin-bottom"
          style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)" }}
        >
          {char}
        </motion.div>
      )}
    </div>
  );
}
