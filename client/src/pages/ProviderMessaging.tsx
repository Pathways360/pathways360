import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, MessageCircle, Users, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: number;
  sender: string;
  senderRole: "provider" | "client";
  content: string;
  timestamp: Date;
  read: boolean;
}

interface Conversation {
  id: number;
  clientName: string;
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
  status: "active" | "resolved" | "pending";
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    clientName: "Sarah Johnson",
    lastMessage: "Thanks for the referral to the housing program",
    unreadCount: 2,
    status: "active",
    messages: [
      {
        id: 1,
        sender: "Provider",
        senderRole: "provider",
        content: "Hi Sarah, I wanted to check in on your progress with the housing program.",
        timestamp: new Date(Date.now() - 3600000),
        read: true,
      },
      {
        id: 2,
        sender: "Sarah",
        senderRole: "client",
        content: "Hi! Yes, I met with the housing coordinator yesterday. They're helping me find an apartment.",
        timestamp: new Date(Date.now() - 1800000),
        read: false,
      },
      {
        id: 3,
        sender: "Sarah",
        senderRole: "client",
        content: "Thanks for the referral to the housing program",
        timestamp: new Date(Date.now() - 900000),
        read: false,
      },
    ],
  },
  {
    id: 2,
    clientName: "Michael Chen",
    lastMessage: "Can we reschedule our appointment?",
    unreadCount: 1,
    status: "pending",
    messages: [
      {
        id: 1,
        sender: "Michael",
        senderRole: "client",
        content: "Hi, can we reschedule our appointment?",
        timestamp: new Date(Date.now() - 7200000),
        read: false,
      },
    ],
  },
  {
    id: 3,
    clientName: "Jessica Martinez",
    lastMessage: "Great! See you next Tuesday.",
    unreadCount: 0,
    status: "resolved",
    messages: [
      {
        id: 1,
        sender: "Provider",
        senderRole: "provider",
        content: "Hi Jessica, I wanted to follow up on your employment goals.",
        timestamp: new Date(Date.now() - 86400000),
        read: true,
      },
      {
        id: 2,
        sender: "Jessica",
        senderRole: "client",
        content: "Great! See you next Tuesday.",
        timestamp: new Date(Date.now() - 82800000),
        read: true,
      },
    ],
  },
];

export default function ProviderMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(MOCK_CONVERSATIONS[0]);
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage: Message = {
      id: Math.max(...selectedConversation.messages.map(m => m.id), 0) + 1,
      sender: "Provider",
      senderRole: "provider",
      content: messageText,
      timestamp: new Date(),
      read: true,
    };

    setConversations(prev =>
      prev.map(conv =>
        conv.id === selectedConversation.id
          ? { ...conv, messages: [...conv.messages, newMessage], lastMessage: messageText }
          : conv
      )
    );

    setSelectedConversation(prev =>
      prev ? { ...prev, messages: [...prev.messages, newMessage] } : null
    );

    setMessageText("");
    toast.success("Message sent");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "resolved": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <MessageCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "resolved": return <CheckCircle2 className="w-4 h-4" />;
      default: return null;
    }
  };

  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Provider Messaging</h1>
          <p className="text-gray-600 mt-2">Communicate with your clients and manage conversations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation List */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Conversations
                  {totalUnread > 0 && (
                    <Badge className="ml-auto bg-red-500">{totalUnread}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {conversations.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`w-full text-left p-3 hover:bg-gray-50 transition-colors border-l-4 ${
                        selectedConversation?.id === conv.id
                          ? "bg-blue-50 border-blue-500"
                          : "border-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {conv.clientName}
                          </p>
                          <p className="text-xs text-gray-600 truncate mt-1">
                            {conv.lastMessage}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {conv.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">
                              {conv.unreadCount}
                            </Badge>
                          )}
                          <Badge
                            variant="outline"
                            className={`text-xs flex items-center gap-1 ${getStatusColor(conv.status)}`}
                          >
                            {getStatusIcon(conv.status)}
                            {conv.status}
                          </Badge>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <Card className="border-0 shadow-sm h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedConversation.clientName}</CardTitle>
                      <Badge
                        variant="outline"
                        className={`text-xs mt-2 flex items-center gap-1 w-fit ${getStatusColor(selectedConversation.status)}`}
                      >
                        {getStatusIcon(selectedConversation.status)}
                        {selectedConversation.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.senderRole === "provider" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.senderRole === "provider"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4 space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={e => setMessageText(e.target.value)}
                      onKeyPress={e => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">Press Enter to send, Shift+Enter for new line</p>
                </div>
              </Card>
            ) : (
              <Card className="border-0 shadow-sm h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">Select a conversation to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
