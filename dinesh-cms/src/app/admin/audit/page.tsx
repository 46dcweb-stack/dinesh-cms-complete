"use client";
import { useEffect, useState } from "react";
import { auditService } from "@/lib/firebase-services";
import type { AuditLog } from "@/lib/types";
import { AdminPageHeader } from "../components/ui";
import { formatDistanceToNow, format } from "date-fns";
import { Shield, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

const ACTION_STYLES: Record<string, string> = {
  create:   "bg-green-400/15 text-green-400 border-green-400/20",
  update:   "bg-blue-400/15 text-blue-400 border-blue-400/20",
  delete:   "bg-red-400/15 text-red-400 border-red-400/20",
  publish:  "bg-purple-400/15 text-purple-400 border-purple-400/20",
  unpublish:"bg-orange-400/15 text-orange-400 border-orange-400/20",
  revert:   "bg-yellow-400/15 text-yellow-400 border-yellow-400/20",
};

export default function AuditAdmin() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [reverting, setReverting] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setLogs(await auditService.getRecent(100));
    setLoading(false);
  }

  async function handleRevert(log: any) {
    if (!log.previousData) {
      alert("No previous state saved for this entry. Only entries created after this update support revert.");
      return;
    }
    if (!confirm(`Revert "${log.summary}"?\n\nThis will restore the ${log.collection} document to its state before this change.`)) return;
    setReverting(log.id);
    try {
      await auditService.revert(log);
      alert("Reverted successfully! The page will reflect the change on next load.");
      await load();
    } catch (e: any) {
      alert(`Revert failed: ${e.message}`);
    }
    setReverting(null);
  }

  const filtered = filter === "all" ? logs : logs.filter(l => l.action === filter);

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Audit Log"
        subtitle="Track all content changes — click Revert to restore a previous state"
      />

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {["all","create","update","delete","publish","unpublish","revert"].map(a => (
          <button key={a} onClick={() => setFilter(a)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors capitalize ${
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
                <th className="px-4 py-3.5 text-xs font-mono uppercase tracking-wider text-white/40">Revert</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log: any) => (
                <>
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-6 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-mono ${ACTION_STYLES[log.action] ?? "bg-white/5 text-white/40 border-white/10"}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-sm text-white/80">{log.summary}</div>
                      {log.fieldChanged && (
                        <div className="text-xs text-white/30 mt-0.5">Field: {log.fieldChanged}</div>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs bg-white/5 text-white/40 px-2 py-0.5 rounded-full font-mono">
                        {log.collection}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-white/40">{log.userEmail}</td>
                    <td className="px-4 py-3.5 text-xs text-white/40">
                      {log.createdAt?.seconds
                        ? formatDistanceToNow(new Date(log.createdAt.seconds * 1000), { addSuffix: true })
                        : "—"}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {log.previousData && (
                          <button
                            onClick={() => handleRevert(log)}
                            disabled={reverting === log.id}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-yellow-400 border border-yellow-400/20 hover:bg-yellow-400/10 transition-colors disabled:opacity-50"
                            title="Revert to this state"
                          >
                            <RotateCcw size={11} />
                            {reverting === log.id ? "..." : "Revert"}
                          </button>
                        )}
                        {log.previousData && (
                          <button
                            onClick={() => setExpanded(expanded === log.id ? null : log.id!)}
                            className="p-1.5 rounded-lg text-white/30 hover:text-white transition-colors"
                            title="View previous state"
                          >
                            {expanded === log.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        )}
                        {!log.previousData && (
                          <span className="text-xs text-white/20">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expanded === log.id && log.previousData && (
                    <tr className="border-b border-white/5 bg-white/2">
                      <td colSpan={6} className="px-6 py-3">
                        <p className="text-xs text-white/40 mb-2 font-mono">PREVIOUS STATE SNAPSHOT:</p>
                        <pre className="text-xs text-white/50 bg-black/30 p-3 rounded-lg overflow-x-auto max-h-40">
                          {JSON.stringify(log.previousData, null, 2)}
                        </pre>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <p className="text-xs text-white/20 mt-4">
        Showing last {filtered.length} entries. Revert is available for entries with saved previous state.
      </p>
    </div>
  );
}
