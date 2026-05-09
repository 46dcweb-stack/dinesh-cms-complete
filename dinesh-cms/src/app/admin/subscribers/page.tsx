"use client";
import { useEffect, useState } from "react";
import { subscriberService } from "@/lib/firebase-services";
import type { Subscriber } from "@/lib/types";
import { AdminPageHeader, StatusBadge } from "../components/ui";
import { Download, UserX } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function SubscribersAdmin() {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setSubs(await subscriberService.getAll());
    setLoading(false);
  }

  async function handleUnsubscribe(id: string) {
    await subscriberService.unsubscribe(id);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Permanently delete this subscriber?")) return;
    await subscriberService.delete(id);
    load();
  }

  function exportCSV() {
    const rows = [
      ["Email", "Name", "Source", "Status", "Subscribed At"],
      ...filtered.map(s => [
        s.email, s.name || "", s.source, s.status,
        s.createdAt ? new Date((s.createdAt as any).seconds * 1000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : "",
      ]),
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers_${Date.now()}.csv`;
    a.click();
  }

  const filtered = filter === "all" ? subs : subs.filter(s => s.status === filter);
  const activeCount = subs.filter(s => s.status === "active").length;

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Subscribers"
        subtitle={`${activeCount} active subscribers`}
        action={
          <button onClick={exportCSV}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-sm px-4 py-2.5 rounded-lg transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>
        }
      />

      <div className="flex items-center gap-3 mb-6">
        {["all", "active", "unsubscribed"].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter === s ? "bg-white/15 text-white border-white/20" : "text-white/40 border-white/10 hover:text-white"
            }`}
          >
            {s} {s === "all" ? `(${subs.length})` : s === "active" ? `(${activeCount})` : `(${subs.length - activeCount})`}
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-white/30 text-sm">Loading subscribers...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-white/30 text-sm">No subscribers yet.</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-3.5 text-xs font-mono uppercase tracking-wider text-white/40">Email</th>
                <th className="text-left px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-white/40">Name</th>
                <th className="text-left px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-white/40">Source</th>
                <th className="text-left px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-white/40">Status</th>
                <th className="text-left px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-white/40">Joined</th>
                <th className="text-left px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-white/40">Consent</th>
                <th className="px-4 py-3.5"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sub => (
                <tr key={sub.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-6 py-3.5 text-sm text-white">{sub.email}</td>
                  <td className="px-4 py-3.5 text-sm text-white/50">{sub.name || "—"}</td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs bg-white/5 text-white/40 px-2 py-0.5 rounded-full">{sub.source}</span>
                  </td>
                  <td className="px-4 py-3.5"><StatusBadge status={sub.status} /></td>
                  <td className="px-4 py-3.5 text-xs text-white/40">
                    {sub.createdAt
                      ? (() => {
                          const d = new Date((sub.createdAt as any).seconds * 1000);
                          return `${d.toLocaleDateString("en-IN")} ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
                        })()
                      : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-white/40">
                    {sub.consentTimestamp
                      ? (() => {
                          const d = new Date((sub.consentTimestamp as any).seconds * 1000);
                          return `${d.toLocaleDateString("en-IN")} ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
                        })()
                      : sub.consentGiven ? "✓ Yes" : "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      {sub.status === "active" && (
                        <button onClick={() => handleUnsubscribe(sub.id!)}
                          className="p-2 rounded-lg text-white/30 hover:text-orange-400 hover:bg-orange-400/10 transition-colors"
                          title="Unsubscribe"
                        >
                          <UserX size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
