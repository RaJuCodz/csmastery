"use client";
import Link from "next/link";
import NavItem from "./navItem";
import React, { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import Profile from "@/app/profile/page";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const LEFT_LIST = [
  { id: "home", text: "Home", href: "/", icon: "Home" },
  { id: "mentors", text: "Mentors", href: "/experts", icon: "Users" },
  { id: "playground", text: "Playground", href: "/playground", icon: "Code" },
];

const RIGHT_LIST = [
  { id: "about", text: "About Us", href: "#about", icon: "Info" },
];

const LOGO_NAME = "Mentor.AI";

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToFAQ = () => {
    const faqSection = document.getElementById("faq-section");
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about-us");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 shadow-md border-b border-gray-800 ${
        isScrolled
          ? "bg-gray-950/95 dark:bg-gray-950/95 backdrop-blur-md"
          : "bg-gray-950/90 dark:bg-gray-950/90"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link
              href="/"
              className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 drop-shadow-lg tracking-tight select-none hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              aria-label="Mentor.AI Home"
            >
              <span className="inline-block align-middle">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-1">
                  <circle cx="11" cy="11" r="11" fill="url(#mentorai-gradient)" />
                  <text x="11" y="15" textAnchor="middle" fontSize="11" fill="#fff" fontFamily="Arial" fontWeight="bold">M</text>
                  <defs>
                    <linearGradient id="mentorai-gradient" x1="0" y1="0" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#a78bfa" />
                      <stop offset="0.5" stopColor="#f472b6" />
                      <stop offset="1" stopColor="#fde68a" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              {LOGO_NAME}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {LEFT_LIST.map((item) => {
                const IconComponent = LucideIcons[item.icon] || null;
                return (
                  <NavItem
                    href={item.href}
                    text={item.text}
                    icon={IconComponent ? <IconComponent size={18} /> : null}
                    key={item.id}
                  />
                );
              })}
            </div>
            <div className="flex items-center space-x-4">
              {isHomePage && (
                <button
                  onClick={scrollToFAQ}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-200 hover:text-yellow-400 transition-all duration-300 font-semibold"
                >
                  <LucideIcons.HelpCircle size={18} />
                  FAQ
                </button>
              )}
              {isHomePage && (
                <button
                  onClick={scrollToAbout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-200 hover:text-yellow-400 transition-all duration-300 font-semibold"
                >
                  About Us
                </button>
              )}
              <div className="ml-4">
                <Profile />
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-200 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open navigation menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-gray-950/98 backdrop-blur-md">
          <div className="flex flex-col h-full">
            <div className="flex justify-end p-4">
              <button
                className="p-2 rounded-lg text-gray-200 hover:text-yellow-400"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 px-4 py-6 space-y-6">
              {LEFT_LIST.map((item) => {
                const IconComponent = LucideIcons[item.icon] || null;
                return (
                  <NavItem
                    href={item.href}
                    text={item.text}
                    icon={IconComponent ? <IconComponent size={20} /> : null}
                    key={item.id}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg text-gray-200 hover:text-yellow-400 font-semibold"
                  />
                );
              })}
              {isHomePage && (
                <button
                  onClick={scrollToFAQ}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-200 hover:text-yellow-400 transition-all duration-300 font-semibold"
                >
                  <LucideIcons.HelpCircle size={20} />
                  FAQ
                </button>
              )}
              {isHomePage && (
                <button
                  onClick={scrollToAbout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-200 hover:text-yellow-400 transition-all duration-300 font-semibold"
                >
                  About Us
                </button>
              )}
              <div className="pt-6 border-t border-gray-700">
                <Profile />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
