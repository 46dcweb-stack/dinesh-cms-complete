"use client";
import { ReactNode, useState } from "react";
import { X, Check, AlertCircle, ChevronDown, Upload, Trash2 } from "lucide-react";
import { mediaService } from "@/lib/firebase-services";

// ── Page Header ────────────────────────────────────────────────────────────────
export function AdminPageHeader({
  title, subtitle, action,
}: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-white/40 text-sm mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ── Form Field ─────────────────────────────────────────────────────────────────
export function Field({
  label, required, hint, children,
}: { label: string; required?: boolean; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-mono uppercase tracking-wider text-white/50">
        {label}{required && <span className="text-[#E22D2D] ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-white/30">{hint}</p>}
    </div>
  );
}

// ── Text Input ─────────────────────────────────────────────────────────────────
export function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E22D2D]/40 transition-colors placeholder:text-white/20 ${className}`}
    />
  );
}

// ── Textarea ───────────────────────────────────────────────────────────────────
export function Textarea({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E22D2D]/40 transition-colors placeholder:text-white/20 resize-y ${className}`}
    />
  );
}

// ── Select ─────────────────────────────────────────────────────────────────────
export function Select({ className = "", children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#E22D2D]/40 transition-colors appearance-none ${className}`}
      >
        {children}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
    </div>
  );
}

// ── Toggle ─────────────────────────────────────────────────────────────────────
export function Toggle({
  checked, onChange, label,
}: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-[#E22D2D]" : "bg-white/20"}`}
      >
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : ""}`} />
      </div>
      {label && <span className="text-sm text-white/70">{label}</span>}
    </label>
  );
}

// ── Save Button ────────────────────────────────────────────────────────────────
export function SaveButton({
  loading, saved, onClick, label = "Save Changes",
}: { loading?: boolean; saved?: boolean; onClick?: () => void; label?: string }) {
  return (
    <button
      type={onClick ? "button" : "submit"}
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 bg-[#E22D2D] hover:bg-[#c91f1f] disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : saved ? (
        <Check size={14} />
      ) : null}
      {loading ? "Saving..." : saved ? "Saved!" : label}
    </button>
  );
}

// ── Delete Button ──────────────────────────────────────────────────────────────
export function DeleteButton({ onClick, label = "Delete" }: { onClick: () => void; label?: string }) {
  const [confirm, setConfirm] = useState(false);
  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/50">Are you sure?</span>
        <button onClick={onClick} className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1.5 rounded-lg">
          Yes, Delete
        </button>
        <button onClick={() => setConfirm(false)} className="text-xs text-white/40 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg">
          Cancel
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={() => setConfirm(true)}
      className="flex items-center gap-2 text-sm text-white/40 hover:text-red-400 border border-white/10 hover:border-red-400/30 px-4 py-2.5 rounded-lg transition-colors"
    >
      <Trash2 size={14} /> {label}
    </button>
  );
}

// ── Status Badge ───────────────────────────────────────────────────────────────
export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    published: "bg-green-400/15 text-green-400 border-green-400/20",
    draft: "bg-white/10 text-white/50 border-white/10",
    archived: "bg-orange-400/15 text-orange-400 border-orange-400/20",
    active: "bg-green-400/15 text-green-400 border-green-400/20",
    new: "bg-blue-400/15 text-blue-400 border-blue-400/20",
    unsubscribed: "bg-red-400/15 text-red-400 border-red-400/20",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border font-mono ${colors[status] ?? "bg-white/5 text-white/40 border-white/10"}`}>
      {status}
    </span>
  );
}

// ── Alert ──────────────────────────────────────────────────────────────────────
export function Alert({ message, type = "error", className = "" }: { message: string; type?: "error" | "success"; className?: string }) {
  const styles = type === "error"
    ? "bg-red-400/10 border-red-400/20 text-red-400"
    : "bg-green-400/10 border-green-400/20 text-green-400";
  const Icon = type === "error" ? AlertCircle : Check;
  return (
    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm ${styles}`}>
      <Icon size={14} /> {message}
    </div>
  );
}

// ── Image Upload ───────────────────────────────────────────────────────────────
export function ImageUpload({
  value, onChange, folder = "images",
}: { value: string; onChange: (url: string) => void; folder?: string }) {
  const [uploading, setUploading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<{url: string; name: string; fullPath: string}[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await mediaService.upload(file, folder);
      onChange(url);
    } catch (err) { console.error(err); }
    setUploading(false);
  }

  async function openPicker() {
    setShowPicker(true);
    setLoadingMedia(true);
    try {
      const { ref, listAll, getDownloadURL } = await import("firebase/storage");
      const { storage } = await import("@/lib/firebase");
      const folders = ["blog","gallery","press","about","ventures","manifesto","misc","hero","images"];
      const all: {url: string; name: string; fullPath: string}[] = [];
      await Promise.all(folders.map(async (f) => {
        try {
          const list = await listAll(ref(storage, f));
          await Promise.all(list.items.map(async (item) => {
            try { const url = await getDownloadURL(item); all.push({ url, name: item.name, fullPath: item.fullPath }); } catch {}
          }));
        } catch {}
      }));
      setMediaFiles(all);
    } catch(e) { console.error(e); }
    setLoadingMedia(false);
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="relative rounded-lg overflow-hidden border border-white/10">
          <img src={value} alt="preview" className="w-full h-40 object-cover" />
          <button type="button" onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/80 rounded-full p-1 transition-colors">
            <X size={12} className="text-white" />
          </button>
        </div>
      )}
      <div className="flex gap-2">
        <label className="flex-1 flex items-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 border-dashed rounded-lg px-4 py-3 text-sm text-white/40 hover:text-white/70 transition-colors">
          <Upload size={14} />
          {uploading ? "Uploading..." : value ? "Replace" : "Upload"}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
        <button type="button" onClick={openPicker}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-sm text-white/40 hover:text-white/70 transition-colors whitespace-nowrap">
          📁 Library
        </button>
      </div>
      <Input placeholder="or paste image URL..." value={value} onChange={e => onChange(e.target.value)} />

      {/* Media Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowPicker(false)}>
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <span className="text-white font-medium text-sm">Media Library — Pick an Image</span>
              <button onClick={() => setShowPicker(false)} className="text-white/40 hover:text-white transition-colors"><X size={16} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loadingMedia ? (
                <div className="flex items-center justify-center h-40 text-white/30 text-sm">Loading media...</div>
              ) : mediaFiles.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-white/30 text-sm">No images in library yet. Upload via Media Library.</div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {mediaFiles.map((file) => (
                    <button key={file.fullPath} type="button"
                      onClick={() => { onChange(file.url); setShowPicker(false); }}
                      className="aspect-square rounded-lg overflow-hidden border border-white/10 hover:border-brand-primary transition-colors group">
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}

// ── Tags Input ─────────────────────────────────────────────────────────────────
export function TagsInput({
  value, onChange, placeholder = "Add tag, press Enter",
}: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState("");

  function add() {
    const tag = input.trim();
    if (tag && !value.includes(tag)) onChange([...value, tag]);
    setInput("");
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map(tag => (
          <span key={tag} className="flex items-center gap-1.5 text-xs bg-white/10 text-white/70 px-2.5 py-1 rounded-full">
            {tag}
            <button type="button" onClick={() => onChange(value.filter(t => t !== tag))}>
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
        />
        <button type="button" onClick={add}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors whitespace-nowrap"
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ── Section Title ──────────────────────────────────────────────────────────────
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-xs font-mono uppercase tracking-widest text-white/40 mb-4 pb-3 border-b border-white/5">
      {children}
    </h3>
  );
}
