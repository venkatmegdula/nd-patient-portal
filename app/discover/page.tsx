"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Send, Upload, FlaskConical, Plus, Loader2 } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { useBookingStore } from "@/stores/bookingStore";
import { getTestById, getPriceRange } from "@/data/tests";
import { formatCurrency, cn } from "@/lib/utils";

/* ── Types ── */
interface AiResponse {
  text: string;
  tests: string[];
}

interface Message {
  role: "user" | "ai";
  text: string;
  tests?: string[];
}

/* ── Mock AI response map ── */
const AI_RESPONSES: { keywords: string[]; response: AiResponse }[] = [
  {
    keywords: ["tired", "fatigue", "fatigue", "exhausted", "weak"],
    response: {
      text: "Fatigue can be caused by anaemia, thyroid issues, or Vitamin B12 deficiency. Here are tests I'd recommend:",
      tests: ["test-cbc", "test-tft", "test-vitb12"],
    },
  },
  {
    keywords: ["thirst", "sugar", "diabetes", "glucose", "urination"],
    response: {
      text: "Frequent thirst may indicate elevated blood sugar. Let's check:",
      tests: ["test-fbs", "test-hba1c", "test-lipid"],
    },
  },
  {
    keywords: ["hair", "hairfall", "baldness", "shedding"],
    response: {
      text: "Hair loss is often linked to thyroid problems or nutritional deficiencies.",
      tests: ["test-tft", "test-vitd", "test-vitb12"],
    },
  },
  {
    keywords: ["weight", "obesity", "gaining", "losing"],
    response: {
      text: "Unexpected weight changes can be thyroid or metabolic related.",
      tests: ["test-tft", "test-lipid", "test-hba1c"],
    },
  },
  {
    keywords: ["chest", "heart", "palpitation", "breathless"],
    response: {
      text: "For chest discomfort, it's important to check your heart health.",
      tests: ["test-lipid", "test-ecg", "test-crp"],
    },
  },
  {
    keywords: ["bone", "joint", "pain", "ache"],
    response: {
      text: "Bone pain is commonly linked to Vitamin D deficiency.",
      tests: ["test-vitd", "test-vitb12", "test-cbc"],
    },
  },
];

const DEFAULT_RESPONSE: AiResponse = {
  text: "Based on your concern, here are some commonly recommended tests:",
  tests: ["test-cbc", "test-vitd", "test-tft"],
};

const PRESET_CHIPS = [
  "I feel tired",
  "Frequent thirst",
  "Hair loss",
  "Weight gain",
  "Chest pain",
  "Bone pain",
  "Stomach issues",
];

/* ── Helpers ── */
function getAiResponse(input: string): AiResponse {
  const lower = input.toLowerCase();
  for (const { keywords, response } of AI_RESPONSES) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return response;
    }
  }
  return DEFAULT_RESPONSE;
}

function getPriceLabel(testId: string): string {
  const range = getPriceRange(testId);
  if (!range) return "Price varies";
  if (range.min === range.max) return formatCurrency(range.min);
  return `${formatCurrency(range.min)} – ${formatCurrency(range.max)}`;
}

