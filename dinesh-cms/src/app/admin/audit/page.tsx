"use client";
import { useEffect, useState } from "react";
import { auditService } from "@/lib/firebase-services";
import type { AuditLog } from "@/lib/types";
import { AdminPageHeader } from "../components/ui";
import { format } from "date-fns";
import { Shield, RotateCcw, Check, AlertCircle, Info } from "lucide-react";

const ACTION_STYLES: Record<string, string> = {
  create:    "bg-green-400/15 text-green-400 border-green-400/20",
  update:    "bg-blue-400/15 text-blue-400 border-blue-400/20",
  delete:    "bg-red-400/15 text-red-400 border-red-400/20",
  publish:   "bg-purple-400/15 text-purple-400 border-purple-400/20",
  unpublish: "bg-orange-400/15 text-orange-400 border-orange-400/20",
};

export default function AuditAdmin() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [reverting, setReverting] = useState<string | null>(null);
  const [revertStatus, setRevertStatus] = useState<Record<string, "success" | "error" | "no-snapshot">>({});

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    setLogs(await auditService.getRecent(100));
    setLoading(false);
  }

  async function handleRevert(log: any) {
    // Check snapshot exists
    if (!log.previousData || Object.keys(log.previousData).length === 0) {
      setRevertStatus(s => ({ ...s, [log.id]: "no-snapshot" }));
      setTimeout(() => setRevertStatus(s => {
        const n = { ...s }; delete n[log.id]; return n;
      }), 3000);
      return;
    }

    const confirmed = confirm(
      `Revert this change?\n\n"${log.summary}"\n\nThe document will be restored to its state before this action was made. This revert will also be logged.`
    );
    if (!confirmed) return;

    setReverting(log.id);
    try {
      await auditService.revert(log);
      setRevertStatus(s => ({ ...s, [log.id]: "success" }));
      setTimeout(() => {
        setRevertStatus(s => { const n = { ...s }; delete n[log.id]; return n; });
        load(); // refresh list — revert itself appears as new log entry
      }, 2000);
    } catch (e: any) {
      setRevertStatus(s => ({ ...s, [log.id]: "error" }));
      alert(`Revert failed:\n${e.message}`);
      setTimeout(() => setRevertStatus(s => {
        const n = { ...s }; delete n[log.id]; return n;
      }), 3000);
    } finally {
      setReverting(null);
    }
  }

  const filtered = filter === "all" ? logs : logs.filter(l => l.action === filter);

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Audit Log"
        subtitle="Full history of all content changes with revert support"
      />

      {/* Info banner */}
      <div className="flex items-start gap-2.5 bg-blue-400/5 border border-blue-400/15 rounded-xl px-4 py-3 mb-5">
        <Info size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-white/50 leading-relaxed">
          <strong className="text-white/70">Revert</strong> is available on{" "}
          <span className="text-blue-400">update</span> actions that have a saved snapshot (↩ button is active).
          Clicking revert restores that document to its previous state and logs the revert.
          Entries without a snapshot were made before revert support was added — they cannot be reverted.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {["all", "create", "update", "delete", "publish", "unpublish"].map(a => (
          <button key={a} onClick={() => setFilter(a)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter === a
                ? "bg-white/15 text-white border-white/20"
                : "text-white/40 border-white/10 hover:text-white"
            }`}
          >
            {a} {a === "all" ? `(${logs.length})` : `(${logs.filter(l => l.action === a).length})`}
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
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-white/40">Action</th>
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-white/40">Summary</th>
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-white/40">Collection</th>
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-white/40">User</th>
                <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-wider text-white/40">Time</th>
                <th className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-white/40 text-center">Revert</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => {
                const hasSnapshot = log.previousData && Object.keys(log.previousData).length > 0;
                const status = revertStatus[log.id];
                const isReverting = reverting === log.id;

                return (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    {/* Action badge */}
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-mono whitespace-nowrap ${
                        ACTION_STYLES[log.action] ?? "bg-white/5 text-white/40 border-white/10"
                      }`}>
                        {log.action}
                      </span>
                    </td>

                    {/* Summary */}
                    <td className="px-4 py-3 max-w-[200px]">
                      <div className="text-sm text-white/80 truncate">{log.summary}</div>
                      {log.fieldChanged && log.fieldChanged !== "revert" && (
                        <div className="text-xs text-white/30 mt-0.5 font-mono truncate">
                          fields: {log.fieldChanged}
                        </div>
                      )}
                      {log.fieldChanged === "revert" && (
                        <div className="text-xs text-orange-400/70 mt-0.5 font-mono">↩ revert action</div>
                      )}
                    </td>

                    {/* Collection */}
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-white/40 bg-white/5 px-2 py-1 rounded">
                        {log.collection}
                      </span>
                    </td>

                    {/* User */}
                    <td className="px-4 py-3 text-xs text-white/40 max-w-[140px] truncate">
                      {log.userEmail}
                    </td>

                    {/* Time */}
                    <td className="px-4 py-3 text-xs text-white/30 whitespace-nowrap">
                      {log.createdAt
                        ? format((log.createdAt as any).toDate(), "dd MMM yy HH:mm")
                        : "—"}
                    </td>

                    {/* Revert button */}
                    <td className="px-4 py-3 text-center">
                      {(log.action === "update" || log.action === "publish" || log.action === "unpublish") && log.fieldChanged !== "revert" ? (
                        status === "success" ? (
                          <div className="flex items-center justify-center gap-1">
                            <Check size={14} className="text-green-400" />
                            <span className="text-xs text-green-400">Done</span>
                          </div>
                        ) : status === "error" ? (
                          <AlertCircle size={14} className="text-red-400 mx-auto" />
                        ) : status === "no-snapshot" ? (
                          <span className="text-xs text-white/30">No snapshot</span>
                        ) : (
                          <button
                            onClick={() => handleRevert(log)}
                            disabled={isReverting}
                            title={
                              hasSnapshot
                                ? "Click to revert this document to its state before this change"
                                : "No snapshot available — cannot revert this entry"
                            }
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                              hasSnapshot
                                ? "text-orange-400 bg-orange-400/10 hover:bg-orange-400/20 border border-orange-400/20 cursor-pointer"
                                : "text-white/20 cursor-not-allowed"
                            }`}
                          >
                            {isReverting ? (
                              <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <RotateCcw size={12} />
                            )}
                            {hasSnapshot ? "Revert" : "—"}
                          </button>
                        )
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {!loading && (
        <p className="text-xs text-white/20 mt-3">
          Showing last {filtered.length} of {logs.length} entries ·
          Audit logs are immutable · Reverts are themselves logged
        </p>
      )}
    </div>
  );
}