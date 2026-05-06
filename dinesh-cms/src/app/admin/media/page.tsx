"use client";
import { useEffect, useState, useRef } from "react";
import { ref, listAll, getDownloadURL, uploadBytes, deleteObject, getMetadata } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { AdminPageHeader } from "../components/ui";
import { Upload, Trash2, Copy, Check, FolderOpen, Image, FileText, Search, X } from "lucide-react";

const FOLDERS = ["all", "blog", "gallery", "press", "about", "ventures", "manifesto", "misc"];

interface MediaFile {
  name: string;
  fullPath: string;
  url: string;
  folder: string;
  size?: number;
  contentType?: string;
  timeCreated?: string;
}

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [filtered, setFiltered] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState("all");
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadFolder, setUploadFolder] = useState("misc");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [selected, setSelected] = useState<MediaFile | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadAll(); }, []);

  useEffect(() => {
    let f = files;
    if (folder !== "all") f = f.filter(file => file.folder === folder);
    if (search) f = f.filter(file => file.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(f);
  }, [files, folder, search]);

  async function loadAll() {
    setLoading(true);
    try {
      const allFiles: MediaFile[] = [];
      const folders = FOLDERS.filter(f => f !== "all");
      await Promise.all(
        folders.map(async (folderName) => {
          try {
            const folderRef = ref(storage, folderName);
            const list = await listAll(folderRef);
            await Promise.all(
              list.items.map(async (item) => {
                try {
                  const [url, meta] = await Promise.all([
                    getDownloadURL(item),
                    getMetadata(item).catch(() => null),
                  ]);
                  allFiles.push({
                    name: item.name,
                    fullPath: item.fullPath,
                    url,
                    folder: folderName,
                    size: meta?.size,
                    contentType: meta?.contentType,
                    timeCreated: meta?.timeCreated,
                  });
                } catch {}
              })
            );
          } catch {}
        })
      );
      // Also check root
      try {
        const rootRef = ref(storage);
        const rootList = await listAll(rootRef);
        await Promise.all(
          rootList.items.map(async (item) => {
            try {
              const url = await getDownloadURL(item);
              allFiles.push({ name: item.name, fullPath: item.fullPath, url, folder: "misc" });
            } catch {}
          })
        );
      } catch {}
      allFiles.sort((a, b) => (b.timeCreated || "").localeCompare(a.timeCreated || ""));
      setFiles(allFiles);
    } catch (err) {
      console.error("Media library load error:", err);
    }
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const uploadFiles = e.target.files;
    if (!uploadFiles || uploadFiles.length === 0) return;
    setUploading(true);
    try {
      await Promise.all(
        Array.from(uploadFiles).map(async (file) => {
          const timestamp = Date.now();
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const storageRef = ref(storage, `${uploadFolder}/${timestamp}_${safeName}`);
          await uploadBytes(storageRef, file);
        })
      );
      await loadAll();
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleDelete(file: MediaFile) {
    if (!confirm(`Delete "${file.name}"? This cannot be undone.`)) return;
    setDeleting(file.fullPath);
    try {
      await deleteObject(ref(storage, file.fullPath));
      setFiles(prev => prev.filter(f => f.fullPath !== file.fullPath));
      if (selected?.fullPath === file.fullPath) setSelected(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
    setDeleting(null);
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  }

  function formatSize(bytes?: number) {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const isImage = (file: MediaFile) =>
    file.contentType?.startsWith("image/") ||
    /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);

  return (
    <div className="p-8 h-full">
      <AdminPageHeader
        title="Media Library"
        subtitle={`${files.length} files across all folders`}
        action={
          <div className="flex items-center gap-3">
            <select
              value={uploadFolder}
              onChange={e => setUploadFolder(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
            >
              {FOLDERS.filter(f => f !== "all").map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 bg-[#E22D2D] hover:bg-[#c91f1f] disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              <Upload size={14} />
              {uploading ? "Uploading..." : "Upload Files"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf,.svg"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        }
      />

      {/* Folder tabs + search */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-1 flex-wrap">
          {FOLDERS.map(f => (
            <button
              key={f}
              onClick={() => setFolder(f)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
                folder === f
                  ? "bg-white/15 text-white border-white/20"
                  : "text-white/40 border-white/10 hover:text-white"
              }`}
            >
              {f} {f === "all" ? `(${files.length})` : `(${files.filter(x => x.folder === f).length})`}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search files..."
            className="bg-white/5 border border-white/10 rounded-lg pl-8 pr-4 py-2 text-white text-sm focus:outline-none w-52"
          />
        </div>
      </div>

      <div className="flex gap-6 h-[calc(100vh-280px)]">
        {/* Grid */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-40 text-white/30 text-sm">Loading media...</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-white/30">
              <FolderOpen size={32} className="mb-3 opacity-40" />
              <p className="text-sm">No files found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map((file) => (
                <div
                  key={file.fullPath}
                  onClick={() => setSelected(file)}
                  className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all ${
                    selected?.fullPath === file.fullPath
                      ? "border-[#E22D2D] ring-1 ring-[#E22D2D]/30"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <div className="aspect-square bg-white/5 flex items-center justify-center overflow-hidden">
                    {isImage(file) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <FileText size={28} className="text-white/20" />
                    )}
                  </div>
                  <div className="px-2 py-1.5 bg-black/60">
                    <p className="text-xs text-white/60 truncate">{file.name}</p>
                    <p className="text-xs text-white/30">{formatSize(file.size)}</p>
                  </div>
                  {/* Quick actions */}
                  <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={e => { e.stopPropagation(); copyUrl(file.url); }}
                      className="w-6 h-6 rounded bg-black/80 flex items-center justify-center text-white hover:text-green-400 transition-colors"
                      title="Copy URL"
                    >
                      {copiedUrl === file.url ? <Check size={11} /> : <Copy size={11} />}
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(file); }}
                      disabled={deleting === file.fullPath}
                      className="w-6 h-6 rounded bg-black/80 flex items-center justify-center text-white hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selected && (
          <div className="w-72 flex-shrink-0 bg-white/3 border border-white/10 rounded-2xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-white/40">Details</span>
              <button onClick={() => setSelected(null)} className="text-white/30 hover:text-white transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="aspect-video bg-white/5 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
              {isImage(selected) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={selected.url} alt={selected.name} className="max-w-full max-h-full object-contain" />
              ) : (
                <FileText size={40} className="text-white/20" />
              )}
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-white/40 text-xs mb-0.5">Filename</p>
                <p className="text-white break-all text-xs">{selected.name}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-0.5">Folder</p>
                <p className="text-white capitalize">{selected.folder}</p>
              </div>
              {selected.size && (
                <div>
                  <p className="text-white/40 text-xs mb-0.5">Size</p>
                  <p className="text-white">{formatSize(selected.size)}</p>
                </div>
              )}
              {selected.contentType && (
                <div>
                  <p className="text-white/40 text-xs mb-0.5">Type</p>
                  <p className="text-white text-xs">{selected.contentType}</p>
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-white/40 text-xs mb-1">URL</p>
              <div className="bg-white/5 rounded-lg p-2 break-all text-xs text-white/50 font-mono max-h-16 overflow-y-auto">
                {selected.url}
              </div>
              <button
                onClick={() => copyUrl(selected.url)}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-colors ${
                  copiedUrl === selected.url
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-[#E22D2D]/20 text-[#E22D2D] border border-[#E22D2D]/30 hover:bg-[#E22D2D]/30"
                }`}
              >
                {copiedUrl === selected.url ? <Check size={14} /> : <Copy size={14} />}
                {copiedUrl === selected.url ? "Copied!" : "Copy URL"}
              </button>
              <button
                onClick={() => handleDelete(selected)}
                disabled={deleting === selected.fullPath}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm text-red-400 border border-red-400/20 hover:bg-red-400/10 transition-colors disabled:opacity-50"
              >
                <Trash2 size={14} />
                Delete File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
