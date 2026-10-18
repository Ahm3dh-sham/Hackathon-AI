"use client";

import React, { useState, useRef, useEffect } from "react";
import { Loader2, Send, Sparkles, KeyRound, RotateCcw, MessageSquare } from "lucide-react";

/**
 * ============================================================================
 * GEMINI API CONFIGURATION
 * Replace YOUR_API_KEY_HERE with your Gemini API key, or enter it via the UI.
 * Note: gemini-1.5-flash is deprecated; using gemini-3.8-flash on the
 * Gemini Interactions REST API endpoint.
 * ============================================================================
 */
const DEFAULT_API_KEY = "YOUR_API_KEY_HERE";
const MODEL_NAME = "gemini-3.8-flash";
const INTERACTIONS_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/interactions";

export interface ConversationStep {
  type: "user_input" | "model_output" | "thought";
  content?: Array<{ type: string; text?: string }>;
  signature?: string;
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

interface GeminiClarificationChatProps {
  activeProjectContext?: string;
}

export function GeminiClarificationChat({
  activeProjectContext,
}: GeminiClarificationChatProps) {
  // Initial input state (shown on page load)
  const [initialQuery, setInitialQuery] = useState("");
  // Follow-up input state (inside revealed chatbox)
  const [followupQuery, setFollowupQuery] = useState("");

  // Controls whether the main chatbox container is revealed (hidden initially)
  const [isChatboxRevealed, setIsChatboxRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Generating response with Gemini..."
  );
  const [error, setError] = useState<string | null>(null);

  // Optional live API key override in browser UI (defaults to YOUR_API_KEY_HERE)
  const [apiKey, setApiKey] = useState<string>(DEFAULT_API_KEY);
  const [showKeyInput, setShowKeyInput] = useState(false);

  /**
   * Context Retention:
   * Array of conversation history steps (`user_input`, `thought`, `model_output`)
   * sent with every new API request so the AI remembers previous context.
   */
  const [conversationHistory, setConversationHistory] = useState<
    ConversationStep[]
  >([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const chatHistoryRef = useRef<HTMLDivElement | null>(null);
  const followupInputRef = useRef<HTMLInputElement | null>(null);

  const systemInstruction = activeProjectContext
    ? `You are the HackForge Gemini AI Architect Co-Pilot. The user is working on: "${activeProjectContext}". Provide clear, structured technical answers and directly address all follow-up clarifications using the retained conversation history.`
    : "You are the HackForge Gemini AI Architect Co-Pilot. Provide clear, structured answers to technical, product, and hackathon architecture questions, and directly address all follow-up clarifications using the retained conversation history.";

  // Auto-scroll chat history when new messages arrive
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  function extractReplyFromSteps(steps: ConversationStep[]): string {
    if (!Array.isArray(steps)) return "";
    const parts: string[] = [];
    for (const step of steps) {
      if (step.type === "model_output" && Array.isArray(step.content)) {
        for (const item of step.content) {
          if (item.type === "text" && item.text) {
            parts.push(item.text);
          }
        }
      }
    }
    return parts.join("\n").trim();
  }

  /**
   * Sends the full conversationHistory array + new user prompt to Gemini.
   * Uses direct browser REST call if the user replaced YOUR_API_KEY_HERE,
   * or falls back to /api/chat so the deployed website always works seamlessly.
   */
  async function sendQueryToGemini(userPrompt: string): Promise<string> {
    const userStep: ConversationStep = {
      type: "user_input",
      content: [{ type: "text", text: userPrompt }],
    };

    const updatedRequestHistory: ConversationStep[] = [
      ...conversationHistory,
      userStep,
    ];

    const hasCustomClientKey =
      apiKey &&
      apiKey.trim() !== "" &&
      apiKey.trim() !== "YOUR_API_KEY_HERE";

    if (hasCustomClientKey) {
      // Direct REST call to Gemini Interactions API with client key
      const response = await fetch(INTERACTIONS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey.trim(),
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          system_instruction: systemInstruction,
          store: false,
          input: updatedRequestHistory,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData?.error?.message ||
            `Gemini API request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      const modelSteps: ConversationStep[] = Array.isArray(data.steps)
        ? data.steps
        : [];
      const replyText =
        data.output_text ||
        extractReplyFromSteps(modelSteps) ||
        "No text response returned.";

      setConversationHistory([...updatedRequestHistory, ...modelSteps]);
      return replyText;
    }

    // Server route handler (/api/chat) using server GEMINI_API_KEY or contextual studio engine
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        history: updatedRequestHistory,
        system_instruction: systemInstruction,
        api_key: apiKey,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(
        errData?.error || `Request failed with status ${res.status}`
      );
    }

    const data = await res.json();
    const modelSteps: ConversationStep[] = Array.isArray(data.steps)
      ? data.steps
      : [
          {
            type: "model_output",
            content: [{ type: "text", text: data.output_text || "" }],
          },
        ];
    const replyText =
      data.output_text ||
      extractReplyFromSteps(modelSteps) ||
      "No text response returned.";

    setConversationHistory([...updatedRequestHistory, ...modelSteps]);
    return replyText;
  }

  /**
   * 1. First Interaction:
   * Submit initial query -> show loading state -> fetch Gemini response -> unhide chatbox UI
   */
  async function handleInitialSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = initialQuery.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    setIsLoading(true);
    setLoadingMessage("Thinking through your initial query with Gemini...");

    try {
      const aiAnswer = await sendQueryToGemini(trimmed);

      // Populate chat history with the user's initial prompt and AI's answer
      setMessages([
        { role: "user", text: trimmed },
        { role: "model", text: aiAnswer },
      ]);

      // Reveal the chatbox UI only after the first AI response is generated
      setIsChatboxRevealed(true);

      setTimeout(() => {
        followupInputRef.current?.focus();
      }, 100);
    } catch (err: any) {
      setError(
        err.message || "Failed to generate response. Check your Gemini API key."
      );
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * 2. Follow-up Clarifications:
   * Send follow-up question along with the full conversationHistory array
   */
  async function handleFollowupSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = followupQuery.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    setFollowupQuery("");
    // Append user's follow-up prompt to the chat UI immediately
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setIsLoading(true);
    setLoadingMessage("Clarifying with retained conversation context...");

    try {
      const aiClarification = await sendQueryToGemini(trimmed);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: aiClarification },
      ]);
    } catch (err: any) {
      setError(err.message || "Failed to fetch follow-up clarification.");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        followupInputRef.current?.focus();
      }, 60);
    }
  }

  function handleResetConversation() {
    setConversationHistory([]);
    setMessages([]);
    setInitialQuery("");
    setFollowupQuery("");
    setError(null);
    setIsChatboxRevealed(false);
  }

  const userTurnCount = conversationHistory.filter(
    (s) => s.type === "user_input"
  ).length;

  return (
    <section
      id="gemini-chatbox"
      className="section-wrap py-12"
      aria-labelledby="gemini-chatbox-heading"
    >
      {/* Double-Bezel Outer Hardware Shell */}
      <div className="rounded-[28px] p-1.5 bg-[#463c2b]/[0.05] ring-1 ring-[#463c2b]/10 shadow-[0_24px_64px_rgba(41,39,32,0.10)]">
        <div className="rounded-[22px] border border-[#cfc4b2] bg-[#fffdf8] p-6 sm:p-9 shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
          {/* Top Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#e6dec8]">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-[#394b3f] text-[#fffdf8] inline-flex items-center justify-center font-serif font-bold text-sm">
                G
              </span>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#80643d] block">
                  GEMINI 3.8 FLASH · INTERACTIVE CLARIFICATION STUDIO
                </span>
                <h2
                  id="gemini-chatbox-heading"
                  className="font-serif text-2xl sm:text-3xl font-bold text-[#292720] leading-tight"
                >
                  Ask Gemini AI Co-Pilot
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowKeyInput((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#f7f4ed] border border-[#d8cfc0] text-[#5e5a50] hover:border-[#80643d] transition-colors"
                title="Configure your Gemini API Key (optional)"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#80643d]" />
                <span>
                  {apiKey !== DEFAULT_API_KEY && apiKey.trim() !== ""
                    ? "API Key Active"
                    : "API Key"}
                </span>
              </button>

              {isChatboxRevealed && (
                <button
                  type="button"
                  onClick={handleResetConversation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-[#f7f4ed] border border-[#d8cfc0] text-[#5e5a50] hover:text-[#292720] transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>New Topic</span>
                </button>
              )}
            </div>
          </div>

          {/* Optional Collapsible API Key Input Bar */}
          {showKeyInput && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#f7f4ed] border border-[#d8cfc0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label
                htmlFor="gemini-api-key-input"
                className="font-mono text-[11px] text-[#5e5a50]"
              >
                GEMINI API KEY (Default placeholder:{" "}
                <code className="text-[#80643d] font-bold">
                  YOUR_API_KEY_HERE
                </code>
                ):
              </label>
              <input
                id="gemini-api-key-input"
                type="password"
                value={apiKey === DEFAULT_API_KEY ? "" : apiKey}
                onChange={(e) =>
                  setApiKey(e.target.value || DEFAULT_API_KEY)
                }
                placeholder="YOUR_API_KEY_HERE (or leave blank for studio engine)"
                className="sm:w-80 px-3 py-1.5 text-xs font-mono bg-[#fffdf8] border border-[#c9b99d] rounded-lg text-[#292720] focus:outline-none focus:border-[#394b3f]"
              />
            </div>
          )}

          {/* ================= 1. INITIAL STATE: Prominent Input + Submit Button ================= */}
          {!isChatboxRevealed && (
            <div className="mt-5 space-y-4">
              <p className="text-sm text-[#5e5a50] text-pretty">
                Ask any question about your hackathon idea, database schema, API
                endpoints, or pitch strategy. Once your first answer is
                generated, the full multi-turn clarification chatbox will
                unlock.
              </p>

              <form
                onSubmit={handleInitialSubmit}
                className="flex flex-col sm:flex-row gap-2.5"
              >
                <input
                  type="text"
                  value={initialQuery}
                  onChange={(e) => setInitialQuery(e.target.value)}
                  disabled={isLoading}
                  placeholder="Ask your first question (e.g., How should I structure the PostgreSQL schema and FastAPI routes?)..."
                  required
                  className="flex-1 px-4 py-3.5 text-sm bg-[#f7f4ed] border border-[#d4c9b8] rounded-xl text-[#292720] placeholder:text-[#857f72] focus:outline-none focus:bg-[#fffdf8] focus:border-[#394b3f] transition-colors"
                />
                <button
                  type="submit"
                  disabled={isLoading || !initialQuery.trim()}
                  className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#394b3f] hover:bg-[#2d3c32] active:scale-[0.98] disabled:opacity-60 text-[#fffdf8] font-semibold text-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] pr-3"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit</span>
                      <span
                        aria-hidden="true"
                        className="w-6 h-6 rounded-full bg-white/15 inline-flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      >
                        ↗
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Loading State Indicator */}
          {isLoading && (
            <div
              className="mt-4 inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#f5ede0] border border-[#dfd2be] text-xs font-mono text-[#80643d]"
              aria-live="polite"
            >
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{loadingMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div
              className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* ================= 2. REVEALED CHATBOX UI (Completely hidden on initial load) ================= */}
          <div
            hidden={!isChatboxRevealed}
            className={`${
              isChatboxRevealed ? "flex" : "hidden"
            } flex-col gap-4 mt-6 pt-5 border-t border-[#e6dec8] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]`}
            aria-label="Gemini Follow-up Clarification Chatbox"
          >
            {/* Context Retention Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dbe8dd] text-[#394b3f] font-mono text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Context Retained · Follow-up Clarifications Enabled
              </span>
              <span className="font-mono text-[11px] text-[#726d62] tabular-nums">
                {userTurnCount} {userTurnCount === 1 ? "turn" : "turns"} (
                {conversationHistory.length} steps) in memory
              </span>
            </div>

            {/* Conversational Chat History Area */}
            <div
              ref={chatHistoryRef}
              role="log"
              aria-live="polite"
              className="flex flex-col gap-3.5 max-h-[420px] overflow-y-auto p-4 sm:p-5 rounded-2xl bg-[#f7f4ed] border border-[#d8cfc0] scroll-smooth"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col gap-1 max-w-[88%] ${
                    msg.role === "user"
                      ? "self-end items-end"
                      : "self-start items-start"
                  }`}
                >
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#726d62] px-1">
                    {msg.role === "user" ? "You" : "Gemini 3.8 Flash"}
                  </span>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                      msg.role === "user"
                        ? "bg-[#394b3f] text-[#fffdf8] rounded-br-xs shadow-xs"
                        : "bg-[#fffdf8] text-[#292720] border border-[#d8cfc0] rounded-bl-xs shadow-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Follow-up Input Field */}
            <form
              onSubmit={handleFollowupSubmit}
              className="flex flex-col sm:flex-row gap-2.5 pt-1"
            >
              <div className="relative flex-1 flex items-center">
                <MessageSquare className="w-4 h-4 text-[#80643d] absolute left-3.5 pointer-events-none" />
                <input
                  ref={followupInputRef}
                  type="text"
                  value={followupQuery}
                  onChange={(e) => setFollowupQuery(e.target.value)}
                  disabled={isLoading}
                  placeholder="Ask a follow-up question to clarify the AI's answer..."
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm bg-[#f7f4ed] border border-[#d4c9b8] rounded-xl text-[#292720] placeholder:text-[#857f72] focus:outline-none focus:bg-[#fffdf8] focus:border-[#394b3f] transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !followupQuery.trim()}
                className="group inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#80643d] hover:bg-[#68512f] active:scale-[0.98] disabled:opacity-60 text-[#fffdf8] font-mono text-xs font-bold uppercase tracking-wider transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Clarifying...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    <span>Ask Follow-up</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