/* ── Sub-components ── */
function TestRecommendationCard({ testId }: { testId: string }) {
  const test = getTestById(testId);
  const addToCart = useBookingStore((s) => s.addToCart);
  const cart = useBookingStore((s) => s.cart);
  const inCart = cart.some((c) => c.id === testId);

  if (!test) return null;

  const priceRange = getPriceRange(testId);
  const price = priceRange?.min ?? 0;

  function handleAdd() {
    addToCart({ id: test!.id, type: "test", name: test!.name, price });
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-stone-50 px-3 py-2.5">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-900 truncate">{test.name}</p>
        <p className="text-xs text-stone-400 mt-0.5">{getPriceLabel(testId)}</p>
      </div>
      {inCart ? (
        <Link
          href="/cart"
          className="flex-shrink-0 inline-flex items-center gap-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 px-2.5 h-8 text-xs font-semibold hover:bg-teal-100 transition-colors"
        >
          View Cart
        </Link>
      ) : (
        <button
          onClick={handleAdd}
          className="flex-shrink-0 inline-flex items-center gap-1 rounded-lg bg-primary text-white px-2.5 h-8 text-xs font-semibold hover:bg-teal-700 transition-colors"
        >
          <Plus size={11} />
          Add &amp; Book
        </button>
      )}
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[78%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5">
        <p className="text-sm text-white">{text}</p>
      </div>
    </div>
  );
}

function AiBubble({ text, tests }: { text: string; tests?: string[] }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] space-y-2">
        {/* Avatar + text */}
        <div className="flex items-start gap-2">
          <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 mt-0.5">
            <FlaskConical size={14} className="text-teal-700" />
          </div>
          <div className="rounded-2xl rounded-tl-sm border border-border bg-white px-4 py-2.5 shadow-sm">
            <p className="text-sm text-stone-700 leading-relaxed">{text}</p>
          </div>
        </div>

        {/* Recommended test cards */}
        {tests && tests.length > 0 && (
          <div className="ml-9 flex flex-col gap-2">
            {tests.map((testId) => (
              <TestRecommendationCard key={testId} testId={testId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingBubble() {
  return (
    <div className="flex justify-start">
      <div className="flex items-start gap-2">
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 mt-0.5">
          <FlaskConical size={14} className="text-teal-700" />
        </div>
        <div className="rounded-2xl rounded-tl-sm border border-border bg-white px-4 py-3 shadow-sm">
          <Loader2 size={16} className="animate-spin text-stone-400" />
        </div>
      </div>
    </div>
  );
}

/* ── Page ── */
export default function DiscoverPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    setTimeout(() => {
      const response = getAiResponse(text);
      const aiMsg: Message = {
        role: "ai",
        text: response.text,
        tests: response.tests,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 800);
  }

  function handlePreset(chip: string) {
    sendMessage(chip);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(inputText);
  }

  const hasMessages = messages.length > 0;

  return (
    <PageShell noPadBottom className="flex flex-col">
      {/* ── Header ── */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-heading text-2xl font-extrabold text-stone-900">Ask ND</h1>
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-700">
              Beta
            </span>
          </div>
          <p className="text-sm text-stone-500">Describe your symptoms or health concern</p>
        </div>

        {/* Upload Prescription */}
        <Link
          href="/discover/prescription"
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3 h-9 text-xs font-semibold text-stone-600 hover:border-primary/40 hover:text-teal-700 transition-colors shadow-sm"
        >
          <Upload size={13} />
          Upload Rx
        </Link>
      </div>

      {/* ── Empty state / Preset chips ── */}
      {!hasMessages && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">
            Quick start
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {PRESET_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handlePreset(chip)}
                disabled={loading}
                className="flex-shrink-0 rounded-full border border-border bg-white px-3.5 py-2 text-sm font-medium text-stone-600 hover:border-primary/50 hover:bg-teal-50 hover:text-teal-700 transition-colors disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Chat messages ── */}
      <div
        className={cn(
          "flex-1 overflow-y-auto space-y-4 pb-4",
          !hasMessages && "flex flex-col justify-center"
        )}
      >
        {!hasMessages && (
          <div className="text-center py-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
              <FlaskConical size={28} className="text-teal-600" />
            </div>
            <p className="text-stone-500 text-sm max-w-xs mx-auto">
              Tell me what you&apos;re feeling and I&apos;ll suggest the right tests for you.
            </p>
          </div>
        )}

        {messages.map((msg, i) =>
          msg.role === "user" ? (
            <UserBubble key={i} text={msg.text} />
          ) : (
            <AiBubble key={i} text={msg.text} tests={msg.tests} />
          )
        )}

        {loading && <LoadingBubble />}

        <div ref={bottomRef} />
      </div>

      {/* ── Input bar (sticky bottom) ── */}
      <div className="sticky bottom-0 border-t border-border bg-white/90 backdrop-blur-sm pt-3 pb-safe pb-6">
        {/* Preset chips (compact, visible once chat started) */}
        {hasMessages && (
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {PRESET_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handlePreset(chip)}
                disabled={loading}
                className="flex-shrink-0 rounded-full border border-border bg-stone-50 px-3 py-1.5 text-xs font-medium text-stone-500 hover:border-primary/40 hover:text-teal-700 transition-colors disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Describe your symptoms…"
            disabled={loading}
            className="flex-1 rounded-xl border border-border bg-stone-50 px-4 h-11 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 disabled:opacity-60 transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-white hover:bg-teal-700 disabled:opacity-40 transition-colors"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>
      </div>
    </PageShell>
  );
}
