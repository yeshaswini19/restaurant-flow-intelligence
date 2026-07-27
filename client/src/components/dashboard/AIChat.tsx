"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Bot,
  User,
  Send,
  Trash2,
  Copy,
  Sparkles,
  Check,
} from "lucide-react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

const suggestions = [
  "Why is Paneer Butter Masala unavailable?",
  "Which ingredient should I restock first?",
  "Summarize today's restaurant health.",
  "Which dishes are currently unavailable?",
];

function getCurrentTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        role: "assistant",
        content:
          "👋 Welcome to **KitchenPulse AI**.\n\nI'm your restaurant intelligence assistant.\n\nAsk me anything about inventory, menu availability, ingredients or restaurant insights.",
        createdAt: getCurrentTime(),
      },
    ]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function askAI(text?: string) {
    const query = (text ?? question).trim();

    if (!query || loading) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: query,
      createdAt: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: query,
          }),
        }
      );

      const data = await response.json();

      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          data.answer ??
          "I couldn't generate a response.",
        createdAt: getCurrentTime(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "❌ Unable to contact KitchenPulse AI.",
          createdAt: getCurrentTime(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }
    function clearChat() {
    setMessages([
      {
        id: 1,
        role: "assistant",
        content:
          "👋 Welcome to **KitchenPulse AI**.\n\nI'm your restaurant intelligence assistant.\n\nAsk me anything about inventory, menu availability, ingredients or restaurant insights.",
        createdAt: getCurrentTime(),
      },
    ]);

    setQuestion("");
    inputRef.current?.focus();
  }

  async function copyMessage(
    id: number,
    text: string
  ) {
    await navigator.clipboard.writeText(text);

    setCopiedId(id);

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  }

  return (
    <div className="flex h-[680px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl">

      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-6 py-5 backdrop-blur">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-cyan-500/15 p-2">
            <Sparkles className="h-5 w-5 text-cyan-400" />
          </div>

          <div>
            <h2 className="font-semibold text-white">
              KitchenPulse AI
            </h2>

            <p className="text-xs text-zinc-400">
              Restaurant Intelligence Assistant
            </p>
          </div>

        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-xs transition hover:bg-zinc-800"
        >
          <Trash2 size={15} />
          Clear Chat
        </button>

      </div>

      <div className="border-b border-zinc-800 bg-zinc-900 p-4">

        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Suggested Questions
        </p>

        <div className="flex flex-wrap gap-2">

          {suggestions.map((item) => (
            <button
              key={item}
              disabled={loading}
              onClick={() => askAI(item)}
              className="rounded-full border border-cyan-500/40 px-3 py-2 text-xs text-cyan-300 transition hover:bg-cyan-500/10 disabled:opacity-50"
            >
              {item}
            </button>
          ))}

        </div>

      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-5">

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`flex max-w-[85%] gap-3 ${
                message.role === "user"
                  ? "flex-row-reverse"
                  : ""
              }`}
            >

              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  message.role === "assistant"
                    ? "bg-cyan-500/20"
                    : "bg-zinc-700"
                }`}
              >
                                {message.role === "assistant" ? (
                  <Bot
                    size={18}
                    className="text-cyan-400"
                  />
                ) : (
                  <User
                    size={18}
                    className="text-white"
                  />
                )}

              </div>

              <div
                className={`rounded-2xl px-4 py-3 shadow-lg ${
                  message.role === "assistant"
                    ? "bg-zinc-800 text-zinc-100"
                    : "bg-cyan-500 text-black"
                }`}
              >

                <div className="prose prose-invert max-w-none break-words prose-p:my-2 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2">
                  <ReactMarkdown>
                    {message.content}
                  </ReactMarkdown>
                </div>

                <div className="mt-4 flex items-center justify-between">

                  <span className="text-[11px] opacity-60">
                    {message.createdAt}
                  </span>

                  {message.role === "assistant" && (
                    <button
                      onClick={() =>
                        copyMessage(
                          message.id,
                          message.content
                        )
                      }
                      className="rounded-lg p-1.5 transition hover:bg-white/10"
                    >
                      {copiedId === message.id ? (
                        <Check
                          size={15}
                          className="text-green-400"
                        />
                      ) : (
                        <Copy size={15} />
                      )}
                    </button>
                  )}

                </div>

              </div>

            </div>

          </div>
        ))}

        {loading && (
          <div className="flex justify-start">

            <div className="flex gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20">
                <Bot
                  size={18}
                  className="text-cyan-400"
                />
              </div>

              <div className="rounded-2xl bg-zinc-800 px-5 py-4">

                <div className="flex gap-2">

                  <div className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"></div>

                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"
                    style={{
                      animationDelay: "0.15s",
                    }}
                  ></div>

                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"
                    style={{
                      animationDelay: "0.3s",
                    }}
                  ></div>

                </div>

              </div>

            </div>

          </div>
        )}

        <div ref={bottomRef} />

      </div>
            <div className="border-t border-zinc-800 bg-zinc-900 p-5">

        <div className="flex gap-3">

          <input
            ref={inputRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                askAI();
              }
            }}
            placeholder="Ask anything about your restaurant..."
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
          />

          <button
            disabled={loading || !question.trim()}
            onClick={() => askAI()}
            className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={18} />
            Send
          </button>

        </div>

        <p className="mt-3 text-center text-xs text-zinc-500">
          KitchenPulse AI may occasionally make mistakes.
          Always verify critical inventory and operational
          decisions.
        </p>

      </div>
          </div>
  );
}
