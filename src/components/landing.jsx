"use client";
import { motion } from "framer-motion";
import { Highlight, HeroHighlight } from "./ui/hero-highlight";

export function HeroHighlightDemo() {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-3xl px-4 md:text-5xl lg:text-6xl font-extrabold font-mono text-gray-900 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto drop-shadow-lg"
      >
        Welcome to <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 bg-clip-text text-transparent font-extrabold">Mentor.Ai</span>
        <div className="mt-4 text-lg md:text-2xl font-semibold text-gray-700 dark:text-gray-200">
          With guidance of expert AI, unlock the power of <Highlight className="text-black dark:text-white">Learning</Highlight>
        </div>
      </motion.h1>
    </HeroHighlight>
  );
}
