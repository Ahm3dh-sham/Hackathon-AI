"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Loader2,
  Send,
  Sparkles,
  KeyRound,
  RotateCcw,
  MessageSquare,
  Bot,
  User,
} from "lucide-react";

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
  /** When the user submits their first prompt in the Hero studio, auto-populate and reveal the chatbox */
  seededInitialPrompt?: string;
  seededInitialAnswer?: string;
  embedded?: boolean;
}

export function GeminiClarificationChat({
  activeProjectContext,
  seededInitialPrompt,
  seededInitialAnswer,
  embedded = false,
}: GeminiClarificationChatProps) {
  // Initial input state (shown on page load before first response)
  const [initialQuery, setInitialQuery] = useState("");
  // Follow-up input state (inside revealed chatbox at the bottom)
  const [followupQuery, setFollowupQuery] = useState("");

  // Initial State: main chatbox container MUST be completely hidden on page load
  const [isChatboxRevealed, setIsChatboxRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(
    "Generating response with Gemini..."
  );
  const [error, setError] = useState<string | null>(null);

  // Clearly marked API key state (defaults to YOUR_API_KEY_HERE)
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
  const lastSeededAnswerRef = useRef<string | undefined>(undefined);

  const systemInstruction = activeProjectContext
    ? `You are the HackForge Gemini AI Architect Co-Pilot. The user's project context is: "${activeProjectContext}". Maintain full context from previous turns and provide clear, actionable technical and product clarifications.`
    : "You are the HackForge Gemini AI Architect Co-Pilot. Maintain full context from previous turns and provide clear, structured answers to technical, product, and hackathon architecture questions.";

  // When a first AI response is generated in the Hero Blueprint Studio, reveal the chatbox with that initial Q&A
  useEffect(() => {
    if (
      seededInitialPrompt &&
      seededInitialAnswer &&
      seededInitialAnswer !== lastSeededAnswerRef.current
    ) {
      lastSeededAnswerRef.current = seededInitialAnswer;

      const firstUserStep: ConversationStep = {
        type: "user_input",
        content: [{ type: "text", text: seededInitialPrompt }],
      };
      const firstModelStep: ConversationStep = {
        type: "model_output",
        content: [{ type: "text", text: seededInitialAnswer }],
      };

      setConversationHistory([firstUserStep, firstModelStep]);
      setMessages([
        { role: "user", text: seededInitialPrompt },
        { role: "model", text: seededInitialAnswer },
      ]);
      setIsChatboxRevealed(true);
    }
  }, [seededInitialPrompt, seededInitialAnswer]);

  // Auto-scroll chat history when new messages arrive
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages, isLoading, isChatboxRevealed]);

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
   * Sends the accumulated conversationHistory array + new user prompt to Gemini.
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

    // Calls /api/chat (uses server GEMINI_API_KEY or built-in contextual multi-turn engine)
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
   * Submit initial query -> show loading state -> call Gemini API -> reveal chatbox UI
   */
  async function handleInitialSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = initialQuery.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    setIsLoading(true);
    setLoadingMessage("Calling Gemini API & generating first response...");

    try {
      const aiAnswer = await sendQueryToGemini(trimmed);

      // Display the user's initial prompt and the AI's answer inside the chat interface
      setMessages([
        { role: "user", text: trimmed },
        { role: "model", text: aiAnswer },
      ]);

      // Unhide the chatbox UI as soon as the first AI response is generated
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
    setLoadingMessage("Clarifying with retained conversation history...");

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

  const contentCard = (
    <div className="rounded-[22px] border border-[#cfc4b2] bg-[#fffdf8] p-6 sm:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.85)]">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#e6dec8]">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-[#394b3f] text-[#fffdf8] inline-flex items-center justify-center font-serif font-bold text-base shadow-xs">
            G
          </span>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#80643d] block">
              GEMINI AI · CONTEXTUAL CLARIFICATION CHATBOX
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#292720] leading-tight">
              {isChatboxRevealed
                ? "Clarify & Refine Your Answer"
                : "Ask Gemini AI a Question"}
            </h3>
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
                ? "Custom Key Active"
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
              <span>Reset Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapsible API Key Bar */}
      {showKeyInput && (
        <div className="mt-4 p-3.5 rounded-xl bg-[#f7f4ed] border border-[#d8cfc0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label
            htmlFor="gemini-api-key-input"
            className="font-mono text-[11px] text-[#5e5a50]"
          >
            GEMINI API KEY (Placeholder:{" "}
            <code className="text-[#80643d] font-bold">YOUR_API_KEY_HERE</code>
            ):
          </label>
          <input
            id="gemini-api-key-input"
            type="password"
            value={apiKey === DEFAULT_API_KEY ? "" : apiKey}
            onChange={(e) => setApiKey(e.target.value || DEFAULT_API_KEY)}
            placeholder="Paste Gemini API Key (or leave blank for studio engine)"
            className="sm:w-80 px-3 py-1.5 text-xs font-mono bg-[#fffdf8] border border-[#c9b99d] rounded-lg text-[#292720] focus:outline-none focus:border-[#394b3f]"
          />
        </div>
      )}

      {/* ================= 1. INITIAL STATE: ONLY Prominent Input Field + Submit Button ================= */}
      {!isChatboxRevealed && (
        <div className="mt-5 space-y-3">
          <p className="text-sm text-[#5e5a50]">
            Submit your first question below. As soon as Gemini generates the
            response, the interactive clarification chatbox will unhide.
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
              placeholder="Ask anything (e.g., How should I design the database schema and API routes for my idea?)..."
              required
              className="flex-1 px-4 py-3.5 text-sm bg-[#f7f4ed] border border-[#c9b99d] rounded-xl text-[#292720] placeholder:text-[#857f72] focus:outline-none focus:bg-[#fffdf8] focus:border-[#394b3f] transition-colors"
            />
            <button
              type="submit"
              disabled={isLoading || !initialQuery.trim()}
              className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#394b3f] hover:bg-[#2d3c32] active:scale-[0.98] disabled:opacity-60 text-[#fffdf8] font-semibold text-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
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

      {/* Loading Indicator */}
      {isLoading && (
        <div
          className="mt-4 inline-flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#f5ede0] border border-[#dfd2be] text-xs font-mono text-[#80643d]"
          aria-live="polite"
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{loadingMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* ================= 2. REVEALED CHATBOX UI (Completely hidden until first AI response arrives) ================= */}
      {isChatboxRevealed && (
        <div
          className="flex flex-col gap-4 mt-5 pt-4 border-t border-[#e6dec8] animate-in fade-in slide-in-from-bottom-2 duration-300"
          aria-label="Gemini Follow-up Clarification Chatbox"
        >
          {/* Context Retention Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dbe8dd] text-[#394b3f] font-mono text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Chatbox Unlocked · Context Memory Active
            </span>
            <span className="font-mono text-[11px] text-[#726d62] tabular-nums">
              {userTurnCount} {userTurnCount === 1 ? "turn" : "turns"} (
              {conversationHistory.length} steps) retained in history
            </span>
          </div>

          {/* Conversational Chat History Area */}
          <div
            ref={chatHistoryRef}
            role="log"
            aria-live="polite"
            className="flex flex-col gap-4 max-h-[420px] overflow-y-auto p-4 sm:p-5 rounded-2xl bg-[#f7f4ed] border border-[#d8cfc0] scroll-smooth"
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col gap-1.5 max-w-[90%] ${
                  msg.role === "user"
                    ? "self-end items-end"
                    : "self-start items-start"
                }`}
              >
                <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#726d62] px-1">
                  {msg.role === "user" ? (
                    <>
                      <User className="w-3 h-3 text-[#394b3f]" /> You
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 text-[#80643d]" /> Gemini AI
                    </>
                  )}
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

          {/* Follow-up Clarification Input Field at the Bottom */}
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
                className="w-full pl-10 pr-4 py-3.5 text-sm bg-[#f7f4ed] border border-[#c9b99d] rounded-xl text-[#292720] placeholder:text-[#857f72] focus:outline-none focus:bg-[#fffdf8] focus:border-[#394b3f] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !followupQuery.trim()}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#80643d] hover:bg-[#68512f] active:scale-[0.98] disabled:opacity-60 text-[#fffdf8] font-mono text-xs font-bold uppercase tracking-wider transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
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
      )}
    </div>
  );

  if (embedded) {
    return <div id="gemini-chatbox-embedded">{contentCard}</div>;
  }

  return (
    <section
      id="gemini-chatbox"
      className="section-wrap py-10"
      aria-labelledby="gemini-chatbox-heading"
    >
      <div className="rounded-[28px] p-1.5 bg-[#463c2b]/[0.05] ring-1 ring-[#463c2b]/10 shadow-[0_24px_64px_rgba(41,39,32,0.10)]">
        {contentCard}
      </div>
    </section>
  );
}
