"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaRocket, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "홈", path: "/" },
    { name: "창업 정보", path: "/info" },
    { name: "상권 분석", path: "/analysis" },
    { name: "AI 컨설팅", path: "/consulting" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Toss Style */}
          <Link href="/" className="flex items-center space-x-2 group">
            <FaRocket className="text-2xl text-primary-500 group-hover:text-primary-600 transition-colors" />
            <span className="text-xl font-black text-gray-900">
              창업 컨설팅
            </span>
          </Link>

          {/* Desktop Navigation - Toss Style */}
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    isActive(item.path)
                      ? "bg-primary-500 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                </div>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-semibold transition-all ${
                      isActive(item.path)
                        ? "bg-primary-500 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.name}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

