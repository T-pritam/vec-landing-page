"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const PRODUCTS = [
  "Solar",
  "Batteries",
  "Reverse Cycle Aircon",
  "Ducted Aircon",
  "Heat Pump",
  "Distillo Water Filtration",
];

type Msg = { from: "bot" | "user"; text: string; time: string };

function timeNow() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const WA_PATH =
  "M16.004 2.002a13.94 13.94 0 0 0-11.86 21.36L2 30l6.84-2.1A13.94 13.94 0 1 0 16.004 2.002Zm0 25.54a11.56 11.56 0 0 1-5.9-1.62l-.42-.25-4.37 1.34 1.18-4.3-.28-.44a11.6 11.6 0 1 1 9.79 5.27Zm6.34-8.68c-.35-.17-2.06-1.02-2.38-1.14-.32-.11-.55-.17-.78.18-.23.35-.9 1.14-1.1 1.37-.2.23-.41.26-.76.09-.35-.18-1.47-.54-2.8-1.73-1.04-.92-1.73-2.06-1.94-2.41-.2-.35-.02-.54.15-.71.16-.16.35-.41.52-.62.18-.2.23-.35.35-.58.12-.23.06-.44-.03-.61-.09-.18-.78-1.88-1.07-2.57-.28-.68-.57-.58-.78-.6h-.67c-.23 0-.61.09-.93.44-.32.35-1.22 1.2-1.22 2.92 0 1.72 1.25 3.39 1.42 3.62.18.23 2.46 3.75 5.96 5.26.83.36 1.48.58 1.99.74.84.27 1.6.23 2.2.14.67-.1 2.06-.84 2.35-1.66.29-.82.29-1.52.2-1.66-.08-.15-.32-.23-.67-.41Z";

function WaIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d={WA_PATH} fill="#fff" />
    </svg>
  );
}

