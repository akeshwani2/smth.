"use client";

import React from "react";

const Navbar = () => {
  const handleClick = () => {
    window.location.href = "/sign-in";
  };

  return (
    <>
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center text-white/40 bg-transparent z-20">
        {/* Left: Logo/Brand */}
        <div
          className="text-sm font-light tracking-tight uppercase"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          ELEVEN
        </div>

        {/* Center: Tagline */}
        <div
          className="hidden md:block text-sm font-light tracking-tight uppercase text-center"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          remember everything
        </div>
        <div
          className="hidden md:block text-sm font-light tracking-tight uppercase"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          ©2025
        </div>

        {/* Right: Meta/Nav */}
        <div className="flex items-center space-x-2 text-sm font-light tracking-tight uppercase">
          <button
            onClick={handleClick}
            className="hover:text-gray-500 cursor-pointer duration-300 transition-all"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            EXCLUSIVE ACCESS
          </button>
        </div>
      </header>

      <style jsx>{`
        .wave-line {
          width: 10px;
          height: 1px;
          background-color: white;
          animation: wave 1.5s ease-in-out infinite alternate;
        }

        @keyframes wave {
          0% {
            transform: translateX(-3px);
          }
          100% {
            transform: translateX(3px);
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
