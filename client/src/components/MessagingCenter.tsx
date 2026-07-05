import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageCircle, User, Plus } from "lucide-react";

interface Message {
  id: number;
  sender: string;
  senderRole: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: number;
  participant: string;
  role: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    participant: "Sarah Johnson",
    role: "ECM (Employment Counselor)",
    lastMessage: "Great job on the interview! Let's schedule a follow-up.",
    lastMessageTime: "2026-07-03 2:30 PM",
    unreadCount: 0,
    messages: [
      {
        id: 1,
        sender: "Sarah Johnson",
        senderRole: "ECM",
        content: "Hi! How did the job interview go?",
        timestamp: "2026-07-03 1:15 PM",
        read: true,
      },
      {
        id: 2,
        sender: "Client",
        senderRole: "Client",
        content: "Really well! They said they'll call me back by Friday.",
        timestamp: "2026-07-03 1:45 PM",
        read: true,
      },
      {
        id: 3,
        sender: "Sarah Johnson",
        senderRole: "ECM",
        content: "Great job on the interview! Let's schedule a follow-up.",
        timestamp: "2026-07-03 2:30 PM",
        read: true,
      },
    ],
  },
  {
    id: 2,
    participant: "Dr. Michael Chen",
    role: "Mental Health Counselor",
    lastMessage: "See you next Thursday at 10 AM",
    lastMessageTime: "2026-07-02 4:00 PM",
    unreadCount: 1,
    messages: [
      {
        id: 1,
        sender: "Dr. Michael Chen",
        senderRole: "Counselor",
        content: "How are you feeling this week?",
        timestamp: "2026-07-02 3:30 PM",
        read: true,
      },
      {
        id: 2,
        sender: "Dr. Michael Chen",
        senderRole: "Counselor",
        content: "See you next Thursday at 10 AM",
        timestamp: "2026-07-02 4:00 PM",
        read: false,
      },
    ],
  },
  {
    id: 3,
    participant: "Jennifer Martinez",
    role: "Housing Provider",
    lastMessage: "Your lease is ready for signature",
    lastMessageTime: "2026-06-28 10:00 AM",
    unreadCount: 0,
    messages: [
      {
        id: 1,
        sender: "Jennifer Martinez",
        senderRole: "Housing",
        content: "Your lease is ready for signature",
        timestamp: "2026-06-28 10:00 AM",
        read: true,
      },
    ],
  },
];

interface MessagingCenterProps {
  clientId: number;
}

export default function MessagingCenter({ clientId }: MessagingCenterProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(DEMO_CONVERSATIONS[0]);
  const [newMessage, setNewMessage] = useState("");
  const totalUnread = DEMO_CONVERSATIONS.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Messaging</h3>
          <p className="text-xs text-gray-500 mt-1">{totalUnread} unread message(s)</p>
        </div>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-1" />New Message
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Conversations List */}
        <div className="md:col-span-1 space-y-2">
          <h4 className="text-sm font-semibold text-gray-900 px-2">Conversations</h4>
          {DEMO_CONVERSATIONS.map(conv => (
            <Card
              key={conv.id}
              className={`border-0 shadow-sm cursor-pointer hover:shadow-md transition-all ${
                selectedConversation?.id === conv.id ? "ring-2 ring-teal-500" : ""
              }`}
              onClick={() => setSelectedConversation(conv)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{conv.participant}</h4>
                      {conv.unreadCount > 0 && (
                        <Badge className="bg-teal-100 text-teal-700 text-xs">{conv.unreadCount}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{conv.role}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600 truncate">{conv.lastMessage}</p>
                <p className="text-xs text-gray-400 mt-1">{conv.lastMessageTime}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Message Thread */}
        <div className="md:col-span-2">
          {selectedConversation ? (
            <Card className="border-0 shadow-sm h-full flex flex-col">
              {/* Header */}
              <CardContent className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConversation.participant}</h3>
                    <p className="text-xs text-gray-500">{selectedConversation.role}</p>
                  </div>
                </div>
              </CardContent>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "Client" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === "Client"
                          ? "bg-teal-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender === "Client" ? "text-teal-100" : "text-gray-500"}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <CardContent className="p-4 border-t space-y-3">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-20"
                />
                <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white">
                  <Send className="w-4 h-4 mr-2" />Send Message
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm h-full flex items-center justify-center">
              <CardContent className="text-center">
                <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-600">Select a conversation to view messages</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