function TypingDots() {
  return (
    <div className="flex items-start gap-2.5" style={{ animation: "wa-fade-in 200ms ease-out" }}>
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{ background: "#3D913C" }}
      >
        <WaIcon className="h-3.5 w-3.5" />
      </div>
      <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="wa-dot h-2 w-2 rounded-full bg-gray-400" style={{ animationDelay: "0ms" }} />
          <span className="wa-dot h-2 w-2 rounded-full bg-gray-400" style={{ animationDelay: "150ms" }} />
          <span className="wa-dot h-2 w-2 rounded-full bg-gray-400" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

export function WhatsAppFAB() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [suburb, setSuburb] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [owner, setOwner] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  const addBot = useCallback(
    (text: string) => {
      setMessages((prev) => [...prev, { from: "bot", text, time: timeNow() }]);
      setTimeout(scrollBottom, 50);
    },
    [scrollBottom],
  );

  const addUser = useCallback(
    (text: string) => {
      setMessages((prev) => [...prev, { from: "user", text, time: timeNow() }]);
      setTimeout(scrollBottom, 50);
    },
    [scrollBottom],
  );

  const showTypingThenBot = useCallback(
    (text: string, cb?: () => void) => {
      setTyping(true);
      setTimeout(scrollBottom, 50);
      setTimeout(() => {
        setTyping(false);
        addBot(text);
        cb?.();
      }, 700);
    },
    [addBot, scrollBottom],
  );

  const reset = () => {
    setStep(0);
    setMessages([]);
    setInput("");
    setName("");
    setSuburb("");
    setSelected([]);
    setOwner("");
    setShowInput(false);
    setTyping(false);
  };

  const handleOpen = () => {
    reset();
    setOpen(true);
    setTimeout(() => {
      showTypingThenBot("Hi there! I'm from AEM Energy. What's your first name?", () => {
        setShowInput(true);
        setStep(1);
      });
    }, 200);
  };

  const handleOpenRef = useRef(handleOpen);
  handleOpenRef.current = handleOpen;

  useEffect(() => {
    const handler = () => handleOpenRef.current();
    window.addEventListener("open-whatsapp-chat", handler);
    return () => window.removeEventListener("open-whatsapp-chat", handler);
  }, []);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const submitName = () => {
    const val = input.trim();
    if (!val) return;
    setName(val);
    addUser(val);
    setInput("");
    setShowInput(false);
    setTimeout(() => {
      showTypingThenBot(`Nice to meet you, ${val}! What suburb are you in?`, () => {
        setShowInput(true);
        setStep(2);
        setTimeout(() => inputRef.current?.focus(), 100);
      });
    }, 200);
  };

  const submitSuburb = () => {
    const val = input.trim();
    if (!val) return;
    setSuburb(val);
    addUser(val);
    setInput("");
    setShowInput(false);
    setTimeout(() => {
      showTypingThenBot("What are you interested in? Tap all that apply.", () => {
        setStep(3);
      });
    }, 200);
  };

  const toggleProduct = (p: string) => {
    setSelected((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  const submitProducts = () => {
    if (selected.length === 0) return;
    addUser(selected.join(", "));
    setStep(3.5);
    setTimeout(() => {
      showTypingThenBot("Last one: do you own your home?", () => {
        setStep(4);
      });
    }, 200);
  };

  const submitOwner = (val: "Yes" | "No") => {
    setOwner(val);
    addUser(val);
    setStep(4.5);
    setTimeout(() => {
      showTypingThenBot(`Thanks ${name}! Tap below to start a WhatsApp chat with our team.`, () => {
        setStep(5);
      });
    }, 200);
  };

  const openWhatsApp = () => {
    const msg = `Hi, I'm ${name} from ${suburb}. Interested in: ${selected.join(", ")}. Home owner: ${owner}.`;
    window.open(`https://wa.me/61434623604?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step === 1) submitName();
      else if (step === 2) submitSuburb();
    }
  };

  useEffect(scrollBottom, [messages, step, typing, scrollBottom]);

  return (
    <>
      {/* FAB — icon-only circle on mobile, pill with label on desktop */}
      {!open && (
        <button
          type="button"
          aria-label="Chat on WhatsApp"
          onClick={handleOpen}
          className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 md:h-auto md:w-auto md:gap-2 md:px-5 md:py-3 xl:bottom-6"
          style={{ background: "#3D913C" }}
        >
          <WaIcon className="h-6 w-6 md:h-5 md:w-5" />
          <span className="hidden text-sm font-semibold text-white md:inline">Chat with us</span>
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center xl:items-end xl:justify-end xl:p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 xl:bg-black/20" onClick={handleClose} />

          {/* Chat card */}
          <div className="relative flex h-[85dvh] w-full flex-col overflow-hidden rounded-t-2xl shadow-2xl xl:mb-0 xl:mr-4 xl:h-[520px] xl:w-[380px] xl:rounded-2xl">
            {/* Header */}
            <div
              className="flex shrink-0 items-center gap-3 px-4"
              style={{ background: "#3D913C", height: 56 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <WaIcon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="block text-[15px] font-semibold text-white">AEM Energy</span>
                <span className="block text-[11px] text-white/70">Online</span>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close chat"
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/20 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4"
              style={{ background: "#ECE5DD" }}
            >
              <div className="flex flex-col gap-4">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.from === "user" ? "justify-end" : "items-start gap-2.5"}`}
                    style={{ animation: "wa-fade-in 200ms ease-out" }}
                  >
                    {m.from === "bot" && (
                      <div
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                        style={{ background: "#3D913C" }}
                      >
                        <WaIcon className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div style={{ maxWidth: "80%" }}>
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 text-[14px] leading-[1.5] ${
                          m.from === "user"
                            ? "rounded-br-md text-white"
                            : "rounded-bl-md bg-white text-gray-900 shadow-sm"
                        }`}
                        style={{
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          ...(m.from === "user" ? { background: "#3D913C" } : {}),
                        }}
                      >
                        {m.text}
                      </div>
                      <p
                        className={`mt-1 text-[11px] text-gray-500 ${
                          m.from === "user" ? "text-right" : ""
                        }`}
                      >
                        {m.time}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {typing && <TypingDots />}

                {/* Product chips */}
                {step === 3 && !typing && (
                  <div
                    className="ml-9 mt-1 flex flex-wrap gap-1.5"
                    style={{ animation: "wa-fade-in 200ms ease-out" }}
                  >
                    {PRODUCTS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => toggleProduct(p)}
                        className={`rounded-full border px-4 py-2 text-[14px] font-medium transition-colors ${
                          selected.includes(p)
                            ? "border-[#3D913C] bg-[#3D913C] text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-[#3D913C]"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    {selected.length > 0 && (
                      <button
                        type="button"
                        onClick={submitProducts}
                        className="mt-2 w-full rounded-xl px-4 py-2.5 text-[14px] font-semibold text-white"
                        style={{ background: "#3D913C" }}
                      >
                        Next
                      </button>
                    )}
                  </div>
                )}

                {/* Owner buttons */}
                {step === 4 && !typing && (
                  <div
                    className="ml-9 mt-1 flex gap-3"
                    style={{ animation: "wa-fade-in 200ms ease-out" }}
                  >
                    {(["Yes", "No"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => submitOwner(opt)}
                        className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-[14px] font-semibold text-gray-900 transition-colors hover:border-[#3D913C] hover:bg-[#3D913C]/5"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* Open WhatsApp */}
                {step === 5 && !typing && (
                  <div className="ml-9 mt-1" style={{ animation: "wa-fade-in 200ms ease-out" }}>
                    <button
                      type="button"
                      onClick={openWhatsApp}
                      className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-semibold text-white"
                      style={{ background: "#25D366" }}
                    >
                      <WaIcon className="h-5 w-5" />
                      Open WhatsApp
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Input bar */}
            {showInput && (step === 1 || step === 2) && (
              <div className="flex shrink-0 items-center gap-2 bg-white px-3 py-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={step === 1 ? "Your first name..." : "Your suburb..."}
                  autoFocus
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-[14px] text-gray-900 outline-none focus:border-[#3D913C]"
                />
                <button
                  type="button"
                  onClick={step === 1 ? submitName : submitSuburb}
                  disabled={!input.trim()}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-40"
                  style={{ background: "#3D913C" }}
                  aria-label="Send"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                    <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes wa-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wa-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        .wa-dot {
          animation: wa-bounce 1.2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
