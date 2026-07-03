import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ArrowLeft, Send, Heart, AlertTriangle, Loader2 } from "lucide-react";


export default function Counselor() {
  const [, navigate] = useLocation();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: history = [], refetch } = trpc.counselor.getChatHistory.useQuery();
  const sendMsg = trpc.counselor.chat.useMutation({ onSuccess: () => { refetch(); } });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, sendMsg.isPending]);

  const handleSend = () => {
    if (!input.trim() || sendMsg.isPending) return;
    const msg = input.trim();
    setInput("");
    sendMsg.mutate({ message: msg });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="gradient-hero text-white py-4 px-4 flex-shrink-0">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")} className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <p className="font-display font-bold">AI Counselor</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse-soft" />
              <p className="text-white/70 text-xs">Here for you, 24/7</p>
            </div>
          </div>
        </div>
      </div>

      {/* Crisis Banner */}
      <div className="bg-brand-rose/10 border-b border-brand-rose/20 px-4 py-2 flex-shrink-0">
        <div className="max-w-lg mx-auto flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-brand-rose flex-shrink-0" />
          <p className="text-xs text-brand-rose">
            In crisis? Call or text <strong>988</strong> · Text HOME to <strong>741741</strong>
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-lg mx-auto space-y-4">
          {(history as any[]).length === 0 && !sendMsg.isPending && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full gradient-brand flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-display font-bold text-xl text-foreground mb-2">I'm here for you</h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                This is a safe, judgment-free space. Share what's on your mind — I'm listening.
              </p>
              <div className="mt-6 space-y-2">
                {["I'm feeling overwhelmed today", "I need help staying motivated", "I'm struggling with my recovery", "I just need someone to talk to"].map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => { setInput(prompt); }}
                    className="block w-full text-left px-4 py-3 rounded-xl bg-secondary hover:bg-brand-teal/10 hover:text-brand-teal text-sm text-foreground transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(history as any[]).map((msg: any) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                  <Heart className="w-4 h-4 text-white" />
                </div>
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
                {msg.crisisDetected && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-brand-rose">
                    <AlertTriangle className="w-3 h-3" /> Crisis resources included
                  </div>
                )}
              </div>
            </div>
          ))}

          {sendMsg.isPending && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                <Heart className="w-4 h-4 text-white" />
              </div>
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
      <div className="flex-shrink-0 border-t border-border bg-background px-4 py-3 safe-area-bottom">
        <div className="max-w-lg mx-auto flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Share what's on your mind..."
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
        <p className="text-center text-xs text-muted-foreground mt-2">
          Not a replacement for professional mental health care.
        </p>
      </div>
    </div>
  );
}
