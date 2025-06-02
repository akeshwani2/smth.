"use client";
import React, { useState, useEffect } from "react";
import { fetchAndParseArticle, Article } from "@/utils/article";
import { ArrowUpRightIcon } from "lucide-react";


// The Verge's tech section URL
const NEWS_URL = 'https://www.semafor.com/';

function Page() {
  const [showTopFade, setShowTopFade] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [newsSummary, setNewsSummary] = useState<string>('');
  const [newsDate, setNewsDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [newsTitle, setNewsTitle] = useState('');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [newsTags, setNewsTags] = useState<string[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopFade(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function loadArticle() {
      try {
        const articleData = await fetchAndParseArticle(NEWS_URL);
        setArticle(articleData);
      } catch (error) {
        console.error('Error loading article:', error);
        setArticle({
          title: "Technical Difficulties",
          content: "Our systems are currently experiencing high demand. Please try again shortly.",
          date: new Date().toLocaleDateString(),
          tags: ["tech"],
          keyPoints: ["Temporary service interruption"],
          url: NEWS_URL
        });
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, []);

  useEffect(() => {
    const fetchNewsSummary = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/parse/news', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: "latest tech news" }),
        });
        
        if (!response.ok) throw new Error('Analysis failed');
        
        const { analysis, title, date, tags, keyPoints } = await response.json();
        setNewsSummary(analysis);
        setNewsTitle(title);
        setNewsDate(date);
        setKeyPoints(keyPoints);
        setNewsTags(tags);
      } catch (err) {
        setError('Failed to load news analysis');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsSummary();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black uppercase text-white/60 flex items-center justify-center">
        Loading latest insights
      </div>
    );
  }

  return (
    <div
      className="bg-black h-screen scroll-smooth"
      style={{ fontFamily: "var(--font-geist-mono)" }}
    >
      <div className="relative">
        <div
          className="fixed top-0 left-0 w-full h-20 bg-gradient-to-b from-black to-transparent pointer-events-none z-20"
          style={{
            opacity: showTopFade ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
        <div className="fixed bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />

        {/* <div className="fixed bottom-6 right-6 hidden md:block z-30">
          <a href={article?.url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-white/80 hover:bg-white/20 transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-3.5 h-3.5 text-black"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </div> */}

        <div className="text-white/60 tracking-tight uppercase flex flex-col justify-center relative z-10">
          <div className="md:max-w-2xl md:mx-auto w-full px-6 md:px-0">
            <h2 className="text-4xl text-left text-white/80 pt-6 pb-2 md:text-5xl md:leading-tight">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  {newsTags.map((tag, index) => (
                    <div key={index} className="text-sm bg-white/10 backdrop-blur-[2px] border-[0.5px] border-white/10 rounded px-2 py-1 hover:bg-white/10 transition-all duration-200">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
              {newsTitle}
            </h2>
            <div className="mb-6 text-sm tracking-widest">{newsDate || 'Loading date...'}</div>

            <div className="pb-20 md:text-lg md:leading-relaxed">
              {newsSummary.split('\n\n')
                .map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              
              <div className="pt-16">
                <div className="text-white text-2xl">TL;DR</div>
              </div>
              <div className="mt-4 space-y-4">
                {keyPoints.map((point, index) => (
                  <div key={index} className="text-white/60">
                    {point}
                  </div>
                ))}
              </div>
              
            </div>
          </div>
        </div>

        {/* <div className="existing-card-class">
          <h2 className="existing-title-class">News Analysis</h2>
          {isLoading && <p className="existing-text-class">Analyzing news...</p>}
          {error && <p className="existing-error-class">{error}</p>}
          {newsSummary && (
            <div className="existing-content-class">
              {newsSummary.split('\n').map((line, i) => (
                <p key={i} className="existing-text-class">{line}</p>
              ))}
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}

export default Page;