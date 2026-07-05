import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Lock, Users, Eye, Plus, Trash2, Edit2 } from "lucide-react";

interface Note {
  id: number;
  title: string;
  content: string;
  type: "private" | "shared" | "client_visible";
  author: string;
  date: string;
  lastModified: string;
}

const DEMO_NOTES: Note[] = [
  {
    id: 1,
    title: "Progress Update - Employment",
    content: "Client completed job training program and has 3 interviews scheduled for next week. Showing great motivation and commitment.",
    type: "shared",
    author: "Sarah Johnson (ECM)",
    date: "2026-07-03",
    lastModified: "2026-07-03",
  },
  {
    id: 2,
    title: "Mental Health Assessment",
    content: "Client reports decreased anxiety symptoms. Continuing current medication regimen. Recommend continued therapy sessions.",
    type: "private",
    author: "Dr. Michael Chen",
    date: "2026-07-01",
    lastModified: "2026-07-01",
  },
  {
    id: 3,
    title: "Housing Update",
    content: "Lease signed for new apartment. Move-in date is July 15. Client is excited and stable.",
    type: "client_visible",
    author: "Jennifer Martinez (Housing)",
    date: "2026-06-28",
    lastModified: "2026-06-28",
  },
];

const getNoteTypeIcon = (type: string) => {
  switch (type) {
    case "private":
      return <Lock className="w-4 h-4 text-red-600" />;
    case "shared":
      return <Users className="w-4 h-4 text-blue-600" />;
    case "client_visible":
      return <Eye className="w-4 h-4 text-green-600" />;
    default:
      return null;
  }
};

const getNoteTypeLabel = (type: string) => {
  switch (type) {
    case "private":
      return "Private";
    case "shared":
      return "Shared";
    case "client_visible":
      return "Client Visible";
    default:
      return type;
  }
};

const getNoteTypeColor = (type: string) => {
  switch (type) {
    case "private":
      return "bg-red-100 text-red-700";
    case "shared":
      return "bg-blue-100 text-blue-700";
    case "client_visible":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

interface NotesSectionProps {
  clientId: number;
}

export default function NotesSection({ clientId }: NotesSectionProps) {
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "", type: "shared" as const });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Notes</h3>
          <p className="text-xs text-gray-500 mt-1">Private, shared, and client-visible notes</p>
        </div>
        <Button size="sm" variant="outline" onClick={() => setShowAddNote(!showAddNote)}>
          <Plus className="w-4 h-4 mr-1" />Add Note
        </Button>
      </div>

      {/* Add Note Form */}
      {showAddNote && (
        <Card className="border-0 shadow-sm bg-blue-50 border border-blue-200">
          <CardContent className="p-4 space-y-3">
            <input
              type="text"
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <Textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="min-h-24"
            />
            <select
              value={newNote.type}
              onChange={(e) => setNewNote({ ...newNote, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="private">Private (Only you)</option>
              <option value="shared">Shared (Care team)</option>
              <option value="client_visible">Client Visible (Client can see)</option>
            </select>
            <div className="flex gap-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Save Note</Button>
              <Button size="sm" variant="outline" onClick={() => setShowAddNote(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      <div className="space-y-3">
        {DEMO_NOTES.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No notes yet</p>
            </CardContent>
          </Card>
        ) : (
          DEMO_NOTES.map(note => (
            <Card key={note.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{note.title}</h4>
                      <Badge className={getNoteTypeColor(note.type)}>
                        <div className="flex items-center gap-1">
                          {getNoteTypeIcon(note.type)}
                          {getNoteTypeLabel(note.type)}
                        </div>
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{note.author} • {note.date}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-2">{note.content}</p>

                <p className="text-xs text-gray-500">Last modified: {note.lastModified}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
