import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { ArrowLeft, Send, Plus, MessageSquare, User, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const ROLE_LABELS: Record<string, string> = {
  user: "Client", case_manager: "Case Manager", ecm_worker: "ECM Worker",
  probation_officer: "Probation Officer", counselor: "Counselor", org_admin: "Org Admin", admin: "Admin"
};

export default function Messaging() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [showNewThread, setShowNewThread] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newInitialMsg, setNewInitialMsg] = useState("");
  const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: threads = [], refetch: refetchThreads } = trpc.messaging.getThreads.useQuery(undefined, { enabled: isAuthenticated, refetchInterval: 10000 });
  const { data: messages = [], refetch: refetchMessages } = trpc.messaging.getMessages.useQuery(
    { threadId: selectedThreadId! },
    { enabled: !!selectedThreadId, refetchInterval: 5000 }
  );
  const { data: providerClients = [] } = trpc.messaging.getProviderClients.useQuery(undefined, { enabled: isAuthenticated });

  const sendMutation = trpc.messaging.sendMessage.useMutation({
    onSuccess: () => { setNewMessage(""); refetchMessages(); refetchThreads(); },
    onError: (e) => toast.error(e.message),
  });

  const createThreadMutation = trpc.messaging.createThread.useMutation({
    onSuccess: (data) => {
      setShowNewThread(false); setNewSubject(""); setNewInitialMsg("");
      setSelectedThreadId(data.threadId);
      refetchThreads();
      toast.success("Conversation started");
    },
    onError: (e) => toast.error(e.message),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedThread = threads.find((t: any) => t.id === selectedThreadId);

  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Please sign in to view messages.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">Messages</h1>
            <p className="text-xs text-muted-foreground">Secure communications with your support team</p>
          </div>
          <Button size="sm" onClick={() => setShowNewThread(true)} className="bg-teal-600 hover:bg-teal-700 text-white gap-1">
            <Plus className="w-4 h-4" /> New
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full flex-1 flex gap-0 md:gap-4 p-0 md:p-4">
        {/* Thread list */}
        <div className={`w-full md:w-72 bg-white md:rounded-xl border flex-shrink-0 flex flex-col ${selectedThreadId ? "hidden md:flex" : "flex"}`}>
          <div className="p-3 border-b">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Conversations ({threads.length})</p>
          </div>
          {threads.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <MessageSquare className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm text-muted-foreground">No conversations yet.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setShowNewThread(true)}>Start a conversation</Button>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y">
              {threads.map((thread: any) => (
                <button key={thread.id} onClick={() => setSelectedThreadId(thread.id)}
                  className={`w-full text-left p-3 hover:bg-gray-50 transition-colors ${selectedThreadId === thread.id ? "bg-teal-50 border-l-2 border-teal-600" : ""}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{thread.subject || "Conversation"}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{thread.lastMessage?.content || "No messages yet"}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {thread.participants?.filter((p: any) => p?.id !== (user as any)?.id).map((p: any) => p?.name || "Unknown").join(", ")}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      {thread.unreadCount > 0 && <Badge className="bg-teal-600 text-white text-xs px-1.5 py-0">{thread.unreadCount}</Badge>}
                      <span className="text-xs text-muted-foreground">{new Date(thread.lastMessageAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message view */}
        <div className={`flex-1 bg-white md:rounded-xl border flex flex-col ${selectedThreadId ? "flex" : "hidden md:flex"}`}>
          {!selectedThreadId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <MessageSquare className="w-12 h-12 text-gray-200 mb-4" />
              <p className="font-medium text-gray-500">Select a conversation</p>
              <p className="text-sm text-muted-foreground mt-1">Choose a conversation from the list or start a new one.</p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="p-3 border-b flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedThreadId(null)}>
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{selectedThread?.subject || "Conversation"}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {selectedThread?.participants?.filter((p: any) => p?.id !== (user as any)?.id).map((p: any) => `${p?.name} (${ROLE_LABELS[p?.role] || p?.role})`).join(", ")}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg: any) => {
                  const isMe = msg.senderUserId === (user as any)?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs lg:max-w-md ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                        {!isMe && <span className="text-xs text-muted-foreground px-1">{msg.sender?.name} · {ROLE_LABELS[msg.sender?.role] || msg.sender?.role}</span>}
                        <div className={`rounded-2xl px-4 py-2.5 text-sm ${isMe ? "bg-teal-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-900 rounded-bl-sm"}`}>
                          {msg.content}
                        </div>
                        <span className="text-xs text-muted-foreground px-1">{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t flex gap-2">
                <Input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && newMessage.trim()) { sendMutation.mutate({ threadId: selectedThreadId, content: newMessage.trim() }); } }}
                  className="flex-1"
                />
                <Button onClick={() => { if (newMessage.trim()) sendMutation.mutate({ threadId: selectedThreadId, content: newMessage.trim() }); }}
                  disabled={!newMessage.trim() || sendMutation.isPending} className="bg-teal-600 hover:bg-teal-700 text-white">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* New Thread Modal */}
      {showNewThread && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-2xl">
            <h3 className="font-bold text-lg mb-4">New Conversation</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Subject (optional)</label>
                <Input value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="e.g., Housing assistance question" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message *</label>
                <textarea value={newInitialMsg} onChange={e => setNewInitialMsg(e.target.value)}
                  placeholder="Write your message..." rows={3}
                  className="w-full border rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              {providerClients.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-1 block">Send to (optional)</label>
                  <select value={selectedRecipientId ?? ""} onChange={e => setSelectedRecipientId(e.target.value ? Number(e.target.value) : null)}
                    className="w-full h-9 border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="">Select a recipient...</option>
                    {(providerClients as any[]).map((c: any) => <option key={c.id} value={c.id}>{c.name} ({c.role})</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowNewThread(false)}>Cancel</Button>
              <Button className="flex-1 bg-teal-600 hover:bg-teal-700 text-white" disabled={!newInitialMsg.trim() || createThreadMutation.isPending}
                onClick={() =>     createThreadMutation.mutate({ subject: newSubject || undefined, participantIds: selectedRecipientId ? [selectedRecipientId] : [], initialMessage: newInitialMsg.trim() })}>
                {createThreadMutation.isPending ? "Sending..." : "Send"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
