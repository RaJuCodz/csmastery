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
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
            >
              CS Mastery
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
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
                >
                  <LucideIcons.HelpCircle size={18} />
                  FAQ
                </button>
              )}
              {isHomePage && (
                <button
                  onClick={scrollToAbout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
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
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
        <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
          <div className="flex flex-col h-full">
            <div className="flex justify-end p-4">
              <button
                className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400"
                onClick={() => setIsMobileMenuOpen(false)}
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
                    className="text-lg"
                  />
                );
              })}
              {isHomePage && (
                <button
                  onClick={scrollToFAQ}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
                >
                  <LucideIcons.HelpCircle size={20} />
                  FAQ
                </button>
              )}
              {isHomePage && (
                <button
                  onClick={scrollToAbout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300"
                >
                  About Us
                </button>
              )}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <Profile />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
