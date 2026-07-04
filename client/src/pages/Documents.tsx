import { useState, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { ArrowLeft, Upload, FileText, Trash2, Eye, Shield, ShieldOff, Download } from "lucide-react";
import { toast } from "sonner";

const DOC_TYPES = [
  { value: "government_id", label: "Government ID" },
  { value: "insurance_card", label: "Insurance Card" },
  { value: "court_document", label: "Court Document" },
  { value: "consent_form", label: "Consent Form" },
  { value: "recovery_plan", label: "Recovery Plan" },
  { value: "medical_record", label: "Medical Record" },
  { value: "employment_doc", label: "Employment Document" },
  { value: "housing_doc", label: "Housing Document" },
  { value: "probation_doc", label: "Probation Document" },
  { value: "other", label: "Other" },
] as const;

const DOC_TYPE_COLORS: Record<string, string> = {
  government_id: "bg-blue-100 text-blue-800",
  insurance_card: "bg-green-100 text-green-800",
  court_document: "bg-red-100 text-red-800",
  consent_form: "bg-purple-100 text-purple-800",
  recovery_plan: "bg-teal-100 text-teal-800",
  medical_record: "bg-orange-100 text-orange-800",
  employment_doc: "bg-yellow-100 text-yellow-800",
  housing_doc: "bg-indigo-100 text-indigo-800",
  probation_doc: "bg-pink-100 text-pink-800",
  other: "bg-gray-100 text-gray-800",
};

export default function Documents() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("other");
  const [description, setDescription] = useState("");

  const { data: docs = [], refetch } = trpc.documents.list.useQuery(undefined, { enabled: isAuthenticated });

  const uploadMutation = trpc.documents.upload.useMutation({
    onSuccess: () => { refetch(); toast.success("Document uploaded successfully"); setDescription(""); },
    onError: (e) => toast.error(e.message),
  });

  const deleteMutation = trpc.documents.delete.useMutation({
    onSuccess: () => { refetch(); toast.success("Document deleted"); },
    onError: (e) => toast.error(e.message),
  });

  const sharingMutation = trpc.documents.updateSharing.useMutation({
    onSuccess: () => { refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("File must be under 10MB"); return; }
    setUploading(true);
    try {
      // Upload to S3 via the storage endpoint
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/storage/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const { key, url } = await res.json();
      await uploadMutation.mutateAsync({
        fileName: file.name,
        fileKey: key,
        fileUrl: url,
        fileSize: file.size,
        mimeType: file.type,
        documentType: selectedType as any,
        description: description || undefined,
        isSharedWithProviders: false,
      });
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Please sign in to view documents.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-lg">My Documents</h1>
            <p className="text-xs text-muted-foreground">Secure document storage — encrypted and private</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        {/* Upload card */}
        <div className="bg-white rounded-xl border p-4 space-y-3">
          <h2 className="font-semibold text-sm">Upload Document</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Document Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>{DOC_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Description (optional)</label>
              <input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g., CA Driver's License"
                className="w-full h-9 border rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt" />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full bg-teal-600 hover:bg-teal-700 text-white gap-2">
            <Upload className="w-4 h-4" />
            {uploading ? "Uploading..." : "Choose File to Upload"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">Supported: PDF, JPG, PNG, DOC, DOCX, TXT · Max 10MB</p>
        </div>

        {/* Privacy notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2">
          <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800">Your documents are encrypted and stored securely. They are <strong>not shared</strong> with providers unless you explicitly enable sharing for each document.</p>
        </div>

        {/* Document list */}
        <div>
          <h2 className="font-semibold text-sm mb-2">Your Documents ({docs.length})</h2>
          {docs.length === 0 ? (
            <div className="bg-white rounded-xl border p-8 text-center">
              <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Upload IDs, insurance cards, court documents, and more.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {docs.map((doc: any) => (
                <div key={doc.id} className="bg-white rounded-xl border p-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{doc.fileName}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${DOC_TYPE_COLORS[doc.documentType] || DOC_TYPE_COLORS.other}`}>
                          {DOC_TYPES.find(t => t.value === doc.documentType)?.label || doc.documentType}
                        </span>
                        {doc.fileSize && <span className="text-xs text-muted-foreground">{formatSize(doc.fileSize)}</span>}
                        <span className="text-xs text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                      {doc.description && <p className="text-xs text-muted-foreground mt-0.5">{doc.description}</p>}
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="w-4 h-4" /></Button>
                      </a>
                      <Button variant="ghost" size="icon" className="h-8 w-8"
                        onClick={() => sharingMutation.mutate({ id: doc.id, isSharedWithProviders: !doc.isSharedWithProviders })}
                        title={doc.isSharedWithProviders ? "Shared with providers — click to make private" : "Private — click to share with providers"}>
                        {doc.isSharedWithProviders ? <Shield className="w-4 h-4 text-teal-600" /> : <ShieldOff className="w-4 h-4 text-gray-400" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => deleteMutation.mutate({ id: doc.id })}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {doc.isSharedWithProviders && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-teal-700 bg-teal-50 rounded-lg px-2 py-1">
                      <Shield className="w-3 h-3" /> Shared with your care team
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
