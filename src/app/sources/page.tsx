"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface NewsSource {
  id: string;
  name: string;
  category: string;
}

export default function SourceSelection() {
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([
    'wired', 'the-verge', 'techcrunch'
  ]);

  useEffect(() => {
    // Load saved sources from localStorage
    const savedSources = localStorage.getItem("selectedSources");
    if (savedSources) {
      setSelectedSources(JSON.parse(savedSources));
    }

    // Set static sources
    const staticSources: NewsSource[] = [
      { id: 'the-verge', name: 'The Verge', category: 'Technology' },
      { id: 'the-atlantic', name: 'The Atlantic', category: 'General' },
      { id: 'ars-technica', name: 'Ars Technica', category: 'Technology' },
      { id: 'new-scientist', name: 'New Scientist', category: 'Science' },
    ];
    
    setSources(staticSources);
  }, []);

  const toggleSource = (sourceId: string) => {
    const newSources = selectedSources.includes(sourceId)
      ? selectedSources.filter(id => id !== sourceId)
      : [...selectedSources, sourceId];
    
    setSelectedSources(newSources);
    localStorage.setItem("selectedSources", JSON.stringify(newSources));
  };

  return (
    <div className="min-h-screen bg-black uppercase text-white/60 p-8" style={{ fontFamily: "var(--font-geist-mono)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl text-white/80">Select News Sources</h1>
          <Link 
            href="/den" 
            className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 border border-white/10 rounded-lg transition-all"
          >
            →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map(source => (
            <button
              key={source.id}
              onClick={() => toggleSource(source.id)}
              className={`p-4 text-left rounded-lg uppercase border transition-all ${
                selectedSources.includes(source.id)
                  ? "border-white/30 bg-white/10"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{source.name}</span>
                <div className={`w-4 h-4 rounded-full border ${
                  selectedSources.includes(source.id)
                    ? "bg-white/80 border-transparent"
                    : "bg-transparent border-white/20"
                }`} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}