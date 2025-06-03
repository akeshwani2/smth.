"use client";
import { useState, useRef, useEffect } from "react";
import { Paperclip, ArrowUp, Lightbulb } from "lucide-react";
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
          <div className="text-2xl">{formatDate(currentTime)}</div>
          <div>{formatTime(currentTime)}</div>
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
                      ? " text-white/70 text-base"
                      : " text-white/70 text-base"
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
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full bg-transparent text-white/70 focus:outline-none mb-4
                    text-left py-4 px-4 placeholder-white/30 uppercase text-lg"
                placeholder="feed the den..."
              />

              <div className="flex items-center justify-between px-4 pb-4">
                <div className="flex items-center gap-2">
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
                    className="text-white/50 hover:text-white/70 transition-all 
                              focus:outline-none cursor-pointer hover:scale-110 duration-200 
                              border border-white/20 rounded-xl p-2 hover:border-white/40"
                    aria-label="Inspiration"
                  >
                    <Lightbulb className="w-4 h-4" />
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
    </div>
  );
}
