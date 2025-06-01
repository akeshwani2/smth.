"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

interface NewsSource {
  id: string;
  name: string;
  category: string;
}

export default function SourceSelection() {
  const [sources, setSources] = useState<NewsSource[]>([]);
  const [selectedSources, setSelectedSources] = useState<string[]>([
    'hacker-news',
    'techcrunch',
    'the-verge'
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved sources from localStorage
    const savedSources = localStorage.getItem("selectedSources");
    if (savedSources) {
      setSelectedSources(JSON.parse(savedSources));
    }

    // Fetch available sources
    const fetchSources = async () => {
      try {
        const response = await axios.get(
          "https://newsapi.org/v2/sources?category=technology",
          {
            params: {
              apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY
            }
          }
        );
        setSources(response.data.sources);
      } catch (error) {
        console.error("Error fetching sources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, []);

  const toggleSource = (sourceId: string) => {
    const newSources = selectedSources.includes(sourceId)
      ? selectedSources.filter(id => id !== sourceId)
      : [...selectedSources, sourceId];
    
    setSelectedSources(newSources);
    localStorage.setItem("selectedSources", JSON.stringify(newSources));
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white/60 flex items-center justify-center">Loading sources...</div>;
  }

  return (
    <div className="min-h-screen bg-black uppercase text-white/60 p-8" style={{ fontFamily: "var(--font-geist-mono)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl text-white/80">Select News Sources</h1>
          <Link 
            href="/den" 
            className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all"
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