"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-2" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-xl font-semibold my-1.5" {...props} />,
        p: ({ node, ...props }) => <p className="mb-2 leading-relaxed" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-6 mb-2" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        code: ({ node, inline, ...props }) => 
          inline ? (
            <code className="bg-white/10 px-1.5 py-0.5 rounded" {...props} />
          ) : (
            <pre className="bg-white/10 p-4 rounded-lg my-2 overflow-x-auto">
              <code {...props} />
            </pre>
          ),
        strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
        em: ({ node, ...props }) => <em className="italic" {...props} />,
        a: ({ node, ...props }) => (
          <a 
            className="text-blue-400 hover:text-blue-300 underline" 
            target="_blank" 
            rel="noopener noreferrer" 
            {...props} 
          />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
} 