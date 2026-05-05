"use client";
import { useEffect, useState } from "react";
import { contactService } from "@/lib/firebase-services";
import type { ContactSubmission } from "@/lib/types";
import { AdminPageHeader, StatusBadge } from "../components/ui";
import { Mail, Trash2, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ContactsAdmin() {
  const [items, setItems] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setItems(await contactService.getAll());
    setLoading(false);
  }

  async function markRead(id: string) {
    await contactService.updateStatus(id, "read");
    load();
  }

  async function markReplied(id: string) {
    await contactService.updateStatus(id, "replied");
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this message?")) return;
    await contactService.delete(id);
    load();
  }

  const filtered = filter === "all" ? items : items.filter(i => i.status === filter);
  const newCount = items.filter(i => i.status === "new").length;

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Contact Inbox"
        subtitle={`${newCount} new messages`}
      />

      <div className="flex items-center gap-3 mb-6">
        {["all", "new", "read", "replied", "archived"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter === s ? "bg-white/15 text-white border-white/20" : "text-white/40 border-white/10 hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {loading ? (
          <div className="py-12 text-center text-white/30 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-white/30 text-sm">No messages.</div>
        ) : (
          filtered.map(item => (
            <div key={item.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors">
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                onClick={() => { setExpanded(expanded === item.id ? null : item.id!); if (item.status === "new") markRead(item.id!); }}
              >
                <Mail size={16} className={item.status === "new" ? "text-[#E22D2D]" : "text-white/30"} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white text-sm">{item.name}</div>
                  <div className="text-xs text-white/40 mt-0.5">{item.email} · {item.type}</div>
                </div>
                <StatusBadge status={item.status} />
                <span className="text-xs text-white/30">
                  {item.createdAt ? formatDistanceToNow((item.createdAt as any).toDate(), { addSuffix: true }) : ""}
                </span>
              </div>
              {expanded === item.id && (
                <div className="px-5 pb-5 border-t border-white/5">
                  {item.subject && <p className="text-sm text-white/70 mt-3 font-medium">{item.subject}</p>}
                  <p className="text-sm text-white/50 mt-2 whitespace-pre-wrap">{item.message}</p>
                  <div className="flex items-center gap-2 mt-4">
                    <a href={`mailto:${item.email}`}
                      className="flex items-center gap-2 text-xs bg-white/10 hover:bg-white/15 text-white px-3 py-2 rounded-lg transition-colors"
                    >
                      <Mail size={12} /> Reply via Email
                    </a>
                    <button onClick={() => markReplied(item.id!)}
                      className="flex items-center gap-2 text-xs bg-green-400/10 hover:bg-green-400/20 text-green-400 px-3 py-2 rounded-lg transition-colors"
                    >
                      <CheckCheck size={12} /> Mark Replied
                    </button>
                    <button onClick={() => handleDelete(item.id!)}
                      className="flex items-center gap-2 text-xs text-red-400/70 hover:text-red-400 px-3 py-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
