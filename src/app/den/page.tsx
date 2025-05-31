"use client";
import React, { useState, useEffect } from "react";

function page() {
  const [showTopFade, setShowTopFade] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopFade(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="bg-black h-screen scroll-smooth"
      style={{ fontFamily: "var(--font-geist-mono)" }}
    >
      <div className="relative">
        {/* Dynamic top fade */}
        <div
          className="fixed top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent pointer-events-none z-20"
          style={{
            opacity: showTopFade ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
        {/* Constant bottom fade */}
        <div className="fixed bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />

        {/* Sticky footer arrow */}
        <div className="fixed bottom-6 right-6 hidden md:block z-30">
          <button className="p-3 rounded-full bg-white/80 hover:bg-white/20 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-3.5 h-3.5 text-black "
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>

        <div className="text-white/60 tracking-tight uppercase flex flex-col justify-center relative z-10">
          <div className="md:max-w-2xl md:mx-auto w-full px-6 md:px-0">
            <h2 className="text-4xl text-left text-white/80 pt-6 pb-2 md:text-5xl md:leading-tight">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-sm bg-white/80 text-black px-2 rounded-md w-fit">
                    tech
                  </div>
                  <div className="text-sm bg-white/80 text-black px-2 rounded-md w-fit">
                    apple
                  </div>
                  <div className="text-sm bg-white/80 text-black px-2 rounded-md w-fit">
                    ai
                  </div>
                </div>
                {/* <div className="text-base">
                  smth.
                </div> */}
              </div>
              Apple Acquires Rewind.ai in Silent $1.2B Deal.
            </h2>
            <div className="mb-6 text-sm tracking-widest">May 31, 2025</div>

            <div className="pb-20 md:text-lg md:leading-relaxed">
              In a surprise weekend release, OpenAI has unveiled WhisperMesh, a
              lightweight AI model designed to run entirely on-device,
              prioritizing speed, privacy, and real-time response. While not as
              powerful as GPT-4o, early testers say it's "shockingly fast" and
              ideal for offline tasks like writing, summarization, and code
              refactoring.
              <div className="mt-4">
                The model is optimized for M-series chips and select Android
                hardware, hinting at OpenAI's push into deeper OS-level
                integrations. Some speculate WhisperMesh is the foundation for a
                rumored AI operating system. OpenAI declined to comment on
                whether WhisperMesh will replace the ChatGPT desktop app's
                backend.
              </div>
              <div className="mt-4">
                WhisperMesh isn't just a local model — it's OpenAI's clearest
                move yet toward an AI-first OS architecture. The model can
                handle offline transcription, code generation, language
                translation, and context-aware summaries without pinging a
                server. Developers have already started probing its SDK, which
                quietly appeared on GitHub under an MIT license. One user dubbed
                it "Spotlight on steroids," while others speculate it's a
                response to Apple's rumored "AI Core" layer launching at WWDC.
                Still, the release has raised questions: Why now? And why so
                quietly? Some insiders point to regulatory heat around
                centralized AI, while others believe it's OpenAI's hedge against
                the rising tide of edge computing. Either way, WhisperMesh is
                here — and it might just live in your laptop next.
              </div>
              <div className="pt-16">
                <div className=" text-white text-2xl">key points.</div>
              </div>
              <div className="mt-4 space-y-4">
                <div className="text-white/60">
                  Runs Fully On-Device No server calls. No lag. WhisperMesh
                  thrives on speed and privacy, designed for real-time offline
                  use.
                </div>
                <div className="text-white/60">
                  Tailored for Apple Silicon + Android Optimized for M-series
                  chips and select mobile hardware — this isn't just desktop
                  tech. AI OS Foundations? Whispers of a full AI-first operating
                  system are growing louder. WhisperMesh might be the seed.
                </div>
                <div className="text-white/60">
                  Open Access, Quiet Rollout MIT-licensed SDK. No fanfare. Just
                  a GitHub link and a ripple through dev channels.
                </div>
                <div className="text-white/60">
                  Competitive Ripples Dubbed "Spotlight on steroids," it may be
                  OpenAI's preemptive strike against Apple's rumored "AI Core."
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
