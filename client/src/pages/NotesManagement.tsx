import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Lock, Users, Eye, Plus, Trash2, Edit2, Share2 } from "lucide-react";

interface Note {
  id: number;
  title: string;
  content: string;
  type: "private" | "shared" | "client_visible";
  author: string;
  authorRole: string;
  date: string;
  lastModified: string;
  tags: string[];
  category: string;
}

const DEMO_NOTES: Note[] = [
  {
    id: 1,
    title: "Progress Update - Employment",
    content: "Client completed job training program and has 3 interviews scheduled for next week. Showing great motivation and commitment.",
    type: "shared",
    author: "Sarah Johnson",
    authorRole: "ECM",
    date: "2026-07-03",
    lastModified: "2026-07-03",
    tags: ["employment", "progress"],
    category: "Employment",
  },
  {
    id: 2,
    title: "Mental Health Assessment",
    content: "Client reports decreased anxiety symptoms. Continuing current medication regimen. Recommend continued therapy sessions.",
    type: "private",
    author: "Dr. Michael Chen",
    authorRole: "Counselor",
    date: "2026-07-01",
    lastModified: "2026-07-01",
    tags: ["mental-health", "assessment"],
    category: "Mental Health",
  },
  {
    id: 3,
    title: "Housing Update",
    content: "Lease signed for new apartment. Move-in date is July 15. Client is excited and stable.",
    type: "client_visible",
    author: "Jennifer Martinez",
    authorRole: "Housing",
    date: "2026-06-28",
    lastModified: "2026-06-28",
    tags: ["housing", "update"],
    category: "Housing",
  },
];

const NOTE_CATEGORIES = [
  "General",
  "Employment",
  "Mental Health",
  "Housing",
  "Recovery",
  "Medical",
  "Legal",
  "Family",
  "Court/Probation",
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

interface NotesManagementProps {
  clientId: number;
}

export default function NotesManagement({ clientId }: NotesManagementProps) {
  const [notes, setNotes] = useState<Note[]>(DEMO_NOTES);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    type: "shared" as const,
    category: "General",
    tags: "",
  });

  const handleAddNote = () => {
    if (newNote.title && newNote.content) {
      const note: Note = {
        id: Math.max(...notes.map(n => n.id), 0) + 1,
        title: newNote.title,
        content: newNote.content,
        type: newNote.type,
        author: "You",
        authorRole: "Provider",
        date: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString().split('T')[0],
        tags: newNote.tags.split(",").map(t => t.trim()).filter(t => t),
        category: newNote.category,
      };
      setNotes([note, ...notes]);
      setNewNote({ title: "", content: "", type: "shared", category: "General", tags: "" });
      setShowAddDialog(false);
    }
  };

  const handleDeleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const filteredNotes = selectedCategory === "All" 
    ? notes 
    : notes.filter(n => n.category === selectedCategory);

  const stats = {
    total: notes.length,
    private: notes.filter(n => n.type === "private").length,
    shared: notes.filter(n => n.type === "shared").length,
    clientVisible: notes.filter(n => n.type === "client_visible").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notes Management</h2>
          <p className="text-gray-600 mt-1">Create and manage private, shared, and client-visible notes</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" />New Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
              <DialogDescription>Add a new note for this client</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Note Title</label>
                <input
                  type="text"
                  placeholder="e.g., Progress Update - Employment"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                  <select
                    value={newNote.category}
                    onChange={(e) => setNewNote({ ...newNote, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {NOTE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Visibility</label>
                  <select
                    value={newNote.type}
                    onChange={(e) => setNewNote({ ...newNote, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="private">Private (Only you)</option>
                    <option value="shared">Shared (Care team)</option>
                    <option value="client_visible">Client Visible (Client can see)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Note Content</label>
                <Textarea
                  placeholder="Write your note here..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="min-h-32"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tags (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g., employment, progress, update"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddNote} className="bg-teal-600 hover:bg-teal-700 text-white flex-1">
                  Create Note
                </Button>
                <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            <p className="text-xs text-gray-600 mt-1">Total Notes</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-red-600">{stats.private}</p>
            <p className="text-xs text-gray-600 mt-1">Private</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-blue-600">{stats.shared}</p>
            <p className="text-xs text-gray-600 mt-1">Shared</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-600">{stats.clientVisible}</p>
            <p className="text-xs text-gray-600 mt-1">Client Visible</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === "All" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory("All")}
          className={selectedCategory === "All" ? "bg-teal-600 text-white" : ""}
        >
          All
        </Button>
        {NOTE_CATEGORIES.map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? "bg-teal-600 text-white" : ""}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {filteredNotes.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-600">No notes in this category</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotes.map(note => (
            <Card key={note.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{note.title}</h3>
                      <Badge className={getNoteTypeColor(note.type)}>
                        <div className="flex items-center gap-1">
                          {getNoteTypeIcon(note.type)}
                          {getNoteTypeLabel(note.type)}
                        </div>
                      </Badge>
                      <Badge variant="outline" className="bg-gray-50">{note.category}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{note.author} ({note.authorRole}) • {note.date}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8">
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{note.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs bg-gray-50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Modified: {note.lastModified}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
