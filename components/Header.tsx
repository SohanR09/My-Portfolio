"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { DarkModeToggle } from "./DarkModeToggle";
import { NAV_ITEMS, SITE_CONFIG } from "@/constants";
import { motion, useAnimation } from "motion/react";
import { HeaderLogo } from "./ui/header-logo";

interface TextContent {
  headerName: string;
  heroName: string;
  heroSubtitle: string;
  lastUpdated?: string;
}

/**
 * Header component that displays the navigation menu and logo.
 * It includes a mobile-responsive hamburger menu and dark mode toggle.
 */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [textContent, setTextContent] = useState<TextContent | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchTextContent = async () => {
      try {
        const response = await fetch("/api/site-settings/text-content");
        if (response.ok) {
          const data = await response.json();
          setTextContent(data);
        }
      } catch (err) {
        console.error("Error fetching text content:", err);
      }
    };

    fetchTextContent();
  }, []);

  // Function to handle smooth scrolling to sections
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();

    // Close mobile menu if open
    if (isOpen) {
      setIsOpen(false);
    }

    // Get the target element
    const targetId = href.replace("#", "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      // Scroll to the target element smoothly
      targetElement.scrollIntoView({ behavior: "smooth" });

      // Update URL without page reload
      window.history.pushState(null, "", href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md text-gray-900 dark:text-white shadow-2xl"
          : "bg-transparent text-white"
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className={`text-2xl font-bold ${
              isScrolled ? "text-gray-900 dark:text-white" : "text-white"
            }`}
          >
            {isScrolled && (
              <HeaderLogo
                text={textContent?.headerName || SITE_CONFIG.name.split(" ")[0]}
                className="bg-gradient-to-br from-blue-200 via-blue-800 to-blue-950 bg-clip-text text-transparent"
              />
            )}
          </Link>
          <div className="hidden md:flex space-x-4 justify-center items-center">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`hover:underline underline-offset-2 cursor-pointer ${
                  isScrolled ? "text-gray-900 dark:text-white" : "text-white"
                }`}
              >
                {item.name}
              </a>
            ))}
            <DarkModeToggle isScrolling={isScrolled} />
          </div>
          <div className="flex justify-center items-center gap-2 md:hidden">
            <DarkModeToggle isScrolling={isScrolled} />
            <button
              className={
                isScrolled ? "text-gray-900 dark:text-white" : "text-white"
              }
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
