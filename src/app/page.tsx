"use client";
import { useState, useRef, useEffect } from "react";
import { Paperclip, ArrowUp, Lightbulb, BookOpen } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp?: number;
  responseTime?: number;
}

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInputCentered, setIsInputCentered] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isInspirationActive, setIsInspirationActive] = useState(false);
  const [isCanvasActive, setIsCanvasActive] = useState(false);
  const [canvasContent, setCanvasContent] = useState("");


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true 
    });
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    const startTime = Date.now();

    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: startTime,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsInputCentered(false);
    setInputValue("");

    const botMessageId = Date.now().toString() + "-bot";
    setMessages((prev) => [
      ...prev,
      {
        id: botMessageId,
        content: "",
        isUser: false,
        timestamp: startTime,
      },
    ]);

    try {
      const responseStart = Date.now();

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
        }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? { ...msg, content: msg.content + chunkValue }
              : msg
          )
        );
      }

      const responseTime = Date.now() - responseStart;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId ? { ...msg, responseTime } : msg
        )
      );
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, content: "Error generating response" }
            : msg
        )
      );
    }
  };

  return (
    <div
      className="h-screen uppercase p-6 flex flex-col"
      style={{ fontFamily: "var(--font-geist-mono)" }}
    >
      <div className="flex justify-between items-center">
        <div className="text-white/70 flex flex-col">
          <div className="text-sm md:text-2xl">{formatDate(currentTime)}</div>
          <div className="text-sm md:text-base">{formatTime(currentTime)}</div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto pb-4">
          <div className="max-w-2xl mx-auto w-full space-y-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.isUser
                      ? " text-white/70 text-sm md:text-base"
                      : " text-white/70 text-sm md:text-base"
                  }`}
                >
                  <MarkdownRenderer content={message.content} />
                  {!message.isUser && message.responseTime && (
                    <div className="mt-2 text-xs text-white/40 lowercase">
                      {message.responseTime}ms
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      <div
        className={`${
          messages.length > 0 ? "pt-4" : "flex-1"
        } transition-[flex-grow,padding] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]`}
      >
        <div className="max-w-2xl mx-auto w-full h-full">
          <div
            className={`${
              messages.length > 0
                ? "h-auto"
                : "h-full flex items-center justify-center"
            } transition-all duration-500`}
          >
            <div className="bg-white/7 border rounded-2xl border-white/20 focus-within:border-white/25 transition-all duration-300 w-full">
              <textarea
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  // Auto-resize logic
                  e.target.style.height = 'auto';
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                rows={1}
                className="w-full bg-transparent text-white/70 focus:outline-none mb-4
                    text-left py-4 px-4 placeholder-white/30 uppercase text-lg resize-none
                    overflow-y-auto max-h-32"
                placeholder="feed the den..."
              />

              <div className="flex items-center justify-between px-4 pb-4">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    className="text-white/50 hover:text-white/70 transition-all 
                              focus:outline-none cursor-pointer hover:scale-110 duration-200 
                              border border-white/20 rounded-xl p-2 hover:border-white/40"
                    aria-label="Attach file"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCanvasActive(!isCanvasActive)}
                    className={`text-white/50 hover:text-white/70 transition-all 
                              focus:outline-none cursor-pointer hover:scale-110 duration-200 
                              border rounded-xl p-2 ${
                                isCanvasActive 
                                  ? 'text-white/70 border-white/40' 
                                  : 'border-white/20 hover:border-white/40'
                              }`}
                    aria-label="Canvas mode"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={!inputValue}
                  onClick={handleSubmit}
                  className={`${
                    inputValue
                      ? "text-white/70 hover:text-white/90 cursor-pointer border border-white/40 hover:scale-110 transition-all duration-150"
                      : "text-white/20 cursor-not-allowed border border-white/20 "
                  } transition-all focus:outline-none duration-200 rounded-xl p-2`}
                  aria-label="Submit"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isCanvasActive && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsCanvasActive(false)}>
          <div 
            className="absolute right-0 top-0 h-full w-full max-w-2xl bg-[#0a0a0a] border-l border-white/20 p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-white/70"></h2>
              <button
                onClick={() => setIsCanvasActive(false)}
                className="text-white/50 hover:text-white/70 transition-all"
                aria-label="Close canvas"
              >
                ×
              </button>
            </div> */}
            <textarea
              value={canvasContent}
              onChange={(e) => setCanvasContent(e.target.value)}
              className="w-full h-full bg-transparent text-white/70 focus:outline-none resize-none uppercase"
              placeholder="Start writing your essay..."
              rows={10}
            />
          </div>
        </div>
      )}
    </div>
  );
}
