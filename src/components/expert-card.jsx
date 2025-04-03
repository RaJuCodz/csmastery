"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  BookOpen,
  Brain,
  Code2,
  Database,
  Network,
  Server,
  Shield,
  Smartphone,
  Webhook,
  Cpu,
  Cloud,
  Layers,
  Code,
  Terminal,
  FileCode,
  GitBranch,
  Boxes,
  CircuitBoard,
  Binary,
  FileJson,
  FileText,
  FileType,
  FileCode2,
  FileBinary,
  FileOutput,
  FileInput,
  FileSearch,
  FileCheck,
  FileX,
  FileDiff,
  FileSymlink,
  FileUp,
  FileDown,
  FileMinus,
  FilePlus,
  FileQuestion,
  FileWarning,
  FileInfo,
  FileArchive,
  FileSpreadsheet,
  FileAudio,
  FileVideo,
  FileImage,
  FilePieChart,
  FileBarChart,
  FileLineChart,
  FileHeart,
  FileClock,
  FileKey,
  FileLock,
  FileUnlock,
  FileCheck2,
  FileX2,
  FileMinus2,
  FilePlus2,
  FileQuestion2,
  FileWarning2,
  FileInfo2,
  FileArchive2,
  FileSpreadsheet2,
  FileAudio2,
  FileVideo2,
  FileImage2,
  FilePieChart2,
  FileBarChart2,
  FileLineChart2,
  FileHeart2,
  FileClock2,
  FileKey2,
  FileLock2,
  FileUnlock2,
} from "lucide-react";

const subjectIcons = {
  "Operating System": <Server className="w-8 h-8" />,
  "Computer Networks": <Network className="w-8 h-8" />,
  "Computer Architecture": <Cpu className="w-8 h-8" />,
  "System Design": <Layers className="w-8 h-8" />,
  Algorithms: <Brain className="w-8 h-8" />,
  "Network Programming": <Network className="w-8 h-8" />,
  "Compiler Design": <Code2 className="w-8 h-8" />,
  "Web Technology": <Webhook className="w-8 h-8" />,
  "Data Structures": <Database className="w-8 h-8" />,
  "Artificial Intelligence": <Brain className="w-8 h-8" />,
  "Database Management": <Database className="w-8 h-8" />,
  "Cloud Computing": <Cloud className="w-8 h-8" />,
  "Machine Learning": <Brain className="w-8 h-8" />,
  OOPS: <Boxes className="w-8 h-8" />,
  Java: <FileCode className="w-8 h-8" />,
  "C++": <FileCode className="w-8 h-8" />,
  Python: <FileCode className="w-8 h-8" />,
  JavaScript: <FileCode className="w-8 h-8" />,
  "Data Structures": <Database className="w-8 h-8" />,
  "Operating Systems": <Server className="w-8 h-8" />,
  "Computer Networks": <Network className="w-8 h-8" />,
  "Compiler Design": <Code2 className="w-8 h-8" />,
  "Network Programming": <Network className="w-8 h-8" />,
  "Mobile Development": <Smartphone className="w-8 h-8" />,
  Cybersecurity: <Shield className="w-8 h-8" />,
  "Programming Languages": <Code2 className="w-8 h-8" />,
  "Software Engineering": <BookOpen className="w-8 h-8" />,
};

const ExpertCard = ({ subject, description }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  const springConfig = { damping: 20, stiffness: 200 };
  const springX = useSpring(rotateX, springConfig);
  const springY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateXValue = (e.clientY - centerY) / 10;
    const rotateYValue = (e.clientX - centerX) / 10;

    x.set(rotateYValue);
    y.set(rotateXValue);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const subjectSlug = subject.toLowerCase().replace(/\s+/g, "-");

  return (
    <motion.div
      ref={cardRef}
      className="relative w-full h-[300px] perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      {/* Background Bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <motion.div
        className="gradient-border-wrapper relative w-full h-full rounded-2xl p-[1px]"
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="relative w-full h-full bg-white dark:bg-gray-900 rounded-2xl p-6 flex flex-col justify-between overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_100%)]" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {subjectIcons[subject]}
              </motion.div>
              <motion.h3
                className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {subject}
              </motion.h3>
            </div>
            <motion.p
              className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {description}
            </motion.p>
          </div>

          {/* Bottom Section */}
          <div className="relative z-10 mt-4">
            <Link
              href={`/chat/${subjectSlug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors group"
            >
              <span>Start Learning</span>
              <motion.span
                animate={{ x: isHovered ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                →
              </motion.span>
            </Link>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl" />

          {/* Floating Particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-purple-500/20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}

          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.1) 0%, transparent 70%)",
            }}
            animate={{
              scale: isHovered ? [1, 1.2, 1] : 1,
              opacity: isHovered ? [0.5, 0.8, 0.5] : 0.3,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExpertCard;
