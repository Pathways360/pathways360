import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Send, Settings, Loader2, Sparkles } from "lucide-react";


const AVATAR_LIBRARY: Record<string, { bg: string; initials: string }> = {
  marcus: { bg: "1a6b4a", initials: "MA" },
  diana: { bg: "7c3aed", initials: "DI" },
  james: { bg: "1d4ed8", initials: "JA" },
  rosa: { bg: "be185d", initials: "RO" },
  david: { bg: "b45309", initials: "DA" },
  keisha: { bg: "0f766e", initials: "KE" },
  carlos: { bg: "dc2626", initials: "CA" },
  grace: { bg: "6d28d9", initials: "GR" },
  tyrone: { bg: "0369a1", initials: "TY" },
  maria: { bg: "c2410c", initials: "MA" },
  pastor: { bg: "064e3b", initials: "PR" },
  coach: { bg: "1e3a5f", initials: "CS" },
};

function getAvatarUrl(id: string) {
  const a = AVATAR_LIBRARY[id] || AVATAR_LIBRARY.marcus;
  return `https://ui-avatars.com/api/?name=${a.initials}&background=${a.bg}&color=ffffff&size=128&bold=true&rounded=true`;
}

export default function Coach() {
  const [, navigate] = useLocation();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: settings } = trpc.coach.getSettings.useQuery();
  const { data: history = [], refetch } = trpc.coach.getChatHistory.useQuery();
  const sendMsg = trpc.coach.chat.useMutation({ onSuccess: () => { refetch(); } });

  const coachName = settings?.coachName || "Alex";
  const avatarUrl = settings?.avatarLibraryId ? getAvatarUrl(settings.avatarLibraryId) : getAvatarUrl("marcus");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, sendMsg.isPending]);

  const handleSend = () => {
    if (!input.trim() || sendMsg.isPending) return;
    const msg = input.trim();
    setInput("");
    sendMsg.mutate({ message: msg });
  };

  const QUICK_PROMPTS = [
    `I need some motivation today`,
    `Help me stay on track with my goals`,
    `I'm feeling stuck, what should I do?`,
    `Give me a pep talk`,
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero text-white py-4 px-4 flex-shrink-0">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <img src={avatarUrl} alt={coachName} className="w-10 h-10 rounded-full border-2 border-white/30" />
          <div className="flex-1">
            <p className="font-display font-bold">{coachName}</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse-soft" />
              <p className="text-white/70 text-xs">Your Life Coach</p>
            </div>
          </div>
          <button onClick={() => navigate("/coach-setup")} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-lg mx-auto space-y-4">
          {(history as any[]).length === 0 && !sendMsg.isPending && (
            <div className="text-center py-8">
              <img src={avatarUrl} alt={coachName} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-brand-teal/20" />
              <h2 className="font-display font-bold text-xl text-foreground mb-2">Hey, I'm {coachName}!</h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
                I'm your personal life coach. I'm here to guide you, encourage you, and help you reach your goals — one step at a time.
              </p>
              <div className="space-y-2">
                {QUICK_PROMPTS.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="block w-full text-left px-4 py-3 rounded-xl bg-secondary hover:bg-brand-teal/10 hover:text-brand-teal text-sm text-foreground transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 inline mr-2 text-brand-teal" />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(history as any[]).map((msg: any) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <img src={avatarUrl} alt={coachName} className="w-8 h-8 rounded-full flex-shrink-0 mr-2 mt-1" />
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === "user"
                  ? "gradient-brand text-white rounded-br-sm"
                  : "bg-card border border-border text-foreground rounded-bl-sm"
              }`}>
                {msg.role === "assistant" ? (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <p className="text-sm">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

          {sendMsg.isPending && (
            <div className="flex justify-start">
              <img src={avatarUrl} alt={coachName} className="w-8 h-8 rounded-full flex-shrink-0 mr-2 mt-1" />
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-brand-teal animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-brand-teal animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-brand-teal animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-border bg-background px-4 py-3">
        <div className="max-w-lg mx-auto flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={`Talk to ${coachName}...`}
            className="flex-1 bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || sendMsg.isPending}
            className="w-12 h-12 rounded-xl gradient-brand text-white border-0 flex-shrink-0"
          >
            {sendMsg.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
