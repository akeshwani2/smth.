/* eslint-disable react-hooks/rules-of-hooks, react/no-unescaped-entities, @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface NewsArticle {
  title: string;
  publishedAt: string;
  description: string;
  content: string;
  source: {
    name: string;
  };
  url: string;
  parsedContent?: string;
  author?: string;
}

function Page() {
  const [showTopFade, setShowTopFade] = useState(false);
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [parsingProgress, setParssingProgress] = useState(0);

  useEffect(() => {
    const fetchAndParseArticles = async () => {
      try {
        const selectedSources = JSON.parse(
          localStorage.getItem("selectedSources") || '["techcrunch", "the-verge"]'
        );

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const newsResponse = await axios.get(
          `https://newsapi.org/v2/everything`, {
            params: {
              sources: selectedSources.join(','),
              sortBy: 'publishedAt',
              from: weekAgo.toISOString(),
              apiKey: process.env.NEXT_PUBLIC_NEWS_API_KEY
            }
          }
        );

        const parsedArticles = [];
        const totalArticles = newsResponse.data.articles.length;

        for (let i = 0; i < totalArticles; i++) {
          try {
            setParssingProgress(Math.round((i / totalArticles) * 100));
            
            const response = await fetch('/api/parse-article', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: newsResponse.data.articles[i].url }),
            });
            
            if (!response.ok) throw new Error('Parse failed');
            
            const parsed = await response.json();
            parsedArticles.push({
              ...newsResponse.data.articles[i],
              parsedContent: parsed.content,
              author: parsed.author
            });
            
            // Early exit if we have at least one valid article
            if (parsedArticles.length >= 3) break;
            
          } catch (error) {
            console.error(`Failed to parse article ${i}:`, error);
            // Continue to next article instead of failing entire process
          }
        }

        setParssingProgress(100);

        const recentArticles = parsedArticles.filter((article: NewsArticle) => {
          const articleDate = new Date(article.publishedAt);
          return articleDate > weekAgo;
        });

        if (recentArticles.length > 0) {
          setArticle(recentArticles[0]);
        } else {
          console.log('No recent articles found');
          setArticle(null);
        }

      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndParseArticles();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopFade(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="h-screen bg-black text-white/60 flex flex-col items-center justify-center uppercase">
        <div className="mb-4">Loading articles...</div>
        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white/80 transition-all duration-300"
            style={{ width: `${parsingProgress}%` }}
          />
        </div>
        <div className="mt-2 text-sm">{parsingProgress}%</div>
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

        <div className="fixed bottom-6 right-6 hidden md:block z-30">
          <button className="p-3 rounded-full bg-white/80 hover:bg-white/20 transition-all">
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
          </button>
        </div>

        <div className="text-white/60 tracking-tight uppercase flex flex-col justify-center relative z-10">
          <div className="md:max-w-2xl md:mx-auto w-full px-6 md:px-0">
            <h2 className="text-4xl text-left text-white/80 pt-6 pb-2 md:text-5xl md:leading-tight">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-sm bg-white/10 backdrop-blur-[2px] border-[0.5px] border-white/10 rounded px-2 py-1 hover:bg-white/10 transition-all duration-200">
                    tech
                  </div>
                  {article?.source?.name && (
                    <div className="text-sm bg-white/10 backdrop-blur-[2px] border-[0.5px] border-white/10 rounded px-2 py-1 hover:bg-white/10 transition-all duration-200">
                      {article.source.name.toLowerCase()}
                    </div>
                  )}
                </div>
              </div>
              {article?.title || 'No title available'}
            </h2>
            <div className="mb-6 text-sm tracking-widest">
              {article?.publishedAt 
                ? new Date(article.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : 'No date available'}
            </div>

            <div className="pb-20 md:text-lg md:leading-relaxed">
              {article?.parsedContent ? (
                <div dangerouslySetInnerHTML={{ __html: article.parsedContent }} />
              ) : (
                <>
                  {article?.description}
                  {article?.content?.split(' ').slice(0, -3).join(' ')}
                </>
              )}

              {article?.url && (
                <div className="mt-6">
                  <a 
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-white/60 hover:text-white underline decoration-white/20 hover:decoration-white/60 transition-all"
                  >
                    Read full article →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
