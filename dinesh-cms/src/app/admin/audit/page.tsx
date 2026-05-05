"use client";
import { useEffect, useState } from "react";
import { auditService } from "@/lib/firebase-services";
import type { AuditLog } from "@/lib/types";
import { AdminPageHeader } from "../components/ui";
import { formatDistanceToNow } from "date-fns";
import { Shield } from "lucide-react";

const ACTION_STYLES: Record<string, string> = {
  create: "bg-green-400/15 text-green-400 border-green-400/20",
  update: "bg-blue-400/15 text-blue-400 border-blue-400/20",
  delete: "bg-red-400/15 text-red-400 border-red-400/20",
  publish: "bg-purple-400/15 text-purple-400 border-purple-400/20",
  unpublish: "bg-orange-400/15 text-orange-400 border-orange-400/20",
};

export default function AuditAdmin() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setLogs(await auditService.getRecent(100));
    setLoading(false);
  }

  const filtered = filter === "all" ? logs : logs.filter(l => l.action === filter);

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Audit Log"
        subtitle="Track all content changes — immutable record"
      />

      <div className="flex items-center gap-3 mb-6">
        {["all", "create", "update", "delete", "publish", "unpublish"].map(a => (
          <button key={a} onClick={() => setFilter(a)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter === a ? "bg-white/15 text-white border-white/20" : "text-white/40 border-white/10 hover:text-white"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-white/30 text-sm">Loading audit logs...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <Shield size={32} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No audit logs yet.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-6 py-3.5 text-xs font-mono uppercase tracking-wider text-white/40">Action</th>
                <th className="text-left px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-white/40">Summary</th>
                <th className="text-left px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-white/40">Collection</th>
                <th className="text-left px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-white/40">User</th>
                <th className="text-left px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-white/40">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-6 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-mono ${ACTION_STYLES[log.action] ?? "bg-white/5 text-white/40 border-white/10"}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-sm text-white/80">{log.summary}</div>
                    {log.fieldChanged && (
                      <div className="text-xs text-white/30 mt-0.5 font-mono">fields: {log.fieldChanged}</div>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded">{log.collection}</span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-white/40 max-w-[160px] truncate">
                    {log.userEmail}
                  </td>
                  <td className="px-4 py-3.5 text-xs text-white/30 whitespace-nowrap">
                    {log.createdAt ? formatDistanceToNow((log.createdAt as any).toDate(), { addSuffix: true }) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {!loading && <p className="text-xs text-white/20 mt-3">Showing last {filtered.length} entries. Audit logs are immutable.</p>}
    </div>
  );
}
